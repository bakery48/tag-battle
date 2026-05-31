import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, attackRearEffect, healEffect, powerUpEffect,
  counterAddEffect, defenseEffect, onBlockDamageEffect,
  applyStatusEffect, powerVal, fixedVal,
} from './factories.js';

const MID = 'guardian-swordsman';
const COUNTER = '護法カウンター';

export const guardianSwordsmanCards: CardState[] = [
  // Attack + counter x3
  makeCard(MID, '護法の斬撃', '敵前衛にパワーダメージ。護法カウンター+1。閾値3で味方強化。', 'combo', [
    attackEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '双剣連斬', '敵前衛にパワーダメージ。護法カウンター+1。', 'combo', [
    attackEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '護法の突き', '敵前衛にパワーダメージ。護法カウンター+1。', 'combo', [
    attackEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Defense + onBlock + counter x2
  makeCard(MID, '護法の防御', 'ガードし、ブロック時に敵前衛にダメージ+護法カウンター+1。', 'combo', [
    defenseEffect(), onBlockDamageEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '双剣の盾', 'ガードし、ブロック時に敵前衛にダメージ+護法カウンター+1。', 'combo', [
    defenseEffect(), onBlockDamageEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Defense x1
  makeCard(MID, '堅固な守り', 'ガードする。', 'defense', [defenseEffect()]),
  // Heal x2
  makeCard(MID, '護法の癒し', '味方前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  makeCard(MID, '双剣の回復', '味方後衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_rear')]),
  // Buff x2
  makeCard(MID, '護法強化', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  makeCard(MID, '護法の鼓舞', '味方前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  // Pure attack x1
  makeCard(MID, '護法必殺', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Rear attack x1
  makeCard(MID, '護法の裏刃', '敵後衛にパワーダメージを与える。', 'attack', [attackRearEffect(powerVal())]),
];
