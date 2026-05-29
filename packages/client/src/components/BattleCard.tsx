import React from 'react';
import type { CardState } from '@tag-battle/shared';

const TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  attack:  { label:'攻撃',     color:'#ef4444', bg:'#ef444418' },
  defense: { label:'防御',     color:'#3b82f6', bg:'#3b82f618' },
  heal:    { label:'回復',     color:'#22c55e', bg:'#22c55e18' },
  buff:    { label:'バフ',     color:'#f59e0b', bg:'#f59e0b18' },
  debuff:  { label:'デバフ',   color:'#a855f7', bg:'#a855f718' },
  counter: { label:'カウンター',color:'#06b6d4', bg:'#06b6d418' },
  combo:   { label:'複合',     color:'#f97316', bg:'#f9731618' },
};

interface BattleCardProps {
  card: CardState;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  small?: boolean;
}

export function BattleCard({ card, onClick, selected = false, disabled = false, small = false }: BattleCardProps) {
  const meta = TYPE_META[card.type] ?? { label: card.type, color:'#94a3b8', bg:'#94a3b818' };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        border: `2px solid ${selected ? 'var(--gold)' : meta.color + '88'}`,
        borderRadius: 'var(--radius-md)',
        padding: small ? '6px 8px' : '10px 12px',
        minWidth: small ? 90 : 120,
        maxWidth: small ? 110 : 160,
        background: selected ? '#2d2d0088' : meta.bg,
        cursor: disabled ? 'default' : onClick ? 'pointer' : 'default',
        opacity: disabled ? 0.5 : 1,
        transition: 'all .15s ease',
        boxShadow: selected ? `0 0 14px var(--gold)88, 0 0 4px var(--gold)` : 'none',
        animation: selected ? 'glow-gold 1.5s ease-in-out infinite' : 'none',
        userSelect: 'none',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        if (!disabled && onClick) (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = '';
      }}
    >
      {/* Type badge */}
      <div style={{
        fontSize:'.6rem', color: meta.color,
        textTransform:'uppercase', letterSpacing:'.08em',
        marginBottom: small ? 2 : 4,
        fontWeight: 700,
      }}>
        {meta.label}
      </div>
      {/* Name */}
      <div style={{ fontSize: small ? '.78rem' : '.88rem', fontWeight:700, marginBottom: small ? 0 : 4 }}>
        {card.name}
      </div>
      {/* Description */}
      {!small && card.description && (
        <div style={{ fontSize:'.68rem', color:'var(--silver)', lineHeight:1.4 }}>
          {card.description}
        </div>
      )}
    </div>
  );
}
