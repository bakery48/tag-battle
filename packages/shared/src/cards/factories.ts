import type { CardState, CardEffect, CardType, EffectValue, CardEffectTarget } from '../types.js';

let _idCounter = 0;
function genId(monsterId: string, suffix: string): string {
  return `${monsterId}-${suffix}-${++_idCounter}`;
}

export function makeCard(
  monsterId: string,
  name: string,
  description: string,
  type: CardType,
  effects: CardEffect[],
  idSuffix?: string,
): CardState {
  return {
    id: genId(monsterId, idSuffix ?? name),
    monsterId,
    name,
    description,
    type,
    effects,
  };
}

export function fixedVal(amount: number): EffectValue {
  return { kind: 'fixed', amount };
}

export function powerVal(factor?: number, bonus?: number): EffectValue {
  return { kind: 'power', factor, bonus };
}

export function powerMulVal(factor: number): EffectValue {
  return { kind: 'powerMul', factor };
}

export function counterRefVal(multiplier?: number): EffectValue {
  return { kind: 'counterRef', multiplier };
}

export function attackEffect(value: EffectValue = powerVal()): CardEffect {
  return { trigger: 'always', target: 'enemy_front', action: 'damage', value };
}

export function attackRearEffect(value: EffectValue = powerVal()): CardEffect {
  return { trigger: 'always', target: 'enemy_rear', action: 'damage', value };
}

export function defenseEffect(): CardEffect {
  return { trigger: 'always', target: 'self', action: 'defense', value: fixedVal(0) };
}

export function healEffect(amount: number, target: 'ally_front' | 'ally_rear' | 'self' = 'ally_front'): CardEffect {
  return { trigger: 'always', target, action: 'heal', value: fixedVal(amount) };
}

export function powerUpEffect(amount: number, target: 'self' | 'ally_front' | 'ally_rear' | 'ally_all' = 'self'): CardEffect {
  return { trigger: 'always', target, action: 'powerUp', value: fixedVal(amount) };
}

export function powerDownEffect(amount: number, delayed = true): CardEffect {
  return { trigger: 'always', target: 'enemy_front', action: 'powerDown', value: fixedVal(amount), delayed };
}

export function counterAddEffect(counterName: string, amount: number, target: 'self' | 'ally_front' | 'ally_rear' = 'self'): CardEffect {
  return { trigger: 'always', target, action: 'counterAdd', value: fixedVal(amount), counterName };
}

export function onBlockDamageEffect(value: EffectValue = powerVal()): CardEffect {
  return { trigger: 'onBlock', target: 'enemy_front', action: 'damage', value };
}

/**
 * Encode a debuff application as a counterAdd with a special counterName.
 * Format: __status__<type>__<duration>
 * The battle resolver decodes this and applies the debuff to the target.
 */
export function applyStatusEffect(
  statusType: string,
  statusValue: number,
  duration: number,
  target: CardEffectTarget = 'enemy_front',
): CardEffect {
  return {
    trigger: 'always',
    target,
    action: 'counterAdd',
    value: fixedVal(statusValue),
    counterName: `__status__${statusType}__${duration}`,
  };
}

// Luna: effect that fires only when monster is in a specific position
export function positionEffect(
  trigger: 'front' | 'rear',
  effect: CardEffect,
): CardEffect {
  return { ...effect, positionTrigger: trigger };
}

// fury-beast: effect that fires only in normal (pre-transform) state
export function normalEffect(effect: CardEffect): CardEffect {
  return { ...effect, transformTrigger: 'normal' };
}

// fury-beast: effect that fires only in transformed state
export function transformedEffect(effect: CardEffect): CardEffect {
  return { ...effect, transformTrigger: 'transformed' };
}

export function swapPositionsEffect(): CardEffect {
  return { trigger: 'always', target: 'self', action: 'swapPositions', value: fixedVal(0) };
}

export function swapEnemyPositionsEffect(): CardEffect {
  return { trigger: 'always', target: 'self', action: 'swapEnemyPositions', value: fixedVal(0) };
}

export function swapAlliesHpEffect(): CardEffect {
  return { trigger: 'always', target: 'self', action: 'swapAlliesHp', value: fixedVal(0) };
}

export function stormwindEffect(value: number, duration: number, target: CardEffectTarget = 'enemy_front'): CardEffect {
  return applyStatusEffect('stormwind', value, duration, target);
}

export function curseEffect(value: number, duration: number): CardEffect {
  return applyStatusEffect('curse', value, duration, 'enemy_front');
}

export function poisonEffect(value: number, duration: number): CardEffect {
  return applyStatusEffect('poison', value, duration, 'enemy_front');
}
