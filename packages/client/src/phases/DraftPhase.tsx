import React from 'react';
import { useGameStore } from '../store/gameStore.js';
import { EVENTS } from '../events.js';
import { BattleCard } from '../components/BattleCard.js';

interface DraftPhaseProps {
  emit: (event: string, data: unknown) => void;
}

export function DraftPhase({ emit }: DraftPhaseProps) {
  const { draftOffer, myDraftPicks, addDraftPick } = useGameStore();

  const handlePick = (cardId: string) => {
    const card = draftOffer?.cards.find(c => c.id === cardId);
    if (!card) return;
    addDraftPick(card);
    emit(EVENTS.DRAFT_PICK, { cardId });
  };

  if (!draftOffer) {
    return (
      <div className="center" style={{ minHeight:'100vh', flexDirection:'column', gap:16 }}>
        <div className="spinner" />
        <div style={{ color:'var(--silver)' }}>ドラフト開始を待っています...</div>
      </div>
    );
  }

  const totalPicks = 8;
  const donePicks  = myDraftPicks.length;
  const progress   = (donePicks / totalPicks) * 100;

  return (
    <div className="page" style={{ maxWidth:860, margin:'0 auto', alignItems:'flex-start' }}>
      <div className="phase-header" style={{ maxWidth:'100%' }}>
        <div style={{ flex:1 }}>
          <div className="phase-title">② ドラフトフェーズ</div>
          <div className="phase-sub">3枚から1枚選択 × 8回 — 8枚のデッキを作る</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:'.85rem', color:'var(--gold)', fontWeight:700 }}>
            {donePicks} / {totalPicks}
          </div>
          <div style={{
            width:120, height:6, background:'var(--border)', borderRadius:4, marginTop:4, overflow:'hidden'
          }}>
            <div style={{
              width:`${progress}%`, height:'100%',
              background:'linear-gradient(90deg,#22c55e,#16a34a)',
              borderRadius:4, transition:'width .3s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Offer */}
      <div style={{ width:'100%' }}>
        <div className="section-title" style={{ marginBottom:14 }}>
          カードを選択 (残り{draftOffer.remaining}回)
        </div>
        <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
          {draftOffer.cards.map(card => (
            <BattleCard
              key={card.id}
              card={card}
              onClick={() => handlePick(card.id)}
            />
          ))}
        </div>
      </div>

      {/* Selected deck */}
      {myDraftPicks.length > 0 && (
        <div style={{ width:'100%' }}>
          <div className="section-title" style={{ marginBottom:10 }}>
            選択済みカード
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {myDraftPicks.map(c => (
              <BattleCard key={c.id} card={c} disabled small />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
