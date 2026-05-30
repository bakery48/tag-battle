import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, healEffect, powerUpEffect, powerDownEffect,
  counterAddEffect, defenseEffect, applyStatusEffect, powerVal, fixedVal,
} from './factories.js';

const MID = 'chaos-mage';
const COUNTER = '混沌カウンター';

export const chaosMageCards: CardState[] = [
  // Chaos x4: damage enemy AND buff ally simultaneously + 混沌counter+1
  makeCard(MID, '混沌の爆発', '敵前衛に3ダメージ＆味方前衛HP+2。混沌カウンター+1。', 'combo', [
    attackEffect(fixedVal(3)),
    healEffect(2, 'ally_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '無秩序の波動', '敵前衛にパワーダメージ＆味方前衛攻撃力+1。混沌カウンター+1。', 'combo', [
    attackEffect(powerVal()),
    powerUpEffect(1, 'ally_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '混乱の渦', '敵前衛の攻撃力-1(遅延)＆味方前衛HP+3。混沌カウンター+1。', 'combo', [
    powerDownEffect(1, true),
    healEffect(3, 'ally_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '破滅と再生', '敵前衛にパワーダメージ＆味方前衛攻撃力+1＆混沌カウンター+1。', 'combo', [
    attackEffect(powerVal()),
    powerUpEffect(1, 'ally_front'),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Chaos debuff+heal x2
  makeCard(MID, '混沌の呪縛', '敵前衛にポイズン(1,2ターン)＆味方前衛HP+2。', 'combo', [
    applyStatusEffect('poison', 1, 2, 'enemy_front'),
    healEffect(2, 'ally_front'),
  ]),
  makeCard(MID, '混沌の嵐', '敵前衛に嵐風(2,2ターン)＆自分HP+2。', 'combo', [
    applyStatusEffect('stormwind', 2, 2, 'enemy_front'),
    healEffect(2, 'self'),
  ]),
  // Pure attack x2
  makeCard(MID, '混沌の一撃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '無秩序の刃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Buff x2
  makeCard(MID, '混沌の加護', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  makeCard(MID, '破滅の力', '味方前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  // Defense x1
  makeCard(MID, '混沌の盾', 'ガードする。混沌が守りを生む。', 'defense', [defenseEffect()]),
  // Heal x1
  makeCard(MID, '再生の混沌', '味方全体のHPを2回復する。', 'heal', [
    healEffect(2, 'ally_front'),
    healEffect(2, 'ally_rear'),
  ]),
];
