import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, healEffect, powerDownEffect,
  counterAddEffect, defenseEffect,
  applyStatusEffect, poisonEffect, curseEffect, stormwindEffect,
  powerVal, fixedVal,
} from './factories.js';

const MID = 'venom-mist';
const COUNTER = '毒霧カウンター';

export const venomMistCards: CardState[] = [
  // Poison + counter x3
  makeCard(MID, '猛毒の霧', '敵前衛に毒(1,3ターン)付与。毒霧カウンター+1。', 'combo', [
    poisonEffect(1, 3), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '毒霧散布', '敵前衛に毒(2,2ターン)付与。毒霧カウンター+1。', 'combo', [
    poisonEffect(2, 2), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '猛毒の一撃', '敵前衛にパワーダメージ＋毒(1,2ターン)付与。毒霧カウンター+1。', 'combo', [
    attackEffect(powerVal()), poisonEffect(1, 2), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Stormwind + counter x2
  makeCard(MID, '毒嵐の霧', '敵前衛に嵐風(2,2ターン)付与。毒霧カウンター+1。', 'combo', [
    stormwindEffect(2, 2), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '霧の嵐', '敵前衛に嵐風(1,3ターン)付与。毒霧カウンター+1。', 'combo', [
    stormwindEffect(1, 3), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Curse + counter x2
  makeCard(MID, '呪いの霧', '敵前衛に呪い(1,3ターン)付与。毒霧カウンター+1。', 'combo', [
    curseEffect(1, 3), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '濃霧の呪縛', '敵前衛に呪い(2,2ターン)付与。毒霧カウンター+1。', 'combo', [
    curseEffect(2, 2), counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Debuff x2
  makeCard(MID, '毒霧弱体', '敵前衛の攻撃力を1下げる(遅延)。', 'debuff', [powerDownEffect(1, true)]),
  makeCard(MID, '霧の侵食', '敵前衛の攻撃力を1下げる(遅延)。', 'debuff', [powerDownEffect(1, true)]),
  // Attack x1
  makeCard(MID, '毒霧の一撃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x1
  makeCard(MID, '毒霧の盾', 'ガードする。霧が攻撃を包む。', 'defense', [defenseEffect()]),
  // Heal x1
  makeCard(MID, '霧の回復', '自分のHPを3回復する。', 'heal', [healEffect(3, 'self')]),
];
