// DECLARATIONS
const navbar = document.querySelector('#navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');
const hamburger = document.querySelector('#hamburger');
const navMenu = document.querySelector('.nav-links');

// 1. PARTICLE BACKGROUND
const canvas = document.querySelector('#particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const particles = [];
const particleCount = 80;

const particleColors = [
  'rgba(255, 215, 0, ',
  'rgba(26, 122, 74, ',
  'rgba(255, 255, 255, '
];

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = particleColors[
      Math.floor(Math.random() * particleColors.length)
    ];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(
      this.x, this.y,
      this.size, 0,
      Math.PI * 2
    );
    ctx.fillStyle = this.color + this.opacity + ')';
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(function(particle) {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animateParticles);
}

animateParticles();

// NAVBAR SCROLL
window.addEventListener('scroll', function() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ACTIVE NAV LINK
window.addEventListener('scroll', function() {
  let currentSection = '';

  sections.forEach(function(section) {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(function(link) {
    link.classList.remove('active');
    if (link.getAttribute('href') ===
        '#' + currentSection) {
      link.classList.add('active');
    }
  });
});

//  SMOOTH SCROLL
navLinks.forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(
      this.getAttribute('href')
    );
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

const recruitBtn = document.querySelector(
  '#hero .btn-primary'
);
recruitBtn.addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('#contact')
    .scrollIntoView({ behavior: 'smooth' });
});


// SCROLL FADE IN
sections.forEach(function(section) {
  section.style.opacity = '0';
  section.style.transform = 'translateY(60px)';
  section.style.transition =
    'opacity 0.8s ease, transform 0.8s ease';
});

const observer = new IntersectionObserver(
  function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform =
          'translateY(0)';
      }
    });
  },
  { threshold: 0.1 }
);

sections.forEach(function(section) {
  observer.observe(section);
});

// COUNT UP — BIG STATS

const bigStatNumbers =
  document.querySelectorAll('.big-stat-number');

const bigStatObserver = new IntersectionObserver(
  function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const target = parseInt(
          entry.target.getAttribute('data-target')
        );
        const duration = 2000;
        const startTime = performance.now();
        const isDecimal = target < 100;

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(
            elapsed / duration, 1
          );
          const eased =
            1 - Math.pow(1 - progress, 3);
          const current = Math.floor(
            eased * target
          );

          if (isDecimal) {
            entry.target.textContent =
              (current / 10).toFixed(1);
          } else {
            entry.target.textContent =
              (current / 10).toFixed(1);
          }

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            entry.target.textContent =
              (target / 10).toFixed(1);
          }
        }

        requestAnimationFrame(updateCount);
        bigStatObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

bigStatNumbers.forEach(function(el) {
  bigStatObserver.observe(el);
});

// PROGRESS BARS
const progressFills =
  document.querySelectorAll('.progress-fill');

const progressObserver = new IntersectionObserver(
  function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const width =
          entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        progressObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

progressFills.forEach(function(bar) {
  progressObserver.observe(bar);
});

//  LIGHTBOX

const lightbox = document.querySelector('#lightbox');
const lightboxImg =
  document.querySelector('#lightbox-img');
const galleryItems =
  document.querySelectorAll('.gallery-item img');

let currentIndex = 0;
const images = [];

galleryItems.forEach(function(img) {
  images.push(img.src);
});

function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = images[index];
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function changeLightbox(direction) {
  currentIndex += direction;
  if (currentIndex < 0) {
    currentIndex = images.length - 1;
  }
  if (currentIndex >= images.length) {
    currentIndex = 0;
  }
  lightboxImg.src = images[currentIndex];
}

lightbox.addEventListener('click', function(e) {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', function(e) {
  if (lightbox.classList.contains('active')) {
    if (e.key === 'ArrowRight') changeLightbox(1);
    if (e.key === 'ArrowLeft') changeLightbox(-1);
    if (e.key === 'Escape') closeLightbox();
  }
});

// QR CODE MODAL

const qrBtn = document.querySelector('#qr-btn');
const qrModal = document.querySelector('#qr-modal');

function openQR() {
  qrModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeQR() {
  qrModal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

qrBtn.addEventListener('click', function(e) {
  e.preventDefault();
  openQR();
});

qrModal.addEventListener('click', function(e) {
  if (e.target === qrModal) {
    closeQR();
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeLightbox();
    closeQR();
  }
});

//  HAMBURGER MENU
hamburger.addEventListener('click', function() {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});


//  TIMELINE ANIMATION

const timelineItems =
  document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver(
  function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform =
          'translateY(0)';
      }
    });
  },
  { threshold: 0.2 }
);

timelineItems.forEach(function(item) {
  item.style.opacity = '0';
  item.style.transform = 'translateY(30px)';
  item.style.transition =
    'opacity 0.6s ease, transform 0.6s ease';
  timelineObserver.observe(item);
});