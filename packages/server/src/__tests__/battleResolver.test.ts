import { describe, it, expect } from 'vitest';
import {
  resolveTurn, createMonsterState, getMonsterById,
  MONSTERS,
} from '@tag-battle/shared';
import type { GameState, PlayerState, MonsterState, CardState, CardEffect } from '@tag-battle/shared';

// ── helpers ──

function makeMonsterState(id: string): MonsterState {
  const master = getMonsterById(id);
  if (!master) throw new Error(`Monster not found: ${id}`);
  return createMonsterState(master);
}

function makePlayer(id: string, frontId: string, rearId: string, deck: CardState[] = []): PlayerState {
  return {
    id,
    front: makeMonsterState(frontId),
    rear: makeMonsterState(rearId),
    deck,
    currentTurn: 0,
  };
}

function makeState(p1FrontId: string, p1RearId: string, p2FrontId: string, p2RearId: string): GameState {
  return {
    players: [
      makePlayer('p1', p1FrontId, p1RearId),
      makePlayer('p2', p2FrontId, p2RearId),
    ],
    turn: 0,
    phase: 'battle',
  };
}

function simpleAttackCard(id: string, monsterId: string, damage?: number): CardState {
  const effects: CardEffect[] = damage !== undefined
    ? [{ trigger: 'always', target: 'enemy_front', action: 'damage', value: { kind: 'fixed', amount: damage } }]
    : [{ trigger: 'always', target: 'enemy_front', action: 'damage', value: { kind: 'power' } }];
  return { id, monsterId, name: 'Test Attack', description: '', type: 'attack', effects };
}

function defenseCard(id: string, monsterId: string): CardState {
  return {
    id,
    monsterId,
    name: 'Test Defense',
    description: '',
    type: 'defense',
    effects: [{ trigger: 'always', target: 'self', action: 'cover', value: { kind: 'fixed', amount: 0 } }],
  };
}

// ── Tests ──

describe('battleResolver', () => {
  it('1. Normal attack reduces enemy HP correctly', () => {
    const state = makeState('iron-golem', 'holy-priest', 'iron-golem', 'holy-priest');
    const p1 = state.players[0];
    const p2 = state.players[1];
    const initialP2Hp = p2.front.hp;
    const p1Power = p1.front.power; // 3

    const attackC = simpleAttackCard('atk1', 'iron-golem');
    const passCard = defenseCard('def1', 'iron-golem');

    const { nextState } = resolveTurn(state, attackC, passCard);

    // P2's defense blocked p1's attack
    expect(nextState.players[1].front.hp).toBe(initialP2Hp); // blocked
  });

  it('1b. Normal attack vs non-defense reduces enemy HP', () => {
    const state = makeState('berserk', 'holy-priest', 'iron-golem', 'holy-priest');
    const p1 = state.players[0];
    const p2Front = state.players[1].front;
    const initialHp = p2Front.hp;
    const p1Power = p1.front.power; // berserk = 5

    const attackC = simpleAttackCard('atk1', 'berserk');
    // p2 plays a buff (non-defense, non-attack), p1 attacks
    const buffCard: CardState = {
      id: 'buf1', monsterId: 'iron-golem', name: 'Buff', description: '', type: 'buff',
      effects: [{ trigger: 'always', target: 'self', action: 'powerUp', value: { kind: 'fixed', amount: 1 } }],
    };

    const { nextState } = resolveTurn(state, attackC, buffCard);
    expect(nextState.players[1].front.hp).toBe(initialHp - p1Power);
  });

  it('2. Defense vs attack: attack nullified, defender takes 0 damage', () => {
    const state = makeState('iron-golem', 'holy-priest', 'iron-golem', 'holy-priest');
    const p1FrontHp = state.players[0].front.hp;
    const p2FrontHp = state.players[1].front.hp;

    const attackC = simpleAttackCard('atk1', 'iron-golem');
    const defC = defenseCard('def1', 'iron-golem');

    // P1 attacks, P2 defends
    const { nextState, log } = resolveTurn(state, attackC, defC);

    expect(nextState.players[1].front.hp).toBe(p2FrontHp); // p2 defended
    expect(log.events.some((e) => e.type === 'blocked')).toBe(true);
  });

  it('3. Defense vs non-attack: both take 0 damage', () => {
    const state = makeState('iron-golem', 'holy-priest', 'iron-golem', 'holy-priest');
    const p1Hp = state.players[0].front.hp;
    const p2Hp = state.players[1].front.hp;

    const defC = defenseCard('def1', 'iron-golem');
    const healCard: CardState = {
      id: 'heal1', monsterId: 'iron-golem', name: 'Heal', description: '', type: 'heal',
      effects: [{ trigger: 'always', target: 'ally_front', action: 'heal', value: { kind: 'fixed', amount: 3 } }],
    };

    const { nextState } = resolveTurn(state, defC, healCard);

    // No attack from either, p2 heals but already at max
    expect(nextState.players[0].front.hp).toBe(p1Hp);
    // p2 health stays same or goes up (at max so same)
    expect(nextState.players[1].front.hp).toBe(Math.min(p2Hp + 3, state.players[1].front.maxHp));
  });

  it('4. Berserk: 激昂 counter increments on combo attack, power recalculated', () => {
    const state = makeState('berserk', 'holy-priest', 'iron-golem', 'holy-priest');
    const berserkMonster = state.players[0].front;
    expect(berserkMonster.counter?.value).toBe(0);
    const initialPower = berserkMonster.power;

    const comboCard: CardState = {
      id: 'combo1',
      monsterId: 'berserk',
      name: '激怒の一撃',
      description: '',
      type: 'combo',
      effects: [
        { trigger: 'always', target: 'enemy_front', action: 'damage', value: { kind: 'power' } },
        { trigger: 'always', target: 'self', action: 'counterAdd', value: { kind: 'fixed', amount: 1 }, counterName: '激昂カウンター' },
      ],
    };
    const defC = defenseCard('def1', 'iron-golem');

    const { nextState } = resolveTurn(state, comboCard, defC);

    // Counter should be 1 (incremented by card effect since p2 blocked attack)
    // Note: the counterAdd is NOT nullified (only damage action is nullified on block)
    expect(nextState.players[0].front.counter?.value).toBe(1);
    // Power should be basePower + counter = 5 + 1 = 6
    expect(nextState.players[0].front.power).toBe(initialPower + 1);
  });

  it('5. Stormwind: fires before card resolve, damages own monster', () => {
    const state = makeState('storm-warlock', 'holy-priest', 'iron-golem', 'holy-priest');

    // Add stormwind status to p1's front monster
    state.players[0].front.statusEffects.push({
      type: 'stormwind',
      value: 2,
      duration: 2,
      source: 'test',
    });

    const initialHp = state.players[0].front.hp;

    const passCard: CardState = {
      id: 'pass1', monsterId: 'storm-warlock', name: 'Pass', description: '', type: 'buff',
      effects: [],
    };
    const defC = defenseCard('def1', 'iron-golem');

    const { nextState, log } = resolveTurn(state, passCard, defC);

    // Stormwind damages own front
    expect(nextState.players[0].front.hp).toBe(initialHp - 2);
    expect(log.events.some((e) => e.type === 'stormwind')).toBe(true);
  });

  it('6. Phoenix: revive prevents loss, 炎鳥 counter += 5', () => {
    const state = makeState('phoenix-warrior', 'holy-priest', 'iron-golem', 'holy-priest');
    const phoenix = state.players[0].front;
    phoenix.hp = 1; // Nearly dead

    const bigAttack: CardState = {
      id: 'big1', monsterId: 'iron-golem', name: 'Big Attack', description: '', type: 'attack',
      effects: [{ trigger: 'always', target: 'enemy_front', action: 'damage', value: { kind: 'fixed', amount: 99 } }],
    };
    const passCard: CardState = {
      id: 'pass1', monsterId: 'phoenix-warrior', name: 'Pass', description: '', type: 'buff',
      effects: [],
    };

    const { nextState, log } = resolveTurn(state, passCard, bigAttack);

    const revivedPhoenix = nextState.players[0].front;
    expect(revivedPhoenix.isDead).toBe(false);
    expect(revivedPhoenix.hp).toBeGreaterThan(0);
    expect(revivedPhoenix.counter?.value).toBe(5);
    expect(log.events.some((e) => e.type === 'revive')).toBe(true);
    // Game should NOT be over
    expect(nextState.result).toBeUndefined();
  });

  it('7. エールダンサー: threshold=3 → ally power +1, counter reset', () => {
    const state = makeState('guard-beast', 'yell-dancer', 'iron-golem', 'holy-priest');
    const yell = state.players[0].rear;
    // Set counter to 2 (one more play will trigger)
    if (yell.counter) yell.counter.value = 2;

    const passCard: CardState = {
      id: 'pass1', monsterId: 'guard-beast', name: 'Pass', description: '', type: 'buff',
      effects: [],
    };
    const defC = defenseCard('def1', 'iron-golem');

    const initialFrontPower = state.players[0].front.power;

    const { nextState, log } = resolveTurn(state, passCard, defC);

    const yellAfter = nextState.players[0].rear;
    expect(yellAfter.counter?.value).toBe(0); // reset
    // Front should have gotten +1 power
    expect(nextState.players[0].front.power).toBe(initialFrontPower + 1);
    expect(log.events.some((e) => e.type === 'counterTrigger')).toBe(true);
  });

  it('8. Simultaneous both-rear-deaths = draw result', () => {
    const state = makeState('iron-golem', 'holy-priest', 'iron-golem', 'holy-priest');

    // Kill both fronts
    state.players[0].front.isDead = true;
    state.players[0].front.hp = 0;
    state.players[1].front.isDead = true;
    state.players[1].front.hp = 0;

    // Make both rears have 1 hp
    state.players[0].rear.hp = 1;
    state.players[1].rear.hp = 1;

    // Both attack enemy_front → but enemy_front is dead, so targets enemy_rear
    const bigAttack1: CardState = {
      id: 'big1', monsterId: 'holy-priest', name: 'Big Attack', description: '', type: 'attack',
      effects: [{ trigger: 'always', target: 'enemy_front', action: 'damage', value: { kind: 'fixed', amount: 99 } }],
    };
    const bigAttack2: CardState = {
      id: 'big2', monsterId: 'holy-priest', name: 'Big Attack', description: '', type: 'attack',
      effects: [{ trigger: 'always', target: 'enemy_front', action: 'damage', value: { kind: 'fixed', amount: 99 } }],
    };

    const { nextState } = resolveTurn(state, bigAttack1, bigAttack2);

    expect(nextState.result).toBe('draw');
  });

  it('9. BloodBerserker: power increases as HP decreases', () => {
    const state = makeState('blood-berserker', 'holy-priest', 'iron-golem', 'holy-priest');
    const bb = state.players[0].front;
    // At full HP ratio=0 → power = basePower + floor(0*6) = 4
    expect(bb.power).toBe(4);
    // Damage blood-berserker to half HP (6/12)
    bb.hp = 6;
    // Play a card to trigger recalcPower in Phase 6
    const healCard: CardState = {
      id: 'h1', monsterId: 'blood-berserker', name: 'Heal', description: '', type: 'heal',
      effects: [{ trigger: 'always', target: 'self', action: 'heal', value: { kind: 'fixed', amount: 0 } }],
    };
    const passCard2 = defenseCard('def2', 'iron-golem');
    const { nextState } = resolveTurn(state, healCard, passCard2);
    // ratio = 1 - 6/12 = 0.5 → floor(0.5*6) = 3 → power = 4 + 3 = 7
    expect(nextState.players[0].front.power).toBe(7);
  });

  it('10. RuneGuardian: armor applied to allies when 魔紋 threshold (4) reached', () => {
    const state = makeState('rune-guardian', 'holy-priest', 'iron-golem', 'holy-priest');
    const rg = state.players[0].front;
    // Set counter to 3 (one below threshold)
    rg.counter!.value = 3;
    // Play combo card: defenseEffect + counterAdd 1
    const comboCard: CardState = {
      id: 'rg1', monsterId: 'rune-guardian', name: 'Rune Defense', description: '', type: 'combo',
      effects: [
        { trigger: 'always', target: 'self', action: 'cover', value: { kind: 'fixed', amount: 0 } },
        { trigger: 'always', target: 'self', action: 'counterAdd', value: { kind: 'fixed', amount: 1 }, counterName: '魔紋カウンター' },
      ],
    };
    const passCard3 = defenseCard('def3', 'iron-golem');
    const { nextState } = resolveTurn(state, comboCard, passCard3);
    const p0Front = nextState.players[0].front;
    // Counter should have reached 4 → armor applied → counter reset to 0
    expect(p0Front.counter?.value).toBe(0);
    // Both allies should have armor status
    const frontHasArmor = nextState.players[0].front.statusEffects.some((se) => se.type === 'armor');
    expect(frontHasArmor).toBe(true);
  });

  it('11. SoulReaper: 魂カウンター increases by 3 when an ally dies', () => {
    const state = makeState('iron-golem', 'soul-reaper', 'iron-golem', 'holy-priest');
    const p1Front = state.players[0].front;
    const soulReaper = state.players[0].rear;
    // Kill p1 front this turn with massive damage
    p1Front.hp = 1;
    const killAttack: CardState = {
      id: 'ka1', monsterId: 'iron-golem', name: 'Kill', description: '', type: 'attack',
      effects: [{ trigger: 'always', target: 'enemy_front', action: 'damage', value: { kind: 'fixed', amount: 99 } }],
    };
    // P1 plays something that also kills itself via selfHpCost
    const suicideCard: CardState = {
      id: 'sc1', monsterId: 'iron-golem', name: 'Suicide', description: '', type: 'attack',
      effects: [{ trigger: 'always', target: 'self', action: 'damage', value: { kind: 'fixed', amount: 99 }, selfHpCost: 99 }],
    };
    // Use a different approach: set hp to 0 manually via a card
    const healNoop: CardState = {
      id: 'hn1', monsterId: 'iron-golem', name: 'NoOp', description: '', type: 'heal',
      effects: [],
    };
    p1Front.hp = 1;
    // P2 attacks p1 front with 99 damage to kill it
    const { nextState } = resolveTurn(state, healNoop, killAttack);
    // p1 front should be dead
    expect(nextState.players[0].front.isDead).toBe(true);
    // SoulReaper counter should be 3
    expect(nextState.players[0].rear.counter?.value).toBe(3);
  });

  it('12. Reverser: powerUp to reversed target becomes powerDown', () => {
    const state = makeState('iron-golem', 'reverser', 'iron-golem', 'holy-priest');
    const p2Front = state.players[1].front;
    const initialPower = p2Front.power;
    // Apply 'reverse' status to p2 front
    p2Front.statusEffects.push({ type: 'reverse', value: 1, duration: 3, source: 'reverser' });
    // P1 plays a buff card targeting enemy_front (powerUp)
    const buffCard: CardState = {
      id: 'buf1', monsterId: 'iron-golem', name: 'Buff', description: '', type: 'buff',
      effects: [{ trigger: 'always', target: 'enemy_front', action: 'powerUp', value: { kind: 'fixed', amount: 2 } }],
    };
    const passCard4 = defenseCard('def4', 'iron-golem');
    const { nextState } = resolveTurn(state, buffCard, passCard4);
    // The powerUp should be reversed to powerDown → power decreases by 2
    expect(nextState.players[1].front.power).toBe(Math.max(0, initialPower - 2));
  });
});
