import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, attackRearEffect, healEffect,
  powerUpEffect, counterAddEffect, defenseEffect, powerVal, fixedVal,
} from './factories.js';

const MID = 'shadow-clone-ninja';
const COUNTER = '忍術カウンター';

export const shadowCloneNinjaCards: CardState[] = [
  // Combo x4: attack enemy_front + 忍術counter+1
  makeCard(MID, '影分身の斬撃', '敵前衛にパワーダメージ。忍術カウンター+1。', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '忍びの一刀', '敵前衛にパワーダメージ。忍術カウンター+1。', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '分身斬り', '敵前衛にパワーダメージ。忍術カウンター+1。', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '闇の連撃', '敵前衛にパワーダメージ。忍術カウンター+1。', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Rear attack x2: damage enemy_rear (ignore cover — ninja bypasses)
  makeCard(MID, '影の追撃', '敵後衛にパワーダメージを与える（カバー無効）。', 'attack', [
    attackRearEffect(powerVal()),
  ]),
  makeCard(MID, '忍の暗殺', '敵後衛にパワーダメージを与える。', 'attack', [
    attackRearEffect(powerVal()),
  ]),
  // Buff ally x2
  makeCard(MID, '忍の加護', '味方前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '分身の力', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  // Heal x2
  makeCard(MID, '忍の回復', '自分のHPを3回復する。', 'heal', [healEffect(3, 'self')]),
  makeCard(MID, '影の癒し', '味方前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  // Defense x2
  makeCard(MID, '忍の回避', 'ガードする。影に溶け込む。', 'defense', [defenseEffect()]),
  makeCard(MID, '分身防御', 'ガードする。分身で攻撃を受ける。', 'defense', [defenseEffect()]),
];
