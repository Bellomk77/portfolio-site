/* The GRC Risk Toolkit scoring engine (grc/engine.py), ported to the browser.
   Same rules, same rounding (Python's round: ties to even), same ordering. */
(function (root) {
  'use strict';
  const STATUS_WEIGHT = { implemented: 1.0, partial: 0.5, not_implemented: 0.0 };
  const EFFORT_WEIGHT = { S: 1, M: 2, L: 4 };
  const IMPACT_REDUCING = new Set(['Respond', 'Recover']);
  const IMPACT_REDUCING_IDS = new Set(['PR.DS-11']); // backups limit the damage rather than preventing the event
  const MAX_LIKELIHOOD_REDUCTION = 0.6, MAX_IMPACT_REDUCTION = 0.4;
  const FUNCTIONS = ['Govern', 'Identify', 'Protect', 'Detect', 'Respond', 'Recover'];

  function rating(score) {
    return score >= 15 ? 'Critical' : score >= 10 ? 'High' : score >= 5 ? 'Medium' : 'Low';
  }

  /* Python's round(x, nd) for non-negative x: correctly rounded, exact ties go to the even digit.
     An exact decimal tie is only possible when x * 2^(nd+1) is an odd integer. */
  function pyRound(x, nd) {
    const q = x * Math.pow(2, nd + 1);
    if (Number.isInteger(q) && Math.abs(q % 2) === 1) {
      const m = Math.pow(10, nd);
      const n = Math.floor(x * m);
      return (n % 2 === 0 ? n : n + 1) / m;
    }
    return Number(x.toFixed(nd));
  }

  function create(data) {
    const controls = Object.fromEntries(data.controls.map((c) => [c.id, c]));
    const assets = Object.fromEntries(data.assets.map((a) => [a.id, a]));
    const impactReducing = (cid) => IMPACT_REDUCING_IDS.has(cid) || IMPACT_REDUCING.has(controls[cid].function);
    const baseline = Object.fromEntries(data.controls.map((c) => [c.id, c.status]));
    const avg = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0.0);

    function scoreScenario(s, st) {
      const likelihood = s.likelihood;
      const dims = Object.entries(s.impact);
      const impact = Math.max(...dims.map(([, v]) => v));
      const prevW = [], respW = [];
      s.controls.forEach((c) => (impactReducing(c) ? respW : prevW).push(STATUS_WEIGHT[st[c]]));
      const prev = avg(prevW), resp = avg(respW);
      const resL = Math.max(1.0, likelihood * (1 - MAX_LIKELIHOOD_REDUCTION * prev));
      const hasResp = s.controls.some(impactReducing);
      const resI = hasResp ? Math.max(1.0, impact * (1 - MAX_IMPACT_REDUCTION * resp)) : impact;
      return {
        id: s.id, scenario: s.name, source: s.source,
        assets: s.assets.map((a) => assets[a].name),
        inherent_likelihood: likelihood, inherent_impact: impact,
        inherent_score: likelihood * impact, inherent_rating: rating(likelihood * impact),
        control_effectiveness: pyRound(hasResp ? (prev + resp) / 2 : prev, 2),
        residual_likelihood: pyRound(resL, 1), residual_impact: pyRound(resI, 1),
        residual_score: pyRound(resL * resI, 1), residual_rating: rating(resL * resI), residual_raw: resL * resI,
        worst_impact_dimension: dims.reduce((best, d) => (d[1] > best[1] ? d : best))[0],
        controls: s.controls.slice(),
        control_gaps: s.controls.filter((c) => st[c] !== 'implemented'),
      };
    }

    function register(st) {
      const reg = data.scenarios.map((s) => scoreScenario(s, st));
      reg.sort((a, b) => b.residual_score - a.residual_score); // stable, like Python's sort
      return reg;
    }
    const total = (reg) => pyRound(reg.reduce((a, r) => a + r.residual_score, 0), 1);

    function roadmap(st) {
      const reg = register(st);
      const base = total(reg);
      const items = [];
      data.controls.forEach((c) => {
        if (st[c.id] === 'implemented') return;
        const reduction = pyRound(base - total(register(Object.assign({}, st, { [c.id]: 'implemented' }))), 1);
        if (reduction <= 0) return;
        items.push({
          control: c.id, title: c.title, function: c.function, status: st[c.id], effort: c.effort, owner: c.owner || '',
          risk_reduction: reduction, priority: pyRound(reduction / EFFORT_WEIGHT[c.effort], 2),
          risks_addressed: reg.filter((r) => r.control_gaps.includes(c.id)).map((r) => r.id),
        });
      });
      return items.sort((a, b) => b.priority - a.priority);
    }

    function maturity(st) {
      const out = {};
      FUNCTIONS.forEach((fn) => {
        const vals = data.controls.filter((c) => c.function === fn).map((c) => STATUS_WEIGHT[st[c.id]]);
        out[fn] = vals.length ? pyRound(vals.reduce((a, b) => a + b, 0) / vals.length, 2) : 0.0;
      });
      return out;
    }

    return { baseline, register, total, roadmap, maturity, rating, FUNCTIONS, EFFORT_WEIGHT, STATUS_WEIGHT, impactReducing };
  }

  root.GrcEngine = { create, pyRound, rating };
})(typeof window !== 'undefined' ? window : globalThis);
