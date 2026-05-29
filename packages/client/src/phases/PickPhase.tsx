import React, { useState } from 'react';
import { FRONT_MONSTERS, REAR_MONSTERS } from '@tag-battle/shared';
import type { MonsterMaster } from '@tag-battle/shared';
import { useGameStore } from '../store/gameStore.js';
import { EVENTS } from '../events.js';

interface PickPhaseProps {
  emit: (event: string, data: unknown) => void;
}

function MonsterSelectCard({
  monster, selected, onClick
}: { monster: MonsterMaster; selected: boolean; onClick: () => void }) {
  const catColors: Record<string, string> = {
    '攻撃':'#ef4444','防御':'#3b82f6','特殊':'#a855f7',
    '回復':'#22c55e','妨害':'#f59e0b','補助':'#06b6d4',
  };
  const color = catColors[monster.category] ?? '#94a3b8';

  return (
    <div
      onClick={onClick}
      style={{
        border: `2px solid ${selected ? 'var(--gold)' : color + '66'}`,
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        cursor: 'pointer',
        background: selected ? '#2d2d0055' : 'var(--bg-card)',
        transition: 'all .15s ease',
        boxShadow: selected ? '0 0 16px var(--gold)88' : 'none',
        animation: selected ? 'glow-gold 1.8s ease-in-out infinite' : 'none',
        minWidth: 200,
      }}
      onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLDivElement).style.borderColor = color; }}
      onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLDivElement).style.borderColor = color+'66'; }}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
        <span style={{ fontWeight:700 }}>{monster.name}</span>
        <span style={{
          fontSize:'.65rem', padding:'1px 6px', borderRadius:99, fontWeight:700,
          background: color+'22', color, border:`1px solid ${color}66`,
        }}>
          {monster.category}
        </span>
      </div>
      <div style={{ display:'flex', gap:16, fontSize:'.78rem', color:'var(--silver)', marginBottom:4 }}>
        <span>HP <strong style={{ color:'#e2e8f0' }}>{monster.hp}</strong></span>
        <span>攻撃 <strong style={{ color:'#e2e8f0' }}>{monster.power}</strong></span>
        {monster.counterDef && (
          <span style={{ color:'var(--gold)' }}>● {monster.counterDef.name.replace('カウンター','')}</span>
        )}
      </div>
      <div style={{ fontSize:'.72rem', color:'#64748b', lineHeight:1.4 }}>{monster.description}</div>
    </div>
  );
}

export function PickPhase({ emit }: PickPhaseProps) {
  const { myFrontPick, myRearPick, setMyFrontPick, setMyRearPick } = useGameStore();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!myFrontPick || !myRearPick) return;
    emit(EVENTS.PICK_MONSTER, { front: myFrontPick, rear: myRearPick });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="center" style={{ minHeight:'100vh', flexDirection:'column', gap:20 }}>
        <div className="spinner" />
        <div style={{ color:'var(--silver)' }}>相手の選択を待っています...</div>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth:960, margin:'0 auto', alignItems:'flex-start' }}>
      <div className="phase-header" style={{ maxWidth:'100%' }}>
        <div>
          <div className="phase-title">① ピックフェーズ</div>
          <div className="phase-sub">前衛・後衛のモンスターをそれぞれ1体選択してください</div>
        </div>
      </div>

      <div style={{ display:'flex', gap:32, width:'100%', flexWrap:'wrap' }}>
        {/* Front */}
        <div style={{ flex:1, minWidth:220 }}>
          <div className="section-title" style={{ marginBottom:10 }}>
            前衛モンスター
            {myFrontPick && (
              <span style={{ float:'right', color:'var(--gold)', fontSize:'.75rem' }}>✓ 選択済み</span>
            )}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {FRONT_MONSTERS.map(m => (
              <MonsterSelectCard
                key={m.id} monster={m}
                selected={myFrontPick === m.id}
                onClick={() => setMyFrontPick(m.id)}
              />
            ))}
          </div>
        </div>

        {/* Rear */}
        <div style={{ flex:1, minWidth:220 }}>
          <div className="section-title" style={{ marginBottom:10 }}>
            後衛モンスター
            {myRearPick && (
              <span style={{ float:'right', color:'var(--gold)', fontSize:'.75rem' }}>✓ 選択済み</span>
            )}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {REAR_MONSTERS.map(m => (
              <MonsterSelectCard
                key={m.id} monster={m}
                selected={myRearPick === m.id}
                onClick={() => setMyRearPick(m.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ width:'100%', maxWidth:960, borderTop:'1px solid var(--border)', paddingTop:16 }}>
        {myFrontPick && myRearPick && (
          <div style={{ marginBottom:10, color:'var(--silver)', fontSize:'.85rem' }}>
            選択:&ensp;
            <strong style={{ color:'#e2e8f0' }}>
              {FRONT_MONSTERS.find(m => m.id === myFrontPick)?.name}
            </strong>
            &ensp;+&ensp;
            <strong style={{ color:'#e2e8f0' }}>
              {REAR_MONSTERS.find(m => m.id === myRearPick)?.name}
            </strong>
          </div>
        )}
        <button
          className="btn btn-primary"
          disabled={!myFrontPick || !myRearPick}
          onClick={handleSubmit}
        >
          決定する
        </button>
      </div>
    </div>
  );
}
