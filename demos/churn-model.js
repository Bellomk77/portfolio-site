/* The churn model from churn-model-api, ported to the browser.
   Logistic regression on standardized numeric features plus one-hot categories:
   logit = intercept + sum(z_i * coef_i) + sum(coef[column][chosen value]); p = sigmoid(logit).
   Per-column contributions are the same quantities the API uses for its "top reasons". */
(function (root) {
  'use strict';
  function create(model) {
    const num = model.numeric;
    function score(x) {
      const contrib = {};
      let logit = model.intercept;
      num.forEach((name, i) => {
        const z = (Number(x[name]) - model.mean[i]) / model.scale[i];
        const c = z * model.num_coef[i];
        contrib[name] = c;
        logit += c;
      });
      for (const [col, coefs] of Object.entries(model.categorical)) {
        const val = String(x[col]);
        if (!(val in coefs)) throw new Error(`Unknown value for ${col}: ${val}`);
        contrib[col] = coefs[val];
        logit += coefs[val];
      }
      const p = 1 / (1 + Math.exp(-logit));
      const band = p >= model.bands.high ? 'high' : p >= model.bands.medium ? 'medium' : 'low';
      const ranked = Object.entries(contrib).sort((a, b) => b[1] - a[1]);
      return {
        p, band, logit, contrib,
        reasons: ranked.filter(([, c]) => c > 0).slice(0, 3).map(([col, c]) => ({ col, value: x[col], c })),
        protective: ranked.filter(([, c]) => c < 0).reverse().slice(0, 3).map(([col, c]) => ({ col, value: x[col], c })),
      };
    }
    return { score };
  }
  root.ChurnModel = { create };
})(typeof window !== 'undefined' ? window : globalThis);
