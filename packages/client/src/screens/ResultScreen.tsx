import React from 'react';
import { useGameStore } from '../store/gameStore.js';

export function ResultScreen() {
  const { battleResult, playerIndex, battleLogs, reset } = useGameStore();

  const isWin = (battleResult === 'player1' && playerIndex === 0) ||
    (battleResult === 'player2' && playerIndex === 1);
  const isDraw = battleResult === 'draw';

  const resultText = isDraw ? '引き分け！' : isWin ? '勝利！' : '敗北...';
  const resultColor = isDraw ? '#ff9800' : isWin ? '#4caf50' : '#f44336';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      gap: 24,
      minHeight: '100vh',
    }}>
      <h1 style={{ color: resultColor, fontSize: '3rem' }}>{resultText}</h1>

      <div style={{ maxWidth: 600, width: '100%' }}>
        <h2>バトルログ</h2>
        <div style={{
          maxHeight: '60vh',
          overflowY: 'auto',
          border: '1px solid #333',
          borderRadius: 8,
          padding: 12,
        }}>
          {battleLogs.map((log, i) => (
            <div key={i} style={{ marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>
              <div style={{ fontWeight: 'bold', color: '#ffb300' }}>
                ターン {log.turn + 1}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#aaa' }}>
                P1: {log.player1Card.name} vs P2: {log.player2Card.name}
              </div>
              {log.events.map((ev, j) => (
                <div key={j} style={{ fontSize: '0.8rem', paddingLeft: 8, color: '#ccc' }}>
                  {ev.message}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          reset();
          window.location.reload();
        }}
        style={{
          padding: '12px 32px',
          fontSize: '1.1rem',
          background: '#4caf50',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        もう一度プレイ
      </button>
    </div>
  );
}
