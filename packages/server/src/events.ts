// Server-side Socket.io event names
export const EVENTS = {
  // Client → Server
  JOIN_ROOM: 'join_room',
  PICK_MONSTER: 'pick_monster',
  DRAFT_PICK: 'draft_pick',
  ARRANGE_SUBMIT: 'arrange_submit',
  PLAY_CARD: 'play_card',

  // Server → Client
  ROOM_JOINED: 'room_joined',
  GAME_START: 'game_start',
  PHASE_CHANGE: 'phase_change',
  DRAFT_OFFER: 'draft_offer',
  DRAFT_UPDATE: 'draft_update',
  ARRANGE_START: 'arrange_start',
  BATTLE_START: 'battle_start',
  TURN_RESULT: 'turn_result',
  GAME_OVER: 'game_over',
  ERROR: 'error',
  OPPONENT_READY: 'opponent_ready',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];
