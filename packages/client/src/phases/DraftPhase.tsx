import React from 'react';
import { useGameStore } from '../store/gameStore.js';
import { EVENTS } from '../events.js';
import { BattleCard } from '../components/BattleCard.js';

interface DraftPhaseProps {
  emit: (event: string, data: unknown) => void;
}

export function DraftPhase({ emit }: DraftPhaseProps) {
  const { draftOffer, myDraftPicks, statusMessage, addDraftPick } = useGameStore();

  const handlePick = (cardId: string) => {
    const card = draftOffer?.cards.find((c) => c.id === cardId);
    if (!card) return;
    addDraftPick(card);
    emit(EVENTS.DRAFT_PICK, { cardId });
  };

  if (!draftOffer) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h2>ドラフトフェーズ</h2>
        <p>{statusMessage}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2>ドラフトフェーズ</h2>
      <div style={{ color: '#aaa', marginBottom: 8 }}>
        残り{draftOffer.remaining}枚選択
      </div>

      <div style={{ marginBottom: 16 }}>
        <strong>選択済み ({myDraftPicks.length}枚):</strong>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {myDraftPicks.map((c) => (
            <BattleCard key={c.id} card={c} disabled />
          ))}
        </div>
      </div>

      <h3>カードを選択してください</h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {draftOffer.cards.map((c) => (
          <BattleCard
            key={c.id}
            card={c}
            onClick={() => handlePick(c.id)}
          />
        ))}
      </div>
    </div>
  );
}
