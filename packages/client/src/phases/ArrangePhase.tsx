import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { EVENTS } from '../events.js';
import { BattleCard } from '../components/BattleCard.js';
import type { CardState } from '@tag-battle/shared';

interface ArrangePhaseProps {
  emit: (event: string, data: unknown) => void;
}

export function ArrangePhase({ emit }: ArrangePhaseProps) {
  const { myDeck, setOrderedDeck } = useGameStore();
  const [orderedDeck, setLocalOrderedDeck] = useState<CardState[]>([...myDeck]);
  const [submitted, setSubmitted] = useState(false);

  const moveCard = (fromIdx: number, toIdx: number) => {
    const newDeck = [...orderedDeck];
    const [card] = newDeck.splice(fromIdx, 1);
    newDeck.splice(toIdx, 0, card);
    setLocalOrderedDeck(newDeck);
    setOrderedDeck(newDeck);
  };

  const handleSubmit = () => {
    const deckOrder = orderedDeck.map((c) => c.id);
    emit(EVENTS.ARRANGE_SUBMIT, { deckOrder });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h2>並び替えフェーズ</h2>
        <p style={{ color: '#4caf50' }}>送信完了！対戦相手を待っています...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2>デッキ並び替えフェーズ</h2>
      <p style={{ color: '#aaa' }}>カードの順番を決めてください（上が先に使われます）</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {orderedDeck.map((card, i) => (
          <div key={card.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 24, textAlign: 'right', color: '#888' }}>{i + 1}.</span>
            <BattleCard card={card} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {i > 0 && (
                <button
                  onClick={() => moveCard(i, i - 1)}
                  style={{
                    padding: '2px 8px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    background: '#333',
                    color: '#fff',
                    border: '1px solid #555',
                    borderRadius: 4,
                  }}
                >
                  ↑
                </button>
              )}
              {i < orderedDeck.length - 1 && (
                <button
                  onClick={() => moveCard(i, i + 1)}
                  style={{
                    padding: '2px 8px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    background: '#333',
                    color: '#fff',
                    border: '1px solid #555',
                    borderRadius: 4,
                  }}
                >
                  ↓
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: 20,
          padding: '10px 24px',
          fontSize: '1rem',
          background: '#4caf50',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        この順番で決定
      </button>
    </div>
  );
}
