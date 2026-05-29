import React from 'react';
import type { CardState } from '@tag-battle/shared';

interface BattleCardProps {
  card: CardState;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  attack: '#f44336',
  defense: '#2196f3',
  heal: '#4caf50',
  buff: '#ff9800',
  debuff: '#9c27b0',
  counter: '#00bcd4',
  combo: '#ff5722',
};

export function BattleCard({ card, onClick, selected = false, disabled = false }: BattleCardProps) {
  const typeColor = TYPE_COLORS[card.type] ?? '#888';

  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        border: `2px solid ${selected ? '#ffd700' : typeColor}`,
        borderRadius: 8,
        padding: '8px 10px',
        minWidth: 120,
        maxWidth: 150,
        background: selected ? '#2d2d00' : '#1a1a2e',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s ease',
        boxShadow: selected ? '0 0 8px #ffd700' : 'none',
      }}
    >
      <div style={{
        fontSize: '0.65rem',
        color: typeColor,
        textTransform: 'uppercase',
        marginBottom: 2,
      }}>
        {card.type}
      </div>
      <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{card.name}</div>
      <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: 4 }}>
        {card.description}
      </div>
    </div>
  );
}
