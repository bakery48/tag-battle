import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, attackRearEffect, defenseEffect,
  powerUpEffect, counterAddEffect, powerVal,
} from './factories.js';

const MID = 'shadow-assassin';
const COUNTER = '暗殺カウンター';

export const shadowAssassinCards: CardState[] = [
  // Combo x4: damage enemy_rear + 暗殺カウンター +1
  makeCard(MID, '暗殺の刃', '敵後衛を直接攻撃し、暗殺カウンター+1。', 'combo', [
    attackRearEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '影の一突き', '敵後衛を直接攻撃し、暗殺カウンター+1。', 'combo', [
    attackRearEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '暗闇の刺客', '敵後衛を直接攻撃し、暗殺カウンター+1。', 'combo', [
    attackRearEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '影から死', '敵後衛を直接攻撃し、暗殺カウンター+1。暗殺成功。', 'combo', [
    attackRearEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Attack x4: power damage to enemy_front
  makeCard(MID, '影斬り', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '素早い一撃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '暗殺者の剣', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '闇の切っ先', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x2
  makeCard(MID, '影隠れ', 'ガードする。影の中に潜む。', 'defense', [defenseEffect()]),
  makeCard(MID, '暗闇の回避', 'ガードする。闇に溶け込む。', 'defense', [defenseEffect()]),
  // Buff x2: powerUp self
  makeCard(MID, '暗殺の覚醒', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  makeCard(MID, '影の強化', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
];
