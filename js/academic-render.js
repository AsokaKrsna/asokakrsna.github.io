// Shared renderer for the academic page.
// Used by scripts/build.mjs (static pre-render) and by index.html in CMS preview mode.
// Fields that intentionally allow inline HTML (author-controlled): classic.bio, classic.news[].text,
// classic.currentWork[].text. Everything else is escaped.

const OWN_NAME = /\bD\.\s?Majumdar\b/g;

export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeUrl(url) {
  const u = String(url || '').trim();
  if (!u) return '';
  if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
  if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return ''; // block javascript:, data:, etc.
  return u; // relative
}

// Minimal allow-list sanitizer for trusted-but-HTML fields: keeps a, em, strong, i, b, br, code.
function richText(html) {
  return String(html ?? '').replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (tag, name, attrs) => {
    const n = name.toLowerCase();
    if (!['a', 'em', 'strong', 'i', 'b', 'br', 'code'].includes(n)) return '';
    if (tag.startsWith('</')) return `</${n}>`;
    if (n === 'a') {
      const m = attrs.match(/href\s*=\s*"([^"]*)"/i) || attrs.match(/href\s*=\s*'([^']*)'/i);
      const href = safeUrl(m ? m[1] : '');
      const external = /^https?:/i.test(href);
      return href
        ? `<a href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>`
        : '<a>';
    }
    return `<${n}>`;
  });
}

function link(url, text, cls = '') {
  const href = safeUrl(url);
  if (!href) return '';
  const external = /^https?:/i.test(href);
  return `<a${cls ? ` class="${cls}"` : ''} href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(text)}</a>`;
}

function section(id, title, inner) {
  if (!inner || !String(inner).trim()) return '';
  return `<section id="${id}" class="block" aria-labelledby="${id}-h"><h2 id="${id}-h">${esc(title)}</h2>${inner}</section>`;
}

const isAcademic = (item) => item && item.academic !== false;

// ---------- sections ----------

function renderHeader(data) {
  const p = data.personal || {};
  const c = data.classic || {};
  const contact = data.contact || {};
  const emails = Array.isArray(contact.emails) ? contact.emails : [];
  const socials = (data.socialLinks || []).filter(isAcademic);
  const affiliations = Array.isArray(c.sidebarAffiliations) ? c.sidebarAffiliations : [];

  const links = [
    p.resumeLink ? `<a class="btn btn-primary" href="${esc(safeUrl(p.resumeLink))}">CV (PDF)</a>` : '',
    emails[0] ? `<a class="btn" href="mailto:${esc(emails[0])}">Email</a>` : '',
    ...socials.map((s) => link(s.url, s.platform === 'Twitter' ? 'X' : s.platform, 'btn')),
  ].filter(Boolean).join('');

  return `
  <header class="hero">
    ${p.profileImage ? `<img class="avatar" src="${esc(safeUrl(p.profileImage))}" alt="Portrait of ${esc(p.name)}" width="128" height="128">` : ''}
    <div class="hero-text">
      <h1>${esc(p.name)}</h1>
      ${c.role ? `<p class="role">${esc(c.role)}</p>` : ''}
      ${!c.role && affiliations.length ? `<p class="role">${affiliations.map(esc).join(', ')}</p>` : ''}
      ${c.seekingText ? `<p class="seeking"><span class="dot" aria-hidden="true"></span>${esc(c.seekingText)}</p>` : ''}
      <nav class="hero-links" aria-label="Profiles">${links}</nav>
    </div>
  </header>`;
}

function renderAbout(data) {
  const c = data.classic || {};
  const bio = Array.isArray(c.bio) && c.bio.length ? c.bio : (data.about && data.about.paragraphs) || [];
  const areas = (data.researchInterests && data.researchInterests.areas) || [];
  const inner = `
    ${bio.map((para) => `<p>${richText(para)}</p>`).join('')}
    ${areas.length ? `<p class="label">Research interests</p><ul class="tags">${areas.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}`;
  return section('about', 'About', inner);
}

function renderNews(data) {
  const news = ((data.classic && data.classic.news) || []).filter((n) => n && n.text);
  if (!news.length) return '';
  const visible = news.slice(0, 6);
  const rest = news.slice(6);
  const li = (n) => `<li><span class="when">${esc(n.date)}</span><span>${richText(n.text)}</span></li>`;
  const inner = `<ul class="news">${visible.map(li).join('')}</ul>${
    rest.length ? `<details class="more"><summary>Older news (${rest.length})</summary><ul class="news">${rest.map(li).join('')}</ul></details>` : ''}`;
  return section('news', 'News', inner);
}

function renderCurrent(data) {
  const items = ((data.classic && data.classic.currentWork) || []).filter((w) => w && (w.title || w.text));
  if (!items.length) return '';
  const inner = `<ul class="current">${items.map((w) => `<li><strong class="cw-title">${esc(w.title)}</strong>${w.text ? `<span>${richText(w.text)}</span>` : ''}</li>`).join('')}</ul>`;
  return section('current', 'Current work', inner);
}

const STATUS_GROUPS = [
  { key: 'under-review', title: 'Under review' },
  { key: 'preprint', title: 'Preprints' },
  { key: 'published', title: 'Peer-reviewed papers' },
];

function pubStatus(p) {
  const s = String(p.status || p.type || 'published').toLowerCase();
  if (s.includes('review')) return 'under-review';
  if (s.includes('preprint')) return 'preprint';
  return 'published';
}

function renderPublications(data) {
  const pubs = (data.research || []).filter((p) => isAcademic(p) && p.title);
  if (!pubs.length) return '';
  const groups = STATUS_GROUPS.map((g) => ({ ...g, items: pubs.filter((p) => pubStatus(p) === g.key) }))
    .filter((g) => g.items.length);
  const item = (p) => {
    const authors = p.authors ? esc(p.authors).replace(OWN_NAME, (m) => `<strong>${m}</strong>`) : '';
    const venue = p.venue || p.publication || '';
    const links = [
      p.url ? link(p.url, p.doi ? 'DOI' : 'Paper') : '',
      p.pdf ? link(p.pdf, 'PDF') : '',
      p.code ? link(p.code, 'Code') : '',
    ].filter(Boolean).join('');
    return `<li class="pub">
      <span class="pub-year">${esc(p.year || p.date || '')}</span>
      <div>
        <p class="pub-title">${esc(p.title)}</p>
        ${authors ? `<p class="pub-authors">${authors}</p>` : ''}
        ${venue ? `<p class="pub-venue">${esc(venue)}</p>` : ''}
        ${links ? `<p class="pub-links">${links}</p>` : ''}
      </div>
    </li>`;
  };
  const scholar = (data.socialLinks || []).find((s) => /scholar/i.test(s.platform || ''));
  const inner = groups.map((g) => `<h3>${esc(g.title)}</h3><ol class="pubs">${g.items.map(item).join('')}</ol>`).join('')
    + (scholar ? `<p class="aside">Full list on ${link(scholar.url, 'Google Scholar')}.</p>` : '');
  return section('publications', 'Publications', inner);
}

function projectList(projects) {
  const item = (p) => {
    const links = [
      p.liveUrl && p.liveUrl !== '#' ? link(p.liveUrl, p.linkText || 'Site') : '',
      p.githubUrl && p.githubUrl !== '#' ? link(p.githubUrl, 'Code') : '',
    ].filter(Boolean).join('');
    const tech = Array.isArray(p.technologies) ? p.technologies.join(', ') : '';
    return `<li class="project">
      <p class="project-title">${esc(p.title)}${p.status ? ` <span class="badge">${esc(p.status)}</span>` : ''}</p>
      <p>${esc(p.description)}</p>
      <p class="meta">${tech ? `<span>${esc(tech)}</span>` : ''}${links}</p>
    </li>`;
  };
  return `<ul class="projects">${projects.map(item).join('')}</ul>`;
}

function renderSoftware(data) {
  const items = (data.projects || []).filter((p) => p && p.academic === true && p.category === 'software');
  return items.length ? section('software', 'Research software', projectList(items)) : '';
}

function renderProjects(data) {
  const items = (data.projects || []).filter((p) => p && p.academic === true && p.category !== 'software');
  return items.length ? section('projects', 'Projects', projectList(items)) : '';
}

function renderTimeline(items) {
  return `<ul class="timeline">${items.map((e) => `
    <li>
      <div class="tl-head"><p class="tl-title"><strong>${esc(e.title)}</strong>${e.org ? `, ${esc(e.org)}` : ''}</p>${e.period ? `<span class="when">${esc(e.period)}</span>` : ''}</div>
      ${e.points && e.points.length ? `<ul class="points">${e.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    </li>`).join('')}</ul>`;
}

function experienceOf(data, kind) {
  return (data.experience || [])
    .filter((e) => isAcademic(e) && (e.kind || 'research') === kind)
    .map((e) => ({ title: e.title, org: e.company, period: e.period, points: e.responsibilities || [] }));
}

function renderExperience(data) {
  const items = experienceOf(data, 'research');
  return items.length ? section('experience', 'Research experience', renderTimeline(items)) : '';
}

function renderEducation(data) {
  const items = (data.education || []).map((e) => `
    <li>
      <div class="tl-head"><p class="tl-title"><strong>${esc(e.institution)}</strong></p><span class="when">${esc(e.period)}</span></div>
      <p>${esc(e.degree)}${e.grade ? ` <span class="muted">· ${esc(e.grade)}</span>` : ''}</p>
      ${e.details ? `<p class="muted">${esc(e.details)}</p>` : ''}
    </li>`).join('');
  return items ? section('education', 'Education', `<ul class="timeline">${items}</ul>`) : '';
}

function renderTeaching(data) {
  const teaching = experienceOf(data, 'teaching');
  const volunteering = (data.volunteering || []).filter(isAcademic).map((v) => ({
    title: v.role, org: v.organization, period: v.period, points: [v.description].filter(Boolean),
  }));
  const items = teaching.concat(volunteering);
  return items.length ? section('teaching', 'Teaching & mentoring', renderTimeline(items)) : '';
}

function renderHonors(data) {
  const honors = ((data.classic && data.classic.honors) || []).filter((h) => h && h.text);
  if (!honors.length) return '';
  return section('honors', 'Honours & awards',
    `<ul class="honors">${honors.map((h) => `<li><span class="when">${esc(h.year || '')}</span><span>${esc(h.text)}</span></li>`).join('')}</ul>`);
}

function renderService(data) {
  const items = experienceOf(data, 'service');
  const practice = data.classic && data.classic.practice;
  if (!items.length && !practice) return '';
  return section('service', 'Service & leadership',
    (items.length ? renderTimeline(items) : '') + (practice ? `<p class="aside">${esc(practice)}</p>` : ''));
}

function renderSkills(data) {
  const skills = (data.skills || []).filter((s) => s && s.items);
  if (!skills.length) return '';
  return section('skills', 'Skills',
    `<dl class="skills">${skills.map((s) => `<dt>${esc(s.category)}</dt><dd>${esc(s.items)}</dd>`).join('')}</dl>`);
}

function renderContact(data) {
  const contact = data.contact || {};
  const emails = Array.isArray(contact.emails) ? contact.emails : [];
  const inner = `
    ${contact.description ? `<p>${esc(contact.description)}</p>` : ''}
    <ul class="contact">
      ${emails.map((e) => `<li><a href="mailto:${esc(e)}">${esc(e)}</a></li>`).join('')}
      ${contact.calendlyUrl ? `<li>${link(contact.calendlyUrl, 'Book a 30-minute call')}</li>` : ''}
    </ul>`;
  return section('contact', 'Contact', inner);
}

// ---------- public API ----------

export const NAV = [
  ['about', 'About'], ['publications', 'Publications'], ['education', 'Education'],
  ['experience', 'Experience'], ['software', 'Software'], ['teaching', 'Teaching'], ['contact', 'Contact'],
];

export function renderMain(data) {
  return [
    renderHeader(data),
    renderAbout(data),
    renderPublications(data),
    renderCurrent(data),
    renderEducation(data),
    renderExperience(data),
    renderSoftware(data),
    renderProjects(data),
    renderNews(data),
    renderTeaching(data),
    renderHonors(data),
    renderService(data),
    renderSkills(data),
    renderContact(data),
  ].join('\n');
}

export function renderFooter(data) {
  const f = data.footer || {};
  return `<p>${esc(f.classicText || f.text || '')}${f.lastUpdated ? ` · Last updated ${esc(f.lastUpdated)}` : ''}</p>`;
}

export function pageMeta(data) {
  const p = data.personal || {};
  const c = data.classic || {};
  const ri = data.researchInterests || {};
  const title = `${p.name || 'Portfolio'} · ${c.role ? c.role.split(',')[0] : 'Academic page'}`;
  const description = [c.role, ri.statement].filter(Boolean).join('. ').replace(/\s+/g, ' ').slice(0, 280);
  return { title, description };
}
