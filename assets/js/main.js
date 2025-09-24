// iOS 17 Style Jekyll Site JavaScript
// Handles language switching, mobile navigation, and smooth animations

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLanguageSwitcher();
    initMobileNavigation();
    initScrollAnimations();
    initSmoothScrolling();
    initThemeDetection();
});

// Language Switcher Functionality
function initLanguageSwitcher() {
    const languageSwitcher = document.querySelector('.language-switcher');
    if (!languageSwitcher) return;
    
    const dropdownToggle = languageSwitcher.querySelector('.dropdown-toggle');
    const dropdownMenu = languageSwitcher.querySelector('.dropdown-menu');
    
    if (!dropdownToggle || !dropdownMenu) return;
    
    // Toggle dropdown on click
    dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = dropdownMenu.classList.contains('show');
        
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!languageSwitcher.contains(e.target)) {
            closeDropdown();
        }
    });
    
    // Close dropdown on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDropdown();
        }
    });
    
    function openDropdown() {
        dropdownMenu.classList.add('show');
        dropdownToggle.setAttribute('aria-expanded', 'true');
        
        // Focus first menu item for accessibility
        const firstLink = dropdownMenu.querySelector('a');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    }
    
    function closeDropdown() {
        dropdownMenu.classList.remove('show');
        dropdownToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Handle keyboard navigation in dropdown
    dropdownMenu.addEventListener('keydown', function(e) {
        const links = Array.from(dropdownMenu.querySelectorAll('a'));
        const currentIndex = links.indexOf(document.activeElement);
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % links.length;
                links[nextIndex].focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : links.length - 1;
                links[prevIndex].focus();
                break;
            case 'Tab':
                if (e.shiftKey && currentIndex === 0) {
                    closeDropdown();
                    dropdownToggle.focus();
                } else if (!e.shiftKey && currentIndex === links.length - 1) {
                    closeDropdown();
                }
                break;
        }
    });
}

// Mobile Navigation Functionality
function initMobileNavigation() {
    const navTrigger = document.querySelector('.nav-trigger');
    const menuIcon = document.querySelector('.menu-icon');
    const trigger = document.querySelector('.site-nav .trigger');
    const body = document.body;
    
    if (!navTrigger || !menuIcon || !trigger) return;
    
    // Toggle mobile menu
    menuIcon.addEventListener('click', function(e) {
        e.preventDefault();
        
        const isOpen = navTrigger.checked;
        navTrigger.checked = !isOpen;
        
        // Prevent body scroll when menu is open
        if (!isOpen) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
        
        // Update ARIA attributes
        menuIcon.setAttribute('aria-expanded', (!isOpen).toString());
    });
    
    // Close mobile menu when clicking on links
    const mobileLinks = trigger.querySelectorAll('.page-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            navTrigger.checked = false;
            body.style.overflow = '';
            menuIcon.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navTrigger.checked) {
            navTrigger.checked = false;
            body.style.overflow = '';
            menuIcon.setAttribute('aria-expanded', 'false');
            menuIcon.focus();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navTrigger.checked) {
            navTrigger.checked = false;
            body.style.overflow = '';
            menuIcon.setAttribute('aria-expanded', 'false');
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length === 0) return;
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Show all elements immediately if user prefers reduced motion
        animatedElements.forEach(el => el.classList.add('in-view'));
        return;
    }
    
    // Create intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
                
                // Focus target for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    });
}

// Theme Detection and System Preference Handling
function initThemeDetection() {
    // Listen for system theme changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Handle theme change
    function handleThemeChange(e) {
        // Add a subtle transition effect when theme changes
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        // Remove transition after animation completes
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    // Listen for changes
    darkModeMediaQuery.addEventListener('change', handleThemeChange);
}

// Utility Functions

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Enhanced scroll performance
let ticking = false;

function updateScrollPosition() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const header = document.querySelector('.site-header');
    
    if (header) {
        // Add subtle header background opacity based on scroll
        const opacity = Math.min(scrollTop / 100, 1);
        header.style.setProperty('--header-opacity', opacity);
    }
    
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
    }
});

// Add loading state management
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger any delayed animations
    const delayedElements = document.querySelectorAll('[data-delay]');
    delayedElements.forEach(el => {
        const delay = parseInt(el.dataset.delay) || 0;
        setTimeout(() => {
            el.classList.add('animate');
        }, delay);
    });
});

// Error handling for missing elements
function safeQuerySelector(selector, context = document) {
    try {
        return context.querySelector(selector);
    } catch (e) {
        console.warn(`Invalid selector: ${selector}`);
        return null;
    }
}

function safeQuerySelectorAll(selector, context = document) {
    try {
        return context.querySelectorAll(selector);
    } catch (e) {
        console.warn(`Invalid selector: ${selector}`);
        return [];
    }
}

// Export functions for potential external use
window.PeersTouchSite = {
    initLanguageSwitcher,
    initMobileNavigation,
    initScrollAnimations,
    initSmoothScrolling,
    debounce,
    throttle
};