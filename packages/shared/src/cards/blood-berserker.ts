import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, powerUpEffect, counterAddEffect, powerVal,
} from './factories.js';

const MID = 'blood-berserker';
const COUNTER = '血炎カウンター';

export const bloodBerserkerCards: CardState[] = [
  // Combo x4: attack + 血炎 counter +1
  makeCard(MID, '血炎の一撃', '攻撃し、血炎カウンター+1。HPが低いほど威力上昇。', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '業火の突撃', '攻撃し、血炎カウンター+1。覚醒の証。', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '鮮血の爆発', '攻撃し、血炎カウンター+1。痛みが力に変わる。', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  makeCard(MID, '覚醒の咆哮', '攻撃し、血炎カウンター+1。死に際の怒り。', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 1, 'self'),
  ]),
  // Attack x5: plain power damage
  makeCard(MID, '血の刃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '狂化斬り', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '断末魔の一撃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '血染めの剣', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '赤き嵐', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Buff x3: powerUp self
  makeCard(MID, '血の覚醒', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  makeCard(MID, '狂戦士の気合', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  makeCard(MID, '血の誓い', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
];
