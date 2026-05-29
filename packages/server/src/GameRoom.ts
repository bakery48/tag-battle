import type { Server } from 'socket.io';
import type {
  GameState, PlayerState, CardState, MonsterState, GamePhase,
} from '@tag-battle/shared';
import {
  getMonsterById, createMonsterState, resolveTurn,
  MONSTERS, FRONT_MONSTERS, REAR_MONSTERS,
  getCardsForMonster, CARDS_BY_MONSTER,
} from '@tag-battle/shared';
import { EVENTS } from './events.js';

// ── Draft config ──
const DECK_SIZE = 8;           // player picks 8 cards total
const OFFER_SIZE = 3;          // cards offered per round
const OFFER_ROUNDS = 8;        // 8 rounds of picking

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type PlayerIdx = 0 | 1;

interface MonsterPick {
  front: string;
  rear: string;
}

interface DraftState {
  pool: CardState[];           // remaining shuffled 24-card pool (after current offer removed)
  currentOffer: CardState[];   // current 3 cards shown to player
  picked: CardState[];         // selected cards (grows from 0 to 8)
  offerIndex: number;          // which offer round we're on (0-7)
}

export class GameRoom {
  id: string;
  phase: GamePhase = 'pick';
  playerSockets: [string, string];
  picks = new Map<PlayerIdx, MonsterPick>();
  draftStates = new Map<PlayerIdx, DraftState>();
  arrangeSubmissions = new Map<PlayerIdx, string[]>();
  gameState?: GameState;
  io: Server;

  constructor(id: string, socket1: string, socket2: string, io: Server) {
    this.id = id;
    this.playerSockets = [socket1, socket2];
    this.io = io;
  }

  getPlayerIdx(socketId: string): PlayerIdx | null {
    if (this.playerSockets[0] === socketId) return 0;
    if (this.playerSockets[1] === socketId) return 1;
    return null;
  }

  emitToPlayer(idx: PlayerIdx, event: string, data: unknown): void {
    this.io.to(this.playerSockets[idx]).emit(event, data);
  }

  emitToRoom(event: string, data: unknown): void {
    this.emitToPlayer(0, event, data);
    this.emitToPlayer(1, event, data);
  }

  // ── Pick phase ──
  handlePick(playerIdx: PlayerIdx, front: string, rear: string): void {
    if (this.phase !== 'pick') return;

    // FIX 8: double submission guard
    if (this.picks.has(playerIdx)) return;

    const frontMonster = getMonsterById(front);
    const rearMonster = getMonsterById(rear);
    if (!frontMonster || frontMonster.role !== 'front') {
      this.emitToPlayer(playerIdx, EVENTS.ERROR, { message: 'Invalid front monster' });
      return;
    }
    if (!rearMonster || rearMonster.role !== 'rear') {
      this.emitToPlayer(playerIdx, EVENTS.ERROR, { message: 'Invalid rear monster' });
      return;
    }

    this.picks.set(playerIdx, { front, rear });
    this.emitToPlayer(playerIdx, EVENTS.OPPONENT_READY, { message: 'Pick registered, waiting for opponent' });

    if (this.picks.size === 2) {
      this.transitionToDraft();
    }
  }

  // FIX 1: combined 24-card pool
  private transitionToDraft(): void {
    this.phase = 'draft';

    for (let pi = 0 as PlayerIdx; pi <= 1; pi++) {
      const pick = this.picks.get(pi)!;
      // Combine front monster's 12 cards + rear monster's 12 cards = 24 cards
      const combined: CardState[] = [
        ...(CARDS_BY_MONSTER[pick.front] ?? getCardsForMonster(pick.front)),
        ...(CARDS_BY_MONSTER[pick.rear] ?? getCardsForMonster(pick.rear)),
      ];
      const shuffled = shuffle(combined);

      // First 3 are the initial offer, rest stay in pool
      const currentOffer = shuffled.slice(0, OFFER_SIZE);
      const pool = shuffled.slice(OFFER_SIZE);

      const draftState: DraftState = {
        pool,
        currentOffer,
        picked: [],
        offerIndex: 0,
      };
      this.draftStates.set(pi, draftState);

      // Emit initial draft offer
      this.emitToPlayer(pi, EVENTS.DRAFT_OFFER, {
        cards: currentOffer,
        remaining: OFFER_ROUNDS,
      });
    }

    this.emitToRoom(EVENTS.PHASE_CHANGE, { phase: 'draft' });
  }

  handleDraftPick(playerIdx: PlayerIdx, cardId: string): void {
    if (this.phase !== 'draft') return;

    const ds = this.draftStates.get(playerIdx);
    if (!ds) return;

    // Validate cardId is in currentOffer (never expose pool)
    const cardInOffer = ds.currentOffer.find((c) => c.id === cardId);
    if (!cardInOffer) {
      this.emitToPlayer(playerIdx, EVENTS.ERROR, { message: 'Card not in current offer' });
      return;
    }

    // Add chosen card to picked
    ds.picked.push(cardInOffer);
    ds.offerIndex++;

    if (ds.offerIndex < OFFER_ROUNDS) {
      // Slice next 3 cards from pool
      const nextOffer = ds.pool.splice(0, OFFER_SIZE);
      ds.currentOffer = nextOffer;

      this.emitToPlayer(playerIdx, EVENTS.DRAFT_OFFER, {
        cards: nextOffer,
        remaining: OFFER_ROUNDS - ds.offerIndex,
      });
    } else {
      // All 8 picks done for this player
      ds.currentOffer = [];
      this.emitToPlayer(playerIdx, EVENTS.DRAFT_UPDATE, {
        myDeck: ds.picked,
      });
    }

    // Check if both players done drafting
    const p0done = this.isDraftDoneForPlayer(0);
    const p1done = this.isDraftDoneForPlayer(1);
    if (p0done && p1done) {
      this.transitionToArrange();
    }
  }

  private isDraftDoneForPlayer(pi: PlayerIdx): boolean {
    const ds = this.draftStates.get(pi);
    if (!ds) return false;
    return ds.offerIndex >= OFFER_ROUNDS;
  }

  private transitionToArrange(): void {
    this.phase = 'arrange';

    for (let pi = 0 as PlayerIdx; pi <= 1; pi++) {
      const ds = this.draftStates.get(pi)!;
      this.emitToPlayer(pi, EVENTS.ARRANGE_START, { deck: ds.picked });
    }

    this.emitToRoom(EVENTS.PHASE_CHANGE, { phase: 'arrange' });
  }

  handleArrangeSubmit(playerIdx: PlayerIdx, deckOrder: string[]): void {
    if (this.phase !== 'arrange') return;

    // FIX 8: double submission guard
    if (this.arrangeSubmissions.has(playerIdx)) return;

    const ds = this.draftStates.get(playerIdx)!;
    // FIX 7: validate all IDs are from player's drafted cards and no duplicates
    const deckIds = new Set(ds.picked.map((c) => c.id));
    const valid =
      deckOrder.length === DECK_SIZE &&
      new Set(deckOrder).size === DECK_SIZE &&
      deckOrder.every((id) => deckIds.has(id));

    if (!valid) {
      this.emitToPlayer(playerIdx, EVENTS.ERROR, { message: 'Invalid deck order' });
      return;
    }

    this.arrangeSubmissions.set(playerIdx, deckOrder);
    this.emitToPlayer(playerIdx, EVENTS.OPPONENT_READY, { message: 'Waiting for opponent to arrange' });

    if (this.arrangeSubmissions.size === 2) {
      this.transitionToBattle();
    }
  }

  // FIX 2: pre-compute all 8 turns and send full TurnLog[] at once
  private transitionToBattle(): void {
    this.phase = 'battle';

    const players: [PlayerState, PlayerState] = [0, 1].map((pi) => {
      const idx = pi as PlayerIdx;
      const pick = this.picks.get(idx)!;
      const frontMonster = getMonsterById(pick.front)!;
      const rearMonster = getMonsterById(pick.rear)!;
      const ds = this.draftStates.get(idx)!;
      const deckOrder = this.arrangeSubmissions.get(idx)!;
      const orderedDeck = deckOrder.map((id) => ds.picked.find((c) => c.id === id)!);

      return {
        id: this.playerSockets[idx],
        front: createMonsterState(frontMonster),
        rear: createMonsterState(rearMonster),
        deck: orderedDeck,
        currentTurn: 0,
      } satisfies PlayerState;
    }) as [PlayerState, PlayerState];

    let gameState: GameState = {
      players,
      turn: 0,
      phase: 'battle',
    };

    // Pre-compute ALL turns
    const turnLogs = [];
    const p1Deck = players[0].deck;
    const p2Deck = players[1].deck;
    const totalTurns = Math.min(p1Deck.length, p2Deck.length);

    for (let t = 0; t < totalTurns; t++) {
      if (gameState.result) break;
      const p1Card = p1Deck[t];
      const p2Card = p2Deck[t];
      const { nextState, log } = resolveTurn(gameState, p1Card, p2Card);
      turnLogs.push(log);
      gameState = nextState;
    }

    const result = gameState.result ?? 'draw';

    // Send everything at once
    this.emitToPlayer(0, EVENTS.BATTLE_RESULT, { turnLogs, result });
    this.emitToPlayer(1, EVENTS.BATTLE_RESULT, { turnLogs, result });
    this.phase = 'result';
  }

  // FIX 5: disconnect notification
  handleDisconnect(playerIdx: PlayerIdx): void {
    const oppIdx: PlayerIdx = playerIdx === 0 ? 1 : 0;
    this.emitToPlayer(oppIdx, EVENTS.OPPONENT_DISCONNECTED, { message: '相手が切断しました' });
    this.phase = 'result';
  }
}
