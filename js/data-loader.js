/**
 * Portfolio Data Loader
 * Loads and renders the shared portfolio JSON for the nerd-mode page.
 */

class PortfolioLoader {
    constructor() {
        this.data = null;
        this.dataUrl = 'data/portfolio-data.json';
        this.previewOrigin = window.location.origin && window.location.origin !== 'null'
            ? window.location.origin
            : null;
    }

    async init() {
        try {
            await this.loadData();
            this.applyData(this.data);
            console.log('%c[Portfolio] %cData loaded successfully!', 'color: #4dfcff; font-weight: bold;', 'color: white;');
        } catch (error) {
            console.error('[Portfolio] Error loading data:', error);
        }
    }

    async loadData() {
        const isPreviewMode = new URLSearchParams(window.location.search).get('preview') === '1';
        if (isPreviewMode) {
            const previewData = sessionStorage.getItem('portfolio-preview-data');
            if (previewData) {
                try {
                    this.data = JSON.parse(previewData);
                    return;
                } catch (e) {
                    console.error('[Portfolio] Failed to parse preview data', e);
                }
            }
        }

        const response = await fetch(`${this.dataUrl}?t=${Date.now()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.data = await response.json();
    }

    applyData(nextData) {
        this.data = this.cloneData(nextData);
        window.portfolioData = this.data;
        this.renderAll();
        this.notifyConsumers();
        this.runPostRenderInitializers();
    }

    renderAll() {
        this.renderDocumentMeta();
        this.renderPersonalInfo();
        this.renderAbout();
        this.renderResearch();
        this.renderEducation();
        this.renderExperience();
        this.renderSkills();
        this.renderProjects();
        this.renderBlogs();
        this.renderCyberArena();
        this.renderScratchpad();
        this.renderCertifications();
        this.renderAchievements();
        this.renderVolunteering();
        this.renderContact();
        this.renderSocialLinks();
        this.renderFooter();
    }

    renderDocumentMeta() {
        const personal = this.data.personal || {};
        const title = personal.name && personal.title
            ? `${personal.name} | ${personal.title}`
            : personal.name || 'Portfolio';
        const description = this.buildNerdMetaDescription();

        document.title = title;
        this.setMetaContent('nerd-meta-description', description);
        this.setMetaContent('nerd-og-title', title);
        this.setMetaContent('nerd-og-description', description);
        this.setMetaContent('nerd-twitter-title', title);
        this.setMetaContent('nerd-twitter-description', description);

        const favicon = document.querySelector('link[rel="shortcut icon"]');
        if (favicon && personal.favicon) {
            favicon.href = this.sanitizeUrl(personal.favicon, './images/AsokaKrsna.ico');
        }
    }

    renderPersonalInfo() {
        const personal = this.data.personal || {};
        const nerd = this.data.nerd || {};
        const terminal = nerd.terminal || {};
        const rotatingTexts = this.nonEmptyStrings(nerd.sidebarRotatingTexts);
        const taglines = rotatingTexts.length ? rotatingTexts : this.nonEmptyStrings([personal.tagline]);

        const profileImg = document.querySelector('.profile-photo img');
        if (profileImg) {
            profileImg.src = this.sanitizeUrl(personal.profileImage, 'images/profile.png');
            profileImg.alt = personal.name ? `${personal.name} profile image` : 'Profile image';
        }

        const mobileProfileImg = document.querySelector('.mobile-profile-photo');
        if (mobileProfileImg) {
            mobileProfileImg.src = this.sanitizeUrl(personal.profileImage, 'images/profile.png');
        }
        const mobileProfileName = document.querySelector('.mobile-profile-name');
        if (mobileProfileName) {
            mobileProfileName.textContent = personal.name || '';
        }
        const mobileProfileTitle = document.querySelector('.mobile-profile-title');
        if (mobileProfileTitle) {
            mobileProfileTitle.textContent = personal.title || '';
        }

        const nameElement = document.querySelector('.logo.glitch-name');
        if (nameElement) {
            const displayName = personal.name || 'Portfolio';
            const alias = personal.alias || '';
            nameElement.textContent = displayName;
            nameElement.setAttribute('data-text', displayName);
            nameElement.setAttribute('data-name', displayName);
            nameElement.setAttribute('data-alias', alias);
        }

        const subtitleElement = document.querySelector('.subtitle');
        if (subtitleElement) {
            subtitleElement.textContent = personal.title || 'Loading profile...';
        }

        const taglineElement = document.getElementById('typingText');
        if (taglineElement) {
            taglineElement.textContent = taglines[0] || 'Loading profile...';
            taglineElement.setAttribute('data-rotating-texts', JSON.stringify(taglines));
        }

        document.querySelectorAll('.resume-button').forEach((button) => {
            button.href = this.sanitizeUrl(personal.resumeLink, '#');
        });

        const loaderTitle = document.getElementById('nerd-loader-title');
        if (loaderTitle) {
            loaderTitle.textContent = (nerd.loader && nerd.loader.title) || 'LOADING';
        }

        const loaderSubtitle = document.getElementById('nerd-loader-subtitle');
        if (loaderSubtitle) {
            loaderSubtitle.textContent = (nerd.loader && nerd.loader.subtitle) || 'Fetching portfolio...';
        }

        const terminalHostLabel = document.getElementById('terminalHostLabel');
        if (terminalHostLabel) {
            terminalHostLabel.textContent = `guest@${terminal.host || 'portfolio'} ~ `;
        }

        const terminalWelcome = document.getElementById('terminalWelcome');
        if (terminalWelcome) {
            terminalWelcome.textContent = terminal.welcome || "Welcome. Type 'help' for available commands.";
        }

        const statusBarBranch = document.getElementById('statusBarBranch');
        if (statusBarBranch) {
            statusBarBranch.textContent = terminal.branch || 'main';
        }
    }

    renderAbout() {
        const aboutContent = document.querySelector('#about .about-text');
        if (!aboutContent) return;

        const paragraphs = Array.isArray(this.data.about && this.data.about.paragraphs)
            ? this.data.about.paragraphs
            : [];

        aboutContent.innerHTML = paragraphs
            .map((paragraph) => `<p>${this.sanitizeRichText(paragraph)}</p>`)
            .join('');
    }

    renderResearch() {
        const researchInterests = this.data.researchInterests || {};
        const statementWrapper = document.querySelector('#research .research-statement-wrapper');
        if (statementWrapper) {
            const blocks = [];
            if (researchInterests.title) {
                blocks.push(`<div class="research-label">${this.escapeHtml(researchInterests.title)}</div>`);
            }
            if (researchInterests.statement) {
                blocks.push(`<div class="research-statement"><p>${this.escapeHtml(researchInterests.statement)}</p></div>`);
            }
            if (researchInterests.futureGoals) {
                blocks.push(`<p class="research-future">${this.escapeHtml(researchInterests.futureGoals)}</p>`);
            }
            statementWrapper.innerHTML = blocks.join('');
        }

        const researchContent = document.querySelector('#research .research-content');
        if (!researchContent) return;

        const researchItems = Array.isArray(this.data.research) ? this.data.research : [];
        researchContent.innerHTML = researchItems.map((paper) => {
            const paperUrl = this.sanitizeUrl(paper.url, '#');
            const roleTag = paper.yourRole
                ? `<span class="research-role-tag">${this.escapeHtml(paper.yourRole)}</span>`
                : '';

            return `
                <div class="research-item${paper.hidden ? ' hidden' : ''}">
                    <div class="research-meta">
                        <span class="research-year">${this.escapeHtml(paper.date || '')}</span> |
                        <span class="research-publication">${this.escapeHtml(paper.publication || '')}</span>
                        ${roleTag}
                    </div>
                    <h3 class="research-title">${this.escapeHtml(paper.title || '')}</h3>
                    <p class="research-tldr">${this.escapeHtml(paper.tldr || paper.description || '')}</p>
                    ${paperUrl !== '#'
                        ? `<a href="${this.escapeAttr(paperUrl)}" target="_blank" rel="noopener noreferrer" class="research-link"><i class="fas fa-external-link-alt"></i> View Paper</a>`
                        : ''
                    }
                </div>
            `;
        }).join('');
    }

    renderEducation() {
        const educationContent = document.querySelector('#education .education-content');
        if (!educationContent) return;

        const education = Array.isArray(this.data.education) ? this.data.education : [];
        educationContent.innerHTML = education.map((entry) => `
            <div class="education-item">
                <div class="education-header">
                    <h3>${this.escapeHtml(entry.institution || '')}</h3>
                    <div class="education-meta">
                        <span class="education-location">${this.escapeHtml(entry.location || '')}</span>
                        <span class="education-date">${this.escapeHtml([entry.grade, entry.period].filter(Boolean).join(' | '))}</span>
                    </div>
                </div>
                <p>${this.escapeHtml(entry.degree || '')}</p>
            </div>
        `).join('');
    }

    renderExperience() {
        const experienceContent = document.querySelector('#experience .experience-content');
        if (!experienceContent) return;

        const experience = Array.isArray(this.data.experience) ? this.data.experience : [];
        experienceContent.innerHTML = experience.map((entry) => `
            <div class="experience-item">
                <div class="experience-year">${this.escapeHtml(entry.period || '')}</div>
                <div class="experience-details">
                    <h3 class="experience-title">${this.escapeHtml(entry.title || '')}</h3>
                    <div class="experience-company">${this.escapeHtml([entry.company, entry.location].filter(Boolean).join(' | '))}</div>
                    <ul class="experience-description">
                        ${(Array.isArray(entry.responsibilities) ? entry.responsibilities : []).map((item) => `<li>${this.escapeHtml(item)}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    }

    renderSkills() {
        const skillsContent = document.querySelector('#skills .skills-content');
        if (!skillsContent) return;

        const skills = Array.isArray(this.data.skills) ? this.data.skills : [];
        skillsContent.innerHTML = skills.map((skill) => `
            <div class="skills-category">
                <h3><i class="${this.escapeAttr(skill.icon || '')}"></i>${this.escapeHtml(skill.category || '')}</h3>
                <div class="skills-list">${this.escapeHtml(skill.items || '')}</div>
            </div>
        `).join('');
    }

    renderProjects() {
        const projectsGrid = document.querySelector('#projects .projects-grid');
        if (!projectsGrid) return;

        const projects = Array.isArray(this.data.projects) ? this.data.projects : [];
        projectsGrid.innerHTML = projects.map((project) => {
            const githubUrl = this.sanitizeUrl(project.githubUrl, '#');
            const liveUrl = this.sanitizeUrl(project.liveUrl, '#');
            const title = this.escapeHtml(project.title || '');
            const titleMarkup = githubUrl !== '#'
                ? `<a href="${this.escapeAttr(githubUrl)}" target="_blank" rel="noopener noreferrer">${title}</a>`
                : title;

            return `
                <div class="project-card">
                    <div class="project-top">
                        <div class="folder-icon">
                            <i class="far fa-folder-open"></i>
                        </div>
                        <div class="project-links">
                            ${githubUrl !== '#'
                                ? `<a href="${this.escapeAttr(githubUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Open project source"><i class="fab fa-github"></i></a>`
                                : ''
                            }
                            ${liveUrl !== '#'
                                ? `<a href="${this.escapeAttr(liveUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Open live project"><i class="fas fa-external-link-alt"></i></a>`
                                : ''
                            }
                        </div>
                    </div>
                    <h3 class="project-title">${titleMarkup}</h3>
                    <div class="project-description">
                        <p>${this.escapeHtml(project.description || '')}</p>
                    </div>
                    <ul class="project-tech-list">
                        ${(Array.isArray(project.technologies) ? project.technologies : []).map((tech) => `<li>${this.escapeHtml(tech)}</li>`).join('')}
                    </ul>
                </div>
            `;
        }).join('');
    }

    renderBlogs() {
        const blogsGrid = document.querySelector('#blogs .blogs-grid');
        if (!blogsGrid) return;

        const blogs = Array.isArray(this.data.blogs) ? this.data.blogs : [];
        blogsGrid.innerHTML = blogs.map((blog) => `
            <div class="blog-card">
                <div class="blog-date">${this.escapeHtml(blog.date || '')}</div>
                <h3 class="blog-title">
                    <a href="${this.escapeAttr(this.sanitizeUrl(blog.url, '#'))}" target="_blank" rel="noopener noreferrer">${this.escapeHtml(blog.title || '')}<i class="fas fa-external-link-alt"></i></a>
                </h3>
            </div>
        `).join('');
    }

    renderCyberArena() {
        const arenaIntro = document.querySelector('.arena-intro');
        const arenaGrid = document.querySelector('.arena-grid');
        const arena = this.data.cyberArena || {};

        if (arenaIntro) {
            arenaIntro.textContent = arena.intro || '';
        }

        if (arenaGrid) {
            const platforms = Array.isArray(arena.platforms) ? arena.platforms : [];
            arenaGrid.innerHTML = platforms.map((platform) => {
                const platformUrl = this.sanitizeUrl(platform.url, '#');
                return `
                    <div class="arena-card">
                        <div class="arena-icon">
                            <i class="${this.escapeAttr(platform.icon || '')}"></i>
                        </div>
                        <h3 class="arena-title">${this.escapeHtml(platform.name || '')}</h3>
                        <ul class="arena-list">
                            ${this.nonEmptyStrings(platform.highlights).map((highlight) => `<li>${this.escapeHtml(highlight)}</li>`).join('')}
                        </ul>
                        ${platformUrl !== '#'
                            ? `<a href="${this.escapeAttr(platformUrl)}" target="_blank" rel="noopener noreferrer" class="arena-link">${this.escapeHtml(platform.linkText || 'Visit')} <i class="fas fa-arrow-right"></i></a>`
                            : ''
                        }
                    </div>
                `;
            }).join('');
        }
    }

    renderScratchpad() {
        const scratchpadCard = document.querySelector('#scratchpad .scratchpad-single-card');
        if (!scratchpadCard) return;

        const scratchpad = this.data.scratchpad || {};
        const linkMarkup = scratchpad.url
            ? `<a href="${this.escapeAttr(this.sanitizeUrl(scratchpad.url, '#'))}" target="_blank" rel="noopener noreferrer" class="scratchpad-link">${this.escapeHtml(scratchpad.linkText || 'Read more')} &rarr;</a>`
            : '';

        scratchpadCard.innerHTML = `
            <div class="scratchpad-title">The Scratchpad</div>
            ${scratchpad.intro ? `<p class="scratchpad-text">${this.escapeHtml(scratchpad.intro)}</p>` : ''}
            ${linkMarkup}
        `;
    }

    renderCertifications() {
        const certificationsTimeline = document.querySelector('#certifications .certifications-timeline');
        if (!certificationsTimeline) return;

        const certifications = Array.isArray(this.data.certifications) ? this.data.certifications : [];
        certificationsTimeline.innerHTML = certifications.map((certification) => `
            <div class="certification-item">
                <div class="certification-dot"></div>
                <div class="certification-content">
                    <h3 class="certification-title">${this.escapeHtml(certification.name || '')}</h3>
                    <div class="certification-date">${this.escapeHtml(certification.date || '')}</div>
                </div>
            </div>
        `).join('');
    }

    renderAchievements() {
        const achievementsTimeline = document.querySelector('#achievements .achievements-timeline');
        if (!achievementsTimeline) return;

        const achievements = this.data.achievements || {};
        const categories = [
            { key: 'academic', title: 'Academic Honors', icon: 'fas fa-graduation-cap' },
            { key: 'competitions', title: 'Competitions & Recognitions', icon: 'fas fa-trophy' },
            { key: 'leadership', title: 'Leadership & Service', icon: 'fas fa-users' }
        ];

        achievementsTimeline.innerHTML = categories.map((category) => `
            <div class="achievements-category">
                <h3 class="category-title"><i class="${category.icon}"></i> ${category.title}</h3>
                ${this.nonEmptyStrings(achievements[category.key]).map((achievement) => `
                    <div class="achievement-item">
                        <h4 class="achievement-title">${this.escapeHtml(achievement)}</h4>
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    renderVolunteering() {
        const volunteeringContent = document.querySelector('#volunteering .volunteering-content');
        if (!volunteeringContent) return;

        const volunteering = Array.isArray(this.data.volunteering) ? this.data.volunteering : [];
        volunteeringContent.innerHTML = volunteering.map((item) => `
            <div class="volunteering-item">
                <div class="volunteering-header">
                    <h3 class="volunteering-org">${this.escapeHtml(item.organization || '')}</h3>
                    <span class="volunteering-period">${this.escapeHtml(item.period || '')}</span>
                </div>
                <h4 class="volunteering-role">${this.escapeHtml(item.role || '')}</h4>
                <p class="volunteering-description">${this.escapeHtml(item.description || '')}</p>
                ${item.impact ? `<div class="volunteering-impact"><i class="fas fa-heart"></i> <strong>Impact:</strong> ${this.escapeHtml(item.impact)}</div>` : ''}
            </div>
        `).join('');
    }

    renderContact() {
        const contactSection = document.querySelector('#contact .container');
        if (!contactSection) return;

        const contact = this.data.contact || {};
        const contactDesc = contactSection.querySelector('p');
        if (contactDesc) {
            contactDesc.textContent = contact.description || '';
        }

        const contactInfo = contactSection.querySelector('.contact-info');
        if (contactInfo) {
            const contactItems = [];
            if (contact.phone) {
                contactItems.push(`
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span><a href="tel:${this.escapeAttr(contact.phone.replace(/\s+/g, ''))}">${this.escapeHtml(contact.phone)}</a></span>
                    </div>
                `);
            }

            (Array.isArray(contact.emails) ? contact.emails : []).forEach((email) => {
                contactItems.push(`
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span><a href="mailto:${this.escapeAttr(email)}">${this.escapeHtml(email)}</a></span>
                    </div>
                `);
            });

            contactInfo.innerHTML = contactItems.join('');
        }

        const calendlyBtn = contactSection.querySelector('.btn.primary');
        if (calendlyBtn) {
            if (contact.calendlyUrl) {
                calendlyBtn.href = this.sanitizeUrl(contact.calendlyUrl, '#');
                calendlyBtn.hidden = false;
            } else {
                calendlyBtn.hidden = true;
            }
        }
    }

    renderSocialLinks() {
        const socialLinks = Array.isArray(this.data.socialLinks) ? this.data.socialLinks : [];

        const sidebarSocial = document.querySelector('.sidebar-social ul');
        if (sidebarSocial) {
            sidebarSocial.innerHTML = socialLinks.map((link) => `
                <li>
                    <a href="${this.escapeAttr(this.sanitizeUrl(link.url, '#'))}" target="_blank" rel="noopener noreferrer" aria-label="${this.escapeAttr(link.platform || 'Social link')}" title="${this.escapeAttr(link.platform || 'Social link')}">
                        <i class="${this.escapeAttr(link.icon || '')}"></i>
                    </a>
                </li>
            `).join('');
        }

        const contactSocial = document.querySelector('#contact .social-links');
        if (contactSocial) {
            contactSocial.innerHTML = socialLinks.map((link) => `
                <a href="${this.escapeAttr(this.sanitizeUrl(link.url, '#'))}" target="_blank" rel="noopener noreferrer" aria-label="${this.escapeAttr(link.platform || 'Social link')}" title="${this.escapeAttr(link.platform || 'Social link')}">
                    <i class="${this.escapeAttr(link.icon || '')}"></i>
                </a>
            `).join('');
        }
    }

    renderFooter() {
        const footerContent = document.querySelector('footer .footer-content');
        if (!footerContent) return;

        const footer = this.data.footer || {};
        const footerText = footer.nerdText || footer.text || '';
        const footerLines = [
            footerText,
            footer.copyright,
            footer.lastUpdated ? `Last updated ${footer.lastUpdated}` : ''
        ].filter(Boolean);

        footerContent.innerHTML = footerLines
            .map((line) => `<p>${this.escapeHtml(line)}</p>`)
            .join('');
    }

    runPostRenderInitializers() {
        if (typeof initResearchLoadMore === 'function') {
            initResearchLoadMore();
        }
        if (typeof initProjectsLoadMore === 'function') {
            initProjectsLoadMore();
        }
        if (typeof initBlogViewMore === 'function') {
            initBlogViewMore();
        }
    }

    notifyConsumers() {
        if (typeof window.applyNerdModeData === 'function') {
            window.applyNerdModeData(this.data);
        }

        window.dispatchEvent(new CustomEvent('portfolio-data-updated', {
            detail: this.cloneData(this.data)
        }));
    }

    buildNerdMetaDescription() {
        const personal = this.data.personal || {};
        const classic = this.data.classic || {};
        const researchAreas = this.nonEmptyStrings(this.data.researchInterests && this.data.researchInterests.areas).slice(0, 4);
        const parts = [];

        if (personal.name && personal.title) {
            parts.push(`${personal.name} - ${personal.title}.`);
        } else if (personal.name) {
            parts.push(`${personal.name}.`);
        }

        if (classic.seekingText) {
            parts.push(`${classic.seekingText}.`);
        }

        if (researchAreas.length) {
            parts.push(`Research focus: ${researchAreas.join(', ')}.`);
        }

        return parts.join(' ').trim() || 'Cybersecurity portfolio rendered from shared JSON data.';
    }

    setMetaContent(id, value) {
        const node = document.getElementById(id);
        if (node && value) {
            node.setAttribute('content', value);
        }
    }

    escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    escapeAttr(value) {
        return this.escapeHtml(value);
    }

    sanitizeUrl(value, fallback = '#') {
        const url = String(value || '').trim();
        if (!url) return fallback;
        if (url === '#') return '#';
        if (/^(https?:|mailto:|tel:)/i.test(url)) return url;
        if (!/^[a-z]+:/i.test(url) && /^(?:\.{0,2}\/|[A-Za-z0-9_./-]+$)/.test(url)) return url;
        return fallback;
    }

    sanitizeRichText(value) {
        const template = document.createElement('template');
        template.innerHTML = String(value || '');

        const allowedTags = new Set(['A', 'STRONG', 'EM', 'B', 'I', 'BR', 'CODE', 'SPAN']);
        const allowedSpanClasses = new Set(['cmd-info', 'cmd-success', 'cmd-error']);

        const sanitizeNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                return document.createTextNode(node.textContent || '');
            }

            if (node.nodeType !== Node.ELEMENT_NODE) {
                return document.createDocumentFragment();
            }

            const tag = node.tagName.toUpperCase();
            if (!allowedTags.has(tag)) {
                const fragment = document.createDocumentFragment();
                Array.from(node.childNodes).forEach((child) => {
                    fragment.appendChild(sanitizeNode(child));
                });
                return fragment;
            }

            const element = document.createElement(tag.toLowerCase());

            if (tag === 'A') {
                const href = this.sanitizeUrl(node.getAttribute('href'), '#');
                element.setAttribute('href', href);
                if (/^https?:/i.test(href)) {
                    element.setAttribute('target', '_blank');
                    element.setAttribute('rel', 'noopener noreferrer');
                }
            }

            if (tag === 'SPAN') {
                const safeClasses = String(node.getAttribute('class') || '')
                    .split(/\s+/)
                    .filter((name) => allowedSpanClasses.has(name))
                    .join(' ');
                if (safeClasses) {
                    element.setAttribute('class', safeClasses);
                }
            }

            Array.from(node.childNodes).forEach((child) => {
                element.appendChild(sanitizeNode(child));
            });

            return element;
        };

        const wrapper = document.createElement('div');
        Array.from(template.content.childNodes).forEach((child) => {
            wrapper.appendChild(sanitizeNode(child));
        });
        return wrapper.innerHTML;
    }

    nonEmptyStrings(items) {
        return Array.isArray(items)
            ? items.map((item) => String(item || '').trim()).filter(Boolean)
            : [];
    }

    cloneData(value) {
        return JSON.parse(JSON.stringify(value || {}));
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    window.portfolioLoader = new PortfolioLoader();
    let pendingPreviewData = null;

    const applyPreviewData = (previewData) => {
        pendingPreviewData = previewData;
        window.portfolioLoader.applyData(previewData);
    };

    window.addEventListener('message', (event) => {
        if (window.portfolioLoader.previewOrigin && event.origin !== window.portfolioLoader.previewOrigin) {
            return;
        }

        if (event.data && event.data.type === 'livePreviewUpdate') {
            try {
                applyPreviewData(event.data.data);
                console.log('%c[Portfolio] %cLive preview updated!', 'color: #fca311; font-weight: bold;', 'color: white;');
            } catch (err) {
                console.error('[Portfolio] Error updating live preview:', err);
            }
        }
    });

    await window.portfolioLoader.init();

    if (pendingPreviewData) {
        window.portfolioLoader.applyData(pendingPreviewData);
    }
});
