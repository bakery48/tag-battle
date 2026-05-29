import React from 'react';
import { useGameStore } from '../store/gameStore.js';

export function ResultScreen() {
  const { battleResult, playerIndex, battleLogs, reset } = useGameStore();

  const isWin = (battleResult === 'player1' && playerIndex === 0) ||
    (battleResult === 'player2' && playerIndex === 1);
  const isDraw = battleResult === 'draw';

  const resultText  = isDraw ? '引き分け' : isWin ? '勝　利' : '敗　北';
  const resultColor = isDraw ? '#f59e0b'  : isWin ? '#22c55e' : '#ef4444';
  const resultGlow  = isDraw ? '#f59e0b66': isWin ? '#22c55e66': '#ef444466';

  return (
    <div className="page" style={{ justifyContent:'flex-start', paddingTop:48 }}>
      {/* Result banner */}
      <div style={{
        textAlign:'center',
        animation:'fadeIn .5s ease',
      }}>
        <div style={{
          fontSize:'4rem', fontWeight:900, letterSpacing:'.1em',
          color: resultColor,
          textShadow:`0 0 40px ${resultGlow}`,
        }}>
          {resultText}
        </div>
      </div>

      {/* Battle log */}
      <div style={{ width:'100%', maxWidth:640 }}>
        <div className="section-title" style={{ marginBottom:12 }}>バトルログ</div>
        <div style={{
          maxHeight:'55vh', overflowY:'auto',
          display:'flex', flexDirection:'column', gap:8,
        }}>
          {battleLogs.map((log, i) => (
            <div key={i} className="card-panel" style={{ animation:`fadeIn .3s ease ${i*0.04}s both` }}>
              <div style={{ fontWeight:700, color:'var(--gold)', marginBottom:6, fontSize:'.85rem' }}>
                ターン {log.turn + 1} — {log.player1Card.name} vs {log.player2Card.name}
              </div>
              {log.events.map((ev, j) => {
                const color =
                  ev.type === 'damage'  ? '#ef4444' :
                  ev.type === 'heal'    ? '#22c55e' :
                  ev.type === 'death'   ? '#f97316' :
                  ev.type === 'revive'  ? '#a78bfa' :
                  ev.type === 'blocked' ? '#3b82f6' :
                  '#94a3b8';
                return (
                  <div key={j} style={{ fontSize:'.78rem', color, paddingLeft:8 }}>
                    › {ev.message}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary" style={{ fontSize:'1rem', padding:'12px 40px' }}
        onClick={() => { reset(); window.location.reload(); }}>
        もう一度プレイ
      </button>
    </div>
  );
}
