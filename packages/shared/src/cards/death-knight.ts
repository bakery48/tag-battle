import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect, powerUpEffect,
  counterAddEffect, powerVal, fixedVal,
} from './factories.js';
import type { CardEffect } from '../types.js';

const MID = 'death-knight';
const COUNTER = '業炎カウンター';

function selfSacrificeAttack(): CardEffect[] {
  return [
    { trigger: 'always', target: 'enemy_front', action: 'damage', value: powerVal(1, 1), selfHpCost: 2 },
    counterAddEffect(COUNTER, 1, 'self'),
  ];
}

export const deathKnightCards: CardState[] = [
  // HP-cost combo x3
  makeCard(MID, '業炎斬', 'HP-2を消費し、強力に攻撃。業炎カウンター+1。', 'combo', selfSacrificeAttack()),
  makeCard(MID, '死の業炎', 'HP-2を消費し、強力に攻撃。業炎カウンター+1。', 'combo', selfSacrificeAttack()),
  makeCard(MID, '業炎解放', 'HP-2を消費し、強力に攻撃。業炎カウンター+1。', 'combo', selfSacrificeAttack()),
  // Normal attack x3
  makeCard(MID, '死の剣', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '冥府の刃', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '暗黒斬', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x2
  makeCard(MID, '死の盾', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '骸骨の壁', 'ガードする。', 'defense', [defenseEffect()]),
  // Buff x4
  makeCard(MID, '死霊強化', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  makeCard(MID, '闇の力', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  makeCard(MID, '冥府の力', '自分の攻撃力を2上げる。', 'buff', [
    { trigger: 'always', target: 'self', action: 'powerUp', value: fixedVal(2) },
  ]),
  makeCard(MID, '魂の解放', '自分の攻撃力を2上げる。', 'buff', [
    { trigger: 'always', target: 'self', action: 'powerUp', value: fixedVal(2) },
  ]),
];
