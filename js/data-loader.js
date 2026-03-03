/**
 * Portfolio Data Loader
 * Dynamically loads and renders portfolio content from JSON data
 */

class PortfolioLoader {
    constructor() {
        this.data = null;
        this.dataUrl = 'data/portfolio-data.json';
    }

    /**
     * Initialize the portfolio by loading data and rendering all sections
     */
    async init() {
        try {
            await this.loadData();
            this.renderAll();
            
            // Initialize "See More" and "Load More" functionality after rendering
            if (typeof initResearchLoadMore === 'function') {
                initResearchLoadMore();
            }
            if (typeof initProjectsLoadMore === 'function') {
                initProjectsLoadMore();
            }
            if (typeof initBlogViewMore === 'function') {
                initBlogViewMore();
            }
            
            // Initialize collapsible section toggles
            this.initCollapseToggles();
            
            console.log('%c[Portfolio] %cData loaded successfully!', 'color: #4dfcff; font-weight: bold;', 'color: white;');
        } catch (error) {
            console.error('[Portfolio] Error loading data:', error);
        }
    }

    /**
     * Load portfolio data from JSON file
     */
    async loadData() {
        try {
            const response = await fetch(this.dataUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.data = await response.json();
        } catch (error) {
            console.error('Error loading portfolio data:', error);
            throw error;
        }
    }

    /**
     * Render all portfolio sections
     */
    renderAll() {
        this.renderPersonalInfo();
        this.renderAbout();
        this.renderResearchInterests();
        this.renderResearch();
        this.renderEducation();
        this.renderExperience();
        this.renderSkills();
        this.renderProjects();
        this.renderBlogs();
        this.renderCyberArena();
        this.renderCertifications();
        this.renderAchievements();
        this.renderVolunteering();
        this.renderContact();
        this.renderSocialLinks();
        this.renderFooter();
    }

    /**
     * Initialize collapsible section toggle buttons
     */
    initCollapseToggles() {
        document.querySelectorAll('.collapse-toggle').forEach(btn => {
            btn.addEventListener('click', function() {
                const container = this.closest('section').querySelector(this.dataset.container);
                if (!container) return;
                
                const hiddenItems = container.querySelectorAll('.collapsible-hidden');
                const isExpanded = this.classList.contains('expanded');
                
                if (isExpanded) {
                    // Collapse: hide items again
                    hiddenItems.forEach(item => {
                        item.style.maxHeight = item.scrollHeight + 'px';
                        requestAnimationFrame(() => {
                            item.style.maxHeight = '0';
                            item.style.opacity = '0';
                            item.style.marginTop = '0';
                            item.style.marginBottom = '0';
                            item.style.paddingTop = '0';
                            item.style.paddingBottom = '0';
                        });
                    });
                    this.classList.remove('expanded');
                    this.innerHTML = 'Show More <i class="fas fa-chevron-down"></i>';
                } else {
                    // Expand: reveal items
                    hiddenItems.forEach((item, i) => {
                        item.style.display = '';
                        item.style.maxHeight = '0';
                        item.style.opacity = '0';
                        requestAnimationFrame(() => {
                            item.style.transition = `all 0.4s ease ${i * 0.08}s`;
                            item.style.maxHeight = item.scrollHeight + 'px';
                            item.style.opacity = '1';
                            item.style.marginTop = '';
                            item.style.marginBottom = '';
                            item.style.paddingTop = '';
                            item.style.paddingBottom = '';
                        });
                        // Clean up after animation
                        setTimeout(() => { item.style.maxHeight = 'none'; }, 500 + i * 80);
                    });
                    this.classList.add('expanded');
                    this.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';
                }
            });
        });
    }

    /**
     * Render personal information (header, title, etc.)
     */
    renderPersonalInfo() {
        const { personal } = this.data;
        
        // Update page title
        document.title = `${personal.name} | ${personal.title}`;
        
        // Update favicon
        const favicon = document.querySelector('link[rel="shortcut icon"]');
        if (favicon) favicon.href = personal.favicon;
        
        // Update profile image
        const profileImg = document.querySelector('.profile-photo img');
        if (profileImg) {
            profileImg.src = personal.profileImage;
            profileImg.alt = personal.name;
        }
        
        // Update name and title in sidebar
        const nameElement = document.querySelector('.logo.glitch-name');
        if (nameElement) {
            nameElement.textContent = personal.name;
            nameElement.setAttribute('data-text', personal.name);
        }
        
        const subtitleElement = document.querySelector('.subtitle');
        if (subtitleElement) subtitleElement.textContent = personal.title;
        
        const taglineElement = document.getElementById('typingText');
        if (taglineElement) taglineElement.setAttribute('data-tagline', personal.tagline);
        
        // Update resume link
        const resumeButton = document.querySelector('.resume-button');
        if (resumeButton) resumeButton.href = personal.resumeLink;
    }

    /**
     * Render About section
     */
    renderAbout() {
        const aboutContent = document.querySelector('#about .about-text');
        if (!aboutContent) return;
        
        aboutContent.innerHTML = this.data.about.paragraphs
            .map(p => `<p>${p}</p>`)
            .join('');
    }

    /**
     * Render Research Interests section
     */
    renderResearchInterests() {
        const researchInterestsSection = document.querySelector('#research-interests');
        if (!researchInterestsSection) return;
        
        const { researchInterests } = this.data;
        const container = researchInterestsSection.querySelector('.container');
        
        if (container) {
            container.innerHTML = `
                <h2 class="section-title">Research Interests</h2>
                <div class="research-interests-content">
                    <div class="research-statement">
                        <p>${researchInterests.statement}</p>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Render Education section
     */
    renderEducation() {
        const educationContent = document.querySelector('#education .education-content');
        if (!educationContent) return;
        
        const visibleCount = 2;
        educationContent.innerHTML = this.data.education.map((edu, i) => `
            <div class="education-item${i >= visibleCount ? ' collapsible-hidden' : ''}">
                <div class="education-header">
                    <h3>${edu.institution}</h3>
                    <div class="education-meta">
                        <span class="education-location">${edu.location}</span>
                        <span class="education-date">${edu.grade} | ${edu.period}</span>
                    </div>
                </div>
                <p>${edu.degree}</p>
            </div>
        `).join('');
        
        if (this.data.education.length > visibleCount) {
            educationContent.insertAdjacentHTML('afterend', 
                `<div class="section-cta"><button class="btn small secondary collapse-toggle" data-section="education" data-container=".education-content" data-items=".education-item">Show More <i class="fas fa-chevron-down"></i></button></div>`);
        }
    }

    /**
     * Render Experience section
     */
    renderExperience() {
        const experienceContent = document.querySelector('#experience .experience-content');
        if (!experienceContent) return;
        
        const visibleCount = 3;
        experienceContent.innerHTML = this.data.experience.map((exp, i) => `
            <div class="experience-item${i >= visibleCount ? ' collapsible-hidden' : ''}">
                <div class="experience-year">${exp.period}</div>
                <div class="experience-details">
                    <h3 class="experience-title">${exp.title}</h3>
                    <div class="experience-company">${exp.company} | ${exp.location}</div>
                    <ul class="experience-description">
                        ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
        
        if (this.data.experience.length > visibleCount) {
            experienceContent.insertAdjacentHTML('afterend', 
                `<div class="section-cta"><button class="btn small secondary collapse-toggle" data-section="experience" data-container=".experience-content" data-items=".experience-item">Show More <i class="fas fa-chevron-down"></i></button></div>`);
        }
    }

    /**
     * Render Skills section
     */
    renderSkills() {
        const skillsContent = document.querySelector('#skills .skills-content');
        if (!skillsContent) return;
        
        skillsContent.innerHTML = this.data.skills.map(skill => `
            <div class="skills-category">
                <h3><i class="${skill.icon}"></i>${skill.category}</h3>
                <div class="skills-list">
                    ${skill.items}
                </div>
            </div>
        `).join('');
    }

    /**
     * Render Projects section
     */
    renderProjects() {
        const projectsGrid = document.querySelector('#projects .projects-grid');
        if (!projectsGrid) return;
        
        projectsGrid.innerHTML = this.data.projects.map(project => `
            <div class="project-card">
                <div class="project-top">
                    <div class="folder-icon">
                        <i class="far fa-folder-open"></i>
                    </div>
                    <div class="project-links">
                        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>
                        <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i></a>
                    </div>
                </div>
                <h3 class="project-title">
                    <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">${project.title}</a>
                </h3>
                <div class="project-description">
                    <p>${project.description}</p>
                </div>
                <ul class="project-tech-list">
                    ${project.technologies.map(tech => `<li>${tech}</li>`).join('')}
                </ul>
            </div>
        `).join('');
        // Ensure Load More button is visible if needed
        const loadMoreBtn = document.getElementById('load-more-projects');
        if (loadMoreBtn) {
            if (this.data.projects.length > 3) {
                loadMoreBtn.style.display = 'inline-block';
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
    }

    /**
     * Render Research section
     */
    renderResearch() {
        const researchContent = document.querySelector('#research .research-content');
        if (!researchContent) return;
        
        researchContent.innerHTML = this.data.research.map(paper => {
            const statusBadge = paper.type === 'in-progress' 
                ? `<span class="research-status in-progress"><i class="fas fa-flask"></i> ${paper.status || 'In Progress'}</span>`
                : `<span class="research-status published"><i class="fas fa-check-circle"></i> Published</span>`;
            
            const roleInfo = paper.yourRole 
                ? `<span class="research-role"><i class="fas fa-user-circle"></i> ${paper.yourRole}</span>`
                : '';
            
            const impactInfo = paper.impactArea
                ? `<span class="research-impact"><i class="fas fa-bullseye"></i> ${paper.impactArea}</span>`
                : '';
            
            return `
                <div class="research-item${paper.hidden ? ' hidden' : ''}">
                    <div class="research-meta">
                        <span class="research-year">${paper.date}</span> | <span class="research-publication">${paper.publication}</span>
                    </div>
                    <h3 class="research-title">${paper.title}</h3>
                    <div class="research-badges">
                        ${statusBadge}
                        ${roleInfo}
                        ${impactInfo}
                    </div>
                    <p class="research-description">
                        ${paper.description}
                    </p>
                    <i class="external-icon fas fa-external-link-alt"></i>
                    <div class="border-line"></div>
                    <a href="${paper.url}" ${paper.url !== '#' ? 'target="_blank" rel="noopener noreferrer"' : ''} class="card-link" aria-label="View paper"></a>
                </div>
            `;
        }).join('');
    }

    /**
     * Render Blogs section
     */
    renderBlogs() {
        const blogsGrid = document.querySelector('#blogs .blogs-grid');
        if (!blogsGrid) return;
        
        blogsGrid.innerHTML = this.data.blogs.map(blog => `
            <div class="blog-card">
                <div class="blog-date">${blog.date}</div>
                <h3 class="blog-title">
                    <a href="${blog.url}" target="_blank" rel="noopener noreferrer">${blog.title}<i class="fas fa-external-link-alt"></i></a>
                </h3>
            </div>
        `).join('');
    }

    /**
     * Render Cyber Arena section
     */
    renderCyberArena() {
        const arenaIntro = document.querySelector('.arena-intro');
        const arenaGrid = document.querySelector('.arena-grid');
        
        if (arenaIntro) {
            arenaIntro.textContent = this.data.cyberArena.intro;
        }
        
        if (arenaGrid) {
            arenaGrid.innerHTML = this.data.cyberArena.platforms.map(platform => `
                <div class="arena-card">
                    <div class="arena-icon">
                        <i class="${platform.icon}"></i>
                    </div>
                    <h3 class="arena-title">${platform.name}</h3>
                    <ul class="arena-list">
                        ${platform.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                    </ul>
                    <a href="${platform.url}" ${platform.url !== '#' ? 'target="_blank"' : ''} class="arena-link">${platform.linkText} <i class="fas fa-arrow-right"></i></a>
                </div>
            `).join('');
        }
    }

    /**
     * Render Certifications section
     */
    renderCertifications() {
        const certificationsTimeline = document.querySelector('#certifications .certifications-timeline');
        if (!certificationsTimeline) return;
        
        const visibleCount = 4;
        certificationsTimeline.innerHTML = this.data.certifications.map((cert, i) => `
            <div class="certification-item${i >= visibleCount ? ' collapsible-hidden' : ''}">
                <div class="certification-dot"></div>
                <div class="certification-content">
                    <h3 class="certification-title">${cert.name}</h3>
                    <div class="certification-date">${cert.date}</div>
                </div>
            </div>
        `).join('');
        
        if (this.data.certifications.length > visibleCount) {
            certificationsTimeline.insertAdjacentHTML('afterend', 
                `<div class="section-cta"><button class="btn small secondary collapse-toggle" data-section="certifications" data-container=".certifications-timeline" data-items=".certification-item">Show More <i class="fas fa-chevron-down"></i></button></div>`);
        }
    }

    /**
     * Render Achievements section
     */
    renderAchievements() {
        const achievementsTimeline = document.querySelector('#achievements .achievements-timeline');
        if (!achievementsTimeline) return;
        
        const { achievements } = this.data;
        
        const categories = [
            { key: 'academic', title: 'Academic Honors', icon: 'fas fa-graduation-cap' },
            { key: 'competitions', title: 'Competitions & Recognitions', icon: 'fas fa-trophy' },
            { key: 'leadership', title: 'Leadership & Service', icon: 'fas fa-users' }
        ];
        
        achievementsTimeline.innerHTML = categories.map((cat, i) => `
            <div class="achievements-category${i >= 1 ? ' collapsible-hidden' : ''}">
                <h3 class="category-title"><i class="${cat.icon}"></i> ${cat.title}</h3>
                ${achievements[cat.key].map(achievement => `
                    <div class="achievement-item">
                        <h4 class="achievement-title">${achievement}</h4>
                    </div>
                `).join('')}
            </div>
        `).join('');
        
        if (categories.length > 1) {
            achievementsTimeline.insertAdjacentHTML('afterend', 
                `<div class="section-cta"><button class="btn small secondary collapse-toggle" data-section="achievements" data-container=".achievements-timeline" data-items=".achievements-category">Show More <i class="fas fa-chevron-down"></i></button></div>`);
        }
    }

    /**
     * Render Volunteering section
     */
    renderVolunteering() {
        const volunteeringContent = document.querySelector('#volunteering .volunteering-content');
        if (!volunteeringContent) return;
        
        volunteeringContent.innerHTML = this.data.volunteering.map(vol => `
            <div class="volunteering-item">
                <div class="volunteering-header">
                    <h3 class="volunteering-org">${vol.organization}</h3>
                    <span class="volunteering-period">${vol.period}</span>
                </div>
                <h4 class="volunteering-role">${vol.role}</h4>
                <p class="volunteering-description">${vol.description}</p>
                <div class="volunteering-impact">
                    <i class="fas fa-heart"></i> <strong>Impact:</strong> ${vol.impact}
                </div>
            </div>
        `).join('');
    }

    /**
     * Render Contact section
     */
    renderContact() {
        const contactSection = document.querySelector('#contact .container');
        if (!contactSection) return;
        
        const { contact } = this.data;
        
        // Update contact description
        const contactDesc = contactSection.querySelector('p');
        if (contactDesc) contactDesc.textContent = contact.description;
        
        // Update contact info
        const contactInfo = contactSection.querySelector('.contact-info');
        if (contactInfo) {
            contactInfo.innerHTML = `
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>${contact.phone}</span>
                </div>
                ${contact.emails.map(email => `
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span><a href="mailto:${email}">${email}</a></span>
                    </div>
                `).join('')}
            `;
        }
        
        // Update Calendly link
        const calendlyBtn = contactSection.querySelector('.btn.primary');
        if (calendlyBtn) calendlyBtn.href = contact.calendlyUrl;
    }

    /**
     * Render Social Links
     */
    renderSocialLinks() {
        // Render in sidebar
        const sidebarSocial = document.querySelector('.sidebar-social ul');
        if (sidebarSocial) {
            sidebarSocial.innerHTML = this.data.socialLinks.map(link => `
                <li><a href="${link.url}" target="_blank" rel="noopener noreferrer"><i class="${link.icon}"></i></a></li>
            `).join('');
        }
        
        // Render in contact section
        const contactSocial = document.querySelector('#contact .social-links');
        if (contactSocial) {
            contactSocial.innerHTML = this.data.socialLinks.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer"><i class="${link.icon}"></i></a>
            `).join('');
        }
    }

    /**
     * Render Footer
     */
    renderFooter() {
        const footerContent = document.querySelector('footer .footer-content');
        if (!footerContent) return;
        
        footerContent.innerHTML = `
            <p>${this.data.footer.text}</p>
            <p>${this.data.footer.copyright}</p>
        `;
    }
}

// Initialize portfolio loader when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    window.portfolioLoader = new PortfolioLoader();
    await window.portfolioLoader.init();
});
