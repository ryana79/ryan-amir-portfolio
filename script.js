// Mobile menu functionality
const sidemenu = document.querySelector("nav ul");
const menuIcon = document.querySelector(".menu-icon");

function toggleMenu() {
  const isOpen = sidemenu.classList.toggle("show");
  menuIcon.classList.toggle("active");
  document.body.classList.toggle("menu-open");
  menuIcon.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

menuIcon.setAttribute("aria-expanded", "false");
menuIcon.addEventListener("click", toggleMenu);

// Close menu when clicking outside
document.addEventListener("click", function (event) {
  const isClickInsideMenu = sidemenu.contains(event.target);
  const isClickOnMenuIcon = menuIcon.contains(event.target);

  if (
    !isClickInsideMenu &&
    !isClickOnMenuIcon &&
    sidemenu.classList.contains("show")
  ) {
    toggleMenu();
  }
});

// Close menu when clicking on a menu item
sidemenu.querySelectorAll("a").forEach((item) => {
  item.addEventListener("click", () => {
    if (sidemenu.classList.contains("show")) {
      toggleMenu();
    }
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Navbar background change on scroll
window.addEventListener("scroll", function () {
  const nav = document.querySelector("nav");
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// Typing effect
const typingElement = document.querySelector(".typing-effect");
if (typingElement) {
  const text = typingElement.textContent;
  typingElement.textContent = "";
  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      typingElement.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    }
  }

  typeWriter();
}

// Tab functionality in About section
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabId = button.getAttribute("data-tab");

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(tabId).classList.add("active");
  });
});

// Portfolio filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');
    
    const filterValue = button.getAttribute('data-filter');
    
    portfolioItems.forEach(item => {
      if (filterValue === 'all') {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 100);
      } else if (item.getAttribute('data-category') === filterValue) {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 100);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  });
});

// using Formspree to send emails for contact form
const contactForm = document.getElementById("contact-form");
const msg = document.getElementById("msg");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Show sending message
  msg.textContent = "Sending message...";
  msg.style.display = "block";

  // Collect form data
  const formData = new FormData(contactForm);

  try {
    const response = await fetch("https://formspree.io/f/mkgjjkwj", {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: formData,
    });

    if (response.ok) {
      msg.innerHTML = "Message sent successfully!";
      msg.style.color = "#4CAF50";
      // Clear form
      contactForm.reset();
    } else {
      msg.innerHTML = "Failed to send message. Please try again.";
      msg.style.color = "#f44336";
    }
  } catch (error) {
    console.error("Error:", error);
    msg.innerHTML = "Something went wrong. Please try again.";
    msg.style.color = "#f44336";
  }
});


// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    
    // Here you would typically send the email to a server
    // For this example, we'll just show an alert
    alert(`Thank you for subscribing with ${emailInput.value}!`);
    
    // Clear form field
    emailInput.value = '';
  });
}

// Back to top button
const backToTopButton = document.querySelector('.back-to-top');
if (backToTopButton) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.style.opacity = '1';
      backToTopButton.style.visibility = 'visible';
    } else {
      backToTopButton.style.opacity = '0';
      backToTopButton.style.visibility = 'hidden';
    }
  });
}

// Animate elements on scroll
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.animate__animated');
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementPosition < windowHeight - 100) {
      const animationClass = element.dataset.animation || 'animate__fadeIn';
      element.classList.add(animationClass);
    }
  });
};

// Add animation classes to elements
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  
  sections.forEach(section => {
    section.querySelectorAll('.section-header, .service-card, .portfolio-item, .contact-card')
      .forEach((element, index) => {
        element.classList.add('animate__animated');
        element.dataset.animation = 'animate__fadeInUp';
        element.style.animationDelay = `${index * 0.2}s`;
        element.style.opacity = '0';
      });
  });
  
  // Initial check for elements in viewport
  animateOnScroll();
  
  // Check for elements on scroll
  window.addEventListener('scroll', animateOnScroll);
});

// Skill bar animation
const animateSkillBars = () => {
  const skillSection = document.getElementById('skills');
  if (!skillSection) return;
  
  const skillBars = skillSection.querySelectorAll('.skill-level');
  
  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= window.innerHeight - 100 &&
      rect.bottom >= 0
    );
  };
  
  if (isInViewport(skillSection)) {
    skillBars.forEach(bar => {
      const width = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => {
        bar.style.width = width;
      }, 100);
    });
    
    // Remove event listener once animation is triggered
    window.removeEventListener('scroll', animateSkillBars);
  }
};

window.addEventListener('scroll', animateSkillBars);
window.addEventListener('DOMContentLoaded', animateSkillBars);

