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

  useEffect(() => {
    const socket = io({ path: '/socket.io' });
    socketRef.current = socket;

    // FIX 6: use useGameStore.getState() inside every callback to avoid stale closure
    socket.on('connect', () => {
      useGameStore.getState().setConnected(true);
      useGameStore.getState().setStatusMessage('サーバーに接続しました。対戦相手を待っています...');
    });

    socket.on('disconnect', () => {
      useGameStore.getState().setConnected(false);
      useGameStore.getState().setStatusMessage('サーバーから切断されました');
    });

    socket.on(EVENTS.ROOM_JOINED, (data: { roomId: string; playerIndex: 0 | 1; status: string }) => {
      if (data.status === 'matched') {
        useGameStore.getState().setRoomInfo(data.roomId, data.playerIndex);
        useGameStore.getState().setStatusMessage('マッチング完了！');
      } else {
        useGameStore.getState().setStatusMessage('対戦相手を待っています...');
      }
    });

    socket.on(EVENTS.GAME_START, () => {
      useGameStore.getState().setStatusMessage('ゲーム開始！');
    });

    socket.on(EVENTS.PHASE_CHANGE, (data: { phase: string }) => {
      useGameStore.getState().setPhase(data.phase as GameState['phase']);
      useGameStore.getState().setStatusMessage(`フェーズ移行: ${data.phase}`);
    });

    // FIX 1: updated draft offer shape (cards + remaining)
    socket.on(EVENTS.DRAFT_OFFER, (data: {
      cards: CardState[];
      remaining: number;
    }) => {
      useGameStore.getState().setDraftOffer(data);
      useGameStore.getState().setStatusMessage(`ドラフト中: 残り${data.remaining}枚選択`);
    });

    socket.on(EVENTS.ARRANGE_START, (data: { deck: CardState[] }) => {
      useGameStore.getState().setMyDeck(data.deck);
      useGameStore.getState().setOrderedDeck(data.deck);
    });

    // FIX 2: handle battle_result with full TurnLog[]
    socket.on(EVENTS.BATTLE_RESULT, (data: { turnLogs: TurnLog[]; result: string }) => {
      useGameStore.getState().setBattleLogs(data.turnLogs);
      useGameStore.getState().setBattleResult(data.result);
      useGameStore.getState().setPhase('battle');
    });

    // FIX 5: opponent disconnected notification
    socket.on(EVENTS.OPPONENT_DISCONNECTED, (data: { message: string }) => {
      useGameStore.getState().setStatusMessage(data.message);
      useGameStore.getState().setPhase('result');
    });

    socket.on(EVENTS.OPPONENT_READY, (data: { message: string }) => {
      useGameStore.getState().setStatusMessage(data.message);
    });

    socket.on(EVENTS.ERROR, (data: { message: string }) => {
      console.error('Server error:', data.message);
      useGameStore.getState().setStatusMessage(`エラー: ${data.message}`);
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
