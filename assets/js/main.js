// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Back to top smooth scroll fallback (for browsers not supporting CSS smooth)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Reveal on scroll
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealElements.forEach((el) => revealObserver.observe(el));

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Animated Steps Scroll Animation (Re-triggers each time)
const stepItems = document.querySelectorAll('.step-item');
const stepObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Add a delay based on the step number for sequential animation
      const stepNumber = parseInt(entry.target.dataset.step);
      setTimeout(() => {
        entry.target.classList.add('animate');
      }, stepNumber * 100); // 100ms delay between each step
    } else {
      // Remove animation when out of view to allow re-triggering
      entry.target.classList.remove('animate');
    }
  });
}, { 
  threshold: 0.3,
  rootMargin: '-50px'
});

// Observe all step items
stepItems.forEach((step) => stepObserver.observe(step));

// EmailJS Configuration
(function() {
  // Initialize EmailJS with your public key
  emailjs.init("AhpuGaMcYdXFNVZaU");
})();

// Contact Form Submission
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Disable submit button to prevent multiple submissions
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Send email using EmailJS
    emailjs.sendForm(
      'service_i9iises',
      'template_hstlgun',
      this
    )
    .then(function(response) {
      // Success
      formMessage.textContent = 'Message sent successfully! We\'ll get back to you soon.';
      formMessage.className = 'form-message success';
      formMessage.style.display = 'block';
      contactForm.reset();

      // Re-enable button
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;

      // Hide message after 5 seconds
      setTimeout(() => {
        formMessage.style.display = 'none';
      }, 5000);
    }, function(error) {
      // Error
      formMessage.textContent = 'Failed to send message. Please try again or contact us directly.';
      formMessage.className = 'form-message error';
      formMessage.style.display = 'block';

      // Re-enable button
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;

      console.error('EmailJS Error:', error);
    });
  });
}

