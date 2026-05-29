import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect,
  powerUpEffect, powerDownEffect, powerVal,
} from './factories.js';

const MID = 'time-mage';
// 時空カウンター increments automatically in the resolver's Phase 5a
// (like エールダンサー), so cards don't need explicit counterAdd effects.

export const timeMageCards: CardState[] = [
  // Buff x4: ally_front powerUp 1
  makeCard(MID, '時の加速', '自前衛の攻撃力を1上げる。時空カウンターが溜まる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '時間強化', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '過去の力', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '未来の力', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  // Buff x3: ally_rear powerUp 1
  makeCard(MID, '時の流れ', '自後衛の攻撃力を1上げる。時空カウンターが溜まる。', 'buff', [powerUpEffect(1, 'ally_rear')]),
  makeCard(MID, '時間の歪み', '自後衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_rear')]),
  makeCard(MID, '時の裂け目', '自後衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_rear')]),
  // Debuff x3: enemy_front powerDown 1, delayed
  makeCard(MID, '時間の封印', '敵前衛の攻撃力を1下げる(遅延)。', 'debuff', [powerDownEffect(1, true)]),
  makeCard(MID, '過去への退行', '敵前衛の攻撃力を1下げる(遅延)。', 'debuff', [powerDownEffect(1, true)]),
  makeCard(MID, '時の呪縛', '敵前衛の攻撃力を1下げる(遅延)。', 'debuff', [powerDownEffect(1, true)]),
  // Attack x1
  makeCard(MID, '時の裁き', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x1
  makeCard(MID, '時の盾', 'ガードする。時を巻き戻す。', 'defense', [defenseEffect()]),
];
