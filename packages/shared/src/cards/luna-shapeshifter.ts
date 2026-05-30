import type { CardState } from '../types.js';
import {
  makeCard, attackEffect, healEffect, powerUpEffect, powerDownEffect,
  counterAddEffect, defenseEffect, powerVal, fixedVal, positionEffect,
} from './factories.js';
import type { CardEffect } from '../types.js';

const MID = 'luna-shapeshifter';
const COUNTER = '変幻カウンター';

// Helper: a card with different effect based on position
function shapeCard(name: string, desc: string, type: CardState['type'], frontEff: CardEffect[], rearEff: CardEffect[]): CardState {
  return makeCard(MID, name, desc, type, [
    ...frontEff.map(e => positionEffect('front', e)),
    ...rearEff.map(e => positionEffect('rear', e)),
  ]);
}

export const lunaShapeshifterCards: CardState[] = [
  // Position-switch x4: front→damage, rear→heal ally
  shapeCard('変幻の一撃', '前衛時：敵前衛にパワーダメージ。後衛時：味方前衛のHPを[power]回復。', 'combo',
    [attackEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self')],
    [healEffect(3, 'ally_front'), counterAddEffect(COUNTER, 1, 'self')],
  ),
  shapeCard('二面の術', '前衛時：敵前衛にダメージ。後衛時：味方前衛の攻撃力+1。', 'combo',
    [attackEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self')],
    [powerUpEffect(1, 'ally_front'), counterAddEffect(COUNTER, 1, 'self')],
  ),
  shapeCard('変化の刃', '前衛時：敵前衛3ダメージ。後衛時：味方前衛HP+3。', 'combo',
    [attackEffect(fixedVal(3)), counterAddEffect(COUNTER, 1, 'self')],
    [healEffect(3, 'ally_front'), counterAddEffect(COUNTER, 1, 'self')],
  ),
  shapeCard('月影の術', '前衛時：敵前衛にダメージ+カウンター+1。後衛時：味方全体HP+2+カウンター+1。', 'combo',
    [attackEffect(powerVal()), counterAddEffect(COUNTER, 1, 'self')],
    [healEffect(2, 'ally_front'), healEffect(2, 'ally_rear'), counterAddEffect(COUNTER, 1, 'self')],
  ),
  // Universal attack (works both positions)
  makeCard(MID, '変幻斬り', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '光の刃', '敵前衛にパワーダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Universal heal
  makeCard(MID, '癒しの光', '味方前衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_front')]),
  makeCard(MID, '変幻の癒し', '味方後衛のHPを3回復する。', 'heal', [healEffect(3, 'ally_rear')]),
  // Universal buff/debuff
  makeCard(MID, '変幻強化', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
  makeCard(MID, '幻惑の呪い', '敵前衛の攻撃力を1下げる(遅延)。', 'debuff', [powerDownEffect(1, true)]),
  // Defense
  makeCard(MID, '変幻防御', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '月の盾', 'ガードする。', 'defense', [defenseEffect()]),
];
