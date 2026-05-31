import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, powerUpEffect, powerVal,
} from './factories.js';

const MID = 'berserk';

export const berserkCards: CardState[] = [
  // Combo x4: power damage + self powerUp 1
  makeCard(MID, '激怒の一撃', '攻撃し、自分のパワーを1上げる。', 'combo', [
    attackEffect(powerVal()),
    powerUpEffect(1, 'self'),
  ]),
  makeCard(MID, '狂乱打', '攻撃し、自分のパワーを1上げる。', 'combo', [
    attackEffect(powerVal()),
    powerUpEffect(1, 'self'),
  ]),
  makeCard(MID, '怒りの嵐', '攻撃し、自分のパワーを1上げる。', 'combo', [
    attackEffect(powerVal()),
    powerUpEffect(1, 'self'),
  ]),
  makeCard(MID, '暴走突撃', '攻撃し、自分のパワーを1上げる。', 'combo', [
    attackEffect(powerVal()),
    powerUpEffect(1, 'self'),
  ]),
  // Attack x4: power+1 damage
  makeCard(MID, '猛攻', '敵前衛にダメージ+1を与える。', 'attack', [attackEffect(powerVal(1, 1))]),
  makeCard(MID, '猛撃', '敵前衛にダメージ+1を与える。', 'attack', [attackEffect(powerVal(1, 1))]),
  makeCard(MID, '強襲', '敵前衛にダメージ+1を与える。', 'attack', [attackEffect(powerVal(1, 1))]),
  makeCard(MID, '乱撃', '敵前衛にダメージ+1を与える。', 'attack', [attackEffect(powerVal(1, 1))]),
  // Buff x4
  makeCard(MID, '気合い', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  makeCard(MID, '闘志', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  makeCard(MID, '雄叫び', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  makeCard(MID, '戦意高揚', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
];
