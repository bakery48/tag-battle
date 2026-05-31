import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, healEffect, powerUpEffect, powerDownEffect,
  counterAddEffect, defenseEffect, onBlockDamageEffect, powerVal, fixedVal,
} from './factories.js';

const MID = 'holy-blade-hero';
const COUNTER = '勇気カウンター';

export const holyBladeHeroCards: CardState[] = [
  // Combo x4: attack + 勇気counter+1
  makeCard(MID, '聖剣の一撃', '攻撃し、勇気カウンター+1。(攻撃時に味方前衛をカウンター値分回復)', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '勇者の剣閃', '攻撃し、勇気カウンター+1。(攻撃時に味方前衛をカウンター値分回復)', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '聖なる斬撃', '攻撃し、勇気カウンター+1。(攻撃時に味方前衛をカウンター値分回復)', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '勇気の刃', '攻撃し、勇気カウンター+1。(攻撃時に味方前衛をカウンター値分回復)', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Defense x2 (blocking hero)
  makeCard(MID, '聖盾防御', 'ガードし、ブロック時に敵前衛にダメージ。', 'combo', [
    defenseEffect(),
    onBlockDamageEffect(powerVal()),
  ]),
  makeCard(MID, '勇者の守り', 'ガードする。', 'defense', [defenseEffect()]),
  // Heal x2
  makeCard(MID, '聖剣の癒し', '味方前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  makeCard(MID, '勇者の加護', '味方後衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_rear')]),
  // Buff x2
  makeCard(MID, '聖なる強化', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  makeCard(MID, '勇者の鼓舞', '味方前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  // Debuff x1
  makeCard(MID, '聖剣の封印', '敵前衛の攻撃力を1下げる(遅延)。', 'debuff', [powerDownEffect(1, true)]),
  // Attack x1
  makeCard(MID, '勇者の必殺技', '敵前衛に固定4ダメージを与える。', 'attack', [attackEffect(fixedVal(4))]),
];
