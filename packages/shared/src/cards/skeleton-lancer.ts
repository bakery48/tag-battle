import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, attackRearEffect, defenseEffect,
  powerUpEffect, powerVal,
} from './factories.js';

const MID = 'skeleton-lancer';

export const skeletonLancerCards: CardState[] = [
  // Penetrating attacks x4: hit front AND rear
  makeCard(MID, '貫通槍', '敵前衛と後衛にダメージを与える。', 'combo', [
    attackEffect(powerVal()),
    attackRearEffect(powerVal()),
  ]),
  makeCard(MID, '連刺', '敵前衛と後衛にダメージを与える。', 'combo', [
    attackEffect(powerVal()),
    attackRearEffect(powerVal()),
  ]),
  makeCard(MID, '貫いの一撃', '敵前衛と後衛にダメージを与える。', 'combo', [
    attackEffect(powerVal()),
    attackRearEffect(powerVal()),
  ]),
  makeCard(MID, '骸骨貫通', '敵前衛と後衛にダメージを与える。', 'combo', [
    attackEffect(powerVal()),
    attackRearEffect(powerVal()),
  ]),
  // Normal attack x3
  makeCard(MID, '槍突き', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '骸骨槍', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '死の穂先', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x2
  makeCard(MID, '骨盾', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '骸骨防御', 'ガードする。', 'defense', [defenseEffect()]),
  // Buff x3
  makeCard(MID, '槍の極意', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '鋭利化', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '死者の闘志', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
];
