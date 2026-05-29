export type EffectValue =
  | { kind: 'fixed'; amount: number }
  | { kind: 'power'; factor?: number; bonus?: number }
  | { kind: 'powerMul'; factor: number }
  | { kind: 'counterRef'; multiplier?: number };

export type CardEffectTrigger = 'always' | 'onBlock' | 'ifLowHp';

export type CardEffectTarget =
  | 'self' | 'ally_front' | 'ally_rear' | 'ally_all'
  | 'enemy_front' | 'enemy_rear' | 'enemy_all';

export type CardEffectAction =
  | 'damage' | 'heal' | 'powerUp' | 'powerDown'
  | 'counterAdd' | 'counterReduce' | 'revive' | 'cover'
  | 'multiHit'    // ダブルエッジ: deal damage twice (ceil(power/2) each)
  | 'applyStatus'; // Apply a StatusEffect (armor, shield, reverse, etc.)

export type CardEffect = {
  trigger: CardEffectTrigger;
  target: CardEffectTarget;
  action: CardEffectAction;
  value: EffectValue;
  delayed?: boolean;
  counterName?: string;
  selfHpCost?: number;
  multiHitCount?: number; // default 2 for multiHit action
  // applyStatus fields: statusType is the StatusEffect.type to apply
  statusType?: string;
  statusValue?: number;
  statusDuration?: number;
};

export type CardType = 'attack' | 'defense' | 'heal' | 'buff' | 'debuff' | 'counter' | 'combo';

export type CardState = {
  id: string;
  monsterId: string;
  name: string;
  description: string;
  type: CardType;
  effects: CardEffect[];
};

export type CounterDef = {
  name: string;
  type: 'self' | 'apply' | 'threshold';
  threshold?: number;
};

export type MonsterMaster = {
  id: string;
  name: string;
  role: 'front' | 'rear';
  hp: number;
  power: number;
  category: string;
  canRevive: boolean;
  counterDef?: CounterDef;
  description: string;
  hpScaledPower?: boolean; // ブラッドバーサーカー: recalculate power based on HP ratio each turn
};

export type StatusEffect = {
  type: string;
  value: number;
  duration: number;
  source: string;
};

export type CounterInfo = {
  name: string;
  value: number;
  type: 'self' | 'apply' | 'threshold';
  threshold?: number;
  appliedTo?: string;
};

export type MonsterState = {
  id: string;
  name: string;
  role: 'front' | 'rear';
  hp: number;
  maxHp: number;
  power: number;
  basePower: number;
  isDead: boolean;
  canRevive: boolean;
  hasRevived: boolean;
  counter?: CounterInfo;
  statusEffects: StatusEffect[];
  lastCardWasChain: boolean;
  hpScaledPower?: boolean; // ブラッドバーサーカー: recalculate power based on HP ratio
};

export type PlayerState = {
  id: string;
  front: MonsterState;
  rear: MonsterState;
  deck: CardState[];
  currentTurn: number;
};

export type GamePhase = 'pick' | 'draft' | 'arrange' | 'battle' | 'result';

export type GameState = {
  players: [PlayerState, PlayerState];
  turn: number;
  phase: GamePhase;
  result?: 'player1' | 'player2' | 'draw';
};

export type TurnEventType =
  | 'damage' | 'heal' | 'powerChange' | 'counterChange'
  | 'death' | 'revive' | 'blocked' | 'counterTrigger' | 'stormwind';

export type TurnEvent = {
  type: TurnEventType;
  target: string;
  value?: number;
  message: string;
};

export type TurnLog = {
  turn: number;
  player1Card: CardState;
  player2Card: CardState;
  events: TurnEvent[];
  stateAfter: GameState;
};

export type DisplayMonster = {
  id: string;
  name: string;
  role: 'front' | 'rear';
  hp: number;
  maxHp: number;
  power: number;
  isDead: boolean;
  counterName?: string;
  counterValue?: number;
  statusEffects: StatusEffect[];
};
