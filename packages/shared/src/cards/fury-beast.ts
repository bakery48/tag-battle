import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, healEffect, powerUpEffect,
  counterAddEffect, defenseEffect, normalEffect, transformedEffect,
  powerVal, fixedVal, powerMulVal,
} from './factories.js';

const MID = 'fury-beast';
const COUNTER = '激昂カウンター';

// Dual-state combo helper
function dualCard(
  name: string,
  desc: string,
  normalEffects: import('../types.js').CardEffect[],
  transformedEffects: import('../types.js').CardEffect[],
): CardState {
  return makeCard(MID, name, desc, 'combo', [
    ...normalEffects.map(normalEffect),
    ...transformedEffects.map(transformedEffect),
  ]);
}

export const furyBeastCards: CardState[] = [
  // ── 4 dual-state attack cards ──
  // Normal: modest attack + counter build. Transformed: double-power attack + more counter.
  dualCard(
    '野性の一撃',
    '【通常】敵前衛にパワーダメージ＋激昂+1 / 【変身】敵前衛に2倍パワーダメージ＋激昂+1',
    [attackEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self')],
    [attackEffect(powerMulVal(2)), counterAddEffect(COUNTER, 1, 'self')],
  ),
  dualCard(
    '怒りの爪',
    '【通常】敵前衛にパワーダメージ＋激昂+1 / 【変身】敵前衛に2倍パワーダメージ＋激昂+1',
    [attackEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self')],
    [attackEffect(powerMulVal(2)), counterAddEffect(COUNTER, 1, 'self')],
  ),
  dualCard(
    '獣の咆哮',
    '【通常】敵前衛に3ダメージ＋激昂+1 / 【変身】敵全体に4ダメージ＋激昂+1',
    [attackEffect(fixedVal(3)), counterAddEffect(COUNTER, 1, 'self')],
    [
      { trigger: 'always', target: 'enemy_front', action: 'damage', value: fixedVal(4) },
      { trigger: 'always', target: 'enemy_rear', action: 'damage', value: fixedVal(4) },
      counterAddEffect(COUNTER, 1, 'self'),
    ],
  ),
  dualCard(
    '暴走の刃',
    '【通常】敵前衛にパワーダメージ / 【変身】敵前衛に2倍パワー＋敵後衛に2ダメージ',
    [attackEffect(powerVal())],
    [
      attackEffect(powerMulVal(2)),
      { trigger: 'always', target: 'enemy_rear', action: 'damage', value: fixedVal(2) },
    ],
  ),
  // ── 2 dual-state utility cards ──
  // Normal: heal/buff self (conserving). Transformed: massive strike.
  dualCard(
    '怒りの蓄積',
    '【通常】自分HP+3＋激昂+2 / 【変身】敵前衛に固定6ダメージ＋激昂+1',
    [healEffect(3, 'self'), counterAddEffect(COUNTER, 2, 'self')],
    [attackEffect(fixedVal(6)), counterAddEffect(COUNTER, 1, 'self')],
  ),
  dualCard(
    '変身の前兆',
    '【通常】自分の攻撃力+1＋激昂+2 / 【変身】味方全体の攻撃力+1＋敵前衛にパワーダメージ',
    [powerUpEffect(1, 'self'), counterAddEffect(COUNTER, 2, 'self')],
    [powerUpEffect(1, 'ally_front'), powerUpEffect(1, 'ally_rear'), attackEffect(powerVal())],
  ),
  // ── 2 pure counter-builders (work in both states) ──
  makeCard(MID, '激昂の叫び', '激昂カウンター+3。変身を加速させる。', 'combo', [
    counterAddEffect(COUNTER, 3, 'self'),
  ]),
  makeCard(MID, '怒りの解放', '激昂カウンター+2。敵前衛にパワーダメージ。', 'combo', [
    attackEffect(powerVal()),
    counterAddEffect(COUNTER, 2, 'self'),
  ]),
  // ── 2 defense cards ──
  makeCard(MID, '野性の防御', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '獣の本能', 'ガードする。野性の勘で攻撃を躱す。', 'defense', [defenseEffect()]),
  // ── 1 pure attack ──
  makeCard(MID, '獣の突撃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // ── 1 transformed finisher (normal: heal 1, transformed: devastating) ──
  dualCard(
    '変身解放・獣王覚醒',
    '【通常】自分HP+1(封印中) / 【変身】敵全体に(パワー×1.5)ダメージ＋全味方パワー+2',
    [healEffect(1, 'self')],
    [
      { trigger: 'always', target: 'enemy_front', action: 'damage', value: powerMulVal(1.5) },
      { trigger: 'always', target: 'enemy_rear', action: 'damage', value: powerMulVal(1.5) },
      powerUpEffect(2, 'ally_front'),
      powerUpEffect(2, 'ally_rear'),
    ],
  ),
];
