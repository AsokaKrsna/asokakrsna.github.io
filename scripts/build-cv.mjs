// Generates cv/cv.tex from data/portfolio-data.json, so the CV, the website and the CMS share one source.
// Run: node scripts/build-cv.mjs   then   pdflatex cv.tex (twice, inside cv/)
// The GitHub workflow does both on every data change and publishes CV.pdf and Resume.pdf.
//
// CV-only wording lives in `cv` (top level) and in an optional `cv` field on experience and project items;
// everything else falls back to the fields the website uses.
//
// Written for automated screening as well as people: one column, standard section names, no tables or
// icons, real text for every link, selectable text with correct Unicode, and PDF metadata.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const d = JSON.parse(await readFile(path.join(root, 'data/portfolio-data.json'), 'utf8'));
const cv = d.cv || {};
const p = d.personal || {};

// ---------- escaping ----------
const tex = (s) => String(s ?? '')
  .replace(/<[^>]*>/g, '')                      // strip any HTML from shared fields
  .replace(/\\/g, '\\textbackslash{}')
  .replace(/([&%$#_{}])/g, '\\$1')
  .replace(/~/g, '\\textasciitilde{}')
  .replace(/\^/g, '\\textasciicircum{}')
  .replace(/"([^"]*)"/g, '``$1\'\'')
  .replace(/(\d) - (\d|Present|present)/g, '$1 -- $2')   // date ranges
  .replace(/ - (Present|present)/g, ' -- Present')
  .replace(/(\d)-(?=\d)/g, '$1--')                     // page and year ranges
  .replace(/\.\.\./g, '\\ldots{}');
const url = (u) => String(u).replace(/([%#&_])/g, '\\$1');
const period = (s, opts = {}) => {
  // "2025-27" → "2025 – 2027"; "Nov 2025 - Present" → "Nov 2025 – Present"
  let t = String(s || '').trim().replace(/^(\d{4})-(\d{2})$/, (m, a, b) => `${a}-${a.slice(0, 2)}${b}`);
  const end = t.match(/(\d{4})$/);
  if (opts.expected && end && Number(end[1]) > new Date().getFullYear()) t += ' (expected)';
  return String(tex(t)).replace(/\s*-{1,2}\s*/g, ' -- ');
};
const bold = (authors) => tex(authors).replace(/D\.\s?Majumdar/g, '\\textbf{D.~Majumdar}');
const academic = (x) => x && x.academic !== false;

// ---------- sections ----------
const out = [];
const section = (title, body) => { if (body && body.trim()) out.push(`\\section{${title}}\n${body}`); };
const items = (arr) => arr.length ? `\\begin{itemize}\n${arr.map((x) => `  \\item ${x}`).join('\n')}\n\\end{itemize}` : '';
const entry = (left, right, sub) => `\\entry{${left}}{${right || ''}}{${sub || ''}}`;

// header
// identifiers (emails, ORCID iD, URLs) are escaped literally: no dash or range rewriting
const lit = (s) => String(s ?? '').replace(/([&%$#_{}])/g, '\\$1');
const linkOf = (l) => `\\href{${url(l.url)}}{${lit(l.label)}}`;
const allLinks = cv.links || [];
const contact = [cv.email && `\\href{mailto:${cv.email}}{${lit(cv.email)}}`, cv.emailAlt && `\\href{mailto:${cv.emailAlt}}{${lit(cv.emailAlt)}}`, cv.phone && lit(cv.phone),
  ...allLinks.filter((l) => /orcid/i.test(l.url)).map(linkOf), cv.location && tex(cv.location)].filter(Boolean);
const links = allLinks.filter((l) => !/orcid/i.test(l.url)).map(linkOf);
const header = `\\begin{center}
  {\\LARGE\\bfseries ${tex(p.name)}}\\\\[0.3em]
  ${tex(cv.headline || '')}\\\\[0.25em]
  {\\small ${contact.join(' \\enspace{}|\\enspace{} ')}\\\\
  ${links.join(' \\enspace{}|\\enspace{} ')}}
\\end{center}
\\vspace{-0.5em}`;

// research interests
section('Research Interests', tex(cv.interests || (d.researchInterests && d.researchInterests.statement) || ''));

// education
section('Education', (d.education || []).map((e) => {
  const grade = e.grade ? tex(e.grade.replace(/^(CGPA|CPI):\s*/i, '$1 ').replace(/\s*\/\s*10\.00/, '/10')) : '';
  const city = e.location ? e.location.split(',')[0].trim() : '';
  const where = city && !String(e.institution).includes(city) ? `, ${tex(city)}` : '';
  return `${entry(tex(e.institution) + where, period(e.period, { expected: true }), `${tex(e.degree)}${grade ? ` \\hfill ${grade}` : ''}`)}
${items([e.details].filter(Boolean).map(tex))}`;
}).join('\n\\vspace{0.3em}\n'));

// publications
const pubs = (d.research || []).filter(academic);
const kind = (x) => /review/i.test(x.status || '') ? 'review' : /preprint/i.test(x.status || x.type || '') ? 'preprint' : 'published';
const fmtPub = (x) => {
  const venue = tex(x.venue || x.publication || '');
  const when = tex(x.status === 'preprint' && x.date ? x.date : (x.year || x.date || ''));
  const link = x.doi ? ` \\doi{${url(x.doi)}}` : (x.url ? ` \\href{${url(x.url)}}{\\nolinkurl{${url(x.url)}}}` : '');
  return `${bold(x.authors || '')}. \`\`${tex(x.title)}.'' \\emph{${venue}}, ${when}.${link}`;
};
const groups = [['review', 'Manuscripts under review'], ['preprint', 'Preprints'], ['published', 'Peer-reviewed conference papers']]
  .map(([k, label]) => [label, pubs.filter((x) => kind(x) === k)]).filter(([, a]) => a.length);
section('Publications', groups.map(([label, a]) => `\\textit{${label}}\n${items(a.map(fmtPub))}`).join('\n\\vspace{0.2em}\n'));

// experience by kind
const exp = (k) => (d.experience || []).filter((e) => academic(e) && (e.kind || 'research') === k);
const fmtExp = (e) => `${entry(`${tex(e.title)}, ${tex(e.company)}`, period(e.period))}
${items((e.cv || e.responsibilities || []).map(tex))}`;
section('Research Experience', exp('research').map(fmtExp).join('\n\\vspace{0.3em}\n'));

// software and projects
const projectLine = (x) => {
  const link = x.liveUrl && x.liveUrl !== '#' ? x.liveUrl : (x.githubUrl && x.githubUrl !== '#' ? x.githubUrl : '');
  const tech = (x.technologies || []).length ? ` ${tex(x.technologies.join(', '))}.` : '';
  const shown = link ? ` \\href{${url(link)}}{\\nolinkurl{${url(link.replace(/^https?:\/\//, '').replace(/\/$/, ''))}}}` : '';
  return `\\textbf{${tex(x.title)}} -- ${tex(x.cv || x.description)}${tech}${shown}`;
};
const projects = (d.projects || []).filter((x) => x.academic === true);
section('Research Software', items(projects.filter((x) => x.category === 'software').map(projectLine)));
section('Projects', items(projects.filter((x) => x.category !== 'software').map(projectLine)));

// honours
// year as the list label: reads well, and parsers keep each year with its award
const honors = ((d.classic && d.classic.honors) || []).filter((h) => h && h.text);
section('Honours and Awards', honors.length
  ? `\\begin{itemize}[leftmargin=4.8em,labelwidth=4.3em,labelsep=0.5em,align=left]\n${honors.map((h) => `  \\item[{\\color{muted}${tex(h.year || '')}}] ${tex(h.text)}`).join('\n')}\n\\end{itemize}`
  : '');

// teaching
const teaching = exp('teaching').map(fmtExp);
if (cv.volunteering) teaching.push(`${entry('Volunteer Teaching and Mentoring', '')}\n${items([tex(cv.volunteering)])}`);
section('Teaching and Mentoring', teaching.join('\n\\vspace{0.3em}\n'));

// service
const service = exp('service').map(fmtExp);
const practice = cv.practice || (d.classic && d.classic.practice);
if (practice && typeof practice === 'object') service.push(`${entry(tex(practice.title), period(practice.period))}\n${items([tex(practice.text)])}`);
else if (practice) service.push(items([tex(practice)]));
section('Service and Leadership', service.join('\n\\vspace{0.3em}\n'));

// skills (plain lines, no table, so parsers keep label and items together)
const skills = (cv.skills || (d.skills || []).map((s) => ({ label: s.category, items: s.items })));
section('Skills', items([
  ...skills.map((s) => `\\textbf{${tex(s.label)}:} ${tex(s.items).replace(/\.$/, '')}`),
  ...(cv.certifications ? [`\\textbf{Certifications:} ${tex(cv.certifications)}`] : []),
]));

if (cv.references) section('References', tex(cv.references));

// ---------- document ----------
const keywords = [...new Set([...(d.researchInterests && d.researchInterests.areas) || [], 'blockchain security', 'cross-chain bridges', 'smart contracts', 'LLM security', 'agentic AI', 'cybersecurity'])].join(', ');
const doc = `% GENERATED by scripts/build-cv.mjs from data/portfolio-data.json. Edit the data (or the CMS), not this file.
\\documentclass[10pt]{article}
\\usepackage[a4paper,margin=1.7cm,top=1.4cm,bottom=1.4cm]{geometry}
\\input{glyphtounicode}
\\pdfgentounicode=1
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage{XCharter}
\\usepackage[none]{hyphenat}
\\usepackage{ragged2e}
\\usepackage{microtype}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage[hidelinks,pdfusetitle]{hyperref}
\\usepackage{xurl}
\\urlstyle{same}
\\hypersetup{pdftitle={${tex(p.name)} -- Curriculum Vitae}, pdfauthor={${tex(p.name)}}, pdfsubject={Academic CV}, pdfkeywords={${tex(keywords)}}}
\\newcommand{\\doi}[1]{\\href{https://doi.org/#1}{\\nolinkurl{doi:#1}}}
\\definecolor{accent}{HTML}{1F3A5F}
\\definecolor{muted}{HTML}{555555}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\linespread{1.0}
\\RaggedRight
\\titleformat{\\section}{\\large\\bfseries\\color{accent}}{}{0pt}{}[\\vspace{-0.55em}\\textcolor{accent}{\\rule{\\linewidth}{0.5pt}}]
\\titlespacing*{\\section}{0pt}{0.7em}{0.3em}
\\setlist[itemize]{leftmargin=1.1em,itemsep=0.06em,topsep=0.12em,parsep=0pt,label={\\textcolor{muted}{\\textbullet}}}
\\newcommand{\\entry}[3]{%
  \\textbf{#1}\\hfill{\\color{muted}#2}\\par
  \\ifx&#3&\\else{\\itshape #3}\\par\\fi\\vspace{-0.1em}}
\\begin{document}
${header}

${out.join('\n\n')}
\\end{document}
`;
await writeFile(path.join(root, 'cv/cv.tex'), doc);
console.log(`cv/cv.tex written (${out.length} sections, ${pubs.length} publications)`);
