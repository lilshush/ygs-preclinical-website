/**
 * YGS Preclinical — Main Script
 * - Sticky header with scroll shadow
 * - Mobile navigation toggle
 * - Smooth anchor scrolling
 * - Active nav link on scroll (IntersectionObserver)
 * - Fade-up scroll animations
 * - Footer year auto-update
 */

(function () {
  'use strict';

  /* ── CONSTANTS ──────────────────────────────────────────── */
  const HEADER_ID      = 'site-header';
  const HAMBURGER_ID   = 'nav-hamburger';
  const MOBILE_NAV_ID  = 'nav-mobile';
  const FOOTER_YEAR_ID = 'footer-year';

  /* ── DOM READY ───────────────────────────────────────────── */
  // defer attribute guarantees DOM is ready — no DOMContentLoaded needed
  initStickyHeader();
  initMobileNav();
  initSmoothScroll();
  initActiveNav();
  initFadeAnimations();
  initFooterYear();

  /* ── STICKY HEADER ───────────────────────────────────────── */
  function initStickyHeader() {
    var header = document.getElementById(HEADER_ID);
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 8) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ── MOBILE NAV ──────────────────────────────────────────── */
  function initMobileNav() {
    var hamburger = document.getElementById(HAMBURGER_ID);
    var mobileNav = document.getElementById(MOBILE_NAV_ID);
    if (!hamburger || !mobileNav) return;

    /* Focus trap: keeps Tab/Shift+Tab inside the open mobile menu */
    function trapFocus(e) {
      if (e.key !== 'Tab') return;
      var focusable = mobileNav.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      var first = focusable[0];
      var last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    function openMenu() {
      hamburger.classList.add('open');
      mobileNav.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close navigation menu');
      mobileNav.setAttribute('aria-hidden', 'false');
      mobileNav.removeAttribute('inert');
      document.body.style.overflow = 'hidden';

      // Move focus to first link inside the menu
      var firstLink = mobileNav.querySelector('a');
      if (firstLink) firstLink.focus();

      // Activate focus trap
      mobileNav.addEventListener('keydown', trapFocus);
    }

    function closeMenu() {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open navigation menu');
      mobileNav.setAttribute('aria-hidden', 'true');
      mobileNav.setAttribute('inert', '');
      document.body.style.overflow = '';

      // Remove focus trap
      mobileNav.removeEventListener('keydown', trapFocus);
    }

    function toggleMenu() {
      if (mobileNav.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close on nav link click — return focus to hamburger before menu goes inert
    var mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
        hamburger.focus();
      });
    });

    // Close on ESC — return focus to hamburger
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMenu();
        hamburger.focus();
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        mobileNav.classList.contains('open') &&
        !mobileNav.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  /* ── SMOOTH SCROLL ───────────────────────────────────────── */
  function initSmoothScroll() {
    // Get header height for offset
    function getHeaderOffset() {
      var header = document.getElementById(HEADER_ID);
      return header ? header.getBoundingClientRect().height : 72;
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href').slice(1);
        if (!targetId) return;

        var target = document.getElementById(targetId);
        if (!target) return;

        e.preventDefault();

        var offset = getHeaderOffset();
        var targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
        var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        window.scrollTo({
          top: targetTop,
          behavior: prefersReduced ? 'auto' : 'smooth'
        });

        // Update URL hash without adding to browser history stack
        history.replaceState(null, '', '#' + targetId);
      });
    });
  }

  /* ── ACTIVE NAV ──────────────────────────────────────────── */
  function initActiveNav() {
    var sections = document.querySelectorAll('section[id], div[id="home"]');
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.classList.remove('active');
              link.removeAttribute('aria-current');
            });
            var active = document.querySelector('.nav-links a[href="#' + id + '"]');
            if (active) {
              active.classList.add('active');
              active.setAttribute('aria-current', 'location'); /* "location" = in-page anchor nav */
            }
          }
        });
      },
      {
        rootMargin: '-30% 0px -65% 0px',
        threshold: 0
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ── FADE-UP ANIMATIONS ──────────────────────────────────── */
  function initFadeAnimations() {
    // Respect user preference
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    var fadeElements = document.querySelectorAll('.fade-up');
    if (!fadeElements.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── FOOTER YEAR ─────────────────────────────────────────── */
  function initFooterYear() {
    var el = document.getElementById(FOOTER_YEAR_ID);
    if (el) {
      el.textContent = new Date().getFullYear();
    }
  }

})();
