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
    const mainContent = document.querySelector('.main-content');
    const sidebarHeader = document.querySelector('.sidebar-header');
    const logo = document.querySelector('.logo');
    const subtitle = document.querySelector('.subtitle');
    const nav = document.querySelector('.nav');
    const navUl = document.querySelector('.nav ul');
    const navItems = document.querySelectorAll('.nav li');
    const sidebarSocial = document.querySelector('.sidebar-social');
    const themeToggle = document.querySelector('.theme-toggle');
    
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
            sidebar.classList.remove('active');
            menuButton.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Reset any style changes
            if (sidebarHeader) sidebarHeader.style.display = '';
            if (logo) logo.style.display = '';
            if (subtitle) subtitle.style.display = '';
            if (sidebarSocial) sidebarSocial.style.display = '';
            if (themeToggle) themeToggle.style.display = '';
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
                        
                        // Apply theme-appropriate styling with specific colors
                        const isDarkTheme = document.body.classList.contains('dark-theme');
                        if (isDarkTheme) {
                            logo.style.backgroundColor = 'rgba(8, 15, 30, 0.85)'; // Darker navy to match theme
                            logo.style.textShadow = '0 0 3px rgba(0, 255, 255, 0.3)';
                            logo.style.color = '#ffffff';
                        } else {
                            logo.style.backgroundColor = 'rgba(240, 240, 240, 0.9)';
                            logo.style.textShadow = '0 0 3px rgba(0, 100, 255, 0.3)';
                            logo.style.color = '#333333';
                        }
                        
                        // Disable glitch effect for mobile
                        const beforePseudo = document.createElement('style');
                        beforePseudo.innerHTML = `.sidebar.active .logo.glitch-name::before, .sidebar.active .logo.glitch-name::after { display: none !important; }`;
                        document.head.appendChild(beforePseudo);
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
                    nav.style.display = 'block';
                    nav.style.width = '100%';
                    nav.style.paddingTop = '80px';
                    nav.style.paddingBottom = '60px';
                    nav.style.margin = '0';
                    
                    // Ensure all navigation items are visible
                    navUl.style.display = 'block';
                    navUl.style.height = 'auto';
                    navUl.style.overflow = 'visible';
                    navUl.style.margin = '0';
                    navUl.style.padding = '0 1.5rem';
                    
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
                    
                    // Ensure navigation links are clickable
                    fixMobileNavigation();
                    
                    // Hide social links in mobile view only
                    if (sidebarSocial && window.innerWidth <= 768) {
                        sidebarSocial.style.display = 'none';
                        sidebarSocial.style.opacity = '0';
                        sidebarSocial.style.visibility = 'hidden';
                    }
                    
                    // Position theme toggle button at bottom left - revert to original
                    if (themeToggle) {
                        themeToggle.style.position = 'fixed';
                        themeToggle.style.bottom = '20px';
                        themeToggle.style.left = '20px';
                        themeToggle.style.zIndex = '10010';
                        themeToggle.style.width = '40px';
                        themeToggle.style.height = '40px';
                        themeToggle.style.backgroundColor = 'transparent';
                        themeToggle.style.padding = '10px';
                        themeToggle.style.borderRadius = '50%';
                        themeToggle.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.3)';
                        themeToggle.style.display = 'flex';
                        themeToggle.style.alignItems = 'center';
                        themeToggle.style.justifyContent = 'center';
                    }
                    
                    // Hide any possible footer elements in mobile only
                    const sidebarFooter = sidebar.querySelector('.sidebar-footer');
                    if (sidebarFooter && window.innerWidth <= 768) {
                        sidebarFooter.style.display = 'none';
                        sidebarFooter.style.opacity = '0';
                        sidebarFooter.style.visibility = 'hidden';
                    }
                    
                    // Log for debugging
                    console.log('Mobile menu toggled on - simplified layout');
                } else {
                    // Reset styles when closed
                    console.log('Mobile menu toggled off');
                }
            } else {
                // If in desktop view, make sure styles are reset
                resetDesktopStyles();
            }
        });
        
        // Reset styles on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                // Reset styles for desktop view to ensure desktop view is not affected
                nav.style = '';
                logo.style = '';
                subtitle.style = '';
                navUl.style = '';
                
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
                if (themeToggle) themeToggle.style = '';
            }
        });
    }
})();

// Custom cursor follower
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    // This can be safely removed
});

document.addEventListener('mouseout', () => {
    // This can be safely removed
});

// Mobile menu functionality
function initMobileMenu() {
    // Keep this for backward compatibility, but our immediate initializer above will handle the functionality
    console.log('Legacy mobile menu initialization - already handled');
}

// Apply hover effect on all interactive elements
const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .image-wrapper, .arena-card'); // Added arena-card to interactive elements

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        if (window.innerWidth <= 768) return;
        
        if (element.classList.contains('project-card') || element.classList.contains('image-wrapper')) {
            cursorFollower.classList.add('active');
            cursorFollower.classList.add('link-hover');
        } else {
            cursorFollower.classList.add('active');
        }
    });
    
    element.addEventListener('mouseleave', () => {
        if (window.innerWidth <= 768) return;
        
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
        
        window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
        });
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
    const columns = Math.floor(width / fontSize);
    
    // Create drops array
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -height);
    }
    
    // Low opacity to create trail effect
    ctx.fillStyle = 'rgba(10, 25, 47, 0.05)';
    ctx.fillRect(0, 0, width, height);
    
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
        matrixInterval = setInterval(draw, 50);
    });
}

// Initialize the matrix effect with a slight delay
setTimeout(() => {
    createMatrixEffect();
}, 1000);

// Add terminal typing effect for the hero section text
function typeWriter(element, text, speed) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Apply typing effect to multiple hero elements in sequence
const heroElements = [
    document.querySelector('.hero-greeting'),
    document.querySelector('.hero h2'),
    document.querySelector('.hero p')
];

if (heroElements[0]) {
    window.addEventListener('load', () => {
        const texts = heroElements.map(el => el.textContent);
        const speeds = [50, 40, 30];
        
        heroElements.forEach(el => {
            el.textContent = '';
            el.style.opacity = 0;
        });
        
        let currentIndex = 0;
        
        function typeNextElement() {
            if (currentIndex < heroElements.length) {
                const element = heroElements[currentIndex];
                const text = texts[currentIndex];
                const speed = speeds[currentIndex];
                
                element.style.opacity = 1;
                
                let i = 0;
                function typeElement() {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                        setTimeout(typeElement, speed);
                    } else {
                        currentIndex++;
                        setTimeout(typeNextElement, 500);
                    }
                }
                
                typeElement();
            }
        }
        
        typeNextElement();
    });
}

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
        z-index: -2;
        opacity: 0.15;
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
    // Initialize loading screen first
    initLoadingScreen();
    
    // Initialize all other components after loading screen disappears
    setTimeout(() => {
        initTypingEffect();
        initScrollReveal();
        initMobileMenu();
        
        // Remove the cyber cursor initialization
        // initCyberCursor();
        
        // Init theme switcher
        initThemeSwitcher();
        
        // Initialize projects load more functionality
        initProjectsLoadMore();
        
        // Skills animation removed - no longer needed for comma-separated list
        // initSkillsAnimation();
    }, 500);
}

// Remove any duplicate event listeners and use only this one
document.addEventListener('DOMContentLoaded', initializeAll);

// Typewriter effect for cybersecurity quotes
const typingTextElement = document.getElementById('typingText');
const securityQuotes = [
    "\"The important thing is not to stop questioning. Curiosity has its own reason for existing.\" — Albert Einstein",
    "Technology can't solve security problems, but it can help",
    "Where others see function, I see attack vectors waiting to be secured",
    "Attack and defense are entangled in a dance of death",
    "Solving the issues that keeps CISOs up at night",
    "In a world of black hats, be the white hat with the skill to match",
    "Cybersecurity is a mindset, not a product",
    "Research is creating new knowledge, opening new perspectives",
];

let quoteIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100; // Delay between each character typing
let newTextDelay = 2000; // Delay before starting to delete text
let deletingDelay = 50; // Delay between each character deletion

function typeQuote() {
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
    
    setTimeout(typeQuote, typingDelay);
}

// Name transition between real name and cybersec handle
const nameElement = document.querySelector('.glitch-name');
let isRealName = true;
const realName = "Durjoy Majumdar";
const hackerHandle = "AsokaKrsna";

function transitionName() {
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
        const scrambleInterval = setInterval(() => {
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
                    clearInterval(scrambleInterval);
                    nameElement.textContent = targetText;
                    nameElement.setAttribute('data-text', targetText);
                    isRealName = false;
                    setTimeout(transitionName, 10000); // Switch back after 10 seconds
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
        
        const scrambleInterval = setInterval(() => {
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
                    clearInterval(scrambleInterval);
                    nameElement.textContent = targetText;
                    nameElement.setAttribute('data-text', targetText);
                    isRealName = true;
                    setTimeout(transitionName, 10000); // Switch back after 10 seconds
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
    // Start typewriter effect
    setTimeout(typeQuote, 1000);
    
    // Start name transition effect
    setTimeout(transitionName, 3000);
});

// Cyber Cursor Effect - removing entire function
function initCyberCursor() {
    // Function content can be safely removed
    console.log("Cursor effect disabled");
}

// Theme Switcher
function initThemeSwitcher() {
    console.log("Theme switcher initializing...");
    const themeSwitch = document.getElementById('theme-switch');
    
    if (!themeSwitch) {
        console.error("Theme switch element not found!");
        return;
    }
    
    console.log("Found theme switch element:", themeSwitch);
    
    // Check for saved theme preference or use preferred color scheme
    const currentTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    console.log("Current theme from localStorage:", currentTheme);
    console.log("System prefers dark mode:", prefersDarkScheme.matches);
    
    // If theme is saved in localStorage, use that
    if (currentTheme) {
        if (currentTheme === 'light') {
            console.log("Setting light theme from localStorage");
            document.body.setAttribute('data-theme', 'light');
            themeSwitch.checked = true;
            
            // Fix skills visibility on initial page load in light theme
            setTimeout(() => {
                ensureSkillsVisibility();
            }, 100);
        } else {
            console.log("Setting dark theme from localStorage");
            document.body.removeAttribute('data-theme');
            themeSwitch.checked = false;
        }
    } 
    // Otherwise use system preference
    else {
        if (!prefersDarkScheme.matches) {
            console.log("Setting light theme from system preference");
            document.body.setAttribute('data-theme', 'light');
            themeSwitch.checked = true;
            localStorage.setItem('theme', 'light');
            
            // Fix skills visibility on initial page load in light theme
            setTimeout(() => {
                ensureSkillsVisibility();
            }, 100);
        } else {
            console.log("Setting dark theme from system preference");
            document.body.removeAttribute('data-theme');
            themeSwitch.checked = false;
            localStorage.setItem('theme', 'dark');
        }
    }
    
    // Helper function to ensure skills are visible in light theme
    function ensureSkillsVisibility() {
        const skillsLists = document.querySelectorAll('.skills-list');
        skillsLists.forEach(list => {
            list.style.color = '#333333';
            list.style.visibility = 'visible';
        });
        
        const skillsHeadings = document.querySelectorAll('.skills-category h3');
        skillsHeadings.forEach(heading => {
            heading.style.color = '#222222';
            heading.style.visibility = 'visible';
        });
        
        // Fix for Cyber Arena visibility in light theme
        const arenaLists = document.querySelectorAll('.arena-list li');
        arenaLists.forEach(item => {
            item.style.color = '#333333';
            item.style.visibility = 'visible';
        });
        
        const arenaTitles = document.querySelectorAll('.arena-title');
        arenaTitles.forEach(title => {
            title.style.color = '#222222';
            title.style.visibility = 'visible';
        });
        
        const arenaLinks = document.querySelectorAll('.arena-link');
        arenaLinks.forEach(link => {
            link.style.color = '#007bff';
            link.style.visibility = 'visible';
        });
        
        const arenaIntro = document.querySelector('.arena-intro');
        if (arenaIntro) {
            arenaIntro.style.color = '#333333';
            arenaIntro.style.visibility = 'visible';
        }
        
        // Fix for Education section visibility in light theme
        const educationHeaders = document.querySelectorAll('.education-header h3');
        educationHeaders.forEach(header => {
            header.style.color = '#222222';
            header.style.fontWeight = '600';
            header.style.visibility = 'visible';
        });
        
        const educationLocations = document.querySelectorAll('.education-location');
        educationLocations.forEach(location => {
            location.style.color = '#333333';
            location.style.visibility = 'visible';
        });
        
        const educationDates = document.querySelectorAll('.education-date');
        educationDates.forEach(date => {
            date.style.color = '#007bff';
            date.style.visibility = 'visible';
        });
        
        const educationDescriptions = document.querySelectorAll('.education-item p');
        educationDescriptions.forEach(desc => {
            desc.style.color = '#333333';
            desc.style.visibility = 'visible';
        });
    }
    
    // Add transition class after initial theme is set
    setTimeout(() => {
        document.body.classList.add('theme-transition');
    }, 100);
    
    // Toggle theme when switch is clicked
    themeSwitch.addEventListener('change', function() {
        console.log("Theme switch clicked, checked state:", this.checked);
        
        if (this.checked) {
            console.log("Switching to light theme");
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            console.log("Is data-theme attribute set?", document.body.hasAttribute('data-theme'));
            console.log("data-theme value:", document.body.getAttribute('data-theme'));
            
            // Fix for skills section visibility in light theme
            setTimeout(() => {
                ensureSkillsVisibility();
            }, 50);
        } else {
            console.log("Switching to dark theme");
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            console.log("Is data-theme attribute set?", document.body.hasAttribute('data-theme'));
            
            // Reset inline styles when switching back to dark theme
            setTimeout(() => {
                resetDarkThemeStyles();
            }, 50);
        }
        
        // Add a subtle animation effect on theme change
        document.body.classList.add('theme-changing');
        setTimeout(() => {
            document.body.classList.remove('theme-changing');
        }, 700); // Match with CSS transition timing
    });
    
    // Function to reset styles when switching to dark theme
    function resetDarkThemeStyles() {
        // Reset Skills section
        const skillsElements = document.querySelectorAll('.skills-list, .skills-category h3');
        skillsElements.forEach(el => {
            el.style.color = '';
            el.style.visibility = '';
            el.style.fontWeight = '';
        });
        
        // Reset Cyber Arena section
        const arenaElements = document.querySelectorAll('.arena-list li, .arena-title, .arena-link, .arena-intro');
        arenaElements.forEach(el => {
            el.style.color = '';
            el.style.visibility = '';
            el.style.fontWeight = '';
        });
        
        // Reset Education section
        const educationElements = document.querySelectorAll('.education-header h3, .education-location, .education-date, .education-item p');
        educationElements.forEach(el => {
            el.style.color = '';
            el.style.visibility = '';
            el.style.fontWeight = '';
        });
    }
    
    // Log current state
    console.log("Current theme switch state:", themeSwitch.checked);
    console.log("Body has data-theme attribute:", document.body.hasAttribute('data-theme'));
    if (document.body.hasAttribute('data-theme')) {
        console.log("data-theme value:", document.body.getAttribute('data-theme'));
    }
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

// Add a direct theme toggle initialization to ensure it's working
(function() {
    console.log("Direct theme toggle initialization starting");
    const themeSwitch = document.getElementById('theme-switch');
    
    if (!themeSwitch) {
        console.error("Theme switch not found in direct initialization");
        return;
    }
    
    console.log("Found theme switch in direct initialization");
    
    // Set up click handler directly
    themeSwitch.addEventListener('click', function() {
        console.log("Theme switch clicked directly");
        if (this.checked) {
            console.log("Setting light theme directly");
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            console.log("Setting dark theme directly");
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Set initial state
    const savedTheme = localStorage.getItem('theme');
    console.log("Saved theme in direct initialization:", savedTheme);
    
    if (savedTheme === 'light') {
        themeSwitch.checked = true;
        document.body.setAttribute('data-theme', 'light');
    } else {
        themeSwitch.checked = false;
        document.body.removeAttribute('data-theme');
    }
})();

// Loading Screen Animation
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    const bootText = document.getElementById('boot-text');
    const bootProgress = document.getElementById('boot-progress');
    
    if (!loadingScreen || !bootText || !bootProgress) {
        console.error('Loading screen elements not found');
        return;
    }

    // Check if this is a returning visitor
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    let bootSpeed = 1; // Default speed multiplier
    
    if (hasVisited) {
        // For returning visitors, speed up the process
        bootSpeed = 3;
        lineDelay = 30; // Faster typing for returning visitors
    } else {
        // First time visitor - set the flag
        localStorage.setItem('hasVisitedBefore', 'true');
    }

    // Initialize boot text content
    let bootSequence = `SecureBoot v1.0.7 - Cybersecurity Portfolio Initialization
Copyright (c) 2023 Durjoy Defense Systems

[+] Initializing system components...
[+] Loading memory modules..................... [OK]
[+] Checking CPU status....................... [OK]
[+] Initializing network interfaces........... [OK]
[+] Loading kernel modules.................... [OK]
[+] Verifying system integrity................ [OK]
[+] Scanning for malware...................... [CLEAR]
[+] Checking for rootkits.................... [NONE DETECTED]
[+] Setting up firewall rules................. [ACTIVE]
[+] Establishing secure connection............ [ENCRYPTED]
[+] Initializing intrusion detection system... [RUNNING]
[+] Loading portfolio assets.................. [IN PROGRESS]

> Starting cybersecurity portfolio interface...
> Loading encryption protocols...
> Establishing secure environment...
> Mounting project repositories...
> Initializing skills database...
> Loading experience modules...
> Finalizing profile configuration...

System ready. Welcome, user.
SecureOS loaded successfully. Launching portfolio in 3...2...1...`;

    // For returning visitors, show a shortened version
    if (hasVisited) {
        bootSequence = `SecureBoot v1.0.7 - Quick Load Sequence
[+] Resuming from cached session...
[+] Verifying system integrity...... [OK]
[+] Quick security scan............. [CLEAR]
[+] Loading portfolio assets........ [IN PROGRESS]

> Launching portfolio interface...
Welcome back, user.
Launching portfolio...`;
    }

    // Typewriter effect variables
    let charIndex = 0;
    let lineDelay = hasVisited ? 30 : 80; // milliseconds between characters
    
    // Progress bar variables
    let progressValue = 0;
    let progressTarget = 100;
    let progressStep = hasVisited ? 1.5 : 0.5;
    
    // Function to simulate terminal typing
    function typeText() {
        if (charIndex < bootSequence.length) {
            // Add one character at a time
            bootText.innerHTML = bootSequence.substring(0, charIndex) + '<span class="blink">▋</span>';
            charIndex++;
            
            // Speed up typing based on character
            let nextDelay = lineDelay;
            if (bootSequence.charAt(charIndex-1) === '.') {
                nextDelay = hasVisited ? 10 : 30; // type dots faster
            } else if (bootSequence.charAt(charIndex-1) === '\n') {
                nextDelay = hasVisited ? 100 : 300; // pause at new lines
                
                // Update progress on each new line
                progressValue += progressStep * 5;
                if (progressValue > progressTarget) progressValue = progressTarget;
                bootProgress.style.width = `${progressValue}%`;
            }
            
            setTimeout(typeText, nextDelay / bootSpeed);
        } else {
            // Typing complete, finish progress bar
            bootProgress.style.width = '100%';
            
            // Wait a moment then hide loading screen
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                
                // Remove from DOM after transition
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, hasVisited ? 300 : 1000);
        }
    }
    
    // Start typing with a small initial delay
    setTimeout(typeText, hasVisited ? 200 : 600);
    
    // Gradually increase progress bar
    function updateProgressBar() {
        if (progressValue < progressTarget) {
            progressValue += progressStep;
            bootProgress.style.width = `${progressValue}%`;
            setTimeout(updateProgressBar, hasVisited ? 50 : 100);
        }
    }
    
    // Start progress bar animation
    setTimeout(updateProgressBar, hasVisited ? 200 : 600);
}

// Blog View More functionality
document.addEventListener('DOMContentLoaded', function() {
    const blogItems = document.querySelectorAll('.blog-card');
    const viewMoreBtn = document.getElementById('view-more-blogs');
    const ITEMS_PER_LOAD = 5;
    let currentlyShown = ITEMS_PER_LOAD;
    
    // Initially hide all but the first 5 blog items
    if (blogItems.length > ITEMS_PER_LOAD) {
        for (let i = ITEMS_PER_LOAD; i < blogItems.length; i++) {
            blogItems[i].style.display = 'none';
        }
        
        // Show the view more button
        viewMoreBtn.style.display = 'block';
    } else {
        // Hide the view more button if there are 5 or fewer items
        viewMoreBtn.style.display = 'none';
    }
    
    // Handle click event on the view more button
    viewMoreBtn.addEventListener('click', function() {
        // Show the next batch of items
        for (let i = currentlyShown; i < Math.min(currentlyShown + ITEMS_PER_LOAD, blogItems.length); i++) {
            blogItems[i].style.display = 'flex';
            blogItems[i].style.opacity = '0';
            
            // Fade in the newly displayed items
            setTimeout(() => {
                blogItems[i].style.transition = 'opacity 0.5s ease';
                blogItems[i].style.opacity = '1';
            }, 50);
        }
        
        // Update the count of displayed items
        currentlyShown = Math.min(currentlyShown + ITEMS_PER_LOAD, blogItems.length);
        
        // Hide the view more button if all items are now displayed
        if (currentlyShown >= blogItems.length) {
            viewMoreBtn.style.display = 'none';
        }
    });
});

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
        
        // Hide the button if not enough projects
        if (projectCards.length <= projectsPerPage) {
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

// Initialize everything when the DOM is loaded
function init() {
    // Apply smooth scrolling to navigation links
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const yOffset = -80; // Adjust this value as needed
                const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        });
    });
    
    // Mobile menu is now handled by the immediate initializer at the top of the file
    // No need to duplicate the functionality here
    
    // Initialize typing effect
    initTypingEffect();
    
    // Initialize loading animation for elements
    initLoadingAnimation();
    
    // Initialize projects "Load More" functionality
    initProjectsLoadMore();
    
    // Initialize research "See More" functionality
    initResearchLoadMore();
    
    // Initialize blog "View More" functionality
    initBlogViewMore();
}

// Initialize once DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Typing effect for sidebar description
function initTypingEffect() {
    const typingText = document.getElementById('typingText');
    if (!typingText || typingText.hasAttribute('data-typing-initialized')) return;
    
    typingText.setAttribute('data-typing-initialized', 'true');
    const text = typingText.textContent.trim();
    typingText.textContent = '';
    typingText.style.visibility = 'visible';
    
    let i = 0;
    const speed = 50; // typing speed in milliseconds
    
    function typeWriter() {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    
    // Start typing after a short delay
    setTimeout(typeWriter, 1000);
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
    const viewMoreButton = document.getElementById('view-more-blogs');
    
    if (!viewMoreButton || blogCards.length === 0) return;
    
    const initialVisibleCount = 5; // Show first 5 blog posts initially
    
    // Initially hide blog cards after the initial visible count
    blogCards.forEach((card, index) => {
        if (index >= initialVisibleCount) {
            card.style.display = 'none';
        }
    });
    
    // Add click event to the View More button
    viewMoreButton.addEventListener('click', () => {
        blogCards.forEach(card => {
            card.style.display = 'block';
        });
        
        // Hide the button after showing all blogs
        viewMoreButton.style.display = 'none';
        
        console.log(
            '%c[Blogs] %cAll blog posts are now visible',
            'color: #4dfcff; font-weight: bold;',
            'color: white;'
        );
    });
} 


// Enhanced hover effect for Cyber Arena cards
document.querySelectorAll('.arena-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.setAttribute('data-hover', 'true');
    });
    
    card.addEventListener('mouseleave', function() {
        this.removeAttribute('data-hover');
    });
});

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

// Call the fix navigation function on page load
document.addEventListener('DOMContentLoaded', () => {
    fixMobileNavigation();
});

// Call it again on window resize to ensure it works after resizing
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        fixMobileNavigation();
    }
});

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

// Call this on page load to ensure desktop view is clean
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 768) {
        resetDesktopStyles();
    }
});

// Reset styles on page load and whenever window resizes to desktop size
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        resetDesktopStyles();
    }
});
