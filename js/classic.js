/**
 * Classic Mode — Minimal JavaScript
 * Handles: show-more toggles, active nav, mobile menu, mode switching
 */

(function () {
    'use strict';

    // ─── Show More / Collapse Toggles ───

    document.querySelectorAll('.show-more-btn').forEach(btn => {
        const targetId = btn.dataset.target;
        const targetIds = btn.dataset.targets;
        
        // Collect all target elements
        let targets = [];
        if (targetId) {
            const el = document.getElementById(targetId);
            if (el) targets.push(el);
        }
        if (targetIds) {
            targetIds.split(',').forEach(id => {
                const el = document.getElementById(id.trim());
                if (el) targets.push(el);
            });
        }
        
        if (targets.length === 0) return;

        // Store original text
        const originalText = btn.childNodes[0].textContent.trim();

        btn.addEventListener('click', () => {
            const isHidden = targets[0].style.display === 'none';

            if (isHidden) {
                targets.forEach(target => {
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
                btn.childNodes[0].textContent = 'Show less ';
                btn.classList.add('expanded');
            } else {
                targets.forEach(target => {
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
                btn.childNodes[0].textContent = originalText + ' ';
                btn.classList.remove('expanded');
            }
        });
    });

    // ─── Active Nav Highlight on Scroll ───

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    function highlightNav() {
        const scrollPos = window.scrollY + 120;

        let currentId = '';
        sections.forEach(section => {
            if (section.offsetTop <= scrollPos) {
                currentId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentId) {
                link.classList.add('active');
            }
        });
    }

    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                highlightNav();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial highlight
    highlightNav();

    // ─── Mobile Menu ───

    const menuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    function toggleMenu() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('open');

        // Update aria
        const isOpen = sidebar.classList.contains('open');
        menuBtn.setAttribute('aria-expanded', isOpen);
    }

    function closeMenu() {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMenu);
    }

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    // Close menu on nav click (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 860) {
                closeMenu();
            }
        });
    });

    // ─── Mode Switching ───

    const switchBtn = document.getElementById('switch-to-nerd');
    if (switchBtn) {
        switchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('portfolio-mode');
            window.location.href = 'entrance.html';
        });
    }

    // ─── Smooth section reveal on scroll ───

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = '0.1s';
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        sections.forEach((section, i) => {
            section.style.opacity = '0';
            section.style.animation = 'none';
            observer.observe(section);
        });
    }

    // Add revealed animation
    const style = document.createElement('style');
    style.textContent = `
        section.revealed {
            animation: sectionIn 0.5s ease-out forwards !important;
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);

})();
