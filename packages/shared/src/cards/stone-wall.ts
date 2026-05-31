import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, healEffect, powerUpEffect,
  counterAddEffect, defenseEffect, onBlockDamageEffect,
  applyStatusEffect, powerVal, fixedVal,
} from './factories.js';

const MID = 'stone-wall';
const COUNTER = '守護カウンター';

export const stoneWallCards: CardState[] = [
  // Defense + counter x4
  makeCard(MID, '石壁の防御', 'ガードし、守護カウンター+1。閾値3で全味方アーマー付与。', 'combo', [
    defenseEffect(), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '岩盤の守り', 'ガードし、守護カウンター+1。', 'combo', [
    defenseEffect(), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '城壁の構え', 'ガードし、守護カウンター+1。', 'combo', [
    defenseEffect(), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '堅牢なる盾', 'ガードし、守護カウンター+1。', 'combo', [
    defenseEffect(), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Defense + onBlock + counter x2
  makeCard(MID, '反撃の壁', 'ガードし、ブロック時に敵前衛にダメージ+守護カウンター+1。', 'combo', [
    defenseEffect(), onBlockDamageEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '守護の反撃', 'ガードし、ブロック時に敵前衛にダメージ+守護カウンター+1。', 'combo', [
    defenseEffect(), onBlockDamageEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Armor apply x2
  makeCard(MID, '鉄壁付与', '味方前衛にアーマー(2,2ターン)を付与する。', 'buff', [
    applyStatusEffect('armor', 2, 2, 'ally_front'),
  ]),
  makeCard(MID, '守護の加護', '味方後衛にアーマー(2,2ターン)を付与する。', 'buff', [
    applyStatusEffect('armor', 2, 2, 'ally_rear'),
  ]),
  // Heal x2
  makeCard(MID, '石壁の癒し', '味方前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  makeCard(MID, '守護の回復', '自分のHPを3回復する。', 'heal', [healEffect(3, 'self')]),
  // Buff x1
  makeCard(MID, '守護の鼓舞', '味方前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  // Attack x1
  makeCard(MID, '石壁の一撃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
];
