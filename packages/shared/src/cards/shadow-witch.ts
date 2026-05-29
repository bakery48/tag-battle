import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, attackRearEffect, defenseEffect,
  powerUpEffect, powerVal,
} from './factories.js';

const MID = 'shadow-witch';

export const shadowWitchCards: CardState[] = [
  // Rear attacks x4
  makeCard(MID, '影の一撃', '敵後衛に直接ダメージを与える。', 'attack', [attackRearEffect(powerVal())]),
  makeCard(MID, '暗黒矢', '敵後衛に直接ダメージを与える。', 'attack', [attackRearEffect(powerVal())]),
  makeCard(MID, '影の穿ち', '敵後衛に直接ダメージを与える。', 'attack', [attackRearEffect(powerVal())]),
  makeCard(MID, '闇の呪弾', '敵後衛に直接ダメージを与える。', 'attack', [attackRearEffect(powerVal())]),
  // Front attacks x4
  makeCard(MID, '魔法の剣', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '影剣', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '暗黒の矢', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '影の爪', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x2
  makeCard(MID, '影隠れ', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '暗黒防御', 'ガードする。', 'defense', [defenseEffect()]),
  // Buff x2
  makeCard(MID, '影の力', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  makeCard(MID, '暗黒強化', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
];
