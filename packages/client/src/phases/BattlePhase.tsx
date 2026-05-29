import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { EVENTS } from '../events.js';
import { MonsterCard } from '../components/MonsterCard.js';
import { BattleCard } from '../components/BattleCard.js';
import { toDisplayMonster } from '@tag-battle/shared';
import type { CardState } from '@tag-battle/shared';

interface BattlePhaseProps {
  emit: (event: string, data: unknown) => void;
}

export function BattlePhase({ emit }: BattlePhaseProps) {
  const {
    gameState,
    playerIndex,
    orderedDeck,
    currentCardIndex,
    pendingCardPlayed,
    setPendingCardPlayed,
    battleLogs,
    statusMessage,
  } = useGameStore();

  if (!gameState || playerIndex === null) {
    return <div style={{ padding: 20 }}>ゲーム読み込み中...</div>;
  }

  const myState = gameState.players[playerIndex];
  const oppState = gameState.players[playerIndex === 0 ? 1 : 0];

  const myFront = toDisplayMonster(myState.front);
  const myRear = toDisplayMonster(myState.rear);
  const oppFront = toDisplayMonster(oppState.front);
  const oppRear = toDisplayMonster(oppState.rear);

  const currentCard: CardState | undefined = orderedDeck[currentCardIndex];
  const lastLog = battleLogs[battleLogs.length - 1];

  const handlePlayCard = () => {
    if (!currentCard || pendingCardPlayed) return;
    emit(EVENTS.PLAY_CARD, { cardId: currentCard.id });
    setPendingCardPlayed(true);
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <h2>バトルフェーズ - ターン {gameState.turn + 1}</h2>

      {/* Opponent field */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ color: '#f44336' }}>相手</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          <MonsterCard monster={oppFront} isEnemy />
          <MonsterCard monster={oppRear} isEnemy />
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

      {/* Card play area */}
      <div style={{ marginBottom: 16 }}>
        <h3>今ターンのカード</h3>
        {currentCard ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <BattleCard card={currentCard} selected={!pendingCardPlayed} />
            <button
              onClick={handlePlayCard}
              disabled={pendingCardPlayed}
              style={{
                padding: '10px 20px',
                fontSize: '1rem',
                background: pendingCardPlayed ? '#555' : '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: pendingCardPlayed ? 'default' : 'pointer',
              }}
            >
              {pendingCardPlayed ? '相手を待っています...' : 'カードを使用'}
            </button>
          </div>
        ) : (
          <div style={{ color: '#888' }}>デッキを使い切りました</div>
        )}
        <div style={{ color: '#aaa', fontSize: '0.8rem', marginTop: 8 }}>
          カード {currentCardIndex + 1} / {orderedDeck.length}
        </div>
      </div>

      {/* Status */}
      <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: 16 }}>
        {statusMessage}
      </div>

      {/* Battle log */}
      {lastLog && (
        <div style={{
          border: '1px solid #333',
          borderRadius: 8,
          padding: 12,
          maxHeight: 200,
          overflowY: 'auto',
        }}>
          <h4 style={{ margin: '0 0 8px 0' }}>最新ターンのログ</h4>
          {lastLog.events.map((ev, i) => (
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
      )}
    </div>
  );
}
