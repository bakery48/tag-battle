import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, attackRearEffect, healEffect,
  powerUpEffect, powerDownEffect, powerVal,
} from './factories.js';

const MID = 'soul-reaper';

export const soulReaperCards: CardState[] = [
  // Attack x4: power damage to enemy_front (power scales with 魂 counter via recalcPower)
  makeCard(MID, '魂の一撃', '敵前衛にパワーダメージを与える。魂の力で威力増加。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '死の刃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '魂の嵐', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '怨念の斬撃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Attack x3: power damage to enemy_rear
  makeCard(MID, '魂の追撃', '敵後衛にパワーダメージを与える。', 'attack', [attackRearEffect(powerVal())]),
  makeCard(MID, '怨霊の刃', '敵後衛にパワーダメージを与える。', 'attack', [attackRearEffect(powerVal())]),
  makeCard(MID, '死霊の爪', '敵後衛にパワーダメージを与える。', 'attack', [attackRearEffect(powerVal())]),
  // Debuff x2: enemy_front powerDown 1, delayed
  makeCard(MID, '魂の呪縛', '敵前衛の攻撃力を1下げる(遅延)。', 'debuff', [powerDownEffect(1, true)]),
  makeCard(MID, '死の束縛', '敵前衛の攻撃力を1下げる(遅延)。', 'debuff', [powerDownEffect(1, true)]),
  // Buff x2: ally_front powerUp 1
  makeCard(MID, '魂の加護', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '死者の力', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  // Heal x1: ally_rear +3
  makeCard(MID, '魂の癒し', '自後衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_rear')]),
];
