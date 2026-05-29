import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect, powerUpEffect,
  onBlockDamageEffect, powerVal,
} from './factories.js';

const MID = 'mirror-knight';

export const mirrorKnightCards: CardState[] = [
  // Attack x3
  makeCard(MID, '鏡の刃', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '反射剣', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '光の一撃', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense with counterattack x4
  makeCard(MID, '鏡の盾（反撃）', 'ガードし、ブロック時に反撃する。', 'defense', [
    defenseEffect(),
    onBlockDamageEffect(powerVal()),
  ]),
  makeCard(MID, '光の防壁（反撃）', 'ガードし、ブロック時に反撃する。', 'defense', [
    defenseEffect(),
    onBlockDamageEffect(powerVal()),
  ]),
  makeCard(MID, '反射バリア（反撃）', 'ガードし、ブロック時に反撃する。', 'defense', [
    defenseEffect(),
    onBlockDamageEffect(powerVal()),
  ]),
  makeCard(MID, '完全反射（反撃）', 'ガードし、ブロック時に反撃する。', 'defense', [
    defenseEffect(),
    onBlockDamageEffect(powerVal()),
  ]),
  // Plain defense x3
  makeCard(MID, '盾構え', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '光の壁', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '鏡の守り', 'ガードする。', 'defense', [defenseEffect()]),
  // Buff x2
  makeCard(MID, '光輝', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '鏡の加護', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
];
