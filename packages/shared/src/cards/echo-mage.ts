import type { CardState, CardEffect } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect, powerUpEffect,
  counterAddEffect, powerVal, fixedVal,
} from './factories.js';

const MID = 'echo-mage';

// Echo strike: own power damage + amplify ally_front counter
function echoStrikeEffects(): CardEffect[] {
  return [
    attackEffect(powerVal()),
    { trigger: 'always', target: 'ally_front', action: 'counterAdd', value: fixedVal(1), counterName: '' },
  ];
}

export const echoMageCards: CardState[] = [
  // Echo strikes x4
  makeCard(MID, '共鳴打撃', '攻撃し、自前衛のカウンターを1増やす。', 'combo', echoStrikeEffects()),
  makeCard(MID, '反響の一撃', '攻撃し、自前衛のカウンターを1増やす。', 'combo', echoStrikeEffects()),
  makeCard(MID, '共鳴の波動', '攻撃し、自前衛のカウンターを1増やす。', 'combo', echoStrikeEffects()),
  makeCard(MID, '反響打', '攻撃し、自前衛のカウンターを1増やす。', 'combo', echoStrikeEffects()),
  // Amplify x3
  makeCard(MID, '増幅', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '共鳴増幅', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  makeCard(MID, '反響強化', '自前衛の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'ally_front')]),
  // Normal attack x2
  makeCard(MID, '魔法の波', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '共鳴弾', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x2
  makeCard(MID, '反響の盾', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '共鳴の守り', 'ガードする。', 'defense', [defenseEffect()]),
  // Buff x1
  makeCard(MID, '自己強化', '自分の攻撃力を1上げる。', 'buff', [powerUpEffect(1, 'self')]),
];
