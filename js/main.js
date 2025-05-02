// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navbarToggle && navLinks) {
    navbarToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }
    });
  });
});

// Scroll animations
document.addEventListener('DOMContentLoaded', function() {
  const scrollElements = document.querySelectorAll('.animate-on-scroll');
  
  const elementInView = (el, offset = 0) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset
    );
  };
  
  const displayScrollElement = (element) => {
    element.classList.add('is-in-viewport');
  };
  
  const hideScrollElement = (element) => {
    element.classList.remove('is-in-viewport');
  };
  
  const handleScrollAnimation = () => {
    scrollElements.forEach(el => {
      if (elementInView(el, 50)) {
        displayScrollElement(el);
      } else {
        hideScrollElement(el);
      }
    });
  };
  
  window.addEventListener('scroll', () => {
    handleScrollAnimation();
  });
  
  // Trigger animation on page load
  handleScrollAnimation();
});

// Preloader
document.addEventListener('DOMContentLoaded', function() {
  const loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', function() {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 1500); // Show loader for 1.5 seconds
    });
  }
});

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.querySelector('.modal');
  const modalClose = document.querySelector('.modal-close');
  const contactBtn = document.querySelector('.btn-contact');
  
  if (modal && modalClose && contactBtn) {
    contactBtn.addEventListener('click', function(e) {
      e.preventDefault();
      modal.classList.add('active');
    });
    
    modalClose.addEventListener('click', function() {
      modal.classList.remove('active');
    });
    
    // Close modal when clicking outside content
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
});

// Form validation
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simple validation
      let isValid = true;
      
      // Check all required fields
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#dc3545';
        } else {
          field.style.borderColor = '';
        }
      });
      
      // Email validation
      const emailField = form.querySelector('input[type="email"]');
      if (emailField) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          isValid = false;
          emailField.style.borderColor = '#dc3545';
        }
      }
      
      // If form is valid
      if (isValid) {
        // Here you would typically send the form data to a server
        alert('Message sent successfully!');
        form.reset();
      }
    });
  }
});

// AI Wave animation
document.addEventListener('DOMContentLoaded', function() {
  const aiWave = document.querySelector('.ai-wave');
  const aiWaveSecondary = document.querySelector('.ai-wave-secondary');
  
  if (aiWave) {
    let offset = 0;
    function animateWave() {
      offset += 0.5;
      aiWave.style.transform = `translateX(${offset}px)`;
      aiWaveSecondary.style.transform = `translateX(${offset * 0.7}px)`;
      requestAnimationFrame(animateWave);
    }
    animateWave();
  }
});

// Scroll to section functionality
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Account for fixed navbar
          behavior: 'smooth'
        });
      }
    });
  });
});

// Active link highlighting
document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 80; // Offset for navbar height
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
});

// Filter projects
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        // Filter projects
        projectCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
            card.classList.add('animated', 'fadeIn');
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});

// Cursor animation
document.addEventListener('DOMContentLoaded', function() {
  const cursor = document.querySelector('.cursor');
  if (cursor) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
  }
});

// Text reveal animation
document.addEventListener('DOMContentLoaded', function() {
  const textRevealElements = document.querySelectorAll('.text-reveal');
  if (textRevealElements.length > 0) {
    const revealOnScroll = () => {
      textRevealElements.forEach(el => {
        if (elementInView(el, 30)) {
          el.classList.add('visible');
        }
      });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
  }
});

// Card flip animation
document.addEventListener('DOMContentLoaded', function() {
  const cardFlips = document.querySelectorAll('.card-flip');
  if (cardFlips.length > 0) {
    cardFlips.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const inner = card.querySelector('.card-flip-inner');
        if (inner) {
          inner.style.transform = 'rotateY(180deg)';
        }
      });
      
      card.addEventListener('mouseleave', () => {
        const inner = card.querySelector('.card-flip-inner');
        if (inner) {
          inner.style.transform = 'rotateY(0deg)';
        }
      });
    });
  }
});

// Smooth scroll for all anchor links
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });
});
