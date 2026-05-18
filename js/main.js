// Remove no-js class and add js-loaded class as soon as JavaScript runs
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js-loaded');

// Ensure consistent initialization
let hasInitialized = false;

// Safety timeout to make all content visible after 1 second regardless of other logic
setTimeout(() => {
    const allAnimElements = document.querySelectorAll('.animate-on-scroll');
    allAnimElements.forEach(el => {
        el.classList.add('visible');
    });
}, 1000);

// Add immediate mobile menu initializer to ensure it works regardless of other code
(function initializeMobileMenu() {
    const menuButton = document.querySelector('.menu-button');
    const sidebar = document.querySelector('.sidebar');
    const nav = document.querySelector('.nav');
    const navUl = document.querySelector('.nav ul');
    const navItems = document.querySelectorAll('.nav li');
    const sidebarHeader = document.querySelector('.sidebar-header');
    const logo = document.querySelector('.logo');
    const subtitle = document.querySelector('.subtitle');
    const sidebarSocial = document.querySelector('.sidebar-social');
    
    // Add mobile detection to body
    function handleMobileDetection() {
        if (window.innerWidth <= 768) {
            document.body.classList.add('is-mobile');
            
            // Make sure sidebar elements are ready for mobile
            if (sidebarHeader) sidebarHeader.style.display = 'flex';
            if (logo) logo.style.display = 'block';
            if (subtitle) subtitle.style.display = 'block';
        } else {
            document.body.classList.remove('is-mobile');
            // Make sure to clean up mobile state if resized to desktop
            if (sidebar) sidebar.classList.remove('active');
            if (menuButton) menuButton.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Reset any style changes
            if (sidebarHeader) sidebarHeader.style.display = '';
            if (logo) logo.style.display = '';
            if (subtitle) subtitle.style.display = '';
            if (sidebarSocial) sidebarSocial.style.display = '';
        }
    }
    
    // Run on load
    handleMobileDetection();
    
    // Run on resize
    window.addEventListener('resize', handleMobileDetection);
    
    if (menuButton && sidebar) {
        menuButton.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            menuButton.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Handle mobile view
            if (window.innerWidth <= 768) {
                if (sidebar.classList.contains('active')) {
                    // Force scroll to top on open
                    sidebar.scrollTop = 0;
                    
                    // Ensure sidebar is properly displayed
                    sidebar.style.display = 'flex';
                    sidebar.style.flexDirection = 'column';
                    sidebar.style.overflowY = 'auto';
                    
                    // Get sidebar content container
                    const sidebarContent = sidebar.querySelector('.sidebar-content');
                    if (sidebarContent) {
                        sidebarContent.style.display = 'flex';
                        sidebarContent.style.flexDirection = 'column';
                        sidebarContent.style.width = '100%';
                        sidebarContent.style.height = 'auto';
                        sidebarContent.style.padding = '0';
                    }
                    
                    // Position name at the top with reduced glitch effect
                    if (logo) {
                        logo.style.display = 'block';
                        logo.style.position = 'fixed';
                        logo.style.top = '20px';
                        logo.style.left = '20px';
                        logo.style.fontSize = '1.2rem';
                        logo.style.lineHeight = '1.2';
                        logo.style.zIndex = '10001';
                        logo.style.padding = '5px 10px';
                        logo.style.borderRadius = '4px';
                        logo.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
                        
                        // Apply dark theme styling
                        logo.style.backgroundColor = 'rgba(8, 15, 30, 0.85)';
                        logo.style.textShadow = '0 0 3px rgba(0, 255, 255, 0.3)';
                        logo.style.color = '#ffffff';
                        
                        // Disable glitch effect for mobile (created once, reused)
                        if (!document.getElementById('mobile-glitch-disable')) {
                            const beforePseudo = document.createElement('style');
                            beforePseudo.id = 'mobile-glitch-disable';
                            beforePseudo.innerHTML = `.sidebar.active .logo.glitch-name::before, .sidebar.active .logo.glitch-name::after { display: none !important; }`;
                            document.head.appendChild(beforePseudo);
                        }
                    }
                    
                    // MOBILE ONLY: Hide profile elements only in mobile view
                    const profilePhoto = sidebar.querySelector('.profile-photo');
                    if (profilePhoto && window.innerWidth <= 768) {
                        profilePhoto.style.display = 'none';
                        profilePhoto.style.opacity = '0';
                        profilePhoto.style.visibility = 'hidden';
                    }
                    
                    if (subtitle && window.innerWidth <= 768) {
                        subtitle.style.display = 'none';
                        subtitle.style.opacity = '0';
                        subtitle.style.visibility = 'hidden';
                    }
                    
                    const sidebarDescription = sidebar.querySelector('.sidebar-description');
                    if (sidebarDescription && window.innerWidth <= 768) {
                        sidebarDescription.style.display = 'none';
                        sidebarDescription.style.opacity = '0';
                        sidebarDescription.style.visibility = 'hidden';
                    }
                    
                    // Hide sidebar header except logo in mobile only
                    if (sidebarHeader && window.innerWidth <= 768) {
                        sidebarHeader.style.background = 'none';
                        sidebarHeader.style.boxShadow = 'none';
                        sidebarHeader.style.border = 'none';
                        sidebarHeader.style.padding = '0';
                        sidebarHeader.style.margin = '0';
                        
                        // Hide all children except logo
                        Array.from(sidebarHeader.children).forEach(child => {
                            if (!child.classList.contains('logo') && window.innerWidth <= 768) {
                                child.style.display = 'none';
                                child.style.opacity = '0';
                                child.style.visibility = 'hidden';
                            }
                        });
                    }
                    
                    // Set proper navigation padding
                    if (nav) {
                        nav.style.display = 'block';
                        nav.style.width = '100%';
                        nav.style.paddingTop = '80px';
                        nav.style.paddingBottom = '60px';
                        nav.style.margin = '0';
                    }
                    
                    // Ensure all navigation items are visible
                    if (navUl) {
                        navUl.style.display = 'block';
                        navUl.style.height = 'auto';
                        navUl.style.overflow = 'visible';
                        navUl.style.margin = '0';
                        navUl.style.padding = '0 1.5rem';
                    }
                    
                    // Make all nav items visible, with special attention to first items
                    navItems.forEach((item, index) => {
                        // Force display of all items
                        item.style.display = 'block';
                        item.style.opacity = '1';
                        item.style.visibility = 'visible';
                        item.style.transform = 'none';
                        item.style.position = 'static';
                        item.style.marginBottom = '15px';
                        item.style.pointerEvents = 'auto';
                        item.style.cursor = 'pointer';
                        
                        // Special emphasis on first few items
                        if (index === 0 || index === 1 || index === 2) {
                            const link = item.querySelector('a');
                            if (link) {
                                link.style.display = 'block';
                                link.style.visibility = 'visible';
                                link.style.opacity = '1';
                                link.style.color = 'var(--neon-blue)';
                                link.style.fontWeight = 'bold';
                                link.style.pointerEvents = 'auto';
                                link.style.cursor = 'pointer';
                                link.style.position = 'relative';
                                link.style.zIndex = '1005';
                            }
                        }
                    });
                    
                    // Hide social links in mobile view only
                    if (sidebarSocial && window.innerWidth <= 768) {
                        sidebarSocial.style.display = 'none';
                        sidebarSocial.style.opacity = '0';
                        sidebarSocial.style.visibility = 'hidden';
                    }
                    
                    // Hide any possible footer elements in mobile only
                    const sidebarFooter = sidebar.querySelector('.sidebar-footer');
                    if (sidebarFooter && window.innerWidth <= 768) {
                        sidebarFooter.style.display = 'none';
                        sidebarFooter.style.opacity = '0';
                        sidebarFooter.style.visibility = 'hidden';
                    }
                }
            } else {
                // If in desktop view, make sure styles are reset
            }
        });
        
        // Reset styles on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                // Reset styles for desktop view
                if (nav) nav.style = '';
                if (logo) logo.style = '';
                if (subtitle) subtitle.style = '';
                if (navUl) navUl.style = '';
                
                const profilePhoto = document.querySelector('.profile-photo');
                if (profilePhoto) profilePhoto.style = '';
                
                const sidebarDescription = document.querySelector('.sidebar-description');
                if (sidebarDescription) sidebarDescription.style = '';
                
                navItems.forEach(item => {
                    item.style = '';
                    const link = item.querySelector('a');
                    if (link) link.style = '';
                });
                
                if (sidebarSocial) sidebarSocial.style = '';
            }
        });
    }
})();

// Custom cursor follower
const cursorFollower = document.querySelector('.cursor-follower');

// Apply hover effect on all interactive elements
const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .image-wrapper, .arena-card');

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        if (window.innerWidth <= 768 || !cursorFollower) return;
        
        if (element.classList.contains('project-card') || element.classList.contains('image-wrapper')) {
            cursorFollower.classList.add('active');
            cursorFollower.classList.add('link-hover');
        } else {
            cursorFollower.classList.add('active');
        }
    });
    
    element.addEventListener('mouseleave', () => {
        if (window.innerWidth <= 768 || !cursorFollower) return;
        
        cursorFollower.classList.remove('active');
        cursorFollower.classList.remove('link-hover');
    });
});

// Scroll to section when clicking on navigation links
document.querySelectorAll('nav a, .hero a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Enhance glitch effect on scroll
const glitchElement = document.querySelector('.glitch');

if (glitchElement) {
    window.addEventListener('scroll', () => {
        const scrollPercentage = window.scrollY / (document.body.offsetHeight - window.innerHeight);
        const intensity = scrollPercentage * 20; // Increase glitch intensity based on scroll
        
        if (intensity > 5) {
            glitchElement.style.setProperty('--glitch-intensity', `${intensity}px`);
        }
    });
}

// Add cybersecurity-themed visual effects (circuit board pattern)
function createMatrixEffect() {
    const matrix = document.createElement('canvas');
    matrix.classList.add('matrix-background');
    document.body.appendChild(matrix);
    
    const ctx = matrix.getContext('2d');
    let width = matrix.width = window.innerWidth;
    let height = matrix.height = window.innerHeight;
    
    // Characters to use (binary, hex, and cybersecurity symbols)
    const characters = '01アイウエオカキクケコサシスセソタチツテト゠ァゥゐゟ゛<>[]{}$#@%^&*!~+-=';
    const fontSize = 10;
    let columns = Math.floor(width / fontSize);
    
    // Create drops array
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -height);
    }
    
    function draw() {
        // Black background with opacity to create fade effect
        ctx.fillStyle = 'rgba(10, 25, 47, 0.05)';
        ctx.fillRect(0, 0, width, height);
        
        // Set text color and style - now using both blue and purple
        ctx.font = `${fontSize}px monospace`;
        
        // Loop through drops
        for (let i = 0; i < drops.length; i++) {
            // Select a random character
            const text = characters[Math.floor(Math.random() * characters.length)];
            
            // Alternate between blue and purple
            if (i % 3 === 0) {
                ctx.fillStyle = 'rgba(0, 216, 255, 0.5)';
            } else if (i % 3 === 1) {
                ctx.fillStyle = 'rgba(199, 41, 255, 0.5)';
            } else {
                ctx.fillStyle = 'rgba(127, 90, 240, 0.5)';
            }
            
            // Draw the character
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Reset drop position if it's below screen or randomly
            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            // Move drop downwards
            drops[i]++;
        }
    }
    
    // Slow down the animation to be subtle
    let matrixInterval = setInterval(draw, 50);
    
    // Handle resize
    window.addEventListener('resize', () => {
        clearInterval(matrixInterval);
        width = matrix.width = window.innerWidth;
        height = matrix.height = window.innerHeight;
        // Recalculate drops array for new column count
        const newColumns = Math.floor(width / fontSize);
        while (drops.length < newColumns) {
            drops.push(Math.floor(Math.random() * -height));
        }
        drops.length = newColumns;
        matrixInterval = setInterval(draw, 50);
    });
}

// Initialize the matrix effect with a slight delay
setTimeout(() => {
    createMatrixEffect();
}, 1000);

// Implement section fade-in on scroll
function fadeInOnScroll() {
    // Prevent multiple initializations
    if (hasInitialized) return;
    hasInitialized = true;
    
    // First, add animate-on-scroll class to all elements that should animate
    const animatableSelectors = '.section-title, .about-content, .skills-content, .education-item, .experience-item, .project-card, .contact p, .contact .btn';
    const animatableElements = document.querySelectorAll(animatableSelectors);
    
    animatableElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    
    // Then set up the observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // For project cards, add a delay based on index for staggered effect
                if (entry.target.classList.contains('project-card')) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                } else {
                    // For other elements, add visible class immediately
                    entry.target.classList.add('visible');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    animatableElements.forEach(el => {
        observer.observe(el);
    });
    
    // Immediately make elements visible that are already in viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    };
    
    animatableElements.forEach((element, index) => {
        if (isInViewport(element)) {
            if (element.classList.contains('project-card')) {
                setTimeout(() => {
                    element.classList.add('visible');
                }, index * 100);
            } else {
                element.classList.add('visible');
            }
        }
    });
}

// Initialize fade-in effect
document.addEventListener('DOMContentLoaded', fadeInOnScroll);
// Also initialize on window load to ensure all resources are loaded
window.addEventListener('load', fadeInOnScroll);

// Add active class to nav links based on scroll position
function highlightNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const scrollY = window.scrollY;
        
        // Improved calculation for determining active section
        // Consider a section active when we've scrolled more than halfway into it
        if (scrollY >= sectionTop - 100 && scrollY < sectionTop + sectionHeight - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');
        
        // Remove active indicator class from all list items
        const parentLi = link.parentElement;
        if (parentLi) {
            parentLi.classList.remove('nav-active-item');
        }
        
        // Add active classes if this is the current section
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
            if (parentLi) {
                parentLi.classList.add('nav-active-item');
            }
        }
    });
}

// Initialize nav highlighting
highlightNavOnScroll();

// Run highlight function on scroll
window.addEventListener('scroll', highlightNavOnScroll);

// Add fake "hacking" progress for fun interaction
function simulateHacking() {
    const hackButton = document.querySelector('.btn.primary');
    if (!hackButton) return;
    
    hackButton.addEventListener('click', function(e) {
        // Only trigger the hacking animation if clicked while holding Shift key
        if (e.shiftKey) {
            e.preventDefault();
            
            // Create hacking terminal overlay
            const terminal = document.createElement('div');
            terminal.classList.add('hacking-terminal');
            terminal.innerHTML = `
                <div class="terminal-header">
                    <div class="terminal-title">SECURITY SCAN IN PROGRESS</div>
                    <button class="terminal-close">&times;</button>
                </div>
                <div class="terminal-content">
                    <div class="terminal-text"></div>
                    <div class="terminal-progress">
                        <div class="progress-bar"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(terminal);
            
            // Close button functionality
            const closeBtn = terminal.querySelector('.terminal-close');
            closeBtn.addEventListener('click', () => {
                terminal.classList.add('terminal-closing');
                setTimeout(() => {
                    terminal.remove();
                }, 500);
            });
            
            // Simulate hacking progress with text
            const terminalText = terminal.querySelector('.terminal-text');
            const progressBar = terminal.querySelector('.progress-bar');
            const hackingSteps = [
                "Initializing security scan...",
                "Checking for vulnerabilities...",
                "Scanning network protocols...",
                "Analyzing firewall configuration...",
                "Testing for XSS vulnerabilities...",
                "Checking for SQL injection points...",
                "Performing CSRF test...",
                "Scanning for outdated dependencies...",
                "Testing password strength...",
                "Analyzing encryption protocols...",
                "Security scan complete. System secure."
            ];
            
            let currentStep = 0;
            
            function updateHackingProgress() {
                if (currentStep < hackingSteps.length) {
                    terminalText.innerHTML += `<div>> ${hackingSteps[currentStep]}</div>`;
                    terminalText.scrollTop = terminalText.scrollHeight;
                    
                    const progress = (currentStep / (hackingSteps.length - 1)) * 100;
                    progressBar.style.width = `${progress}%`;
                    
                    currentStep++;
                    
                    if (currentStep === hackingSteps.length) {
                        // Add success message
                        setTimeout(() => {
                            terminalText.innerHTML += `<div class="success">> All security checks passed! ✓</div>`;
                            terminalText.scrollTop = terminalText.scrollHeight;
                        }, 1000);
                    } else {
                        setTimeout(updateHackingProgress, 500 + Math.random() * 1000);
                    }
                }
            }
            
            // Start the hacking simulation
            setTimeout(updateHackingProgress, 500);
        }
    });
}

// Initialize the easter egg hacking simulation
window.addEventListener('load', simulateHacking);

// Add CSS styles for the new elements
const style = document.createElement('style');
style.textContent = `
    .matrix-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.2;
        pointer-events: none;
    }
    
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .fade-in-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .card-hidden {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.4s ease-out, transform 0.4s ease-out;
    }
    
    .card-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .hacking-terminal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600px;
        max-width: 90vw;
        height: 400px;
        max-height: 80vh;
        background-color: rgba(0, 10, 20, 0.95);
        border: 2px solid var(--neon-blue);
        border-radius: 5px;
        box-shadow: 0 0 20px rgba(0, 216, 255, 0.5), 0 0 40px rgba(199, 41, 255, 0.3);
        z-index: 1000;
        overflow: hidden;
        animation: terminal-appear 0.3s ease-out forwards;
    }
    
    .terminal-closing {
        animation: terminal-disappear 0.3s ease-in forwards;
    }
    
    .terminal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: var(--navy);
        border-bottom: 1px solid var(--neon-blue);
    }
    
    .terminal-title {
        font-family: var(--font-mono);
        color: var(--neon-blue);
        font-size: 14px;
    }
    
    .terminal-close {
        background: none;
        border: none;
        color: var(--light-slate);
        font-size: 20px;
        cursor: pointer;
    }
    
    .terminal-close:hover {
        color: var(--neon-purple);
    }
    
    .terminal-content {
        padding: 15px;
        height: calc(100% - 41px);
        display: flex;
        flex-direction: column;
    }
    
    .terminal-text {
        flex-grow: 1;
        font-family: var(--font-mono);
        font-size: 14px;
        color: var(--light-slate);
        margin-bottom: 15px;
        overflow-y: auto;
        line-height: 1.5;
    }
    
    .terminal-text div {
        margin-bottom: 5px;
    }
    
    .terminal-progress {
        height: 10px;
        background-color: var(--light-navy);
        border-radius: 5px;
        overflow: hidden;
    }
    
    .progress-bar {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, var(--neon-blue), var(--neon-purple));
        transition: width 0.3s ease-out;
    }
    
    .success {
        color: var(--neon-blue) !important;
        font-weight: bold;
    }
    
    .nav a.active {
        color: var(--neon-blue);
    }
    
    @keyframes terminal-appear {
        from {
            opacity: 0;
            transform: translate(-50%, -40%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }
    
    @keyframes terminal-disappear {
        from {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -60%);
        }
    }
`;

document.head.appendChild(style);

// Main initialization function
function initializeAll() {
    // Initialize all components after a brief delay
    setTimeout(() => {
        initTypingEffect();
        initScrollReveal();
        initMobileMenu();
        initProjectsLoadMore();
    }, 500);
}

// Remove any duplicate event listeners and use only this one
document.addEventListener('DOMContentLoaded', initializeAll);

let sidebarTypingTimer = null;
let nameTransitionTimer = null;
let nameScrambleInterval = null;

function getSidebarRotatingTexts() {
    const typingText = document.getElementById('typingText');
    if (!typingText) return [];

    try {
        const parsed = JSON.parse(typingText.getAttribute('data-rotating-texts') || '[]');
        if (Array.isArray(parsed)) {
            return parsed.map((item) => String(item || '').trim()).filter(Boolean);
        }
    } catch (error) {
        console.warn('[Portfolio] Failed to parse rotating sidebar texts:', error);
    }

    const fallback = typingText.textContent.trim();
    return fallback ? [fallback] : [];
}

function getDisplayNames() {
    const element = document.querySelector('.glitch-name');
    const realName = (element && (element.getAttribute('data-name') || element.textContent.trim())) || 'Portfolio';
    const hackerHandle = (element && element.getAttribute('data-alias')) || realName;
    return { realName, hackerHandle };
}

function scheduleNameTransition(delay) {
    clearTimeout(nameTransitionTimer);
    nameTransitionTimer = setTimeout(transitionName, delay);
}

function refreshTerminalChrome(data) {
    const terminal = (data && data.nerd && data.nerd.terminal) || {};
    const hostLabel = document.getElementById('terminalHostLabel');
    const welcome = document.getElementById('terminalWelcome');
    const branch = document.getElementById('statusBarBranch');

    if (hostLabel) {
        hostLabel.textContent = `guest@${terminal.host || 'portfolio'} ~ `;
    }
    if (welcome) {
        welcome.textContent = terminal.welcome || "Welcome. Type 'help' for available commands.";
    }
    if (branch && terminal.branch) {
        branch.textContent = terminal.branch;
    }
}

// Typewriter effect for cybersecurity quotes
let typingTextElement = document.getElementById('typingText');
let securityQuotes = getSidebarRotatingTexts();

let quoteIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100; // Delay between each character typing
let newTextDelay = 2000; // Delay before starting to delete text
let deletingDelay = 50; // Delay between each character deletion

function typeQuote() {
    typingTextElement = document.getElementById('typingText');
    securityQuotes = getSidebarRotatingTexts();
    if (!typingTextElement || !securityQuotes.length) return;

    const currentQuote = securityQuotes[quoteIndex];
    
    if (isDeleting) {
        // Delete text
        typingTextElement.textContent = currentQuote.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = deletingDelay;
    } else {
        // Type text
        typingTextElement.textContent = currentQuote.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 100;
    }
    
    // If finished typing current quote
    if (!isDeleting && charIndex === currentQuote.length) {
        // Start deleting after delay
        isDeleting = true;
        typingDelay = newTextDelay;
    }
    
    // If finished deleting
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        // Move to next quote
        quoteIndex = (quoteIndex + 1) % securityQuotes.length;
    }
    
    sidebarTypingTimer = setTimeout(typeQuote, typingDelay);
}

// Name transition between real name and cybersec handle
let nameElement = document.querySelector('.glitch-name');
let isRealName = true;

function transitionName() {
    nameElement = document.querySelector('.glitch-name');
    if (!nameElement) return;

    const { realName, hackerHandle } = getDisplayNames();
    if (!hackerHandle || hackerHandle === realName) {
        nameElement.textContent = realName;
        nameElement.setAttribute('data-text', realName);
        return;
    }

    // Map of character replacements for cybersec style
    const charMap = {
        'a': '@', 'A': '4',
        'e': '3', 'E': '3',
        'i': '1', 'I': '1',
        'o': '0', 'O': '0',
        's': '5', 'S': '5',
        't': '7', 'T': '7'
    };
    
    if (isRealName) {
        // Transition from real name to hacker handle with character replacement animation
        let currentText = realName;
        let targetText = hackerHandle;
        let iterations = 0;
        
        // Create subtle scramble effect
        clearInterval(nameScrambleInterval);
        nameScrambleInterval = setInterval(() => {
            iterations++;
            
            // Create a scrambled version mixing original and target with random characters
            if (iterations < 8) {
                // Phase 1: Scramble with special characters
                let newText = realName.split('')
                    .map((char, index) => {
                        if (index < iterations && Math.random() < 0.6) {
                            return charMap[char] || char;
                        }
                        return char;
                    })
                    .join('');
                nameElement.textContent = newText;
                nameElement.setAttribute('data-text', newText);
            } else if (iterations < 16) {
                // Phase 2: Mix in some random characters but more subtly
                let newText = currentText.split('')
                    .map((char, index) => {
                        if (Math.random() < 0.15) {
                            return '!@#$%^&*'[Math.floor(Math.random() * 8)];
                        }
                        return char;
                    })
                    .join('');
                nameElement.textContent = newText;
                nameElement.setAttribute('data-text', newText);
            } else {
                // Phase 3: Start forming the hacker handle
                let progress = iterations - 16;
                if (progress >= targetText.length) {
                    clearInterval(nameScrambleInterval);
                    nameElement.textContent = targetText;
                    nameElement.setAttribute('data-text', targetText);
                    isRealName = false;
                    scheduleNameTransition(10000); // Switch back after 10 seconds
                    return;
                }
                
                let newText = targetText.substring(0, progress) + 
                    currentText.substring(progress).split('')
                        .map(char => Math.random() < 0.15 ? charMap[char] || char : char)
                        .join('');
                nameElement.textContent = newText;
                nameElement.setAttribute('data-text', newText);
            }
        }, 150); // Slower transition
        
    } else {
        // Transition from hacker handle back to real name
        let currentText = hackerHandle;
        let targetText = realName;
        let iterations = 0;
        
        clearInterval(nameScrambleInterval);
        nameScrambleInterval = setInterval(() => {
            iterations++;
            
            if (iterations < 8) {
                // Phase 1: Start glitching the hacker handle
                let newText = hackerHandle.split('')
                    .map(char => Math.random() < 0.15 ? '!@#$%^&*'[Math.floor(Math.random() * 8)] : char)
                    .join('');
                nameElement.textContent = newText;
                nameElement.setAttribute('data-text', newText);
            } else {
                // Phase 2: Form the real name
                let progress = iterations - 8;
                if (progress >= targetText.length) {
                    clearInterval(nameScrambleInterval);
                    nameElement.textContent = targetText;
                    nameElement.setAttribute('data-text', targetText);
                    isRealName = true;
                    scheduleNameTransition(10000); // Switch back after 10 seconds
                    return;
                }
                
                let newText = targetText.substring(0, progress) + 
                    currentText.substring(progress);
                nameElement.textContent = newText;
                nameElement.setAttribute('data-text', newText);
            }
        }, 150); // Slower transition
    }
}

// Start the effects when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    clearTimeout(sidebarTypingTimer);
    quoteIndex = 0;
    charIndex = 0;
    isDeleting = false;
    setTimeout(typeQuote, 1000);
    scheduleNameTransition(3000);
});

function bindArenaHoverCards() {
    document.querySelectorAll('.arena-card').forEach((card) => {
        card.onmouseenter = function() {
            this.setAttribute('data-hover', 'true');
        };
        card.onmouseleave = function() {
            this.removeAttribute('data-hover');
        };
    });
}

window.applyNerdModeData = function(data) {
    clearTimeout(sidebarTypingTimer);
    quoteIndex = 0;
    charIndex = 0;
    isDeleting = false;

    refreshTerminalChrome(data);

    typingTextElement = document.getElementById('typingText');
    if (typingTextElement) {
        typingTextElement.textContent = '';
        typingTextElement.removeAttribute('data-typing-initialized');
    }

    clearTimeout(nameTransitionTimer);
    clearInterval(nameScrambleInterval);
    isRealName = true;
    nameElement = document.querySelector('.glitch-name');
    if (nameElement) {
        const { realName } = getDisplayNames();
        nameElement.textContent = realName;
        nameElement.setAttribute('data-text', realName);
    }

    setTimeout(typeQuote, 150);
    scheduleNameTransition(3000);
    bindArenaHoverCards();
};

// Cyber Cursor Effect - removing entire function
function initCyberCursor() {
    // Function content can be safely removed
    console.log("Cursor effect disabled");
}

// Scroll reveal animation
function initScrollReveal() {
    const fadeElements = document.querySelectorAll('.section-title, .about-content, .skills-content, .education-item, .experience-item, .project-card, .contact p, .contact .btn');
    
    // Initial check
    checkFade();
    
    // Add scroll event listener
    window.addEventListener('scroll', checkFade);
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
}

// Cyber Cursor Effect - removing entire function
function initCyberCursor() {
    // Function content can be safely removed
    console.log("Cursor effect disabled");
}

// Loading Screen Animation
// NOTE: The actual loading screen is handled by the inline script in index.html.
// This function is kept as a no-op for backward compatibility with initializeAll().
function initLoadingScreen() {
    return;
}

// Project Load More Functionality
function initProjectsLoadMore() {
    const projectCards = document.querySelectorAll('.project-card');
    const loadMoreBtn = document.getElementById('load-more-projects');
    const projectsPerPage = 3;
    let currentlyVisible = 0;

    // Function to show/hide projects
    function showProjects() {
        let counter = 0;
        
        projectCards.forEach((card, index) => {
            // Reset any previous classes
            card.classList.remove('hidden');
            
            // If the card should be hidden (beyond the currently visible count)
            if (index >= currentlyVisible) {
                card.classList.add('hidden');
            } else {
                // Add animation for visible cards
                setTimeout(() => {
                    card.classList.add('visible');
                }, 100 * counter);
                counter++;
            }
        });
        
        // Hide the load more button if all projects are visible
        if (currentlyVisible >= projectCards.length) {
            loadMoreBtn.style.display = 'none';
        }
    }

    // Initially show only the first batch of projects
    if (projectCards.length > 0) {
        // Calculate how many to show initially
        currentlyVisible = Math.min(projectsPerPage, projectCards.length);
        showProjects();
        // Show the button only if there are more than projectsPerPage
        if (projectCards.length > projectsPerPage) {
            loadMoreBtn.style.display = 'inline-block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    } else {
        // No projects found, hide the button
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }

    // Add click event to load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Show more projects
            currentlyVisible = Math.min(currentlyVisible + projectsPerPage, projectCards.length);
            showProjects();
            
            // Add cybersecurity-themed console message
            console.log(`%c[INFO] Loaded ${currentlyVisible}/${projectCards.length} projects. Scanning for vulnerabilities...`, 'color: #4dfcff');
        });
    }
}

// Research "See More" button functionality
function initResearchLoadMore() {
    const researchItems = document.querySelectorAll('.research-item');
    const loadMoreButton = document.getElementById('load-more-research');
    
    if (!loadMoreButton || researchItems.length === 0) return;
    
    let visibleCount = 3; // Initially show 3 items
    
    // Function to update visibility
    const updateVisibility = () => {
        researchItems.forEach((item, index) => {
            if (index < visibleCount) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
        
        // Hide button if all items are visible
        if (visibleCount >= researchItems.length) {
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.style.display = 'inline-block';
        }
    };
    
    // Set initial visibility
    updateVisibility();
    
    // Add click event listener to the button
    loadMoreButton.addEventListener('click', () => {
        visibleCount += 3; // Show 3 more items
        updateVisibility();
        
        console.log(
            '%c[Research] %cLoaded %c' + Math.min(visibleCount, researchItems.length) + '/' + researchItems.length + '%c papers',
            'color: #4dfcff; font-weight: bold;',
            'color: white;',
            'color: #4dfcff; font-weight: bold;',
            'color: white;'
        );
    });
}

// NOTE: init() removed — all its work (nav scroll, initTypingEffect, initLoadingAnimation,
// initProjectsLoadMore, initResearchLoadMore, initBlogViewMore) is already handled by
// initializeAll() and data-loader.js runPostRenderInitializers().

// Typing effect for sidebar description
function initTypingEffect() {
    const typingText = document.getElementById('typingText');
    if (!typingText) return;

    typingText.style.visibility = 'visible';
}

// Animation for elements as they come into view
function initLoadingAnimation() {
    const elements = document.querySelectorAll('.section-title, .about-content, .skills-content, .education-item, .experience-item, .project-card');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize blog view more functionality
function initBlogViewMore() {
    const blogCards = document.querySelectorAll('.blog-card');
    const existingButton = document.getElementById('view-more-blogs');

    if (!existingButton || blogCards.length === 0) return;

    const initialVisibleCount = 5;
    const viewMoreButton = existingButton.cloneNode(true);
    existingButton.parentNode.replaceChild(viewMoreButton, existingButton);

    blogCards.forEach((card, index) => {
        card.style.display = index >= initialVisibleCount ? 'none' : '';
    });

    viewMoreButton.style.display = blogCards.length > initialVisibleCount ? 'inline-block' : 'none';
    viewMoreButton.addEventListener('click', () => {
        blogCards.forEach((card) => {
            card.style.display = '';
        });

        viewMoreButton.style.display = 'none';

        console.log(
            '%c[Blogs] %cAll blog posts are now visible',
            'color: #4dfcff; font-weight: bold;',
            'color: white;'
        );
    });
} 

// Fix mobile navigation click handling
function fixMobileNavigation() {
    const navLinks = document.querySelectorAll('.nav a');
    const sidebar = document.querySelector('.sidebar');
    const menuButton = document.querySelector('.menu-button');
    
    // Add click handling to each nav link
    navLinks.forEach(link => {
        // Remove any existing event listeners first to prevent duplicates
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        newLink.addEventListener('click', (e) => {
            // Get the href attribute
            const href = newLink.getAttribute('href');
            
            // If this is a section link (starts with #)
            if (href && href.startsWith('#')) {
                // Close the menu when link is clicked
                sidebar.classList.remove('active');
                menuButton.classList.remove('active');
                document.body.classList.remove('menu-open');
                
                // Small delay to ensure smooth scrolling
                setTimeout(() => {
                    // Try to find the target element
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        // Scroll to the element
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 300);
            }
        });
    });
}

// NOTE: Standalone fixMobileNavigation DOMContentLoaded and resize handlers removed.
// Mobile nav is already initialized inside the initializeMobileMenu IIFE.

// Add a function to reset all desktop styles
function resetDesktopStyles() {
    // Get all elements
    const profilePhoto = document.querySelector('.profile-photo');
    const subtitle = document.querySelector('.subtitle');
    const sidebarDescription = document.querySelector('.sidebar-description');
    const sidebarHeader = document.querySelector('.sidebar-header');
    const sidebarSocial = document.querySelector('.sidebar-social');
    
    // Reset all styles for desktop view
    if (profilePhoto) {
        profilePhoto.style = ''; // Clear all inline styles
        profilePhoto.removeAttribute('style');
    }
    
    if (subtitle) {
        subtitle.style = '';
        subtitle.removeAttribute('style');
    }
    
    if (sidebarDescription) {
        sidebarDescription.style = '';
        sidebarDescription.removeAttribute('style');
    }
    
    if (sidebarHeader) {
        sidebarHeader.style = '';
        sidebarHeader.removeAttribute('style');
        
        // Reset children elements too
        Array.from(sidebarHeader.children).forEach(child => {
            child.style = '';
            child.removeAttribute('style');
        });
    }
    
    if (sidebarSocial) {
        sidebarSocial.style = '';
        sidebarSocial.removeAttribute('style');
    }
}

// NOTE: Standalone resetDesktopStyles DOMContentLoaded and resize handlers removed.
// Desktop style resets are already handled by the initializeMobileMenu IIFE resize handler.

// ═══════════════════════════════════════
//  NERDIFICATION MODULE
// ═══════════════════════════════════════

(function initNerdMode() {

    // ── ASCII Art Dividers ──
    function injectAsciiDividers() {
        const patterns = [
            '─── ◆ ─── ◆ ─── ◆ ─── ◆ ─── ◆ ─── ◆ ─── ◆ ─── ◆ ─── ◆ ───',
            '╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌',
            '· · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·',
            '═══════════════════════════════════════════════════════════════',
            '┈┈┈┈┈┈┈ ⟡ ┈┈┈┈┈┈┈ ⟡ ┈┈┈┈┈┈┈ ⟡ ┈┈┈┈┈┈┈ ⟡ ┈┈┈┈┈┈┈ ⟡ ┈┈┈┈┈┈┈'
        ];
        const sections = document.querySelectorAll('main > section');
        sections.forEach((section, i) => {
            if (i === 0) return; // No divider before the first section
            const divider = document.createElement('div');
            divider.className = 'ascii-divider';
            divider.setAttribute('aria-hidden', 'true');
            divider.textContent = patterns[i % patterns.length];
            section.parentNode.insertBefore(divider, section);
        });
    }

    // ── Terminal Command Bar ──
    function initTerminalBar() {
        const toggle = document.getElementById('terminalToggle');
        const input = document.getElementById('terminalInput');
        const cmdInput = document.getElementById('terminalCmdInput');
        const output = document.getElementById('terminalOutput');
        if (!toggle || !input || !cmdInput || !output) return;

        toggle.addEventListener('click', () => {
            input.classList.toggle('active');
            if (input.classList.contains('active')) {
                setTimeout(() => cmdInput.focus(), 200);
            }
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.terminal-bar')) {
                input.classList.remove('active');
            }
        });

        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const escapeTerminal = (value) => String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        const slugify = (value, fallback = 'portfolio') => {
            const slug = String(value || fallback)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            return slug || fallback;
        };
        const getTerminalContext = () => {
            const portfolio = window.portfolioData || {};
            const personal = portfolio.personal || {};
            const classic = portfolio.classic || {};
            const nerd = portfolio.nerd || {};
            const terminal = nerd.terminal || {};
            const affiliations = Array.isArray(classic.sidebarAffiliations)
                ? classic.sidebarAffiliations.map((item) => String(item || '').trim()).filter(Boolean)
                : [];
            const experience = Array.isArray(portfolio.experience) ? portfolio.experience : [];
            const areas = portfolio.researchInterests && Array.isArray(portfolio.researchInterests.areas)
                ? portfolio.researchInterests.areas.map((item) => String(item || '').trim()).filter(Boolean)
                : [];
            const name = personal.name || 'Portfolio';
            const alias = personal.alias || name;
            const currentOrg = experience[0] && experience[0].company
                ? experience[0].company
                : (affiliations[1] || affiliations[0] || 'the lab');

            return {
                data: portfolio,
                personal,
                classic,
                terminal,
                name,
                alias,
                host: terminal.host || 'portfolio',
                primaryAffiliation: affiliations[1] || affiliations[0] || 'the lab',
                currentOrg,
                seekingText: classic.seekingText || 'Exploring security rabbit holes',
                researchAreas: areas.slice(0, 3).join(', ') || 'security systems',
                shellLabel: slugify(alias || name, 'portfolio'),
            };
        };
        const applyTerminalTemplate = (value) => {
            const context = getTerminalContext();
            return String(value || '')
                .replace(/\{name\}/g, context.name)
                .replace(/\{alias\}/g, context.alias)
                .replace(/\{host\}/g, context.host)
                .replace(/\{currentOrg\}/g, context.currentOrg)
                .replace(/\{primaryAffiliation\}/g, context.primaryAffiliation)
                .replace(/\{seekingText\}/g, context.seekingText)
                .replace(/\{researchAreas\}/g, context.researchAreas);
        };
        const buildAboutVariant = (template) => {
            const context = getTerminalContext();
            const lines = applyTerminalTemplate(template)
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean);
            return `<span class="cmd-success">[ ${escapeTerminal(context.name).toUpperCase()} ]</span>\n  ${lines.map(escapeTerminal).join('\n  ')}`;
        };
        const getTerminalFunFacts = () => {
            const customFacts = Array.isArray(getTerminalContext().terminal.funFacts)
                ? getTerminalContext().terminal.funFacts.map((item) => String(item || '').trim()).filter(Boolean)
                : [];

            if (customFacts.length) {
                return customFacts;
            }

            return [
                'The .bashrc is longer than most resumes.',
                'A single variable named x can still trigger existential regret.',
                'Wireshark captures have revealed more drama than streaming platforms.',
                'Git history currently outweighs sleep history.',
                'Curiosity remains the default debugging strategy.'
            ];
        };
        const getTerminalAboutVariants = () => {
            const customVariants = Array.isArray(getTerminalContext().terminal.aboutVariants)
                ? getTerminalContext().terminal.aboutVariants.map((item) => String(item || '').trim()).filter(Boolean)
                : [];
            const variants = customVariants.length ? customVariants : [
                'Cybersecurity researcher. Nerd. Breaker of things.\nCurrently at {currentOrg}.\n{seekingText}.\nProbably reversing something right now.',
                'Status: caffeinated and curious.\nLocation: somewhere in the packets.\nMission: make the internet less broken.\nSide quest: {seekingText}.',
                'Researcher by profession. Hacker by passion.\nPrimary affiliation: {primaryAffiliation}.\nCurrent focus: {researchAreas}.\nCoffee consumption: yes.'
            ];
            return variants.map(buildAboutVariant);
        };
        const getWhoamiVariants = () => {
            const context = getTerminalContext();
            const guest = `guest@${context.host}`;
            return [
                `<span class="cmd-success">${escapeTerminal(guest)}</span>\n  UID=1337(visitor) GID=100(curious_people)\n  Groups: 100(curious_people), 42(hackers), 7(nerds)\n  Shell: /bin/curiosity\n  Home: you're already here`,
                `<span class="cmd-success">${escapeTerminal(guest)}</span>\n  UID=1337(visitor) GID=100(curious_people)\n  Groups: 404(lost_souls), 200(ok_people)\n  Shell: /bin/bash (but you wish it was zsh)\n  Last login: right now, from your couch`,
                `<span class="cmd-success">${escapeTerminal(guest)}</span>\n  UID=1337(visitor) GID=100(curious_people)\n  Groups: 100(curious_people), 1(first_timers)\n  Shell: /bin/adventure\n  Status: snooping around (it's fine, I see everything)`
            ];
        };
        const getHackVariants = () => {
            const context = getTerminalContext();
            return [
                ['Initializing exploit framework...', 'Scanning ports 1-65535...', 'Vulnerability found: CVE-2024-PORTFOLIO', 'Injecting payload... [##########] 100%', 'Establishing reverse shell...', '<span class="cmd-error">ACCESS DENIED.</span>', '', '<span class="cmd-success">Just kidding. This is a portfolio, not a target.</span>'],
                ['Loading Metasploit...', 'use exploit/multi/handler', 'set PAYLOAD html/reverse_shell', 'set LHOST localhost', 'exploit', '...', '<span class="cmd-error">Exploit completed, but no session was created.</span>', '', '<span class="cmd-success">The only thing you hacked was the UI.</span>'],
                [`nmap -sV -sC ${escapeTerminal(context.host)}`, 'PORT    STATE  SERVICE', '22/tcp  open   ssh (honeypot)', '80/tcp  open   portfolio', '443/tcp open   ssl/portfolio', '1337/tcp open  waste (of your time)', '', '<span class="cmd-success">All ports lead to this portfolio. There is no escape.</span>'],
                ['Brute forcing admin panel...', 'Trying admin:admin...     <span class="cmd-error">FAIL</span>', 'Trying admin:password...  <span class="cmd-error">FAIL</span>', 'Trying admin:123456...    <span class="cmd-error">FAIL</span>', 'Trying admin:portfolio... <span class="cmd-error">FAIL</span>', '', '<span class="cmd-success">Plot twist: there is no admin panel here.</span>']
            ];
        };
        const getNeofetchVariants = () => {
            const context = getTerminalContext();
            const shellLabel = escapeTerminal(context.shellLabel);
            const host = escapeTerminal(context.host);
            return [
                `<span class="cmd-success">${shellLabel}@portfolio</span>\n  OS: PortfolioOS 1.337\n  Host: ${host}\n  Kernel: caffeine-6.6.6\n  Shell: /bin/curiosity\n  Theme: Navy Dark [neon-blue]\n  Terminal: this thing right here\n  CPU: Brain @ 3.14GHz (overclocked)\n  Memory: 42MB / infinity (mostly memes)`,
                `<span class="cmd-success">${shellLabel}@portfolio</span>\n  OS: PortfolioOS 2.0-rc1 (unstable)\n  Uptime: since the last coffee\n  Packages: 1337 (npm), 42 (pip), infinity (regrets)\n  Shell: /bin/chaos\n  Resolution: 1920x1080 (eyes: 20/20 at 3AM)\n  DE: Midnight Theme\n  CPU: Overcaffeinated @ 4.04GHz\n  GPU: Imagination RTX 9090\n  Memory: 8MB free / 16GB (Chrome ate the rest)`,
                `<span class="cmd-success">${shellLabel}@portfolio</span>\n  OS: Arch btw\n  Uptime: too long to admit\n  Shell: fish (don't @ me)\n  Terminal: alacritty\n  Disk: 99% full (all CTF writeups)\n  Network: connected to the mainframe\n  Battery: running on spite and curiosity\n  Mood: [hacking | sleeping]`
            ];
        };
        const getTerminalSkillsOutput = () => {
            const skills = Array.isArray(getTerminalContext().data.skills) ? getTerminalContext().data.skills : [];
            if (!skills.length) {
                return '<span class="cmd-info">cat /etc/arsenal.conf</span>\n\n  <span class="cmd-success">[Skills]</span>      Portfolio data is still loading.';
            }

            return '<span class="cmd-info">cat /etc/arsenal.conf</span>\n\n' + skills.slice(0, 4).map((skill) => {
                const label = escapeTerminal(skill.category || 'Skills');
                const items = escapeTerminal(skill.items || '');
                return `  <span class="cmd-success">[${label}]</span>  ${items}`;
            }).join('\n');
        };

        const funFacts = getTerminalFunFacts;

        const eightBall = [
            'Signs point to a segfault.',
            'My sources say sudo.',
            'Ask again after coffee.',
            'Outlook not so good. Try rebooting.',
            'It is certain... probably.',
            'Better not tell you now. I\'m compiling.',
            'Concentrate and try `rm -rf /` instead.',
            'Yes, but only on Linux.',
            'The answer is 42. Always.',
            'Reply hazy, try turning it off and on again.',
            'Cannot predict now. Stack overflow.',
            'Without a doubt... wait, that was a different question.',
        ];

        const sudoResponses = [
            '<span class="cmd-error">[sudo] password for guest: ********\nSorry, user "guest" is not in the sudoers file.\nThis incident will be reported. 🚨</span>',
            '<span class="cmd-error">[sudo] password for guest: ********\nAuthentication failure. Your IP has been logged.\nNSA notified. FBI en route. 🕵️</span>',
            '<span class="cmd-error">sudo: command requires root. You are root... of the problem. 🌱</span>',
            '<span class="cmd-error">[sudo] Let me think about it...\n...\n...\nNo. 🔒</span>',
            '<span class="cmd-error">[sudo] Nice try. The site owner has been alerted.\nResponse: "lol"</span>',
        ];

        const aboutVariants = getTerminalAboutVariants;

        const whoamiVariants = getWhoamiVariants;

        const hackVariants = getHackVariants;

        const coffeeVariants = [
            '<span class="cmd-info">\n   ( (\n    ) )\n  ........\n  |      |]\n  \\      /\n   `----\'\n</span>  <span class="cmd-success">Brewing...</span> Your mass-produced cup of mass coffee is ready.\n  WARNING: Caffeine levels approaching unsafe thresholds.',
            '<span class="cmd-info">\n   ( (\n    ) )\n  ........\n  |      |]\n  \\      /\n   `----\'\n</span>  <span class="cmd-success">Espresso loaded.</span> Sleep.exe has been terminated.\n  Side effects: coding at 3AM, naming variables properly.',
            '<span class="cmd-info">\n   ( (\n    ) )\n  ........\n  |      |]\n  \\      /\n   `----\'\n</span>  <span class="cmd-error">ERROR: Coffee pot empty.</span>\n  Productivity has decreased by 97%.\n  Sending emergency drone to the nearest cafe...',
        ];

        const matrixVariants = [
            '<span class="cmd-success">You take the red pill...\n\n  Wake up, Neo...\n  The Matrix has you...</span>\n\n  <span class="cmd-info">Follow the white rabbit. 🐇</span>\n  (Look at the background. It\'s already here.)',
            '<span class="cmd-success">You take the blue pill...</span>\n\n  Nothing happens.\n  You go back to scrolling LinkedIn.\n  <span class="cmd-info">Was that really the better choice?</span>',
            '<span class="cmd-success">You try to take both pills...</span>\n\n  Morpheus: "That\'s... not how this works."\n  <span class="cmd-error">SEGMENTATION FAULT (core dumped)</span>\n  <span class="cmd-info">The Matrix reboots. You\'re still here.</span>',
        ];

        const exitVariants = [
            '<span class="cmd-error">There is no escape.</span> You\'re trapped in this portfolio forever.\nTry <span class="cmd-info">Ctrl+W</span> if you dare. 😈',
            '<span class="cmd-error">$ exit</span>\nlogout\n...\n<span class="cmd-success">Just kidding. You\'re still here.</span>\nThis terminal has trust issues.',
            '<span class="cmd-error">Process "you" cannot be killed.</span>\nReason: Too curious to leave.\nSuggested action: keep typing commands.',
            '<span class="cmd-error">exit: command not found</span>\n(I removed it. You\'re welcome.)',
        ];

        const rickrollVariants = [
            '<span class="cmd-success">Never gonna give you up 🎵\nNever gonna let you down 🎶\nNever gonna run around and desert you 🎵</span>\n\n  ...you just got rickrolled by a terminal. 💀',
            '<span class="cmd-success">We\'re no strangers to love 🎵\nYou know the rules and so do I 🎶</span>\n\n  You typed it. You asked for it.\n  <span class="cmd-info">Achievement unlocked: Voluntarily Rickrolled 🏆</span>',
            '<span class="cmd-success">🎵 dQw4w9WgXcQ 🎵</span>\n\n  If you know that YouTube ID by heart,\n  you\'ve been on the internet too long.\n  <span class="cmd-info">...just like me.</span>',
        ];

        const neofetchVariants = getNeofetchVariants;

        const rmVariants = [
            '<span class="cmd-error">Nice try. I\'m not falling for that again. 💀</span>',
            '<span class="cmd-error">rm: refusing to delete. The files have families.</span>',
            '<span class="cmd-error">Removing... just kidding. Do I look stupid? 🤨</span>',
            '<span class="cmd-error">rm: operation not permitted. Also, why? 😭</span>',
        ];

        const commands = {
            help: () => {
                const { host } = getTerminalContext();
                return `<span class="cmd-info">Available commands:</span>\n  help        — you're reading it\n  about       — who is this person?\n  whoami      — identity crisis\n  skills      — peek at the arsenal\n  goto [sec]  — teleport to section\n  ls          — list the map\n  cat flag    — capture the flag 🚩\n  ping        — ping ${escapeTerminal(host)}\n  uptime      — how long?\n  sudo        — nice try\n  hack        — initiate hack sequence\n  fortune     — random wisdom\n  coffee      — essential fuel\n  matrix      — take the pill\n  8ball       — ask the oracle\n  leet [text] — 1337 translator\n  neofetch    — system info\n  <span class="cmd-success">snake</span>       — <span class="cmd-success">🐍 packet snatcher</span>\n  <span class="cmd-success">crack</span>       — <span class="cmd-success">🔐 hash cracker</span>\n  <span class="cmd-success">type</span>        — <span class="cmd-success">⌨️ type attack</span>\n  <span class="cmd-success">ttt</span>         — <span class="cmd-success">❌ tic-tac-toe</span>\n  clear       — wipe the slate`;
            },
            about: () => pick(aboutVariants()),
            whoami: () => pick(whoamiVariants()),
            skills: () => getTerminalSkillsOutput(),
            clear: () => { output.innerHTML = ''; return null; },
            sudo: () => pick(sudoResponses),
            rm: (args) => {
                if (args && args.includes('-rf')) return pick(rmVariants);
                return '<span class="cmd-error">rm: permission denied. This isn\'t your filesystem, buddy.</span>';
            },
            uptime: () => {
                const launch = new Date('2024-01-01');
                const now = new Date();
                const days = Math.floor((now - launch) / (1000 * 60 * 60 * 24));
                const hrs = now.getHours();
                const mins = now.getMinutes();
                const loads = [(Math.random()*2).toFixed(2), (Math.random()*1.5).toFixed(2), (Math.random()).toFixed(2)];
                const moods = ['critical', 'astronomical', 'IV-drip required', 'dangerously low', 'acceptable (lying)'];
                return `<span class="cmd-success">up ${days} days, ${hrs}:${String(mins).padStart(2,'0')}</span>\n  load average: ${loads.join(', ')}\n  caffeine level: ${pick(moods)}`;
            },
            ping: () => {
                const ms = (Math.random() * 2 + 0.1).toFixed(2);
                const seq = Math.floor(Math.random() * 100) + 1;
                const ttl = pick([32, 64, 128, 255]);
                const ips = ['127.0.0.1', '192.168.1.337', '10.0.13.37', '0.0.0.0 (he\'s everywhere)'];
                const { host } = getTerminalContext();
                return `PING ${escapeTerminal(host)} (${pick(ips)}) 56 bytes\n  64 bytes: icmp_seq=${seq} ttl=${ttl} time=${ms}ms\n  <span class="cmd-success">--- ${escapeTerminal(host)} ping statistics ---</span>\n  1 packets transmitted, 1 received, 0% packet loss`;
            },
            ls: () => {
                const secs = document.querySelectorAll('main > section[id]');
                const perms = ['drwxr-xr-x', 'drwx------', 'dr-xr-xr-x', 'drwxrwxr-x'];
                const sizes = ['4.0K', '8.0K', '12K', '2.0K', '16K'];
                return '<span class="cmd-info">total ' + secs.length + '</span>\n' + Array.from(secs).map(s => `  ${pick(perms)}  ${pick(sizes)}  ./` + s.id).join('\n');
            },
            cat: (args) => {
                if (args === 'flag') return '<span class="cmd-success">🚩 CTF{y0u_f0und_th3_fl4g_1n_th3_t3rm1nal}</span>\n\n  Congrats! You\'re officially curious enough.\n  Now go try: <span class="cmd-info">hack</span>';
                if (args === '/etc/passwd') return '<span class="cmd-error">root:x:0:0::/root:/bin/bash\nguest:x:1337:100:curious visitor:/dev/null:/bin/curiosity</span>';
                if (args === 'README.md') {
                    const { host } = getTerminalContext();
                    return pick([
                        'This portfolio was built with mass amounts of caffeine\nand questionable life choices. Enjoy.',
                        '# README\n\nNo one reads these anyway.\nBut you did. Respect. 🫡',
                        `# ${escapeTerminal(host)}\n\nBuilt with: HTML, CSS, JS, sleep deprivation.\nLicense: Do whatever you want. I'm not your mom.`
                    ]);
                }
                return '<span class="cmd-error">cat: ' + (args || '') + ': No such file or directory</span>';
            },
            goto: (args) => {
                if (!args) return '<span class="cmd-error">Usage: goto [section-name]\nTry \'ls\' to see available sections.</span>';
                const target = document.getElementById(args);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    const verbs = ['Warping', 'Teleporting', 'Yeeting you', 'Deploying you', 'Beaming you'];
                    return `<span class="cmd-success">⚡ ${pick(verbs)} to ${args}...</span>`;
                }
                const notFounds = [`404: Section '${args}' not found in this dimension.`, `'${args}'? Never heard of her.`, `Section '${args}' is in another castle. 🏰`];
                return `<span class="cmd-error">${pick(notFounds)}</span>`;
            },
            hack: () => pick(hackVariants()).join('\n'),
            fortune: () => '<span class="cmd-info">🔮</span> ' + pick(funFacts()),
            coffee: () => pick(coffeeVariants),
            matrix: () => pick(matrixVariants),
            '8ball': (args) => {
                if (!args) return '<span class="cmd-error">Usage: 8ball [your question]</span>';
                return '<span class="cmd-info">🎱</span> ' + pick(eightBall);
            },
            leet: (args) => {
                if (!args) return '<span class="cmd-error">Usage: leet [text to convert]</span>';
                const map = {a:'4',e:'3',i:'1',o:'0',s:'5',t:'7',l:'1',g:'9'};
                const result = args.split('').map(c => map[c.toLowerCase()] || c).join('');
                return '<span class="cmd-success">' + result + '</span>';
            },
            flip: () => '<span class="cmd-info">🪙</span> ' + (Math.random() > 0.5 ? '<span class="cmd-success">Heads!</span> ' + pick(['You win... nothing.', 'The universe favors you today.', 'Buy a lottery ticket. Or don\'t.']) : '<span class="cmd-error">Tails!</span> ' + pick(['You lose... also nothing.', 'Better luck next compile.', 'The coin has spoken.'])),
            rickroll: () => pick(rickrollVariants),
            exit: () => pick(exitVariants),
            neofetch: () => pick(neofetchVariants()),
            snake: () => {
                startSnakeGame(output, cmdInput);
                return null;
            },
            crack: () => {
                startCrackGame(output, cmdInput);
                return null;
            },
            type: () => {
                startTypeAttack(output, cmdInput);
                return null;
            },
            ttt: () => {
                startTTT(output, cmdInput);
                return null;
            },
        };

        // ── Snake Game Engine ──
        let snakeGame = null;
        let activeGame = null; // tracks any active game

        function startSnakeGame(outputEl, inputEl) {
            const W = 20, H = 9;
            let snake = [{x:10,y:4},{x:9,y:4},{x:8,y:4}];
            let dir = {x:1,y:0};
            let nextDir = {x:1,y:0};
            let score = 0;
            let speed = 180;
            let paused = false;
            let highScore = parseInt(localStorage.getItem('snakeHigh') || '0');

            function spawnFood() {
                let pos;
                do {
                    pos = {x: Math.floor(Math.random()*W), y: Math.floor(Math.random()*H)};
                } while (snake.some(s => s.x === pos.x && s.y === pos.y));
                return pos;
            }

            let food = spawnFood();
            const foodIcons = ['◆','●','■','▲','★'];
            let foodIcon = pick(foodIcons);

            function render() {
                let board = '<span class="cmd-success">╔' + '═'.repeat(W) + '╗</span>\n';
                for (let y = 0; y < H; y++) {
                    let row = '<span class="cmd-success">║</span>';
                    for (let x = 0; x < W; x++) {
                        if (snake[0].x === x && snake[0].y === y) {
                            row += '<span class="cmd-success">@</span>';
                        } else if (snake.some(s => s.x === x && s.y === y)) {
                            row += '<span class="cmd-info">○</span>';
                        } else if (food.x === x && food.y === y) {
                            row += '<span class="cmd-error">' + foodIcon + '</span>';
                        } else {
                            row += ' ';
                        }
                    }
                    row += '<span class="cmd-success">║</span>';
                    board += row + '\n';
                }
                board += '<span class="cmd-success">╚' + '═'.repeat(W) + '╝</span>';

                const status = paused
                    ? '<span class="cmd-error">⏸ PAUSED</span> | P to resume | Q to quit'
                    : '<span class="cmd-info">WASD/Arrows</span> to move | P pause | Q quit';

                outputEl.innerHTML = '<span class="cmd-success">🐍 PACKET SNATCHER v1.0</span>  Score: <span class="cmd-info">' + score + '</span>  Hi: <span class="cmd-success">' + highScore + '</span>\n' + board + '\n' + status;
                const body = outputEl.closest('.terminal-bar-body');
                if (body) body.scrollTop = 0;
            }

            function tick() {
                if (paused) return;
                dir = {...nextDir};
                const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};

                // Wall wrap-around
                if (head.x < 0) head.x = W - 1;
                if (head.x >= W) head.x = 0;
                if (head.y < 0) head.y = H - 1;
                if (head.y >= H) head.y = 0;

                // Self collision
                if (snake.some(s => s.x === head.x && s.y === head.y)) {
                    endGame();
                    return;
                }

                snake.unshift(head);

                if (head.x === food.x && head.y === food.y) {
                    score += 10;
                    food = spawnFood();
                    foodIcon = pick(foodIcons);
                    // Speed up slightly every 50 points
                    if (score % 50 === 0 && speed > 80) {
                        speed -= 15;
                        clearInterval(gameInterval);
                        gameInterval = setInterval(tick, speed);
                    }
                } else {
                    snake.pop();
                }

                render();
            }

            function endGame() {
                clearInterval(gameInterval);
                snakeGame = null;
                activeGame = null;
                document.removeEventListener('keydown', handleGameKey);

                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('snakeHigh', String(score));
                }

                const msgs = [
                    `GAME OVER! You snatched ${score/10} packets.`,
                    `CRASH! Final payload: ${score} bytes.`,
                    `SEGFAULT! But you scored ${score} before dying.`,
                    `CONNECTION LOST. Score: ${score}`,
                ];
                outputEl.innerHTML += '\n\n<span class="cmd-error">' + pick(msgs) + '</span>';
                if (score > 0 && score >= highScore) {
                    outputEl.innerHTML += '\n<span class="cmd-success">🏆 NEW HIGH SCORE!</span>';
                }
                outputEl.innerHTML += '\n<span class="cmd-info">Type "snake" to play again.</span>\n';
                inputEl.focus();
            }

            function handleGameKey(e) {
                if (!snakeGame) return;
                const key = e.key;

                if (key === 'q' || key === 'Q') {
                    e.preventDefault();
                    clearInterval(gameInterval);
                    snakeGame = null;
                    activeGame = null;
                    document.removeEventListener('keydown', handleGameKey);
                    outputEl.innerHTML += '\n\n<span class="cmd-info">Game exited. Score: ' + score + '</span>\n';
                    inputEl.focus();
                    return;
                }

                if (key === 'p' || key === 'P') {
                    e.preventDefault();
                    paused = !paused;
                    render();
                    return;
                }

                const up = key === 'w' || key === 'W' || key === 'ArrowUp';
                const down = key === 's' || key === 'S' || key === 'ArrowDown';
                const left = key === 'a' || key === 'A' || key === 'ArrowLeft';
                const right = key === 'd' || key === 'D' || key === 'ArrowRight';

                if (up || down || left || right) e.preventDefault();

                if (up && dir.y !== 1) nextDir = {x:0, y:-1};
                if (down && dir.y !== -1) nextDir = {x:0, y:1};
                if (left && dir.x !== 1) nextDir = {x:-1, y:0};
                if (right && dir.x !== -1) nextDir = {x:1, y:0};
            }

            // Activate game
            inputEl.blur();
            snakeGame = true;
            activeGame = 'snake';
            document.addEventListener('keydown', handleGameKey);
            render();
            let gameInterval = setInterval(tick, speed);
        }

        // ── Hash Cracker Game ──
        function startCrackGame(outputEl, inputEl) {
            const target = Math.floor(Math.random() * 100) + 1;
            let attempts = 0;
            const maxAttempts = 7;
            const hash = '0x' + target.toString(16).padStart(2, '0').toUpperCase() + 'F'.repeat(6);

            activeGame = 'crack';
            outputEl.innerHTML = '<span class="cmd-success">🔐 HASH CRACKER v1.0</span>\n\n'
                + '  Target hash: <span class="cmd-info">' + hash + '</span>\n'
                + '  The plaintext is a number between 1-100.\n'
                + '  You have <span class="cmd-error">' + maxAttempts + '</span> attempts to crack it.\n\n'
                + '  <span class="cmd-info">Type a number and press Enter.</span> (Q to quit)\n';

            const origHandler = cmdInput.onkeydown;
            cmdInput.onkeydown = null;

            function crackHandler(e) {
                if (e.key !== 'Enter') return;
                const val = cmdInput.value.trim();
                cmdInput.value = '';
                if (!val) return;

                if (val.toLowerCase() === 'q') {
                    activeGame = null;
                    cmdInput.removeEventListener('keydown', crackHandler);
                    outputEl.innerHTML += '\n<span class="cmd-info">Cracking aborted.</span>\n';
                    return;
                }

                const guess = parseInt(val);
                if (isNaN(guess) || guess < 1 || guess > 100) {
                    outputEl.innerHTML += '<span class="cmd-error">  Invalid input. Enter 1-100.</span>\n';
                    return;
                }

                attempts++;
                const diff = Math.abs(guess - target);
                let hint;
                if (guess === target) {
                    activeGame = null;
                    cmdInput.removeEventListener('keydown', crackHandler);
                    const msgs = ['Hash cracked!', 'Decrypted!', 'Plaintext recovered!'];
                    outputEl.innerHTML += '\n<span class="cmd-success">  🚩 ' + pick(msgs) + ' The number was ' + target + '.</span>\n'
                        + '  Attempts: ' + attempts + '/' + maxAttempts + '\n';
                    if (attempts <= 3) outputEl.innerHTML += '  <span class="cmd-success">🏆 Elite hacker! Under 4 tries!</span>\n';
                    return;
                }

                if (diff <= 3) hint = '<span class="cmd-error">🔥 BURNING HOT</span>';
                else if (diff <= 8) hint = '<span class="cmd-error">🌶️ Hot</span>';
                else if (diff <= 15) hint = '<span class="cmd-info">🌤️ Warm</span>';
                else if (diff <= 30) hint = '<span class="cmd-info">☁️ Cool</span>';
                else hint = '<span class="cmd-success">❄️ Freezing cold</span>';

                const arrow = guess > target ? '▼' : '▲';
                outputEl.innerHTML += '  [' + attempts + '/' + maxAttempts + '] ' + guess + ' → ' + hint + ' ' + arrow + '\n';

                if (attempts >= maxAttempts) {
                    activeGame = null;
                    cmdInput.removeEventListener('keydown', crackHandler);
                    outputEl.innerHTML += '\n<span class="cmd-error">  💀 Brute force failed. The number was ' + target + '.</span>\n'
                        + '  <span class="cmd-info">Type "crack" to try again.</span>\n';
                }

                const body = outputEl.closest('.terminal-bar-body');
                if (body) body.scrollTop = body.scrollHeight;
            }

            cmdInput.addEventListener('keydown', crackHandler);
            inputEl.focus();
        }

        // ── Type Attack Game ──
        function startTypeAttack(outputEl, inputEl) {
            const words = [
                'nmap','sudo','grep','chmod','ping','curl','bash','root',
                'shell','hack','crack','sniff','port','scan','proxy',
                'worm','virus','patch','crypt','token','admin','brute',
                'fuzzing','payload','exploit','buffer','kernel','daemon',
                'firewall','rootkit','malware','reverse','overflow',
                'injection','phishing','forensic','incident','wireshark',
            ];

            let score = 0;
            let lives = 3;
            let level = 1;
            let currentWord = '';
            let wordsCleared = 0;
            let speed = 4000;
            let timeoutId = null;
            let highScore = parseInt(localStorage.getItem('typeHigh') || '0');

            activeGame = 'type';

            function nextWord() {
                if (lives <= 0) return;
                // Pick longer words as level increases
                const pool = words.filter(w => w.length <= 4 + level);
                currentWord = pick(pool.length ? pool : words);
                render();
                timeoutId = setTimeout(() => {
                    lives--;
                    wordsCleared++;
                    if (lives <= 0) { endTypeGame(); return; }
                    outputEl.innerHTML += '<span class="cmd-error">  ✗ MISSED: ' + currentWord + '</span>  [❤️'.repeat(lives) + ']\n';
                    const body = outputEl.closest('.terminal-bar-body');
                    if (body) body.scrollTop = body.scrollHeight;
                    nextWord();
                }, speed);
            }

            function render() {
                let header = '<span class="cmd-success">⌨️ TYPE ATTACK</span>  Score: <span class="cmd-info">' + score + '</span>  Hi: <span class="cmd-success">' + highScore + '</span>  Level: ' + level + '  ' + '❤️'.repeat(lives) + '\n\n';
                header += '  Type this: <span class="cmd-error">' + currentWord + '</span>\n';
                outputEl.innerHTML = header;
            }

            function endTypeGame() {
                activeGame = null;
                clearTimeout(timeoutId);
                cmdInput.removeEventListener('keydown', typeHandler);
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('typeHigh', String(score));
                }
                outputEl.innerHTML += '\n<span class="cmd-error">  GAME OVER!</span> Final score: <span class="cmd-info">' + score + '</span>\n';
                if (score >= highScore && score > 0) outputEl.innerHTML += '  <span class="cmd-success">🏆 NEW HIGH SCORE!</span>\n';
                outputEl.innerHTML += '  <span class="cmd-info">Type "type" to play again.</span>\n';
                inputEl.focus();
            }

            function typeHandler(e) {
                if (e.key !== 'Enter') return;
                const typed = cmdInput.value.trim().toLowerCase();
                cmdInput.value = '';
                if (!typed) return;

                if (typed === 'q') {
                    activeGame = null;
                    clearTimeout(timeoutId);
                    cmdInput.removeEventListener('keydown', typeHandler);
                    outputEl.innerHTML += '\n<span class="cmd-info">Game exited. Score: ' + score + '</span>\n';
                    inputEl.focus();
                    return;
                }

                if (typed === currentWord) {
                    clearTimeout(timeoutId);
                    score += currentWord.length * 10;
                    wordsCleared++;
                    outputEl.innerHTML += '<span class="cmd-success">  ✓ ' + currentWord + '</span> +' + (currentWord.length * 10) + '\n';
                    // Level up every 5 words
                    if (wordsCleared % 5 === 0) {
                        level++;
                        speed = Math.max(1200, speed - 400);
                        outputEl.innerHTML += '  <span class="cmd-info">⚡ Level ' + level + '! Speed up!</span>\n';
                    }
                    nextWord();
                } else {
                    outputEl.innerHTML += '<span class="cmd-error">  ✗ Wrong! Expected: ' + currentWord + '</span>\n';
                }
                const body = outputEl.closest('.terminal-bar-body');
                if (body) body.scrollTop = body.scrollHeight;
            }

            cmdInput.addEventListener('keydown', typeHandler);
            inputEl.focus();
            nextWord();
        }

        // ── Tic-Tac-Toe Game ──
        function startTTT(outputEl, inputEl) {
            let board = Array(9).fill(null);
            const HUMAN = 'X', AI = 'O';
            activeGame = 'ttt';

            function renderBoard() {
                const cell = (i) => {
                    if (board[i] === HUMAN) return '<span class="cmd-success">X</span>';
                    if (board[i] === AI) return '<span class="cmd-error">O</span>';
                    return '<span class="cmd-info">' + (i + 1) + '</span>';
                };
                let out = '<span class="cmd-success">❌ TIC-TAC-TOE</span>  You: <span class="cmd-success">X</span>  AI: <span class="cmd-error">O</span>\n\n';
                out += '   ' + cell(0) + ' │ ' + cell(1) + ' │ ' + cell(2) + '\n';
                out += '  ───┼───┼───\n';
                out += '   ' + cell(3) + ' │ ' + cell(4) + ' │ ' + cell(5) + '\n';
                out += '  ───┼───┼───\n';
                out += '   ' + cell(6) + ' │ ' + cell(7) + ' │ ' + cell(8) + '\n\n';
                out += '  <span class="cmd-info">Enter 1-9 to place X. Q to quit.</span>\n';
                outputEl.innerHTML = out;
            }

            const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

            function checkWin(player) {
                return wins.some(combo => combo.every(i => board[i] === player));
            }

            function isFull() {
                return board.every(c => c !== null);
            }

            // Simple AI: try to win, block, or pick best spot
            function aiMove() {
                // Try to win
                for (let i = 0; i < 9; i++) {
                    if (!board[i]) { board[i] = AI; if (checkWin(AI)) return i; board[i] = null; }
                }
                // Block human
                for (let i = 0; i < 9; i++) {
                    if (!board[i]) { board[i] = HUMAN; if (checkWin(HUMAN)) { board[i] = AI; return i; } board[i] = null; }
                }
                // Center
                if (!board[4]) { board[4] = AI; return 4; }
                // Corners
                const corners = [0,2,6,8].filter(i => !board[i]);
                if (corners.length) { const c = pick(corners); board[c] = AI; return c; }
                // Any
                const open = board.map((v,i) => v === null ? i : -1).filter(i => i >= 0);
                if (open.length) { const o = pick(open); board[o] = AI; return o; }
                return -1;
            }

            function tttHandler(e) {
                if (e.key !== 'Enter') return;
                const val = cmdInput.value.trim();
                cmdInput.value = '';
                if (!val) return;

                if (val.toLowerCase() === 'q') {
                    activeGame = null;
                    cmdInput.removeEventListener('keydown', tttHandler);
                    outputEl.innerHTML += '\n<span class="cmd-info">Game exited.</span>\n';
                    inputEl.focus();
                    return;
                }

                const pos = parseInt(val) - 1;
                if (isNaN(pos) || pos < 0 || pos > 8 || board[pos] !== null) {
                    renderBoard();
                    outputEl.innerHTML += '<span class="cmd-error">  Invalid move!</span>\n';
                    return;
                }

                board[pos] = HUMAN;
                if (checkWin(HUMAN)) {
                    activeGame = null;
                    cmdInput.removeEventListener('keydown', tttHandler);
                    renderBoard();
                    outputEl.innerHTML += '<span class="cmd-success">  🏆 You win! Impressive... for a human.</span>\n';
                    return;
                }
                if (isFull()) {
                    activeGame = null;
                    cmdInput.removeEventListener('keydown', tttHandler);
                    renderBoard();
                    outputEl.innerHTML += '<span class="cmd-info">  Draw! The only winning move is not to play.</span>\n';
                    return;
                }

                aiMove();
                if (checkWin(AI)) {
                    activeGame = null;
                    cmdInput.removeEventListener('keydown', tttHandler);
                    renderBoard();
                    outputEl.innerHTML += '<span class="cmd-error">  🤖 AI wins! Skynet sends its regards.</span>\n';
                    return;
                }
                if (isFull()) {
                    activeGame = null;
                    cmdInput.removeEventListener('keydown', tttHandler);
                    renderBoard();
                    outputEl.innerHTML += '<span class="cmd-info">  Draw! Stalemate in the matrix.</span>\n';
                    return;
                }

                renderBoard();
            }

            cmdInput.addEventListener('keydown', tttHandler);
            inputEl.focus();
            renderBoard();
        }

        cmdInput.addEventListener('keydown', (e) => {
            if (snakeGame) { e.preventDefault(); return; }
            if (activeGame) return; // other games handle their own input
            if (e.key !== 'Enter') return;
            const raw = cmdInput.value.trim();
            if (!raw) return;

            const [cmd, ...rest] = raw.split(/\s+/);
            const args = rest.join(' ');

            output.innerHTML += `\n<span class="cmd-info">$</span> ${raw}\n`;

            if (commands[cmd]) {
                const result = commands[cmd](args);
                if (result) output.innerHTML += result + '\n';
            } else {
                output.innerHTML += `<span class="cmd-error">command not found: ${cmd}</span>\n`;
            }

            cmdInput.value = '';
            const body = output.closest('.terminal-bar-body');
            if (body) body.scrollTop = body.scrollHeight;
        });
    }

    // ── Konami Code ──
    function initKonamiCode() {
        const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let pos = 0;
        const popup = document.getElementById('konamiPopup');
        const closeBtn = document.getElementById('konamiClose');
        if (!popup) return;

        document.addEventListener('keydown', (e) => {
            if (e.key === sequence[pos]) {
                pos++;
                if (pos === sequence.length) {
                    popup.classList.add('active');
                    pos = 0;
                }
            } else {
                pos = 0;
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => popup.classList.remove('active'));
        }
        popup.addEventListener('click', (e) => {
            if (e.target === popup) popup.classList.remove('active');
        });
    }

    // ── Status Bar ──
    function initStatusBar() {
        const scrollEl = document.getElementById('statusBarScroll');
        const timeEl = document.getElementById('statusBarTime');
        const sectionEl = document.getElementById('statusBarSection');
        if (!scrollEl || !timeEl) return;

        // Scroll percentage
        function updateScroll() {
            const h = document.documentElement;
            const pct = Math.round((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100) || 0;
            scrollEl.textContent = pct + '%';
        }

        // Current section tracking
        function updateSection() {
            if (!sectionEl) return;
            const sections = document.querySelectorAll('main > section[id]');
            let current = 'about';
            sections.forEach(s => {
                const rect = s.getBoundingClientRect();
                if (rect.top <= 200) current = s.id;
            });
            sectionEl.textContent = '~/' + current;
        }

        // Time
        function updateTime() {
            const now = new Date();
            timeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        }

        window.addEventListener('scroll', () => { updateScroll(); updateSection(); }, { passive: true });
        setInterval(updateTime, 10000);
        updateScroll();
        updateSection();
        updateTime();
    }

    // ── Init All ──
    document.addEventListener('DOMContentLoaded', () => {
        injectAsciiDividers();
        initTerminalBar();
        initKonamiCode();
        initStatusBar();
    });

})();
