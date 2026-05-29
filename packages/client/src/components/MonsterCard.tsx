import React from 'react';
import type { DisplayMonster } from '@tag-battle/shared';
import { HPBar } from './HPBar.js';

interface MonsterCardProps {
  monster: DisplayMonster;
  isEnemy?: boolean;
}

export function MonsterCard({ monster, isEnemy = false }: MonsterCardProps) {
  const borderColor = monster.isDead ? '#666' : isEnemy ? '#f44336' : '#4caf50';
  const opacity = monster.isDead ? 0.4 : 1;

  return (
    <div style={{
      border: `2px solid ${borderColor}`,
      borderRadius: 8,
      padding: '8px 12px',
      minWidth: 150,
      background: '#1a1a2e',
      opacity,
      position: 'relative',
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{monster.name}</div>
      <div style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: 4 }}>
        {monster.role === 'front' ? '前衛' : '後衛'}
        {monster.isDead ? ' [死亡]' : ''}
      </div>
      <HPBar current={monster.hp} max={monster.maxHp} />
      <div style={{ fontSize: '0.8rem', marginTop: 4 }}>
        攻撃力: {monster.power}
      </div>
      {monster.counterName !== undefined && (
        <div style={{ fontSize: '0.75rem', color: '#ffb300', marginTop: 2 }}>
          {monster.counterName}: {monster.counterValue ?? 0}
        </div>
      )}
      {monster.statusEffects.length > 0 && (
        <div style={{ fontSize: '0.7rem', color: '#ce93d8', marginTop: 2 }}>
          {monster.statusEffects.map((se, i) => (
            <span key={i} style={{ marginRight: 4 }}>
              [{se.type} {se.value} ({se.duration}T)]
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
