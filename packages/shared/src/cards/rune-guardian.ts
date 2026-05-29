import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect, healEffect,
  powerUpEffect, counterAddEffect, onBlockDamageEffect, powerVal,
} from './factories.js';

const MID = 'rune-guardian';
const COUNTER = '魔紋カウンター';

export const runeGuardianCards: CardState[] = [
  // Attack x2
  makeCard(MID, '魔紋の一撃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '刻印の剣', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x4: block + 魔紋カウンター +1
  makeCard(MID, '魔紋の盾', 'ガードし、魔紋カウンター+1。閾値4でアーマー付与。', 'combo', [
    defenseEffect(),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '符文防御', 'ガードし、魔紋カウンター+1。', 'combo', [
    defenseEffect(),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '古代の守護', 'ガードし、魔紋カウンター+1。', 'combo', [
    defenseEffect(),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '刻印の壁', 'ガードし、魔紋カウンター+1。', 'combo', [
    defenseEffect(),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Defense + onBlock counterattack x2
  makeCard(MID, '魔紋反撃', 'ガードし、ブロック時に敵前衛にダメージ+魔紋カウンター+1。', 'combo', [
    defenseEffect(),
    onBlockDamageEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '符文の反撃', 'ガードし、ブロック時に敵前衛にダメージ+魔紋カウンター+1。', 'combo', [
    defenseEffect(),
    onBlockDamageEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Heal x2: ally_front +3
  makeCard(MID, '魔紋の癒し', '自前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  makeCard(MID, '守護の光', '自前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  // Buff x2: ally_front powerUp 1
  makeCard(MID, '魔紋強化', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '符文の力', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
];
