// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  hamburger.classList.toggle("active");
  const expanded = hamburger.classList.contains("active");
  hamburger.setAttribute("aria-expanded", expanded.toString());

  // Debug logging to help diagnose environments where the menu doesn't show
  try {
    console.log(
      "[nav] hamburger toggle -> expanded:",
      expanded,
      "navMenu classes:",
      navMenu?.className
    );
  } catch (e) {}

  // Stronger inline-style fallback for small screens and flaky environments.
  // This forces the menu to be visible and ensures it sits above other layers.
  if (navMenu) {
    if (window.innerWidth <= 768) {
      if (expanded) {
        navMenu.style.visibility = "visible";
        navMenu.style.opacity = "1";
        navMenu.style.transform = "translateY(0)";
        navMenu.style.display = "flex";
        navMenu.style.zIndex = "9999"; // ensure it's above other overlays
        // Match inline background to current theme to avoid invisible text
        if (document.documentElement.classList.contains("light")) {
          navMenu.style.background = "#ffffff";
          navMenu.style.color = "#0f172a";
        } else {
          navMenu.style.background = "rgba(15, 23, 42, 0.98)";
          navMenu.style.color = "";
        }
      } else {
        // Collapse: reset to the hidden transition state and clear strong inline overrides after animation
        navMenu.style.opacity = "0";
        navMenu.style.visibility = "hidden";
        navMenu.style.transform = "translateY(-6px)";
        // Allow transition to finish before clearing display/zIndex so it doesn't flash
        setTimeout(() => {
          navMenu.style.display = "";
          navMenu.style.zIndex = "";
          navMenu.style.background = "";
          navMenu.style.color = "";
        }, 250);
      }
    } else {
      // On larger screens, let CSS control visibility/layout and clear any inline fallbacks
      navMenu.style.visibility = "";
      navMenu.style.opacity = "";
      navMenu.style.transform = "";
      navMenu.style.display = "";
      navMenu.style.zIndex = "";
      navMenu.style.background = "";
      navMenu.style.color = "";
    }
  }
});

hamburger.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    hamburger.click();
  }
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    
    // Apply the same cleanup logic as the hamburger toggle to properly close the menu
    if (navMenu && window.innerWidth <= 768) {
      navMenu.style.opacity = "0";
      navMenu.style.visibility = "hidden";
      navMenu.style.transform = "translateY(-6px)";
      setTimeout(() => {
        navMenu.style.display = "";
        navMenu.style.zIndex = "";
        navMenu.style.background = "";
        navMenu.style.color = "";
      }, 250);
    }
  });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  });
});

const updateNavbarTheme = () => {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  const rootEl = document.documentElement;
  const isLight = rootEl.classList.contains("light");

  if (isLight) {
    navbar.style.background = "#fff";
    navbar.style.boxShadow =
      window.scrollY > 50
        ? "0 4px 20px rgba(30,41,59,0.07)"
        : "0 2px 10px rgba(30,41,59,0.04)";
    navbar.style.borderBottom = "1px solid #e2e8f0";
    // Force nav text color for light mode
    navbar.querySelectorAll(".nav-brand, .nav-menu a").forEach((el) => {
      el.style.color = "#0f172a";
      el.style.background = "none";
      el.style.webkitBackgroundClip = "initial";
      el.style.webkitTextFillColor = "initial";
      el.style.backgroundClip = "initial";
    });
  } else {
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(15, 23, 42, 0.98)";
      navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.5)";
    } else {
      navbar.style.background = "rgba(15, 23, 42, 0.95)";
      navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.3)";
    }
    navbar.style.borderBottom = "none";
    // Reset nav text color to CSS defaults for dark mode
    navbar.querySelectorAll(".nav-brand, .nav-menu a").forEach((el) => {
      el.style.color = "";
      el.style.background = "";
      el.style.webkitBackgroundClip = "";
      el.style.webkitTextFillColor = "";
      el.style.backgroundClip = "";
    });
  }
};

// Apply on scroll
window.addEventListener("scroll", updateNavbarTheme);

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll("section").forEach((section) => {
  section.style.opacity = "0";
  section.style.transform = "translateY(20px)";
  section.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
  observer.observe(section);
});

// Animate skill tags on scroll
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const tags = entry.target.querySelectorAll(".skill-tag");
      tags.forEach((tag, index) => {
        setTimeout(() => {
          tag.style.opacity = "1";
          tag.style.transform = "translateY(0)";
        }, index * 50);
      });
    }
  });
}, observerOptions);

document.querySelectorAll(".skill-category").forEach((category) => {
  const tags = category.querySelectorAll(".skill-tag");
  tags.forEach((tag) => {
    tag.style.opacity = "0";
    tag.style.transform = "translateY(10px)";
    tag.style.transition = "opacity 0.3s ease-out, transform 0.3s ease-out";
  });
  skillObserver.observe(category);
});

// Animate project cards
const projectObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll(".project-card");
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, index * 100);
      });
    }
  });
}, observerOptions);

const projectsGrid = document.querySelector(".projects-grid");
if (projectsGrid) {
  const cards = projectsGrid.querySelectorAll(".project-card");
  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
  });
  projectObserver.observe(projectsGrid);
}

// Add active state to navigation based on scroll position
window.addEventListener("scroll", () => {
  let current = "";
  const sections = document.querySelectorAll("section");

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 100) {
      current = section.getAttribute("id");
    }
  });

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
});

// Typing effect for hero subtitle (optional enhancement)
const heroSubtitle = document.querySelector(".hero-subtitle");
if (heroSubtitle) {
  const text = heroSubtitle.textContent;
  heroSubtitle.textContent = "";
  let i = 0;

  const typeWriter = () => {
    if (i < text.length) {
      heroSubtitle.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    }
  };

  // Start typing effect after a short delay
  setTimeout(typeWriter, 500);
}

// Console message for developers
console.log(
  "%c👋 Hello, Developer!",
  "font-size: 20px; font-weight: bold; color: #3b82f6;"
);
console.log(
  "%cInterested in how this portfolio was built? Check out the source code!",
  "font-size: 14px; color: #94a3b8;"
);
console.log(
  "%cGitHub: https://github.com/Saqibb786",
  "font-size: 14px; color: #10b981;"
);

// Theme toggle with persistence
const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const storedTheme = localStorage.getItem("theme");
if (storedTheme === "light") {
  root.classList.add("light");
}
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    root.classList.toggle("light");
    const mode = root.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("theme", mode);
    themeToggle.innerHTML = root.classList.contains("light")
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
    // Immediately update navbar theme on toggle (no scroll required)
    updateNavbarTheme();
  });
  // Set correct icon at load
  themeToggle.innerHTML = root.classList.contains("light")
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
}

// Ensure navbar reflects theme on initial load
updateNavbarTheme();

// Back to top
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 400) backToTop?.classList.add("show");
  else backToTop?.classList.remove("show");
});
backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Dynamic year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Contact form -> EmailJS (with mailto fallback)
const form = document.getElementById("contact-form");
const submitBtn = form?.querySelector('button[type="submit"]');
const statusEl = document.createElement("div");
statusEl.id = "form-status";
statusEl.setAttribute("role", "status");
statusEl.style.marginTop = "0.75rem";
statusEl.style.fontSize = "0.95rem";
statusEl.style.minHeight = "1.25rem";
form?.appendChild(statusEl);

// Initialize EmailJS if available and keys injected later
const EMAILJS_PUBLIC_KEY = window.EMAILJS_PUBLIC_KEY || ""; // optionally set via inline script or env
const EMAILJS_SERVICE_ID = window.EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = window.EMAILJS_TEMPLATE_ID || "";
if (window.emailjs && EMAILJS_PUBLIC_KEY) {
  try {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  } catch {}
}

const setStatus = (msg, type = "info") => {
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.style.color =
    type === "error" ? "#ef4444" : type === "success" ? "#10b981" : "#94a3b8";
};

const sendViaMailto = ({ name, email, subject, message }) => {
  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const mailto = `mailto:saqibbutt10000@gmail.com?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
};

// Simple in-memory rate limit (per session)
let lastSubmitAt = 0;
const RATE_LIMIT_MS = 15 * 1000; // 15s between submissions

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();
  const honey = (document.getElementById("website")?.value || "").trim();

  // Honeypot trap
  if (honey) {
    // Silently accept to mislead bots
    setStatus("Thanks! Your message was sent successfully.", "success");
    form.reset();
    return;
  }

  // Basic validation
  if (!name || !email || !subject || !message) {
    setStatus("Please complete all fields.", "error");
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setStatus("Please enter a valid email address.", "error");
    return;
  }

  // Basic anti-link spam: limit number of URLs
  const urlMatches = (message.match(/https?:\/\//gi) || []).length;
  if (urlMatches > 3) {
    setStatus(
      "Too many links in the message. Please reduce and try again.",
      "error"
    );
    return;
  }

  // Extra length protection (defense-in-depth beyond maxlength)
  if (message.length > 3000 || subject.length > 150 || name.length > 100) {
    setStatus(
      "Your message is too long. Please shorten and try again.",
      "error"
    );
    return;
  }

  // Rate limiting
  const now = Date.now();
  if (now - lastSubmitAt < RATE_LIMIT_MS) {
    const wait = Math.ceil((RATE_LIMIT_MS - (now - lastSubmitAt)) / 1000);
    setStatus(`Please wait ${wait}s before sending again.`, "error");
    return;
  }
  lastSubmitAt = now;

  setStatus("Sending…", "info");
  submitBtn && (submitBtn.disabled = true);

  // Extra context and HTML-friendly message for EmailJS templates
  const escapeHtml = (s) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  const message_html = escapeHtml(message).replace(/\n/g, "<br>");
  const submitted_at = new Date().toLocaleString();
  const page_url = window.location.href;
  const user_agent = navigator.userAgent;

  const payload = {
    from_name: name,
    reply_to: email,
    subject,
    message,
    message_html,
    submitted_at,
    page_url,
    user_agent,
  };

  const canUseEmailJS = Boolean(
    window.emailjs &&
      EMAILJS_PUBLIC_KEY &&
      EMAILJS_SERVICE_ID &&
      EMAILJS_TEMPLATE_ID
  );
  if (!canUseEmailJS) {
    // Fallback to mailto if EmailJS is not configured yet
    sendViaMailto({ name, email, subject, message });
    setStatus("Opening your email client…", "info");
    return;
  }

  try {
    await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload);
    setStatus("Thanks! Your message was sent successfully.", "success");
    form.reset();
  } catch (err) {
    console.error("EmailJS error:", err);
    setStatus(
      "Couldn’t send via email service. Opening your email client…",
      "error"
    );
    sendViaMailto({ name, email, subject, message });
  } finally {
    submitBtn && (submitBtn.disabled = false);
  }
});

// Scroll margin for anchor targets to account for fixed navbar
document.querySelectorAll("section[id]").forEach((sec) => {
  sec.style.scrollMarginTop = "90px";
});

/* Certifications grid: See All / See Less toggle */
const certsGrid = document.querySelector(".certifications-grid");
const certToggle = document.getElementById("cert-toggle");

function computeGridRows() {
  if (!certsGrid) return 0;
  const children = Array.from(certsGrid.children).filter(
    (c) => c.classList && c.classList.contains("cert-card")
  );
  if (children.length === 0) return 0;

  // Determine columns by checking how many cards fit in the first row
  const firstTop = children[0].getBoundingClientRect().top;
  let cols = 0;
  for (const c of children) {
    if (Math.abs(c.getBoundingClientRect().top - firstTop) < 2) cols++;
    else break;
  }
  cols = Math.max(1, cols);
  return Math.ceil(children.length / cols);
}

function setCollapsedHeightForRows(rows) {
  // Precisely compute collapsed height by grouping certification cards into rows
  // and measuring the bottom of the last visible row. This prevents partial
  // reveals when cards vary in height or gaps change across breakpoints.
  const children = Array.from(certsGrid.children).filter(
    (c) => c.classList && c.classList.contains("cert-card")
  );
  if (children.length === 0) return 0;

  // Group children by their top coordinate to identify rows (tolerance for sub-pixel differences)
  const rowsMap = [];
  const TOL = 3; // pixels tolerance for grouping
  children.forEach((c) => {
    const r = c.getBoundingClientRect();
    const top = Math.round(r.top);
    let rowIndex = rowsMap.findIndex((t) => Math.abs(t - top) <= TOL);
    if (rowIndex === -1) {
      rowsMap.push(top);
      rowIndex = rowsMap.length - 1;
    }
    c._rowIndex = rowIndex;
  });

  const targetRowIndex = Math.min(rows - 1, rowsMap.length - 1);
  const gridRect = certsGrid.getBoundingClientRect();
  let maxBottom = gridRect.top;
  children.forEach((c) => {
    if (c._rowIndex === targetRowIndex) {
      const r = c.getBoundingClientRect();
      if (r.bottom > maxBottom) maxBottom = r.bottom;
    }
  });

  if (maxBottom === gridRect.top && children[0]) {
    const r = children[0].getBoundingClientRect();
    maxBottom = r.bottom;
  }

  let total = Math.ceil(maxBottom - gridRect.top);
  total = Math.max(0, total - 1); // subtract 1px to avoid leakage due to rounding
  certsGrid.style.maxHeight = `${total}px`;
  return total;
}

function removeCollapsedHeight() {
  certsGrid.style.maxHeight = "";
}

function updateCertToggle() {
  if (!certsGrid || !certToggle) return;
  const rows = computeGridRows();
  // Responsive threshold: on large screens (>=1024px) collapse after 2 rows, else after 3 rows
  const threshold = window.innerWidth >= 1024 ? 2 : 3;
  if (rows > threshold) {
    // show toggle and set collapsed height
    // move the existing button into place right after the grid (in case it
    // started inside a different wrapper). This preserves listeners.
    if (certToggle.parentNode !== certsGrid.parentNode) {
      certsGrid.parentNode.insertBefore(certToggle, certsGrid.nextSibling);
    }
    certToggle.classList.add("cert-toggle-icon");
    certToggle.style.display = "inline-flex";
    certToggle.innerHTML =
      '<i class="fas fa-chevron-down" aria-hidden="true"></i>';
    certToggle.setAttribute("aria-expanded", "false");
    certToggle.setAttribute("aria-label", "Show more certifications");
    certsGrid.classList.add("collapsed");
    setCollapsedHeightForRows(threshold);
  } else {
    // hide/move back to original wrapper if present
    certToggle.style.display = "none";
    certToggle.classList.remove("cert-toggle-icon");
    certsGrid.classList.remove("collapsed");
    removeCollapsedHeight();
  }
}

certToggle?.addEventListener("click", () => {
  if (!certsGrid) return;
  const expanded = certToggle.getAttribute("aria-expanded") === "true";
  if (!expanded) {
    // expand
    removeCollapsedHeight();
    certToggle.innerHTML =
      '<i class="fas fa-chevron-up" aria-hidden="true"></i>';
    certToggle.setAttribute("aria-expanded", "true");
    certToggle.setAttribute("aria-label", "Show fewer certifications");
    certsGrid.classList.remove("collapsed");
  } else {
    // collapse
    const threshold = window.innerWidth >= 1024 ? 2 : 3;
    setCollapsedHeightForRows(threshold);
    certToggle.innerHTML =
      '<i class="fas fa-chevron-down" aria-hidden="true"></i>';
    certToggle.setAttribute("aria-expanded", "false");
    certToggle.setAttribute("aria-label", "Show more certifications");
    certsGrid.classList.add("collapsed");
  }
});

// Initial run and on resize
window.addEventListener("load", () => setTimeout(updateCertToggle, 80));
window.addEventListener("resize", () => {
  clearTimeout(window._certToggleTimeout);
  window._certToggleTimeout = setTimeout(updateCertToggle, 200);
});

/* Projects toggle: uses existing projectsGrid declared earlier */
const projectsToggle = document.getElementById("projects-toggle");

function computeProjectRows() {
  if (!projectsGrid) return 0;
  const children = Array.from(projectsGrid.children).filter(
    (c) => c.classList && c.classList.contains("project-card")
  );
  if (children.length === 0) return 0;
  const firstTop = children[0].getBoundingClientRect().top;
  let cols = 0;
  for (const c of children) {
    if (Math.abs(c.getBoundingClientRect().top - firstTop) < 2) cols++;
    else break;
  }
  cols = Math.max(1, cols);
  return Math.ceil(children.length / cols);
}

function setProjectsCollapsedHeightForRows(rows) {
  if (!projectsGrid) return 0;
  const children = Array.from(projectsGrid.children).filter(
    (c) => c.classList && c.classList.contains("project-card")
  );
  if (children.length === 0) return 0;

  // Group children by their top coordinate to identify rows (tolerance for sub-pixel differences)
  const rowsMap = [];
  const TOL = 3; // pixels tolerance for grouping
  children.forEach((c) => {
    const r = c.getBoundingClientRect();
    const top = Math.round(r.top);
    let rowIndex = rowsMap.findIndex((t) => Math.abs(t - top) <= TOL);
    if (rowIndex === -1) {
      rowsMap.push(top);
      rowIndex = rowsMap.length - 1;
    }
    // store row index on element for later (not necessary but helpful)
    c._rowIndex = rowIndex;
  });

  // Determine which elements belong to the last visible row (rows - 1 index)
  const targetRowIndex = Math.min(rows - 1, rowsMap.length - 1);
  // compute bottom of the last element in the target row
  const gridRect = projectsGrid.getBoundingClientRect();
  let maxBottom = gridRect.top; // start at grid top
  children.forEach((c) => {
    if (c._rowIndex === targetRowIndex) {
      const r = c.getBoundingClientRect();
      if (r.bottom > maxBottom) maxBottom = r.bottom;
    }
  });

  // if no element matched (defensive), fall back to first-row measurement
  if (maxBottom === gridRect.top && children[0]) {
    const r = children[0].getBoundingClientRect();
    maxBottom = r.bottom;
  }

  // Compute total height from grid top to bottom of target row. Subtract 1px to avoid
  // accidentally revealing the start of the next card due to rounding.
  let total = Math.ceil(maxBottom - gridRect.top);
  total = Math.max(0, total - 1);
  projectsGrid.style.maxHeight = `${total}px`;
  return total;
}

function removeProjectsCollapsedHeight() {
  if (!projectsGrid) return;
  projectsGrid.style.maxHeight = "";
}

function updateProjectsToggle() {
  if (!projectsGrid || !projectsToggle) return;
  const rows = computeProjectRows();
  // Responsive threshold: on small screens (<1024px) show toggle after 3 rows,
  // on large screens (>=1024px) show toggle after 1 row (only one row visible initially).
  const threshold = window.innerWidth < 1024 ? 3 : 1;
  if (rows > threshold) {
    if (projectsToggle.parentNode !== projectsGrid.parentNode) {
      projectsGrid.parentNode.insertBefore(
        projectsToggle,
        projectsGrid.nextSibling
      );
    }
    projectsToggle.classList.add("cert-toggle-icon");
    projectsToggle.style.display = "inline-flex";
    projectsToggle.innerHTML =
      '<i class="fas fa-chevron-down" aria-hidden="true"></i>';
    projectsToggle.setAttribute("aria-expanded", "false");
    projectsToggle.setAttribute("aria-label", "Show more projects");
    projectsGrid.classList.add("collapsed");
    setProjectsCollapsedHeightForRows(threshold);
  } else {
    projectsToggle.style.display = "none";
    projectsToggle.classList.remove("cert-toggle-icon");
    projectsGrid.classList.remove("collapsed");
    removeProjectsCollapsedHeight();
  }
}

projectsToggle?.addEventListener("click", () => {
  if (!projectsGrid) return;
  const expanded = projectsToggle.getAttribute("aria-expanded") === "true";
  if (!expanded) {
    removeProjectsCollapsedHeight();
    projectsToggle.innerHTML =
      '<i class="fas fa-chevron-up" aria-hidden="true"></i>';
    projectsToggle.setAttribute("aria-expanded", "true");
    projectsToggle.setAttribute("aria-label", "Show fewer projects");
    projectsGrid.classList.remove("collapsed");
  } else {
    const threshold = window.innerWidth < 1024 ? 3 : 1;
    setProjectsCollapsedHeightForRows(threshold);
    projectsToggle.innerHTML =
      '<i class="fas fa-chevron-down" aria-hidden="true"></i>';
    projectsToggle.setAttribute("aria-expanded", "false");
    projectsToggle.setAttribute("aria-label", "Show more projects");
    projectsGrid.classList.add("collapsed");
  }
});

window.addEventListener("load", () => setTimeout(updateProjectsToggle, 120));
window.addEventListener("resize", () => {
  clearTimeout(window._projectsToggleTimeout);
  window._projectsToggleTimeout = setTimeout(updateProjectsToggle, 220);
});
