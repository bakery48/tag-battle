import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect, healEffect,
  powerUpEffect, counterAddEffect, powerVal,
} from './factories.js';

const MID = 'vampire-lord';
const COUNTER = '吸血カウンター';

export const vampireLordCards: CardState[] = [
  // Combo x4: attack + 吸血 counter
  makeCard(MID, '吸血牙', '攻撃し、吸血カウンター+1。(攻撃時に吸血値分HP回復)', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '暗黒の一撃', '攻撃し、吸血カウンター+1。(攻撃時に吸血値分HP回復)', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '血の渇望', '攻撃し、吸血カウンター+1。(攻撃時に吸血値分HP回復)', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '死の接吻', '攻撃し、吸血カウンター+1。(攻撃時に吸血値分HP回復)', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Attack x2
  makeCard(MID, '闇の爪', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '暗黒打', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x2
  makeCard(MID, '霧散', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '蝙蝠変化', 'ガードする。', 'defense', [defenseEffect()]),
  // Heal x2
  makeCard(MID, '血の回復', '自前衛のHPを2回復する。', 'heal', [healEffect(2, 'ally_front')]),
  makeCard(MID, '再生', '自前衛のHPを2回復する。', 'heal', [healEffect(2, 'ally_front')]),
  // Buff x2
  makeCard(MID, '血の力', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  makeCard(MID, '暗黒強化', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
];
