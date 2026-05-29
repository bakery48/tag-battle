import type { Server, Socket } from 'socket.io';
import type {
  GameState, PlayerState, CardState, MonsterState, GamePhase,
} from '@tag-battle/shared';
import {
  getMonsterById, createMonsterState, resolveTurn,
  MONSTERS, FRONT_MONSTERS, REAR_MONSTERS,
  getCardsForMonster,
} from '@tag-battle/shared';
import { EVENTS } from './events.js';

// ── Draft config ──
const DRAFT_POOL_SIZE = 8; // offer 8 cards from each monster's pool
const DECK_SIZE = 8; // each player picks 8 cards per monster (4 front + 4 rear)
const FRONT_DRAFT_PICKS = 4;
const REAR_DRAFT_PICKS = 4;

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
  frontPool: CardState[];
  rearPool: CardState[];
  frontPicks: CardState[];
  rearPicks: CardState[];
}

export class GameRoom {
  id: string;
  phase: GamePhase = 'pick';
  playerSockets: [string, string];
  picks = new Map<PlayerIdx, MonsterPick>();
  draftStates = new Map<PlayerIdx, DraftState>();
  arrangeSubmissions = new Map<PlayerIdx, string[]>();
  gameState?: GameState;
  pendingCards = new Map<PlayerIdx, CardState>();
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

  private transitionToDraft(): void {
    this.phase = 'draft';

    for (let pi = 0 as PlayerIdx; pi <= 1; pi++) {
      const pick = this.picks.get(pi)!;
      const frontCards = shuffle(getCardsForMonster(pick.front));
      const rearCards = shuffle(getCardsForMonster(pick.rear));

      const draftState: DraftState = {
        frontPool: frontCards,
        rearPool: rearCards,
        frontPicks: [],
        rearPicks: [],
      };
      this.draftStates.set(pi, draftState);

      // Send draft offer for front monster (pick front first)
      const offer = frontCards.slice(0, DRAFT_POOL_SIZE);
      this.emitToPlayer(pi, EVENTS.DRAFT_OFFER, {
        phase: 'draft',
        draftStage: 'front',
        cards: offer,
        picksRemaining: FRONT_DRAFT_PICKS,
        monsterId: pick.front,
      });
    }

    this.emitToRoom(EVENTS.PHASE_CHANGE, { phase: 'draft' });
  }

  handleDraftPick(playerIdx: PlayerIdx, cardId: string): void {
    if (this.phase !== 'draft') return;

    const ds = this.draftStates.get(playerIdx);
    if (!ds) return;

    const pick = this.picks.get(playerIdx)!;

    // Determine current stage
    const needFront = ds.frontPicks.length < FRONT_DRAFT_PICKS;
    const pool = needFront ? ds.frontPool : ds.rearPool;
    const picksArr = needFront ? ds.frontPicks : ds.rearPicks;

    const cardIdx = pool.findIndex((c) => c.id === cardId);
    if (cardIdx === -1) {
      this.emitToPlayer(playerIdx, EVENTS.ERROR, { message: 'Card not in current pool' });
      return;
    }

    const [card] = pool.splice(cardIdx, 1);
    picksArr.push(card);

    // Send updated offer or transition stages
    if (needFront && ds.frontPicks.length < FRONT_DRAFT_PICKS) {
      const offer = ds.frontPool.slice(0, DRAFT_POOL_SIZE);
      this.emitToPlayer(playerIdx, EVENTS.DRAFT_OFFER, {
        draftStage: 'front',
        cards: offer,
        picksRemaining: FRONT_DRAFT_PICKS - ds.frontPicks.length,
        monsterId: pick.front,
      });
    } else if (needFront && ds.frontPicks.length === FRONT_DRAFT_PICKS) {
      // Transition to rear draft
      const rearOffer = ds.rearPool.slice(0, DRAFT_POOL_SIZE);
      this.emitToPlayer(playerIdx, EVENTS.DRAFT_OFFER, {
        draftStage: 'rear',
        cards: rearOffer,
        picksRemaining: REAR_DRAFT_PICKS,
        monsterId: pick.rear,
      });
    } else if (!needFront && ds.rearPicks.length < REAR_DRAFT_PICKS) {
      const rearOffer = ds.rearPool.slice(0, DRAFT_POOL_SIZE);
      this.emitToPlayer(playerIdx, EVENTS.DRAFT_OFFER, {
        draftStage: 'rear',
        cards: rearOffer,
        picksRemaining: REAR_DRAFT_PICKS - ds.rearPicks.length,
        monsterId: pick.rear,
      });
    } else {
      // Draft complete for this player
      this.emitToPlayer(playerIdx, EVENTS.DRAFT_UPDATE, {
        message: 'Draft complete, waiting for opponent',
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
    return ds.frontPicks.length >= FRONT_DRAFT_PICKS && ds.rearPicks.length >= REAR_DRAFT_PICKS;
  }

  private transitionToArrange(): void {
    this.phase = 'arrange';

    for (let pi = 0 as PlayerIdx; pi <= 1; pi++) {
      const ds = this.draftStates.get(pi)!;
      const deck = [...ds.frontPicks, ...ds.rearPicks];
      this.emitToPlayer(pi, EVENTS.ARRANGE_START, { deck });
    }

    this.emitToRoom(EVENTS.PHASE_CHANGE, { phase: 'arrange' });
  }

  handleArrangeSubmit(playerIdx: PlayerIdx, deckOrder: string[]): void {
    if (this.phase !== 'arrange') return;

    const ds = this.draftStates.get(playerIdx)!;
    const deck = [...ds.frontPicks, ...ds.rearPicks];
    const deckIds = deck.map((c) => c.id);

    // Validate: all 8 card IDs must be from draft
    const valid = deckOrder.every((id) => deckIds.includes(id)) && deckOrder.length === DECK_SIZE;
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

  private transitionToBattle(): void {
    this.phase = 'battle';

    const players: [PlayerState, PlayerState] = [0, 1].map((pi) => {
      const idx = pi as PlayerIdx;
      const pick = this.picks.get(idx)!;
      const frontMonster = getMonsterById(pick.front)!;
      const rearMonster = getMonsterById(pick.rear)!;
      const ds = this.draftStates.get(idx)!;
      const deckOrder = this.arrangeSubmissions.get(idx)!;
      const allCards = [...ds.frontPicks, ...ds.rearPicks];
      const orderedDeck = deckOrder.map((id) => allCards.find((c) => c.id === id)!);

      return {
        id: this.playerSockets[idx],
        front: createMonsterState(frontMonster),
        rear: createMonsterState(rearMonster),
        deck: orderedDeck,
        currentTurn: 0,
      } satisfies PlayerState;
    }) as [PlayerState, PlayerState];

    this.gameState = {
      players,
      turn: 0,
      phase: 'battle',
    };

    for (let pi = 0 as PlayerIdx; pi <= 1; pi++) {
      this.emitToPlayer(pi, EVENTS.BATTLE_START, {
        playerIndex: pi,
        gameState: this.gameState,
        myDeck: this.gameState.players[pi].deck,
      });
    }

    this.emitToRoom(EVENTS.PHASE_CHANGE, { phase: 'battle' });
  }

  handlePlayCard(playerIdx: PlayerIdx, cardId: string): void {
    if (this.phase !== 'battle' || !this.gameState) return;

    const p = this.gameState.players[playerIdx];
    const turn = p.currentTurn;
    const card = p.deck[turn];

    if (!card || card.id !== cardId) {
      // Try to find the card anyway as fallback
      const foundCard = p.deck.find((c) => c.id === cardId);
      if (!foundCard) {
        this.emitToPlayer(playerIdx, EVENTS.ERROR, { message: 'Card not found in deck' });
        return;
      }
      this.pendingCards.set(playerIdx, foundCard);
    } else {
      this.pendingCards.set(playerIdx, card);
    }

    this.emitToPlayer(
      (playerIdx === 0 ? 1 : 0) as PlayerIdx,
      EVENTS.OPPONENT_READY,
      { message: 'Opponent played a card' },
    );

    if (this.pendingCards.size === 2) {
      this.resolveTurnInRoom();
    }
  }

  private resolveTurnInRoom(): void {
    if (!this.gameState) return;
    const p1Card = this.pendingCards.get(0)!;
    const p2Card = this.pendingCards.get(1)!;
    this.pendingCards.clear();

    const { nextState, log } = resolveTurn(this.gameState, p1Card, p2Card);
    this.gameState = nextState;

    this.emitToRoom(EVENTS.TURN_RESULT, { log });

    if (nextState.result) {
      this.emitToRoom(EVENTS.GAME_OVER, { result: nextState.result });
    }
  }
}
