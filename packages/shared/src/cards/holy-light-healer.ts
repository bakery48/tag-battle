import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, healEffect, powerUpEffect,
  counterAddEffect, defenseEffect, powerVal, fixedVal,
} from './factories.js';

const MID = 'holy-light-healer';
const COUNTER = '聖光カウンター';

export const holyLightHealerCards: CardState[] = [
  // Heal + counter x4 (main mechanic: healing builds counter, counter scales power via recalcPower)
  makeCard(MID, '聖光の回復', '味方前衛のHPを回復(聖光カウンター分ボーナス)。聖光カウンター+1。', 'combo', [
    healEffect(3, 'ally_front'), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '光の祝福', '味方前衛のHPを3回復。聖光カウンター+1。', 'combo', [
    healEffect(3, 'ally_front'), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '聖なる光', '味方前衛のHPを3回復。聖光カウンター+1。', 'combo', [
    healEffect(3, 'ally_front'), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '治癒の光', '味方前衛のHPを4回復。聖光カウンター+1。', 'combo', [
    healEffect(4, 'ally_front'), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Heal all x2
  makeCard(MID, '全体回復', '味方全体のHPを2回復する。', 'heal', [
    healEffect(2, 'ally_front'), healEffect(2, 'ally_rear'),
  ]),
  makeCard(MID, '聖光の恵み', '味方全体のHPを2回復する。', 'heal', [
    healEffect(2, 'ally_front'), healEffect(2, 'ally_rear'),
  ]),
  // Heal rear x1
  makeCard(MID, '後衛の癒し', '味方後衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_rear')]),
  // Attack + counter x2
  makeCard(MID, '聖光の一撃', '敵前衛にパワーダメージ。聖光カウンター+1。', 'combo', [
    attackEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '光の剣撃', '敵前衛にパワーダメージ。聖光カウンター+1。', 'combo', [
    attackEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Buff x1
  makeCard(MID, '聖光の強化', '味方前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  // Defense x1
  makeCard(MID, '光の盾', 'ガードする。聖光が守りを生む。', 'defense', [defenseEffect()]),
  // Self heal x1
  makeCard(MID, '自己回復', '自分のHPを3回復する。', 'heal', [healEffect(3, 'self')]),
];
