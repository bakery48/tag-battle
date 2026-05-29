import React from 'react';
import { useGameStore } from './store/gameStore.js';
import { useSocket } from './hooks/useSocket.js';
import { LobbyScreen } from './screens/LobbyScreen.js';
import { ResultScreen } from './screens/ResultScreen.js';
import { PickPhase } from './phases/PickPhase.js';
import { DraftPhase } from './phases/DraftPhase.js';
import { ArrangePhase } from './phases/ArrangePhase.js';
import { BattlePhase } from './phases/BattlePhase.js';

export function App() {
  const { phase, roomId, playerIndex } = useGameStore();
  const { emit } = useSocket();

  // Show lobby while waiting to be matched
  const isMatched = roomId !== null && roomId !== 'waiting' && playerIndex !== null;

  if (!isMatched) {
    return <LobbyScreen />;
  }

  if (phase === 'result') {
    return <ResultScreen />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0d1a',
      color: '#fff',
      fontFamily: '"Noto Sans JP", sans-serif',
    }}>
      {phase === 'pick' && <PickPhase emit={emit} />}
      {phase === 'draft' && <DraftPhase emit={emit} />}
      {phase === 'arrange' && <ArrangePhase emit={emit} />}
      {phase === 'battle' && <BattlePhase emit={emit} />}
    </div>
  );
}
