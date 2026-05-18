/**
 * Classic mode renderer
 * Loads the shared portfolio JSON, renders the academic portfolio view,
 * then attaches the lightweight UI interactions used on the page.
 */

(function () {
    'use strict';

    const DATA_URL = 'data/portfolio-data.json';
    const SIDEBAR_PLATFORM_ORDER = ['Google Scholar', 'ORCID', 'GitHub', 'LinkedIn'];

    document.addEventListener('DOMContentLoaded', async () => {
        setClassicStatus('Loading latest portfolio content...');

        try {
            const data = await loadData();
            renderClassicPage(data);
            setClassicStatus('');
        } catch (error) {
            console.error('[Classic] Failed to load portfolio data:', error);
            setClassicStatus('Unable to load live portfolio data. Serve the site over HTTP or check data/portfolio-data.json.', 'error');
        }

        initInteractions();
    });

    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'livePreviewUpdate') {
            try {
                renderClassicPage(event.data.data);
                console.log('%c[Classic] %cLive preview updated!', 'color: #fca311; font-weight: bold;', 'color: white;');
            } catch (err) {
                console.error('[Classic] Error updating live preview:', err);
            }
        }
    });

    async function loadData() {
        const isPreviewMode = new URLSearchParams(window.location.search).get('preview') === '1';
        if (isPreviewMode) {
            const previewData = sessionStorage.getItem('portfolio-preview-data');
            if (previewData) {
                try {
                    return JSON.parse(previewData);
                } catch (e) {
                    console.error('[Classic] Failed to parse preview data', e);
                }
            }
        }

        const response = await fetch(DATA_URL + '?t=' + Date.now());
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
    }

    function renderClassicPage(data) {
        updateDocumentMeta(data);
        applyClassicLayoutOptions(data);
        renderHero(data);
        renderSidebar(data);
        renderAbout(data);
        renderNews(data);
        renderResearchInterests(data);
        renderPublications(data);
        renderExperience(data);
        renderEducation(data);
        renderTeaching(data);
        renderProjects(data);
        renderHonors(data);
        renderCertifications(data);
        renderSkills(data);
        renderBlogs(data);
        renderCyberArena(data);
        renderScratchpad(data);
        renderContact(data);
        renderFooter(data);
    }

    function updateDocumentMeta(data) {
        const name = data.personal && data.personal.name ? data.personal.name : 'Portfolio';
        const title = `${name} | Academic Portfolio`;
        const description = buildMetaDescription(data);

        document.title = title;
        setMetaContent('classic-meta-description', description);
        setMetaContent('classic-og-title', title);
        setMetaContent('classic-og-description', description);
        setMetaContent('classic-twitter-title', title);
        setMetaContent('classic-twitter-description', description);

        const favicon = document.querySelector('link[rel="shortcut icon"]');
        if (favicon && data.personal && data.personal.favicon) {
            favicon.href = data.personal.favicon;
        }
    }

    function renderHero(data) {
        const hero = document.getElementById('classic-hero');
        if (!hero) return;

        const name = data.personal && data.personal.name ? data.personal.name : 'Academic Portfolio';
        const affiliations = nonEmptyStrings(data.classic && data.classic.sidebarAffiliations);
        const primaryEmail = getPrimaryAcademicEmail(Array.isArray(data.contact && data.contact.emails) ? data.contact.emails : []);
        const scholarLink = findSocialLink(data, 'Google Scholar');
        const heroSummary = buildHeroSummary(data);
        const heroLinks = [];

        if (data.personal && data.personal.resumeLink) {
            heroLinks.push(`<a class="hero-link" href="${escapeAttr(sanitizeUrl(data.personal.resumeLink, '#'))}" target="_blank" rel="noopener noreferrer">Open CV</a>`);
        }

        if (primaryEmail) {
            heroLinks.push(`<a class="hero-link hero-link-secondary" href="mailto:${escapeAttr(primaryEmail)}">${escapeHtml(primaryEmail)}</a>`);
        }

        if (scholarLink) {
            heroLinks.push(`<a class="hero-link hero-link-secondary" href="${escapeAttr(sanitizeUrl(scholarLink.url, '#'))}" target="_blank" rel="noopener noreferrer">Google Scholar</a>`);
        }

        hero.innerHTML = `
            <p class="classic-kicker">Academic portfolio</p>
            <h1 class="classic-hero-title">${escapeHtml(name)}</h1>
            ${affiliations.length ? `<p class="classic-hero-meta">${affiliations.map((item) => escapeHtml(item)).join(' <span class="meta-sep">&middot;</span> ')}</p>` : ''}
            ${heroSummary ? `<p class="classic-hero-summary">${escapeHtml(heroSummary)}</p>` : ''}
            ${heroLinks.length ? `<div class="classic-hero-links">${heroLinks.join('')}</div>` : ''}
        `;
    }

    function renderSidebar(data) {
        const header = document.querySelector('.sidebar-header');
        const links = document.querySelector('.sidebar-links');
        const cvButton = document.querySelector('.cv-button');

        if (header) {
            const affiliations = nonEmptyStrings(data.classic && data.classic.sidebarAffiliations);
            const seekingText = data.classic && data.classic.seekingText ? data.classic.seekingText : '';
            header.innerHTML = `
                <div class="profile-photo">
                    <img src="${escapeAttr(sanitizeUrl(data.personal && data.personal.profileImage ? data.personal.profileImage : 'images/profile.png', 'images/profile.png'))}" alt="${escapeAttr(data.personal && data.personal.name ? data.personal.name : 'Portfolio profile photo')}">
                </div>
                <div class="sidebar-name">${escapeHtml(data.personal && data.personal.name ? data.personal.name : '')}</div>
                ${affiliations.map((item) => `<div class="sidebar-affiliation">${escapeHtml(item)}</div>`).join('')}
                ${seekingText ? `<div class="sidebar-seeking">${escapeHtml(seekingText)}</div>` : ''}
            `;
        }

        if (cvButton && data.personal && data.personal.resumeLink) {
            cvButton.href = sanitizeUrl(data.personal.resumeLink, '#');
        }

        if (links) {
            links.innerHTML = buildSidebarLinks(data).map((item) => {
                const targetAttrs = item.url.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener noreferrer"';
                return `<a href="${escapeAttr(sanitizeUrl(item.url, '#'))}"${targetAttrs}>${escapeHtml(item.label)}</a>`;
            }).join('');
        }
    }

    function renderAbout(data) {
        const section = document.getElementById('about');
        if (!section) return;

        const paragraphs = Array.isArray(data.about && data.about.paragraphs) ? data.about.paragraphs : [];
        section.innerHTML = `
            <h2 class="section-title">About</h2>
            <div class="about-text">
                ${paragraphs.map((paragraph) => `<p>${sanitizeRichText(paragraph)}</p>`).join('')}
            </div>
        `;
    }

    function renderNews(data) {
        const section = document.getElementById('news');
        if (!section) return;

        const items = Array.isArray(data.classic && data.classic.news) ? data.classic.news : [];
        const visible = items.slice(0, 4);
        const hidden = items.slice(4);

        section.innerHTML = `
            <h2 class="section-title">News</h2>
            <ul class="news-list">
                ${visible.map(renderNewsItem).join('')}
            </ul>
            ${hidden.length ? `<ul class="news-list" id="news-more-items" style="display: none;">${hidden.map(renderNewsItem).join('')}</ul>` : ''}
            ${renderShowMoreButton(hidden.length, 'news-more-items', items.length)}
        `;
    }

    function renderNewsItem(item) {
        return `
            <li class="news-item">
                <span class="news-date">${escapeHtml(item && item.date ? item.date : '')}</span>
                <span class="news-text">${item && item.text ? sanitizeRichText(item.text) : ''}</span>
            </li>
        `;
    }

    function renderResearchInterests(data) {
        const section = document.getElementById('research-interests');
        if (!section) return;

        const title = data.researchInterests && data.researchInterests.title ? data.researchInterests.title : 'Research Interests';
        const statement = data.researchInterests && data.researchInterests.statement ? data.researchInterests.statement : '';
        const areas = nonEmptyStrings(data.researchInterests && data.researchInterests.areas);
        const futureGoals = data.researchInterests && data.researchInterests.futureGoals ? data.researchInterests.futureGoals : '';

        section.innerHTML = `
            <h2 class="section-title">${escapeHtml(title)}</h2>
            <p class="research-statement">${escapeHtml(statement)}</p>
            ${areas.length ? `<div class="research-keywords">${areas.map((area) => `<span class="keyword-tag">${escapeHtml(area)}</span>`).join('')}</div>` : ''}
            ${futureGoals ? `<p class="research-statement">${escapeHtml(futureGoals)}</p>` : ''}
        `;
    }

    function renderPublications(data) {
        const section = document.getElementById('publications');
        if (!section) return;

        const publications = Array.isArray(data.research) ? data.research : [];
        section.innerHTML = `
            <h2 class="section-title">Publications</h2>
            <ol class="pub-list">
                ${publications.map((paper) => {
                    const venue = [paper.publication, paper.date].filter(Boolean).join(' · ');
                    const tldr = paper.tldr || paper.description || '';
                    return `
                        <li class="pub-item">
                            <div class="pub-title">${escapeHtml(paper.title || '')}</div>
                            ${tldr ? `<div class="pub-tldr">TL;DR - ${escapeHtml(tldr)}</div>` : ''}
                            ${venue ? `<div class="pub-venue">${escapeHtml(venue)}</div>` : ''}
                            ${paper.authors ? `<div class="pub-authors">${escapeHtml(paper.authors)}</div>` : ''}
                            ${paper.yourRole ? `<span class="pub-role">${escapeHtml(paper.yourRole)}</span>` : ''}
                            ${paper.url ? `<div class="pub-links"><a href="${escapeAttr(sanitizeUrl(paper.url, '#'))}" class="pub-link" target="_blank" rel="noopener noreferrer">View Paper</a></div>` : ''}
                        </li>
                    `;
                }).join('')}
            </ol>
        `;
    }

    function renderExperience(data) {
        const section = document.getElementById('experience');
        if (!section) return;

        const items = (Array.isArray(data.experience) ? data.experience : []).filter(isResearchExperience);
        const visible = items.slice(0, 3);
        const hidden = items.slice(3);

        section.innerHTML = `
            <h2 class="section-title">Research Experience</h2>
            <ul class="exp-list">
                ${visible.map(renderExperienceItem).join('')}
            </ul>
            ${hidden.length ? `<ul class="exp-list" id="exp-more-items" style="display: none;">${hidden.map(renderExperienceItem).join('')}</ul>` : ''}
            ${renderShowMoreButton(hidden.length, 'exp-more-items', items.length)}
        `;
    }

    function renderExperienceItem(item) {
        const bullets = Array.isArray(item.responsibilities) ? item.responsibilities : [];
        return `
            <li class="exp-item">
                <div class="exp-header">
                    <span class="exp-title">${escapeHtml(item.title || '')}</span>
                    <span class="exp-period">${escapeHtml(item.period || '')}</span>
                </div>
                <div class="exp-org">${escapeHtml(item.company || '')}</div>
                ${bullets.length ? `<ul class="exp-details">${bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>` : ''}
            </li>
        `;
    }

    function renderEducation(data) {
        const section = document.getElementById('education');
        if (!section) return;

        const items = Array.isArray(data.education) ? data.education : [];
        section.innerHTML = `
            <h2 class="section-title">Education</h2>
            <ul class="edu-list">
                ${items.map((item) => `
                    <li class="edu-item">
                        <div class="edu-header">
                            <span class="edu-institution">${escapeHtml(item.institution || '')}</span>
                            <span class="edu-period">${escapeHtml(formatPeriod(item.period || ''))}</span>
                        </div>
                        <div class="edu-degree">${escapeHtml(item.degree || '')}</div>
                        ${item.grade ? `<div class="edu-grade">${escapeHtml(item.grade)}</div>` : ''}
                    </li>
                `).join('')}
            </ul>
        `;
    }

    function renderTeaching(data) {
        const section = document.getElementById('teaching');
        if (!section) return;

        const serviceFromExperience = (Array.isArray(data.experience) ? data.experience : [])
            .filter((item) => !isResearchExperience(item))
            .map((item) => ({
                role: item.title || '',
                period: item.period || '',
                org: item.company || '',
                description: (Array.isArray(item.responsibilities) ? item.responsibilities : []).join(' ')
            }));

        const serviceFromVolunteering = (Array.isArray(data.volunteering) ? data.volunteering : []).map((item) => ({
            role: item.role || '',
            period: item.period || '',
            org: item.organization || '',
            description: [item.description, item.impact ? `Impact: ${item.impact}` : ''].filter(Boolean).join(' ')
        }));

        const items = serviceFromExperience.concat(serviceFromVolunteering);
        const visible = items.slice(0, 3);
        const hidden = items.slice(3);

        section.innerHTML = `
            <h2 class="section-title">Teaching &amp; Service</h2>
            <ul class="service-list">
                ${visible.map(renderServiceItem).join('')}
            </ul>
            ${hidden.length ? `<ul class="service-list" id="service-more-items" style="display: none;">${hidden.map(renderServiceItem).join('')}</ul>` : ''}
            ${renderShowMoreButton(hidden.length, 'service-more-items', items.length)}
        `;
    }

    function renderServiceItem(item) {
        return `
            <li class="service-item">
                <div class="service-header">
                    <span class="service-role">${escapeHtml(item.role)}</span>
                    <span class="service-period">${escapeHtml(item.period)}</span>
                </div>
                <div class="service-org">${escapeHtml(item.org)}</div>
                <p class="service-description">${escapeHtml(item.description)}</p>
            </li>
        `;
    }

    function renderProjects(data) {
        const section = document.getElementById('projects');
        if (!section) return;

        const items = Array.isArray(data.projects) ? data.projects : [];
        const visible = items.slice(0, 3);
        const hidden = items.slice(3);

        section.innerHTML = `
            <h2 class="section-title">Selected Projects</h2>
            <ul class="project-list">
                ${visible.map(renderProjectItem).join('')}
            </ul>
            ${hidden.length ? `<div id="projects-more-items" style="display: none;"><ul class="project-list">${hidden.map(renderProjectItem).join('')}</ul></div>` : ''}
            ${renderShowMoreButton(hidden.length, 'projects-more-items', items.length)}
        `;
    }

    function renderProjectItem(project) {
        const technologies = Array.isArray(project.technologies) ? project.technologies : [];
        const title = escapeHtml(project.title || '');
        const projectTitle = project.githubUrl
            ? `<a href="${escapeAttr(sanitizeUrl(project.githubUrl, '#'))}" target="_blank" rel="noopener noreferrer">${title}</a>`
            : title;

        return `
            <li class="project-item">
                <div class="project-title">${projectTitle}</div>
                ${project.description ? `<p class="project-desc">${escapeHtml(project.description)}</p>` : ''}
                ${technologies.length ? `<div class="project-tech">${technologies.map((tech) => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('')}</div>` : ''}
            </li>
        `;
    }

    function renderHonors(data) {
        const section = document.getElementById('honors');
        if (!section) return;

        const achievements = data.achievements || {};
        const academic = Array.isArray(achievements.academic) ? achievements.academic : [];
        const competitions = Array.isArray(achievements.competitions) ? achievements.competitions : [];
        const leadership = Array.isArray(achievements.leadership) ? achievements.leadership : [];
        const hasMore = competitions.length || leadership.length;

        section.innerHTML = `
            <h2 class="section-title">Honors &amp; Awards</h2>
            <div class="honors-group">
                <div class="honors-group-title">Academic</div>
                <ul class="honors-list">
                    ${academic.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
                </ul>
            </div>
            ${hasMore ? `
                <div class="honors-group" id="honors-more-items" style="display: none;">
                    ${competitions.length ? `
                        <div class="honors-group-title">Competitions</div>
                        <ul class="honors-list">
                            ${competitions.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
                        </ul>
                    ` : ''}
                    ${leadership.length ? `
                        <div class="honors-group-title" style="margin-top: 1.2rem;">Leadership &amp; Recognition</div>
                        <ul class="honors-list">
                            ${leadership.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            ` : ''}
            ${renderShowMoreButton(hasMore, 'honors-more-items', academic.length + competitions.length + leadership.length)}
        `;
    }

    function renderCertifications(data) {
        const section = document.getElementById('certifications');
        if (!section) return;

        const items = Array.isArray(data.certifications) ? data.certifications : [];
        const visible = items.slice(0, 3);
        const hidden = items.slice(3);

        section.innerHTML = `
            <h2 class="section-title">Certifications</h2>
            <ul class="cert-list">
                ${visible.map(renderCertificationItem).join('')}
            </ul>
            ${hidden.length ? `<div id="cert-more-items" style="display: none;"><ul class="cert-list">${hidden.map(renderCertificationItem).join('')}</ul></div>` : ''}
            ${renderShowMoreButton(hidden.length, 'cert-more-items', items.length)}
        `;
    }

    function renderCertificationItem(item) {
        return `
            <li class="cert-item">
                <span class="cert-name">${escapeHtml(item.name || '')}</span>
                <span class="cert-date">${escapeHtml(item.date || '')}</span>
            </li>
        `;
    }

    function renderSkills(data) {
        const section = document.getElementById('skills');
        if (!section) return;

        const skills = Array.isArray(data.skills) ? data.skills : [];
        section.innerHTML = `
            <h2 class="section-title">Skills</h2>
            <div class="skills-compact">
                ${skills.map((skill) => `
                    <div class="skill-category">
                        <span class="skill-label">${escapeHtml(skill.category || 'Skills')}:</span> ${escapeHtml(skill.items || '')}
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderBlogs(data) {
        const section = document.getElementById('blogs');
        if (!section) return;

        const items = Array.isArray(data.blogs) ? data.blogs : [];
        const visible = items.slice(0, 3);
        const hidden = items.slice(3);

        section.innerHTML = `
            <h2 class="section-title">Writing</h2>
            <ul class="blog-list">
                ${visible.map(renderBlogItem).join('')}
            </ul>
            ${hidden.length ? `<ul class="blog-list" id="blog-more-items" style="display: none;">${hidden.map(renderBlogItem).join('')}</ul>` : ''}
            ${renderShowMoreButton(hidden.length, 'blog-more-items', items.length)}
        `;
    }

    function renderBlogItem(item) {
        return `
            <li class="blog-item">
                <a href="${escapeAttr(sanitizeUrl(item.url, '#'))}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title || '')}</a>
                ${item.date ? `<span class="blog-date">${escapeHtml(item.date)}</span>` : ''}
            </li>
        `;
    }

    function renderCyberArena(data) {
        const section = document.getElementById('cyber-arena');
        if (!section) return;

        const arena = data.cyberArena || {};
        const platforms = Array.isArray(arena.platforms) ? arena.platforms : [];
        section.innerHTML = `
            <h2 class="section-title">Cyber Arena</h2>
            <div class="arena-compact">
                ${arena.intro ? `<p>${escapeHtml(arena.intro)}</p>` : ''}
                <div class="arena-badges">
                    ${platforms.map((platform) => {
                        const highlights = nonEmptyStrings(platform.highlights).slice(0, 2).join(', ');
                        const summary = highlights ? ` - ${escapeHtml(highlights)}` : '';
                        const label = platform.url
                            ? `<a href="${escapeAttr(sanitizeUrl(platform.url, '#'))}" target="_blank" rel="noopener noreferrer"><strong>${escapeHtml(platform.name || '')}</strong></a>`
                            : `<strong>${escapeHtml(platform.name || '')}</strong>`;
                        return `<span class="arena-badge">${label}${summary}</span>`;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function renderScratchpad(data) {
        const section = document.getElementById('scratchpad');
        if (!section) return;

        const scratchpad = data.scratchpad || {};
        const linkText = scratchpad.linkText || 'Read more';
        const linkMarkup = scratchpad.url
            ? `<a href="${escapeAttr(sanitizeUrl(scratchpad.url, '#'))}" class="scratchpad-link" target="_blank" rel="noopener noreferrer">${escapeHtml(linkText)} &rarr;</a>`
            : '';

        section.innerHTML = `
            <div class="scratchpad-card">
                <div class="scratchpad-title">The Scratchpad</div>
                ${scratchpad.intro ? `<p class="scratchpad-text">${escapeHtml(scratchpad.intro)}</p>` : ''}
                ${linkMarkup}
            </div>
        `;
    }

    function renderContact(data) {
        const section = document.getElementById('contact');
        if (!section) return;

        const contact = data.contact || {};
        const emails = orderContactEmails(Array.isArray(contact.emails) ? contact.emails : []);
        const phoneItem = contact.phone ? `<li><a href="tel:${escapeAttr(contact.phone.replace(/\s+/g, ''))}">${escapeHtml(contact.phone)}</a></li>` : '';
        const calendlyItem = contact.calendlyUrl
            ? `<li><a href="${escapeAttr(sanitizeUrl(contact.calendlyUrl, '#'))}" target="_blank" rel="noopener noreferrer">Schedule a conversation &rarr;</a></li>`
            : '';

        section.innerHTML = `
            <h2 class="section-title">Contact</h2>
            ${contact.description ? `<p class="contact-text">${escapeHtml(contact.description)}</p>` : ''}
            <ul class="contact-links">
                ${emails.map((email, index) => `<li${index === 0 ? ' class="contact-email"' : ''}><a href="mailto:${escapeAttr(email)}">${escapeHtml(email)}</a></li>`).join('')}
                ${phoneItem}
                ${calendlyItem}
            </ul>
        `;
    }

    function renderFooter(data) {
        const footer = document.querySelector('.classic-footer');
        if (!footer) return;

        const footerData = data.footer || {};
        const classicText = footerData.classicText || footerData.text || '';
        const copyright = footerData.copyright ? footerData.copyright : '';
        const lastUpdated = formatLastUpdated(data.footer && data.footer.lastUpdated ? data.footer.lastUpdated : '');
        footer.innerHTML = [classicText, copyright, lastUpdated]
            .filter(Boolean)
            .map((item) => `<span>${escapeHtml(item)}</span>`)
            .join('');
    }

    function applyClassicLayoutOptions(data) {
        const classic = data.classic || {};
        const printHeader = classic.printHeader || [data.personal && data.personal.name, data.personal && data.personal.title].filter(Boolean).join(' | ');
        const contentInner = document.querySelector('.content-inner');

        if (contentInner) {
            contentInner.setAttribute('data-print-header', printHeader);
        }

        toggleSectionVisibility('cyber-arena', classic.showCyberArena !== false);
        toggleSectionVisibility('scratchpad', classic.showScratchpad !== false);
    }

    function toggleSectionVisibility(sectionId, shouldShow) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.hidden = !shouldShow;
        }

        const navLink = document.querySelector(`.sidebar-nav a[href="#${sectionId}"]`);
        if (navLink) {
            const listItem = navLink.closest('li');
            if (listItem) {
                listItem.hidden = !shouldShow;
            }
        }
    }

    function buildSidebarLinks(data) {
        const links = [];
        const socialLinks = Array.isArray(data.socialLinks) ? data.socialLinks : [];

        SIDEBAR_PLATFORM_ORDER.forEach((platformName) => {
            const match = socialLinks.find((item) => normalize(item.platform) === normalize(platformName));
            if (match) {
                links.push({ label: match.platform, url: match.url });
            }
        });

        const primaryEmail = getPrimaryAcademicEmail(Array.isArray(data.contact && data.contact.emails) ? data.contact.emails : []);
        if (primaryEmail) {
            links.push({ label: primaryEmail, url: `mailto:${primaryEmail}` });
        }

        return links;
    }

    function findSocialLink(data, platformName) {
        const socialLinks = Array.isArray(data.socialLinks) ? data.socialLinks : [];
        return socialLinks.find((item) => normalize(item.platform) === normalize(platformName)) || null;
    }

    function buildHeroSummary(data) {
        const summary = [];
        const seekingText = data.classic && data.classic.seekingText ? data.classic.seekingText : '';
        const researchAreas = nonEmptyStrings(data.researchInterests && data.researchInterests.areas).slice(0, 4);

        if (seekingText) {
            summary.push(seekingText);
        }

        if (researchAreas.length) {
            summary.push(`Research focus: ${researchAreas.join(', ')}.`);
        }

        return summary.join(' ');
    }

    function buildMetaDescription(data) {
        const summary = buildHeroSummary(data);
        if (summary) return summary;

        const statement = data.researchInterests && data.researchInterests.statement ? plainText(data.researchInterests.statement) : '';
        return statement || 'Academic cybersecurity portfolio with research, publications, and current contact information.';
    }

    function isResearchExperience(item) {
        const haystack = `${item && item.title ? item.title : ''} ${item && item.company ? item.company : ''}`.toLowerCase();
        if (haystack.includes('white hat hackers club') || haystack.includes('technical chair') || haystack.includes('peer mentor') || haystack.includes('teaching assistant')) {
            return false;
        }

        return haystack.includes('research') || haystack.includes('security lab') || haystack.includes('srg lab');
    }

    function renderShowMoreButton(hiddenCount, targetId, totalCount) {
        if (!hiddenCount) return '';
        return `<button class="show-more-btn" data-target="${targetId}">Show all (${totalCount}) <span class="arrow">&darr;</span></button>`;
    }

    function orderContactEmails(emails) {
        return [...emails].sort((a, b) => scoreAcademicEmail(b) - scoreAcademicEmail(a));
    }

    function getPrimaryAcademicEmail(emails) {
        const ordered = orderContactEmails(emails);
        return ordered.length ? ordered[0] : '';
    }

    function scoreAcademicEmail(email) {
        return /iitp\.ac\.in$/i.test(email) ? 2 : 1;
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function nonEmptyStrings(items) {
        return Array.isArray(items) ? items.map((item) => String(item || '').trim()).filter(Boolean) : [];
    }

    function formatPeriod(period) {
        return String(period || '').replace(/-/g, ' - ');
    }

    function formatLastUpdated(value) {
        if (!value) return '';
        return /^last updated/i.test(value) ? value : `Last updated ${value}`;
    }

    function plainText(value) {
        return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function sanitizeUrl(value, fallback) {
        const candidate = String(value || '').trim();
        if (!candidate) return fallback || '#';

        if (candidate.startsWith('#') || candidate.startsWith('./') || candidate.startsWith('../') || candidate.startsWith('/')) {
            return candidate;
        }

        if (/^(mailto:|tel:|https?:)/i.test(candidate)) {
            return candidate;
        }

        return fallback || '#';
    }

    function sanitizeRichText(value) {
        const template = document.createElement('template');
        template.innerHTML = String(value || '');
        const allowedTags = new Set(['A', 'B', 'BR', 'CODE', 'EM', 'I', 'SPAN', 'STRONG']);

        const walk = (node) => {
            Array.from(node.children).forEach((child) => {
                if (!allowedTags.has(child.tagName)) {
                    child.replaceWith(document.createTextNode(child.textContent || ''));
                    return;
                }

                Array.from(child.attributes).forEach((attr) => {
                    const attrName = attr.name.toLowerCase();
                    if (child.tagName === 'A' && attrName === 'href') {
                        child.setAttribute('href', sanitizeUrl(attr.value, '#'));
                        return;
                    }

                    if (child.tagName === 'A' && (attrName === 'target' || attrName === 'rel')) {
                        return;
                    }

                    child.removeAttribute(attr.name);
                });

                if (child.tagName === 'A') {
                    child.setAttribute('rel', 'noopener noreferrer');
                    if ((child.getAttribute('href') || '').startsWith('mailto:')) {
                        child.removeAttribute('target');
                    } else {
                        child.setAttribute('target', '_blank');
                    }
                }

                walk(child);
            });
        };

        walk(template.content);
        return template.innerHTML;
    }

    function setMetaContent(id, value) {
        const node = document.getElementById(id);
        if (node && value) {
            node.setAttribute('content', value);
        }
    }

    function setClassicStatus(message, type) {
        const status = document.querySelector('[data-classic-status]');
        if (!status) return;

        status.classList.remove('classic-status-error');

        if (!message) {
            status.hidden = true;
            return;
        }

        status.hidden = false;
        status.textContent = message;

        if (type === 'error') {
            status.classList.add('classic-status-error');
        }
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function escapeAttr(value) {
        return escapeHtml(value);
    }

    function initInteractions() {
        initShowMoreButtons();
        initNavHighlight();
        initMobileMenu();
        initModeSwitch();
        initSectionReveal();
    }

    function initShowMoreButtons() {
        document.querySelectorAll('.show-more-btn').forEach((btn) => {
            const targetId = btn.dataset.target;
            const targetIds = btn.dataset.targets;
            const targets = [];
            const arrow = btn.querySelector('.arrow');

            if (arrow) {
                arrow.textContent = 'v';
            }

            if (targetId) {
                const target = document.getElementById(targetId);
                if (target) targets.push(target);
            }

            if (targetIds) {
                targetIds.split(',').forEach((id) => {
                    const target = document.getElementById(id.trim());
                    if (target) targets.push(target);
                });
            }

            if (!targets.length) return;

            const labelNode = btn.childNodes[0];
            const originalText = labelNode && labelNode.textContent ? labelNode.textContent.trim() : 'Show all';

            btn.addEventListener('click', () => {
                const isHidden = targets[0].style.display === 'none';

                if (isHidden) {
                    targets.forEach((target) => {
                        target.style.display = '';
                        target.style.opacity = '0';
                        target.style.transform = 'translateY(-8px)';
                        requestAnimationFrame(() => {
                            target.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                            target.style.opacity = '1';
                            target.style.transform = 'translateY(0)';
                        });
                    });
                    btn.querySelector('.arrow').textContent = '▴';
                    if (arrow) arrow.textContent = '^';
                    if (labelNode) labelNode.textContent = 'Show less ';
                    btn.classList.add('expanded');
                } else {
                    targets.forEach((target) => {
                        target.style.opacity = '0';
                        target.style.transform = 'translateY(-8px)';
                        setTimeout(() => {
                            target.style.display = 'none';
                            target.style.transition = '';
                            target.style.opacity = '';
                            target.style.transform = '';
                        }, 300);
                    });
                    btn.querySelector('.arrow').textContent = '▾';
                    if (arrow) arrow.textContent = 'v';
                    if (labelNode) labelNode.textContent = `${originalText} `;
                    btn.classList.remove('expanded');
                }
            });
        });
    }

    function initNavHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.sidebar-nav a');
        if (!sections.length || !navLinks.length) return;

        function highlightNav() {
            const scrollPos = window.scrollY + 120;
            let currentId = '';

            sections.forEach((section) => {
                if (section.offsetTop <= scrollPos) {
                    currentId = section.id;
                }
            });

            navLinks.forEach((link) => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;

            requestAnimationFrame(() => {
                highlightNav();
                ticking = false;
            });
            ticking = true;
        });

        highlightNav();
    }

    function initMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        const navLinks = document.querySelectorAll('.sidebar-nav a');

        if (!menuBtn || !sidebar || !overlay) return;

        menuBtn.setAttribute('aria-expanded', 'false');

        function toggleMenu() {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', sidebar.classList.contains('open'));
        }

        function closeMenu() {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
        }

        menuBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 860) {
                    closeMenu();
                }
            });
        });
    }

    function initModeSwitch() {
        const switchBtn = document.getElementById('switch-to-nerd');
        if (!switchBtn) return;

        switchBtn.addEventListener('click', (event) => {
            event.preventDefault();
            sessionStorage.setItem('portfolio-session-active', 'true');
            window.location.href = 'index.html';
        });
    }

    function initSectionReveal() {
        if (!('IntersectionObserver' in window)) return;

        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.style.animationDelay = '0.1s';
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        sections.forEach((section) => {
            section.style.opacity = '0';
            section.style.animation = 'none';
            observer.observe(section);
        });

        if (!document.getElementById('classic-reveal-style')) {
            const style = document.createElement('style');
            style.id = 'classic-reveal-style';
            style.textContent = `
                section.revealed {
                    animation: sectionIn 0.5s ease-out forwards !important;
                    opacity: 1 !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
})();
