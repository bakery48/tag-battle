import type {
  GameState, PlayerState, MonsterState, CardState, CardEffect,
  EffectValue, TurnEvent, TurnLog, StatusEffect, CounterInfo,
  MonsterMaster,
} from './types.js';

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function cloneState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state)) as GameState;
}

function resolveValue(v: EffectValue, actingPower: number, counterValue: number): number {
  switch (v.kind) {
    case 'fixed': return v.amount;
    case 'power': return Math.floor(actingPower * (v.factor ?? 1)) + (v.bonus ?? 0);
    case 'powerMul': return actingPower * v.factor;
    case 'counterRef': return actingPower * counterValue * (v.multiplier ?? 1);
  }
}

function getActingMonster(p: PlayerState): MonsterState {
  return p.front.isDead ? p.rear : p.front;
}

function resolveTarget(
  target: CardEffect['target'],
  state: GameState,
  actingPlayerIdx: 0 | 1,
): MonsterState | MonsterState[] {
  const p = state.players[actingPlayerIdx];
  const opp = state.players[actingPlayerIdx === 0 ? 1 : 0];

  switch (target) {
    case 'self': return getActingMonster(p);
    case 'ally_front': return p.front;
    case 'ally_rear': return p.rear;
    case 'ally_all': return [p.front, p.rear];
    case 'enemy_front':
      return opp.front.isDead ? opp.rear : opp.front;
    case 'enemy_rear': {
      // Check defense: if opp.front has 'defense' status and is alive → intercept
      const hasCover = !opp.front.isDead && opp.front.statusEffects.some((s) => s.type === 'defense');
      return hasCover ? opp.front : opp.rear;
    }
    case 'enemy_all': return [opp.front, opp.rear];
  }
}

function addEvent(events: TurnEvent[], type: TurnEvent['type'], target: string, value: number | undefined, message: string): void {
  events.push({ type, target, value, message });
}

function recalcPower(m: MonsterState): void {
  let power: number;
  // ブラッドバーサーカー: HP-scaled power (ignores counter/statusEffect powerUp stacking)
  if (m.hpScaledPower) {
    const ratio = m.maxHp > 0 ? 1 - (m.hp / m.maxHp) : 0;
    power = m.basePower + Math.floor(ratio * 6);
  } else {
    power = m.basePower;
    for (const s of m.statusEffects) {
      if (s.type === 'powerUp') power += s.value;
      if (s.type === 'powerDown') power -= s.value;
    }
    if (m.counter) {
      const c = m.counter;
      if (c.type === 'self') {
        power += c.value;
      }
    }
  }
  // Transformed state power bonus
  if (m.isTransformed && m.transformPowerBonus) {
    power += m.transformPowerBonus;
  }
  m.power = Math.max(0, power);
}

function applyHpDamage(m: MonsterState, dmg: number, events: TurnEvent[], source: string): void {
  if (m.isDead) return;
  let raw = Math.max(0, dmg);
  // Armor absorption (armor status reduces incoming damage)
  const armorIdx = m.statusEffects.findIndex((se) => se.type === 'armor');
  if (armorIdx !== -1 && raw > 0) {
    const armor = m.statusEffects[armorIdx];
    const absorbed = Math.min(armor.value, raw);
    armor.value -= absorbed;
    raw -= absorbed;
    if (armor.value <= 0) {
      m.statusEffects.splice(armorIdx, 1);
    }
  }
  const actual = raw;
  m.hp = Math.max(0, m.hp - actual);
  addEvent(events, 'damage', m.name, actual, `${m.name}が${actual}ダメージを受けた (${source})`);
}

function applyHeal(m: MonsterState, amount: number, events: TurnEvent[]): void {
  if (m.isDead) return;
  const before = m.hp;
  m.hp = Math.min(m.maxHp, m.hp + amount);
  const healed = m.hp - before;
  addEvent(events, 'heal', m.name, healed, `${m.name}のHPが${healed}回復した`);
}

function parseStatusCounterName(counterName: string): { type: string; duration: number } | null {
  if (!counterName.startsWith('__status__')) return null;
  const parts = counterName.split('__');
  // parts: ['', 'status', type, duration]
  if (parts.length < 4) return null;
  const type = parts[2];
  const duration = parseInt(parts[3], 10);
  if (isNaN(duration) || !type) return null;
  return { type, duration };
}

function applyStatusToMonster(m: MonsterState, statusType: string, statusValue: number, duration: number, source: string): void {
  // Stack or add status
  const existing = m.statusEffects.find((s) => s.type === statusType && s.source === source);
  if (existing) {
    existing.value += statusValue;
    existing.duration = Math.max(existing.duration, duration);
  } else {
    m.statusEffects.push({ type: statusType, value: statusValue, duration, source });
  }
}

function incrementCounter(m: MonsterState, counterName: string, amount: number, events: TurnEvent[]): void {
  if (!m.counter) return;
  if (counterName === '' || m.counter.name === counterName) {
    m.counter.value += amount;
    addEvent(events, 'counterChange', m.name, m.counter.value, `${m.name}の${m.counter.name}が${m.counter.value}になった`);
  }
}

// ──────────────────────────────────────────────
// Effect application
// ──────────────────────────────────────────────

interface ResolvedEffect {
  effect: CardEffect;
  actingPower: number;
  actingPlayerIdx: 0 | 1;
  counterValue: number;
  nullified: boolean;
  actor: MonsterState;
}

function applyEffect(
  re: ResolvedEffect,
  state: GameState,
  events: TurnEvent[],
): void {
  if (re.nullified) return;
  const { effect, actingPower, actingPlayerIdx, counterValue } = re;
  const targets = resolveTarget(effect.target, state, actingPlayerIdx);
  const targetArr: MonsterState[] = Array.isArray(targets) ? targets : [targets];

  for (const tgt of targetArr) {
    if (tgt.isDead && effect.action !== 'revive') continue;

    const val = resolveValue(effect.value, actingPower, counterValue);

    switch (effect.action) {
      case 'damage': {
        applyHpDamage(tgt, val, events, 'card');
        // Lifesteal: actor heals self by counter.value on each damage hit
        if (re.actor.counter?.type === 'lifesteal' && val > 0 && re.actor.counter.value > 0) {
          applyHeal(re.actor, re.actor.counter.value, events);
        }
        // HealOnAttack: actor heals ally_front by counter.value on each damage hit
        if (re.actor.counter?.type === 'healOnAttack' && val > 0 && re.actor.counter.value > 0) {
          const ally = state.players[re.actingPlayerIdx].front;
          if (!ally.isDead) applyHeal(ally, re.actor.counter.value, events);
        }
        break;
      }
      case 'heal': {
        const healVal = val + (re.actor.counter?.type === 'healBonus' ? (re.actor.counter.value) : 0);
        applyHeal(tgt, healVal, events);
        break;
      }
      case 'powerUp': {
        // Check if target has 'reverse' status → flip to powerDown
        const hasReverse = tgt.statusEffects.some((se) => se.type === 'reverse');
        if (hasReverse) {
          if (effect.delayed) {
            tgt.statusEffects.push({ type: 'powerDown', value: val, duration: 2, source: 'reversed' });
          } else {
            tgt.basePower = Math.max(0, tgt.basePower - val);
            recalcPower(tgt);
            addEvent(events, 'powerChange', tgt.name, tgt.power, `リバーサー効果！${tgt.name}のバフが反転した (攻撃力=${tgt.power})`);
          }
        } else if (effect.delayed) {
          tgt.statusEffects.push({ type: 'powerUp', value: val, duration: 2, source: 'delayed' });
        } else {
          tgt.basePower += val;
          recalcPower(tgt);
          addEvent(events, 'powerChange', tgt.name, tgt.power, `${tgt.name}の攻撃力が${tgt.power}になった`);
        }
        break;
      }
      case 'powerDown': {
        if (effect.delayed) {
          tgt.statusEffects.push({ type: 'powerDown', value: val, duration: 2, source: 'delayed' });
        } else {
          tgt.basePower = Math.max(0, tgt.basePower - val);
          recalcPower(tgt);
          addEvent(events, 'powerChange', tgt.name, tgt.power, `${tgt.name}の攻撃力が${tgt.power}になった`);
        }
        break;
      }
      case 'counterAdd': {
        // Check if this is a status effect application
        if (effect.counterName) {
          const parsed = parseStatusCounterName(effect.counterName);
          if (parsed) {
            let statusVal = val;
            if (parsed.type === 'armor' && re.actor.counter?.type === 'armorBonus') {
              statusVal += re.actor.counter.value;
            }
            if (parsed.type === 'stormwind' && re.actor.counter?.type === 'stormBonus') {
              statusVal += re.actor.counter.value;
            }
            if (parsed.type === 'curse' && re.actor.counter?.type === 'curseBonus') {
              statusVal += re.actor.counter.value;
            }
            applyStatusToMonster(tgt, parsed.type, statusVal, parsed.duration, 'card');
            addEvent(events, 'counterChange', tgt.name, statusVal, `${tgt.name}に${parsed.type}(${statusVal})が付与された`);
            break;
          }
        }
        // Regular counter increment
        incrementCounter(tgt, effect.counterName ?? '', val, events);
        break;
      }
      case 'counterReduce': {
        if (tgt.counter) {
          tgt.counter.value = Math.max(0, tgt.counter.value - val);
          addEvent(events, 'counterChange', tgt.name, tgt.counter.value, `${tgt.name}のカウンターが${tgt.counter.value}になった`);
        }
        break;
      }
      case 'revive': {
        // Handled in Phase 5c
        break;
      }
      case 'defense': {
        if (val === 0) break; // plain defense (val=0 means it's a defense card, handled by phase 2)
        // Apply defense status for 1 turn
        applyStatusToMonster(tgt, 'defense', 1, val, 'card');
        addEvent(events, 'counterChange', tgt.name, 1, `${tgt.name}が防御状態になった`);
        break;
      }
      case 'applyStatus': {
        if (!effect.statusType) break;
        const sv = effect.statusValue ?? 1;
        const sd = effect.statusDuration ?? 2;
        applyStatusToMonster(tgt, effect.statusType, sv, sd, 'card');
        addEvent(events, 'counterChange', tgt.name, sv, `${tgt.name}に${effect.statusType}(${sv})を付与`);
        break;
      }
      case 'multiHit': {
        // Handled as two separate damage effects; this case is a no-op here
        break;
      }
      case 'swapPositions': {
        const p = state.players[re.actingPlayerIdx];
        // Only swap if both are alive
        if (!p.front.isDead && !p.rear.isDead) {
          const tmp = p.front;
          p.front = p.rear;
          p.rear = tmp;
          p.front.role = 'front';
          p.rear.role = 'rear';
          addEvent(events, 'swap', p.front.name, undefined, `${p.rear.name}と${p.front.name}の位置が入れ替わった！`);
        }
        break;
      }
      case 'swapEnemyPositions': {
        const opp = state.players[re.actingPlayerIdx === 0 ? 1 : 0];
        if (!opp.front.isDead && !opp.rear.isDead) {
          const tmp = opp.front;
          opp.front = opp.rear;
          opp.rear = tmp;
          opp.front.role = 'front';
          opp.rear.role = 'rear';
          addEvent(events, 'swap', opp.front.name, undefined, `敵の${opp.rear.name}と${opp.front.name}が強制入れ替えされた！`);
        }
        break;
      }
      case 'swapAlliesHp': {
        const p = state.players[re.actingPlayerIdx];
        if (!p.front.isDead && !p.rear.isDead) {
          const frontHp = p.front.hp;
          const rearHp = p.rear.hp;
          p.front.hp = Math.min(rearHp, p.front.maxHp);
          p.rear.hp = Math.min(frontHp, p.rear.maxHp);
          addEvent(events, 'heal', p.front.name, p.front.hp, `HP交換！${p.front.name}のHPが${p.front.hp}になった`);
          addEvent(events, 'heal', p.rear.name, p.rear.hp, `HP交換！${p.rear.name}のHPが${p.rear.hp}になった`);
        }
        break;
      }
    }
  }
}

// ──────────────────────────────────────────────
// Main resolver
// ──────────────────────────────────────────────

export function resolveTurn(
  state: GameState,
  p1Card: CardState,
  p2Card: CardState,
): { nextState: GameState; log: TurnLog } {
  const s = cloneState(state);
  const events: TurnEvent[] = [];
  const cards: [CardState, CardState] = [p1Card, p2Card];

  // ── Phase 0: Stormwind pre-effect check ──
  for (let pi = 0 as 0 | 1; pi <= 1; pi++) {
    const p = s.players[pi];
    const allMonsters: MonsterState[] = [p.front, p.rear];
    for (const m of allMonsters) {
      if (m.isDead) continue;
      const swIdx = m.statusEffects.findIndex((se) => se.type === 'stormwind');
      if (swIdx === -1) continue;
      const sw = m.statusEffects[swIdx];
      applyHpDamage(m, sw.value, events, 'stormwind');
      addEvent(events, 'stormwind', m.name, sw.value, `${m.name}が嵐風で${sw.value}ダメージを受けた`);
      sw.duration--;
      if (sw.duration <= 0) {
        m.statusEffects.splice(swIdx, 1);
      }
    }
  }

  // ── Phase 1: Collect card effects ──
  const resolvedEffects: ResolvedEffect[] = [];

  for (let pi = 0 as 0 | 1; pi <= 1; pi++) {
    const p = s.players[pi];
    const card = cards[pi];
    const actor = getActingMonster(p);
    const actingPower = actor.power;
    const counterValue = actor.counter?.value ?? 0;

    // selfHpCost (death-knight)
    for (const effect of card.effects) {
      if (effect.selfHpCost && effect.selfHpCost > 0) {
        applyHpDamage(actor, effect.selfHpCost, events, 'selfHpCost');
      }
    }

    // Find the card owner's role (front or rear) in the player state
    const cardOwner = [p.front, p.rear].find((m) => m.id === card.monsterId) ?? actor;

    for (const effect of card.effects) {
      // Skip effects that only fire in a specific position if card owner is in wrong position
      if (effect.positionTrigger && effect.positionTrigger !== cardOwner.role) continue;
      // Skip effects whose transformTrigger doesn't match actor's current state
      if (effect.transformTrigger) {
        const actorIsTransformed = actor.isTransformed ?? false;
        if (effect.transformTrigger === 'normal' && actorIsTransformed) continue;
        if (effect.transformTrigger === 'transformed' && !actorIsTransformed) continue;
      }
      // ifLowHp: only if actor HP < 30% of maxHp
      if (effect.trigger === 'ifLowHp' && actor.hp >= actor.maxHp * 0.3) continue;
      resolvedEffects.push({
        effect,
        actingPower,
        actingPlayerIdx: pi,
        counterValue,
        nullified: false,
        actor,
      });
    }
  }

  // ── Phase 2: Defense nullification ──
  const p1IsDefense = p1Card.type === 'defense';
  const p2IsDefense = p2Card.type === 'defense';
  const p1IsAttacking = p1Card.type === 'attack' || p1Card.type === 'combo';
  const p2IsAttacking = p2Card.type === 'attack' || p2Card.type === 'combo';

  if (p1IsDefense && p2IsAttacking) {
    // Nullify p2 damage effects, keep p1's onBlock effects
    for (const re of resolvedEffects) {
      if (re.actingPlayerIdx === 1 && re.effect.action === 'damage') {
        re.nullified = true;
      }
    }
    addEvent(events, 'blocked', s.players[0].front.name, undefined, `${s.players[0].front.name}がブロックした`);
    // Activate p1 onBlock effects
    for (const re of resolvedEffects) {
      if (re.actingPlayerIdx === 0 && re.effect.trigger === 'onBlock') {
        re.nullified = false; // ensure active
      }
    }
  } else {
    // onBlock effects from p1 are not triggered
    for (const re of resolvedEffects) {
      if (re.actingPlayerIdx === 0 && re.effect.trigger === 'onBlock') {
        re.nullified = true;
      }
    }
  }

  if (p2IsDefense && p1IsAttacking) {
    for (const re of resolvedEffects) {
      if (re.actingPlayerIdx === 0 && re.effect.action === 'damage') {
        re.nullified = true;
      }
    }
    addEvent(events, 'blocked', s.players[1].front.name, undefined, `${s.players[1].front.name}がブロックした`);
    for (const re of resolvedEffects) {
      if (re.actingPlayerIdx === 1 && re.effect.trigger === 'onBlock') {
        re.nullified = false;
      }
    }
  } else {
    for (const re of resolvedEffects) {
      if (re.actingPlayerIdx === 1 && re.effect.trigger === 'onBlock') {
        re.nullified = true;
      }
    }
  }

  // ── Phase 3: Apply surviving effects simultaneously ──
  // (Powers already snapshotted in Phase 1 via actingPower stored in resolvedEffects)
  for (const re of resolvedEffects) {
    if (re.effect.trigger === 'onBlock') {
      // Only apply if NOT nullified
      if (!re.nullified) applyEffect(re, s, events);
    } else if (re.effect.delayed) {
      // Delayed effects: add status with duration 2
      const targets = resolveTarget(re.effect.target, s, re.actingPlayerIdx);
      const targetArr: MonsterState[] = Array.isArray(targets) ? targets : [targets];
      const val = resolveValue(re.effect.value, re.actingPower, re.counterValue);
      for (const tgt of targetArr) {
        if (tgt.isDead) continue;
        if (re.effect.action === 'powerDown') {
          tgt.statusEffects.push({ type: 'powerDown', value: val, duration: 2, source: 'delayed' });
        } else if (re.effect.action === 'powerUp') {
          tgt.statusEffects.push({ type: 'powerUp', value: val, duration: 2, source: 'delayed' });
        }
      }
    } else {
      applyEffect(re, s, events);
    }
  }

  // ── Phase 4: Monster-specific counter passives ──
  for (let pi = 0 as 0 | 1; pi <= 1; pi++) {
    const p = s.players[pi];
    const card = cards[pi];
    const actor = getActingMonster(p);
    const opp = s.players[pi === 0 ? 1 : 0];

    // Berserk: 激昂 counter triggers on attack
    if (actor.id === 'berserk' && (card.type === 'attack' || card.type === 'combo') && actor.counter) {
      // Counter was already incremented by card effect if combo; if pure attack card, passive doesn't add extra
      // Recalculate power after counter
      recalcPower(actor);
    }

    // VampireLord: heal on damage dealt
    if (actor.id === 'vampire-lord' && actor.counter) {
      const didDamage = resolvedEffects.some(
        (re) => re.actingPlayerIdx === pi && re.effect.action === 'damage' && !re.nullified,
      );
      if (didDamage && actor.counter.value > 0) {
        const healAmt = actor.counter.value * 1;
        applyHeal(p.front, healAmt, events);
      }
    }

    // DeathKnight: selfHpCost was already applied; recalculate power
    if (actor.id === 'death-knight' && actor.counter) {
      recalcPower(actor);
    }

    // StormWarlock: 嵐 counter applied per status effect card (already incremented by counterAdd)
    if (actor.id === 'storm-warlock' && actor.counter) {
      recalcPower(actor);
    }

    // ChainSoldier: chain condition
    if (actor.id === 'chain-soldier' && actor.counter) {
      const isChainCard = card.effects.some(
        (e) => e.action === 'counterAdd' && e.counterName === '連鎖カウンター',
      );
      if (isChainCard && actor.lastCardWasChain) {
        actor.counter.value++;
        addEvent(events, 'counterTrigger', actor.name, actor.counter.value, `${actor.name}の連鎖が発動！カウンター${actor.counter.value}`);
      }
    }

    // ShadowAssassin: 暗殺カウンター increments on successful rear hit (counter already added by card effect)
    // Recalculate power after counter changes
    if (actor.id === 'shadow-assassin' && actor.counter) {
      recalcPower(actor);
    }

    // DoubleEdge: 連撃カウンター increments on multi-hit (counter already added by card effect)
    // Recalculate power after counter changes
    if (actor.id === 'double-edge' && actor.counter) {
      recalcPower(actor);
    }

    // BloodBerserker: recalculate HP-scaled power each turn
    if (actor.id === 'blood-berserker') {
      recalcPower(actor);
    }

    // TimeMage: auto-increment 時空カウンター on every card play (like エールダンサー)
    const rearMonster = p.rear;
    if (rearMonster.id === 'time-mage' && !rearMonster.isDead && rearMonster.counter) {
      rearMonster.counter.value++;
    }
    const frontMonster = p.front;
    if (frontMonster.id === 'time-mage' && !frontMonster.isDead && frontMonster.counter) {
      frontMonster.counter.value++;
    }
  }

  // ── Phase 5a: threshold monster checks ──
  for (let pi = 0 as 0 | 1; pi <= 1; pi++) {
    const p = s.players[pi];
    for (const m of [p.front, p.rear]) {
      if (m.isDead) continue;

      // エールダンサー: threshold=3 → all allies +1 power
      if (m.id === 'yell-dancer' && m.counter && m.counter.type === 'threshold') {
        const threshold = m.counter.threshold ?? 3;
        // Add 1 応援 for playing any card (handled here as passive)
        m.counter.value++;
        if (m.counter.value >= threshold) {
          // All living allies gain powerUp +1
          for (const ally of [p.front, p.rear]) {
            if (!ally.isDead) {
              ally.basePower += 1;
              recalcPower(ally);
              addEvent(events, 'powerChange', ally.name, ally.power, `${m.name}の応援効果！${ally.name}の攻撃力が${ally.power}になった`);
            }
          }
          m.counter.value = 0;
          addEvent(events, 'counterTrigger', m.name, 0, `${m.name}の応援カウンターが発動した`);
        }
      }

      // ルーンガードナー: threshold=4 → apply armor(2,2) to all living allies
      if (m.id === 'rune-guardian' && m.counter && m.counter.type === 'threshold') {
        const threshold = m.counter.threshold ?? 4;
        if (m.counter.value >= threshold) {
          for (const ally of [p.front, p.rear]) {
            if (!ally.isDead) {
              applyStatusToMonster(ally, 'armor', 2, 2, m.id);
            }
          }
          addEvent(events, 'counterTrigger', m.name, 0, `${m.name}が全味方にアーマーを付与！`);
          m.counter.value = 0;
        }
      }

      // 双剣の舞踏士: threshold=5 → all allies +1 power, counter reset
      if (m.id === 'twin-blade-dancer' && m.counter && m.counter.type === 'threshold') {
        const threshold = m.counter.threshold ?? 5;
        if (m.counter.value >= threshold) {
          for (const ally of [p.front, p.rear]) {
            if (!ally.isDead) {
              ally.basePower += 1;
              recalcPower(ally);
              addEvent(events, 'powerChange', ally.name, ally.power, `${m.name}の舞踏効果！${ally.name}の攻撃力が${ally.power}になった`);
            }
          }
          m.counter.value = 0;
          addEvent(events, 'counterTrigger', m.name, 0, `${m.name}の舞踏カウンターが発動した`);
        }
      }

      // 混沌の魔法使い: threshold=4 → 混沌カウンター reset, all effects +1 (represented as global powerUp)
      if (m.id === 'chaos-mage' && m.counter && m.counter.type === 'threshold') {
        const threshold = m.counter.threshold ?? 4;
        if (m.counter.value >= threshold) {
          for (const ally of [p.front, p.rear]) {
            if (!ally.isDead) {
              ally.basePower += 1;
              recalcPower(ally);
              addEvent(events, 'powerChange', ally.name, ally.power, `${m.name}の混沌爆発！${ally.name}の攻撃力が${ally.power}になった`);
            }
          }
          m.counter.value = 0;
          addEvent(events, 'counterTrigger', m.name, 0, `${m.name}の混沌カウンターが爆発した！`);
        }
      }

      // 道化師フール: threshold=3 → all allies basePower+2, counter reset
      if (m.id === 'fool-jester' && m.counter && m.counter.type === 'threshold') {
        const threshold = m.counter.threshold ?? 3;
        if (m.counter.value >= threshold) {
          for (const ally of [p.front, p.rear]) {
            if (!ally.isDead) {
              ally.basePower += 2;
              recalcPower(ally);
              addEvent(events, 'powerChange', ally.name, ally.power, `${m.name}の道化効果！${ally.name}の攻撃力が${ally.power}になった`);
            }
          }
          m.counter.value = 0;
          addEvent(events, 'counterTrigger', m.name, 0, `${m.name}の道化カウンターが発動した！`);
        }
      }

      // 影法師の人形師: threshold=3 → swap enemy front/rear
      if (m.id === 'shadow-puppeteer' && m.counter && m.counter.type === 'threshold') {
        const threshold = m.counter.threshold ?? 3;
        if (m.counter.value >= threshold) {
          const oppIdx = (pi === 0 ? 1 : 0) as 0 | 1;
          const opp = s.players[oppIdx];
          if (!opp.front.isDead && !opp.rear.isDead) {
            const tmp = opp.front;
            opp.front = opp.rear;
            opp.rear = tmp;
            opp.front.role = 'front';
            opp.rear.role = 'rear';
            addEvent(events, 'swap', opp.front.name, undefined, `${m.name}の閾値発動！敵の前後衛が強制入れ替え！`);
          }
          m.counter.value = 0;
          addEvent(events, 'counterTrigger', m.name, 0, `${m.name}の操糸カウンターが発動した！`);
        }
      }

      // ミラーセージ: threshold=4 → swap enemy front/rear AND swap own HP
      if (m.id === 'mirror-sage' && m.counter && m.counter.type === 'threshold') {
        const threshold = m.counter.threshold ?? 4;
        if (m.counter.value >= threshold) {
          const oppIdx = (pi === 0 ? 1 : 0) as 0 | 1;
          const opp = s.players[oppIdx];
          // Swap enemy
          if (!opp.front.isDead && !opp.rear.isDead) {
            const tmp = opp.front;
            opp.front = opp.rear;
            opp.rear = tmp;
            opp.front.role = 'front';
            opp.rear.role = 'rear';
            addEvent(events, 'swap', opp.front.name, undefined, `${m.name}の閾値発動！敵の前後衛が入れ替え！`);
          }
          // Swap own HP
          if (!p.front.isDead && !p.rear.isDead) {
            const frontHp = p.front.hp;
            const rearHp = p.rear.hp;
            p.front.hp = Math.min(rearHp, p.front.maxHp);
            p.rear.hp = Math.min(frontHp, p.rear.maxHp);
            addEvent(events, 'heal', p.front.name, p.front.hp, `HP鏡交換！${p.front.name}のHPが${p.front.hp}になった`);
            addEvent(events, 'heal', p.rear.name, p.rear.hp, `HP鏡交換！${p.rear.name}のHPが${p.rear.hp}になった`);
          }
          m.counter.value = 0;
          addEvent(events, 'counterTrigger', m.name, 0, `${m.name}の鏡像カウンターが発動した！`);
        }
      }

      // 激昂の獣王: threshold=4 → transform! Power surges, isTransformed = true.
      if (m.id === 'fury-beast' && m.counter && m.counter.type === 'threshold' && !m.isTransformed) {
        const threshold = m.counter.threshold ?? 4;
        if (m.counter.value >= threshold) {
          m.isTransformed = true;
          m.counter.value = 0; // reset counter after transform
          recalcPower(m);      // apply transformPowerBonus
          addEvent(events, 'transform', m.name, m.power, `${m.name}が変身した！パワーが${m.power}に覚醒！`);
        }
      }

      // 石壁の守護者: threshold=3 → apply armor(3,2t) to all living allies
      if (m.id === 'stone-wall' && m.counter && m.counter.type === 'threshold') {
        const threshold = m.counter.threshold ?? 3;
        if (m.counter.value >= threshold) {
          for (const ally of [p.front, p.rear]) {
            if (!ally.isDead) {
              applyStatusToMonster(ally, 'armor', 3, 2, m.id);
            }
          }
          m.counter.value = 0;
          addEvent(events, 'counterTrigger', m.name, 0, `${m.name}の守護発動！全味方にアーマー+3を付与！`);
        }
      }

      // 護法の双剣士: threshold=3 → ally_front armor(2,2t) + powerUp+1
      if (m.id === 'guardian-swordsman' && m.counter && m.counter.type === 'threshold') {
        const threshold = m.counter.threshold ?? 3;
        if (m.counter.value >= threshold) {
          if (!p.front.isDead) {
            applyStatusToMonster(p.front, 'armor', 2, 2, m.id);
            p.front.basePower += 1;
            recalcPower(p.front);
            addEvent(events, 'powerChange', p.front.name, p.front.power, `${m.name}の護法発動！${p.front.name}にアーマー+攻撃力+1！`);
          }
          m.counter.value = 0;
          addEvent(events, 'counterTrigger', m.name, 0, `${m.name}の護法カウンターが発動した！`);
        }
      }

      // タイムメイジ: threshold=2 → swap deck[t+1] with deck[t+2]
      if (m.id === 'time-mage' && m.counter && m.counter.type === 'threshold') {
        const threshold = m.counter.threshold ?? 2;
        if (m.counter.value >= threshold) {
          const t = p.currentTurn;
          if (t + 2 < p.deck.length) {
            const tmp = p.deck[t + 1];
            p.deck[t + 1] = p.deck[t + 2];
            p.deck[t + 2] = tmp;
            addEvent(events, 'counterTrigger', m.name, 0, `${m.name}が時間を操作！次のカード順を入れ替えた`);
          }
          m.counter.value = 0;
        }
      }
    }
  }

  // ── Phase 5b-i: Burn aura (death-knight) ──
  for (let pi = 0 as 0 | 1; pi <= 1; pi++) {
    const p = s.players[pi];
    for (const m of [p.front, p.rear]) {
      if (m.isDead || !m.counter || m.counter.type !== 'burn' || m.counter.value <= 0) continue;
      const opp = s.players[pi === 0 ? 1 : 0];
      const burnTarget = opp.front.isDead ? opp.rear : opp.front;
      if (!burnTarget.isDead) {
        applyHpDamage(burnTarget, m.counter.value, events, '業炎');
      }
    }
  }

  // ── Phase 5b: Apply-type end-of-turn damage (curse, poison) ──
  for (let pi = 0 as 0 | 1; pi <= 1; pi++) {
    const p = s.players[pi];
    for (const m of [p.front, p.rear]) {
      if (m.isDead) continue;
      for (const se of m.statusEffects) {
        if (se.type === 'curse' || se.type === 'poison') {
          applyHpDamage(m, se.value, events, se.type);
        }
      }
    }
  }

  // ── Phase 5c: Death check → Revive → Win condition ──

  // 5c-i: Mark dead
  const newlyDead: Array<{ m: MonsterState; pi: 0 | 1 }> = [];
  for (let pi = 0 as 0 | 1; pi <= 1; pi++) {
    const p = s.players[pi];
    for (const m of [p.front, p.rear]) {
      if (!m.isDead && m.hp <= 0) {
        m.isDead = true;
        addEvent(events, 'death', m.name, undefined, `${m.name}が倒れた`);
        newlyDead.push({ m, pi });
      }
    }
  }

  // 5c-ii: Revive checks for newly dead
  for (const { m, pi } of newlyDead) {
    // Phoenix revive
    if (m.id === 'phoenix-warrior' && m.canRevive && !m.hasRevived) {
      m.isDead = false;
      const reviveBonus = m.counter?.type === 'reviveBonus' ? m.counter.value : 0;
      m.hp = Math.min(m.maxHp, Math.max(1, Math.floor(m.maxHp / 2) + reviveBonus));
      m.hasRevived = true;
      if (m.counter) m.counter.value = 0;
      recalcPower(m);
      addEvent(events, 'revive', m.name, m.hp, `${m.name}が炎から蘇った！HP=${m.hp}`);
    }

    // HolyPriest revive: handled by card play 'revive' action
    // Check if a revive card was played this turn for ally_front
    const p = s.players[pi];
    const card = cards[pi];
    const hasReviveCard = card.effects.some((e) => e.action === 'revive' && e.target === 'ally_front');
    if (hasReviveCard && m === p.front && !m.canRevive) {
      m.isDead = false;
      const baseHp = Math.max(1, Math.floor(m.maxHp / 2));
      // Necromancer bonus: add 死霊カウンター value
      const necro = p.rear;
      const necroBonus = necro.counter?.type === 'reviveBonus' ? necro.counter.value : 0;
      m.hp = Math.min(m.maxHp, baseHp + necroBonus);
      addEvent(events, 'revive', m.name, m.hp, `${m.name}が蘇生された！HP=${m.hp}`);
    }
  }

  // 5c-iii: Rear monster passives on ally death
  for (let pi = 0 as 0 | 1; pi <= 1; pi++) {
    const p = s.players[pi];

    // Necromancer passive: if ally front died this turn → 死霊counter++
    const necro = p.rear;
    if (necro.id === 'necromancer' && !necro.isDead && necro.counter) {
      const frontDied = newlyDead.some((nd) => nd.pi === pi && nd.m === p.front);
      if (frontDied) {
        necro.counter.value++;
        addEvent(events, 'counterChange', necro.name, necro.counter.value, `${necro.name}の死霊カウンターが${necro.counter.value}になった`);
      }
    }

    // SoulReaper passive: any ally death → 魂counter +3, recalc power
    const soulReaper = p.rear;
    if (soulReaper.id === 'soul-reaper' && !soulReaper.isDead && soulReaper.counter) {
      const allyDeaths = newlyDead.filter((nd) => nd.pi === pi).length;
      if (allyDeaths > 0) {
        soulReaper.counter.value += allyDeaths * 3;
        recalcPower(soulReaper);
        addEvent(events, 'counterChange', soulReaper.name, soulReaper.counter.value, `${soulReaper.name}が魂を吸収！カウンター+${allyDeaths * 3} → ${soulReaper.counter.value}`);
      }
    }
  }

  // 5c-iv: Win condition
  const p0Dead = s.players[0].front.isDead && s.players[0].rear.isDead;
  const p1Dead = s.players[1].front.isDead && s.players[1].rear.isDead;

  if (p0Dead && p1Dead) {
    s.result = 'draw';
  } else if (p0Dead) {
    s.result = 'player2';
  } else if (p1Dead) {
    s.result = 'player1';
  }

  if (s.result) {
    s.phase = 'result';
  }

  // ── Phase 6: Bookkeeping ──

  // ChainSoldier: update lastCardWasChain
  for (let pi = 0 as 0 | 1; pi <= 1; pi++) {
    const p = s.players[pi];
    const actor = getActingMonster(p);
    const card = cards[pi];
    if (actor.id === 'chain-soldier') {
      actor.lastCardWasChain = card.effects.some(
        (e) => e.action === 'counterAdd' && e.counterName === '連鎖カウンター',
      );
    } else {
      actor.lastCardWasChain = false;
    }
  }

  // Apply delayed status effects → recalculate power
  for (let pi = 0 as 0 | 1; pi <= 1; pi++) {
    const p = s.players[pi];
    for (const m of [p.front, p.rear]) {
      recalcPower(m);
    }
  }

  // Decrement status durations (non-stormwind, stormwind decremented in phase 0)
  for (let pi = 0 as 0 | 1; pi <= 1; pi++) {
    const p = s.players[pi];
    for (const m of [p.front, p.rear]) {
      m.statusEffects = m.statusEffects.filter((se) => {
        if (se.type === 'stormwind') return true; // managed in phase 0
        se.duration--;
        return se.duration > 0;
      });
    }
  }

  // After decrement, recalc power again for powerUp/powerDown status effects
  for (let pi = 0 as 0 | 1; pi <= 1; pi++) {
    const p = s.players[pi];
    for (const m of [p.front, p.rear]) {
      recalcPower(m);
    }
  }

  // Increment turn
  s.turn++;

  // Update deck currentTurn
  s.players[0].currentTurn++;
  s.players[1].currentTurn++;

  const log: TurnLog = {
    turn: state.turn,
    player1Card: p1Card,
    player2Card: p2Card,
    events,
    stateAfter: s,
  };

  return { nextState: s, log };
}

// ──────────────────────────────────────────────
// Game initialization helpers
// ──────────────────────────────────────────────

export function createMonsterState(
  monster: MonsterMaster,
  assignedRole?: 'front' | 'rear',
): MonsterState {
  let counter: CounterInfo | undefined;
  if (monster.counterDef) {
    counter = {
      name: monster.counterDef.name,
      value: 0,
      type: monster.counterDef.type,
      threshold: monster.counterDef.threshold,
    };
  }
  return {
    id: monster.id,
    name: monster.name,
    role: monster.role === 'both' ? (assignedRole ?? 'front') : monster.role,
    hp: monster.hp,
    maxHp: monster.hp,
    power: monster.power,
    basePower: monster.power,
    isDead: false,
    canRevive: monster.canRevive,
    hasRevived: false,
    counter,
    statusEffects: [],
    lastCardWasChain: false,
    hpScaledPower: monster.hpScaledPower,
    transformPowerBonus: monster.transformPowerBonus,
    isTransformed: false,
  };
}
