/**
 * Main Application JavaScript
 * Handles splash screen, loading, music, and navigation
 */

// ===== DOM ELEMENTS =====
const loadingScreen = document.getElementById('loadingScreen');
const splashOverlay = document.getElementById('splashOverlay');
const enterBtn = document.getElementById('enterBtn');
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');

// ===== STATE =====
let isMusicPlaying = false;

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 1500);
});

// ===== SPLASH SCREEN & MUSIC =====
// Enter button click handler
enterBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  enterSite();
});

// Splash overlay click handler (anywhere on splash)
splashOverlay.addEventListener('click', (e) => {
  // Only trigger if clicking the overlay itself, not the content card
  if (e.target === splashOverlay) {
    enterSite();
  }
});

function enterSite() {
  // Hide splash screen
  splashOverlay.classList.add('hidden');
  
  // Start music (user interaction allows autoplay)
  playMusic();
  
  // Save preference
  localStorage.setItem('hasVisited', 'true');
}

// ===== MUSIC CONTROLS =====
function playMusic() {
  bgMusic.play()
    .then(() => {
      isMusicPlaying = true;
      updateMusicButton();
    })
    .catch((error) => {
      console.log('Music autoplay prevented:', error);
    });
}

function pauseMusic() {
  bgMusic.pause();
  isMusicPlaying = false;
  updateMusicButton();
}

function toggleMusic() {
  if (isMusicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

function updateMusicButton() {
  if (isMusicPlaying) {
    musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
    musicBtn.setAttribute('aria-label', 'Pause music');
    musicBtn.style.animation = 'pulse 2s infinite';
  } else {
    musicBtn.innerHTML = '<i class="fas fa-music"></i>';
    musicBtn.setAttribute('aria-label', 'Play music');
    musicBtn.style.animation = 'none';
  }
}

// Music button click handler
musicBtn.addEventListener('click', toggleMusic);

// Set music volume
bgMusic.volume = 0.4;

// ===== SMOOTH SCROLL NAVIGATION =====
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Make function globally available
window.scrollToSection = scrollToSection;

// ===== GOOGLE MAPS DIRECTIONS =====
function openDirections() {
  const coordinates = '10.742863544457302,77.54505436744417';
  const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates}`;
  window.open(url, '_blank');
}

// Make function globally available
window.openDirections = openDirections;

// ===== PARALLAX EFFECT FOR HERO =====
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      const hero = document.getElementById('hero');
      
      if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
      
      ticking = false;
    });
    
    ticking = true;
  }
});

// ===== CHECK IF USER HAS VISITED BEFORE =====
// If user has visited before, skip splash (optional)
// Uncomment if you want to skip splash on return visits
/*
if (localStorage.getItem('hasVisited') === 'true') {
  splashOverlay.classList.add('hidden');
}
*/

// ===== ADD TO CALENDAR FUNCTIONALITY =====
function addToCalendar() {
  // Wedding event details
  const eventDetails = {
    title: 'Selva & Aparna Wedding Celebration',
    description: 'Join us in celebrating the wedding of Selvakumar and Alagu Aparna. Your presence will make our day more special!',
    location: 'Sri Kumaran Mahal, Dharapuram, Tiruppur, Tamil Nadu',
    start: '2026-08-23T18:00:00', // 6:00 PM
    end: '2026-08-23T22:00:00',   // 10:00 PM (estimated)
  };

  // Create ICS file content
  const icsContent = generateICS(eventDetails);

  // Create blob and download
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'Selva_Aparna_Wedding.ics';

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Show confirmation
  showCalendarConfirmation();
}

function generateICS(event) {
  // Format dates for ICS (YYYYMMDDTHHmmss)
  const formatDate = (dateString) => {
    return dateString.replace(/[-:]/g, '').replace('.000', '');
  };

  const start = formatDate(event.start);
  const end = formatDate(event.end);
  const timestamp = formatDate(new Date().toISOString());

  // Create ICS content following RFC 5545 standard
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Selva & Aparna Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `DTSTAMP:${timestamp}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-P1D', // Reminder 1 day before
    'DESCRIPTION:Wedding Tomorrow!',
    'ACTION:DISPLAY',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H', // Reminder 2 hours before
    'DESCRIPTION:Wedding in 2 hours!',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return ics;
}

function showCalendarConfirmation() {
  const btn = document.getElementById('addToCalendarBtn');
  const originalHTML = btn.innerHTML;

  // Show success message
  btn.innerHTML = '<i class="fas fa-check"></i> Added to Calendar!';
  btn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';

  // Reset after 3 seconds
  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = '';
  }, 3000);
}

// Make function globally available
window.addToCalendar = addToCalendar;

// ===== SCROLL INDICATOR =====
const scrollIndicator = document.querySelector('.scroll-indicator');

// Hide scroll indicator when user scrolls
window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;

  if (scrollY > 50 && scrollIndicator) {
    scrollIndicator.classList.add('hidden');
  } else if (scrollIndicator) {
    scrollIndicator.classList.remove('hidden');
  }
});

// Smooth scroll to next section when clicking scroll indicator
if (scrollIndicator) {
  scrollIndicator.addEventListener('click', () => {
    const coupleSection = document.getElementById('couple');
    if (coupleSection) {
      coupleSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// ===== STICKY NAVIGATION =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const currentScrollY = window.pageYOffset;

  // Show navbar when scrolling down past hero section
  if (currentScrollY > 100) {
    navbar.classList.add('visible');
  } else {
    navbar.classList.remove('visible');
  }

  lastScrollY = currentScrollY;
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  const icon = navToggle.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-times');
});

// Close nav on link click
function closeNav() {
  navMenu.classList.remove('active');
  const icon = navToggle.querySelector('i');
  icon.classList.remove('fa-times');
  icon.classList.add('fa-bars');
}

// Make function globally available
window.closeNav = closeNav;

// Smooth scroll for navigation links
document.querySelectorAll('.navbar__link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const navbarHeight = navbar.offsetHeight;
      const targetPosition = targetSection.offsetTop - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== SCROLL TO TOP BUTTON =====
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  // Show button after scrolling 300px
  if (window.pageYOffset > 300) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

// Scroll to top when clicked
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // Visual feedback
  scrollTopBtn.style.transform = 'scale(0.9)';
  setTimeout(() => {
    scrollTopBtn.style.transform = '';
  }, 200);
});

// ===== CONSOLE LOG =====
console.log('Wedding Invitation loaded successfully! 💍');
console.log('Wishing Selva & Aparna a lifetime of happiness! ❤️');
