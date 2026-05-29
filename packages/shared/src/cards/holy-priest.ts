import type { CardState, CardEffect } from '../types.js';
import {
  makeCard, defenseEffect, healEffect, powerUpEffect, fixedVal,
} from './factories.js';

const MID = 'holy-priest';

const reviveEffect: CardEffect = {
  trigger: 'always',
  target: 'ally_front',
  action: 'revive',
  value: fixedVal(0),
};

export const holyPriestCards: CardState[] = [
  // Heal x4: ally_front +3
  makeCard(MID, '聖なる癒し', '自前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  makeCard(MID, '光の加護', '自前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  makeCard(MID, '清らかな祈り', '自前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  makeCard(MID, '聖域の恵み', '自前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  // Heal large x3: ally_front +5
  makeCard(MID, '大回復', '自前衛のHPを5回復する。', 'heal', [healEffect(5, 'ally_front')]),
  makeCard(MID, '聖光の癒し', '自前衛のHPを5回復する。', 'heal', [healEffect(5, 'ally_front')]),
  makeCard(MID, '奇跡の回復', '自前衛のHPを5回復する。', 'heal', [healEffect(5, 'ally_front')]),
  // Revive x1
  makeCard(MID, '蘇生の奇跡', '自前衛モンスターをHP半分で蘇生する。', 'heal', [reviveEffect]),
  // Buff x2
  makeCard(MID, '神の加護', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '聖の祝福', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  // Defense x2
  makeCard(MID, '聖盾', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '光の守り', 'ガードする。', 'defense', [defenseEffect()]),
];
