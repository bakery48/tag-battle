import React from 'react';

interface HPBarProps {
  current: number;
  max: number;
}

export function HPBar({ current, max }: HPBarProps) {
  const pct  = Math.max(0, Math.min(100, (current / max) * 100));
  const color = pct > 50 ? 'var(--hp-high)' : pct > 25 ? 'var(--hp-mid)' : 'var(--hp-low)';

  return (
    <div className="hp-bar-wrap">
      <div className="hp-bar-bg">
        <div className="hp-bar-fill" style={{ width:`${pct}%`, background:color }} />
      </div>
      <div className="hp-text">{current} / {max}</div>
    </div>
  );
}
