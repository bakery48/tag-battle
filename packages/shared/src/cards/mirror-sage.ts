import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, healEffect, powerDownEffect,
  counterAddEffect, defenseEffect,
  swapPositionsEffect, swapEnemyPositionsEffect, swapAlliesHpEffect,
  powerVal, fixedVal,
} from './factories.js';

const MID = 'mirror-sage';
const COUNTER = '鏡像カウンター';

export const mirrorSageCards: CardState[] = [
  // Swap + HP exchange + counter x4 (the signature combo)
  makeCard(MID, '鏡の入れ替え', '前後衛を入れ替え、両者のHPを交換。鏡像カウンター+1。', 'combo', [
    swapPositionsEffect(),
    swapAlliesHpEffect(),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '鏡像交換', '前後衛を入れ替え、両者のHPを交換。鏡像カウンター+1。', 'combo', [
    swapPositionsEffect(),
    swapAlliesHpEffect(),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '生命の鏡', '前後衛を入れ替え、両者のHPを交換。鏡像カウンター+1。', 'combo', [
    swapPositionsEffect(),
    swapAlliesHpEffect(),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '鏡の奇跡', '前後衛を入れ替え、両者のHPを交換。鏡像カウンター+1。', 'combo', [
    swapPositionsEffect(),
    swapAlliesHpEffect(),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Swap + attack x2
  makeCard(MID, '鏡の斬撃', '前後衛を入れ替え、敵前衛にパワーダメージ。鏡像カウンター+1。', 'combo', [
    swapPositionsEffect(),
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '鏡像の刃', '前後衛を入れ替え、敵前衛にパワーダメージ。鏡像カウンター+1。', 'combo', [
    swapPositionsEffect(),
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Swap enemy + counter x2
  makeCard(MID, '鏡の支配', '敵の前後衛を強制入れ替え。鏡像カウンター+1。', 'combo', [
    swapEnemyPositionsEffect(),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '鏡面反転', '敵の前後衛を強制入れ替え。鏡像カウンター+1。', 'combo', [
    swapEnemyPositionsEffect(),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Pure attack x1
  makeCard(MID, '鏡の一撃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Debuff x1
  makeCard(MID, '鏡の呪縛', '敵前衛の攻撃力を1下げる(遅延)。', 'debuff', [powerDownEffect(1, true)]),
  // Defense x1
  makeCard(MID, '鏡面の盾', 'ガードする。鏡で攻撃を反射する。', 'defense', [defenseEffect()]),
  // Heal x1
  makeCard(MID, '鏡の癒し', '味方前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
];
