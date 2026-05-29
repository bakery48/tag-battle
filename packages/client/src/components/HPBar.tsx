import React from 'react';

interface HPBarProps {
  current: number;
  max: number;
  label?: string;
}

export function HPBar({ current, max, label }: HPBarProps) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const color = pct > 50 ? '#4caf50' : pct > 25 ? '#ff9800' : '#f44336';

  return (
    <div style={{ width: '100%' }}>
      {label && <div style={{ fontSize: '0.75rem', marginBottom: 2 }}>{label}</div>}
      <div style={{
        background: '#333',
        borderRadius: 4,
        height: 12,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: color,
          transition: 'width 0.3s ease',
        }} />
      </div>
      <div style={{ fontSize: '0.7rem', textAlign: 'right' }}>{current}/{max}</div>
    </div>
  );
}
