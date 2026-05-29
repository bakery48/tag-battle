import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { MonsterCard } from '../components/MonsterCard.js';
import { BattleCard } from '../components/BattleCard.js';
import { toDisplayMonster } from '@tag-battle/shared';
import type { TurnLog } from '@tag-battle/shared';

interface BattlePhaseProps {
  emit: (event: string, data: unknown) => void;
}

export function BattlePhase({ emit: _emit }: BattlePhaseProps) {
  const {
    playerIndex,
    battleLogs,
    statusMessage,
  } = useGameStore();

  // FIX 9: sequential display of pre-computed turns
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);

  useEffect(() => {
    if (battleLogs.length === 0) return;
    if (currentTurnIdx >= battleLogs.length - 1) return;
    const timer = setTimeout(() => setCurrentTurnIdx((i) => i + 1), 2000);
    return () => clearTimeout(timer);
  }, [currentTurnIdx, battleLogs.length]);

  // Reset turn display when new logs arrive
  useEffect(() => {
    setCurrentTurnIdx(0);
  }, [battleLogs]);

  if (battleLogs.length === 0 || playerIndex === null) {
    return <div style={{ padding: 20 }}>バトル解決中...</div>;
  }

  const log: TurnLog = battleLogs[currentTurnIdx];
  const state = log.stateAfter;
  const myState = state.players[playerIndex];
  const oppState = state.players[playerIndex === 0 ? 1 : 0];

  const myFront = toDisplayMonster(myState.front);
  const myRear = toDisplayMonster(myState.rear);
  const oppFront = toDisplayMonster(oppState.front);
  const oppRear = toDisplayMonster(oppState.rear);

  const myCard = playerIndex === 0 ? log.player1Card : log.player2Card;
  const oppCard = playerIndex === 0 ? log.player2Card : log.player1Card;

  const isLastTurn = currentTurnIdx >= battleLogs.length - 1;

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <h2>バトルフェーズ - ターン {log.turn + 1} / {battleLogs.length}</h2>

      {/* Opponent field */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ color: '#f44336' }}>相手</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          <MonsterCard monster={oppFront} isEnemy />
          <MonsterCard monster={oppRear} isEnemy />
        </div>
      </div>

      {/* Cards played this turn */}
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: 4 }}>相手のカード</div>
          <BattleCard card={oppCard} selected={false} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: 4 }}>自分のカード</div>
          <BattleCard card={myCard} selected={true} />
        </div>
      </div>

      {/* Separator */}
      <div style={{ borderTop: '1px solid #444', margin: '16px 0' }} />

      {/* My field */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ color: '#4caf50' }}>自分</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          <MonsterCard monster={myFront} />
          <MonsterCard monster={myRear} />
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <button
          onClick={() => setCurrentTurnIdx((i) => Math.max(0, i - 1))}
          disabled={currentTurnIdx === 0}
          style={{
            padding: '8px 16px',
            background: currentTurnIdx === 0 ? '#555' : '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: currentTurnIdx === 0 ? 'default' : 'pointer',
          }}
        >
          前のターン
        </button>
        <button
          onClick={() => setCurrentTurnIdx((i) => Math.min(battleLogs.length - 1, i + 1))}
          disabled={isLastTurn}
          style={{
            padding: '8px 16px',
            background: isLastTurn ? '#555' : '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: isLastTurn ? 'default' : 'pointer',
          }}
        >
          次のターンへ
        </button>
        <span style={{ color: '#aaa', fontSize: '0.85rem' }}>
          {currentTurnIdx + 1} / {battleLogs.length}
        </span>
      </div>

      {/* Status */}
      <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: 16 }}>
        {statusMessage}
      </div>

      {/* Battle log for current turn */}
      <div style={{
        border: '1px solid #333',
        borderRadius: 8,
        padding: 12,
        maxHeight: 200,
        overflowY: 'auto',
      }}>
        <h4 style={{ margin: '0 0 8px 0' }}>ターン{log.turn + 1}のログ</h4>
        {log.events.map((ev, i) => (
          <div key={i} style={{
            fontSize: '0.8rem',
            color: ev.type === 'damage' ? '#f44336' :
              ev.type === 'heal' ? '#4caf50' :
              ev.type === 'death' ? '#f44336' :
              ev.type === 'revive' ? '#ce93d8' :
              '#ccc',
            padding: '1px 0',
          }}>
            {ev.message}
          </div>
        ))}
      </div>
    </div>
  );
}
