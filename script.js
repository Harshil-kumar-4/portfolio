/* ==========================================================================
   HARSHIL KUMAR — PORTFOLIO V2 SCRIPT
   Init → Theme Toggle → Navbar Scroll → Mobile Nav → Scroll Reveal →
   Telemetry Console → Timeline Fill → Cursor Glow → Card Tilt →
   Copy Email → Footer Year
   ========================================================================== */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    initThemeToggle();
    initTypingEffect();
    initNavbarScroll();
    initMobileNav();
    initScrollReveal();
    initConsoleReveal();
    initTimelineFill();
    initCursorGlow();
    initCardTilt();
    initCopyEmail();
    initFooterYear();
  }

  /* ------------------------------------------------------------------------
     THEME TOGGLE — dark by default, persisted, respects the pre-paint
     inline script in <head> that already set the initial class
     ------------------------------------------------------------------------ */
  function initThemeToggle() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    function reflectState() {
      const isDark = document.documentElement.classList.contains("dark");
      btn.setAttribute("aria-pressed", String(!isDark));
    }
    reflectState();

    btn.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      reflectState();
    });
  }

  /* ------------------------------------------------------------------------
     TYPING EFFECT — cycles through role titles in the hero
     ------------------------------------------------------------------------ */
  function initTypingEffect() {
    const el = document.getElementById("typedRole");
    if (!el) return;

    const roles = [
      "DevOps Engineer",
      "Cloud Engineer",
      "Site Reliability Engineer",
      "AIOps Engineer",
      "Automation Engineer",
    ];

    if (prefersReducedMotion) {
      el.textContent = roles[0];
      return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const TYPE_SPEED = 55;
    const DELETE_SPEED = 30;
    const HOLD_TIME = 1400;
    const SWAP_PAUSE = 350;

    function tick() {
      const currentRole = roles[roleIndex];

      if (!isDeleting) {
        charIndex++;
        el.textContent = currentRole.slice(0, charIndex);
        if (charIndex === currentRole.length) {
          isDeleting = true;
          setTimeout(tick, HOLD_TIME);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        el.textContent = currentRole.slice(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, SWAP_PAUSE);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }

    tick();
  }

  /* ------------------------------------------------------------------------
     NAVBAR SCROLL — glass background appears once scrolled
     ------------------------------------------------------------------------ */
  function initNavbarScroll() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    const THRESHOLD = 40;

    function update() {
      navbar.classList.toggle("is-scrolled", window.scrollY > THRESHOLD);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ------------------------------------------------------------------------
     MOBILE NAV
     ------------------------------------------------------------------------ */
  function initMobileNav() {
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("navMenu");
    const icon = document.getElementById("navToggleIcon");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      if (icon) icon.querySelector("use").setAttribute("href", isOpen ? "#i-x" : "#i-menu");
    });

    menu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        if (icon) icon.querySelector("use").setAttribute("href", "#i-menu");
      });
    });
  }

  /* ------------------------------------------------------------------------
     SCROLL REVEAL
     ------------------------------------------------------------------------ */
  function initScrollReveal() {
    const targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------------
     TELEMETRY CONSOLE — reveals the mock trace line by line once in view
     ------------------------------------------------------------------------ */
  function initConsoleReveal() {
    const body = document.getElementById("consoleBody");
    if (!body) return;
    const lines = body.querySelectorAll("[data-line]");

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      lines.forEach((l) => l.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            lines.forEach((line, i) => {
              line.style.animationDelay = `${i * 0.16}s`;
              line.classList.add("is-visible");
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(body);
  }

  /* ------------------------------------------------------------------------
     TIMELINE FILL
     ------------------------------------------------------------------------ */
  function initTimelineFill() {
    const timeline = document.querySelector(".timeline");
    const fill = document.getElementById("timelineFill");
    if (!timeline || !fill) return;

    function update() {
      const rect = timeline.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const total = rect.height + viewportH;
      const traveled = viewportH - rect.top;
      const progress = Math.min(Math.max(traveled / total, 0), 1);
      fill.style.height = `${progress * 100}%`;
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ------------------------------------------------------------------------
     CURSOR GLOW
     ------------------------------------------------------------------------ */
  function initCursorGlow() {
    const glow = document.getElementById("cursorGlow");
    if (!glow || prefersReducedMotion) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    window.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    }, { passive: true });

    function animate() {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  /* ------------------------------------------------------------------------
     CARD TILT — project cards only, marked [data-tilt]
     ------------------------------------------------------------------------ */
  function initCardTilt() {
    if (prefersReducedMotion) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const MAX_TILT = 5;

    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.style.transformStyle = "preserve-3d";
      card.style.willChange = "transform";

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateX = (-py * MAX_TILT).toFixed(2);
        const rotateY = (px * MAX_TILT).toFixed(2);
        card.style.transform = `translateY(-3px) perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------------------------------
     COPY EMAIL
     ------------------------------------------------------------------------ */
  function initCopyEmail() {
    const btn = document.getElementById("copyEmailBtn");
    if (!btn) return;

    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = btn.getAttribute("data-email");
      const label = btn.querySelector(".copy-btn__label");

      try {
        await navigator.clipboard.writeText(email);
      } catch (err) {
        const temp = document.createElement("textarea");
        temp.value = email;
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
      }

      btn.classList.add("is-copied");
      if (label) label.textContent = "Copied";
      setTimeout(() => {
        btn.classList.remove("is-copied");
        if (label) label.textContent = "Copy";
      }, 1800);
    });
  }

  /* ------------------------------------------------------------------------
     FOOTER YEAR
     ------------------------------------------------------------------------ */
  function initFooterYear() {
    const el = document.getElementById("footerYear");
    if (el) el.textContent = new Date().getFullYear();
  }
})();
