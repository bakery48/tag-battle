import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect, powerUpEffect,
  counterAddEffect, powerVal,
} from './factories.js';

const MID = 'phoenix-warrior';
const COUNTER = '炎鳥カウンター';

export const phoenixWarriorCards: CardState[] = [
  // Attack x4
  makeCard(MID, '炎の翼', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '不死鳥の爪', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '炎撃', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '燃焼打', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x2
  makeCard(MID, '炎の盾', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '羽の守り', 'ガードする。', 'defense', [defenseEffect()]),
  // Buff x3
  makeCard(MID, '再生の炎', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '不死の力', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '炎の加護', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  // Combo: attack + 炎鳥 counter x3
  makeCard(MID, '炎鳥の一撃', '攻撃し、炎鳥カウンター+1。', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '不死鳥解放', '攻撃し、炎鳥カウンター+1。', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '炎の輝き', '攻撃し、炎鳥カウンター+1。', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
];
