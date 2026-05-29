import { create } from 'zustand';
import type { GamePhase, GameState, CardState, TurnLog, DisplayMonster } from '@tag-battle/shared';

interface DraftOffer {
  draftStage: 'front' | 'rear';
  cards: CardState[];
  picksRemaining: number;
  monsterId: string;
}

interface GameStore {
  // Connection
  connected: boolean;
  roomId: string | null;
  playerIndex: 0 | 1 | null;

  // Phase
  phase: GamePhase;

  // Pick phase
  myFrontPick: string | null;
  myRearPick: string | null;

  // Draft phase
  draftOffer: DraftOffer | null;
  myDraftPicks: CardState[];

  // Arrange phase
  myDeck: CardState[];
  orderedDeck: CardState[];

  // Battle phase
  gameState: GameState | null;
  battleLogs: TurnLog[];
  currentCardIndex: number;
  pendingCardPlayed: boolean;

  // Result
  battleResult: 'player1' | 'player2' | 'draw' | null;

  // Status messages
  statusMessage: string;

  // Actions
  setConnected: (v: boolean) => void;
  setRoomInfo: (roomId: string, playerIndex: 0 | 1) => void;
  setPhase: (phase: GamePhase) => void;
  setMyFrontPick: (id: string) => void;
  setMyRearPick: (id: string) => void;
  setDraftOffer: (offer: DraftOffer | null) => void;
  addDraftPick: (card: CardState) => void;
  setMyDeck: (deck: CardState[]) => void;
  setOrderedDeck: (deck: CardState[]) => void;
  setGameState: (gs: GameState) => void;
  addBattleLog: (log: TurnLog) => void;
  setBattleResult: (result: 'player1' | 'player2' | 'draw') => void;
  setStatusMessage: (msg: string) => void;
  setPendingCardPlayed: (v: boolean) => void;
  incrementCardIndex: () => void;
  reset: () => void;
}

const initialState = {
  connected: false,
  roomId: null,
  playerIndex: null,
  phase: 'pick' as GamePhase,
  myFrontPick: null,
  myRearPick: null,
  draftOffer: null,
  myDraftPicks: [],
  myDeck: [],
  orderedDeck: [],
  gameState: null,
  battleLogs: [],
  currentCardIndex: 0,
  pendingCardPlayed: false,
  battleResult: null,
  statusMessage: '対戦相手を待っています...',
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setConnected: (v) => set({ connected: v }),

  setRoomInfo: (roomId, playerIndex) => set({ roomId, playerIndex }),

  setPhase: (phase) => set({ phase }),

  setMyFrontPick: (id) => set({ myFrontPick: id }),

  setMyRearPick: (id) => set({ myRearPick: id }),

  setDraftOffer: (offer) => set({ draftOffer: offer }),

  addDraftPick: (card) => set((s) => ({ myDraftPicks: [...s.myDraftPicks, card] })),

  setMyDeck: (deck) => set({ myDeck: deck }),

  setOrderedDeck: (deck) => set({ orderedDeck: deck }),

  setGameState: (gs) => set({ gameState: gs }),

  addBattleLog: (log) => set((s) => ({ battleLogs: [...s.battleLogs, log] })),

  setBattleResult: (result) => set({ battleResult: result }),

  setStatusMessage: (msg) => set({ statusMessage: msg }),

  setPendingCardPlayed: (v) => set({ pendingCardPlayed: v }),

  incrementCardIndex: () => set((s) => ({ currentCardIndex: s.currentCardIndex + 1, pendingCardPlayed: false })),

  reset: () => set(initialState),
}));
