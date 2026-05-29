import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect, healEffect,
  powerUpEffect, powerVal,
} from './factories.js';

const MID = 'barrier-maiden';

export const barrierMaidenCards: CardState[] = [
  // Defense x4
  makeCard(MID, '障壁の盾', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '光の障壁', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '完璧な防御', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '守護の壁', 'ガードする。', 'defense', [defenseEffect()]),
  // Heal x3
  makeCard(MID, '癒しの光', '自前衛のHPを4回復する。', 'heal', [healEffect(4, 'ally_front')]),
  makeCard(MID, '聖なる癒し', '自前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  makeCard(MID, '後衛の回復', '自後衛のHPを2回復する。', 'heal', [healEffect(2, 'ally_rear')]),
  // Buff x3
  makeCard(MID, '障壁の力', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '光の加護', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '後衛の祝福', '自後衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_rear')]),
  // Attack x2
  makeCard(MID, '障壁の一撃', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '光の矢', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
];
