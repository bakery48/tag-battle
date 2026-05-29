import React from 'react';
import { useGameStore } from '../store/gameStore.js';

export function LobbyScreen() {
  const { connected, statusMessage } = useGameStore();

  return (
    <div className="center" style={{ minHeight:'100vh', flexDirection:'column', gap:32, background:'var(--bg-deep)' }}>
      {/* Logo */}
      <div style={{ textAlign:'center', animation:'fadeIn .6s ease' }}>
        <div style={{
          fontSize:'3.5rem', fontWeight:900, letterSpacing:'.05em',
          background:'linear-gradient(135deg,#ffd700,#ff9800,#ffd700)',
          backgroundSize:'200%',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          animation:'shimmer 2.5s linear infinite',
        }}>
          TAG BATTLE
        </div>
        <div style={{ color:'var(--silver)', fontSize:'1rem', letterSpacing:'.2em', marginTop:4 }}>
          タグバトル
        </div>
      </div>

      {/* Spinner + status */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
        <div className="spinner" />
        <div style={{ color: connected ? '#22c55e' : '#ef4444', fontSize:'.85rem', fontWeight:600 }}>
          {connected ? '● サーバー接続済み' : '○ 接続中...'}
        </div>
        <div style={{ color:'var(--silver)', fontSize:'.9rem' }}>{statusMessage}</div>
      </div>

      {/* Decorative border */}
      <div style={{
        width:240, height:1,
        background:'linear-gradient(90deg,transparent,var(--border-hi),transparent)',
      }} />

      <div style={{ color:'#64748b', fontSize:'.75rem', letterSpacing:'.1em' }}>
        対戦相手を探しています...
      </div>
    </div>
  );
}
