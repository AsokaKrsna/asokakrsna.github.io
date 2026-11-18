// Pre-renders the academic page (index.html) from data/portfolio-data.json.
// Run: node scripts/build.mjs        (also runs in .github/workflows/build.yml on every push)
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { renderMain, renderFooter, pageMeta, esc, NAV } from '../js/academic-render.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await readFile(path.join(root, 'data/portfolio-data.json'), 'utf8'));
const template = await readFile(path.join(root, 'templates/academic.html'), 'utf8');

const { title, description } = pageMeta(data);
const p = data.personal || {};
const jsonld = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: p.name,
  alternateName: p.alias,
  url: 'https://asokakrsna.github.io/',
  image: 'https://asokakrsna.github.io/' + (p.profileImage || ''),
  jobTitle: (data.classic && data.classic.role) || p.title,
  affiliation: { '@type': 'CollegeOrUniversity', name: 'Indian Institute of Technology Patna' },
  sameAs: (data.socialLinks || []).filter((s) => s.academic !== false).map((s) => s.url),
};

const main = renderMain(data);
const present = new Set([...main.matchAll(/<section id="([^"]+)"/g)].map((m) => m[1]));
const nav = NAV.filter(([id]) => present.has(id)).map(([id, label]) => `<a href="#${id}">${label}</a>`).join('');

// cache-busting stamp from the assets the page loads
const assets = ['css/academic.css', 'css/mode-switch.css', 'js/mode-switch.js', 'js/academic-render.js'];
const hash = createHash('sha256');
for (const a of assets) hash.update(await readFile(path.join(root, a)));
const V = hash.digest('hex').slice(0, 10);

const html = template
  .replaceAll('{{V}}', V)
  .replaceAll('{{TITLE}}', esc(title))
  .replaceAll('{{DESCRIPTION}}', esc(description))
  .replaceAll('{{NAME}}', esc(p.name || ''))
  .replace('{{JSONLD}}', JSON.stringify(jsonld).replace(/</g, '\\u003c'))
  .replace('{{NAV}}', nav)
  .replace('{{MAIN}}', main)
  .replace('{{FOOTER}}', renderFooter(data));

await writeFile(path.join(root, 'index.html'), html);
console.log(`index.html written (${(html.length / 1024).toFixed(1)} KB, ${present.size} sections)`);

// Nerd Mode is hand-written HTML: stamp each local css/js link with a hash of the file it points to,
// so browsers (and GitHub Pages' 10-minute cache) never mix an old script with a new stylesheet.
const nerdPath = path.join(root, 'nerd.html');
let nerd = await readFile(nerdPath, 'utf8');
const stamped = [];
const linkRe = /(src|href)="((?:js|css)\/[^"?]+)(?:\?v=[^"]*)?"/g;
const files = [...new Set([...nerd.matchAll(linkRe)].map((m) => m[2]))];
const hashes = {};
for (const f of files) hashes[f] = createHash('sha256').update(await readFile(path.join(root, f))).digest('hex').slice(0, 10);
nerd = nerd.replace(linkRe, (_, attr, f) => { stamped.push(f); return `${attr}="${f}?v=${hashes[f]}"`; });
await writeFile(nerdPath, nerd);
console.log(`nerd.html: stamped ${stamped.length} asset links`);

