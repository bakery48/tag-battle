import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect, powerDownEffect,
  counterAddEffect, curseEffect, powerVal,
} from './factories.js';

const MID = 'curse-shaman';
const COUNTER = '呪いカウンター';

export const curseShamanCards: CardState[] = [
  // Curse apply x4: curse + counter
  makeCard(MID, '呪いの印', '敵前衛に呪いを付与し、呪いカウンター+1。', 'counter', [
    curseEffect(1, 3),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '呪術の儀', '敵前衛に呪いを付与し、呪いカウンター+1。', 'counter', [
    curseEffect(1, 3),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '闇の呪縛', '敵前衛に呪いを付与し、呪いカウンター+1。', 'counter', [
    curseEffect(1, 3),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '死の呪い', '敵前衛に呪いを付与し、呪いカウンター+1。', 'counter', [
    curseEffect(1, 3),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Debuff x4
  makeCard(MID, '弱体の術', '敵前衛の攻撃力を1下げる（遅延）。', 'debuff', [powerDownEffect(1, true)]),
  makeCard(MID, '力の呪縛', '敵前衛の攻撃力を1下げる（遅延）。', 'debuff', [powerDownEffect(1, true)]),
  makeCard(MID, '闇の弱体化', '敵前衛の攻撃力を1下げる（遅延）。', 'debuff', [powerDownEffect(1, true)]),
  makeCard(MID, '呪いの弱体', '敵前衛の攻撃力を1下げる（遅延）。', 'debuff', [powerDownEffect(1, true)]),
  // Attack x2
  makeCard(MID, '呪術打', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '闇の一撃', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x2
  makeCard(MID, '呪いの盾', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '闇の護り', 'ガードする。', 'defense', [defenseEffect()]),
];
