/* ============================================================
   ANUSHKA — PORTFOLIO JAVASCRIPT
   Features: Nav scroll, hamburger, active link tracking,
             scroll reveal, form validation, typed effect
   ============================================================ */

'use strict';

/* ============================================================
   1. NAVIGATION — SCROLL EFFECT & HAMBURGER
   ============================================================ */

const header    = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const allLinks  = document.querySelectorAll('.nav-link');

/**
 * Add/remove "scrolled" class on header based on scroll position.
 * This triggers the glass-effect background in CSS.
 */
function handleHeaderScroll() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

/**
 * Toggle the mobile nav menu open/closed.
 */
function toggleMobileNav() {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
}

/**
 * Close the mobile nav — called when a link is clicked.
 */
function closeMobileNav() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

// Attach events
window.addEventListener('scroll', handleHeaderScroll, { passive: true });
hamburger.addEventListener('click', toggleMobileNav);

// Close menu when any nav link is clicked
allLinks.forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

// Run once on load
handleHeaderScroll();


/* ============================================================
   2. ACTIVE NAV LINK — INTERSECTION OBSERVER
   ============================================================ */

const sections = document.querySelectorAll('section[id]');

/**
 * Watches which section is most in view and highlights the
 * corresponding nav link as "active".
 */
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        allLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  },
  {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  }
);

sections.forEach(section => navObserver.observe(section));


/* ============================================================
   3. SCROLL REVEAL ANIMATION
   ============================================================ */

const revealElements = document.querySelectorAll('.reveal');

/**
 * Observes elements with class "reveal" and adds "visible"
 * when they enter the viewport, triggering CSS fade-in + slide-up.
 */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children in the same section slightly
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target); // Only animate once
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  }
);

// Assign stagger delays based on DOM order within each section
document.querySelectorAll('.section').forEach(section => {
  const children = section.querySelectorAll('.reveal');
  children.forEach((el, index) => {
    el.dataset.delay = index * 80; // 80ms stagger between items
  });
});

revealElements.forEach(el => revealObserver.observe(el));


/* ============================================================
   4. HERO — ANIMATED ENTRANCE ON LOAD
   ============================================================ */

/**
 * Trigger hero section reveal elements immediately after
 * the page loads with a short delay sequence.
 */
window.addEventListener('load', () => {
  const heroReveals = document.querySelectorAll('.hero-section .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 300 + i * 150);
  });
});


/* ============================================================
   5. SKILL TAGS — HOVER STAGGER ON ENTER
   ============================================================ */

const skillBlocks = document.querySelectorAll('.skill-tags');

skillBlocks.forEach(block => {
  const tags = block.querySelectorAll('.skill-tag');
  block.addEventListener('mouseenter', () => {
    tags.forEach((tag, i) => {
      setTimeout(() => {
        tag.style.borderColor = 'var(--gold-muted)';
      }, i * 40);
    });
  });
  block.addEventListener('mouseleave', () => {
    tags.forEach(tag => {
      if (!tag.classList.contains('interest')) {
        tag.style.borderColor = '';
      }
    });
  });
});


/* ============================================================
   6. FORM VALIDATION & SUBMISSION
   ============================================================ */

const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');
const submitBtn    = document.getElementById('submitBtn');

// Validation rules
const validators = {
  name: {
    el: document.getElementById('name'),
    err: document.getElementById('nameError'),
    validate(value) {
      if (!value.trim()) return 'Please enter your full name.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    }
  },
  email: {
    el: document.getElementById('email'),
    err: document.getElementById('emailError'),
    validate(value) {
      if (!value.trim()) return 'Please enter your email address.';
      // RFC-compliant basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
      return '';
    }
  },
  subject: {
    el: document.getElementById('subject'),
    err: document.getElementById('subjectError'),
    validate(value) {
      if (!value.trim()) return 'Please enter a subject.';
      if (value.trim().length < 3) return 'Subject must be at least 3 characters.';
      return '';
    }
  },
  message: {
    el: document.getElementById('message'),
    err: document.getElementById('messageError'),
    validate(value) {
      if (!value.trim()) return 'Please enter your message.';
      if (value.trim().length < 20) return 'Message must be at least 20 characters.';
      return '';
    }
  }
};

/**
 * Validate a single field and update its error state.
 * @param {string} fieldName - key in validators object
 * @returns {boolean} - true if valid
 */
function validateField(fieldName) {
  const field = validators[fieldName];
  const errorMsg = field.validate(field.el.value);
  field.err.textContent = errorMsg;

  if (errorMsg) {
    field.el.classList.add('error');
    return false;
  } else {
    field.el.classList.remove('error');
    return true;
  }
}

/**
 * Validate all fields.
 * @returns {boolean} - true if all valid
 */
function validateAll() {
  let allValid = true;
  Object.keys(validators).forEach(key => {
    if (!validateField(key)) allValid = false;
  });
  return allValid;
}

// Real-time validation — validate on blur (when user leaves a field)
Object.keys(validators).forEach(key => {
  const field = validators[key];
  field.el.addEventListener('blur', () => validateField(key));

  // Clear error on input (immediate feedback)
  field.el.addEventListener('input', () => {
    if (field.el.classList.contains('error')) {
      validateField(key);
    }
  });
});

/**
 * Handle form submission.
 * In a real project, replace the setTimeout simulation with
 * a fetch() call to your backend or a service like Formspree.
 */
contactForm.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent default form submission

  // Run full validation
  if (!validateAll()) {
    // Shake the form if validation fails
    contactForm.style.animation = 'shake 0.4s ease';
    setTimeout(() => { contactForm.style.animation = ''; }, 400);
    return;
  }

  // Simulate sending — disable button and show loading state
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').textContent = 'Sending…';
  submitBtn.querySelector('.btn-icon').textContent = '⟳';

  // Simulate async network request (replace with real API call)
  setTimeout(() => {
    // Success state
    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').textContent = 'Send Message';
    submitBtn.querySelector('.btn-icon').textContent = '→';
    formSuccess.classList.add('show');

    // Hide success message after 6 seconds
    setTimeout(() => {
      formSuccess.classList.remove('show');
    }, 6000);
  }, 1500);
});


/* ============================================================
   7. PROJECT CARDS — TILT EFFECT ON HOVER (desktop)
   ============================================================ */

const projectCards = document.querySelectorAll('.project-card');

/**
 * Subtle 3D tilt effect on project cards when mouse moves over them.
 * Only applied on non-touch devices.
 */
if (window.matchMedia('(hover: hover)').matches) {
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -3;  // max 3deg
      const rotateY = ((x - cx) / cx) *  3;

      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}


/* ============================================================
   8. SMOOTH SCROLL — POLYFILL FOR OLDER BROWSERS
   ============================================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ============================================================
   9. SHAKE ANIMATION (for form validation failure)
   ============================================================ */

// Inject shake keyframe into document dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-8px); }
    40%       { transform: translateX(8px); }
    60%       { transform: translateX(-5px); }
    80%       { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);


/* ============================================================
   10. TYPED TEXT EFFECT IN HERO TAGLINE (optional enhancement)
   ============================================================ */

/**
 * Simple typed-text cycling effect.
 * Cycles through descriptive phrases in the hero tagline area.
 */
const roles = [
  'Business Analytics Student',
  'Data Scientist in the Making',
  'Python & SQL Developer',
  'AI/ML Enthusiast',
  'Dashboard Designer'
];

const eyebrow = document.querySelector('.hero-eyebrow');
if (eyebrow) {
  let roleIndex = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let typingTimeout;

  function type() {
    const currentRole = roles[roleIndex];
    let speed = 70;

    if (!isDeleting) {
      // Typing forward
      eyebrow.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentRole.length) {
        // Pause at end before deleting
        isDeleting = true;
        speed = 2000;
      }
    } else {
      // Deleting
      eyebrow.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      speed = 40;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % roles.length;
        speed = 300;
      }
    }
    typingTimeout = setTimeout(type, speed);
  }

  // Start typing after initial hero reveal animation
  setTimeout(type, 1500);
}


/* ============================================================
   11. FOOTER CURRENT YEAR
   ============================================================ */

// Keep copyright year always current
const footerCopy = document.querySelector('.footer-copy');
if (footerCopy) {
  const year = new Date().getFullYear();
  footerCopy.textContent = `© ${year} Anushka. Crafted with intention.`;
}
