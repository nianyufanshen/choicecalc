// ============================================================
// RobustPick — Monte Carlo decision simulator (Bilingual)
// Multi-criteria decision analysis under uncertainty
// EN/中文 dual language support
// ============================================================

// ====== i18n ======
const LOCALE = {
  current: 'en',
  en: {
    appTitle: 'RobustPick',
    appSub: 'Multi-criteria decision simulator',
    appHint: 'Drag weight sliders → right panel updates in real time',
    quickTpl: 'Quick Templates',
    options: 'Options',
    add: '+ Add',
    optionHint: 'Score each option on every dimension — your subjective rating, higher = more satisfied. The simulation adds random jitter to test if your scores hold up.',
    optionName: 'Option name, Enter to confirm',
    confirm: 'Confirm',
    cancel: 'Cancel',
    weights: 'Weights',
    addDim: '+ Add',
    weightHint: 'Weight = how much this dimension matters. Higher weight means score swings affect the result more. Higher uncertainty = wider random jitter per simulation.',
    dimName: 'Dimension name, Enter to confirm',
    higherBetter: '\u2191 Higher is better',
    lowerBetter: '\u2193 Lower is better',
    guideTitle: '\uD83D\uDCA1 How to use',
    guide1: '\u2460 Add your candidates under <strong>Options</strong>',
    guide2: '\u2461 Set each dimension\'s importance under <strong>Weights</strong> (higher = more influence)',
    guide3: '\u2462 Click each option to score them across all dimensions',
    guide4: '\u2463 Right panel simulates 10,000 scenarios \u2014 see which option survives your uncertainty',
    reset: '\u21BA Reset',
    copySummary: '\uD83D\uDCCB Copy summary',
    exportJSON: '\u2193 JSON',
    importJSON: '\u2191 JSON',
    winRate: 'Win Rate',
    rankRange: 'Rank Range',
    optionsCount: 'Options',
    hintText: '\uD83D\uDCA1 The tool simulates 10,000 \u201Cwhat if you\u2019re wrong\u201D scenarios \u2014 your weights and scores jitter each round. It doesn\u2019t tell you \u201Cwho\u2019s best\u201D \u2014 it measures \u201Cwho\u2019s most robust to your uncertainty.\u201D',
    inverseHeader: 'Comeback Paths',
    inverseHint: 'When the winner isn\u2019t your pick \u2014 the paths below show what needs to change for an upset. Not advice, just diagnosis: are your stated preferences and actual winning conditions aligned?',
    inverseLoading: 'Computing\u2026',
    inverseTarget: 'Currently <strong>{leader}</strong> leads. If you still want <strong>{challenger}</strong>, here\u2019s what the data says needs to change:',
    pairwiseHeader: 'Head-to-Head',
    pairwiseHint: 'Two options face off \u2014 who wins across different weight scenarios, and by how much',
    chartHeader: 'Win Rate Distribution',
    emptyOptions: 'No options yet. Click "+ Add" above to start.',
    emptyDims: 'No dimensions yet. Click "+ Add" above to add criteria.',
    stable: '{name} is the safest bet',
    stableSub: '\uD83C\uDFC6 Simulated 10,000 rounds \u2192 {name} leads {pct} times, rank range {rank}. {name} dominates in almost all scenarios \u2014 your preferences are consistent.',
    wobbly: '{name} leads but it\u2019s shaky',
    wobblySub: '\u26A1 Simulated 10,000 rounds \u2192 {name} leads {pct} times{rank}. The conclusion is sensitive to small assumption shifts.',
    uncertain: 'No clear winner',
    uncertainSub: '\uD83D\uDD0D Simulated 10,000 rounds \u2192 top only leads {pct} times{rank}. No dominant option \u2014 consider narrowing your choices or re-evaluating scores.',
    confirmLoad: 'Load "{name}" template? All current data will be cleared.',
    toastLoaded: '\u2714\uFE0F Loaded "{name}" template \u2014 click options to score them',
    toastMaxOpts: '\u26A0\uFE0F Max {n} options reached',
    toastMaxDims: '\u26A0\uFE0F Max {n} dimensions reached',
    optLabel: 'Options:',
    dimLabel: 'Weights:',
    tryThis: '\uD83D\uDC49 Apply',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    uncWeight: 'How certain are you about this weight? Low=\u00B10.5, Med=\u00B11.5, High=fully random [1,10]',
    uncScore: 'How certain about this score? Low=\u00B10.5, Med=\u00B11.5, High=fully random [1,10]',
    pathMinimal: 'Contradiction',
    pathMinimalTip: 'Changing just one weight can flip the result \u2014 this dimension is a key lever',
    pathIntuitive: 'Advantage',
    pathIntuitiveTip: 'This option has a natural strength here, but the weight is too low',
    pathSurprising: 'Blindspot',
    pathSurprisingTip: 'The dimension you weighted lowest can actually help it win',
    flipDesc: 'Raise {dim} weight from {from} to {to}',
    flipDescIntuitive: '{name}\u2019s {dim} score is higher ({tScore} vs {cScore})',
    flipDescSurprising: 'You gave {dim} the lowest weight ({val})',
    flipRate: '\u2192 {name} {pct} can overtake',
    pwExplanation: '{winner} leads mainly on {dims}; trails on {trails}',
    cwToggle: '[Weight deviation]',
    cwHide: '[Hide]',
    cwDetail: 'When {name} wins, the average weight for {dim} is {cw} (you set {user})',
    directionHigher: 'Higher is better',
    directionLower: 'Lower is better',
    langSwitch: '\u4E2D\u6587',
    summaryHeader: 'RobustPick Result',
    summaryDimWeights: 'Dimension weights:',
    summaryFooter: 'Generated by RobustPick (offline \u00B7 open source)',
    optRemove: '\u2715',
    dimRemove: '\u2715',
    copied: '\u2714\uFE0F Copied',
    noResult: 'Please drag weight sliders to generate results first',
    noWinner: 'No clear winner',
    stableAlt: '{name} dominant',
    wobblyAlt: '{name} shaky lead',
  },
  zh: {
    appTitle: '\u7A33\u62E9',
    appSub: '\u91CF\u5316\u7EA0\u7ED3 \u00B7 \u591A\u56E0\u7D20\u51B3\u7B56\u8BA1\u7B97\u5668',
    appHint: '\u62D6\u62FD\u6743\u91CD\u6ED1\u6761 \u2192 \u53F3\u4FA7\u5B9E\u65F6\u53CD\u9988\u7ED3\u8BBA\u53D8\u5316',
    quickTpl: '\u5FEB\u901F\u6A21\u677F',
    options: '\u9009\u9879',
    add: '+ \u6DFB\u52A0',
    optionHint: '\u7ED9\u6BCF\u4E2A\u9009\u9879\u5728\u6BCF\u4E2A\u7EF4\u5EA6\u4E0A\u6253\u5206\u2014\u2014\u5206\u6570\u662F\u4F60\u7684\u4E3B\u89C2\u8BC4\u4EF7\uFF0C\u8D8A\u9AD8\u4EE3\u8868\u4F60\u8D8A\u6EE1\u610F\u3002\u6A21\u62DF\u65F6\u4F1A\u52A0\u4E00\u70B9\u968F\u673A\u6CE2\u52A8\uFF0C\u770B\u4F60\u6709\u6CA1\u6709\u201C\u770B\u8D70\u773C\u201D',
    optionName: '\u9009\u9879\u540D\u79F0\uFF0C\u56DE\u8F66\u786E\u8BA4',
    confirm: '\u786E\u5B9A',
    cancel: '\u53D6\u6D88',
    weights: '\u6743\u91CD',
    addDim: '+ \u6DFB\u52A0',
    weightHint: '\u6743\u91CD\u51B3\u5B9A\u8FD9\u4E2A\u7EF4\u5EA6\u5728\u6A21\u62DF\u4E2D\u7684\u5F71\u54CD\u5927\u5C0F\u2014\u2014\u8D8A\u9AD8\uFF0C\u5B83\u7684\u5F97\u5206\u8D77\u4F0F\u5BF9\u6700\u7EC8\u7ED3\u679C\u5F71\u54CD\u8D8A\u5927\u3002\u4E0D\u786E\u5B9A\u5EA6\u8D8A\u9AD8\uFF0C\u6BCF\u6B21\u6A21\u62DF\u7684\u6CE2\u52A8\u8303\u56F4\u8D8A\u5BBD',
    dimName: '\u7EF4\u5EA6\u540D\u79F0\uFF0C\u56DE\u8F66\u786E\u8BA4',
    higherBetter: '\u2191 \u8D8A\u9AD8\u8D8A\u597D',
    lowerBetter: '\u2193 \u8D8A\u4F4E\u8D8A\u597D',
    guideTitle: '\uD83D\uDCA1 \u600E\u4E48\u7528',
    guide1: '\u2460 \u5728<strong>\u9009\u9879</strong>\u91CC\u6DFB\u52A0\u4F60\u8981\u6BD4\u8F83\u7684\u5019\u9009',
    guide2: '\u2461 \u5728<strong>\u6743\u91CD</strong>\u91CC\u8BBE\u5B9A\u6BCF\u4E2A\u7EF4\u5EA6\u6709\u591A\u91CD\u8981\uFF08\u8D8A\u9AD8\u5F71\u54CD\u8D8A\u5927\uFF09',
    guide3: '\u2462 \u70B9\u5F00\u6BCF\u4E2A\u9009\u9879\uFF0C\u7ED9\u5B83\u4EEC\u5728\u5404\u4E2A\u7EF4\u5EA6\u4E0A\u6253\u5206\uFF08\u4F60\u7684\u4E3B\u89C2\u8BC4\u4EF7\uFF09',
    guide4: '\u2463 \u53F3\u8FB9\u5B9E\u65F6\u6A21\u62DF 10,000 \u6B21\u2014\u2014\u770B\u4F60\u7684\u9009\u62E9\u5728\u5404\u79CD\u201C\u53EF\u80FD\u770B\u8D70\u773C\u201D\u7684\u60C5\u51B5\u4E0B\u5230\u5E95\u7A33\u4E0D\u7A33',
    reset: '\u21BA \u91CD\u7F6E',
    copySummary: '\uD83D\uDCCB \u590D\u5236\u6458\u8981',
    exportJSON: '\u2193 JSON',
    importJSON: '\u2191 JSON',
    winRate: '\u80DC\u7387',
    rankRange: '\u540D\u6B21\u8303\u56F4',
    optionsCount: '\u9009\u9879\u6570',
    hintText: '\uD83D\uDCA1 \u5DE5\u5177\u6A21\u62DF\u4E86 10,000 \u6B21\u201C\u4F60\u53EF\u80FD\u770B\u8D70\u773C\u201D\u7684\u60C5\u51B5\u2014\u2014\u4F60\u7684\u6743\u91CD\u548C\u8BC4\u5206\u6BCF\u6B21\u4F1A\u5C0F\u5E45\u968F\u673A\u6CE2\u52A8\uFF0C\u770B\u8C01\u5728\u5404\u79CD\u60C5\u51B5\u4E0B\u90FD\u7A33\u3002\u4E0D\u662F\u7B97\u201C\u8C01\u6700\u597D\u201D\uFF0C\u662F\u6D4B\u201C\u8C01\u6700\u62B5\u5F97\u4F4F\u4F60\u7684\u4E0D\u786E\u5B9A\u201D\u3002',
    inverseHeader: '\u7FFB\u76D8\u8DEF\u5F84',
    inverseHint: '\u5982\u679C\u51A0\u519B\u4E0D\u662F\u4F60\u60F3\u8981\u7684\u2014\u2014\u4E0B\u9762\u5C55\u793A\u7684\u662F\u201C\u8981\u8BA9\u5B83\u7FFB\u76D8\u9700\u8981\u6539\u53D8\u4EC0\u4E48\u201D\uFF0C\u4E0D\u662F\u5EFA\u8BAE\u4F60\u8FD9\u4E48\u505A\uFF0C\u800C\u662F\u5E2E\u4F60\u68C0\u67E5\uFF1A\u4F60\u5634\u4E0A\u8BF4\u5728\u610F\u7684\u548C\u5B9E\u9645\u53EF\u80FD\u5728\u610F\u7684\u662F\u4E0D\u662F\u4E00\u56DE\u4E8B',
    inverseLoading: '\u8BA1\u7B97\u4E2D\u2026',
    inverseTarget: '\u5F53\u524D <strong>{leader}</strong> \u9886\u5148\u3002\u5982\u679C\u8FD8\u662F\u60F3\u9009 <strong>{challenger}</strong>\uFF0C\u6570\u636E\u544A\u8BC9\u4F60\u9700\u8981\u6539\u53D8\u4EC0\u4E48\uFF1A',
    pairwiseHeader: '\u4E24\u4E24\u5BF9\u6BD4',
    pairwiseHint: '\u4E24\u4E2A\u9009\u9879\u6B63\u9762\u4EA4\u950B\u2014\u2014\u770B\u8C01\u5728\u5404\u79CD\u6743\u91CD\u6CE2\u52A8\u4E0B\u8D62\u9762\u66F4\u5927\uFF0C\u5DEE\u8DDD\u591A\u5927',
    chartHeader: '\u80DC\u7387\u5206\u5E03',
    emptyOptions: '\u6682\u65E0\u9009\u9879\u3002\u70B9\u51FB\u4E0A\u65B9\u201C+ \u6DFB\u52A0\u201D\u5F00\u59CB\u5206\u6790',
    emptyDims: '\u6682\u65E0\u7EF4\u5EA6\u3002\u70B9\u51FB\u4E0A\u65B9\u201C+ \u6DFB\u52A0\u201D\u6DFB\u52A0\u8BC4\u5206\u7EF4\u5EA6',
    stable: '{name} \u6700\u7A33',
    stableSub: '\uD83C\uDFC6 \u6A21\u62DF 10,000 \u6B21 \u2192 {name} \u9886\u5148 {pct} \u6B21\uFF0C\u6392\u540D\u6CE2\u52A8 {rank}\u3002\u5927\u90E8\u5206\u60C5\u51B5\u4E0B {name} \u90FD\u662F\u6700\u4F18\u9009\u2014\u2014\u8BF4\u660E\u4F60\u7684\u6743\u91CD\u548C\u8BC4\u5206\u6307\u5411\u4E00\u81F4\u3002',
    wobbly: '{name} \u9886\u5148\u4F46\u6709\u70B9\u60AC',
    wobblySub: '\u26A1 \u6A21\u62DF 10,000 \u6B21 \u2192 {name} \u9886\u5148 {pct} \u6B21{rank}\u3002\u7ED3\u8BBA\u5BF9\u5047\u8BBE\u53D8\u5316\u654F\u611F\u2014\u2014\u7A0D\u5FAE\u8C03\u4E00\u8C03\u6743\u91CD\uFF0C\u7ED3\u679C\u5C31\u53EF\u80FD\u7FFB\u76D8\u3002',
    uncertain: '\u9009\u8C01\u90FD\u5DEE\u4E0D\u591A',
    uncertainSub: '\uD83D\uDD0D \u6A21\u62DF 10,000 \u6B21 \u2192 \u6700\u9AD8\u624D {pct} \u6B21\u9886\u5148{rank}\u3002\u6CA1\u6709\u660E\u663E\u66F4\u4F18\u7684\u9009\u9879\uFF0C\u5EFA\u8BAE\u7F29\u5C0F\u8303\u56F4\u6216\u91CD\u65B0\u5BA1\u89C6\u4F60\u7684\u8BC4\u5206\u3002',
    confirmLoad: '\u786E\u5B9A\u52A0\u8F7D\u201C{name}\u201D\u6A21\u677F\uFF1F\u5F53\u524D\u6240\u6709\u6570\u636E\u5C06\u4F1A\u88AB\u6E05\u9664\u3002',
    toastLoaded: '\u2714\uFE0F \u5DF2\u52A0\u8F7D\u201C{name}\u201D\u6A21\u677F\uFF0C\u70B9\u51FB\u9009\u9879\u5C55\u5F00\u6253\u5206',
    toastMaxOpts: '\u26A0\uFE0F \u6700\u591A {n} \u4E2A\u9009\u9879\uFF0C\u5DF2\u8FBE\u4E0A\u9650',
    toastMaxDims: '\u26A0\uFE0F \u6700\u591A {n} \u4E2A\u7EF4\u5EA6\uFF0C\u5DF2\u8FBE\u4E0A\u9650',
    optLabel: '\u9009\u9879\uFF1A',
    dimLabel: '\u6743\u91CD\uFF1A',
    tryThis: '\uD83D\uDC49 \u5E94\u7528',
    low: '\u4F4E',
    medium: '\u4E2D',
    high: '\u9AD8',
    uncWeight: '\u4F60\u5BF9\u8FD9\u4E2A\u6743\u91CD\u7684\u786E\u5B9A\u7A0B\u5EA6\uFF1A\u4F4E=\u00B10.5 / \u4E2D=\u00B11.5 / \u9AD8=\u5B8C\u5168\u4E0D\u786E\u5B9A[1,10]',
    uncScore: '\u4F60\u7ED9\u8FD9\u4E2A\u8BC4\u5206\u7684\u786E\u5B9A\u7A0B\u5EA6\uFF1A\u4F4E=\u00B10.5 / \u4E2D=\u00B11.5 / \u9AD8=\u5B8C\u5168\u4E0D\u786E\u5B9A[1,10]',
    pathMinimal: '\u77DB\u76FE\u8BCA\u65AD',
    pathMinimalTip: '\u53EA\u9700\u8981\u52A8\u4E00\u4E2A\u7EF4\u5EA6\u7684\u6743\u91CD\u5C31\u80FD\u7FFB\u76D8\u2014\u2014\u8BF4\u660E\u8FD9\u4E2A\u7EF4\u5EA6\u662F\u5173\u952E\u6760\u6746',
    pathIntuitive: '\u4F18\u52BF\u8BCA\u65AD',
    pathIntuitiveTip: '\u8FD9\u4E2A\u9009\u9879\u672C\u8EAB\u6709\u4F18\u52BF\u7EF4\u5EA6\uFF0C\u4F46\u6743\u91CD\u4E0D\u591F\u9AD8\u2014\u2014\u62C9\u9AD8\u5C31\u80FD\u7FFB\u76D8',
    pathSurprising: '\u76F2\u533A\u8BCA\u65AD',
    pathSurprisingTip: '\u4F60\u7ED9\u6700\u4F4E\u6743\u91CD\u7684\u7EF4\u5EA6\u53CD\u800C\u80FD\u5E2E\u5B83\u7FFB\u76D8\u2014\u2014\u4F60\u53EF\u80FD\u4F4E\u4F30\u4E86\u8FD9\u4E2A\u7EF4\u5EA6\u7684\u91CD\u8981\u6027',
    flipDesc: '{dim}\u6743\u91CD\u4ECE{from}\u5347\u5230{to}',
    flipDescIntuitive: '{name}\u7684{dim}\u5206\u66F4\u9AD8({tScore} vs {cScore})',
    flipDescSurprising: '\u4F60\u7ED9{dim}\u6253\u4E86\u6700\u4F4E\u7684\u6743\u91CD({val})',
    flipRate: '\u2192 {name} {pct}\u53EF\u53CD\u8D85',
    pwExplanation: '{winner}\u9886\u5148\u4E3B\u8981\u9760{dims}\uFF1B\u52A3\u52BF\u5728{trails}',
    cwToggle: '[\u6743\u91CD\u504F\u5DEE]',
    cwHide: '[\u6536\u8D77]',
    cwDetail: '\u5F53{name}\u8D62\u7684\u65F6\u5019\uFF0C{dim}\u7684\u6743\u91CD\u5E73\u5747\u4E3A{cw}\uFF08\u4F60\u8BBE\u4E86{user}\uFF09',
    directionHigher: '\u8D8A\u9AD8\u8D8A\u597D',
    directionLower: '\u8D8A\u4F4E\u8D8A\u597D',
    langSwitch: 'English',
    summaryHeader: 'RobustPick \u7ED3\u679C',
    summaryDimWeights: '\u7EF4\u5EA6\u6743\u91CD\uFF1A',
    summaryFooter: '\u7531 RobustPick \u751F\u6210 (\u79BB\u7EBF\u00B7\u5F00\u6E90)',
    optRemove: '\u2715',
    dimRemove: '\u2715',
    copied: '\u2714\uFE0F \u5DF2\u590D\u5236',
    noResult: '\u8BF7\u5148\u62D6\u62FD\u6743\u91CD\u6ED1\u6761\u751F\u6210\u7ED3\u679C',
    noWinner: '\u9009\u8C01\u90FD\u5DEE\u4E0D\u591A',
    stableAlt: '{name} \u5730\u4F4D\u7A33\u5B9A',
    wobblyAlt: '{name} \u6709\u70B9\u60AC',
  }
};

function t(key, params) {
  const s = LOCALE[LOCALE.current][key];
  if (s === undefined) return key;
  if (!params) return s;
  return s.replace(/\{(\w+)\}/g, function (_, k) {
    return params[k] !== undefined ? params[k] : '{' + k + '}';
  });
}

function setLang(lang) {
  if (!LOCALE[lang]) return;
  LOCALE.current = lang;
  try { localStorage.setItem('rp-lang', lang); } catch (e) {}
  // Caller triggers re-render
}

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
    nameEn: 'Job Hunt',
    desc: '薪资、成长、WLB',
    dimensions: [
      { name: '薪资', nameEn: 'Salary', direction: 'higher' },
      { name: '成长空间', nameEn: 'Growth', direction: 'higher' },
      { name: '工作生活平衡', nameEn: 'WLB', direction: 'higher' },
      { name: '团队氛围', nameEn: 'Culture', direction: 'higher' },
      { name: '通勤便利', nameEn: 'Commute', direction: 'higher' }
    ],
    options: ['公司A', '公司B', '公司C']
  },
  {
    id: 'housing',
    icon: '\u{1F3E0}',
    name: '选房子',
    nameEn: 'House Hunt',
    desc: '价格、地段、面积',
    dimensions: [
      { name: '价格', nameEn: 'Price', direction: 'lower' },
      { name: '地段', nameEn: 'Location', direction: 'higher' },
      { name: '面积', nameEn: 'Size', direction: 'higher' },
      { name: '房龄', nameEn: 'Age', direction: 'lower' },
      { name: '交通', nameEn: 'Transit', direction: 'higher' }
    ],
    options: ['小区A', '小区B', '小区C']
  },
  {
    id: 'tech',
    icon: '\u{1F4BB}',
    name: '技术选型',
    nameEn: 'Tech Stack',
    desc: '性能、生态、成本',
    dimensions: [
      { name: '性能', nameEn: 'Perf', direction: 'higher' },
      { name: '生态成熟度', nameEn: 'Ecosystem', direction: 'higher' },
      { name: '实施成本', nameEn: 'Cost', direction: 'lower' },
      { name: '学习曲线', nameEn: 'Learning', direction: 'lower' },
      { name: '社区活跃度', nameEn: 'Community', direction: 'higher' }
    ],
    options: ['方案A', '方案B', '方案C']
  },
  {
    id: 'vendor',
    icon: '\u{1F91D}',
    name: '供应商',
    nameEn: 'Vendor',
    desc: '价格、质量、交期',
    dimensions: [
      { name: '价格', nameEn: 'Price', direction: 'lower' },
      { name: '产品质量', nameEn: 'Quality', direction: 'higher' },
      { name: '交期保障', nameEn: 'Delivery', direction: 'higher' },
      { name: '售后服务', nameEn: 'Support', direction: 'higher' },
      { name: '技术能力', nameEn: 'Tech', direction: 'higher' }
    ],
    options: ['供应商A', '供应商B', '供应商C']
  },
  {
    id: 'city',
    icon: '\u{1F306}',
    name: '选城市',
    nameEn: 'City Choice',
    desc: '就业、房价、气候',
    dimensions: [
      { name: '就业机会', nameEn: 'Jobs', direction: 'higher' },
      { name: '房价水平', nameEn: 'Housing', direction: 'lower' },
      { name: '气候环境', nameEn: 'Climate', direction: 'higher' },
      { name: '教育资源', nameEn: 'Education', direction: 'higher' },
      { name: '生活成本', nameEn: 'Cost', direction: 'lower' }
    ],
    options: ['城市A', '城市B', '城市C']
  },
  {
    id: 'school',
    icon: '\u{1F393}',
    name: '选学校',
    nameEn: 'School Pick',
    desc: '排名、费用、就业',
    dimensions: [
      { name: '综合排名', nameEn: 'Ranking', direction: 'higher' },
      { name: '学费', nameEn: 'Tuition', direction: 'lower' },
      { name: '就业前景', nameEn: 'Career', direction: 'higher' },
      { name: '城市安全', nameEn: 'Safety', direction: 'higher' },
      { name: '文化适配', nameEn: 'Culture Fit', direction: 'higher' }
    ],
    options: ['学校A', '学校B', '学校C']
  }
];

function scenarioName(s) {
  return LOCALE.current === 'en' ? (s.nameEn || s.name) : s.name;
}

function dimName(d) {
  return LOCALE.current === 'en' ? (d.nameEn || d.name) : d.name;
}

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

  const isEn = LOCALE.current === 'en';

  let main = '';
  if (advParts.length > 0) {
    if (isEn) {
      main += winner.name + ' leads mainly on ';
      main += advParts.map(d =>
        dimName(d.dim) + '(' + d.wScore + ' vs ' + d.lScore + ')'
      ).join(', ');
    } else {
      main += winner.name + '领先主要靠';
      main += advParts.map(d =>
        dimName(d.dim) + '(' + d.wScore + ' vs ' + d.lScore + ')'
      ).join('、');
    }
  }
  if (disadvParts.length > 0) {
    if (isEn) {
      main += '; trails on ';
      main += disadvParts.map(d =>
        dimName(d.dim) + '(' + d.wScore + ' vs ' + d.lScore + ')'
      ).join(', ');
    } else {
      main += '；劣势在';
      main += disadvParts.map(d =>
        dimName(d.dim) + '(' + d.wScore + ' vs ' + d.lScore + ')'
      ).join('、');
    }
  }
  main += '.';

  // 如果中心权重与用户设定有明显差异，作为可选部分
  let cwDeviation = '';
  if (centralWeights && centralWeights[winnerId]) {
    const cw = centralWeights[winnerId];
    const notable = [];
    for (const dim of dims) {
      const userVal = state.weights[dim.id].value;
      const cwVal = cw[dim.id];
      if (Math.abs(cwVal - userVal) > 1.5) {
        notable.push({ name: dimName(dim), userVal, cwVal });
      }
    }
    if (notable.length > 0) {
      if (isEn) {
        cwDeviation = 'When ' + winner.name + ' wins, ';
        cwDeviation += notable.map(n =>
          n.name + '\'s avg weight is ' + n.cwVal + ' (you set ' + n.userVal + ')'
        ).join(', ');
        cwDeviation += ' — the actual preference profile may differ from your intuition.';
      } else {
        cwDeviation = '当' + winner.name + '赢的时候，';
        cwDeviation += notable.map(n =>
          n.name + '的权重平均为' + n.cwVal + '（你设了' + n.userVal + '）'
        ).join('、');
        cwDeviation += '，提示实际赢面需要的偏好分布可能和你直觉不同。';
      }
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

  const isEn = LOCALE.current === 'en';

  // ---- Path A: Minimal Adjustment ----
  let bestA = null;
  for (const dim of dims) {
    const current = state.weights[dim.id].value;
    const rateUp = mcAt(dim.id, 10);
    const rateDown = mcAt(dim.id, 1);

    let candidates = [];

    if (rateUp > 0.5) {
      let lo = current + 0.05, hi = 10;
      for (let i = 0; i < 10; i++) {
        const mid = (lo + hi) / 2;
        if (mcQuick(dim.id, mid) > 0.5) hi = mid;
        else lo = mid;
      }
      const val = Math.round((lo + hi) / 2 * 10) / 10;
      const fr = mcAt(dim.id, val);
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
      if (!bestA || best.offset < bestA.offset) {
        const dimLabel = dimName(dim);
        let desc;
        if (isEn) {
          desc = 'Raise ' + dimLabel + ' weight from ' + current + ' to ' + best.val;
        } else {
          const dir = best.val > current ? '升到' : '降到';
          desc = dimLabel + '权重从' + current + dir + best.val;
        }
        bestA = {
          type: 'minimal',
          dimensionId: dim.id,
          dimensionName: dimLabel,
          description: desc,
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
      const dimLabel = dimName(dim);
      let desc;
      if (isEn) {
        desc = target.name + '\u2019s ' + dimLabel + ' score is higher (' + tScore + ' vs ' + cScore + ')';
      } else {
        desc = target.name + '的' + dimLabel + '分更高(' + tScore + ' vs ' + cScore + ')';
      }
      bestB = {
        type: 'intuitive',
        dimensionId: dim.id,
        dimensionName: dimLabel,
        description: desc,
        flipWinRate: null,
        targetWeight: null
      };
    }
  }
  if (bestB) {
    const testW = clamp(state.weights[bestB.dimensionId].value + 2, 1, 10);
    bestB.targetWeight = Math.round(testW * 10) / 10;
    bestB.flipWinRate = Math.round(mcAt(bestB.dimensionId, testW) * 100) / 100;
    paths.push(bestB);
  }

  // ---- Path C: Most Surprising ----
  const sortedDims = [...dims].sort((a, b) => state.weights[a.id].value - state.weights[b.id].value);
  for (const dim of sortedDims) {
    const rateAtExtreme = mcAt(dim.id, 10);
    if (rateAtExtreme > 0.5) {
      const dimLabel = dimName(dim);
      let desc;
      if (isEn) {
        desc = 'You gave ' + dimLabel + ' the lowest weight (' + state.weights[dim.id].value + ')';
      } else {
        desc = '你给' + dimLabel + '打了最低的权重(' + state.weights[dim.id].value + ')';
      }
      paths.push({
        type: 'surprising',
        dimensionId: dim.id,
        dimensionName: dimLabel,
        description: desc,
        flipWinRate: Math.round(rateAtExtreme * 100) / 100,
        targetWeight: 10
      });
      break;
    }
    const rateAtLow = mcAt(dim.id, 1);
    if (rateAtLow > 0.5) {
      const dimLabel = dimName(dim);
      let desc;
      if (isEn) {
        desc = 'You gave ' + dimLabel + ' the lowest weight (' + state.weights[dim.id].value + ')';
      } else {
        desc = '你给' + dimLabel + '打了最低的权重(' + state.weights[dim.id].value + ')';
      }
      paths.push({
        type: 'surprising',
        dimensionId: dim.id,
        dimensionName: dimLabel,
        description: desc,
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
    if (!confirm(t('confirmLoad', { name: scenarioName(sc) }))) return;
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

  showToast(t('toastLoaded', { name: scenarioName(sc) }));
}

function addOption(name) {
  if (state.options.length >= MAX_OPTIONS) {
    showToast(t('toastMaxOpts', { n: MAX_OPTIONS }));
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
    showToast(t('toastMaxDims', { n: MAX_DIMENSIONS }));
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

function renderLangToggle() {
  const btn = document.getElementById('lang-toggle-btn');
  if (!btn) return;
  btn.textContent = t('langSwitch');
}

function buildLayout() {
  const container = document.createElement('div');
  container.className = 'choicecalc-layout';

  const isEn = LOCALE.current === 'en';

  container.innerHTML = `
    <div class="left-panel">
    <div class="app-title">${t('appTitle')} <small>ChoiceCalc</small></div>
    <div class="app-subtitle">${t('appSub')}</div>
    <div class="app-hint">${t('appHint')}</div>
      <div class="panel-section scenario-bar-panel">
        <div class="scenario-bar">
          <span class="scenario-bar-label">${t('quickTpl')}</span>
          <button id="lang-toggle-btn" class="scenario-btn" style="margin-left:auto;border-color:var(--accent);color:var(--accent)">${t('langSwitch')}</button>` +
          SCENARIOS.map(s => '<button class="scenario-btn" data-scenario="' + s.id + '"><span class="s-icon">' + s.icon + '</span><span class="s-label">' + escHtml(scenarioName(s)) + '</span></button>').join('') +
        `</div>
      </div>
      <div class="panel-section">
        <div class="panel-header">
          <h3>${t('options')}</h3>
          <button class="btn-small btn-add" id="add-option-btn">${t('add')}</button>
        </div>
        <div class="section-hint">${t('optionHint')}</div>
        <div id="option-list"></div>
        <div id="add-option-input" class="inline-input-wrap" style="display:none">
          <input type="text" id="new-option-name" class="inline-input" placeholder="${t('optionName')}" maxlength="24">
          <div class="inline-input-actions">
            <button id="confirm-option" class="btn-small primary">${t('confirm')}</button>
            <button id="cancel-option" class="btn-small">${t('cancel')}</button>
          </div>
        </div>
      </div>
      <div class="panel-section">
        <div class="panel-header">
          <h3>${t('weights')}</h3>
          <button class="btn-small btn-add" id="add-dimension-btn">${t('addDim')}</button>
        </div>
        <div class="section-hint">${t('weightHint')}</div>
        <div id="global-dimensions"></div>
        <div id="add-dimension-input" class="inline-input-wrap" style="display:none">
          <div class="inline-input-row">
            <input type="text" id="new-dim-name" class="inline-input" placeholder="${t('dimName')}" maxlength="20" style="flex:1">
            <button id="dim-direction" class="btn-small dir-toggle" style="flex-shrink:0;">${t('higherBetter')}</button>
            <button id="confirm-dim" class="btn-small primary">${t('confirm')}</button>
            <button id="cancel-dim" class="btn-small">${t('cancel')}</button>
          </div>
        </div>
      </div>
      <div class="panel-section guide-panel">
        <div class="guide-hint">
          <strong>${t('guideTitle')}</strong><br>
          ${t('guide1')}<br>
          ${t('guide2')}<br>
          ${t('guide3')}<br>
          ${t('guide4')}
        </div>
      </div>
      <div class="panel-section bottom-actions">
        <button class="btn-reset" id="reset-btn">${t('reset')}</button>
        <button class="btn-small" id="copy-summary-btn">${t('copySummary')}</button>
        <button class="btn-small" id="export-btn">${t('exportJSON')}</button>
        <button class="btn-small" id="import-btn">${t('importJSON')}</button>
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
            <span class="stability-stat-label">${t('winRate')}</span>
          </div>
          <div class="stability-stat">
            <span class="stability-stat-val" id="stat-rank"></span>
            <span class="stability-stat-label">${t('rankRange')}</span>
          </div>
          <div class="stability-stat">
            <span class="stability-stat-val" id="stat-options"></span>
            <span class="stability-stat-label">${t('optionsCount')}</span>
          </div>
        </div>
        <div id="hint-text" class="hint-text">${t('hintText')}</div>
      </div>
      <div class="panel-section" id="inverse-section" style="display:none">
        <div class="panel-header">
          <h4>${t('inverseHeader')}</h4>
        </div>
        <div class="section-hint">${t('inverseHint')}</div>
        <div id="inverse-loading" class="inverse-loading" style="display:none">
          <span class="loading-dot"></span><span class="loading-dot"></span><span class="loading-dot"></span>
          <span class="loading-text">${t('inverseLoading')}</span>
        </div>
        <div id="inverse-suggestions"></div>
      </div>
      <div class="panel-section">
        <div class="panel-header">
          <h4>${t('pairwiseHeader')}</h4>
        </div>
        <div class="section-hint">${t('pairwiseHint')}</div>
        <div id="pairwise-table"></div>
      </div>
      <div class="panel-section chart-section">
        <div class="panel-header">
          <h4>${t('chartHeader')}</h4>
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
    el.innerHTML = '<div class="empty-state">' + t('emptyOptions') + '</div>';
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
      <span class="option-remove" data-id="${opt.id}">${t('optRemove')}</span>
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
        <label class="score-label">${escHtml(dimName(dim))}</label>
        <input type="range" class="score-slider score-main" min="1" max="10" step="0.5"
          value="${score.value}" data-option="${opt.id}" data-dimension="${dim.id}">
        <span class="score-value" id="sv-${opt.id}-${dim.id}">${score.value}</span>
        <select class="score-uncertainty" data-option="${opt.id}" data-dimension="${dim.id}" title="${t('uncScore')}">
          <option value="low" ${score.uncertainty === 'low' ? 'selected' : ''}>${t('low')}</option>
          <option value="medium" ${score.uncertainty === 'medium' ? 'selected' : ''}>${t('medium')}</option>
          <option value="high" ${score.uncertainty === 'high' ? 'selected' : ''}>${t('high')}</option>
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
    el.innerHTML = '<div class="empty-state">' + t('emptyDims') + '</div>';
    return;
  }
  state.dimensions.forEach(dim => {
    const w = state.weights[dim.id] || { value: 5, uncertainty: 'low' };
    const row = document.createElement('div');
    row.className = 'weight-row';
    row.dataset.dimensionId = dim.id;
    row.innerHTML = `
      <label class="weight-label" title="${dim.direction === 'lower' ? t('directionLower') : t('directionHigher')}">
        ${escHtml(dimName(dim))}
        <span class="dir-badge">${dim.direction === 'lower' ? '\u2193' : '\u2191'}</span>
      </label>
      <input type="range" class="weight-main weight-slider" min="1" max="10" step="0.5"
        value="${w.value}" data-dimension="${dim.id}">
      <span class="weight-value" id="wv-${dim.id}">${w.value}</span>
      <select class="weight-uncertainty" data-dimension="${dim.id}" title="${t('uncWeight')}">
        <option value="low" ${w.uncertainty === 'low' ? 'selected' : ''}>${t('low')}</option>
        <option value="medium" ${w.uncertainty === 'medium' ? 'selected' : ''}>${t('medium')}</option>
        <option value="high" ${w.uncertainty === 'high' ? 'selected' : ''}>${t('high')}</option>
      </select>
      <span class="dim-remove" data-dimension="${dim.id}">${t('dimRemove')}</span>
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

  const er = extremeRanks && extremeRanks[topId];
  const rankRange = isEn => {
    const r = er && er.worst > 1
      ? (isEn ? '1st\u2013' + er.worst + 'th' : '第1\u2013' + er.worst + '\u540D')
      : (isEn ? '1st' : '\u7B2C1\u540D');
    return r;
  };

  const isEn = LOCALE.current === 'en';
  const rr = rankRange(isEn);

  // Fill stat cards
  const statPct = document.getElementById('stat-pct');
  const statRank = document.getElementById('stat-rank');
  const statOpts = document.getElementById('stat-options');
  const statsRow = document.getElementById('stability-stats');
  if (statPct) statPct.textContent = topPct + '%';
  if (statRank) statRank.textContent = rr;
  if (statOpts) statOpts.textContent = state.options.length + (isEn ? ' items' : '\u9879');
  if (statsRow) statsRow.style.display = '';

  let shieldChar, statusText, statusSub, panelClass;

  if (topRate > 0.6) {
    shieldChar = '\u{1F6E1}\uFE0F';
    statusText = t('stable', { name: topName });
    statusSub = t('stableSub', { name: topName, pct: topPct, rank: rr });
    panelClass = 'stable';
  } else if (topRate >= 0.4) {
    shieldChar = '\u{26A1}\uFE0F';
    statusText = t('wobbly', { name: topName });
    statusSub = t('wobblySub', { name: topName, pct: topPct, rank: (isEn ? ' (rank ' + rr + ')' : '\uFF08\u6392\u540D\u6CE2\u52A8 ' + rr + '\uFF09') });
    panelClass = 'unstable';
  } else {
    shieldChar = '\u2014';
    statusText = t('uncertain');
    statusSub = t('uncertainSub', { pct: topPct, rank: (isEn ? ' (rank ' + rr + ')' : '\uFF08\u6392\u540D\u6CE2\u52A8 ' + rr + '\uFF09') });
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

  container.innerHTML = '';
  if (loading) loading.style.display = 'flex';
  section.style.display = '';
  setTimeout(function () {
    let html = '';
    const isEn = LOCALE.current === 'en';
    nonChampions.forEach(opt => {
      const paths = inverse3path(state, opt.id, mcResult);
      if (paths.length === 0) return;
      const typeMeta = {
        minimal:    { icon: '\u{1F3AF}', label: isEn ? 'Contradiction' : '\u77DB\u76FE\u8BCA\u65AD', tip: isEn ? 'Changing just one weight can flip the result \u2014 this dimension is a key lever' : '\u53EA\u9700\u8981\u52A8\u4E00\u4E2A\u7EF4\u5EA6\u7684\u6743\u91CD\u5C31\u80FD\u7FFB\u76D8\u2014\u2014\u8BF4\u660E\u8FD9\u4E2A\u7EF4\u5EA6\u662F\u5173\u952E\u6760\u6746' },
        intuitive:  { icon: '\u{1F4A1}', label: isEn ? 'Advantage' : '\u4F18\u52BF\u8BCA\u65AD', tip: isEn ? 'This option has a natural strength here, but the weight is too low' : '\u8FD9\u4E2A\u9009\u9879\u672C\u8EAB\u6709\u4F18\u52BF\u7EF4\u5EA6\uFF0C\u4F46\u6743\u91CD\u4E0D\u591F\u9AD8\u2014\u2014\u62C9\u9AD8\u5C31\u80FD\u7FFB\u76D8' },
        surprising: { icon: '\u{1F50D}', label: isEn ? 'Blindspot' : '\u76F2\u533A\u8BCA\u65AD', tip: isEn ? 'The dimension you weighted lowest can actually help it win' : '\u4F60\u7ED9\u6700\u4F4E\u6743\u91CD\u7684\u7EF4\u5EA6\u53CD\u800C\u80FD\u5E2E\u5B83\u7FFB\u76D8\u2014\u2014\u4F60\u53EF\u80FD\u4F4E\u4F30\u4E86\u8FD9\u4E2A\u7EF4\u5EA6\u7684\u91CD\u8981\u6027' }
      };

      const leaderName = state.options.find(o => o.id === championId)?.name || '';
      html += '<div class="inverse-group">';
      html += '<div class="inverse-target">' + t('inverseTarget', { leader: escHtml(leaderName), challenger: escHtml(opt.name) }) + '</div>';
      paths.forEach(p => {
        const meta = typeMeta[p.type] || { icon: '\u{25C6}', label: p.type, tip: '' };
        const pct = p.flipWinRate != null ? Math.round(p.flipWinRate * 100) + '%' : '?';
        html += '<div class="suggestion-item">';
        html += '  <span class="suggestion-label-col">';
        html += '    <span class="suggestion-icon" title="' + meta.tip + '">' + meta.icon + '</span>';
        html += '    <span class="suggestion-label" title="' + meta.tip + '">' + meta.label + '</span>';
        html += '  </span>';
        html += '  <span class="suggestion-desc">' + escHtml(p.description) + '</span>';
        html += '  <span class="suggestion-rate">' + (isEn ? '\u2192 ' + escHtml(opt.name) + ' ' + pct + ' can overtake' : '\u2192 ' + escHtml(opt.name) + ' ' + pct + '\u53EF\u53CD\u8D85') + '</span>';
        if (p.targetWeight != null) {
          html += '  <button class="try-this-btn" data-dimension="' + p.dimensionId + '" data-target-weight="' + p.targetWeight + '">' + t('tryThis') + '</button>';
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
          html += ' <span class="cw-toggle" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==\'none\'?\'inline\':\'none\';this.textContent=this.textContent==\'' + t('cwToggle') + '\'?\'' + t('cwHide') + '\':\'' + t('cwToggle') + '\'">' + t('cwToggle') + '</span>';
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
      localStorage.setItem('robustpickState', JSON.stringify(state));
    } catch (e) {
      // silently fail
    }
  }, 500);
}

function restoreFromLocalStorage() {
  try {
    const raw = localStorage.getItem('robustpickState');
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
  a.download = 'robustpick-snapshot.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed.options || !parsed.weights || !parsed.dimensions) {
        alert('Invalid snapshot file');
        return;
      }
      state = parsed;
      mcResultCache = null;
      inverseCache = null;
      renderFromState();
      runFullCompute();
      scheduleSave();
    } catch (err) {
      alert('Read failed: ' + err.message);
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
    if (dt) dt.textContent = t('higherBetter');
    setTimeout(function () { input.focus(); }, 50);
  });
  document.getElementById('dim-direction')?.addEventListener('click', function () {
    dimDir = dimDir === 'higher' ? 'lower' : 'higher';
    this.textContent = dimDir === 'higher' ? t('higherBetter') : t('lowerBetter');
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
    if (btn && !btn.id.startsWith('lang-')) loadScenario(btn.dataset.scenario);
  });

  // — Language toggle —
  document.getElementById('lang-toggle-btn')?.addEventListener('click', function () {
    const next = LOCALE.current === 'en' ? 'zh' : 'en';
    setLang(next);
    // Full re-render
    initialRenderDone = false;
    renderFromState();
    runFullCompute();
  });
}

function copySummary() {
  if (!mcResultCache) { alert(t('noResult')); return; }
  const wr = mcResultCache.winRates;
  const er = mcResultCache.extremeRanks;
  const sorted = Object.entries(wr).sort((a, b) => b[1] - a[1]);
  const top = sorted[0];
  const topName = state.options.find(o => o.id === top[0])?.name || '?';
  const topPct = Math.round(top[1] * 100);

  const isEn = LOCALE.current === 'en';
  let shield = t('noWinner');
  if (top[1] > 0.6) shield = t('stableAlt', { name: topName });
  else if (top[1] >= 0.4) shield = t('wobblyAlt', { name: topName });

  let text = t('summaryHeader') + ' ' + new Date().toLocaleString(isEn ? 'en-US' : 'zh-CN') + '\n';
  text += '\u{1F3C6} ' + shield + ' (' + topPct + '%)\n';
  text += (isEn ? '\u2014'.repeat(28) : '\u2500'.repeat(28)) + '\n';
  sorted.forEach(([id, rate], i) => {
    const name = state.options.find(o => o.id === id)?.name || id;
    const r = er && er[id];
    const rankRange = r ? (isEn ? ' rank ' + r.best + '\u2013' + r.worst : ' 第' + r.best + '\u2013' + r.worst + '\u540D') : '';
    text += (i + 1) + '. ' + name + '  ' + Math.round(rate * 100) + '%' + rankRange + '\n';
  });
  text += (isEn ? '\u2014'.repeat(28) : '\u2500'.repeat(28)) + '\n';
  text += t('summaryDimWeights') + ' ';
  state.dimensions.forEach((dim, i) => {
    const w = state.weights[dim.id].value;
    const dir = dim.direction === 'lower' ? '\u2193' : '\u2191';
    text += (i > 0 ? ' | ' : '') + dimName(dim) + dir + ' ' + w;
  });
  text += '\n\n' + t('summaryFooter');

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () {
      const btn = document.getElementById('copy-summary-btn');
      if (btn) { btn.textContent = t('copied'); setTimeout(function () { btn.textContent = t('copySummary'); }, 2000); }
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
  if (btn) { btn.textContent = t('copied'); setTimeout(function () { btn.textContent = t('copySummary'); }, 2000); }
}

function init() {
  // Restore language preference
  try {
    const savedLang = localStorage.getItem('rp-lang');
    if (savedLang && LOCALE[savedLang]) LOCALE.current = savedLang;
  } catch (e) {}

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
  if (mcResultCache) {
    renderInverseSuggestions(mcResultCache);
  }
}

document.addEventListener('DOMContentLoaded', init);
