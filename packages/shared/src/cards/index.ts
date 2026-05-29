export { ironGolemCards } from './iron-golem.js';
export { berserkCards } from './berserk.js';
export { vampireLordCards } from './vampire-lord.js';
export { mirrorKnightCards } from './mirror-knight.js';
export { deathKnightCards } from './death-knight.js';
export { skeletonLancerCards } from './skeleton-lancer.js';
export { phoenixWarriorCards } from './phoenix-warrior.js';
export { stormWarlockCards } from './storm-warlock.js';
export { guardBeastCards } from './guard-beast.js';
export { chainSoldierCards } from './chain-soldier.js';
export { holyPriestCards } from './holy-priest.js';
export { shadowWitchCards } from './shadow-witch.js';
export { curseShamanCards } from './curse-shaman.js';
export { warBirdCards } from './war-bird.js';
export { necromancerCards } from './necromancer.js';
export { poisonDoctorCards } from './poison-doctor.js';
export { echoMageCards } from './echo-mage.js';
export { stormShamanCards } from './storm-shaman.js';
export { barrierMaidenCards } from './barrier-maiden.js';
export { yellDancerCards } from './yell-dancer.js';
export { bloodBerserkerCards } from './blood-berserker.js';
export { runeGuardianCards } from './rune-guardian.js';
export { shadowAssassinCards } from './shadow-assassin.js';
export { doubleEdgeCards } from './double-edge.js';
export { soulReaperCards } from './soul-reaper.js';
export { shieldMageCards } from './shield-mage.js';
export { reverserCards } from './reverser.js';
export { timeMageCards } from './time-mage.js';

import { ironGolemCards } from './iron-golem.js';
import { berserkCards } from './berserk.js';
import { vampireLordCards } from './vampire-lord.js';
import { mirrorKnightCards } from './mirror-knight.js';
import { deathKnightCards } from './death-knight.js';
import { skeletonLancerCards } from './skeleton-lancer.js';
import { phoenixWarriorCards } from './phoenix-warrior.js';
import { stormWarlockCards } from './storm-warlock.js';
import { guardBeastCards } from './guard-beast.js';
import { chainSoldierCards } from './chain-soldier.js';
import { holyPriestCards } from './holy-priest.js';
import { shadowWitchCards } from './shadow-witch.js';
import { curseShamanCards } from './curse-shaman.js';
import { warBirdCards } from './war-bird.js';
import { necromancerCards } from './necromancer.js';
import { poisonDoctorCards } from './poison-doctor.js';
import { echoMageCards } from './echo-mage.js';
import { stormShamanCards } from './storm-shaman.js';
import { barrierMaidenCards } from './barrier-maiden.js';
import { yellDancerCards } from './yell-dancer.js';
import { bloodBerserkerCards } from './blood-berserker.js';
import { runeGuardianCards } from './rune-guardian.js';
import { shadowAssassinCards } from './shadow-assassin.js';
import { doubleEdgeCards } from './double-edge.js';
import { soulReaperCards } from './soul-reaper.js';
import { shieldMageCards } from './shield-mage.js';
import { reverserCards } from './reverser.js';
import { timeMageCards } from './time-mage.js';
import type { CardState } from '../types.js';

export const ALL_CARDS: CardState[] = [
  ...ironGolemCards,
  ...berserkCards,
  ...vampireLordCards,
  ...mirrorKnightCards,
  ...deathKnightCards,
  ...skeletonLancerCards,
  ...phoenixWarriorCards,
  ...stormWarlockCards,
  ...guardBeastCards,
  ...chainSoldierCards,
  ...holyPriestCards,
  ...shadowWitchCards,
  ...curseShamanCards,
  ...warBirdCards,
  ...necromancerCards,
  ...poisonDoctorCards,
  ...echoMageCards,
  ...stormShamanCards,
  ...barrierMaidenCards,
  ...yellDancerCards,
  ...bloodBerserkerCards,
  ...runeGuardianCards,
  ...shadowAssassinCards,
  ...doubleEdgeCards,
  ...soulReaperCards,
  ...shieldMageCards,
  ...reverserCards,
  ...timeMageCards,
];

export const CARDS_BY_MONSTER: Record<string, CardState[]> = {
  'iron-golem': ironGolemCards,
  'berserk': berserkCards,
  'vampire-lord': vampireLordCards,
  'mirror-knight': mirrorKnightCards,
  'death-knight': deathKnightCards,
  'skeleton-lancer': skeletonLancerCards,
  'phoenix-warrior': phoenixWarriorCards,
  'storm-warlock': stormWarlockCards,
  'guard-beast': guardBeastCards,
  'chain-soldier': chainSoldierCards,
  'holy-priest': holyPriestCards,
  'shadow-witch': shadowWitchCards,
  'curse-shaman': curseShamanCards,
  'war-bird': warBirdCards,
  'necromancer': necromancerCards,
  'poison-doctor': poisonDoctorCards,
  'echo-mage': echoMageCards,
  'storm-shaman': stormShamanCards,
  'barrier-maiden': barrierMaidenCards,
  'yell-dancer': yellDancerCards,
  'blood-berserker': bloodBerserkerCards,
  'rune-guardian': runeGuardianCards,
  'shadow-assassin': shadowAssassinCards,
  'double-edge': doubleEdgeCards,
  'soul-reaper': soulReaperCards,
  'shield-mage': shieldMageCards,
  'reverser': reverserCards,
  'time-mage': timeMageCards,
};

export function getCardsForMonster(monsterId: string): CardState[] {
  return CARDS_BY_MONSTER[monsterId] ?? [];
}
