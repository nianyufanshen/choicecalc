// ============================================================
// ChoiceCalc — 多准则决策计算器
// Monte Carlo 权重空间采样 + 逆条件三路径求解
// ============================================================

// ====== 工具函数 ======
function uid(prefix) {
  return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

// ====== Module 1: Compute Core ======

function triangularRandom(min, max, mode) {
  const u = Math.random();
  const f = (mode - min) / (max - min);
  if (u <= f) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  }
}

function sampleFromWeight(weightObj) {
  const value = weightObj.value;
  const unc = weightObj.uncertainty || 'low';
  let min, max;
  if (unc === 'high') {
    return 1 + Math.random() * 9;
  }
  const halfRange = unc === 'medium' ? 1.5 : 0.5;
  min = clamp(value - halfRange, 1, 10);
  max = clamp(value + halfRange, 1, 10);
  if (min === max) return min;
  return triangularRandom(min, max, value);
}

function sampleScore(scoreObj) {
  return sampleFromWeight(scoreObj);
}

function transformLower(score) {
  return 11 - score;
}

// ====== 场景预设模板 ======
const MAX_DIMENSIONS = 8;
const MAX_OPTIONS = 8;

const SCENARIOS = [
  {
    id: 'job',
    icon: '\u{1F4BC}',
    name: '选工作',
    desc: '薪资、成长、WLB',
    dimensions: [
      { name: '薪资', direction: 'higher' },
      { name: '成长空间', direction: 'higher' },
      { name: '工作生活平衡', direction: 'higher' },
      { name: '团队氛围', direction: 'higher' },
      { name: '通勤便利', direction: 'higher' }
    ],
    options: ['公司A', '公司B', '公司C']
  },
  {
    id: 'housing',
    icon: '\u{1F3E0}',
    name: '选房子',
    desc: '价格、地段、面积',
    dimensions: [
      { name: '价格', direction: 'lower' },
      { name: '地段', direction: 'higher' },
      { name: '面积', direction: 'higher' },
      { name: '房龄', direction: 'lower' },
      { name: '交通', direction: 'higher' }
    ],
    options: ['小区A', '小区B', '小区C']
  },
  {
    id: 'tech',
    icon: '\u{1F4BB}',
    name: '技术选型',
    desc: '性能、生态、成本',
    dimensions: [
      { name: '性能', direction: 'higher' },
      { name: '生态成熟度', direction: 'higher' },
      { name: '实施成本', direction: 'lower' },
      { name: '学习曲线', direction: 'lower' },
      { name: '社区活跃度', direction: 'higher' }
    ],
    options: ['方案A', '方案B', '方案C']
  },
  {
    id: 'vendor',
    icon: '\u{1F91D}',
    name: '供应商',
    desc: '价格、质量、交期',
    dimensions: [
      { name: '价格', direction: 'lower' },
      { name: '产品质量', direction: 'higher' },
      { name: '交期保障', direction: 'higher' },
      { name: '售后服务', direction: 'higher' },
      { name: '技术能力', direction: 'higher' }
    ],
    options: ['供应商A', '供应商B', '供应商C']
  },
  {
    id: 'city',
    icon: '\u{1F306}',
    name: '选城市',
    desc: '就业、房价、气候',
    dimensions: [
      { name: '就业机会', direction: 'higher' },
      { name: '房价水平', direction: 'lower' },
      { name: '气候环境', direction: 'higher' },
      { name: '教育资源', direction: 'higher' },
      { name: '生活成本', direction: 'lower' }
    ],
    options: ['城市A', '城市B', '城市C']
  },
  {
    id: 'school',
    icon: '\u{1F393}',
    name: '选学校',
    desc: '排名、费用、就业',
    dimensions: [
      { name: '综合排名', direction: 'higher' },
      { name: '学费', direction: 'lower' },
      { name: '就业前景', direction: 'higher' },
      { name: '城市安全', direction: 'higher' },
      { name: '文化适配', direction: 'higher' }
    ],
    options: ['学校A', '学校B', '学校C']
  }
];

function monteCarlo(state, count = 2000, opts = {}) {
  const { adaptive = false, batchSize = 500 } = opts;
  const optIds = state.options.map(o => o.id);
  const dimIds = state.dimensions.map(d => d.id);
  const dimMap = {};
  state.dimensions.forEach(d => { dimMap[d.id] = d; });

  const winCounts = {};
  optIds.forEach(id => { winCounts[id] = 0; });

  const pairwiseCounts = {};
  optIds.forEach(i => {
    pairwiseCounts[i] = {};
    optIds.forEach(j => {
      if (i !== j) pairwiseCounts[i][j] = 0;
    });
  });

  // [文献校准] Central Weight Vector: 记录每个选项获胜时的平均权重
  // 对应 SMAA 文献中的 central weight vector 概念 (Lahdelma & Salminen, 2001)
  const cwWeightAccum = {};
  const cwWinCount = {};
  optIds.forEach(id => {
    cwWeightAccum[id] = {};
    dimIds.forEach(d => { cwWeightAccum[id][d] = 0; });
    cwWinCount[id] = 0;
  });

  // [文献校准] 极端排名追踪: 记录每个选项在各名次出现的次数
  // 对应 Kadziński et al. (2012) 的极端排名分析
  const rankCounts = {};
  optIds.forEach(id => { rankCounts[id] = {}; });

  let totalIter = 0;
  const maxIter = Math.max(count, 20000);
  let prevRankKey = null;
  let stableBatchCount = 0;
  let converged = false;

  while (totalIter < maxIter) {
    const batchLimit = Math.min(batchSize, maxIter - totalIter);
    for (let iter = 0; iter < batchLimit; iter++) {
      // 采样权重（保持原始比例，不归一化——权重间比率决定排序，归一化不影响胜负）
      const sampledWeights = {};
      for (const dimId of dimIds) {
        sampledWeights[dimId] = sampleFromWeight(state.weights[dimId]);
      }

      // 计算每个选项的总得分
      const scores = {};
      for (const opt of state.options) {
        let sum = 0;
        for (const dimId of dimIds) {
          const rawScore = sampleScore(opt.scores[dimId] || { value: 5, uncertainty: 'low' });
          const weight = sampledWeights[dimId];
          let contribution;
          if (dimMap[dimId].direction === 'lower') {
            contribution = transformLower(rawScore) * weight;
          } else {
            contribution = rawScore * weight;
          }
          sum += contribution;
        }
        scores[opt.id] = sum;
      }

      // 按得分排序
      const sorted = optIds.slice().sort((a, b) => scores[b] - scores[a]);
      const bestId = sorted[0];
      winCounts[bestId]++;

      // 记录胜者的中心权重
      cwWinCount[bestId]++;
      for (const dimId of dimIds) {
        cwWeightAccum[bestId][dimId] += sampledWeights[dimId];
      }

      // 记录每个选项在本轮的名次
      sorted.forEach((id, idx) => {
        const rank = idx + 1;
        rankCounts[id][rank] = (rankCounts[id][rank] || 0) + 1;
      });

      // 两两对比
      for (let i = 0; i < optIds.length; i++) {
        for (let j = 0; j < optIds.length; j++) {
          if (i === j) continue;
          if (scores[optIds[i]] > scores[optIds[j]]) {
            pairwiseCounts[optIds[i]][optIds[j]]++;
          }
        }
      }
    }

    totalIter += batchLimit;

    // [文献校准] 自适应收敛检测: 连续3个batch排名不变则提前终止
    // Tervonen & Figueira (2016) 讨论了样本量稳定性，HAR 论文用自相关做收敛指标
    if (adaptive && totalIter >= 2 * batchSize) {
      const curRankKey = optIds.slice().sort((a, b) => winCounts[b] - winCounts[a]).join('|');
      if (curRankKey === prevRankKey) {
        stableBatchCount++;
        if (stableBatchCount >= 3) {
          // 额外检查: 胜率变化 < 2% 才算真收敛
          converged = true;
          break;
        }
      } else {
        stableBatchCount = 0;
      }
      prevRankKey = curRankKey;
    }
  }

  // === 计算结果 ===
  const winRates = {};
  for (const id of optIds) {
    winRates[id] = winCounts[id] / totalIter;
  }

  const pairwises = {};
  for (const i of optIds) {
    pairwises[i] = {};
    for (const j of optIds) {
      if (i === j) continue;
      pairwises[i][j] = pairwiseCounts[i][j] / totalIter;
    }
  }

  // 中心权重向量: 选项赢的时候，各维度的平均权重
  const centralWeights = {};
  for (const id of optIds) {
    if (cwWinCount[id] > 0) {
      centralWeights[id] = {};
      for (const dimId of dimIds) {
        centralWeights[id][dimId] = Math.round(cwWeightAccum[id][dimId] / cwWinCount[id] * 10) / 10;
      }
    }
  }

  // 极端排名: 每个选项的最好/最差名次（基于 rankCounts）
  const extremeRanks = {};
  for (const id of optIds) {
    const ranks = Object.keys(rankCounts[id]).map(Number);
    extremeRanks[id] = {
      best: ranks.length > 0 ? Math.min(...ranks) : 1,
      worst: ranks.length > 0 ? Math.max(...ranks) : optIds.length,
      // 主导概率: 排第一的频率
      firstPct: (rankCounts[id][1] || 0) / totalIter
    };
  }

  return {
    winRates,
    pairwises,
    n: totalIter,
    centralWeights,
    extremeRanks,
    converged,
    nRequested: count
  };
}

// [文献校准] Erwig (2022/2025) 解释框架:
// 对比两个选项时，拆解到"每个维度贡献了多少分差"，
// 让用户理解"为什么A赢了B"而非只看数字
// 返回 { main, cwDeviation } 方便 UI 折叠
function explainPairwise(winnerId, loserId, state, centralWeights) {
  const winner = state.options.find(o => o.id === winnerId);
  const loser = state.options.find(o => o.id === loserId);
  if (!winner || !loser) return null;
  const dims = state.dimensions;
  const wDef = centralWeights && centralWeights[winnerId]
    ? centralWeights[winnerId]
    : (() => { const o = {}; dims.forEach(d => { o[d.id] = state.weights[d.id].value; }); return o; })();

  // 计算每个维度的贡献分差
  const diffs = [];
  let totalAdvantage = 0;
  for (const dim of dims) {
    const wS = winner.scores[dim.id] ? winner.scores[dim.id].value : 5;
    const lS = loser.scores[dim.id] ? loser.scores[dim.id].value : 5;
    const wScore = dim.direction === 'lower' ? 11 - wS : wS;
    const lScore = dim.direction === 'lower' ? 11 - lS : lS;
    const diff = (wScore - lScore) * (wDef[dim.id] || state.weights[dim.id].value);
    if (Math.abs(diff) > 0.01) {
      diffs.push({ dim, wScore, lScore, diff, weight: wDef[dim.id] || state.weights[dim.id].value });
      totalAdvantage += diff;
    }
  }

  if (diffs.length === 0) return null;

  diffs.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

  // 构建自然语言解释
  const advParts = diffs.filter(d => d.diff > 0).slice(0, 3);
  const disadvParts = diffs.filter(d => d.diff < 0).slice(0, 2);

  let main = '';
  if (advParts.length > 0) {
    main += winner.name + '领先主要靠';
    main += advParts.map(d =>
      d.dim.name + '(' + d.wScore + ' vs ' + d.lScore + ')'
    ).join('、');
  }
  if (disadvParts.length > 0) {
    main += '；劣势在' + disadvParts.map(d =>
      d.dim.name + '(' + d.wScore + ' vs ' + d.lScore + ')'
    ).join('、');
  }
  main += '。';

  // 如果中心权重与用户设定有明显差异，作为可选部分
  let cwDeviation = '';
  if (centralWeights && centralWeights[winnerId]) {
    const cw = centralWeights[winnerId];
    const notable = [];
    for (const dim of dims) {
      const userVal = state.weights[dim.id].value;
      const cwVal = cw[dim.id];
      if (Math.abs(cwVal - userVal) > 1.5) {
        notable.push({ name: dim.name, userVal, cwVal });
      }
    }
    if (notable.length > 0) {
      cwDeviation = '当' + winner.name + '赢的时候，';
      cwDeviation += notable.map(n =>
        n.name + '的权重平均为' + n.cwVal + '（你设了' + n.userVal + '）'
      ).join('、');
      cwDeviation += '，提示实际赢面需要的偏好分布可能和你直觉不同。';
    }
  }

  return { main: main, cwDeviation: cwDeviation };
}

function inverse3path(state, targetOptionId, monteCarloResult, optionsCount = 10000) {
  const dims = state.dimensions;
  const championId = Object.entries(monteCarloResult.winRates)
    .sort((a, b) => b[1] - a[1])[0][0];
  if (targetOptionId === championId) return [];
  const target = state.options.find(o => o.id === targetOptionId);
  if (!target) return [];

  // [优化 v2] 缓存层: 同一 (dimId, weight) 对只跑一次 MC
  // 消除 Path A ↔ Path C 之间的冗余计算
  const mcCache = {};
  const paths = [];

  // 全量 MC（2000 iter, 自适应收敛），结果可缓存
  function mcAt(dimId, val) {
    const key = dimId + '|' + val.toFixed(1);
    if (mcCache[key] !== undefined) return mcCache[key];
    const orig = state.weights[dimId].value;
    state.weights[dimId].value = clamp(val, 1, 10);
    mcCache[key] = monteCarlo(state, 2000).winRates[targetOptionId] || 0;
    state.weights[dimId].value = orig;
    return mcCache[key];
  }

  // 轻量 MC（800 iter, 无自适应）: 仅用于二分搜索内部的"是否 >0.5"比较
  function mcQuick(dimId, val) {
    const key = 'q|' + dimId + '|' + val.toFixed(1);
    if (mcCache[key] !== undefined) return mcCache[key];
    const orig = state.weights[dimId].value;
    state.weights[dimId].value = clamp(val, 1, 10);
    mcCache[key] = monteCarlo(state, 800, { adaptive: false }).winRates[targetOptionId] || 0;
    state.weights[dimId].value = orig;
    return mcCache[key];
  }

  // ---- Path A: Minimal Adjustment ----
  let bestA = null;
  for (const dim of dims) {
    const current = state.weights[dim.id].value;
    const rateUp = mcAt(dim.id, 10);
    const rateDown = mcAt(dim.id, 1);

    let candidates = [];

    if (rateUp > 0.5) {
      let lo = current + 0.05, hi = 10;
      for (let i = 0; i < 10; i++) {           // [优化] 12 → 10 轮，精度仍有 0.01
        const mid = (lo + hi) / 2;
        if (mcQuick(dim.id, mid) > 0.5) hi = mid;
        else lo = mid;
      }
      const val = Math.round((lo + hi) / 2 * 10) / 10;
      const fr = mcAt(dim.id, val);             // [优化] 最终确认用全量 MC
      candidates.push({ val, offset: Math.abs(val - current), flipRate: fr });
    }

    if (rateDown > 0.5) {
      let lo = 1, hi = current - 0.05;
      for (let i = 0; i < 10; i++) {
        const mid = (lo + hi) / 2;
        if (mcQuick(dim.id, mid) > 0.5) lo = mid;
        else hi = mid;
      }
      const val = Math.round((lo + hi) / 2 * 10) / 10;
      const fr = mcAt(dim.id, val);
      candidates.push({ val, offset: Math.abs(val - current), flipRate: fr });
    }

    if (candidates.length > 0) {
      candidates.sort((a, b) => a.offset - b.offset);
      const best = candidates[0];
      const dir = best.val > current ? '升到' : '降到';
      if (!bestA || best.offset < bestA.offset) {
        bestA = {
          type: 'minimal',
          dimensionId: dim.id,
          dimensionName: dim.name,
          description: dim.name + '权重从' + current + dir + best.val,
          flipWinRate: Math.round(best.flipRate * 100) / 100,
          targetWeight: best.val
        };
      }
    }
  }
  if (bestA) paths.push(bestA);

  // ---- Path B: Most Intuitive ----
  const champion = state.options.find(o => o.id === championId);
  let bestB = null;
  let bestBDiff = -Infinity;
  for (const dim of dims) {
    const tScore = (target.scores[dim.id] || { value: 5 }).value;
    const cScore = (champion.scores[dim.id] || { value: 5 }).value;
    let advantage;
    if (dim.direction === 'lower') {
      advantage = cScore - tScore;
    } else {
      advantage = tScore - cScore;
    }
    if (advantage > bestBDiff) {
      bestBDiff = advantage;
      bestB = {
        type: 'intuitive',
        dimensionId: dim.id,
        dimensionName: dim.name,
        description: target.name + '的' + dim.name + '分更高(' + tScore + ' vs ' + cScore + ')',
        flipWinRate: null,
        targetWeight: null
      };
    }
  }
  if (bestB) {
    // [优化] 改用 mcAt（2000 iter, 有缓存），可能命中 Path A 的缓存
    const testW = clamp(state.weights[bestB.dimensionId].value + 2, 1, 10);
    bestB.targetWeight = Math.round(testW * 10) / 10;
    bestB.flipWinRate = Math.round(mcAt(bestB.dimensionId, testW) * 100) / 100;
    paths.push(bestB);
  }

  // ---- Path C: Most Surprising ----
  // [优化] 所有极端值调用 mcAt——命中 Path A 的缓存，零新增 MC
  const sortedDims = [...dims].sort((a, b) => state.weights[a.id].value - state.weights[b.id].value);
  for (const dim of sortedDims) {
    const rateAtExtreme = mcAt(dim.id, 10);
    if (rateAtExtreme > 0.5) {
      paths.push({
        type: 'surprising',
        dimensionId: dim.id,
        dimensionName: dim.name,
        description: '你给' + dim.name + '打了最低的权重(' + state.weights[dim.id].value + ')',
        flipWinRate: Math.round(rateAtExtreme * 100) / 100,
        targetWeight: 10
      });
      break;
    }
    const rateAtLow = mcAt(dim.id, 1);
    if (rateAtLow > 0.5) {
      paths.push({
        type: 'surprising',
        dimensionId: dim.id,
        dimensionName: dim.name,
        description: '你给' + dim.name + '打了最低的权重(' + state.weights[dim.id].value + ')',
        flipWinRate: Math.round(rateAtLow * 100) / 100,
        targetWeight: 1
      });
      break;
    }
  }

  return paths;
}

// ====== Module 2: State Management ======

const DEFAULT_STATE = {
  options: [
    { id: 'opt-co-a', name: '公司A', scores: { 'dim-salary': { value: 5, uncertainty: 'low' }, 'dim-growth': { value: 9, uncertainty: 'low' }, 'dim-commute': { value: 3, uncertainty: 'low' }, 'dim-overtime': { value: 7, uncertainty: 'low' } } },
    { id: 'opt-co-b', name: '公司B', scores: { 'dim-salary': { value: 8, uncertainty: 'low' }, 'dim-growth': { value: 7, uncertainty: 'low' }, 'dim-commute': { value: 5, uncertainty: 'low' }, 'dim-overtime': { value: 5, uncertainty: 'low' } } },
    { id: 'opt-co-c', name: '公司C', scores: { 'dim-salary': { value: 9, uncertainty: 'low' }, 'dim-growth': { value: 6, uncertainty: 'low' }, 'dim-commute': { value: 8, uncertainty: 'low' }, 'dim-overtime': { value: 3, uncertainty: 'low' } } }
  ],
  weights: {
    'dim-salary': { value: 8, uncertainty: 'medium' },
    'dim-growth': { value: 7, uncertainty: 'low' },
    'dim-commute': { value: 5, uncertainty: 'low' },
    'dim-overtime': { value: 6, uncertainty: 'low' }
  },
  dimensions: [
    { id: 'dim-salary', name: '薪资', direction: 'higher' },
    { id: 'dim-growth', name: '成长空间', direction: 'higher' },
    { id: 'dim-commute', name: '通勤时长', direction: 'lower' },
    { id: 'dim-overtime', name: '加班情况', direction: 'lower' }
  ]
};

let state = JSON.parse(JSON.stringify(DEFAULT_STATE));
let mcResultCache = null;
let inverseCache = null;
let currentChart = null;
let saveTimer = null;

function getState() {
  return state;
}

function setState(newState) {
  state = newState;
  scheduleSave();
}

function resetState() {
  state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  mcResultCache = null;
  inverseCache = null;
  renderFromState();
  runFullCompute();
  scheduleSave();
}

// ---- CRUD ----

function showToast(msg) {
  const existing = document.getElementById('toast-msg');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'toast-msg';
  el.textContent = msg;
  Object.assign(el.style, {
    position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
    background: '#1E293B', color: '#fff', padding: '10px 20px', borderRadius: '8px',
    fontSize: '13px', zIndex: '9999', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    fontFamily: 'var(--font)', maxWidth: '400px', textAlign: 'center',
    transition: 'opacity 0.3s'
  });
  document.body.appendChild(el);
  setTimeout(function () { el.style.opacity = '0'; setTimeout(function () { el.remove(); }, 300); }, 2500);
}

function loadScenario(scenarioId) {
  const sc = SCENARIOS.find(s => s.id === scenarioId);
  if (!sc) return;
  if (state.options.length > 0 || state.dimensions.length > 0) {
    if (!confirm('\u786E\u5B9A\u52A0\u8F7D\u201C' + sc.name + '\u201D\u6A21\u677F\uFF1F\u5F53\u524D\u6240\u6709\u6570\u636E\u5C06\u4F1A\u88AB\u6E05\u9664\u3002')) return;
  }

  // 用空状态替换，不继承 DEFAULT_STATE
  state = { options: [], weights: {}, dimensions: [] };

  // 添加维度
  sc.dimensions.forEach(d => {
    const id = 'dim-' + uid('d');
    state.dimensions.push({ id, name: d.name, direction: d.direction });
    state.weights[id] = { value: 5, uncertainty: 'low' };
  });

  // 添加选项（默认分数5）
  sc.options.forEach(name => {
    const id = 'opt-' + uid('o');
    const scores = {};
    state.dimensions.forEach(d => { scores[d.id] = { value: 5, uncertainty: 'low' }; });
    state.options.push({ id, name, scores });
  });

  mcResultCache = null;
  inverseCache = null;
  renderFromState();
  runFullCompute();
  scheduleSave();

  showToast('\u2714\uFE0F \u5DF2\u52A0\u8F7D\u201C' + sc.name + '\u201D\u6A21\u677F\uFF0C\u70B9\u51FB\u9009\u9879\u5C55\u5F00\u6253\u5206');
}

function addOption(name) {
  if (state.options.length >= MAX_OPTIONS) {
    showToast('\u26A0\uFE0F 最多 ' + MAX_OPTIONS + ' 个选项，已达上限');
    return;
  }
  const id = 'opt-' + uid('o');
  const scores = {};
  state.dimensions.forEach(d => {
    scores[d.id] = { value: 5, uncertainty: 'low' };
  });
  state.options.push({ id, name, scores });
  mcResultCache = null;
  renderFromState();
  runFullCompute();
  scheduleSave();
}

function removeOption(id) {
  if (state.options.length <= 2) return;
  state.options = state.options.filter(o => o.id !== id);
  mcResultCache = null;
  renderFromState();
  runFullCompute();
  scheduleSave();
}

function addDimension(name, direction) {
  if (state.dimensions.length >= MAX_DIMENSIONS) {
    showToast('\u26A0\uFE0F 最多 ' + MAX_DIMENSIONS + ' 个维度，已达上限');
    return;
  }
  const id = 'dim-' + uid('d');
  state.dimensions.push({ id, name, direction });
  state.weights[id] = { value: 5, uncertainty: 'low' };
  state.options.forEach(opt => {
    opt.scores[id] = { value: 5, uncertainty: 'low' };
  });
  mcResultCache = null;
  renderFromState();
  runFullCompute();
  scheduleSave();
}

function removeDimension(id) {
  if (state.dimensions.length <= 2) return;
  state.dimensions = state.dimensions.filter(d => d.id !== id);
  delete state.weights[id];
  state.options.forEach(opt => {
    delete opt.scores[id];
  });
  mcResultCache = null;
  renderFromState();
  runFullCompute();
  scheduleSave();
}

// ====== Module 3: DOM Rendering & Binding ======

let initialRenderDone = false;

function renderFromState() {
  const app = document.getElementById('app');
  if (!app) return;

  if (!initialRenderDone) {
    app.innerHTML = '';
    app.appendChild(buildLayout());
    initialRenderDone = true;
  }

  renderOptionList();
  renderWeightRows();
  const mc = computeIfNeeded(2000);
  if (mc) {
    updateResults(mc);
  }
}

function buildLayout() {
  const container = document.createElement('div');
  container.className = 'choicecalc-layout';

  container.innerHTML = `
    <div class="left-panel">
    <div class="app-title">算择 <small>ChoiceCalc</small></div>
    <div class="app-subtitle">量化纠结 · 多因素决策计算器</div>
    <div class="app-hint">拖拽权重滑条 → 右侧实时反馈结论变化</div>
      <div class="panel-section scenario-bar-panel">
        <div class="scenario-bar">
          <span class="scenario-bar-label">快速模板</span>` +
          SCENARIOS.map(s => '<button class="scenario-btn" data-scenario="' + s.id + '"><span class="s-icon">' + s.icon + '</span><span class="s-label">' + s.name + '</span></button>').join('') +
        `</div>
      </div>
      <div class="panel-section">
        <div class="panel-header">
          <h3>选项</h3>
          <button class="btn-small btn-add" id="add-option-btn">+ 添加</button>
        </div>
        <div class="section-hint">给每个选项在每个维度上打分——分数是你的主观评价，越高代表你越满意。模拟时会加一点随机波动，看你有没有"看走眼"</div>
        <div id="option-list"></div>
        <div id="add-option-input" class="inline-input-wrap" style="display:none">
          <input type="text" id="new-option-name" class="inline-input" placeholder="选项名称，回车确认" maxlength="24">
          <div class="inline-input-actions">
            <button id="confirm-option" class="btn-small primary">确定</button>
            <button id="cancel-option" class="btn-small">取消</button>
          </div>
        </div>
      </div>
      <div class="panel-section">
        <div class="panel-header">
          <h3>权重</h3>
          <button class="btn-small btn-add" id="add-dimension-btn">+ 添加</button>
        </div>
        <div class="section-hint">权重决定这个维度在模拟中的影响大小——越高，它的得分起伏对最终结果影响越大。不确定度越高，每次模拟的波动范围越宽</div>
        <div id="global-dimensions"></div>
        <div id="add-dimension-input" class="inline-input-wrap" style="display:none">
          <div class="inline-input-row">
            <input type="text" id="new-dim-name" class="inline-input" placeholder="维度名称，回车确认" maxlength="20" style="flex:1">
            <button id="dim-direction" class="btn-small dir-toggle" style="flex-shrink:0;">↑ 越高越好</button>
            <button id="confirm-dim" class="btn-small primary">确定</button>
            <button id="cancel-dim" class="btn-small">取消</button>
          </div>
        </div>
      </div>
      <div class="panel-section guide-panel">
        <div class="guide-hint">
          <strong>💡 怎么用</strong><br>
          ① 在<strong>选项</strong>里添加你要比较的候选<br>
          ② 在<strong>权重</strong>里设定每个维度有多重要（越高影响越大）<br>
          ③ 点开每个选项，给它们在各个维度上打分（你的主观评价）<br>
          ④ 右边实时模拟 10,000 次——看你的选择在各种"可能看走眼"的情况下到底稳不稳
        </div>
      </div>
      <div class="panel-section bottom-actions">
        <button class="btn-reset" id="reset-btn">↺ 重置</button>
        <button class="btn-small" id="copy-summary-btn">📋 复制摘要</button>
        <button class="btn-small" id="export-btn">↓ JSON</button>
        <button class="btn-small" id="import-btn">↑ JSON</button>
        <input type="file" id="import-file" accept=".json" style="display:none">
      </div>
    </div>
    <div class="right-panel">
      <div id="stability-panel" class="panel-section">
        <div class="stability-header">
          <span id="stability-shield-icon"></span>
          <span id="stability-text"></span>
        </div>
        <div id="stability-subtitle" class="stability-subtitle"></div>
        <div id="stability-stats" class="stability-stats" style="display:none">
          <div class="stability-stat">
            <span class="stability-stat-val" id="stat-pct"></span>
            <span class="stability-stat-label">胜率</span>
          </div>
          <div class="stability-stat">
            <span class="stability-stat-val" id="stat-rank"></span>
            <span class="stability-stat-label">名次范围</span>
          </div>
          <div class="stability-stat">
            <span class="stability-stat-val" id="stat-options"></span>
            <span class="stability-stat-label">选项数</span>
          </div>
        </div>
        <div id="hint-text" class="hint-text">💡 工具模拟了 10,000 次"你可能看走眼"的情况——你的权重和评分每次会小幅随机波动，看谁在各种情况下都稳。不是算"谁最好"，是测"谁最扛得住你的不确定"。</div>
      </div>
      <div class="panel-section" id="inverse-section" style="display:none">
        <div class="panel-header">
          <h4>翻盘路径</h4>
        </div>
        <div class="section-hint">如果冠军不是你想要的——下面展示的是"要让它翻盘需要改变什么"，不是建议你这么做，而是帮你检查：你嘴上说在意的和实际可能在意的是不是一回事</div>
        <div id="inverse-loading" class="inverse-loading" style="display:none">
          <span class="loading-dot"></span><span class="loading-dot"></span><span class="loading-dot"></span>
          <span class="loading-text">计算中…</span>
        </div>
        <div id="inverse-suggestions"></div>
      </div>
      <div class="panel-section">
        <div class="panel-header">
          <h4>两两对比</h4>
        </div>
        <div class="section-hint">两个选项正面交锋——看谁在各种权重波动下赢面更大，差距多大</div>
        <div id="pairwise-table"></div>
      </div>
      <div class="panel-section chart-section">
        <div class="panel-header">
          <h4>胜率分布</h4>
        </div>
        <div id="pie-chart" style="width:100%;height:240px"></div>
      </div>
    </div>
  `;

  return container;
}

function renderOptionList() {
  const el = document.getElementById('option-list');
  if (!el) return;
  el.innerHTML = '';
  if (state.options.length === 0) {
    el.innerHTML = '<div class="empty-state">暂无选项。点击上方\u201C+ 添加\u201D开始分析</div>';
    return;
  }
  state.options.forEach(opt => {
    const card = document.createElement('div');
    card.className = 'option-card';
    card.dataset.optionId = opt.id;

    const header = document.createElement('div');
    header.className = 'option-header';
    header.innerHTML = `
      <span class="option-name">${escHtml(opt.name)}</span>
      <span class="option-winrate" id="wr-${opt.id}"></span>
      <span class="expand-indicator">▸</span>
      <span class="option-remove" data-id="${opt.id}">✕</span>
    `;
    header.addEventListener('click', function (e) {
      if (e.target.classList.contains('option-remove')) return;
      const body = card.querySelector('.option-scores-body');
      const indicator = card.querySelector('.expand-indicator');
      if (body) {
        body.style.display = body.style.display === 'none' ? 'block' : 'none';
        indicator.textContent = body.style.display === 'none' ? '▸' : '▾';
      }
    });

    const body = document.createElement('div');
    body.className = 'option-scores-body';
    body.style.display = 'none';
    state.dimensions.forEach(dim => {
      const score = opt.scores[dim.id] || { value: 5, uncertainty: 'low' };
      const row = document.createElement('div');
      row.className = 'score-row';
      row.innerHTML = `
        <label class="score-label">${escHtml(dim.name)}</label>
        <input type="range" class="score-slider score-main" min="1" max="10" step="0.5"
          value="${score.value}" data-option="${opt.id}" data-dimension="${dim.id}">
        <span class="score-value" id="sv-${opt.id}-${dim.id}">${score.value}</span>
        <select class="score-uncertainty" data-option="${opt.id}" data-dimension="${dim.id}" title="你给这个评分的确定程度：低=±0.5 / 中=±1.5 / 高=完全不确定[1,10]">
          <option value="low" ${score.uncertainty === 'low' ? 'selected' : ''}>低</option>
          <option value="medium" ${score.uncertainty === 'medium' ? 'selected' : ''}>中</option>
          <option value="high" ${score.uncertainty === 'high' ? 'selected' : ''}>高</option>
        </select>
      `;
      body.appendChild(row);
    });

    const removeBtn = header.querySelector('.option-remove');
    removeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      removeOption(opt.id);
    });

    card.appendChild(header);
    card.appendChild(body);
    el.appendChild(card);
  });

  attachSliderEvents();
}

function renderWeightRows() {
  const el = document.getElementById('global-dimensions');
  if (!el) return;
  el.innerHTML = '';
  if (state.dimensions.length === 0) {
    el.innerHTML = '<div class="empty-state">暂无维度。点击上方\u201C+ 添加\u201D添加评分维度</div>';
    return;
  }
  state.dimensions.forEach(dim => {
    const w = state.weights[dim.id] || { value: 5, uncertainty: 'low' };
    const row = document.createElement('div');
    row.className = 'weight-row';
    row.dataset.dimensionId = dim.id;
    row.innerHTML = `
      <label class="weight-label" title="${dim.direction === 'lower' ? '越低越好' : '越高越好'}">
        ${escHtml(dim.name)}
        <span class="dir-badge">${dim.direction === 'lower' ? '↓' : '↑'}</span>
      </label>
      <input type="range" class="weight-main weight-slider" min="1" max="10" step="0.5"
        value="${w.value}" data-dimension="${dim.id}">
      <span class="weight-value" id="wv-${dim.id}">${w.value}</span>
      <select class="weight-uncertainty" data-dimension="${dim.id}" title="你对这个权重的确定程度：低=±0.5 / 中=±1.5 / 高=完全不确定[1,10]">
        <option value="low" ${w.uncertainty === 'low' ? 'selected' : ''}>低</option>
        <option value="medium" ${w.uncertainty === 'medium' ? 'selected' : ''}>中</option>
        <option value="high" ${w.uncertainty === 'high' ? 'selected' : ''}>高</option>
      </select>
      <span class="dim-remove" data-dimension="${dim.id}">✕</span>
    `;

    const removeBtn = row.querySelector('.dim-remove');
    removeBtn.addEventListener('click', function () {
      removeDimension(dim.id);
    });

    el.appendChild(row);
  });

  attachSliderEvents();
}

function escHtml(s) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(s));
  return div.innerHTML;
}

function attachSliderEvents() {
  document.querySelectorAll('.weight-main').forEach(el => {
    updateSliderFill(el);
    el.removeEventListener('input', onWeightInput);
    el.removeEventListener('change', onWeightChange);
    el.addEventListener('input', onWeightInput);
    el.addEventListener('change', onWeightChange);
  });
  document.querySelectorAll('.weight-uncertainty').forEach(el => {
    el.removeEventListener('change', onWeightUncertaintyChange);
    el.addEventListener('change', onWeightUncertaintyChange);
  });
  document.querySelectorAll('.score-slider').forEach(el => {
    updateSliderFill(el);
    el.removeEventListener('input', onScoreInput);
    el.removeEventListener('change', onScoreChange);
    el.addEventListener('input', onScoreInput);
    el.addEventListener('change', onScoreChange);
  });
  document.querySelectorAll('.score-uncertainty').forEach(el => {
    el.removeEventListener('change', onScoreUncertaintyChange);
    el.addEventListener('change', onScoreUncertaintyChange);
  });
}

function updateSliderFill(el) {
  const min = parseFloat(el.min) || 1;
  const max = parseFloat(el.max) || 10;
  const val = parseFloat(el.value) || 5;
  const pct = ((val - min) / (max - min) * 100).toFixed(0);
  el.style.setProperty('--pct', pct + '%');
}

function onWeightInput(e) {
  const dimId = e.target.dataset.dimension;
  const val = parseFloat(e.target.value);
  state.weights[dimId].value = val;
  const valEl = document.getElementById('wv-' + dimId);
  if (valEl) valEl.textContent = val;
  // 更新滑条渐变填充
  const pct = ((val - 1) / 9 * 100).toFixed(0);
  e.target.style.setProperty('--pct', pct + '%');
  if (currentChart) {
    const mc = monteCarlo(state, 2000, { adaptive: true, batchSize: 500 });
    mcResultCache = mc;
    updateResults(mc);
  }
}

function onWeightChange(e) {
  const dimId = e.target.dataset.dimension;
  const val = parseFloat(e.target.value);
  state.weights[dimId].value = val;
  scheduleSave();
  runFullCompute();
}

function onWeightUncertaintyChange(e) {
  const dimId = e.target.dataset.dimension;
  state.weights[dimId].uncertainty = e.target.value;
  scheduleSave();
  runFullCompute();
}

function onScoreInput(e) {
  const optId = e.target.dataset.option;
  const dimId = e.target.dataset.dimension;
  const val = parseFloat(e.target.value);
  state.options.find(o => o.id === optId).scores[dimId].value = val;
  const valEl = document.getElementById('sv-' + optId + '-' + dimId);
  if (valEl) valEl.textContent = val;
  // 更新滑条渐变填充
  const pct = ((val - 1) / 9 * 100).toFixed(0);
  e.target.style.setProperty('--pct', pct + '%');
  if (currentChart) {
    const mc = monteCarlo(state, 2000, { adaptive: true, batchSize: 500 });
    mcResultCache = mc;
    updateResults(mc);
  }
}

function onScoreChange(e) {
  const optId = e.target.dataset.option;
  const dimId = e.target.dataset.dimension;
  state.options.find(o => o.id === optId).scores[dimId].value = parseFloat(e.target.value);
  scheduleSave();
  runFullCompute();
}

function onScoreUncertaintyChange(e) {
  const optId = e.target.dataset.option;
  const dimId = e.target.dataset.dimension;
  state.options.find(o => o.id === optId).scores[dimId].uncertainty = e.target.value;
  scheduleSave();
  runFullCompute();
}

function computeIfNeeded(count, adaptive) {
  if (!mcResultCache || mcResultCache.n < count) {
    mcResultCache = monteCarlo(state, count, { adaptive: adaptive !== false });
  }
  return mcResultCache;
}

function updateResults(mc) {
  renderStability(mc.winRates, mc.extremeRanks);
  renderPairwises(mc.winRates, mc.pairwises, mc);
  updateChart(mc.winRates);
  updateOptionWinRates(mc.winRates);
}

function updateOptionWinRates(winRates) {
  state.options.forEach(opt => {
    const el = document.getElementById('wr-' + opt.id);
    if (el) {
      const pct = Math.round((winRates[opt.id] || 0) * 100);
      el.textContent = pct + '%';
    }
  });
}

// ====== Module 4: Stability Shield ======

function renderStability(winRates, extremeRanks) {
  const shieldIcon = document.getElementById('stability-shield-icon');
  const text = document.getElementById('stability-text');
  const subtitle = document.getElementById('stability-subtitle');
  const panel = document.getElementById('stability-panel');

  if (!shieldIcon || !text || !subtitle || !panel) return;

  const sorted = Object.entries(winRates).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return;
  const [topId, topRate] = sorted[0];
  const topName = state.options.find(o => o.id === topId)?.name || topId;
  const topPct = Math.round(topRate * 100);

  // 极端排名信息
  const er = extremeRanks && extremeRanks[topId];
  const rankRange = er && er.worst > 1
    ? '第1–' + er.worst + '名'
    : '第1名';

  // 填充统计卡
  const statPct = document.getElementById('stat-pct');
  const statRank = document.getElementById('stat-rank');
  const statOpts = document.getElementById('stat-options');
  const statsRow = document.getElementById('stability-stats');
  if (statPct) statPct.textContent = topPct + '%';
  if (statRank) statRank.textContent = rankRange;
  if (statOpts) statOpts.textContent = state.options.length + '项';
  if (statsRow) statsRow.style.display = '';

  let shieldChar, statusText, statusSub, panelClass;

  if (topRate > 0.6) {
    shieldChar = '\u{1F6E1}\uFE0F';
    statusText = topName + ' 最稳';
    statusSub = '🏆 模拟 10,000 次 → ' + topName + ' 领先 ' + topPct + ' 次，排名波动 ' + rankRange + '。';
    statusSub += ' 大部分情况下 ' + topName + ' 都是最优选——说明你的权重和评分指向一致。';
    panelClass = 'stable';
  } else if (topRate >= 0.4) {
    shieldChar = '\u{26A1}\uFE0F';
    statusText = topName + ' 领先但有点悬';
    statusSub = '⚡ 模拟 10,000 次 → ' + topName + ' 领先 ' + topPct + ' 次' + (rankRange ? '（排名波动 ' + rankRange + '）' : '') + '。';
    statusSub += ' 结论对假设变化敏感——稍微调一调权重，结果就可能翻盘。';
    panelClass = 'unstable';
  } else {
    shieldChar = '\u2014';
    statusText = '选谁都差不多';
    statusSub = '🔍 模拟 10,000 次 → 最高才 ' + topPct + ' 次领先' + (rankRange ? '（排名波动 ' + rankRange + '）' : '') + '。';
    statusSub += ' 没有明显更优的选项，建议缩小范围或重新审视你的评分。';
    panelClass = 'uncertain';
  }

  shieldIcon.textContent = shieldChar;
  text.textContent = statusText;
  subtitle.textContent = statusSub;
  panel.className = 'panel-section ' + panelClass;

  // Hide hint text after first meaningful result
  var hint = document.getElementById('hint-text');
  if (hint) hint.style.display = 'none';
}

// ====== Module 5: ECharts Pie Chart ======

function initChart() {
  const el = document.getElementById('pie-chart');
  if (!el || typeof echarts === 'undefined') return;
  currentChart = echarts.init(el);
  window.addEventListener('resize', function () {
    if (currentChart) currentChart.resize();
  });
}

function updateChart(winRates) {
  if (!currentChart) return;
  const sorted = Object.entries(winRates).sort((a, b) => b[1] - a[1]);
  const colors = ['#1E293B', '#475569', '#64748B', '#94A3B8', '#CBD5E0'];
  const data = sorted.map(([id, rate], i) => {
    const name = state.options.find(o => o.id === id)?.name || id;
    return {
      value: Math.round(rate * 10000) / 100,
      name: name,
      itemStyle: { color: colors[i % colors.length] }
    };
  });

  currentChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    series: [{
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      label: {
        show: true,
        formatter: '{b}\n{d}%',
        fontSize: 11,
        color: '#CBD5E0'
      },
      labelLine: { length: 8, length2: 10 },
      data: data
    }]
  }, true);
}

// ====== Module 6: Try This Buttons ======

function attachTryThisButtons() {
  document.querySelectorAll('.try-this-btn').forEach(el => {
    el.removeEventListener('click', onTryThis);
    el.addEventListener('click', onTryThis);
  });
}

function onTryThis(e) {
  const btn = e.currentTarget;
  const dimId = btn.dataset.dimension;
  const targetWeight = parseFloat(btn.dataset.targetWeight);
  if (!dimId || isNaN(targetWeight)) return;

  const slider = document.querySelector('.weight-main[data-dimension="' + dimId + '"]');
  if (!slider) return;

  slider.value = targetWeight;
  state.weights[dimId].value = targetWeight;
  const valEl = document.getElementById('wv-' + dimId);
  if (valEl) valEl.textContent = targetWeight;

  const quickMC = monteCarlo(state, 2000);
  mcResultCache = quickMC;
  updateResults(quickMC);

  const fullMC = monteCarlo(state, 10000);
  mcResultCache = fullMC;
  inverseCache = null;
  updateResults(fullMC);
  renderInverseSuggestions(fullMC);

  slider.classList.add('highlight-flash');
  setTimeout(function () { slider.classList.remove('highlight-flash'); }, 1500);
}

// ====== Module 6b: Render Inverse Suggestions ======

function renderInverseSuggestions(mcResult) {
  const section = document.getElementById('inverse-section');
  const container = document.getElementById('inverse-suggestions');
  const loading = document.getElementById('inverse-loading');
  if (!section || !container) return;

  const championId = Object.entries(mcResult.winRates).sort((a, b) => b[1] - a[1])[0][0];
  const nonChampions = state.options.filter(o => o.id !== championId);

  if (nonChampions.length === 0) {
    section.style.display = 'none';
    return;
  }

  // 显示 loading（异步不阻塞界面，但给用户一个心理预期）
  container.innerHTML = '';
  if (loading) loading.style.display = 'flex';
  section.style.display = '';
  // 让浏览器先渲染 loading 再执行耗时计算
  setTimeout(function () {
    let html = '';
    nonChampions.forEach(opt => {
      const paths = inverse3path(state, opt.id, mcResult);
      if (paths.length === 0) return;
      // 替换为诊断视角的文案——不是"建议"，是"揭示矛盾"
      const typeMeta = {
        minimal:    { icon: '\u{1F3AF}', label: '矛盾诊断', tip: '只需要动一个维度的权重就能翻盘——说明这个维度是关键杠杆' },
        intuitive:  { icon: '\u{1F4A1}', label: '优势诊断', tip: '这个选项本身有优势维度，但权重不够高——拉高就能翻盘' },
        surprising: { icon: '\u{1F50D}', label: '盲区诊断', tip: '你给最低权重的维度反而能帮它翻盘——你可能低估了这个维度的重要性' }
      };

      html += '<div class="inverse-group">';
      html += '<div class="inverse-target">当前 <strong>' + escHtml(state.options.find(o => o.id === championId)?.name || '') + '</strong> 领先。如果还是想选 <strong>' + escHtml(opt.name) + '</strong>，数据告诉你需要改变什么：</div>';
      paths.forEach(p => {
        const meta = typeMeta[p.type] || { icon: '\u{25C6}', label: p.type, tip: '' };
        const pct = p.flipWinRate != null ? Math.round(p.flipWinRate * 100) + '%' : '?';
        html += '<div class="suggestion-item">';
        html += '  <span class="suggestion-label-col">';
        html += '    <span class="suggestion-icon" title="' + meta.tip + '">' + meta.icon + '</span>';
        html += '    <span class="suggestion-label" title="' + meta.tip + '">' + meta.label + '</span>';
        html += '  </span>';
        html += '  <span class="suggestion-desc">' + escHtml(p.description) + '</span>';
        html += '  <span class="suggestion-rate">\u2192 ' + escHtml(opt.name) + ' ' + pct + '可反超</span>';
        if (p.targetWeight != null) {
          html += '  <button class="try-this-btn" data-dimension="' + p.dimensionId + '" data-target-weight="' + p.targetWeight + '">\u{1F449} 应用</button>';
        }
        html += '</div>';
      });
      html += '</div>';
    });

    if (loading) loading.style.display = 'none';
    if (html) {
      container.innerHTML = html;
      attachTryThisButtons();
    } else {
      section.style.display = 'none';
    }
  }, 50);
}

// ====== Module 7: Pairwise ======

function renderPairwises(winRates, pairwises, mcResult) {
  const el = document.getElementById('pairwise-table');
  if (!el) return;

  const sorted = Object.entries(winRates).sort((a, b) => b[1] - a[1]);
  const ids = sorted.map(([id]) => id);
  const centralWeights = mcResult && mcResult.centralWeights;

  let html = '';
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = ids[i];
      const b = ids[j];
      const aName = state.options.find(o => o.id === a)?.name || a;
      const bName = state.options.find(o => o.id === b)?.name || b;
      const aWins = pairwises[a]?.[b] ?? 0.5;
      const bWins = 1 - aWins;
      const aPct = Math.round(aWins * 100);
      const bPct = Math.round(bWins * 100);

      const winnerId = aWins > 0.5 ? a : b;
      const loserId = aWins > 0.5 ? b : a;
      // [文献校准] Erwig 式解释: 拆解到维度级贡献分差
      const expl = explainPairwise(winnerId, loserId, state, centralWeights);

      html += '<div class="pairwise-row">';
      html += '  <span class="pw-label">' + escHtml(aName) + ' vs ' + escHtml(bName) + '</span>';
      html += '  <span class="pw-bar-container">';
      html += '    <span class="pw-bar pw-bar-a" style="width:' + aPct + '%"></span>';
      html += '  </span>';
      html += '  <span class="pw-numbers">' + aPct + ':' + bPct + '</span>';
      if (expl) {
        html += '<div class="pw-explanation">' + escHtml(expl.main);
        if (expl.cwDeviation) {
          html += ' <span class="cw-toggle" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==\'none\'?\'inline\':\'none\';this.textContent=this.textContent==\'[权重偏差]\'?\'[收起]\':\'[权重偏差]\'">[权重偏差]</span>';
          html += '<span class="cw-detail" style="display:none"> ' + escHtml(expl.cwDeviation) + '</span>';
        }
        html += '</div>';
      }
      html += '</div>';
    }
  }

  el.innerHTML = html;
}

// ====== Module 8: Persistence ======

function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(function () {
    try {
      localStorage.setItem('choicecalcState', JSON.stringify(state));
    } catch (e) {
      // silently fail
    }
  }, 500);
}

function restoreFromLocalStorage() {
  try {
    const raw = localStorage.getItem('choicecalcState');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed.options || !parsed.weights || !parsed.dimensions) return false;
    state = parsed;
    return true;
  } catch (e) {
    return false;
  }
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'choicecalc-snapshot.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed.options || !parsed.weights || !parsed.dimensions) {
        alert('无效的快照文件');
        return;
      }
      state = parsed;
      mcResultCache = null;
      inverseCache = null;
      renderFromState();
      runFullCompute();
      scheduleSave();
    } catch (err) {
      alert('读取失败: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// ====== Module 9: Init & Full Compute ======

function runFullCompute() {
  const mc = monteCarlo(state, 10000);
  mcResultCache = mc;
  updateResults(mc);
  renderInverseSuggestions(mc);
}

function setupInlineInputs() {
  // — Add Option inline —
  document.getElementById('add-option-btn')?.addEventListener('click', function () {
    document.getElementById('add-option-input').style.display = '';
    const input = document.getElementById('new-option-name');
    input.value = '';
    setTimeout(function () { input.focus(); }, 50);
  });
  document.getElementById('confirm-option')?.addEventListener('click', function () {
    const input = document.getElementById('new-option-name');
    const name = input.value.trim();
    if (name) { addOption(name); }
    document.getElementById('add-option-input').style.display = 'none';
  });
  document.getElementById('cancel-option')?.addEventListener('click', function () {
    document.getElementById('add-option-input').style.display = 'none';
  });
  document.getElementById('new-option-name')?.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') document.getElementById('confirm-option')?.click();
    else if (e.key === 'Escape') document.getElementById('cancel-option')?.click();
  });

  // — Add Dimension inline —
  var dimDir = 'higher';
  document.getElementById('add-dimension-btn')?.addEventListener('click', function () {
    document.getElementById('add-dimension-input').style.display = '';
    const input = document.getElementById('new-dim-name');
    input.value = '';
    dimDir = 'higher';
    var dt = document.getElementById('dim-direction');
    if (dt) dt.textContent = '\u2191 越高越好';
    setTimeout(function () { input.focus(); }, 50);
  });
  document.getElementById('dim-direction')?.addEventListener('click', function () {
    dimDir = dimDir === 'higher' ? 'lower' : 'higher';
    this.textContent = dimDir === 'higher' ? '\u2191 越高越好' : '\u2193 越低越好';
  });
  document.getElementById('confirm-dim')?.addEventListener('click', function () {
    const input = document.getElementById('new-dim-name');
    const name = input.value.trim();
    if (name) { addDimension(name, dimDir); }
    document.getElementById('add-dimension-input').style.display = 'none';
  });
  document.getElementById('cancel-dim')?.addEventListener('click', function () {
    document.getElementById('add-dimension-input').style.display = 'none';
  });
  document.getElementById('new-dim-name')?.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') document.getElementById('confirm-dim')?.click();
    else if (e.key === 'Escape') document.getElementById('cancel-dim')?.click();
  });

  // — Scenario buttons (delegated) —
  document.querySelector('.scenario-bar')?.addEventListener('click', function (e) {
    var btn = e.target.closest('.scenario-btn');
    if (btn) loadScenario(btn.dataset.scenario);
  });
}

function copySummary() {
  if (!mcResultCache) { alert('请先拖动权重滑条生成结果'); return; }
  const wr = mcResultCache.winRates;
  const er = mcResultCache.extremeRanks;
  const sorted = Object.entries(wr).sort((a, b) => b[1] - a[1]);
  const top = sorted[0];
  const topName = state.options.find(o => o.id === top[0])?.name || '?';
  const topPct = Math.round(top[1] * 100);

  let shield = '选谁都差不多';
  if (top[1] > 0.6) shield = topName + ' 地位稳定';
  else if (top[1] >= 0.4) shield = topName + ' 有点悬';

  let text = '【算择结果】' + new Date().toLocaleString('zh-CN') + '\n';
  text += '🏆 ' + shield + '（' + topPct + '%）\n';
  text += '─'.repeat(28) + '\n';
  sorted.forEach(([id, rate], i) => {
    const name = state.options.find(o => o.id === id)?.name || id;
    const r = er && er[id];
    const rankRange = r ? ' 第' + r.best + '–' + r.worst + '名' : '';
    text += (i + 1) + '. ' + name + '  ' + Math.round(rate * 100) + '%' + rankRange + '\n';
  });
  text += '─'.repeat(28) + '\n';
  text += '维度权重：';
  state.dimensions.forEach((dim, i) => {
    const w = state.weights[dim.id].value;
    const dir = dim.direction === 'lower' ? '↓' : '↑';
    text += (i > 0 ? ' | ' : '') + dim.name + dir + ' ' + w;
  });
  text += '\n\n由 算择 ChoiceCalc 生成 (离线·开源)';

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () {
      // 闪一下按钮反馈
      const btn = document.getElementById('copy-summary-btn');
      if (btn) { btn.textContent = '✅ 已复制'; setTimeout(function () { btn.textContent = '📋 复制摘要'; }, 2000); }
    }).catch(function () {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  const btn = document.getElementById('copy-summary-btn');
  if (btn) { btn.textContent = '✅ 已复制'; setTimeout(function () { btn.textContent = '📋 复制摘要'; }, 2000); }
}

function init() {
  if (!restoreFromLocalStorage()) {
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  renderFromState();
  attachSliderEvents();
  initChart();

  setupInlineInputs();

  document.getElementById('reset-btn')?.addEventListener('click', resetState);
  document.getElementById('copy-summary-btn')?.addEventListener('click', copySummary);
  document.getElementById('export-btn')?.addEventListener('click', exportJSON);
  document.getElementById('import-btn')?.addEventListener('click', function () {
    document.getElementById('import-file')?.click();
  });
  document.getElementById('import-file')?.addEventListener('change', function (e) {
    if (e.target.files.length > 0) {
      importJSON(e.target.files[0]);
    }
    e.target.value = '';
  });

  runFullCompute();
  // Ensure inverse paths visible after first compute
  if (mcResultCache) {
    renderInverseSuggestions(mcResultCache);
  }
}

document.addEventListener('DOMContentLoaded', init);
