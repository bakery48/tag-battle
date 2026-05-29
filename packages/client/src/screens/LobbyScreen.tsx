import React from 'react';
import { useGameStore } from '../store/gameStore.js';

export function LobbyScreen() {
  const { connected, statusMessage, roomId } = useGameStore();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: 24,
    }}>
      <h1 style={{ fontSize: '3rem', margin: 0 }}>TAG BATTLE</h1>
      <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#aaa' }}>タグバトル</h2>

      <div style={{
        width: 48,
        height: 48,
        border: '4px solid #333',
        borderTop: '4px solid #4caf50',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      <div style={{ color: connected ? '#4caf50' : '#f44336' }}>
        {connected ? 'サーバー接続中' : 'サーバーに接続中...'}
      </div>

      <div style={{ color: '#ccc', fontSize: '1.1rem' }}>{statusMessage}</div>

      {roomId && roomId !== 'waiting' && (
        <div style={{ color: '#888', fontSize: '0.8rem' }}>
          ルームID: {roomId}
        </div>
      )}
    </div>
  );
}
