import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect, powerDownEffect,
  counterAddEffect, poisonEffect, powerVal,
} from './factories.js';

const MID = 'poison-doctor';
const COUNTER = '毒カウンター';

export const poisonDoctorCards: CardState[] = [
  // Poison apply x5: poison + counter
  makeCard(MID, '毒の注射', '敵前衛に毒を付与し、毒カウンター+1。', 'counter', [
    poisonEffect(1, 3),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '猛毒の薬', '敵前衛に毒を付与し、毒カウンター+1。', 'counter', [
    poisonEffect(1, 3),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '毒液散布', '敵前衛に毒を付与し、毒カウンター+1。', 'counter', [
    poisonEffect(1, 3),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '致死毒', '敵前衛に毒を付与し、毒カウンター+1。', 'counter', [
    poisonEffect(1, 3),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '毒の霧', '敵前衛に毒を付与し、毒カウンター+1。', 'counter', [
    poisonEffect(1, 3),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Debuff x3
  makeCard(MID, '解毒妨害', '敵前衛の攻撃力を1下げる（遅延）。', 'debuff', [powerDownEffect(1, true)]),
  makeCard(MID, '神経毒', '敵前衛の攻撃力を1下げる（遅延）。', 'debuff', [powerDownEffect(1, true)]),
  makeCard(MID, '麻痺毒', '敵前衛の攻撃力を1下げる（遅延）。', 'debuff', [powerDownEffect(1, true)]),
  // Attack x2
  makeCard(MID, '注射器', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '毒の一撃', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x2
  makeCard(MID, '解毒の盾', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '医術防御', 'ガードする。', 'defense', [defenseEffect()]),
];
