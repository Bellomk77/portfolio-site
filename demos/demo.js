/* Shared helpers for the live project demos. All data strings are inserted with
   textContent (never innerHTML), because some of the demo data is attack text. */
(function () {
  'use strict';
  const css = getComputedStyle(document.documentElement);
  const v = (name) => css.getPropertyValue(name).trim();
  const C = {
    s1: v('--s1'), s2: v('--s2'), s3: v('--s3'), s4: v('--s4'),
    text: v('--text'), text2: v('--text-2'), text3: v('--text-3'), grid: v('--grid'),
    good: v('--good'), warn: v('--warn'), serious: v('--serious'), crit: v('--crit'),
    surface: '#162640', bg: '#0d1b2e',
  };

  /* Element builder: el('div', {class: 'x', text: 'safe'}, child, 'text') */
  function el(tag, props, ...kids) {
    const e = document.createElement(tag);
    if (props) {
      for (const [k, val] of Object.entries(props)) {
        if (val === undefined || val === null || val === false) continue;
        if (k === 'class') e.className = val;
        else if (k === 'text') e.textContent = val;
        else if (k === 'style') {
          for (const [sk, sv] of Object.entries(val)) {
            if (sk.startsWith('--')) e.style.setProperty(sk, sv); else e.style[sk] = sv;
          }
        }
        else if (k === 'dataset') Object.assign(e.dataset, val);
        else if (k.startsWith('on') && typeof val === 'function') e.addEventListener(k.slice(2), val);
        else e.setAttribute(k, val === true ? '' : val);
      }
    }
    for (const kid of kids.flat()) {
      if (kid === null || kid === undefined || kid === false) continue;
      e.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
    }
    return e;
  }
  const $ = (sel, root) => (root || document).querySelector(sel);
  const clear = (node) => { while (node.firstChild) node.removeChild(node.firstChild); return node; };

  const fmt = {
    int: (x) => Math.round(x).toLocaleString('en-CA'),
    money: (x, dp = 0) => (x < 0 ? '-$' : '$') + Math.abs(x).toLocaleString('en-CA', { minimumFractionDigits: dp, maximumFractionDigits: dp }),
    moneyShort: (x) => {
      const a = Math.abs(x), s = x < 0 ? '-$' : '$';
      if (a >= 1e6) return s + (a / 1e6).toFixed(a >= 1e7 ? 1 : 2).replace(/\.?0+$/, '') + 'M';
      if (a >= 1e3) return s + (a / 1e3).toFixed(a >= 1e5 ? 0 : 1).replace(/\.0$/, '') + 'K';
      return s + Math.round(a);
    },
    pct: (x, dp = 0) => (x * 100).toFixed(dp) + '%',
    signedPct: (x, dp = 0) => (x >= 0 ? '+' : '') + (x * 100).toFixed(dp) + '%',
  };

  /* Segmented control. options: [{value, label}] */
  function segmented(container, options, value, onChange, ariaLabel) {
    clear(container);
    container.setAttribute('role', 'group');
    if (ariaLabel) container.setAttribute('aria-label', ariaLabel);
    const buttons = options.map((o) => {
      const b = el('button', { type: 'button', 'aria-pressed': String(o.value === value), text: o.label });
      b.addEventListener('click', () => {
        buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        onChange(o.value);
      });
      container.append(b);
      return b;
    });
    return {
      set(val) { buttons.forEach((b, i) => b.setAttribute('aria-pressed', String(options[i].value === val))); },
    };
  }

  /* Ranked horizontal bars (one series = one color). rows: [{name, value, note?}] */
  function hbars(container, rows, opts = {}) {
    clear(container);
    const max = opts.max || Math.max(...rows.map((r) => r.value), 1);
    const total = rows.reduce((s, r) => s + r.value, 0);
    const format = opts.format || fmt.int;
    container.classList.add('hbars');
    rows.forEach((r) => {
      const share = total ? r.value / total : 0;
      const fill = el('span', { class: 'fill', style: { width: '0%', background: r.color || opts.color || C.s1 } });
      const valText = el('span', { class: 'val', text: format(r.value) },
        opts.share === false ? null : el('small', { text: r.note || fmt.pct(share) }));
      const row = el('div', {
        class: 'hbar', role: 'listitem',
        title: `${r.name}: ${format(r.value)}${opts.share === false ? '' : ' (' + fmt.pct(share, 1) + ' of total)'}`,
      }, el('span', { class: 'name', text: r.name }), el('span', { class: 'track' }, fill, valText));
      container.append(row);
      // width of the bar is relative to the largest bar, leaving room for the value label
      requestAnimationFrame(() => { fill.style.width = `calc(${(r.value / max) * 100}% * 0.72)`; });
    });
    container.setAttribute('role', 'list');
  }

  /* Tall segmented bar: parts [{name, value, color, ink?}]: the label is printed only if it fits */
  function segbar(container, parts, opts = {}) {
    clear(container);
    const total = parts.reduce((s, p) => s + p.value, 0) || 1;
    const format = opts.format || ((x) => fmt.pct(x / total));
    container.classList.add('segbar');
    container.setAttribute('role', 'img');
    container.setAttribute('aria-label', parts.map((p) => `${p.name} ${fmt.pct(p.value / total, 1)}`).join(', '));
    const nodes = parts.filter((p) => p.value > 0).map((p) => {
      const label = opts.label ? opts.label(p, total) : fmt.pct(p.value / total);
      const part = el('div', {
        class: 'part' + (p.ink === 'dark' ? ' dark-ink' : ''),
        style: { flex: `${p.value / total} 1 0`, background: p.color },
        title: `${p.name}: ${format(p.value)} (${fmt.pct(p.value / total, 1)})`,
      });
      part.dataset.label = label;
      container.append(part);
      return part;
    });
    // measure after layout: only print the label when it fits with padding
    requestAnimationFrame(() => {
      nodes.forEach((n) => {
        n.textContent = n.dataset.label;
        if (n.scrollWidth > n.clientWidth || n.clientWidth < 34) n.textContent = '';
      });
    });
  }

  function legend(container, items) {
    clear(container);
    container.classList.add('legend');
    items.forEach((it) => {
      container.append(el('span', null, el('i', { class: it.kind || 'line', style: { background: it.kind === 'dash' ? 'none' : it.color } }), it.label));
    });
  }

  /* Table-view twin for a chart */
  function tableView(container, headers, rows, opts = {}) {
    const numeric = opts.numeric || headers.map((_, i) => i > 0);
    const table = el('table', null,
      el('thead', null, el('tr', null, headers.map((h, i) => el('th', { class: numeric[i] ? 'n' : null, scope: 'col', text: h })))),
      el('tbody', null, rows.map((r) => el('tr', null, r.map((c, i) => el('td', { class: numeric[i] ? 'n' : null, text: c }))))));
    const d = el('details', { class: 'table-view' }, el('summary', { text: opts.summary || 'View as table' }), el('div', { class: 'tbl-wrap' }, table));
    clear(container).append(d);
  }

  /* ---------- Chart.js theme + plugins ---------- */
  function setupChartJs() {
    if (!window.Chart) return;
    const Chart = window.Chart;
    Chart.defaults.color = C.text2;
    Chart.defaults.font.family = "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.borderColor = C.grid;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.animation.duration = 450;
    Chart.defaults.elements.line.borderWidth = 2;
    Chart.defaults.elements.line.borderCapStyle = 'round';
    Chart.defaults.elements.line.borderJoinStyle = 'round';
    Chart.defaults.elements.point.radius = 0;
    Chart.defaults.elements.point.hoverRadius = 5;
    Chart.defaults.elements.point.hoverBorderWidth = 2;
    Chart.defaults.elements.point.hoverBorderColor = C.surface;
    Chart.defaults.interaction.mode = 'index';
    Chart.defaults.interaction.intersect = false;
    Chart.defaults.plugins.legend.display = false;
    const tt = Chart.defaults.plugins.tooltip;
    tt.backgroundColor = 'rgba(9, 19, 34, 0.96)';
    tt.borderColor = 'rgba(0, 212, 255, 0.28)';
    tt.borderWidth = 1;
    tt.padding = 10;
    tt.cornerRadius = 8;
    tt.titleColor = C.text2;
    tt.titleFont = { weight: '600', size: 12 };
    tt.bodyColor = C.text;
    tt.bodyFont = { size: 12.5 };
    tt.bodySpacing = 5;
    tt.usePointStyle = true;
    tt.boxWidth = 14;
    tt.boxHeight = 2;
    tt.boxPadding = 6;
    tt.callbacks.labelPointStyle = () => ({ pointStyle: 'line', rotation: 0 });

    // vertical hairline that follows the hovered x position
    Chart.register({
      id: 'crosshair',
      afterDatasetsDraw(chart) {
        const act = chart.tooltip && chart.tooltip.getActiveElements();
        if (!act || !act.length || chart.config.type !== 'line') return;
        const x = act[0].element.x;
        const { ctx, chartArea } = chart;
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.28)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, chartArea.top);
        ctx.lineTo(x, chartArea.bottom);
        ctx.stroke();
        ctx.restore();
      },
    });

    // fixed vertical marker: options.plugins.marker = {x: <scale value>, label}
    Chart.register({
      id: 'marker',
      afterDatasetsDraw(chart, args, opts) {
        if (!opts || opts.x === undefined || opts.x === null) return;
        const scale = chart.scales.x;
        const x = scale.getPixelForValue(opts.x);
        const { ctx, chartArea } = chart;
        if (x < chartArea.left - 1 || x > chartArea.right + 1) return;
        ctx.save();
        ctx.strokeStyle = opts.color || 'rgba(0, 212, 255, 0.75)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, chartArea.top);
        ctx.lineTo(x, chartArea.bottom);
        ctx.stroke();
        if (opts.label) {
          ctx.font = "600 11px Inter, system-ui, sans-serif";
          const w = ctx.measureText(opts.label).width;
          const left = Math.min(Math.max(x - w / 2 - 6, chartArea.left), chartArea.right - w - 12);
          ctx.fillStyle = 'rgba(0, 212, 255, 0.16)';
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(left, chartArea.top + 2, w + 12, 20, 6); else ctx.rect(left, chartArea.top + 2, w + 12, 20);
          ctx.fill();
          ctx.fillStyle = '#7fe7ff';
          ctx.textBaseline = 'middle';
          ctx.fillText(opts.label, left + 6, chartArea.top + 12);
        }
        ctx.restore();
      },
    });

    // direct labels at line ends (text in text ink, keyed by a short stroke of the series color)
    Chart.register({
      id: 'endLabels',
      afterDatasetsDraw(chart, args, opts) {
        if (!opts || !opts.enabled || chart.width < (opts.minWidth || 560)) return;
        const { ctx, chartArea } = chart;
        const items = [];
        chart.data.datasets.forEach((ds, i) => {
          const meta = chart.getDatasetMeta(i);
          if (meta.hidden || ds.endLabel === false || !meta.data.length) return;
          let p = null;
          for (let j = meta.data.length - 1; j >= 0; j--) {
            const val = ds.data[j];
            if (val !== null && val !== undefined && !meta.data[j].skip) { p = meta.data[j]; break; }
          }
          if (!p) return;
          items.push({ x: p.x, y: p.y, ly: p.y, text: ds.endLabel || ds.label, color: ds.borderColor });
        });
        items.sort((a, b) => a.y - b.y);
        const gap = 16;
        for (let i = 1; i < items.length; i++) items[i].ly = Math.max(items[i].y, items[i - 1].ly + gap);
        const overflow = items.length ? items[items.length - 1].ly - (chartArea.bottom - 4) : 0;
        if (overflow > 0) items.forEach((it) => { it.ly -= overflow; });
        for (let i = items.length - 2; i >= 0; i--) items[i].ly = Math.min(items[i].ly, items[i + 1].ly - gap);
        ctx.save();
        ctx.font = "600 11.5px Inter, system-ui, sans-serif";
        ctx.textBaseline = 'middle';
        items.forEach((it) => {
          ctx.strokeStyle = it.color;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(it.x + 5, it.y);
          ctx.lineTo(it.x + 13, it.ly);
          ctx.stroke();
          ctx.fillStyle = C.text2;
          ctx.fillText(it.text, it.x + 17, it.ly);
        });
        ctx.restore();
      },
    });
  }

  /* Other demos strip */
  const DEMOS = [
    { href: 'https://calgridai.com', icon: 'fa-rocket', label: 'CalGrid AI (live product)' },
    { href: 'retail.html', icon: 'fa-chart-line', label: 'Retail KPI dashboard' },
    { href: 'fraud.html', icon: 'fa-credit-card', label: 'Fraud alert-budget simulator' },
    { href: 'churn.html', icon: 'fa-user-clock', label: 'Churn risk scorer' },
    { href: 'grc.html', icon: 'fa-shield-halved', label: 'GRC what-if risk report' },
    { href: 'security.html', icon: 'fa-user-secret', label: 'LLM security scan report' },
  ];
  function moreDemos(container, current) {
    clear(container);
    container.append(el('h2', { class: 'section-title', text: 'More live demos' }),
      el('div', { class: 'more-grid' }, DEMOS.map((d) => el('a', { href: d.href, 'aria-current': d.href === current ? 'page' : null, target: /^https?:/.test(d.href) ? '_blank' : null, rel: /^https?:/.test(d.href) ? 'noopener' : null },
        el('i', { class: 'fas ' + d.icon, 'aria-hidden': 'true' }), d.label))));
  }

  setupChartJs();
  window.DEMO = { C, el, $, clear, fmt, segmented, hbars, segbar, legend, tableView, moreDemos, DEMOS };
})();
