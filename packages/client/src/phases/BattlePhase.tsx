import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { MonsterCard } from '../components/MonsterCard.js';
import { BattleCard } from '../components/BattleCard.js';
import { toDisplayMonster } from '@tag-battle/shared';
import type { TurnLog, TurnEvent } from '@tag-battle/shared';

interface BattlePhaseProps {
  emit: (event: string, data: unknown) => void;
}

function EventLine({ ev }: { ev: TurnEvent }) {
  const color =
    ev.type === 'damage'        ? '#ef4444' :
    ev.type === 'heal'          ? '#22c55e' :
    ev.type === 'death'         ? '#f97316' :
    ev.type === 'revive'        ? '#a78bfa' :
    ev.type === 'blocked'       ? '#3b82f6' :
    ev.type === 'counterTrigger'? '#ffd700' :
    ev.type === 'stormwind'     ? '#06b6d4' :
    '#94a3b8';

  return (
    <div style={{
      fontSize:'.78rem', color, padding:'2px 0',
      animation:'fadeIn .25s ease',
    }}>
      › {ev.message}
    </div>
  );
}

export function BattlePhase({ emit: _emit }: BattlePhaseProps) {
  const { playerIndex, battleLogs } = useGameStore();
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => { setCurrentTurnIdx(0); }, [battleLogs]);

  useEffect(() => {
    if (!autoPlay || battleLogs.length === 0) return;
    if (currentTurnIdx >= battleLogs.length - 1) return;
    const t = setTimeout(() => setCurrentTurnIdx(i => i + 1), 2200);
    return () => clearTimeout(t);
  }, [currentTurnIdx, battleLogs.length, autoPlay]);

  if (battleLogs.length === 0 || playerIndex === null) {
    return (
      <div className="center" style={{ minHeight:'100vh', flexDirection:'column', gap:16 }}>
        <div className="spinner" />
        <div style={{ color:'var(--silver)' }}>バトルを計算中...</div>
      </div>
    );
  }

  const log: TurnLog  = battleLogs[currentTurnIdx];
  const state         = log.stateAfter;
  const myState       = state.players[playerIndex];
  const oppState      = state.players[playerIndex === 0 ? 1 : 0];

  const myCard   = playerIndex === 0 ? log.player1Card : log.player2Card;
  const oppCard  = playerIndex === 0 ? log.player2Card : log.player1Card;
  const isLast   = currentTurnIdx >= battleLogs.length - 1;

  return (
    <div className="page" style={{ maxWidth:900, margin:'0 auto', alignItems:'flex-start', gap:14 }}>
      {/* Header */}
      <div className="phase-header" style={{ maxWidth:'100%', justifyContent:'space-between' }}>
        <div>
          <div className="phase-title">④ バトルフェーズ</div>
          <div className="phase-sub">ターン {currentTurnIdx + 1} / {battleLogs.length}</div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {/* Progress dots */}
          <div style={{ display:'flex', gap:4 }}>
            {battleLogs.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentTurnIdx(i)}
                style={{
                  width:10, height:10, borderRadius:'50%', cursor:'pointer',
                  background: i < currentTurnIdx ? '#22c55e' : i === currentTurnIdx ? 'var(--gold)' : 'var(--border)',
                  transition:'background .2s',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Battlefield */}
      <div style={{ width:'100%', display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:16, alignItems:'start' }}>

        {/* Opponent */}
        <div style={{ animation:'slide-in-right .4s ease' }}>
          <div style={{ fontSize:'.75rem', color:'#ef4444', fontWeight:700, marginBottom:8, letterSpacing:'.06em' }}>
            ▼ 相手
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <MonsterCard monster={toDisplayMonster(oppState.front)} isEnemy />
            <MonsterCard monster={toDisplayMonster(oppState.rear)}  isEnemy />
          </div>
          <div style={{ marginTop:10 }}>
            <div style={{ fontSize:'.7rem', color:'var(--silver)', marginBottom:4 }}>相手のカード</div>
            <BattleCard card={oppCard} />
          </div>
        </div>

        {/* VS center */}
        <div className="center" style={{ flexDirection:'column', gap:4, padding:'0 8px' }}>
          <div style={{ color:'var(--border-hi)', fontSize:'.75rem' }}>VS</div>
          <div style={{ width:1, height:60, background:'var(--border)' }} />
        </div>

        {/* My side */}
        <div style={{ animation:'slide-in-left .4s ease' }}>
          <div style={{ fontSize:'.75rem', color:'#22c55e', fontWeight:700, marginBottom:8, letterSpacing:'.06em' }}>
            ▲ 自分
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <MonsterCard monster={toDisplayMonster(myState.front)} />
            <MonsterCard monster={toDisplayMonster(myState.rear)}  />
          </div>
          <div style={{ marginTop:10 }}>
            <div style={{ fontSize:'.7rem', color:'var(--silver)', marginBottom:4 }}>自分のカード</div>
            <BattleCard card={myCard} selected />
          </div>
        </div>
      </div>

      {/* Event log */}
      <div style={{
        width:'100%',
        background:'var(--bg-panel)',
        border:'1px solid var(--border)',
        borderRadius:'var(--radius-md)',
        padding:12,
        minHeight:80,
      }}>
        <div style={{ fontSize:'.72rem', color:'var(--silver)', marginBottom:6, fontWeight:700 }}>
          ターン {log.turn + 1} のイベント
        </div>
        {log.events.length === 0
          ? <div style={{ color:'var(--border-hi)', fontSize:'.78rem' }}>イベントなし</div>
          : log.events.map((ev, i) => <EventLine key={i} ev={ev} />)
        }
      </div>

      {/* Controls */}
      <div style={{ display:'flex', gap:10, alignItems:'center', width:'100%' }}>
        <button
          className="btn btn-ghost"
          disabled={currentTurnIdx === 0}
          onClick={() => { setAutoPlay(false); setCurrentTurnIdx(i => Math.max(0, i-1)); }}
        >
          ← 前へ
        </button>
        <button
          className="btn btn-info"
          onClick={() => setAutoPlay(p => !p)}
          style={{ minWidth:100 }}
        >
          {autoPlay ? '⏸ 停止' : '▶ 自動'}
        </button>
        <button
          className="btn btn-ghost"
          disabled={isLast}
          onClick={() => { setAutoPlay(false); setCurrentTurnIdx(i => Math.min(battleLogs.length-1, i+1)); }}
        >
          次へ →
        </button>
        {isLast && (
          <span style={{ color:'var(--gold)', fontSize:'.85rem', marginLeft:8 }}>
            バトル終了
          </span>
        )}
      </div>
    </div>
  );
}
