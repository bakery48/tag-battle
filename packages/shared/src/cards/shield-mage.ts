import type { CardState } from '../types.js';
import {
  makeCard, defenseEffect, healEffect, powerUpEffect, counterAddEffect,
  applyStatusEffect,
} from './factories.js';

const MID = 'shield-mage';
const COUNTER = '魔盾カウンター';

export const shieldMageCards: CardState[] = [
  // applyStatus: armor to ally_front + 魔盾カウンター +1 (x4)
  makeCard(MID, '魔法の盾', '自前衛にアーマー(2+カウンター値,2ターン)を付与。魔盾カウンター+1。', 'combo', [
    applyStatusEffect('armor', 2, 2, 'ally_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '符文の護り', '自前衛にアーマー(2+カウンター値,2ターン)を付与。魔盾カウンター+1。', 'combo', [
    applyStatusEffect('armor', 2, 2, 'ally_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '鉄壁の守護', '自前衛にアーマー(2+カウンター値,2ターン)を付与。魔盾カウンター+1。', 'combo', [
    applyStatusEffect('armor', 2, 2, 'ally_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '障壁の詠唱', '自前衛にアーマー(2+カウンター値,2ターン)を付与。魔盾カウンター+1。', 'combo', [
    applyStatusEffect('armor', 2, 2, 'ally_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // applyStatus: armor to ally_rear (x2)
  makeCard(MID, '後衛の盾', '自後衛にアーマー(2,2ターン)を付与。', 'buff', [
    applyStatusEffect('armor', 2, 2, 'ally_rear'),
  ]),
  makeCard(MID, '後方守護', '自後衛にアーマー(2,2ターン)を付与。', 'buff', [
    applyStatusEffect('armor', 2, 2, 'ally_rear'),
  ]),
  // Stronger armor to ally_front (x2)
  makeCard(MID, '強固な盾', '自前衛にアーマー(3,2ターン)を付与。', 'buff', [
    applyStatusEffect('armor', 3, 2, 'ally_front'),
  ]),
  makeCard(MID, '大魔盾', '自前衛にアーマー(3,2ターン)を付与。', 'buff', [
    applyStatusEffect('armor', 3, 2, 'ally_front'),
  ]),
  // Buff x2: ally_front powerUp 1
  makeCard(MID, '魔法強化', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '盾の鼓舞', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  // Heal x1: ally_front +3
  makeCard(MID, '盾の癒し', '自前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  // Defense x1
  makeCard(MID, '魔盾防御', 'ガードする。', 'defense', [defenseEffect()]),
];
