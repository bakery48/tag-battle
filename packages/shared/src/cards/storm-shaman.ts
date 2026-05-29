import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect, powerDownEffect,
  counterAddEffect, stormwindEffect, powerVal,
} from './factories.js';

const MID = 'storm-shaman';
const COUNTER = '烈風カウンター';

export const stormShamanCards: CardState[] = [
  // Stormwind combo x4: attack + stormwind + counter
  makeCard(MID, '烈風の刃', '攻撃し、嵐風を付与し、烈風カウンター+1。', 'combo', [
    attackEffect(powerVal()),
    stormwindEffect(1, 3, 'enemy_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '嵐の術', '攻撃し、嵐風を付与し、烈風カウンター+1。', 'combo', [
    attackEffect(powerVal()),
    stormwindEffect(1, 3, 'enemy_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '暴風の一撃', '攻撃し、嵐風を付与し、烈風カウンター+1。', 'combo', [
    attackEffect(powerVal()),
    stormwindEffect(1, 3, 'enemy_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '烈風の嵐', '攻撃し、嵐風を付与し、烈風カウンター+1。', 'combo', [
    attackEffect(powerVal()),
    stormwindEffect(1, 3, 'enemy_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Normal attack x4
  makeCard(MID, '風の一撃', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '嵐撃', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '烈風打', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '暴風の矢', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x2
  makeCard(MID, '風の盾', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '嵐の護り', 'ガードする。', 'defense', [defenseEffect()]),
  // Debuff x2
  makeCard(MID, '烈風弱体', '敵前衛の攻撃力を1下げる（遅延）。', 'debuff', [powerDownEffect(1, true)]),
  makeCard(MID, '嵐の呪縛', '敵前衛の攻撃力を1下げる（遅延）。', 'debuff', [powerDownEffect(1, true)]),
];
