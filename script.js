/* ═══════════════════════════════════════════════
   SHUBHAM KUMAR — Portfolio JavaScript
   Sections:
   1. Custom Cursor
   2. Loader
   3. Hero Canvas (Particle Network)
   4. Typing Animation
   5. Navbar
   6. Scroll Reveal
   7. Skill Bar Animation
   8. Project Filter
   9. Modal
   10. Contact Form
   11. Active Nav Link
═══════════════════════════════════════════════ */

"use strict";

/* ══════════════════════════════════
   1. CUSTOM CURSOR
══════════════════════════════════ */
const cursorDot  = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");

let mouseX = 0, mouseY = 0;
let ringX = 0,  ringY = 0;

document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left  = mouseX + "px";
  cursorDot.style.top   = mouseY + "px";
});

/* Ring follows with smooth lag */
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + "px";
  cursorRing.style.top  = ringY + "px";
  requestAnimationFrame(animateRing);
}
animateRing();

/* Hover effect on interactive elements */
document.querySelectorAll("a, button, .chip, .project-card, .achievement-card").forEach(el => {
  el.addEventListener("mouseenter", () => cursorRing.classList.add("hovered"));
  el.addEventListener("mouseleave", () => cursorRing.classList.remove("hovered"));
});

/* ══════════════════════════════════
   2. LOADER
══════════════════════════════════ */
const loader     = document.getElementById("loader");
const loaderText = document.getElementById("loaderText");
const loaderFill = document.getElementById("loaderFill");

const loaderLines = [
  "loading portfolio...",
  "importing pandas as pd",
  "training model...",
  "accuracy: 98.2%",
  "ready ✓"
];

let lineIdx = 0;
let charIdx = 0;
let fillPct = 0;
let loaderInterval;

function typeLoaderLine() {
  if (charIdx < loaderLines[lineIdx].length) {
    loaderText.textContent += loaderLines[lineIdx][charIdx];
    charIdx++;
    fillPct = Math.min(fillPct + (100 / loaderLines.join("").length), 100);
    loaderFill.style.width = fillPct + "%";
  } else {
    clearInterval(loaderInterval);
    setTimeout(() => {
      lineIdx++;
      charIdx = 0;
      loaderText.textContent = "";
      if (lineIdx < loaderLines.length) {
        loaderInterval = setInterval(typeLoaderLine, 40);
      } else {
        /* Done — hide loader */
        setTimeout(() => {
          loader.classList.add("hidden");
          loader.addEventListener("transitionend", () => loader.remove(), { once: true });
          startHeroAnimations();
        }, 400);
      }
    }, 300);
  }
}

loaderInterval = setInterval(typeLoaderLine, 40);

/* ══════════════════════════════════
   3. HERO CANVAS — PARTICLE NETWORK
══════════════════════════════════ */
const canvas = document.getElementById("heroCanvas");
const ctx    = canvas.getContext("2d");

let particles = [];
let animFrame;
const PARTICLE_COUNT = 80;
const CONNECTION_DIST = 140;
const COLORS = ["#6C63FF", "#00D4AA", "#8A83FF"];

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x    = Math.random() * canvas.width;
    this.y    = Math.random() * canvas.height;
    this.vx   = (Math.random() - 0.5) * 0.4;
    this.vy   = (Math.random() - 0.5) * 0.4;
    this.r    = Math.random() * 2 + 1;
    this.col  = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
    /* Subtle mouse attraction */
    const dx = heroMouseX - this.x;
    const dy = heroMouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 200) {
      this.x += dx * 0.0015;
      this.y += dy * 0.0015;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.col;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

let heroMouseX = 0, heroMouseY = 0;
canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  heroMouseX = e.clientX - rect.left;
  heroMouseY = e.clientY - rect.top;
});

function initParticles() {
  particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECTION_DIST) {
        const alpha = (1 - dist / CONNECTION_DIST) * 0.18;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108,99,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  animFrame = requestAnimationFrame(animateCanvas);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  initParticles();
});

/* ══════════════════════════════════
   4. TYPING ANIMATION (HERO ROLE)
══════════════════════════════════ */
const typedEl = document.getElementById("typedRole");
const roles = [
  "ML Models",
  "Data Pipelines",
  "AI Solutions",
  "Web Apps",
  "Insights from Data"
];

let roleIdx  = 0;
let rCharIdx = 0;
let isDeleting = false;
let typeTimer;

function typeRole() {
  const current = roles[roleIdx];

  if (!isDeleting) {
    typedEl.textContent = current.slice(0, rCharIdx + 1);
    rCharIdx++;
    if (rCharIdx === current.length) {
      isDeleting = true;
      typeTimer = setTimeout(typeRole, 2000);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, rCharIdx - 1);
    rCharIdx--;
    if (rCharIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }

  typeTimer = setTimeout(typeRole, isDeleting ? 60 : 90);
}

/* ══════════════════════════════════
   START HERO (after loader done)
══════════════════════════════════ */
function startHeroAnimations() {
  resizeCanvas();
  initParticles();
  animateCanvas();
  typeRole();

  /* Animate hero content in */
  document.querySelectorAll(".hero-eyebrow, .hero-name .name-line, .hero-role, .hero-bio, .hero-actions, .hero-stats").forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    setTimeout(() => {
      el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, i * 120 + 100);
  });
}

/* ══════════════════════════════════
   5. NAVBAR
══════════════════════════════════ */
const navbar    = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
  updateActiveLink();
});

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});

/* Close menu when a nav link is clicked on mobile */
navLinks.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

/* ══════════════════════════════════
   6. SCROLL REVEAL
══════════════════════════════════ */
const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay || 0;
      setTimeout(() => el.classList.add("visible"), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach((el, i) => {
  /* Stagger siblings */
  const parent = el.parentElement;
  const siblings = parent.querySelectorAll(".reveal");
  const idx = Array.from(siblings).indexOf(el);
  el.dataset.delay = idx * 80;
  revealObserver.observe(el);
});

/* ══════════════════════════════════
   7. SKILL BAR ANIMATION
══════════════════════════════════ */
const skillSection = document.getElementById("skills");

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll(".sb-fill").forEach(bar => {
        bar.classList.add("animated");
      });
      skillObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

skillSection && skillObserver.observe(skillSection);

/* ══════════════════════════════════
   8. PROJECT FILTER
══════════════════════════════════ */
const filterBtns  = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const cats = card.dataset.category || "";
      const show = filter === "all" || cats.includes(filter);

      if (show) {
        card.classList.remove("hidden");
        card.style.animation = "cardFadeIn 0.4s ease forwards";
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

/* Card fade-in keyframe */
const styleTag = document.createElement("style");
styleTag.textContent = `
  @keyframes cardFadeIn {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`;
document.head.appendChild(styleTag);

/* ══════════════════════════════════
   9. MODAL
══════════════════════════════════ */
const modalOverlay = document.getElementById("modalOverlay");

function openModal(id) {
  const modal = document.getElementById("modal-" + id);
  if (!modal) return;

  /* Close any open modal first */
  document.querySelectorAll(".modal.open").forEach(m => m.classList.remove("open"));

  modalOverlay.classList.add("open");
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.querySelectorAll(".modal.open").forEach(m => m.classList.remove("open"));
  modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

/* Keyboard close */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

/* ══════════════════════════════════
   10. CONTACT FORM
══════════════════════════════════ */
const form        = document.getElementById("contactForm");
const nameInput   = document.getElementById("name");
const emailInput  = document.getElementById("email");
const msgInput    = document.getElementById("message");
const nameErr     = document.getElementById("nameErr");
const emailErr    = document.getElementById("emailErr");
const msgErr      = document.getElementById("msgErr");
const formSuccess = document.getElementById("formSuccess");

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function clearErrors() {
  [nameErr, emailErr, msgErr].forEach(e => e && (e.textContent = ""));
  [nameInput, emailInput, msgInput].forEach(i => i && i.classList.remove("error"));
}

form && form.addEventListener("submit", async e => {
  e.preventDefault();
  clearErrors();

  let valid = true;

  if (!nameInput.value.trim()) {
    nameErr.textContent = "Name is required.";
    nameInput.classList.add("error");
    valid = false;
  }
  if (!validateEmail(emailInput.value.trim())) {
    emailErr.textContent = "Enter a valid email address.";
    emailInput.classList.add("error");
    valid = false;
  }
  if (!msgInput.value.trim() || msgInput.value.trim().length < 10) {
    msgErr.textContent = "Message must be at least 10 characters.";
    msgInput.classList.add("error");
    valid = false;
  }

  if (!valid) return;

  /* Submit to Formspree (free) — replace YOUR_ID with actual Formspree form ID */
  const submitBtn = form.querySelector(".form-submit");
  submitBtn.disabled = true;
  submitBtn.querySelector(".submit-text").textContent = "Sending...";

  try {
    const res = await fetch("https://formspree.io/f/xpwqkgvj", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        name:    nameInput.value.trim(),
        email:   emailInput.value.trim(),
        subject: document.getElementById("subject")?.value.trim(),
        message: msgInput.value.trim()
      })
    });

    if (res.ok) {
      form.reset();
      formSuccess.classList.add("show");
      setTimeout(() => formSuccess.classList.remove("show"), 5000);
    } else {
      /* Fallback — open mail client */
      window.location.href = `mailto:shubhamkr1535@gmail.com?subject=${encodeURIComponent("Portfolio Contact")}&body=${encodeURIComponent(msgInput.value)}`;
    }
  } catch {
    /* Offline fallback */
    window.location.href = `mailto:shubhamkr1535@gmail.com`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector(".submit-text").textContent = "Send Message";
  }
});

/* Live validation feedback */
[nameInput, emailInput, msgInput].forEach(input => {
  input && input.addEventListener("input", () => {
    input.classList.remove("error");
  });
});

/* ══════════════════════════════════
   11. ACTIVE NAV LINK ON SCROLL
══════════════════════════════════ */
const sections   = document.querySelectorAll("section[id]");
const allNavLinks = document.querySelectorAll(".nav-link");

function updateActiveLink() {
  const scrollPos = window.scrollY + 100;

  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute("id");

    if (scrollPos >= top && scrollPos < top + height) {
      allNavLinks.forEach(l => l.classList.remove("active"));
      const active = document.querySelector(`.nav-link[href="#${id}"]`);
      if (active) active.classList.add("active");
    }
  });
}

/* ══════════════════════════════════
   12. SMOOTH SCROLL FOR NAV LINKS
══════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* ══════════════════════════════════
   13. STATS COUNTER ANIMATION
══════════════════════════════════ */
function animateCounter(el, target, duration = 1500, isFloat = false) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
    const value = eased * target;
    el.textContent = isFloat ? value.toFixed(1) : Math.floor(value) + "+";
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isFloat ? target.toFixed(1) : target + "+";
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll(".stat-num");
      statNums.forEach(num => {
        const text = num.textContent.trim();
        if (text === "4+")    animateCounter(num, 4);
        if (text === "8.2")   animateCounter(num, 8.2, 1500, true);
        if (text === "2")     { num.textContent = "0"; setTimeout(() => { num.textContent = "2"; }, 800); }
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector(".hero-stats");
heroStats && statsObserver.observe(heroStats);

/* ══════════════════════════════════
   EXPOSE globals for HTML onclick
══════════════════════════════════ */
window.openModal  = openModal;
window.closeModal = closeModal;
