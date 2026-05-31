#!/usr/bin/env node
// scripts/generate-compendium.mjs — generates docs/monsters.html
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { MONSTERS, CARDS_BY_MONSTER } from '../packages/shared/dist/index.js';

// ── Curated tactics & synergies ────────────────────────────────────────────

const INFO = {
  'iron-golem': {
    tactics: '高HPと防御カードで前線を支える盾役。アーマーで被ダメを抑えつつ、敵の攻撃を受け止める。後衛を完全に守ることで後衛モンスターが安全に動ける。',
    synergies: ['rune-guardian', 'holy-priest', 'barrier-maiden', 'stone-wall'],
  },
  'berserk': {
    tactics: '低HPで高火力の攻撃特化型。低HP状態で発動するスキルが多く、自分のHPを削ることで真価を発揮する。相手の前衛を素早く倒すことを優先。',
    synergies: ['holy-priest', 'yell-dancer', 'blood-berserker', 'phoenix-warrior'],
  },
  'vampire-lord': {
    tactics: '吸血ダメージで自己回復しながら戦う持久型。ダメージを与えるほど回復するため長期戦に強い。敵の回復妨害と組み合わせると効果倍増。',
    synergies: ['curse-shaman', 'poison-doctor', 'reverser', 'shadow-witch'],
  },
  'mirror-knight': {
    tactics: '防御カードでブロックしながら反撃するカウンター型。ブロック時の反撃効果が強力で、敵が攻撃するほど不利になる。',
    synergies: ['iron-golem', 'barrier-maiden', 'rune-guardian', 'guardian-swordsman'],
  },
  'death-knight': {
    tactics: '高パワーと暗黒スキルで敵全体を削る攻撃型。連続攻撃やパワーダウンで敵を弱体化しながら戦う。前衛の圧力が高く後衛への抑止力になる。',
    synergies: ['shadow-witch', 'curse-shaman', 'necromancer', 'storm-warlock'],
  },
  'skeleton-lancer': {
    tactics: '後衛への貫通攻撃が得意な槍使い。敵の前衛を無視して後衛を攻撃できるため、後衛モンスターを優先排除できる。',
    synergies: ['shadow-assassin', 'death-knight', 'storm-warlock', 'double-edge'],
  },
  'phoenix-warrior': {
    tactics: '一度倒れても復活できる不死身の戦士。復活後のパワーアップで逆転を狙える。相手に「倒しても意味がない」と思わせる心理的プレッシャーが強み。',
    synergies: ['holy-priest', 'yell-dancer', 'holy-blade-hero', 'guardian-swordsman'],
  },
  'storm-warlock': {
    tactics: '嵐風スタックで敵にデバフを積み重ねる支配型。嵐風が蓄積するほど敵のパワーが下がる。長期戦で真価を発揮し、敵の攻撃力を骨抜きにする。',
    synergies: ['curse-shaman', 'yell-dancer', 'reverser', 'time-mage'],
  },
  'guard-beast': {
    tactics: '高耐久で前衛を固める守護獣。HPが高く防御カードが豊富で、相手の攻撃を長時間受け止められる。後衛を守る盾として最高峰。',
    synergies: ['iron-golem', 'holy-priest', 'barrier-maiden', 'stone-wall'],
  },
  'chain-soldier': {
    tactics: '連鎖攻撃と拘束で敵を翻弄する特殊型。複数回ヒットで防御を突き破る攻撃と、相手の行動を制限するデバフを組み合わせて戦う。',
    synergies: ['death-knight', 'skeleton-lancer', 'shadow-assassin', 'twin-blade-dancer'],
  },
  'holy-priest': {
    tactics: '仲間のHPを回復し続ける純粋な回復役。回復量が高く、前衛がどれだけダメージを受けても立て直せる。長期戦の要。',
    synergies: ['iron-golem', 'guard-beast', 'phoenix-warrior', 'rune-guardian'],
  },
  'shadow-witch': {
    tactics: '低HPで高パワーを誇るガラスキャノン。毒や弱体化で敵を蝕みながら高火力で仕留める。守りが薄いため前衛の保護が必須。',
    synergies: ['iron-golem', 'rune-guardian', 'guard-beast', 'barrier-maiden'],
  },
  'curse-shaman': {
    tactics: '呪いで敵の回復を封じながら弱体化させる妨害型。敵が回復するほど呪いが刺さり、長期戦で相手を詰ませる。',
    synergies: ['vampire-lord', 'poison-doctor', 'storm-warlock', 'venom-mist'],
  },
  'war-bird': {
    tactics: '仲間にパワーアップを付与するサポーター。自分は弱くても味方を強化することで間接的に戦う。コンボ戦法の起点になる。',
    synergies: ['death-knight', 'berserk', 'flash-assassin', 'dragon-warrior'],
  },
  'necromancer': {
    tactics: '仲間を蘇生させる特殊なサポーター。倒れた前衛を復活させることで相手の計算を狂わせる。蘇生タイミングが戦局を左右する。',
    synergies: ['phoenix-warrior', 'berserk', 'blood-berserker', 'guardian-swordsman'],
  },
  'poison-doctor': {
    tactics: '毒を蓄積させて持続ダメージで削る長期戦型。毒の蓄積量が増えるほど毎ターンのダメージが大きくなる。防御が高い相手に特に有効。',
    synergies: ['curse-shaman', 'venom-mist', 'shadow-witch', 'reverser'],
  },
  'echo-mage': {
    tactics: 'エコーカウンターでスキルを二重発動させる特殊型。通常のスキルをコピーして2倍の効果を得る。タイミングを合わせることで爆発的な火力を出せる。',
    synergies: ['storm-warlock', 'death-knight', 'chaos-mage', 'holy-priest'],
  },
  'storm-shaman': {
    tactics: '嵐スタックを素早く積んで敵を弱体化させる速攻型。序盤から嵐風を積み重ね、中盤以降は弱体化した敵に高火力で攻める。',
    synergies: ['storm-warlock', 'curse-shaman', 'yell-dancer', 'venom-mist'],
  },
  'barrier-maiden': {
    tactics: '仲間全体にバリアを展開する守護型。バリアで次のダメージを無効化し、回復も行える。攻め込まれたときの立て直しに優秀。',
    synergies: ['iron-golem', 'guard-beast', 'holy-priest', 'rune-guardian'],
  },
  'yell-dancer': {
    tactics: '激励でチームのパワーを底上げするバッファー型。閾値を超えると全体パワーアップが発動し、チームの瞬間火力が跳ね上がる。',
    synergies: ['death-knight', 'berserk', 'dragon-warrior', 'fury-beast'],
  },
  'blood-berserker': {
    tactics: '自分のHPに比例したパワーで攻撃する特殊型。HPが低いほど攻撃力が落ちるため、常にHP管理が重要。回復を組み合わせて高HP・高火力を維持する。',
    synergies: ['holy-priest', 'barrier-maiden', 'yell-dancer', 'war-bird'],
  },
  'rune-guardian': {
    tactics: '魔法防御（アーマー）で魔法ダメージを軽減する守護者。アーマーが高い状態では魔法系の攻撃をほぼ無効化できる。物理攻撃には通常通りダメージを受ける。',
    synergies: ['iron-golem', 'holy-priest', 'barrier-maiden', 'guardian-swordsman'],
  },
  'shadow-assassin': {
    tactics: '隠密から一撃で敵を仕留める暗殺者。ステルスで行動を隠しながら強力な一撃を放つ。ブロックに成功すると大反撃ができる。',
    synergies: ['curse-shaman', 'shadow-witch', 'reverser', 'shadow-puppeteer'],
  },
  'double-edge': {
    tactics: '自分にもダメージが入る諸刃の剣スタイル。高火力の代わりに自傷リスクがある。回復サポートと組み合わせてリスクを管理する。',
    synergies: ['holy-priest', 'barrier-maiden', 'necromancer', 'phoenix-warrior'],
  },
  'soul-reaper': {
    tactics: '敵を倒すごとにカウンターを蓄積して超強化される魂収集型。倒した数に応じてスキルが強化される。積極的に敵を倒しにいく攻め戦略が基本。',
    synergies: ['death-knight', 'shadow-assassin', 'flash-assassin', 'dragon-warrior'],
  },
  'shield-mage': {
    tactics: '味方全体に魔法シールドを貼るサポーター。魔法防御を高めることで後衛を守りつつ、自分も攻撃に参加できる万能型。',
    synergies: ['holy-priest', 'barrier-maiden', 'rune-guardian', 'echo-mage'],
  },
  'reverser': {
    tactics: '敵の強化を無効・反転させる逆転の魔術師。敵のパワーアップを剥がしたり敵の回復を妨害したりする。有利な状態の敵に特に刺さる。',
    synergies: ['curse-shaman', 'storm-warlock', 'poison-doctor', 'time-mage'],
  },
  'time-mage': {
    tactics: '時間操作で遅延効果を付与する変則型。敵のスキル効果を遅らせることで戦況をコントロールする。閾値発動で全体スロウも可能。',
    synergies: ['reverser', 'storm-warlock', 'curse-shaman', 'chaos-mage'],
  },
  'luna-shapeshifter': {
    tactics: '前衛と後衛で全く異なる効果を発揮する変幻自在の使い手。前衛時は攻撃的に、後衛時は支援的に動く。配置によって戦法が変わるトリッキーな存在。',
    synergies: ['shadow-clone-ninja', 'chaos-mage', 'fool-jester', 'storm-dancer'],
  },
  'shadow-clone-ninja': {
    tactics: '分身を駆使して攻守を撹乱する忍者型。前衛では高火力の単体攻撃、後衛では分身によるカバーを使い分ける。位置取りが鍵。',
    synergies: ['shadow-assassin', 'luna-shapeshifter', 'shadow-puppeteer', 'fool-jester'],
  },
  'twin-blade-dancer': {
    tactics: '双剣舞踏で前衛後衛ともに活躍するオールラウンダー。前衛では連続攻撃、後衛ではパワーアップ付与。閾値発動でさらに強化される。',
    synergies: ['yell-dancer', 'war-bird', 'storm-dancer', 'dragon-warrior'],
  },
  'chaos-mage': {
    tactics: 'カオスエネルギーで予測不能な効果を発動する混沌の術師。前衛時は攻撃的なカオス魔法、後衛時は敵を混乱させるデバフ。不確実性を武器にする。',
    synergies: ['time-mage', 'reverser', 'echo-mage', 'luna-shapeshifter'],
  },
  'holy-blade-hero': {
    tactics: '聖なる剣で攻撃しながら味方を回復する勇者型。自分が攻撃するたびに味方のHPが回復するため、攻撃しながらチームを維持できる。',
    synergies: ['phoenix-warrior', 'guardian-swordsman', 'holy-priest', 'barrier-maiden'],
  },
  'fool-jester': {
    tactics: '道化師の奇策で戦線を撹乱するトリックスター。自陣の前後を入れ替えたり、敵の隊列を入れ替えたりしてポジションを崩す。閾値発動で奇策が増す。',
    synergies: ['shadow-puppeteer', 'luna-shapeshifter', 'mirror-sage', 'storm-dancer'],
  },
  'shadow-puppeteer': {
    tactics: '糸で敵を操り自陣の有利を作る操り師。敵の前後を入れ替えることで弱い敵を前衛に引き出したり、強い敵を後衛に引っ込めたりする。',
    synergies: ['fool-jester', 'shadow-assassin', 'mirror-sage', 'skeleton-lancer'],
  },
  'storm-dancer': {
    tactics: '嵐の舞で前後どちらの位置でも機能する踊り子。前衛では嵐攻撃、後衛では嵐バフ付与。位置を入れ替えながら状況に応じた役割を果たす。',
    synergies: ['storm-warlock', 'storm-shaman', 'twin-blade-dancer', 'fool-jester'],
  },
  'mirror-sage': {
    tactics: '鏡の術で自分のHPと味方のHPを入れ替える賢者。瀕死の前衛のHPと健全な後衛のHPを交換することで前衛を救出する戦法が強力。',
    synergies: ['fool-jester', 'shadow-puppeteer', 'holy-priest', 'double-edge'],
  },
  'fury-beast': {
    tactics: '激昂カウンターが溜まると変身して覚醒する変身獣王。通常時は控えめなスキルだが変身後は破壊的な火力に変貌。カウンターを素早く溜めて変身させることが目標。',
    synergies: ['yell-dancer', 'war-bird', 'twin-blade-dancer', 'dragon-warrior'],
  },
  'stone-wall': {
    tactics: '圧倒的高HPで前線を封じる難攻不落の壁。防御スキルと高耐久で敵の攻撃を何ターンも受け止め、後衛を完全に守る。閾値発動で反撃も可能。',
    synergies: ['holy-priest', 'barrier-maiden', 'rune-guardian', 'guardian-swordsman'],
  },
  'holy-light-healer': {
    tactics: '聖なる光で仲間を癒やす回復特化型。回復量が高く継続的にチームをサポートする。敵の妨害に対して回復でカバーし続ける持久戦法。',
    synergies: ['iron-golem', 'guard-beast', 'phoenix-warrior', 'holy-blade-hero'],
  },
  'flash-assassin': {
    tactics: '電光石火の一撃で敵を仕留める速攻型。低HPだが最高クラスのパワーで一撃必殺を狙う。前衛に出して早期決着を目指す戦法が基本。',
    synergies: ['yell-dancer', 'war-bird', 'shadow-assassin', 'soul-reaper'],
  },
  'venom-mist': {
    tactics: '毒霧で広範囲に持続ダメージを与える毒使い。毒の蓄積効果で全体をジワジワ削る。防御が高くダメージを与えにくい相手に特に有効。',
    synergies: ['poison-doctor', 'curse-shaman', 'storm-warlock', 'reverser'],
  },
  'guardian-swordsman': {
    tactics: '仲間を守りながら反撃する護衛剣士。防御と攻撃を両立し、ブロック時の反撃が強力。閾値発動で守護バリアを展開して味方全体を守る。',
    synergies: ['holy-priest', 'phoenix-warrior', 'rune-guardian', 'stone-wall'],
  },
  'dragon-warrior': {
    tactics: '龍の力でパワーを高めながら猛攻を仕掛ける龍戦士。パワーアップを自己強化に使いながら敵を圧倒する。閾値発動で龍吼が炸裂する。',
    synergies: ['yell-dancer', 'war-bird', 'twin-blade-dancer', 'fury-beast'],
  },
};

// ── Card type → color ──────────────────────────────────────────────────────

const TYPE_COLOR = {
  attack: '#e74c3c',
  defense: '#3498db',
  skill: '#9b59b6',
  chain: '#f39c12',
};

// ── Role label ─────────────────────────────────────────────────────────────

function roleBadge(role) {
  if (role === 'front') return '<span class="badge badge-front">前衛向</span>';
  if (role === 'rear') return '<span class="badge badge-rear">後衛向</span>';
  return '<span class="badge badge-both">両用</span>';
}

// ── Effect summary ─────────────────────────────────────────────────────────

function fmtValue(v) {
  if (!v) return '';
  if (v.kind === 'fixed') return v.amount !== 0 ? `${v.amount}` : '';
  if (v.kind === 'power') {
    let s = 'パワー';
    if (v.factor && v.factor !== 1) s += `×${v.factor}`;
    if (v.bonus) s += `+${v.bonus}`;
    return s;
  }
  if (v.kind === 'powerMul') return `パワー×${v.factor}`;
  if (v.kind === 'counterRef') {
    let s = 'カウンター参照';
    if (v.multiplier && v.multiplier !== 1) s += `×${v.multiplier}`;
    return s;
  }
  return '';
}

function fmtTarget(t) {
  const map = {
    'enemy_front': '敵前衛',
    'enemy_rear': '敵後衛',
    'enemy_all': '敵全体',
    'ally_front': '味方前衛',
    'ally_rear': '味方後衛',
    'ally_all': '味方全体',
    'self': '自身',
    'both_front': '両前衛',
  };
  return map[t] ?? t;
}

function fmtAction(a, v) {
  const val = fmtValue(v);
  const map = {
    damage: `ダメージ${val ? ' ' + val : ''}`,
    heal: `回復${val ? ' ' + val : ''}`,
    powerUp: `パワー↑${val ? ' ' + val : ''}`,
    powerDown: `パワー↓${val ? ' ' + val : ''}`,
    counterAdd: 'カウンター+',
    counterReduce: 'カウンター-',
    revive: '蘇生',
    cover: 'カバー',
    multiHit: `連続攻撃${val ? '(' + val + ')' : ''}`,
    applyStatus: 'ステータス付与',
    swapPositions: '自陣前後交換',
    swapEnemyPositions: '敵陣前後交換',
    swapAlliesHp: '自陣HP交換',
  };
  return map[a] ?? a;
}

function fmtEffect(e) {
  let parts = [];
  if (e.trigger === 'onBlock') parts.push('[ブロック時]');
  if (e.trigger === 'ifLowHp') parts.push('[低HP時]');
  if (e.positionTrigger === 'front') parts.push('[前衛時]');
  if (e.positionTrigger === 'rear') parts.push('[後衛時]');
  if (e.transformTrigger === 'normal') parts.push('[通常時]');
  if (e.transformTrigger === 'transformed') parts.push('[変身後]');

  const action = fmtAction(e.action, e.value);
  const target = fmtTarget(e.target);

  if (e.action === 'swapPositions' || e.action === 'swapEnemyPositions' || e.action === 'swapAlliesHp') {
    parts.push(action);
  } else if (e.action === 'counterAdd' && e.counterName) {
    if (e.counterName.startsWith('__status__')) {
      const [, , type, dur] = e.counterName.split('__');
      parts.push(`${target}に${type}(${fmtValue(e.value)}, ${dur}T)`);
    } else {
      parts.push(`${e.counterName}+${fmtValue(e.value)} → ${target}`);
    }
  } else {
    parts.push(`${target}に${action}`);
  }

  if (e.delayed) parts.push('[遅延]');
  return parts.join(' ');
}

// ── HTML builder ───────────────────────────────────────────────────────────

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildMonsterCards(id) {
  const cards = CARDS_BY_MONSTER[id] ?? [];
  if (!cards.length) return '<p style="opacity:0.5">カードなし</p>';

  let html = '<table class="card-table"><thead><tr><th>カード名</th><th>種類</th><th>効果</th></tr></thead><tbody>';
  for (const c of cards) {
    const color = TYPE_COLOR[c.type] ?? '#888';
    const effects = c.effects.map(fmtEffect).join('<br>');
    html += `<tr>
      <td>${escHtml(c.name)}</td>
      <td><span class="type-tag" style="background:${color}">${escHtml(c.type)}</span></td>
      <td>${effects || escHtml(c.description)}</td>
    </tr>`;
  }
  html += '</tbody></table>';
  return html;
}

function buildModal(m) {
  const info = INFO[m.id] ?? { tactics: '情報なし', synergies: [] };
  const synHtml = info.synergies.map(sid => {
    const sm = MONSTERS.find(x => x.id === sid);
    return sm ? `<span class="syn-tag">${escHtml(sm.name)}</span>` : '';
  }).join('');

  const extra = [];
  if (m.hpScaledPower) extra.push('HP比例パワー');
  if (m.transformPowerBonus) extra.push(`変身後パワー+${m.transformPowerBonus}`);
  if (m.counterDef) extra.push(`カウンター: ${m.counterDef.name}(${m.counterDef.type})`);
  if (m.canRevive) extra.push('復活可');

  return `
  <div class="modal" id="modal-${escHtml(m.id)}" role="dialog" aria-modal="true" aria-label="${escHtml(m.name)}">
    <div class="modal-content">
      <button class="modal-close" onclick="closeModal('${escHtml(m.id)}')" aria-label="閉じる">✕</button>
      <h2>${escHtml(m.name)} ${roleBadge(m.role)}</h2>
      <div class="stat-row">
        <span class="stat"><span class="stat-label">HP</span> ${m.hp}</span>
        <span class="stat"><span class="stat-label">パワー</span> ${m.power}</span>
        <span class="stat"><span class="stat-label">カテゴリ</span> ${escHtml(m.category)}</span>
        ${extra.map(e => `<span class="stat extra">${escHtml(e)}</span>`).join('')}
      </div>
      <p class="monster-desc">${escHtml(m.description)}</p>
      <h3>スキルカード一覧</h3>
      ${buildMonsterCards(m.id)}
      <h3>戦法</h3>
      <p class="tactics-text">${escHtml(info.tactics)}</p>
      <h3>相性のいいモンスター</h3>
      <div class="synergy-list">${synHtml || '<span style="opacity:0.5">なし</span>'}</div>
    </div>
  </div>`;
}

function buildCard(m) {
  const info = INFO[m.id] ?? { tactics: '', synergies: [] };
  const roleClass = m.role === 'front' ? 'front' : m.role === 'rear' ? 'rear' : 'both';
  return `
  <div class="monster-card ${roleClass}" data-id="${escHtml(m.id)}" data-role="${escHtml(m.role)}" data-name="${escHtml(m.name)}" data-category="${escHtml(m.category)}"
    onclick="openModal('${escHtml(m.id)}')" tabindex="0" role="button" aria-label="${escHtml(m.name)}の詳細を見る">
    <div class="card-header">
      <span class="monster-name">${escHtml(m.name)}</span>
      ${roleBadge(m.role)}
    </div>
    <div class="card-stats">
      <span>HP <strong>${m.hp}</strong></span>
      <span>P <strong>${m.power}</strong></span>
      <span class="category-tag">${escHtml(m.category)}</span>
    </div>
  </div>`;
}

// ── Main ───────────────────────────────────────────────────────────────────

const monsterCards = MONSTERS.map(buildCard).join('\n');
const modals = MONSTERS.map(buildModal).join('\n');

const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tag Battle — モンスター図鑑</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a14;
    --surface: #12121f;
    --surface2: #1a1a2e;
    --border: #2a2a4a;
    --gold: #ffd700;
    --text: #e0e0f0;
    --muted: #888;
    --front-color: #3498db;
    --rear-color: #2ecc71;
    --both-color: #9b59b6;
    --attack: #e74c3c;
    --defense: #3498db;
    --skill: #9b59b6;
    --chain: #f39c12;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Hiragino Kaku Gothic ProN', 'Meiryo', sans-serif;
    min-height: 100vh;
    padding-bottom: 60px;
  }

  header {
    background: linear-gradient(135deg, #0a0a14 0%, #1a1a2e 100%);
    border-bottom: 2px solid var(--gold);
    padding: 24px 32px;
    text-align: center;
  }
  header h1 {
    font-size: 2rem;
    color: var(--gold);
    letter-spacing: 0.1em;
    text-shadow: 0 0 20px rgba(255,215,0,0.4);
  }
  header p { color: var(--muted); margin-top: 6px; font-size: 0.9rem; }

  .controls {
    display: flex;
    gap: 12px;
    padding: 20px 32px;
    flex-wrap: wrap;
    align-items: center;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .search-box {
    flex: 1;
    min-width: 200px;
    padding: 8px 14px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text);
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s;
  }
  .search-box:focus { border-color: var(--gold); }

  .filter-group { display: flex; gap: 8px; flex-wrap: wrap; }
  .filter-btn {
    padding: 6px 14px;
    border: 1px solid var(--border);
    border-radius: 20px;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;
  }
  .filter-btn:hover { border-color: var(--gold); color: var(--gold); }
  .filter-btn.active { background: var(--gold); color: #000; border-color: var(--gold); font-weight: bold; }

  .monster-count { color: var(--muted); font-size: 0.85rem; white-space: nowrap; }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    padding: 24px 32px;
  }

  .monster-card {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px;
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;
  }
  .monster-card:hover { border-color: var(--gold); transform: translateY(-2px); box-shadow: 0 4px 16px rgba(255,215,0,0.15); }
  .monster-card.front { border-left: 3px solid var(--front-color); }
  .monster-card.rear { border-left: 3px solid var(--rear-color); }
  .monster-card.both { border-left: 3px solid var(--both-color); }

  .card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 10px; }
  .monster-name { font-size: 0.95rem; font-weight: bold; color: var(--text); line-height: 1.3; }
  .card-stats { display: flex; gap: 10px; align-items: center; font-size: 0.82rem; color: var(--muted); }
  .card-stats strong { color: var(--text); }
  .category-tag { background: var(--surface); padding: 2px 8px; border-radius: 10px; font-size: 0.75rem; }

  .badge { padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; font-weight: bold; white-space: nowrap; }
  .badge-front { background: rgba(52,152,219,0.2); color: var(--front-color); border: 1px solid var(--front-color); }
  .badge-rear { background: rgba(46,204,113,0.2); color: var(--rear-color); border: 1px solid var(--rear-color); }
  .badge-both { background: rgba(155,89,182,0.2); color: var(--both-color); border: 1px solid var(--both-color); }

  .monster-card.hidden { display: none; }

  /* Modal */
  .modal {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    z-index: 1000;
    overflow-y: auto;
    padding: 20px;
  }
  .modal.open { display: flex; align-items: flex-start; justify-content: center; }

  .modal-content {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 28px;
    max-width: 800px;
    width: 100%;
    position: relative;
    margin: auto;
  }

  .modal-close {
    position: absolute;
    top: 14px; right: 14px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    border-radius: 50%;
    width: 32px; height: 32px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .modal-close:hover { border-color: var(--gold); color: var(--gold); }

  .modal-content h2 {
    font-size: 1.5rem;
    color: var(--gold);
    margin-bottom: 16px;
    display: flex; align-items: center; gap: 12px;
  }
  .modal-content h3 {
    font-size: 1rem;
    color: var(--gold);
    margin: 20px 0 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--border);
  }

  .stat-row { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 14px; }
  .stat { background: var(--surface); padding: 6px 14px; border-radius: 6px; font-size: 0.9rem; }
  .stat-label { color: var(--muted); margin-right: 6px; font-size: 0.8rem; }
  .stat.extra { background: rgba(155,89,182,0.15); border: 1px solid rgba(155,89,182,0.3); font-size: 0.8rem; }

  .monster-desc { color: var(--muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 4px; }

  .card-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  .card-table th, .card-table td {
    text-align: left;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
  }
  .card-table th { color: var(--muted); font-weight: normal; background: var(--surface); }
  .card-table tr:hover { background: rgba(255,255,255,0.03); }
  .card-table td:first-child { font-weight: bold; }

  .type-tag {
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: bold;
    color: #fff;
    white-space: nowrap;
  }

  .tactics-text { color: var(--text); font-size: 0.9rem; line-height: 1.7; }

  .synergy-list { display: flex; flex-wrap: wrap; gap: 8px; }
  .syn-tag {
    background: rgba(255,215,0,0.1);
    border: 1px solid rgba(255,215,0,0.3);
    color: var(--gold);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
  }

  @media (max-width: 600px) {
    header { padding: 16px; }
    header h1 { font-size: 1.4rem; }
    .controls { padding: 12px 16px; }
    .grid { padding: 16px; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
    .modal-content { padding: 20px 16px; }
  }
</style>
</head>
<body>

<header>
  <h1>⚔ Tag Battle — モンスター図鑑</h1>
  <p>全${MONSTERS.length}体のモンスターを収録。カードをクリックして詳細を見る。</p>
</header>

<div class="controls">
  <input class="search-box" type="search" placeholder="名前・カテゴリで検索…" oninput="filterMonsters()" id="searchInput" aria-label="検索">
  <div class="filter-group">
    <button class="filter-btn active" onclick="setFilter('all', this)">全て</button>
    <button class="filter-btn" onclick="setFilter('both', this)">両用</button>
    <button class="filter-btn" onclick="setFilter('front', this)">前衛向</button>
    <button class="filter-btn" onclick="setFilter('rear', this)">後衛向</button>
  </div>
  <span class="monster-count" id="countDisplay">${MONSTERS.length}体表示中</span>
</div>

<div class="grid" id="monsterGrid">
${monsterCards}
</div>

${modals}

<script>
  let currentFilter = 'all';

  function setFilter(role, btn) {
    currentFilter = role;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterMonsters();
  }

  function filterMonsters() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.monster-card');
    let visible = 0;
    cards.forEach(card => {
      const roleMatch = currentFilter === 'all' || card.dataset.role === currentFilter;
      const textMatch = !q || card.dataset.name.includes(q) || card.dataset.category.includes(q) || card.dataset.id.includes(q);
      const show = roleMatch && textMatch;
      card.classList.toggle('hidden', !show);
      if (show) visible++;
    });
    document.getElementById('countDisplay').textContent = visible + '体表示中';
  }

  function openModal(id) {
    const modal = document.getElementById('modal-' + id);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(id) {
    const modal = document.getElementById('modal-' + id);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Close on backdrop click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal(modal.id.replace('modal-', ''));
    });
  });

  // Keyboard support
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach(m => {
        m.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });
  document.querySelectorAll('.monster-card').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.id);
      }
    });
  });
<\/script>
</body>
</html>`;

mkdirSync(join(__dirname, '../docs'), { recursive: true });
writeFileSync(join(__dirname, '../docs/monsters.html'), html, 'utf8');

const byteSize = Buffer.byteLength(html, 'utf8');
console.log(`✅ docs/monsters.html を生成しました (${MONSTERS.length}体, ${(byteSize / 1024).toFixed(1)} KB)`);
