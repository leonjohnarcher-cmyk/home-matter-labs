/* =====================================================================
   Home Matter Labs — Shared JavaScript
   Handles: mobile nav toggle, FAQ accordions, cookie notice,
   active-link highlighting, and form submit placeholders.
   No backend calls are wired yet — see the clearly marked placeholders.
   ===================================================================== */

(function () {
  "use strict";

  /* ------------------------- Mobile nav toggle ----------------------- */
  function initNav() {
    var toggle = document.querySelector(".nav__toggle");
    var links = document.getElementById("primary-nav");
    if (!toggle || !links) return;

    function closeMenu() {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close menu when a link is clicked (mobile)
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    // Reset menu state when resizing up to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) closeMenu();
    });
  }

  /* ------------------------ Active nav link -------------------------- */
  function initActiveLink() {
    var current = window.location.pathname.split("/").pop() || "index.html";
    if (current === "") current = "index.html";
    var links = document.querySelectorAll("#primary-nav a[href]");
    links.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === current) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* --------------------------- FAQ accordion ------------------------- */
  function initFaq() {
    var triggers = document.querySelectorAll(".faq__trigger");
    triggers.forEach(function (trigger) {
      var panel = document.getElementById(trigger.getAttribute("aria-controls"));
      if (!panel) return;

      trigger.addEventListener("click", function () {
        var expanded = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", expanded ? "false" : "true");
        if (expanded) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }

  /* --------------------- Cookie / privacy banner --------------------- */
  // Session-based only (no localStorage), per requirements — dismissal
  // persists for the current tab session via sessionStorage.
  function initCookie() {
    var banner = document.getElementById("cookieNotice");
    if (!banner) return;

    var dismissed = false;
    try {
      dismissed = sessionStorage.getItem("hml_cookie_ack") === "1";
    } catch (err) {
      dismissed = false;
    }

    if (!dismissed) {
      banner.hidden = false;
    }

    var acceptBtn = banner.querySelector("[data-cookie-accept]");
    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        banner.hidden = true;
        try {
          sessionStorage.setItem("hml_cookie_ack", "1");
        } catch (err) {
          /* sessionStorage unavailable — banner simply won't persist */
        }
      });
    }
  }

  /* --------------------------- Contact form -------------------------- */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // ----------------------------------------------------------------
      // API CALL PLACEHOLDER
      // Backend submission is not wired up yet. When ready, collect the
      // form data and POST it to your endpoint here, e.g.:
      //
      //   const data = Object.fromEntries(new FormData(form).entries());
      //   const res = await fetch("/api/contact", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(data),
      //   });
      //   // handle res / errors
      // ----------------------------------------------------------------

      var status = document.getElementById("contactStatus");
      if (status) {
        status.textContent =
          "Thanks — messaging is not connected yet. Please reach us on WhatsApp at +91 9740633719 for now.";
      }
      form.reset();
    });
  }

  /* -------------------------- Partner form --------------------------- */
  function initPartnerForm() {
    var form = document.getElementById("partnerForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // ----------------------------------------------------------------
      // FORM SUBMIT HANDLER GOES HERE
      // No backend is connected yet. Wire the partner/referral inquiry
      // POST request in this handler once the API is available.
      // ----------------------------------------------------------------

      var status = document.getElementById("partnerStatus");
      if (status) {
        status.textContent =
          "Thanks for your interest — submissions are not connected yet. We'll add backend handling soon.";
      }
      form.reset();
    });
  }

  /* ---------------------------- Init all ----------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initActiveLink();
    initFaq();
    initCookie();
    initContactForm();
    initPartnerForm();

    // Set footer year(s) if present
    var years = document.querySelectorAll("[data-year]");
    var y = new Date().getFullYear();
    years.forEach(function (el) {
      el.textContent = y;
    });
  });
})();
