import React, { useState } from 'react';
import { FRONT_MONSTERS, REAR_MONSTERS } from '@tag-battle/shared';
import { useGameStore } from '../store/gameStore.js';
import { EVENTS } from '../events.js';

interface PickPhaseProps {
  emit: (event: string, data: unknown) => void;
}

export function PickPhase({ emit }: PickPhaseProps) {
  const { myFrontPick, myRearPick, setMyFrontPick, setMyRearPick, statusMessage } = useGameStore();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!myFrontPick || !myRearPick) return;
    emit(EVENTS.PICK_MONSTER, { front: myFrontPick, rear: myRearPick });
    setSubmitted(true);
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2>モンスター選択フェーズ</h2>
      <p style={{ color: '#aaa' }}>{statusMessage}</p>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#4caf50' }}>
          選択完了！対戦相手を待っています...
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            <div>
              <h3>前衛モンスター</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {FRONT_MONSTERS.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setMyFrontPick(m.id)}
                    style={{
                      border: `2px solid ${myFrontPick === m.id ? '#ffd700' : '#444'}`,
                      borderRadius: 8,
                      padding: '8px 12px',
                      cursor: 'pointer',
                      background: myFrontPick === m.id ? '#2d2d00' : '#1a1a2e',
                      minWidth: 250,
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{m.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                      HP:{m.hp} 攻撃:{m.power} [{m.category}]
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>{m.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3>後衛モンスター</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {REAR_MONSTERS.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setMyRearPick(m.id)}
                    style={{
                      border: `2px solid ${myRearPick === m.id ? '#ffd700' : '#444'}`,
                      borderRadius: 8,
                      padding: '8px 12px',
                      cursor: 'pointer',
                      background: myRearPick === m.id ? '#2d2d00' : '#1a1a2e',
                      minWidth: 250,
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{m.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                      HP:{m.hp} 攻撃:{m.power} [{m.category}]
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>{m.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            {myFrontPick && myRearPick && (
              <div style={{ marginBottom: 12, color: '#ccc' }}>
                選択: 前衛={FRONT_MONSTERS.find((m) => m.id === myFrontPick)?.name} /
                後衛={REAR_MONSTERS.find((m) => m.id === myRearPick)?.name}
              </div>
            )}
            <button
              disabled={!myFrontPick || !myRearPick}
              onClick={handleSubmit}
              style={{
                padding: '10px 24px',
                fontSize: '1rem',
                background: myFrontPick && myRearPick ? '#4caf50' : '#555',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: myFrontPick && myRearPick ? 'pointer' : 'default',
              }}
            >
              決定
            </button>
          </div>
        </>
      )}
    </div>
  );
}
