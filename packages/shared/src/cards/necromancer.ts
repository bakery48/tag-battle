import type { CardState, CardEffect } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect, healEffect,
  powerUpEffect, counterAddEffect, powerVal, fixedVal,
} from './factories.js';

const MID = 'necromancer';
const COUNTER = '死霊カウンター';

const reviveWithCounterEffect: CardEffect = {
  trigger: 'always',
  target: 'ally_front',
  action: 'revive',
  value: fixedVal(0),
};

export const necromancerCards: CardState[] = [
  // Revive x1
  makeCard(MID, '死者召喚', '自前衛を蘇生する（死霊カウンター値分のHPボーナス）。', 'heal', [reviveWithCounterEffect]),
  // 死霊-build x3: buff + counter
  makeCard(MID, '死霊強化', '自前衛の攻撃力を1上げ、死霊カウンター+1。', 'combo', [
    powerUpEffect(1, 'ally_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '死霊の呼び声', '自前衛の攻撃力を1上げ、死霊カウンター+1。', 'combo', [
    powerUpEffect(1, 'ally_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '魂の蓄積', '自前衛の攻撃力を1上げ、死霊カウンター+1。', 'combo', [
    powerUpEffect(1, 'ally_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Buff x3
  makeCard(MID, '魔力付与', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '死霊の加護', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '魂の力', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  // Attack x2
  makeCard(MID, '死霊打', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '魂の一撃', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x2
  makeCard(MID, '骸骨の盾', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '死霊の護り', 'ガードする。', 'defense', [defenseEffect()]),
  // Heal x1
  makeCard(MID, '死霊の回復', '自前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
];
