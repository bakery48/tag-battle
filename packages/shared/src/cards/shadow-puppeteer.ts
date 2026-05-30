import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, healEffect, powerDownEffect,
  counterAddEffect, defenseEffect,
  swapPositionsEffect, swapEnemyPositionsEffect, powerVal, fixedVal,
} from './factories.js';

const MID = 'shadow-puppeteer';
const COUNTER = '操糸カウンター';

export const shadowPuppeteerCards: CardState[] = [
  // Swap own + attack + counter x3
  makeCard(MID, '人形師の入れ替え', '前後衛を入れ替え、敵前衛にパワーダメージ。操糸カウンター+1。', 'combo', [
    swapPositionsEffect(),
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '糸の一撃', '前後衛を入れ替え、敵前衛にパワーダメージ。操糸カウンター+1。', 'combo', [
    swapPositionsEffect(),
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '操糸斬り', '前後衛を入れ替え、敵前衛にパワーダメージ。操糸カウンター+1。', 'combo', [
    swapPositionsEffect(),
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Swap enemy + counter x3
  makeCard(MID, '敵陣混乱', '敵の前後衛を強制入れ替え。操糸カウンター+1。', 'combo', [
    swapEnemyPositionsEffect(),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '傀儡の命令', '敵の前後衛を強制入れ替え。操糸カウンター+1。', 'combo', [
    swapEnemyPositionsEffect(),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '支配の糸', '敵の前後衛を強制入れ替え。操糸カウンター+1。', 'combo', [
    swapEnemyPositionsEffect(),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Double swap (own + enemy) x1
  makeCard(MID, '全入れ替え', '自軍と敵軍の前後衛を同時入れ替え。操糸カウンター+1。', 'combo', [
    swapPositionsEffect(),
    swapEnemyPositionsEffect(),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Debuff x2
  makeCard(MID, '操糸の呪縛', '敵前衛の攻撃力を1下げる(遅延)。', 'debuff', [powerDownEffect(1, true)]),
  makeCard(MID, '糸の弱体', '敵前衛の攻撃力を1下げる(遅延)。', 'debuff', [powerDownEffect(1, true)]),
  // Defense x1
  makeCard(MID, '人形の盾', 'ガードする。', 'defense', [defenseEffect()]),
  // Heal x1
  makeCard(MID, '操糸の回復', '味方前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  // Attack x1
  makeCard(MID, '人形師の一撃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
];
