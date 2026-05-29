import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect, powerDownEffect,
  counterAddEffect, applyStatusEffect, powerVal,
} from './factories.js';

const MID = 'reverser';
const COUNTER = '逆転カウンター';

export const reverserCards: CardState[] = [
  // applyStatus: reverse to enemy_front + 逆転カウンター +1 (x4)
  makeCard(MID, '逆転の呪い', '敵前衛にリバース(3ターン)を付与。逆転カウンター+1。バフを呪いに変える。', 'combo', [
    applyStatusEffect('reverse', 1, 3, 'enemy_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '反転魔法', '敵前衛にリバース(3ターン)を付与。逆転カウンター+1。', 'combo', [
    applyStatusEffect('reverse', 1, 3, 'enemy_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '呪いの反転', '敵前衛にリバース(3ターン)を付与。逆転カウンター+1。', 'combo', [
    applyStatusEffect('reverse', 1, 3, 'enemy_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '逆転の刻印', '敵前衛にリバース(3ターン)を付与。逆転カウンター+1。', 'combo', [
    applyStatusEffect('reverse', 1, 3, 'enemy_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // applyStatus: reverse to enemy_rear (x2)
  makeCard(MID, '後衛反転', '敵後衛にリバース(3ターン)を付与。', 'debuff', [
    applyStatusEffect('reverse', 1, 3, 'enemy_rear'),
  ]),
  makeCard(MID, '影の逆転', '敵後衛にリバース(3ターン)を付与。', 'debuff', [
    applyStatusEffect('reverse', 1, 3, 'enemy_rear'),
  ]),
  // Debuff x3: enemy_front powerDown 1, delayed
  makeCard(MID, '力の封印', '敵前衛の攻撃力を1下げる(遅延)。', 'debuff', [powerDownEffect(1, true)]),
  makeCard(MID, '弱体の呪い', '敵前衛の攻撃力を1下げる(遅延)。', 'debuff', [powerDownEffect(1, true)]),
  makeCard(MID, '逆転の弱体', '敵前衛の攻撃力を1下げる(遅延)。', 'debuff', [powerDownEffect(1, true)]),
  // Attack x2
  makeCard(MID, '逆転の一撃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '反転斬り', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x1
  makeCard(MID, '逆転防御', 'ガードする。', 'defense', [defenseEffect()]),
];
