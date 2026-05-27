/**
 * Countdown Timer
 * Counts down to the wedding date
 */

// ===== CONFIGURATION =====
const WEDDING_DATE = new Date('2026-08-23T18:00:00').getTime();

// ===== DOM ELEMENTS =====
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const messageElement = document.getElementById('countdownMessage');
const countdownTimerElement = document.getElementById('countdownTimer');

// ===== HELPER FUNCTIONS =====
function padZero(num) {
  return num.toString().padStart(2, '0');
}

function calculateTimeRemaining() {
  const now = new Date().getTime();
  const distance = WEDDING_DATE - now;
  
  if (distance < 0) {
    return null; // Wedding has passed
  }
  
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
}

// ===== UPDATE COUNTDOWN DISPLAY =====
function updateCountdown() {
  const timeRemaining = calculateTimeRemaining();
  
  if (timeRemaining === null) {
    // Wedding has passed or is happening now
    showWeddingMessage();
    return;
  }
  
  // Update display
  daysElement.textContent = padZero(timeRemaining.days);
  hoursElement.textContent = padZero(timeRemaining.hours);
  minutesElement.textContent = padZero(timeRemaining.minutes);
  secondsElement.textContent = padZero(timeRemaining.seconds);
  
  // Update message based on time remaining
  updateMessage(timeRemaining.days);
}

// ===== UPDATE MESSAGE =====
function updateMessage(daysRemaining) {
  let message = '';
  
  if (daysRemaining === 0) {
    message = 'The big day is TODAY! 🎉';
  } else if (daysRemaining === 1) {
    message = 'Just one more day! 💕';
  } else if (daysRemaining <= 7) {
    message = 'Less than a week to go! ✨';
  } else if (daysRemaining <= 30) {
    message = 'The countdown is on! 💍';
  } else if (daysRemaining <= 100) {
    message = 'Getting closer! 💖';
  } else {
    message = 'We can\'t wait to celebrate with you! ❤️';
  }
  
  messageElement.textContent = message;
}

// ===== SHOW WEDDING MESSAGE =====
function showWeddingMessage() {
  // Replace countdown with celebration message
  countdownTimerElement.innerHTML = `
    <div style="text-align: center; padding: var(--space-lg);">
      <div style="font-size: var(--font-size-3xl); margin-bottom: var(--space-sm);">🎊</div>
      <div style="font-size: var(--font-size-xl); margin-bottom: var(--space-sm);">The Celebration Has Begun!</div>
      <div style="font-size: var(--font-size-base); font-style: italic; opacity: 0.9;">
        Thank you for being part of our special day ❤️
      </div>
    </div>
  `;

  messageElement.textContent = '';
}

// ===== NUMBER FLIP ANIMATION =====
function animateNumberChange(element, newValue) {
  const currentValue = element.textContent;
  
  if (currentValue !== newValue) {
    // Add flip animation class
    element.style.animation = 'none';
    
    // Force reflow
    void element.offsetWidth;
    
    // Update value and animate
    element.textContent = newValue;
    element.style.animation = 'flipIn 0.6s ease-out';
  }
}

// Add keyframe animation for flip
const style = document.createElement('style');
style.textContent = `
  @keyframes flipIn {
    0% {
      transform: rotateX(-90deg);
      opacity: 0;
    }
    50% {
      transform: rotateX(-45deg);
    }
    100% {
      transform: rotateX(0deg);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

// ===== ENHANCED UPDATE WITH ANIMATION =====
function updateCountdownWithAnimation() {
  const timeRemaining = calculateTimeRemaining();
  
  if (timeRemaining === null) {
    showWeddingMessage();
    return;
  }
  
  // Update with animation
  animateNumberChange(daysElement, padZero(timeRemaining.days));
  animateNumberChange(hoursElement, padZero(timeRemaining.hours));
  animateNumberChange(minutesElement, padZero(timeRemaining.minutes));
  animateNumberChange(secondsElement, padZero(timeRemaining.seconds));
  
  // Update message
  updateMessage(timeRemaining.days);
}

// ===== INITIALIZE COUNTDOWN =====
function initCountdown() {
  // Initial update
  updateCountdown();
  
  // Update every second
  setInterval(updateCountdownWithAnimation, 1000);
  
  console.log('Countdown initialized ⏰');
}

// Start countdown when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCountdown);
} else {
  initCountdown();
}
