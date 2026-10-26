/**
 * Deb's DogWalkers - Master Interactive Script (script.js)
 * Features:
 *  1. Accessibility Display Preferences (Font Resizer & Theme Switcher via localStorage)
 *  2. Mobile Navigation Toggle
 *  3. Collapsible Sections ("Read More / View Details")
 *  4. Interactive FAQ Accordion
 *  5. CTA Launch Waitlist Modal Dialog
 */

document.addEventListener('DOMContentLoaded', () => {
  initAccessibilityControls();
  initMobileNav();
  initCollapsibleSections();
  initFAQAccordion();
  initCTAModal();
});

/* ==========================================================================
   1. Accessibility Preferences Controller (Font Scaling & Theme Switching)
   ========================================================================== */
function initAccessibilityControls() {
  const root = document.documentElement;

  // Restore saved preferences across page navigation
  const savedFontSize = localStorage.getItem('debs_font_size');
  const savedTheme = localStorage.getItem('debs_theme');

  if (savedFontSize) root.setAttribute('data-font-size', savedFontSize);
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  // Font Size Buttons
  document.getElementById('font-normal')?.addEventListener('click', () => setFontSize('normal'));
  document.getElementById('font-large')?.addEventListener('click', () => setFontSize('large'));
  document.getElementById('font-xlarge')?.addEventListener('click', () => setFontSize('xlarge'));

  // Theme Buttons
  document.getElementById('theme-default')?.addEventListener('click', () => setTheme('default'));
  document.getElementById('theme-contrast')?.addEventListener('click', () => setTheme('high-contrast'));
  document.getElementById('theme-dark')?.addEventListener('click', () => setTheme('dark'));

  function setFontSize(size) {
    if (size === 'normal') {
      root.removeAttribute('data-font-size');
      localStorage.removeItem('debs_font_size');
    } else {
      root.setAttribute('data-font-size', size);
      localStorage.setItem('debs_font_size', size);
    }
  }

  function setTheme(theme) {
    if (theme === 'default') {
      root.removeAttribute('data-theme');
      localStorage.removeItem('debs_theme');
    } else {
      root.setAttribute('data-theme', theme);
      localStorage.setItem('debs_theme', theme);
    }
  }
}

/* ==========================================================================
   2. Mobile Navigation Menu Toggle
   ========================================================================== */
function initMobileNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('#nav-menu');

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('is-active');
  });

  document.addEventListener('click', (event) => {
    if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-active');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('is-active')) {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-active');
      navToggle.focus();
    }
  });
}

/* ==========================================================================
   3. Collapsible Sections ("Read More / View Details")
   ========================================================================== */
function initCollapsibleSections() {
  const collapsibleTargets = [
    { containerId: 'services', triggerText: 'View Full Training & Pricing Details' },
    { containerId: 'competition', triggerText: 'View In-Depth Competitor Analysis' },
    { containerId: 'about', triggerText: 'Learn More About Management & Roles' }
  ];

  collapsibleTargets.forEach(({ containerId, triggerText }) => {
    const section = document.getElementById(containerId);
    if (!section) return;

    const extraContentNodes = Array.from(section.children).filter((node, index) => index >= 2);
    if (extraContentNodes.length === 0) return;

    const collapseWrapper = document.createElement('div');
    collapseWrapper.className = 'collapsible-content';
    collapseWrapper.id = `${containerId}-details`;
    collapseWrapper.style.display = 'none';
    collapseWrapper.setAttribute('aria-hidden', 'true');

    extraContentNodes.forEach(node => collapseWrapper.appendChild(node));

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn-expand';
    toggleBtn.type = 'button';
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-controls', `${containerId}-details`);
    toggleBtn.innerHTML = `<span>${triggerText}</span> <span class="arrow-icon" aria-hidden="true">▼</span>`;

    toggleBtn.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      background-color: var(--color-primary, #1e3a8a);
      color: #ffffff;
      font-size: 1.1rem;
      font-weight: 700;
      border: 2px solid var(--color-primary, #1e3a8a);
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    `;

    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', !isExpanded);
      
      if (isExpanded) {
        collapseWrapper.style.display = 'none';
        collapseWrapper.setAttribute('aria-hidden', 'true');
        toggleBtn.querySelector('span').textContent = triggerText;
        toggleBtn.querySelector('.arrow-icon').textContent = '▼';
      } else {
        collapseWrapper.style.display = 'block';
        collapseWrapper.setAttribute('aria-hidden', 'false');
        toggleBtn.querySelector('span').textContent = 'Hide Details';
        toggleBtn.querySelector('.arrow-icon').textContent = '▲';
      }
    });

    section.appendChild(toggleBtn);
    section.appendChild(collapseWrapper);
  });
}

/* ==========================================================================
   4. Interactive FAQ Accordion Component
   ========================================================================== */
function initFAQAccordion() {
  const main = document.querySelector('main');
  if (!main) return;

  const faqData = [
    {
      q: "What is Deb's DogWalkers' Strict Individual Walk Policy?",
      a: "We strictly enforce a 1-on-1 walk policy (or dual walks limited exclusively to dogs from the exact same household). Mass pack walking and unmonitored off-leash dog park drop-offs are expressly prohibited to guarantee safety."
    },
    {
      q: "How are contractors vetted and trained?",
      a: "Every contractor undergoes a criminal background check, interview, classroom instruction on canine behavioral psychology, and three mandatory live shadow walks supervised directly by QC Manager Memphis Armstrong."
    },
    {
      q: "How does pricing and scheduling work?",
      a: "Walks are available in 30-minute ($35) and 60-minute ($55) sessions with weekly (10% off), monthly (15% off), and annual VIP discounts (20% off). All walks include real-time GPS tracking and bathroom reports."
    },
    {
      q: "How can I contact customer support?",
      a: "Unlike national app platforms that rely on automated chatbots, Deb's DogWalkers provides a dedicated local phone hotline staffed directly by CEO Deb Armstrong during business hours."
    }
  ];

  const faqSection = document.createElement('section');
  faqSection.id = 'faq';
  faqSection.setAttribute('aria-labelledby', 'faq-heading');

  const faqTitle = document.createElement('h2');
  faqTitle.id = 'faq-heading';
  faqTitle.textContent = 'Frequently Asked Questions';
  faqSection.appendChild(faqTitle);

  const accordionContainer = document.createElement('div');
  accordionContainer.className = 'faq-accordion';

  faqData.forEach((item, index) => {
    const qId = `faq-q-${index}`;
    const aId = `faq-a-${index}`;

    const faqItem = document.createElement('div');
    faqItem.style.cssText = 'border-bottom: 2px solid var(--color-border, #cbd5e1); margin-bottom: 0.75rem; padding-bottom: 0.75rem;';

    const questionBtn = document.createElement('button');
    questionBtn.className = 'faq-trigger';
    questionBtn.id = qId;
    questionBtn.setAttribute('aria-expanded', 'false');
    questionBtn.setAttribute('aria-controls', aId);
    questionBtn.style.cssText = `
      width: 100%; text-align: left; background: none; border: none;
      font-size: 1.25rem; font-weight: 700; color: var(--color-primary, #1e3a8a);
      padding: 0.75rem 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center;
    `;
    questionBtn.innerHTML = `<span>${item.q}</span> <span class="faq-icon" aria-hidden="true">+</span>`;

    const answerPanel = document.createElement('div');
    answerPanel.id = aId;
    answerPanel.className = 'faq-panel';
    answerPanel.setAttribute('role', 'region');
    answerPanel.setAttribute('aria-labelledby', qId);
    answerPanel.style.display = 'none';
    answerPanel.style.padding = '0.5rem 0 0.75rem 0';
    answerPanel.innerHTML = `<p style="margin:0; font-size: 1.15rem; color: var(--color-text-dark, #0f172a);">${item.a}</p>`;

    questionBtn.addEventListener('click', () => {
      const isExpanded = questionBtn.getAttribute('aria-expanded') === 'true';

      accordionContainer.querySelectorAll('.faq-trigger').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        btn.querySelector('.faq-icon').textContent = '+';
      });
      accordionContainer.querySelectorAll('.faq-panel').forEach(panel => {
        panel.style.display = 'none';
      });

      if (!isExpanded) {
        questionBtn.setAttribute('aria-expanded', 'true');
        questionBtn.querySelector('.faq-icon').textContent = '−';
        answerPanel.style.display = 'block';
      }
    });

    faqItem.appendChild(questionBtn);
    faqItem.appendChild(answerPanel);
    accordionContainer.appendChild(faqItem);
  });

  faqSection.appendChild(accordionContainer);

  const contactSection = document.getElementById('contact');
  if (contactSection) {
    main.insertBefore(faqSection, contactSection);
  } else {
    main.appendChild(faqSection);
  }
}

/* ==========================================================================
   5. CTA Launch Waitlist Modal Dialog
   ========================================================================== */
function initCTAModal() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  const ctaBtn = document.createElement('button');
  ctaBtn.type = 'button';
  ctaBtn.id = 'open-cta-modal';
  ctaBtn.textContent = 'Join Waitlist / Request Launch Alert';
  ctaBtn.style.cssText = `
    margin-top: 1.25rem; padding: 0.85rem 1.75rem;
    background-color: var(--color-secondary, #0d9488); color: #ffffff;
    font-size: 1.25rem; font-weight: 700; border: none; border-radius: 6px; cursor: pointer;
  `;

  heroContent.appendChild(ctaBtn);

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'cta-modal';
  modalOverlay.setAttribute('role', 'dialog');
  modalOverlay.setAttribute('aria-modal', 'true');
  modalOverlay.setAttribute('aria-labelledby', 'modal-title');
  modalOverlay.setAttribute('aria-hidden', 'true');
  modalOverlay.style.cssText = `
    display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(15, 23, 42, 0.75); z-index: 9999;
    justify-content: center; align-items: center; padding: 1.5rem;
  `;

  modalOverlay.innerHTML = `
    <div style="background-color: #ffffff; padding: 2rem; border-radius: 12px; max-width: 550px; width: 100%; position: relative; border: 3px solid var(--color-primary, #1e3a8a);">
      <button type="button" id="close-cta-modal" aria-label="Close Modal" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.75rem; font-weight: 800; cursor: pointer;">&times;</button>
      <h2 id="modal-title" style="margin-top: 0; color: var(--color-primary, #1e3a8a); font-size: 1.8rem;">Deb's DogWalkers Launch Waitlist</h2>
      <p style="font-size: 1.15rem; color: #334155;">Register below to receive priority access and exclusive beta pricing ($20 / 30-min walk).</p>
      <form id="waitlist-form" style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.25rem;">
        <div>
          <label for="owner-name" style="display: block; font-weight: 700; margin-bottom: 0.25rem;">Your Name:</label>
          <input type="text" id="owner-name" required style="width: 100%; padding: 0.65rem; font-size: 1.1rem; border: 2px solid #cbd5e1; border-radius: 6px;">
        </div>
        <div>
          <label for="owner-email" style="display: block; font-weight: 700; margin-bottom: 0.25rem;">Email Address:</label>
          <input type="email" id="owner-email" required style="width: 100%; padding: 0.65rem; font-size: 1.1rem; border: 2px solid #cbd5e1; border-radius: 6px;">
        </div>
        <button type="submit" style="padding: 0.85rem; background-color: var(--color-primary, #1e3a8a); color: #ffffff; font-weight: 700; font-size: 1.2rem; border: none; border-radius: 6px; cursor: pointer;">Submit Early Access Request</button>
      </form>
      <div id="modal-feedback" role="alert" style="margin-top: 1rem; display: none; font-weight: 700; color: #0d9488;"></div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  const closeBtn = modalOverlay.querySelector('#close-cta-modal');
  const form = modalOverlay.querySelector('#waitlist-form');
  const feedback = modalOverlay.querySelector('#modal-feedback');

  function openModal() {
    modalOverlay.style.display = 'flex';
    modalOverlay.setAttribute('aria-hidden', 'false');
    modalOverlay.querySelector('#owner-name').focus();
  }

  function closeModal() {
    modalOverlay.style.display = 'none';
    modalOverlay.setAttribute('aria-hidden', 'true');
  }

  ctaBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.getAttribute('aria-hidden') === 'false') closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    feedback.style.display = 'block';
    feedback.textContent = `Thank you! You have been added to our launch list.`;
    setTimeout(() => { closeModal(); form.reset(); form.style.display = 'flex'; feedback.style.display = 'none'; }, 3000);
  });
}