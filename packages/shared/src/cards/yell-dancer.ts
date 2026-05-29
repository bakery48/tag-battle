import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect, healEffect,
  powerUpEffect, counterAddEffect, powerVal, fixedVal,
} from './factories.js';
import type { CardEffect } from '../types.js';

const MID = 'yell-dancer';
const COUNTER = '応援カウンター';

const yellCounterAdd: CardEffect = counterAddEffect(COUNTER, 1, 'self');

export const yellDancerCards: CardState[] = [
  // Buff x3: ally_all +1, ally_all +1, ally_front +2
  makeCard(MID, '応援の歌', '全味方の攻撃力を1上げる。', 'buff', [
    { trigger: 'always', target: 'ally_all', action: 'powerUp', value: fixedVal(1) },
  ]),
  makeCard(MID, '鼓舞の踊り', '全味方の攻撃力を1上げる。', 'buff', [
    { trigger: 'always', target: 'ally_all', action: 'powerUp', value: fixedVal(1) },
  ]),
  makeCard(MID, '応援の炎', '自前衛の攻撃力を2上げる。', 'buff', [powerUpEffect(2, 'ally_front')]),
  // Attack x3
  makeCard(MID, '踊り子の一撃', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '応援打', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '鼓舞の蹴り', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Heal x2
  makeCard(MID, '癒しの踊り', '自前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  makeCard(MID, '応援の加護', '自前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  // Defense x2
  makeCard(MID, '軽やかな回避', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '踊りの守り', 'ガードする。', 'defense', [defenseEffect()]),
  // Combo: buff + 応援 counter x2
  makeCard(MID, '応援の極み', '自前衛の攻撃力を1上げ、応援カウンター+1。', 'combo', [
    powerUpEffect(1, 'ally_front'),
    yellCounterAdd,
  ]),
  makeCard(MID, '鼓舞の連携', '自前衛の攻撃力を1上げ、応援カウンター+1。', 'combo', [
    powerUpEffect(1, 'ally_front'),
    yellCounterAdd,
  ]),
];
