import type { MonsterState, DisplayMonster } from '../types.js';

export function toDisplayMonster(m: MonsterState): DisplayMonster {
  return {
    id: m.id,
    name: m.name,
    role: m.role,
    hp: m.hp,
    maxHp: m.maxHp,
    power: m.power,
    isDead: m.isDead,
    counterName: m.counter?.name,
    counterValue: m.counter?.value,
    debuffs: m.debuffs,
  };
}
