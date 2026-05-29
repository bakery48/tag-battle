import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect, healEffect,
  powerUpEffect, powerDownEffect, powerVal,
} from './factories.js';

const MID = 'iron-golem';

export const ironGolemCards: CardState[] = [
  // Attacks x3
  makeCard(MID, '鉄拳', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '剛腕打', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '岩砕き', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x3
  makeCard(MID, '鉄壁', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '堅固', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '城壁', 'ガードする。', 'defense', [defenseEffect()]),
  // Heal x2
  makeCard(MID, '自己修復', '自前衛のHPを4回復する。', 'heal', [healEffect(4, 'ally_front')]),
  makeCard(MID, '応急処置', '自前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  // Debuff x2
  makeCard(MID, '鈍足化', '敵前衛の攻撃力を1下げる（遅延）。', 'debuff', [powerDownEffect(1, true)]),
  makeCard(MID, '重圧', '敵前衛の攻撃力を1下げる（遅延）。', 'debuff', [powerDownEffect(1, true)]),
  // Buff x2
  makeCard(MID, '鍛錬', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '激励', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
];
