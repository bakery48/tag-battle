import type { CardState, CardEffect } from '../types.js';
import {
  makeCard, attackEffect, defenseEffect, powerUpEffect,
  counterAddEffect, powerVal, fixedVal,
} from './factories.js';

const MID = 'war-bird';

// Amplify ally_front counter by 1 — counterName is empty to mean "any counter"
function amplifyAllyFrontCounter(): CardEffect {
  return {
    trigger: 'always',
    target: 'ally_front',
    action: 'counterAdd',
    value: fixedVal(1),
    counterName: '',
  };
}

export const warBirdCards: CardState[] = [
  // Buff x4: ally_front powerUp 2
  makeCard(MID, '鼓舞の羽ばたき', '自前衛の攻撃力を2上げる。', 'buff', [powerUpEffect(2, 'ally_front')]),
  makeCard(MID, '戦鳥の加護', '自前衛の攻撃力を2上げる。', 'buff', [powerUpEffect(2, 'ally_front')]),
  makeCard(MID, '猛翼の力', '自前衛の攻撃力を2上げる。', 'buff', [powerUpEffect(2, 'ally_front')]),
  makeCard(MID, '戦の咆哮', '自前衛の攻撃力を2上げる。', 'buff', [powerUpEffect(2, 'ally_front')]),
  // Counter amplify x4
  makeCard(MID, 'カウンター増幅', '自前衛のカウンターを1増やす。', 'combo', [amplifyAllyFrontCounter()]),
  makeCard(MID, '連携の翼', '自前衛のカウンターを1増やす。', 'combo', [amplifyAllyFrontCounter()]),
  makeCard(MID, '戦鳥の支援', '自前衛のカウンターを1増やす。', 'combo', [amplifyAllyFrontCounter()]),
  makeCard(MID, '鼓舞の掛け声', '自前衛のカウンターを1増やす。', 'combo', [amplifyAllyFrontCounter()]),
  // Attack x2
  makeCard(MID, '翼の一撃', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  makeCard(MID, '戦鳥の爪', '敵前衛にダメージを与える。', 'attack', [attackEffect(powerVal())]),
  // Defense x2
  makeCard(MID, '翼の盾', 'ガードする。', 'defense', [defenseEffect()]),
  makeCard(MID, '翼の守り', 'ガードする。', 'defense', [defenseEffect()]),
];
