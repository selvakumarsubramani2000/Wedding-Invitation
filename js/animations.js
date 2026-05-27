/**
 * Scroll Animations using Intersection Observer
 * Handles fade-in, scale, and slide animations
 */

// ===== INTERSECTION OBSERVER CONFIGURATION =====
const observerOptions = {
  root: null, // viewport
  rootMargin: '0px',
  threshold: 0.15 // Trigger when 15% of element is visible
};

// ===== CREATE OBSERVER =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Add visible class when element enters viewport
      entry.target.classList.add('visible');
      
      // Optional: Stop observing after animation (performance optimization)
      // Uncomment if you want animation to happen only once
      // observer.unobserve(entry.target);
    } else {
      // Optional: Remove visible class when element leaves viewport
      // This allows re-animation when scrolling back up
      // Comment out if you want animation to happen only once
      entry.target.classList.remove('visible');
    }
  });
}, observerOptions);

// ===== OBSERVE ALL ANIMATED ELEMENTS =====
function initScrollAnimations() {
  // Select all elements with animation classes
  const animatedElements = document.querySelectorAll(
    '.fade-in, .fade-in-left, .fade-in-right, .scale-in'
  );
  
  // Observe each element
  animatedElements.forEach(element => {
    observer.observe(element);
  });
  
  console.log(`Observing ${animatedElements.length} elements for scroll animations`);
}

// ===== STAGGER ANIMATION FOR LISTS =====
function staggerAnimation(selector, delay = 100) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element, index) => {
    // Add increasing delay to each element
    element.style.transitionDelay = `${index * delay}ms`;
  });
}

// Apply stagger to couple cards
staggerAnimation('.couple__card', 200);

// Apply stagger to event items
staggerAnimation('.event__item', 150);

// Apply stagger to countdown items
staggerAnimation('.countdown__item', 100);

// ===== HERO PARTICLES ANIMATION =====
function animateParticles() {
  const particles = document.querySelectorAll('.particle');
  
  particles.forEach((particle, index) => {
    // Randomize animation duration
    const duration = 5 + Math.random() * 3; // 5-8 seconds
    particle.style.animationDuration = `${duration}s`;
    
    // Randomize animation delay
    const delay = index * 0.5; // 0s, 0.5s, 1s, 1.5s
    particle.style.animationDelay = `${delay}s`;
  });
}

animateParticles();

// ===== ADD SCROLL-TRIGGERED CLASSES =====
// Add a class to body when user has scrolled
let hasScrolled = false;

window.addEventListener('scroll', () => {
  if (!hasScrolled && window.pageYOffset > 100) {
    document.body.classList.add('scrolled');
    hasScrolled = true;
  } else if (hasScrolled && window.pageYOffset <= 100) {
    document.body.classList.remove('scrolled');
    hasScrolled = false;
  }
});

// ===== INITIALIZE ANIMATIONS ON DOM LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
});

// ===== MANUAL TRIGGER ANIMATION =====
// Function to manually trigger animation on an element
window.triggerAnimation = function(elementId, animationClass = 'fade-in') {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.add(animationClass);
    setTimeout(() => {
      element.classList.add('visible');
    }, 50);
  }
};

// ===== PERFORMANCE: REDUCE MOTION FOR USERS WHO PREFER IT =====
// Respect user's motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Disable animations for users who prefer reduced motion
  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  `;
  document.head.appendChild(style);
  
  console.log('Reduced motion mode enabled');
}

console.log('Scroll animations initialized ✨');
