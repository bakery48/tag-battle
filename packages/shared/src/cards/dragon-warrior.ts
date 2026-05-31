import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, attackRearEffect, healEffect, powerUpEffect,
  counterAddEffect, defenseEffect, powerVal, fixedVal, powerMulVal,
} from './factories.js';

const MID = 'dragon-warrior';
const COUNTER = '龍吼カウンター';

export const dragonWarriorCards: CardState[] = [
  // Attack + counter x4
  makeCard(MID, '龍吼の一撃', '敵前衛にパワーダメージ。龍吼カウンター+1。', 'combo', [
    attackEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '龍の爪撃', '敵前衛にパワーダメージ。龍吼カウンター+1。', 'combo', [
    attackEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '龍炎斬り', '敵前衛にパワーダメージ。龍吼カウンター+1。', 'combo', [
    attackEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '龍の咆哮', '敵前衛にパワーダメージ。龍吼カウンター+1。', 'combo', [
    attackEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Rear attack + counter x2
  makeCard(MID, '龍の追撃', '敵後衛にパワーダメージ。龍吼カウンター+1。', 'combo', [
    attackRearEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '龍炎の追撃', '敵後衛にパワーダメージ。龍吼カウンター+1。', 'combo', [
    attackRearEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Pure attack x2
  makeCard(MID, '龍の剣閃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '龍吼激震', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Buff x1 + self heal x1
  makeCard(MID, '龍の覚醒', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  makeCard(MID, '龍の再生', '自分のHPを3回復する。', 'heal', [healEffect(3, 'self')]),
  // Defense x1
  makeCard(MID, '龍鱗の盾', 'ガードする。龍の鱗が守る。', 'defense', [defenseEffect()]),
  // Finisher x1
  makeCard(MID, '龍吼必殺', '敵前衛に固定7ダメージを与える。龍の力を解放。', 'attack', [attackEffect(fixedVal(7))]),
];
