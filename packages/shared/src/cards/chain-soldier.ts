import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect, powerUpEffect,
  counterAddEffect, counterRefVal, powerVal,
} from './factories.js';
import type { CardEffect } from '../types.js';

const MID = 'chain-soldier';
const COUNTER = '連鎖カウンター';

// Chain-build cards: attack + counterAdd 連鎖カウンター (these trigger lastCardWasChain)
function chainBuildEffects(): CardEffect[] {
  return [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ];
}

// Chain-blast: damage using counterRef (power × counter.value)
function chainBlastEffect(): CardEffect {
  return {
    trigger: 'always',
    target: 'enemy_front',
    action: 'damage',
    value: counterRefVal(1),
  };
}

export const chainSoldierCards: CardState[] = [
  // Normal attack x2
  makeCard(MID, '連撃', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '鎖の一撃', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Chain-build x4
  makeCard(MID, '連鎖蓄積', '攻撃し、連鎖カウンター+1。', 'combo', chainBuildEffects()),
  makeCard(MID, '鎖の連打', '攻撃し、連鎖カウンター+1。', 'combo', chainBuildEffects()),
  makeCard(MID, '鎖の嵐', '攻撃し、連鎖カウンター+1。', 'combo', chainBuildEffects()),
  makeCard(MID, '連鎖強化', '攻撃し、連鎖カウンター+1。', 'combo', chainBuildEffects()),
  // Chain-blast x3: counterRef damage
  makeCard(MID, '連鎖爆発', '連鎖カウンター×攻撃力のダメージを与える。', 'attack', [chainBlastEffect()]),
  makeCard(MID, '鎖の解放', '連鎖カウンター×攻撃力のダメージを与える。', 'attack', [chainBlastEffect()]),
  makeCard(MID, '連鎖開放', '連鎖カウンター×攻撃力のダメージを与える。', 'attack', [chainBlastEffect()]),
  // Defense x2
  makeCard(MID, '鎖の盾', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '防衛態勢', 'ガードする。', 'defense', [defenseEffect()]),
  // Buff x1
  makeCard(MID, '連鎖の力', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
];
