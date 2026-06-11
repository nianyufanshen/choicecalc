# RobustPick · 稳择

**Monte Carlo decision simulator — stress-test your choices before you make them.**

> Not a scoring calculator. A robustness tester.
>
> Most decision tools tell you "what's best" given fixed inputs. RobustPick flips the question: *"If your judgments are slightly off, does the answer hold?"*

![Screenshot](screenshot.png)

---

## The Core Insight

Traditional multi-criteria tools (weighted scoring, AHP, etc.) treat your inputs as **certain**. But in real decisions, they never are:

- **You're not sure** how important each factor really is
- **You're not sure** how to score each option
- **You're not sure** you've considered everything

RobustPick simulates **10,000+ scenarios** where your weights and scores randomly fluctuate within your stated uncertainty range. The result is not a single answer — it's a **stability diagnosis**:

| Metric | What it tells you |
|:-------|:------------------|
| 🏆 **Win rate** | How often each option wins across all simulated scenarios |
| 📊 **Rank range** | The best/worst rank each option can achieve |
| 🔄 **Sensitivity** | How much a small weight shift changes the outcome |
| 🎯 **Inverse paths** | What needs to change for a underdog to flip the result |

---

## Features

### 1. Weighted Multi-Criteria Input
- Add up to **8 options** and **8 criteria dimensions**
- Each dimension gets a **weight** (1-10) and **uncertainty** (low/medium/high)
- Each option gets a **score** (1-10) per dimension, with its own uncertainty
- Scores and weights use **triangular distribution** sampling for realistic Monte Carlo

### 2. Stability Shield 🛡️
The primary output — a three-tier stability assessment:

| State | Meaning |
|:------|:--------|
| **Stable** (win rate > 60%) | Your top option dominates across almost all simulated scenarios |
| **Wobbly** (win rate 40-60%) | The leader changes depending on small assumption shifts — proceed with caution |
| **Uncertain** (win rate < 40%) | No clear winner. The spread is too tight to be confident |

### 3. Inverse Path Analysis
When your preferred option isn't the simulated winner, RobustPick automatically computes **three types of paths** to flip the result:

| Path | Question it answers |
|:-----|:--------------------|
| **Minimal Adjustment** | "Which single weight, if changed the least, makes this option win?" |
| **Intuitive Advantage** | "Does this option have a natural strength that's being underweighted?" |
| **Surprising Blindspot** | "Is there a dimension you rated low that actually could turn the tables?" |

Each path comes with a **"Try It" button** that instantly applies the suggested weight and re-runs the simulation.

### 4. Pairwise Explainer
For every pair of options, you get:

- A **head-to-head win rate** (A wins 72% vs B wins 28%)
- A **dimension-level breakdown** explaining *why* one leads ("A wins on salary and growth, but trails on commute")
- Optional **central weight deviation** — shows when your stated weights differ from the weights that actually make an option win (inspired by SMAA literature)

### 5. Scenario Presets

| Scenario | Description |
|:---------|:------------|
| 💼 Job Offer | Salary, growth, WLB, team, commute |
| 🏠 Home Buying | Price, location, size, age, transit |
| 💻 Tech Stack | Performance, ecosystem, cost, learning curve |
| 🤝 Vendor | Price, quality, delivery, support, capability |
| 🌆 City Move | Jobs, housing, climate, education, cost |
| 🎓 School | Ranking, tuition, employment, safety, culture |

### 6. Persistence & Portability
- **Auto-saves** to localStorage — revisit without losing your work
- **Export/Import JSON** — share your full analysis with others
- **Copy summary** — one-click text snapshot of results

---

## How It Works (Under the Hood)

### Monte Carlo Engine

```
For each of N simulations (default: 2,000 adaptive, up to 10,000 full):
  1. Sample each weight from its uncertainty distribution (triangular)
  2. Sample each score from its uncertainty distribution (triangular)
  3. Compute weighted total for each option
  4. Record the winner + pairwise comparisons + rank
```

**Adaptive convergence**: If rankings stabilize across 3 consecutive batches, the simulation stops early (SIMA-inspired).

### Central Weight Vector (SMAA)

When an option wins, the simulation records *which weight values* contributed to that win. Over thousands of iterations, this builds a **central weight profile**: "When Option A wins, the salary weight averages 8.2 — but you set it to 6." This reveals hidden mismatches between stated preferences and actual winning conditions.

### Inverse 3-Path Algorithm

Rather than brute-force searching the weight space, RobustPick uses:
1. **Binary search** on each dimension to find the minimum weight shift needed for a flip (Path A)
2. **Score comparison** with the current champion to find natural advantages (Path B)
3. **Extreme value testing** on low-weighted dimensions to uncover blindspots (Path C)

A **dedicated cache layer** ensures that overlapping MC computations across paths share results, keeping the total simulation cost to ~2,000 iterations (not 3×).

---

## Quick Start

```bash
git clone https://github.com/YOUR_USER/robust-pick.git
cd robust-pick

# Option 1: Any HTTP server
python -m http.server 8000
# Open http://localhost:8000

# Option 2: VS Code Live Server
# Right-click index.html → Open with Live Server

# Option 3: Direct file open (basic)
# Just open index.html in a browser
```

**No build step. No dependencies to install.** Just serve the directory.

**External dependency**: ECharts (loaded via CDN fallback from `lib/echarts.min.js`)

---

## Tech Stack

| Layer | Choice |
|:------|:-------|
| Language | Vanilla JavaScript (ES2020+) |
| UI | Single HTML page, CSS custom properties |
| Chart | ECharts 5 (pie chart for win-rate distribution) |
| Simulation | Custom Monte Carlo engine, triangular sampling |
| Persistence | localStorage |
| Format | Zero build tools, no bundler, no framework |

---

## Project Structure

```
robust-pick/
├── index.html          # Single-page app (all CSS + HTML)
├── app.js              # All application logic (~1500 lines)
├── lib/
│   └── echarts.min.js  # ECharts 5 (pie chart)
└── screenshot.png
```

---

## References

The methodology draws from:

- **SMAA** (Stochastic Multicriteria Acceptability Analysis) — Lahdelma & Salminen, 2001
- **Central weight vectors** — the average weights under which each alternative wins
- **Extreme rank analysis** — Kadziński et al., 2012
- **Erwig's explanation framework** — decomposing pairwise comparisons into dimension-level contributions (2022/2025)
- **Triangular distribution** for bounded Monte Carlo sampling with a mode

---

## License

MIT
