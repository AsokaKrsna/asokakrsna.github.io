// Academic | Nerd switch. The two options are plain links (they work without JS); this script turns
// the navigation into a two-part transition that starts on the leaving page and finishes on the arriving one.
//   Academic → Nerd : text decrypts, CRT switches off, terminal handshake  |  arrive: CRT powers on
//   Nerd → Academic : terminal glitches, paper irises open, name is set    |  arrive: name glides into the header
// Any click or key during a transition skips straight ahead. prefers-reduced-motion gets a short crossfade.
(function () {
  'use strict';
  var KEY = 'ms-transition';
  var root = document.documentElement;
  // Reduced motion keeps the story (colour, text, the handshake, the paper) but drops movement and flashing.
  // localStorage 'ms-motion' = 'full' forces the full version, for testing on machines with animations off.
  var forced = null;
  try { forced = localStorage.getItem('ms-motion'); } catch (e) {}
  var reduced = forced === 'full' ? false : !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reduced) root.classList.add('ms-reduced');
  var NAME = 'Durjoy Majumdar';
  var GLYPHS = '01<>/\\{}[]#$%&*+=?ABCDEF0123456789';

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  // ?ms-hold=1 plays a transition without navigating (for recording and testing it)
  var HOLD = /[?&]ms-hold=1/.test(location.search);
  function go(href) { if (!HOLD) location.href = href; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function save(data) { try { sessionStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} }
  function take() {
    try {
      var raw = sessionStorage.getItem(KEY);
      sessionStorage.removeItem(KEY);
      var t = JSON.parse(raw || 'null');
      return t && Date.now() - t.at < 5000 ? t : null;
    } catch (e) { return null; }
  }
  function academicTheme() {
    var t = null;
    try { t = localStorage.getItem('academic-theme-v2'); } catch (e) {}
    if (t === 'light' || t === 'dark') return t;
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // ───────── leaving ─────────

  // Scramble the text that is on screen into ciphertext, resolving nothing: it is being encrypted away.
  function scramble(duration) {
    var nodes = [];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentElement;
        if (!p || p.closest('script,style,.mode-switch,.ms-term')) return NodeFilter.FILTER_REJECT;
        var r = p.getBoundingClientRect();
        return r.bottom > 0 && r.top < innerHeight && r.width > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    var chars = 0;
    while (walker.nextNode() && chars < 6000) { nodes.push({ n: walker.currentNode, t: walker.currentNode.nodeValue }); chars += walker.currentNode.nodeValue.length; }
    var start = performance.now();
    return new Promise(function (done) {
      (function frame(now) {
        var p = Math.min(1, (now - start) / duration);
        nodes.forEach(function (o) {
          var out = '';
          for (var i = 0; i < o.t.length; i++) {
            var c = o.t[i];
            // each character flips at its own moment, sweeping left to right with jitter
            var threshold = (i / Math.max(1, o.t.length)) * 0.6 + ((i * 7919) % 13) / 13 * 0.4;
            out += c === ' ' || p < threshold ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
          o.n.nodeValue = out;
        });
        if (p < 1) requestAnimationFrame(frame); else done();
      })(start);
    });
  }

  function terminal(lines, finalCaret) {
    var term = el('div', 'ms-term');
    term.setAttribute('aria-hidden', 'true');
    var pre = el('pre');
    term.appendChild(pre);
    root.appendChild(term); // outside <body>, which is being transformed away
    return {
      node: term,
      // types each line's command part, then stamps its status
      play: async function (speed) {
        for (var i = 0; i < lines.length; i++) {
          var L = lines[i];
          var span = el('span', L.cls || '');
          pre.appendChild(span);
          for (var j = 1; j <= L.text.length; j += 3) { span.textContent = L.text.slice(0, j); await wait(speed); }
          span.textContent = L.text;
          if (L.ok) { pre.appendChild(el('span', 'ok', ' ' + L.ok)); await wait(70); }
          pre.appendChild(document.createTextNode('\n'));
        }
        if (finalCaret) pre.appendChild(el('span', 'caret'));
      },
      fill: function () {
        pre.innerHTML = lines.map(function (L) {
          return '<span class="' + (L.cls || '') + '">' + L.text + '</span>' + (L.ok ? '<span class="ok"> ' + L.ok + '</span>' : '');
        }).join('\n') + '\n<span class="caret"></span>';
      },
    };
  }

  var HANDSHAKE = [
    { text: '$ ssh durjoy@asokakrsna.github.io --mode=nerd' },
    { text: '  checking trust assumptions .........', ok: 'ok', cls: 'dim' },
    { text: '  decrypting portfolio ...............', ok: 'ok', cls: 'dim' },
    { text: '  access granted' },
  ];

  async function toNerd(sw, href, x, y) {
    root.classList.add('ms-decrypt');
    var scan = el('div', 'ms-scan');
    root.appendChild(scan);
    requestAnimationFrame(function () { scan.classList.add('on'); });
    await scramble(560);
    var t;
    if (reduced) {
      t = terminal(HANDSHAKE, true);
      t.node.classList.add('ms-fadein');
      await t.play(9);
    } else {
      root.classList.add('ms-crt-off');
      await wait(400);
      t = terminal(HANDSHAKE, true);
      await t.play(9);
    }
    save({ to: 'nerd', at: Date.now() });
    await wait(260);
    go(href);
  }

  var LOGOUT = [
    { text: '$ exit' },
    { text: 'logout', cls: 'dim' },
    { text: 'Connection to asokakrsna.github.io closed.', cls: 'dim' },
  ];

  // Leaving Nerd Mode is the mirror of arriving: log out, let the noise settle, lay down a clean sheet.
  async function toAcademic(sw, href, x, y) {
    if (reduced) return toAcademicGentle(href);
    if (document.fonts && document.fonts.load) document.fonts.load('600 40px "Source Serif 4"');
    var t = terminal(LOGOUT, false);
    t.node.classList.add('ms-exit');
    root.classList.add('ms-calm');            // the page exhales: matrix off, colour drains, focus softens
    await t.play(26);
    await wait(380);
    var paper = el('div', 'ms-paper ms-sheet' + (academicTheme() === 'dark' ? ' dark' : ''));
    var name = el('div', 'ms-name', NAME);
    var rule = el('div', 'ms-rule');
    var caption = el('div', 'ms-caption', 'Academic profile');
    paper.appendChild(name);
    paper.appendChild(rule);
    paper.appendChild(caption);
    root.appendChild(paper);
    requestAnimationFrame(function () {
      paper.classList.add('up');
      name.classList.add('setting');
      rule.classList.add('drawing');
      caption.classList.add('show');
    });
    await wait(700);
    t.node.remove();
    root.classList.remove('ms-calm');
    save({ to: 'academic', at: Date.now() });
    await wait(800);
    go(href);
  }

  // same paper and name, arriving by opacity alone
  async function toAcademicGentle(href) {
    var paper = el('div', 'ms-paper full ms-fadein' + (academicTheme() === 'dark' ? ' dark' : ''));
    var name = el('div', 'ms-name', NAME);
    var rule = el('div', 'ms-rule');
    var caption = el('div', 'ms-caption', 'Academic profile');
    paper.appendChild(name);
    paper.appendChild(rule);
    paper.appendChild(caption);
    root.appendChild(paper);
    requestAnimationFrame(function () { name.classList.add('setting'); rule.classList.add('drawing'); caption.classList.add('show'); });
    save({ to: 'academic', at: Date.now() });
    await wait(1250);
    go(href);
  }

  async function crossfade(to, href) {
    var f = el('div', 'ms-fade');
    root.appendChild(f);
    f.style.background = to === 'nerd' ? '#0a0e17' : (academicTheme() === 'dark' ? '#15171b' : '#fbfaf7');
    requestAnimationFrame(function () { f.classList.add('on'); });
    save({ to: to, at: Date.now(), reduced: true });
    await wait(230);
    go(href);
  }

  function leave(sw, opt, ev) {
    if (root.classList.contains('ms-leaving')) return;
    root.classList.add('ms-leaving');
    var to = opt.getAttribute('data-mode');
    var href = opt.href;
    var r = opt.getBoundingClientRect();
    var x = ev && ev.clientX ? ev.clientX : r.left + r.width / 2;
    var y = ev && ev.clientY ? ev.clientY : r.top + r.height / 2;
    sw.classList.add('is-switching');

    // impatient visitors: any click or key jumps straight to the destination
    var skip = function () { save({ to: to, at: Date.now(), skipped: true }); go(href); };
    setTimeout(function () {
      addEventListener('pointerdown', skip, { once: true });
      addEventListener('keydown', skip, { once: true });
    }, 250);

    setTimeout(function () { (to === 'nerd' ? toNerd : toAcademic)(sw, href, x, y); }, 160);
  }

  // ───────── arriving ─────────

  async function arriveNerd(t) {
    var term = t.skipped ? null : terminal(HANDSHAKE, true);
    if (term) term.fill();
    root.classList.remove('ms-arriving');
    if (reduced) {
      if (term) { await wait(200); term.node.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, easing: 'ease-out', fill: 'forwards' }); await wait(440); term.node.remove(); }
      return;
    }
    var power = el('div', 'ms-power', '<div class="half top"></div><div class="half bottom"></div><div class="line"></div>');
    root.appendChild(power);
    await wait(term ? 260 : 30);
    if (term) term.node.remove();
    requestAnimationFrame(function () { power.classList.add('go'); });
    await wait(800);
    power.remove();
  }

  async function arriveAcademic(t) {
    var h1 = document.querySelector('.hero h1');
    if (!h1) return;
    if (t.skipped) return fadeIn(getComputedStyle(document.body).backgroundColor);
    var dark = root.getAttribute('data-theme') === 'dark';
    var paper = el('div', 'ms-paper full' + (dark ? ' dark' : ''));
    var name = el('div', 'ms-name', NAME);
    var rule = el('div', 'ms-rule');
    rule.style.transform = 'scaleX(1)';
    var caption = el('div', 'ms-caption', 'Academic profile');
    caption.style.opacity = '1';
    paper.appendChild(rule);
    paper.appendChild(caption);
    root.appendChild(paper);
    root.appendChild(name);
    name.style.transformOrigin = '0 0';
    name.style.color = getComputedStyle(h1).color;
    root.classList.add('ms-flip');
    // the stand-in waits for the real serif, so the name never swaps faces mid-flight
    name.style.opacity = '0';
    if (document.fonts && document.fonts.load) await Promise.race([document.fonts.load('600 40px "Source Serif 4"'), wait(600)]);
    name.style.opacity = '';
    scrollTo(0, 0);
    var from = name.getBoundingClientRect();
    var to = h1.getBoundingClientRect();
    var scale = to.height / from.height;
    var dx = to.left - from.left;
    var dy = to.top - from.top;
    var ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
    if (reduced) {
      // no flight: the stand-in and the paper dissolve onto the real heading
      name.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, delay: 250, easing: 'ease-out', fill: 'forwards' });
      rule.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'ease-out', fill: 'forwards' });
      root.classList.remove('ms-flip');
      await paper.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, delay: 200, easing: 'ease-out', fill: 'forwards' }).finished.catch(function () {});
      name.remove(); paper.remove();
      return;
    }
    var fly = name.animate(
      [{ transform: 'translate(-50%, -50%)' },
       // with the origin at the top-left corner, translating by the corner offset then scaling lands exactly on the heading
       { transform: 'translate(-50%, -50%) translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ')' }],
      { duration: 820, delay: 120, easing: ease, fill: 'forwards' });
    rule.animate([{ transform: 'scaleX(1)', opacity: 1 }, { transform: 'scaleX(0)', opacity: 0 }], { duration: 380, easing: ease, fill: 'forwards' });
    caption.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease-out', fill: 'forwards' });
    paper.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 520, delay: 360, easing: 'ease-out', fill: 'forwards' });
    await fly.finished.catch(function () {});
    root.classList.remove('ms-flip');
    root.classList.add('ms-landed');
    name.remove();
    paper.remove();
  }

  async function fadeIn(color) {
    var f = el('div', 'ms-fade on');
    f.style.background = color;
    root.appendChild(f);
    await wait(30);
    f.classList.remove('on');
    await wait(260);
    f.remove();
  }

  function arrive() {
    var t = take();
    if (!t) root.classList.remove('ms-arriving');
    if (!t) return;
    var here = document.querySelector('.mode-switch');
    var mode = here ? here.getAttribute('data-current') : null;
    if (t.to !== mode) return;
    (mode === 'nerd' ? arriveNerd : arriveAcademic)(t).catch(function () {
      root.classList.remove('ms-flip');
      document.querySelectorAll('.ms-paper,.ms-name,.ms-power,.ms-term,.ms-fade').forEach(function (n) { n.remove(); });
    });
  }

  // ───────── wiring ─────────

  function prefetch(href) {
    if (document.querySelector('link[rel=prefetch][href="' + href + '"]')) return;
    var l = document.createElement('link');
    l.rel = 'prefetch'; l.href = href;
    document.head.appendChild(l);
  }

  function wire(sw) {
    sw.querySelectorAll('.ms-opt').forEach(function (opt) {
      if (opt.getAttribute('aria-current') !== 'page') {
        ['pointerenter', 'focus', 'touchstart'].forEach(function (e) { opt.addEventListener(e, function () { prefetch(opt.getAttribute('href')); }, { passive: true, once: true }); });
      }
      opt.addEventListener('click', function (ev) {
        if (opt.getAttribute('aria-current') === 'page') { ev.preventDefault(); return; }
        if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button === 1) return; // new tab: let it be
        ev.preventDefault();
        leave(sw, opt, ev);
      });
    });
  }

  // back/forward cache restores a page frozen mid-transition: put it back
  addEventListener('pageshow', function (e) {
    if (e.persisted && root.classList.contains('ms-leaving')) location.reload();
  });

  // ───────── back to top (both modes) ─────────
  function backToTop() {
    var nerd = !!document.querySelector('.mode-switch.ms-terminal');
    var b = el('button', 'to-top' + (nerd ? ' terminal' : ''),
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>');
    b.type = 'button';
    b.setAttribute('aria-label', 'Back to top');
    b.title = nerd ? 'cd ~' : 'Back to top';
    document.body.appendChild(b);
    var ticking = false;
    function update() { b.classList.toggle('show', scrollY > 700); ticking = false; }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
    b.addEventListener('click', function () {
      scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      var target = document.querySelector('#main, main, .main-content');
      if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
    });
  }

  function init() {
    document.querySelectorAll('.mode-switch').forEach(wire);
    backToTop();
    arrive();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
