import { useEffect, useRef } from 'react';
import { type Socket, io } from 'socket.io-client';
import { useGameStore } from '../store/gameStore.js';
import { EVENTS } from '../events.js';
import type { GameState, TurnLog, CardState } from '@tag-battle/shared';

interface UseSocketReturn {
  emit: (event: string, data: unknown) => void;
  socket: Socket | null;
}

export function useSocket(): UseSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const store = useGameStore();

  useEffect(() => {
    const socket = io({ path: '/socket.io' });
    socketRef.current = socket;

    socket.on('connect', () => {
      store.setConnected(true);
      store.setStatusMessage('サーバーに接続しました。対戦相手を待っています...');
    });

    socket.on('disconnect', () => {
      store.setConnected(false);
      store.setStatusMessage('サーバーから切断されました');
    });

    socket.on(EVENTS.ROOM_JOINED, (data: { roomId: string; playerIndex: 0 | 1; status: string }) => {
      if (data.status === 'matched') {
        store.setRoomInfo(data.roomId, data.playerIndex);
        store.setStatusMessage('マッチング完了！');
      } else {
        store.setStatusMessage('対戦相手を待っています...');
      }
    });

    socket.on(EVENTS.GAME_START, () => {
      store.setStatusMessage('ゲーム開始！');
    });

    socket.on(EVENTS.PHASE_CHANGE, (data: { phase: string }) => {
      store.setPhase(data.phase as GameState['phase']);
      store.setStatusMessage(`フェーズ移行: ${data.phase}`);
    });

    socket.on(EVENTS.DRAFT_OFFER, (data: {
      draftStage: 'front' | 'rear';
      cards: CardState[];
      picksRemaining: number;
      monsterId: string;
    }) => {
      store.setDraftOffer(data);
      store.setStatusMessage(`ドラフト中: 残り${data.picksRemaining}枚選択`);
    });

    socket.on(EVENTS.ARRANGE_START, (data: { deck: CardState[] }) => {
      store.setMyDeck(data.deck);
      store.setOrderedDeck(data.deck);
    });

    socket.on(EVENTS.BATTLE_START, (data: {
      playerIndex: 0 | 1;
      gameState: GameState;
      myDeck: CardState[];
    }) => {
      store.setGameState(data.gameState);
      store.setMyDeck(data.myDeck);
      store.setOrderedDeck(data.myDeck);
      store.setStatusMessage('バトル開始！');
    });

    socket.on(EVENTS.TURN_RESULT, (data: { log: TurnLog }) => {
      store.addBattleLog(data.log);
      store.setGameState(data.log.stateAfter);
      store.incrementCardIndex();
      store.setStatusMessage(`ターン${data.log.turn}完了`);
    });

    socket.on(EVENTS.GAME_OVER, (data: { result: 'player1' | 'player2' | 'draw' }) => {
      store.setBattleResult(data.result);
      store.setPhase('result');
    });

    socket.on(EVENTS.OPPONENT_READY, (data: { message: string }) => {
      store.setStatusMessage(data.message);
    });

    socket.on(EVENTS.ERROR, (data: { message: string }) => {
      console.error('Server error:', data.message);
      store.setStatusMessage(`エラー: ${data.message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const emit = (event: string, data: unknown) => {
    socketRef.current?.emit(event, data);
  };

  return { emit, socket: socketRef.current };
}
