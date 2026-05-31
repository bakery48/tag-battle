import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, attackRearEffect, healEffect, powerUpEffect,
  counterAddEffect, defenseEffect, powerVal, fixedVal, powerMulVal,
} from './factories.js';

const MID = 'flash-assassin';
const COUNTER = '閃光カウンター';

export const flashAssassinCards: CardState[] = [
  // Attack + counter x4 (main mechanic: P:6 + counter scaling)
  makeCard(MID, '閃光の一撃', '敵前衛にパワーダメージ。閃光カウンター+1。', 'combo', [
    attackEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '光速斬り', '敵前衛にパワーダメージ。閃光カウンター+1。', 'combo', [
    attackEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '瞬刃の閃き', '敵前衛にパワーダメージ。閃光カウンター+1。', 'combo', [
    attackEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '閃光連撃', '敵前衛にパワーダメージ。閃光カウンター+1。', 'combo', [
    attackEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Rear attack + counter x2
  makeCard(MID, '閃光暗殺', '敵後衛にパワーダメージ。閃光カウンター+1。', 'combo', [
    attackRearEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '影の閃光', '敵後衛にパワーダメージ。閃光カウンター+1。', 'combo', [
    attackRearEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Pure attack x2
  makeCard(MID, '光の刃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '疾風の斬撃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Buff x1
  makeCard(MID, '閃光覚醒', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  // Defense x2
  makeCard(MID, '閃光回避', 'ガードする。光の速さで躱す。', 'defense', [defenseEffect()]),
  makeCard(MID, '瞬間防御', 'ガードする。', 'defense', [defenseEffect()]),
  // Finisher x1
  makeCard(MID, '閃光必殺', '敵前衛に固定6ダメージを与える。', 'attack', [attackEffect(fixedVal(6))]),
];
