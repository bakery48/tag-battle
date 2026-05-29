import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect,
  powerUpEffect, counterAddEffect, powerMulVal, powerVal, fixedVal,
} from './factories.js';
import type { CardEffect } from '../types.js';

const MID = 'double-edge';
const COUNTER = '連撃カウンター';

// Multi-hit: 2 separate damage effects, each at 0.5x power (ceil applied in resolver)
// Using two separate damage effects so each triggers vampire/poison independently
function doubleHitEffects(): CardEffect[] {
  return [
    { trigger: 'always', target: 'enemy_front', action: 'damage', value: powerMulVal(0.5) },
    { trigger: 'always', target: 'enemy_front', action: 'damage', value: powerMulVal(0.5) },
    counterAddEffect(COUNTER, 1, 'self'),
  ];
}

export const doubleEdgeCards: CardState[] = [
  // Multi-hit x4: 2 damage effects + 連撃カウンター +1
  makeCard(MID, '連続斬り', '2回ヒット攻撃。各ヒット=power÷2。連撃カウンター+1。', 'combo', doubleHitEffects()),
  makeCard(MID, 'ダブルストライク', '2回ヒット攻撃。連撃カウンター+1。', 'combo', doubleHitEffects()),
  makeCard(MID, '二連の刃', '2回ヒット攻撃。連撃カウンター+1。', 'combo', doubleHitEffects()),
  makeCard(MID, '双刃の嵐', '2回ヒット攻撃。連撃カウンター+1。', 'combo', doubleHitEffects()),
  // Single attack x3
  makeCard(MID, '鋭い一撃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '両刃の剣', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '切り込み', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x2
  makeCard(MID, '両刃の防御', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '刃の壁', 'ガードする。', 'defense', [defenseEffect()]),
  // Buff x2: powerUp self
  makeCard(MID, '双刃強化', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  makeCard(MID, '連撃の覚醒', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  // Counter-only x1: 連撃カウンター +2
  makeCard(MID, '連撃の極み', '連撃カウンター+2。', 'combo', [
    counterAddEffect(COUNTER, 2, 'self'),
  ]),
];
