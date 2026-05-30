import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, healEffect, powerUpEffect,
  counterAddEffect, defenseEffect, swapPositionsEffect, powerVal, fixedVal,
} from './factories.js';

const MID = 'storm-dancer';
const COUNTER = '旋風カウンター';

export const stormDancerCards: CardState[] = [
  // Swap + delayed powerUp ally_front + counter x4
  // NOTE: effects applied in order — swap happens first, then powerUp targets new front
  makeCard(MID, '嵐の入れ替え', '前後衛を入れ替え、新前衛に+2パワー(遅延2ターン)。旋風カウンター+1。', 'combo', [
    swapPositionsEffect(),
    { trigger: 'always', target: 'ally_front', action: 'powerUp', value: fixedVal(2), delayed: true },
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '旋風の舞', '前後衛を入れ替え、新前衛に+2パワー(遅延)。旋風カウンター+1。', 'combo', [
    swapPositionsEffect(),
    { trigger: 'always', target: 'ally_front', action: 'powerUp', value: fixedVal(2), delayed: true },
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '嵐の舞踏', '前後衛を入れ替え、新前衛に+2パワー(遅延)。旋風カウンター+1。', 'combo', [
    swapPositionsEffect(),
    { trigger: 'always', target: 'ally_front', action: 'powerUp', value: fixedVal(2), delayed: true },
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '風の奇策', '前後衛を入れ替え、新前衛に+2パワー(遅延)。旋風カウンター+1。', 'combo', [
    swapPositionsEffect(),
    { trigger: 'always', target: 'ally_front', action: 'powerUp', value: fixedVal(2), delayed: true },
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Swap + attack x2
  makeCard(MID, '嵐の連撃', '前後衛を入れ替え、敵前衛にパワーダメージ。旋風カウンター+1。', 'combo', [
    swapPositionsEffect(),
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '旋風斬り', '前後衛を入れ替え、敵前衛にパワーダメージ。旋風カウンター+1。', 'combo', [
    swapPositionsEffect(),
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Pure attack x2
  makeCard(MID, '嵐の刃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '旋風の一撃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Buff x1
  makeCard(MID, '嵐の覚醒', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  // Heal x1
  makeCard(MID, '嵐の癒し', '味方前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  // Defense x2
  makeCard(MID, '嵐の回避', 'ガードする。嵐の中に消える。', 'defense', [defenseEffect()]),
  makeCard(MID, '旋風の盾', 'ガードする。', 'defense', [defenseEffect()]),
];
