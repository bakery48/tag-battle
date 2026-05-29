import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect, powerUpEffect,
  counterAddEffect, curseEffect, powerVal,
} from './factories.js';

const MID = 'storm-warlock';
const COUNTER = '嵐カウンター';

export const stormWarlockCards: CardState[] = [
  // Status attack x4: power damage + curse on enemy_front
  makeCard(MID, '呪嵐の魔術', '攻撃し、敵前衛に呪い(1)を付与。', 'combo', [
    attackEffect(powerVal()),
    curseEffect(1, 2),
  ]),
  makeCard(MID, '嵐の審判', '攻撃し、敵前衛に呪い(1)を付与。', 'combo', [
    attackEffect(powerVal()),
    curseEffect(1, 2),
  ]),
  makeCard(MID, '呪いの嵐', '攻撃し、敵前衛に呪い(1)を付与。', 'combo', [
    attackEffect(powerVal()),
    curseEffect(1, 2),
  ]),
  makeCard(MID, '魔法の暴風', '攻撃し、敵前衛に呪い(1)を付与。', 'combo', [
    attackEffect(powerVal()),
    curseEffect(1, 2),
  ]),
  // Normal attack x2
  makeCard(MID, '雷撃', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '嵐の一撃', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x2
  makeCard(MID, '嵐の盾', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '魔法障壁', 'ガードする。', 'defense', [defenseEffect()]),
  // Buff x2
  makeCard(MID, '嵐の力', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '魔力増幅', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  // Counter combo x2: attack + 嵐 counter
  makeCard(MID, '嵐蓄積', '攻撃し、嵐カウンター+1。', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '嵐解放', '攻撃し、嵐カウンター+1。', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
];
