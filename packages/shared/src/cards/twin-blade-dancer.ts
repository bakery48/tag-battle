import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, healEffect, powerUpEffect, powerDownEffect,
  counterAddEffect, defenseEffect, onBlockDamageEffect, powerVal,
} from './factories.js';

const MID = 'twin-blade-dancer';
const COUNTER = '舞踏カウンター';

export const twinBladeDancerCards: CardState[] = [
  // Attack + counter x3
  makeCard(MID, '双剣の舞', '敵前衛にパワーダメージ。舞踏カウンター+1。閾値5で全味方パワー+1。', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '旋風斬り', '敵前衛にパワーダメージ。舞踏カウンター+1。', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '踊り子の一撃', '敵前衛にパワーダメージ。舞踏カウンター+1。', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Defense + counter x2
  makeCard(MID, '舞いの回避', 'ガードし、舞踏カウンター+1。ブロック時に敵前衛にダメージ。', 'combo', [
    defenseEffect(),
    onBlockDamageEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '優雅な防御', 'ガードし、舞踏カウンター+1。', 'combo', [
    defenseEffect(),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Heal x2
  makeCard(MID, '踊りの癒し', '味方前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  makeCard(MID, '舞踏の祝福', '味方後衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_rear')]),
  // Buff x2
  makeCard(MID, '双剣強化', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  makeCard(MID, '踊りの鼓舞', '味方前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  // Debuff x1
  makeCard(MID, '舞いの惑わし', '敵前衛の攻撃力を1下げる(遅延)。', 'debuff', [powerDownEffect(1, true)]),
  // Attack x2
  makeCard(MID, '双刃連撃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '旋回の刃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
];
