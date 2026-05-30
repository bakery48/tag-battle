import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, healEffect, powerUpEffect,
  counterAddEffect, defenseEffect, swapPositionsEffect, powerVal, fixedVal,
} from './factories.js';

const MID = 'fool-jester';
const COUNTER = '道化カウンター';

export const foolJesterCards: CardState[] = [
  // Swap + attack + counter x4
  makeCard(MID, '道化の入れ替え斬り', '前後衛を入れ替え、敵前衛にパワーダメージ。道化カウンター+1。', 'combo', [
    swapPositionsEffect(),
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '混乱の一撃', '前後衛を入れ替え、敵前衛にパワーダメージ。道化カウンター+1。', 'combo', [
    swapPositionsEffect(),
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '道化の奇策', '前後衛を入れ替え、敵前衛にパワーダメージ。道化カウンター+1。', 'combo', [
    swapPositionsEffect(),
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '笑いの剣閃', '前後衛を入れ替え、敵前衛にパワーダメージ。道化カウンター+1。', 'combo', [
    swapPositionsEffect(),
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Swap + buff front + counter x2
  makeCard(MID, '道化の補強', '前後衛を入れ替え、新しい前衛の攻撃力+1。道化カウンター+1。', 'combo', [
    swapPositionsEffect(),
    powerUpEffect(1, 'ally_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '入れ替えの儀', '前後衛を入れ替え、新しい前衛の攻撃力+1。道化カウンター+1。', 'combo', [
    swapPositionsEffect(),
    powerUpEffect(1, 'ally_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Pure attack x2
  makeCard(MID, '道化の笑撃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '混乱の剣', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x2
  makeCard(MID, '道化の回避', 'ガードする。混乱で攻撃を躱す。', 'defense', [defenseEffect()]),
  makeCard(MID, '笑いの盾', 'ガードする。', 'defense', [defenseEffect()]),
  // Heal x1
  makeCard(MID, '道化の癒し', '自分のHPを3回復する。', 'heal', [healEffect(3, 'self')]),
  // Counter boost x1
  makeCard(MID, '道化の極み', '前後衛を入れ替え、道化カウンター+2。閾値3で全味方パワー+2。', 'combo', [
    swapPositionsEffect(),
    counterAddEffect(COUNTER, 2, 'self'),
  ]),
];
