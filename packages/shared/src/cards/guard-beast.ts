import type { CardState, CardEffect } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect, healEffect,
  powerUpEffect, powerVal, fixedVal,
} from './factories.js';

const MID = 'guard-beast';

// Cover effect: apply 'cover' status to self for 1 turn
const coverSelfEffect: CardEffect = {
  trigger: 'always',
  target: 'self',
  action: 'cover',
  value: fixedVal(1),
};

export const guardBeastCards: CardState[] = [
  // Attack x2
  makeCard(MID, '守護の牙', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '獣の爪', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x4
  makeCard(MID, '守護の盾', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '堅牢防御', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '鉄壁の守り', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '完全防衛', 'ガードする。', 'defense', [defenseEffect()]),
  // Heal x3
  makeCard(MID, '守護の癒し', '自前衛のHPを4回復する。', 'heal', [healEffect(4, 'ally_front')]),
  makeCard(MID, '精霊の加護', '自前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  makeCard(MID, '後衛の癒し', '自後衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_rear')]),
  // Buff x2
  makeCard(MID, '守護強化', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '獣の加護', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  // Cover x1
  makeCard(MID, '囮作戦', '自分にカバー状態を付与し、後衛への攻撃を引き受ける。', 'buff', [coverSelfEffect]),
];
