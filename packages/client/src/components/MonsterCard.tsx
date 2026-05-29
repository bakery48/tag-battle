import React from 'react';
import type { DisplayMonster } from '@tag-battle/shared';
import { HPBar } from './HPBar.js';

interface MonsterCardProps {
  monster: DisplayMonster;
  isEnemy?: boolean;
}

export function MonsterCard({ monster, isEnemy = false }: MonsterCardProps) {
  const borderColor = monster.isDead ? '#3a3a4a' : isEnemy ? '#ef4444' : '#22c55e';
  const glowColor   = monster.isDead ? 'none'    : isEnemy ? '#ef444422' : '#22c55e22';

  return (
    <div style={{
      border: `2px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      padding: '10px 12px',
      minWidth: 160,
      background: 'var(--bg-card)',
      boxShadow: monster.isDead ? 'none' : `0 0 12px ${glowColor}`,
      opacity: monster.isDead ? 0.45 : 1,
      transition: 'all .3s ease',
      animation: 'fadeIn .4s ease',
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontWeight:700, fontSize:'.9rem' }}>{monster.name}</span>
        <span style={{
          fontSize:'.65rem', padding:'1px 6px', borderRadius:99,
          background: isEnemy ? '#ef444422' : '#22c55e22',
          color: isEnemy ? '#ef4444' : '#22c55e',
          border: `1px solid ${isEnemy ? '#ef444466' : '#22c55e66'}`,
        }}>
          {monster.role === 'front' ? '前衛' : '後衛'}
        </span>
      </div>

      {monster.isDead && (
        <div style={{ color:'#ef4444', fontSize:'.75rem', fontWeight:700, marginBottom:4 }}>
          ✕ 戦闘不能
        </div>
      )}

      {/* HP bar */}
      <HPBar current={monster.hp} max={monster.maxHp} />

      {/* Stats */}
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontSize:'.78rem', color:'var(--silver)' }}>
        <span>攻撃力 <strong style={{ color:'#e2e8f0' }}>{monster.power}</strong></span>
        {monster.counterName !== undefined && (
          <span style={{ color:'var(--gold)' }}>
            {monster.counterName.replace('カウンター','')}: {monster.counterValue ?? 0}
          </span>
        )}
      </div>

      {/* Status effects */}
      {monster.statusEffects.length > 0 && (
        <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:6 }}>
          {monster.statusEffects.map((se, i) => (
            <span key={i} style={{
              fontSize:'.6rem', padding:'1px 5px', borderRadius:4,
              background:'#a855f722', color:'#a855f7', border:'1px solid #a855f766',
            }}>
              {se.type}({se.value}) {se.duration}T
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
