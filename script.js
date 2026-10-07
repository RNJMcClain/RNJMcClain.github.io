// ============================
// HELPERS
// ============================
const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// ============================
// RENDER EXPERIENCE (experience page)
// Reads from window.EXPERIENCES in data.js
// ============================
const experienceList = document.getElementById("experienceList");

if (experienceList && Array.isArray(window.EXPERIENCES)) {
  experienceList.innerHTML = window.EXPERIENCES.map((role) => {
    const bullets = role.bullets
      .map((b) => `<li>${escapeHtml(b)}</li>`)
      .join("");
    return `
      <div class="experience-card reveal">
        <div class="role-head">
          <h3>${escapeHtml(role.title)}</h3>
          <span class="date">${escapeHtml(role.date)}</span>
        </div>
        <div class="company">${escapeHtml(role.company)} — ${escapeHtml(
          role.location,
        )}</div>
        <ul>${bullets}</ul>
      </div>`;
  }).join("");
}

// ============================
// HOME PAGE STATS (auto-updates)
// Reads from window.EXPERIENCE_STATS in data.js
// ============================
if (window.EXPERIENCE_STATS) {
  const setStat = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  setStat("stat-years", `${window.EXPERIENCE_STATS.yearsExperience}+`);
  setStat("stat-roles", window.EXPERIENCE_STATS.roles);
}

// ============================
// PARKS PAGE — badges + interactive map
// Reads from window.PARKS in data.js
// ============================
const parkEmblems = {
  mountain: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="72" cy="30" r="10" fill="#e4a72c" />
      <path d="M0 100 L30 45 L50 75 L70 35 L100 100 Z" fill="#6b7280" />
      <path d="M0 100 L30 45 L40 60 L20 100 Z" fill="#565d68" />
      <path d="M70 35 L64 47 L67 43 L70 47 L74 43 z" fill="#f4ecd8" />
    </svg>`,
  canyon: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="76" cy="26" r="10" fill="#e4a72c" />
      <path d="M0 100 L0 58 L20 50 L34 56 L58 46 L78 54 L100 48 L100 100 Z" fill="#d9714f" />
      <path d="M0 100 L0 66 L16 56 L34 64 L48 54 L60 62 L74 56 L88 62 L100 58 L100 100 Z" fill="#a94a2c" />
      <path d="M0 100 L0 74 L20 60 L34 72 L46 62 L58 76 L70 66 L84 78 L100 70 L100 100 Z" fill="#c65d3b" />
      <path d="M20 60 L18 100 L30 100 L34 72 Z" fill="#d9714f" opacity="0.85" />
      <path d="M46 62 L44 100 L56 100 L58 76 Z" fill="#d97a4f" opacity="0.85" />
      <path d="M0 100 L0 90 L28 92 L58 86 L86 92 L100 88 L100 100 Z" fill="#a94a2c" />
    </svg>`,
  forest: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="74" cy="24" r="9" fill="#e4a72c" />
      <path d="M27 92 L27 76 L35 76 L35 92 Z" fill="#5c3a1e" />
      <path d="M14 78 L31 38 L48 78 Z" fill="#234a30" />
      <path d="M18 64 L31 34 L44 64 Z" fill="#2f5d3e" />
      <path d="M62 92 L62 80 L68 80 L68 92 Z" fill="#5c3a1e" />
      <path d="M52 82 L65 50 L78 82 Z" fill="#234a30" />
      <path d="M55 70 L65 46 L75 70 Z" fill="#2f5d3e" />
      <path d="M0 100 L100 100 L100 90 L0 90 Z" fill="#2f5d3e" />
    </svg>`,
  water: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="72" cy="30" r="10" fill="#e4a72c" />
      <path d="M0 100 L0 70 L18 64 L38 70 L58 64 L78 70 L100 64 L100 100 Z" fill="#1f6f8b" />
      <path d="M0 82 Q12 74 24 82 T48 82 T72 82 T100 82 L100 100 L0 100 Z" fill="#2e93ae" />
      <path d="M0 90 Q12 84 24 90 T48 90 T72 90 T100 90 L100 100 L0 100 Z" fill="#f4ecd8" opacity="0.75" />
    </svg>`,
  volcano: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="24" cy="26" r="9" fill="#e4a72c" />
      <path d="M20 100 L40 46 L44 40 L56 40 L60 46 L80 100 Z" fill="#3a2c26" />
      <path d="M44 40 L40 46 L60 46 L56 40 Z" fill="#ba2f08" />
      <path d="M50 40 Q46 30 50 22 Q54 30 50 40 Z" fill="#ce3409" />
      <path d="M40 46 L40 62 L46 54 L52 66 L58 52 L60 46 Z" fill="#ba2f08" opacity="0.9" />
    </svg>`,
  glacier: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="74" cy="26" r="9" fill="#e4a72c" />
      <path d="M0 100 L20 40 L40 78 L60 34 L100 100 Z" fill="#5b8aa6" />
      <path d="M20 40 L16 52 L20 48 L22 52 L24 48 z" fill="#f4ecd8" />
      <path d="M60 34 L52 50 L57 46 L60 50 L64 46 L70 50 z" fill="#f4ecd8" />
      <path d="M0 100 L0 90 L22 80 L36 86 L55 92 L70 84 L100 85 L100 100 Z" fill="#dff1f7" />
    </svg>`,
  cave: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="24" cy="24" r="9" fill="#e4a72c" />
      <path d="M0 100 L0 46 Q50 6 100 46 L100 100 Z" fill="#3a2c26" />
      <path d="M50 100 Q22 100 22 62 Q22 42 50 40 Q78 42 78 62 Q78 100 50 100 Z" fill="#1c1512" />
      <path d="M40 42 L43 60 L46 44 L49 66 L52 46 L55 62 L58 41 L54 40 L53 40 L49 40 L42 41 Z" fill="#7a5c48" />
      <path d="M42 100 L45 82 L48 100 Z" fill="#7a5c48" />
      <path d="M54 100 L57 86 L60 100 Z" fill="#7a5c48" />
    </svg>`,
};

const parksGrid = document.getElementById("parkMap")
  ? document.getElementById("parksGrid")
  : null;

if (parksGrid && Array.isArray(window.PARKS)) {
  // Alphabetical by park name (copy so we don't mutate the source list).
  const parks = [...window.PARKS].sort((a, b) => a.name.localeCompare(b.name));

  // --- Update the count line (visited parks only) ---
  const visitedCount = parks.filter((p) => p.visited).length;
  const countEl = document.getElementById("parksCount");
  if (countEl) {
    countEl.textContent = `${visitedCount} ${
      visitedCount === 1 ? "park" : "parks"
    } explored & counting`;
  }

  // --- Render the badge cards ---
  parksGrid.innerHTML = parks
    .map((park, i) => {
      const emblem = parkEmblems[park.emblem] || parkEmblems.mountain;
      const status = park.visited
        ? `<span class="park-year">Visited${
            park.year ? " " + escapeHtml(park.year) : ""
          }</span>`
        : `<span class="park-year bucket">On the list</span>`;
      return `
        <article class="park-badge reveal${park.visited ? "" : " not-visited"}"
                 data-park-index="${i}" tabindex="0" role="button"
                 aria-label="Show ${escapeHtml(park.name)} on the map">
          <div class="park-emblem">${emblem}</div>
          <h3>${escapeHtml(park.name)}</h3>
          <div class="park-location">${escapeHtml(park.state)}</div>
          ${
            park.note && park.note.trim()
              ? `<p class="park-note">${escapeHtml(park.note)}</p>`
              : ""
          }
          ${status}
        </article>`;
    })
    .join("");

  // --- Initialize the Leaflet map (needs internet for tiles) ---
  if (typeof L !== "undefined") {
    const map = L.map("parkMap", {
      scrollWheelZoom: false,
      attributionControl: true,
    }).setView([39.5, -98.35], 4); // center of the continental US

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const markers = [];

    const makePin = (visited) =>
      L.divIcon({
        className: "park-pin-wrap",
        html: `<span class="park-pin${visited ? " visited" : ""}"></span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -12],
      });

    parks.forEach((park) => {
      const marker = L.marker([park.lat, park.lng], {
        icon: makePin(park.visited),
      }).addTo(map);

      marker.bindPopup(
        `<div class="park-popup">
           <strong>${escapeHtml(park.name)}</strong>
           <div class="popup-state">${escapeHtml(park.state)}</div>
           ${
             park.note && park.note.trim()
               ? `<p>${escapeHtml(park.note)}</p>`
               : ""
           }
           <span class="popup-status">${
             park.visited ? "✓ Visited" : "On the list"
           }</span>
         </div>`,
      );

      markers.push(marker);
    });

    // Clicking (or keyboard-activating) a badge flies to its marker.
    const focusPark = (index) => {
      const park = parks[index];
      const marker = markers[index];
      if (!park || !marker) return;
      map.flyTo([park.lat, park.lng], 6, { duration: 0.8 });
      marker.openPopup();
      document
        .getElementById("parkMap")
        .scrollIntoView({ behavior: "smooth", block: "center" });
    };

    parksGrid.querySelectorAll(".park-badge").forEach((badge) => {
      const index = parseInt(badge.dataset.parkIndex, 10);
      badge.addEventListener("click", () => focusPark(index));
      badge.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          focusPark(index);
        }
      });
    });

    // Leaflet sometimes needs a nudge to size correctly after layout.
    setTimeout(() => map.invalidateSize(), 200);
  }
}

// ============================
// RENDER PROJECTS (projects page)
// Reads from window.PROJECTS in data.js
// ============================
const projectGrid = document.getElementById("projectGrid");

if (projectGrid && Array.isArray(window.PROJECTS)) {
  projectGrid.innerHTML = window.PROJECTS.map((p) => {
    // The modal reads the full title/skills/description from data-* attrs.
    return `
      <article
        class="project-card clickable reveal"
        data-title="${escapeHtml(p.title)}"
        data-skills="${escapeHtml(p.skillsFull || p.skills)}"
        data-description="${escapeHtml(p.description)}"
        tabindex="0" role="button"
        aria-label="Learn more about ${escapeHtml(p.heading)}"
      >
        <h3>${escapeHtml(p.heading)}</h3>
        <p class="project-skills">${escapeHtml(p.skills)}</p>
        <p class="project-preview">${escapeHtml(p.preview)}</p>
        <p class="card-hint">Click to learn more →</p>
      </article>`;
  }).join("");
}

// ============================
// PROJECT MODAL (projects page)
// ============================
const modal = document.getElementById("projectModal");

if (modal) {
  const cards = document.querySelectorAll(".project-card.clickable");
  const closeBtn = document.getElementById("closeModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalSkills = document.getElementById("modalSkills");
  const modalDescription = document.getElementById("modalDescription");

  const openModal = (card) => {
    modalTitle.textContent = card.dataset.title;
    modalSkills.textContent = card.dataset.skills;
    modalDescription.textContent = card.dataset.description;
    modal.classList.remove("hidden");
  };

  const closeModal = () => modal.classList.add("hidden");

  cards.forEach((card) => {
    card.addEventListener("click", () => openModal(card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

// ============================
// REVEAL ON SCROLL
// Runs after any dynamic rendering above so injected
// cards are observed too.
// ============================
const revealEls = document.querySelectorAll(".reveal");

if (revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealEls.forEach((el) => observer.observe(el));
}

// ============================
// CONTACT FORM (contact page)
// Submits to Formspree via fetch so the visitor stays on the
// page, with inline success / error feedback.
// ============================
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const statusEl = document.getElementById("formStatus");
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const confirmationEl = document.getElementById("formConfirmation");
  const sendAnotherBtn = document.getElementById("sendAnother");

  // Swap the form out for the big confirmation panel.
  const showConfirmation = () => {
    contactForm.classList.add("hidden");
    if (confirmationEl) {
      confirmationEl.classList.remove("hidden");
      confirmationEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Bring the (reset) form back when the visitor wants to send another.
  if (sendAnotherBtn) {
    sendAnotherBtn.addEventListener("click", () => {
      if (confirmationEl) confirmationEl.classList.add("hidden");
      contactForm.reset();
      if (statusEl) {
        statusEl.textContent = "";
        delete statusEl.dataset.state;
      }
      contactForm.classList.remove("hidden");
      contactForm.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const setStatus = (msg, state) => {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.dataset.state = state; // "success" | "error" | "sending"
    };

    setStatus("Sending…", "sending");
    if (submitBtn) submitBtn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("", "success");
        contactForm.reset();
        showConfirmation();
      } else {
        const data = await response.json().catch(() => ({}));
        const msg =
          data && data.errors
            ? data.errors.map((err) => err.message).join(", ")
            : "Something went wrong. Please try again or email me directly.";
        setStatus(msg, "error");
      }
    } catch (err) {
      setStatus(
        "Network error. Please try again or email me directly.",
        "error",
      );
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
