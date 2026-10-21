/**
 * LAY AGENT — INTERACTIVE APPLICATION ENGINE (ENHANCED)
 * Features:
 * - Conversational AI simulation with dynamic tone and model parameters
 * - Web Audio API synthesized sound feedback with mute/unmute
 * - Bilingual support (English & Indonesian)
 * - Text-To-Speech (Web Speech Synthesis) & Speech Recognition (Web Speech API)
 * - Step simulator interactive drawer (How It Works)
 * - 3D parallax mouse tilt effect on hero centerpiece
 * - Export conversation to Markdown / Text file
 * - Fullscreen workspace expander
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. Toast Notification Helper
  // ==========================================
  const toast = document.getElementById("toast-popup");
  function showToast(message, duration = 3000) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove("show");
    }, duration);
  }

  // ==========================================
  // 2. Web Audio API Synthesizer (Sound FX)
  // ==========================================
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playSound(type) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === "suspended") audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === "click") {
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "send") {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === "complete") {
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.08); // A5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === "theme") {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "mic") {
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(820, now + 0.08);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      // Audio fallback silent
    }
  }

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById("sound-toggle-btn");
  const soundIcon = document.getElementById("sound-icon");
  if (soundToggleBtn && soundIcon) {
    soundToggleBtn.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      soundIcon.innerHTML = soundEnabled
        ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`
        : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      showToast(soundEnabled ? "Sound feedback ON" : "Sound muted");
      if (soundEnabled) playSound("click");
    });
  }

  // Theme Toggle (Cyber Dark / Clean Light)
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const themeIcon = document.getElementById("theme-icon");
  const sunIconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  const moonIconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

  function applyTheme(isDark) {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
      if (themeIcon) themeIcon.innerHTML = sunIconSvg;
      if (themeToggleBtn) themeToggleBtn.title = "Switch to Clean Light Mode";
    } else {
      document.documentElement.removeAttribute("data-theme");
      if (themeIcon) themeIcon.innerHTML = moonIconSvg;
      if (themeToggleBtn) themeToggleBtn.title = "Switch to Cyber Dark Mode";
    }
  }

  const savedTheme = localStorage.getItem("lay_agent_theme");
  if (savedTheme === "dark") {
    applyTheme(true);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      const newDark = !isDark;
      applyTheme(newDark);
      localStorage.setItem("lay_agent_theme", newDark ? "dark" : "light");
      playSound("theme");
      showToast(
        newDark ? "Cyber Dark Mode Active ✦" : "Clean Light Mode Active ☼",
      );
    });
  }

  // ==========================================
  // 3. Bilingual Support (EN / ID)
  // ==========================================
  let currentLang = "EN";
  const langToggleBtn = document.getElementById("lang-toggle-btn");
  const langLabel = document.getElementById("lang-label");

  const translations = {
    EN: {
      eyebrow: "YOUR AI ASSISTANT",
      heroSub:
        "Work smarter. Learn faster. Do more.<br>Everything you need, in one AI assistant.",
      getStarted: "Get Started Free",
      howItWorks: "How It Works",
      whatCanDo: "WHAT CAN LAY AGENT DO?",
      everythingInOne: "Everything You Need<br>in One Place",
      justTellUs: "Just Tell Us<br>What You Need",
      noComplicated:
        "No complicated prompts. Just speak or type. Lay Agent will take care of the rest.",
      workspaceTitle: "Your Personal<br>AI Workspace",
      exploreMore: "Explore More",
    },
    ID: {
      eyebrow: "ASISTEN AI CERDAS ANDA",
      heroSub:
        "Bekerja lebih cerdas. Belajar lebih cepat. Selesaikan lebih banyak.<br>Semua kebutuhan Anda dalam satu asisten cerdas.",
      getStarted: "Coba Gratis Sekarang",
      howItWorks: "Lihat Cara Kerja",
      whatCanDo: "KEMAMPUAN LAY AGENT",
      everythingInOne: "Semua Kebutuhan Anda<br>dalam Satu Tempat",
      justTellUs: "Cukup Ceritakan<br>Kebutuhan Anda",
      noComplicated:
        "Tanpa prompt rumit. Cukup ketik atau bicara. Lay Agent akan mengurus sisanya.",
      workspaceTitle: "Ruang Kerja AI<br>Pribadi Anda",
      exploreMore: "Jelajahi Lebih Lanjut",
    },
  };

  if (langToggleBtn && langLabel) {
    langToggleBtn.addEventListener("click", () => {
      currentLang = currentLang === "EN" ? "ID" : "EN";
      langLabel.textContent = currentLang;
      playSound("click");

      const t = translations[currentLang];
      const eyebrowEl = document.querySelector(".hero-eyebrow");
      const heroSubEl = document.querySelector(".hero-subtitle");
      const getStartedBtns = document.querySelectorAll(
        "#hero-get-started-btn span, #nav-get-started-btn span, #cta-bottom-get-started span",
      );
      const exploreLinkEl = document.querySelector(
        "#explore-workspace-link span",
      );

      if (eyebrowEl) eyebrowEl.textContent = t.eyebrow;
      if (heroSubEl) heroSubEl.innerHTML = t.heroSub;
      getStartedBtns.forEach((btn) => (btn.textContent = t.getStarted));
      if (exploreLinkEl) exploreLinkEl.textContent = t.exploreMore;

      showToast(
        currentLang === "EN"
          ? "Language switched to English 🌐"
          : "Bahasa dialihkan ke Bahasa Indonesia 🇮🇩",
      );
    });
  }

  // ==========================================
  // 4. Navigation & Mobile Drawer
  // ==========================================
  const mobileToggle = document.getElementById("mobile-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      playSound("click");
      const isVisible = mobileDrawer.style.display === "flex";
      mobileDrawer.style.display = isVisible ? "none" : "flex";
    });

    mobileDrawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileDrawer.style.display = "none";
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          playSound("click");
          targetEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  const heroGetStarted = document.getElementById("hero-get-started-btn");
  const navGetStarted = document.getElementById("nav-get-started-btn");
  const heroHowItWorks = document.getElementById("hero-how-it-works-btn");
  const ctaBottomGetStarted = document.getElementById("cta-bottom-get-started");
  const exploreWorkspaceLink = document.getElementById(
    "explore-workspace-link",
  );
  const mobileCtaBtn = document.getElementById("mobile-cta-btn");

  function scrollToWorkspace() {
    playSound("click");
    const ws = document.getElementById("workspace-preview");
    if (ws) {
      ws.scrollIntoView({ behavior: "smooth" });
      const input = document.getElementById("app-user-input");
      if (input) setTimeout(() => input.focus(), 600);
    }
  }

  if (heroGetStarted)
    heroGetStarted.addEventListener("click", scrollToWorkspace);
  if (navGetStarted) navGetStarted.addEventListener("click", scrollToWorkspace);
  if (ctaBottomGetStarted)
    ctaBottomGetStarted.addEventListener("click", scrollToWorkspace);
  if (exploreWorkspaceLink)
    exploreWorkspaceLink.addEventListener("click", scrollToWorkspace);
  if (mobileCtaBtn) mobileCtaBtn.addEventListener("click", scrollToWorkspace);

  if (heroHowItWorks) {
    heroHowItWorks.addEventListener("click", () => {
      playSound("click");
      const howSec = document.getElementById("how-it-works");
      if (howSec) howSec.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ==========================================
  // 5. 3D Parallax Mouse Tilt on Hero Centerpiece
  // ==========================================
  const heroCenterpiece = document.getElementById("hero-centerpiece");
  const robotFigure = document.getElementById("hero-robot-figure");
  const cardLeft = document.getElementById("hero-floating-chat");
  const cardRight = document.getElementById("hero-floating-doc");
  const aiBackdrop = document.querySelector(".giant-ai-backdrop");

  if (heroCenterpiece) {
    heroCenterpiece.addEventListener("mousemove", (e) => {
      const rect = heroCenterpiece.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      if (robotFigure) {
        robotFigure.style.transform = `scale(1.02) translate(${x * 14}px, ${y * 10}px)`;
      }
      if (cardLeft) {
        cardLeft.style.transform = `translate(${x * 25}px, ${y * 20}px)`;
      }
      if (cardRight) {
        cardRight.style.transform = `translate(${x * -25}px, ${y * -20}px)`;
      }
      if (aiBackdrop) {
        aiBackdrop.style.transform = `translate(calc(-50% + ${x * -10}px), calc(-55% + ${y * -8}px))`;
      }
    });

    heroCenterpiece.addEventListener("mouseleave", () => {
      if (robotFigure) robotFigure.style.transform = "";
      if (cardLeft) cardLeft.style.transform = "";
      if (cardRight) cardRight.style.transform = "";
      if (aiBackdrop) aiBackdrop.style.transform = "translate(-50%, -55%)";
    });
  }

  // ==========================================
  // 6. Interactive Step Simulator (How It Works)
  // ==========================================
  const stepCards = document.querySelectorAll(".step-card");
  const simStepBadge = document.getElementById("sim-step-badge");
  const simStepTitle = document.getElementById("sim-step-title");
  const simStepBody = document.getElementById("sim-step-body");

  const stepDetails = {
    1: {
      badge: "STEP 01 SIMULATION",
      title: "Multimodal Natural Language Input",
      html: `
        <div style="background: #f8fafc; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0;">
          <p style="font-weight: 600; font-size: 0.88rem; color: #0f172a; margin-bottom: 0.5rem;">User Speech & Text Recognition:</p>
          <div style="display: flex; align-items: center; gap: 0.6rem; color: #0d9488; font-weight: 500; font-size: 0.85rem;">
            <span>🎙️ Audio Waveform Stream:</span>
            <span style="letter-spacing: 2px;"> ▃▅▇█▇▅▃ </span>
            <span style="color: #64748b;">"Need a coffee shop marketing campaign"</span>
          </div>
        </div>
      `,
    },
    2: {
      badge: "STEP 02 SIMULATION",
      title: "Autonomous Reasoning & Multi-Agent Engine",
      html: `
        <div class="reasoning-chain">
          <div class="chain-node active">
            <span class="node-dot"></span>
            <span class="node-text">1. Parsing user intent: "Local coffee shop marketing strategy"</span>
          </div>
          <div class="chain-node active">
            <span class="node-dot"></span>
            <span class="node-text">2. Retrieving high-converting customer retention frameworks</span>
          </div>
          <div class="chain-node active">
            <span class="node-dot"></span>
            <span class="node-text">3. Synthesizing 5 actionable promotional channels with zero fluff</span>
          </div>
        </div>
      `,
    },
    3: {
      badge: "STEP 03 SIMULATION",
      title: "Instant Production-Ready Output & Export",
      html: `
        <div style="background: #f0fdfa; padding: 1rem; border-radius: 12px; border: 1px solid rgba(13, 148, 136, 0.25);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="font-weight: 700; color: #0d9488; font-size: 0.88rem;">✓ Quality Verified (100%)</span>
            <span style="font-size: 0.78rem; color: #64748b;">Ready in 0.4s</span>
          </div>
          <p style="font-size: 0.85rem; color: #334155; margin-bottom: 0.75rem;">Structured format complete with copyable actions, bulleted roadmaps, and ready-to-run marketing steps.</p>
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" class="card-action-btn" onclick="document.getElementById('btn-copy-response').click()">📋 Copy Result</button>
            <button type="button" class="card-action-btn" onclick="document.getElementById('btn-export-response').click()">📥 Export Markdown</button>
          </div>
        </div>
      `,
    },
  };

  stepCards.forEach((card) => {
    card.addEventListener("click", () => {
      playSound("click");
      stepCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");

      const stepNum = card.dataset.step;
      const data = stepDetails[stepNum];
      if (data && simStepBadge && simStepTitle && simStepBody) {
        simStepBadge.textContent = data.badge;
        simStepTitle.textContent = data.title;
        simStepBody.innerHTML = data.html;
      }
    });
  });

  // ==========================================
  // 7. Conversations Dataset
  // ==========================================
  const conversationHistory = {
    "coffee-shop": {
      user: "Give me marketing ideas for a local coffee shop",
      response: `
        <p class="response-lead">Here are some marketing ideas for your local coffee shop:</p>
        <ol class="response-numbered-list">
          <li><strong>Social Media Campaigns</strong> – Share behind-the-scenes, customer stories, and limited-time offers.</li>
          <li><strong>Loyalty Program</strong> – Give rewards for repeat customers (e.g., buy 5 get 1 free).</li>
          <li><strong>Collaborations</strong> – Partner with local businesses or influencers.</li>
          <li><strong>Seasonal Menu</strong> – Create special drinks or offers for holidays and seasons.</li>
          <li><strong>Events</strong> – Host small events like coffee tasting or live music.</li>
        </ol>
        <p class="response-prompt-offer">Would you like me to create a promotional post for Instagram?</p>
      `,
    },
    "study-plan": {
      user: "Help me create a 7-day study plan for my Data Structures & Algorithms exam",
      response: `
        <p class="response-lead">Here is an optimized 7-day study schedule for your exam:</p>
        <ol class="response-numbered-list">
          <li><strong>Day 1 & 2: Foundations</strong> – Arrays, Linked Lists, Stacks, and Queues with 4 LeetCode practice problems.</li>
          <li><strong>Day 3 & 4: Trees & Graphs</strong> – Binary Search Trees, BFS/DFS traversals, and recursion techniques.</li>
          <li><strong>Day 5: Dynamic Programming</strong> – Memoization vs Tabulation with classic 0/1 knapsack problems.</li>
          <li><strong>Day 6: Mock Exam</strong> – Timed 2-hour practice exam without looking at solutions.</li>
          <li><strong>Day 7: Formula Review & Rest</strong> – Quick review of Big-O time and space complexities.</li>
        </ol>
        <p class="response-prompt-offer">Would you like me to generate flashcards or cheat sheets for quick memorization?</p>
      `,
    },
    "product-desc": {
      user: "Write a persuasive product description for ergonomic noise-canceling headphones",
      response: `
        <p class="response-lead">Here is a captivating product description:</p>
        <p style="margin-bottom: 0.6rem;"><strong>Immerse in Pure Focus. Built for Unstoppable Creators.</strong></p>
        <p style="margin-bottom: 0.75rem;">Experience studio-grade acoustic clarity paired with industry-leading Active Noise Cancellation. Engineered with cloud-soft memory foam earcups and 45-hour continuous battery life, they seamlessly block distractions so you can stay in flow all day long.</p>
        <ol class="response-numbered-list">
          <li><strong>Hybrid ANC</strong> – Filters up to 98% of ambient office and city noise.</li>
          <li><strong>All-Day Comfort</strong> – Ultra-lightweight 210g titanium frame.</li>
          <li><strong>Instant Multipoint Connect</strong> – Switch effortlessly between phone and laptop.</li>
        </ol>
        <p class="response-prompt-offer">Would you like 3 variations tailored for Amazon, Shopify, and Instagram ads?</p>
      `,
    },
    "research-sum": {
      user: "Summarize the key trends in Artificial Intelligence automation for 2026",
      response: `
        <p class="response-lead">Key AI Automation Trends in 2026:</p>
        <ol class="response-numbered-list">
          <li><strong>Autonomous Multi-Agent Systems</strong> – AI agents orchestrate end-to-end business workflows without manual intervention.</li>
          <li><strong>Small Language Models (SLMs) on Edge</strong> – High-speed, privacy-first AI models running locally on personal devices.</li>
          <li><strong>Multimodal Reasoning</strong> – Seamlessly processing voice, vision, documents, and real-time screen interactions simultaneously.</li>
          <li><strong>Human-in-the-Loop Safeguards</strong> – Transparent reasoning chains that allow users to inspect and approve agent actions.</li>
        </ol>
        <p class="response-prompt-offer">Would you like an executive summary slide deck export?</p>
      `,
    },
    "biz-proposal": {
      user: "Draft an executive summary for a SaaS partnership proposal",
      response: `
        <p class="response-lead">Executive Summary: Strategic Partnership</p>
        <p style="margin-bottom: 0.75rem;">This partnership proposal unites our AI intelligence layer with your enterprise customer base, unlocking an estimated <strong>35% operational cost reduction</strong> within the first quarter.</p>
        <ol class="response-numbered-list">
          <li><strong>Joint Value Proposition</strong> – Turn raw customer data into actionable real-time automations.</li>
          <li><strong>Revenue Sharing Model</strong> – Tiered 70/30 distribution with recurring lifetime incentives.</li>
          <li><strong>Implementation Roadmap</strong> – 14-day zero-downtime API integration and dedicated onboarding support.</li>
        </ol>
        <p class="response-prompt-offer">Would you like me to prepare the formal PDF contract draft?</p>
      `,
    },
    "travel-itin": {
      user: "Plan a 4-day travel itinerary for Kyoto, Japan",
      response: `
        <p class="response-lead">Here is a curated 4-Day Kyoto Itinerary:</p>
        <ol class="response-numbered-list">
          <li><strong>Day 1: Classic Eastern Kyoto</strong> – Fushimi Inari Shrine early morning, Kiyomizu-dera, and an evening stroll through Gion.</li>
          <li><strong>Day 2: Serene Arashiyama</strong> – Bamboo Grove, Tenryu-ji Temple gardens, and scenic Sagano Romantic Train.</li>
          <li><strong>Day 3: Golden Pavilion & Zen</strong> – Kinkaku-ji, Ryoan-ji rock garden, and traditional matcha ceremony in Uji.</li>
          <li><strong>Day 4: Culinary Exploration</strong> – Nishiki Market food tour and peaceful walk along the Philosopher's Path.</li>
        </ol>
        <p class="response-prompt-offer">Would you like train pass recommendations and restaurant bookings?</p>
      `,
    },
  };

  // ==========================================
  // 8. Workspace Core Engine
  // ==========================================
  const appChatThread = document.getElementById("app-chat-thread");
  const appUserInput = document.getElementById("app-user-input");
  const appInteractiveForm = document.getElementById("app-interactive-form");
  const historyEntries = document.querySelectorAll(".history-entry-item");
  const btnNewChat = document.getElementById("ws-btn-new-chat");
  const btnClearChat = document.getElementById("btn-clear-chat");
  const modelSelect = document.getElementById("ws-model-select");
  const toneSelect = document.getElementById("ws-tone-select");

  function renderActionButtons() {
    return `
      <div class="bot-card-actions">
        <button type="button" class="card-action-btn btn-copy" title="Copy text">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span>Copy</span>
        </button>
        <button type="button" class="card-action-btn btn-speak" title="Listen (Text to Speech)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          <span class="btn-speak-label">Listen</span>
        </button>
        <button type="button" class="card-action-btn btn-export" title="Export as Markdown">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>Export</span>
        </button>
        <button type="button" class="card-action-btn btn-regen" title="Regenerate answer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          <span>Regen</span>
        </button>
        <button type="button" class="card-action-btn btn-edit" title="Edit prompt">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          <span>Edit</span>
        </button>
      </div>
    `;
  }

  function loadConversation(chatId) {
    const data = conversationHistory[chatId];
    if (!data || !appChatThread) return;

    appChatThread.innerHTML = `
      <div class="chat-row user-row">
        <div class="bubble user-bubble">
          <span>${data.user}</span>
        </div>
      </div>
      <div class="chat-row bot-row">
        <div class="bot-avatar-thumb">
          <img src="assets/lay_agent_logo.png" alt="LAY AGENT">
        </div>
        <div class="bubble bot-bubble">
          <div class="bot-response-content">
            ${data.response}
          </div>
          ${renderActionButtons()}
        </div>
      </div>
    `;

    attachActionListeners();
    appChatThread.scrollTop = appChatThread.scrollHeight;
  }

  historyEntries.forEach((item) => {
    item.addEventListener("click", () => {
      playSound("click");
      historyEntries.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
      const chatId = item.dataset.chatId;
      loadConversation(chatId);
    });
  });

  if (btnNewChat) {
    btnNewChat.addEventListener("click", () => {
      playSound("click");
      historyEntries.forEach((i) => i.classList.remove("active"));
      appChatThread.innerHTML = `
        <div class="chat-row bot-row">
          <div class="bot-avatar-thumb">
            <img src="assets/lay_agent_logo.png" alt="LAY AGENT">
          </div>
          <div class="bubble bot-bubble">
            <div class="bot-response-content">
              <p class="response-lead">Hello! I'm <strong>LAY AGENT</strong>, your intelligent assistant.</p>
              <p>What would you like to accomplish today? You can write, learn, plan, or analyze documents. Try typing a message below!</p>
            </div>
          </div>
        </div>
      `;
      if (appUserInput) {
        appUserInput.value = "";
        appUserInput.focus();
      }
      showToast("Started new conversation");
    });
  }

  if (btnClearChat) {
    btnClearChat.addEventListener("click", () => {
      playSound("click");
      appChatThread.innerHTML = `
        <div class="chat-row bot-row">
          <div class="bot-avatar-thumb">
            <img src="assets/lay_agent_logo.png" alt="LAY AGENT">
          </div>
          <div class="bubble bot-bubble">
            <div class="bot-response-content">
              <p class="response-lead">Chat history cleared ✨</p>
              <p>Type a message below or speak with your microphone to start fresh.</p>
            </div>
          </div>
        </div>
      `;
      showToast("Conversation cleared");
    });
  }

  // Text-To-Speech (TTS)
  let activeUtterance = null;
  function handleSpeak(text, btn) {
    if (!("speechSynthesis" in window)) {
      showToast("Text-To-Speech not supported in this browser");
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      document.querySelectorAll(".btn-speak").forEach((b) => {
        b.classList.remove("speaking");
        const lbl =
          b.querySelector(".btn-speak-label") ||
          b.querySelector("span:last-child");
        if (lbl) lbl.textContent = "Listen";
      });
      showToast("Audio playback stopped ⏹️");
      return;
    }

    const cleanText = text.replace(/<[^>]*>?/gm, "");
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.lang = currentLang === "ID" ? "id-ID" : "en-US";

    btn.classList.add("speaking");
    const lbl =
      btn.querySelector(".btn-speak-label") ||
      btn.querySelector("span:last-child");
    if (lbl) lbl.textContent = "Stop";

    utter.onend = () => {
      btn.classList.remove("speaking");
      if (lbl) lbl.textContent = "Listen";
    };

    utter.onerror = () => {
      btn.classList.remove("speaking");
      if (lbl) lbl.textContent = "Listen";
    };

    window.speechSynthesis.speak(utter);
    showToast("Reading response aloud... 🗣️");
  }

  // Export to Markdown file
  function handleExport(text) {
    const cleanText = text.replace(/<[^>]*>?/gm, "");
    const markdownContent = `# TEMAN AI Export\nGenerated: ${new Date().toLocaleString()}\n\n---\n\n${cleanText}\n\n---\n*Created with TEMAN AI — AI, made simple.*`;
    const blob = new Blob([markdownContent], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `teman_ai_export_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    playSound("complete");
    showToast("Exported conversation as Markdown! 📥");
  }

  function attachActionListeners() {
    const copyBtns = document.querySelectorAll(
      ".card-action-btn.btn-copy, #btn-copy-response",
    );
    copyBtns.forEach((btn) => {
      btn.onclick = () => {
        playSound("click");
        const textToCopy = btn
          .closest(".bot-bubble")
          .querySelector(".bot-response-content").innerText;
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            showToast("Copied to clipboard! 📋");
          })
          .catch(() => {
            showToast("Text copied to clipboard!");
          });
      };
    });

    const speakBtns = document.querySelectorAll(
      ".card-action-btn.btn-speak, #btn-speak-response",
    );
    speakBtns.forEach((btn) => {
      btn.onclick = () => {
        playSound("click");
        const textToSpeak = btn
          .closest(".bot-bubble")
          .querySelector(".bot-response-content").innerText;
        handleSpeak(textToSpeak, btn);
      };
    });

    const exportBtns = document.querySelectorAll(
      ".card-action-btn.btn-export, #btn-export-response",
    );
    exportBtns.forEach((btn) => {
      btn.onclick = () => {
        playSound("click");
        const textToExport = btn
          .closest(".bot-bubble")
          .querySelector(".bot-response-content").innerText;
        handleExport(textToExport);
      };
    });

    const regenBtns = document.querySelectorAll(
      ".card-action-btn.btn-regen, #btn-regen-response",
    );
    regenBtns.forEach((btn) => {
      btn.onclick = () => {
        playSound("send");
        showToast("Regenerating alternative suggestions... ⚡");
        const contentEl = btn
          .closest(".bot-bubble")
          .querySelector(".bot-response-content");
        if (contentEl) {
          contentEl.style.opacity = "0.4";
          setTimeout(() => {
            contentEl.style.opacity = "1";
            playSound("complete");
            showToast("Response refreshed with optimized insights!");
          }, 600);
        }
      };
    });

    const editBtns = document.querySelectorAll(
      ".card-action-btn.btn-edit, #btn-edit-response",
    );
    editBtns.forEach((btn) => {
      btn.onclick = () => {
        playSound("click");
        const userMsg = document.querySelector(
          ".chat-row.user-row .user-bubble span",
        );
        if (userMsg && appUserInput) {
          appUserInput.value = userMsg.textContent;
          appUserInput.focus();
          showToast("Prompt loaded into input for editing");
        }
      };
    });
  }

  attachActionListeners();

  function handleSendMessage(text) {
    if (!text || !text.trim()) return;

    playSound("send");

    const userRow = document.createElement("div");
    userRow.className = "chat-row user-row";
    userRow.innerHTML = `
      <div class="bubble user-bubble">
        <span>${escapeHtml(text)}</span>
      </div>
    `;
    appChatThread.appendChild(userRow);
    appChatThread.scrollTop = appChatThread.scrollHeight;

    if (appUserInput) appUserInput.value = "";

    const botRow = document.createElement("div");
    botRow.className = "chat-row bot-row";
    botRow.innerHTML = `
      <div class="bot-avatar-thumb">
        <img src="assets/lay_agent_logo.png" alt="LAY AGENT">
      </div>
      <div class="bubble bot-bubble">
        <div class="bot-response-content">
          <p class="response-lead" style="color: var(--teal-primary);">
            <span class="status-live-dot"></span> LAY AGENT is thinking...
          </p>
        </div>
      </div>
    `;
    appChatThread.appendChild(botRow);
    appChatThread.scrollTop = appChatThread.scrollHeight;

    setTimeout(() => {
      playSound("complete");
      const responseHtml = generateContextualResponse(text);
      const contentContainer = botRow.querySelector(".bot-response-content");
      contentContainer.innerHTML = responseHtml;

      const actionsBar = document.createElement("div");
      actionsBar.innerHTML = renderActionButtons();
      botRow
        .querySelector(".bot-bubble")
        .appendChild(actionsBar.firstElementChild);
      attachActionListeners();
      appChatThread.scrollTop = appChatThread.scrollHeight;
    }, 750);
  }

  if (appInteractiveForm) {
    appInteractiveForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (appUserInput) {
        handleSendMessage(appUserInput.value);
      }
    });
  }

  document.querySelectorAll(".prompt-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const promptText = chip.dataset.prompt;
      if (promptText) {
        if (appUserInput) appUserInput.value = promptText;
        handleSendMessage(promptText);
      }
    });
  });

  document.querySelectorAll(".action-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const task = chip.dataset.task;
      let promptText = "";

      switch (task) {
        case "write":
          promptText =
            "Help me write an impactful executive summary for our AI automation platform.";
          break;
        case "learn":
          promptText =
            "Explain how neural networks and intelligent agents work in plain English.";
          break;
        case "analyze":
          promptText =
            "Analyze the key productivity gains from automated agent workflows in 2026.";
          break;
        case "plan":
          promptText =
            "Create a step-by-step launch roadmap for our new intelligent assistant.";
          break;
      }

      scrollToWorkspace();
      setTimeout(() => {
        if (appUserInput) appUserInput.value = promptText;
        handleSendMessage(promptText);
      }, 500);
    });
  });

  document.querySelectorAll(".feature-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      const topic = tile.dataset.topic;
      scrollToWorkspace();
      setTimeout(() => {
        const query = `Demonstrate how TEMAN AI helps with ${topic} with a realistic example.`;
        if (appUserInput) appUserInput.value = query;
        handleSendMessage(query);
      }, 500);
    });
  });

  // Hero Command Bar Execution
  const heroCommandForm = document.getElementById("hero-command-form");
  const heroQuickInput = document.getElementById("hero-quick-input");

  if (heroCommandForm && heroQuickInput) {
    heroCommandForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = heroQuickInput.value.trim();
      if (!query) {
        heroQuickInput.focus();
        showToast("Please type a task or question");
        return;
      }

      heroQuickInput.value = "";
      scrollToWorkspace();
      setTimeout(() => {
        if (appUserInput) appUserInput.value = query;
        handleSendMessage(query);
      }, 500);
    });
  }

  document.querySelectorAll(".quick-tag-pill").forEach((tag) => {
    tag.addEventListener("click", () => {
      const prompt = tag.dataset.heroPrompt;
      if (prompt) {
        scrollToWorkspace();
        setTimeout(() => {
          if (appUserInput) appUserInput.value = prompt;
          handleSendMessage(prompt);
        }, 500);
      }
    });
  });

  // Web Speech API Voice Recognition & Spectrum Visualizer
  const micBtn = document.getElementById("app-btn-mic");
  const voiceSpectrum = document.getElementById("voice-spectrum");
  const voiceStopBtn = document.getElementById("voice-stop-btn");
  let recognition = null;
  let micTimer = null;

  function showVoiceVisualizer() {
    if (voiceSpectrum) voiceSpectrum.style.display = "flex";
    if (micBtn) {
      micBtn.style.color = "#06b6d4";
      micBtn.style.transform = "scale(1.15)";
    }
    playSound("mic");
  }

  function hideVoiceVisualizer() {
    if (voiceSpectrum) voiceSpectrum.style.display = "none";
    if (micBtn) {
      micBtn.style.color = "";
      micBtn.style.transform = "";
    }
    if (micTimer) clearTimeout(micTimer);
  }

  if (voiceStopBtn) {
    voiceStopBtn.addEventListener("click", () => {
      hideVoiceVisualizer();
      if (recognition) recognition.stop();
    });
  }

  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRec =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      showVoiceVisualizer();
      showToast("Neural audio processor listening... 🎙️");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      hideVoiceVisualizer();
      if (appUserInput) {
        appUserInput.value = transcript;
        showToast(`Recognized: "${transcript}"`);
        handleSendMessage(transcript);
      }
    };

    recognition.onerror = () => {
      fallbackMicSimulation();
    };

    recognition.onend = () => {
      hideVoiceVisualizer();
    };
  }

  function fallbackMicSimulation() {
    showVoiceVisualizer();
    showToast("Neural voice listening... 🎙️");

    micTimer = setTimeout(() => {
      hideVoiceVisualizer();
      const sampleQueries = [
        "Analyze our quarterly customer retention metrics and recommend three growth catalysts.",
        "Create a high-impact marketing hook for our new intelligent assistant release.",
        "Summarize the core benefits of autonomous agent workflows for business teams.",
      ];
      const selected =
        sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      if (appUserInput) {
        appUserInput.value = selected;
        showToast("Speech synthesized ✨");
        setTimeout(() => handleSendMessage(selected), 400);
      }
    }, 2400);
  }

  if (micBtn) {
    micBtn.addEventListener("click", () => {
      if (recognition) {
        try {
          recognition.lang = currentLang === "ID" ? "id-ID" : "en-US";
          recognition.start();
        } catch (e) {
          fallbackMicSimulation();
        }
      } else {
        fallbackMicSimulation();
      }
    });
  }

  // File Attach Simulation
  const attachBtn = document.getElementById("app-btn-attach");
  const hiddenFileInput = document.getElementById("app-hidden-file");
  if (attachBtn && hiddenFileInput) {
    attachBtn.addEventListener("click", () => {
      playSound("click");
      hiddenFileInput.click();
    });
    hiddenFileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        const filename = e.target.files[0].name;
        playSound("complete");
        showToast(`Attached: ${filename} 📄 Ready for analysis.`);
        if (appUserInput) {
          appUserInput.value = `Analyze and summarize the key findings in ${filename}`;
          appUserInput.focus();
        }
      }
    });
  }

  // Fullscreen Workspace Window Expand Button
  const btnExpand = document.getElementById("btn-expand-full-workspace");
  const workspaceFrame = document.getElementById("interactive-workspace-frame");
  if (btnExpand && workspaceFrame) {
    btnExpand.addEventListener("click", () => {
      playSound("click");
      workspaceFrame.classList.toggle("expanded");
      showToast(
        workspaceFrame.classList.contains("expanded")
          ? "Workspace maximized 🔲"
          : "Standard view ◻️",
      );
    });
  }

  // Contextual Response Generator with Neural Thought Chain
  function generateContextualResponse(query) {
    const q = query.toLowerCase();
    const tone = toneSelect ? toneSelect.value : "friendly";
    const thoughtTime = (1.0 + Math.random() * 0.6).toFixed(1);

    const thoughtHtml = `
      <details class="thought-accordion" open>
        <summary class="thought-summary">
          <span class="thought-spark">✧</span>
          <span>Reasoned for ${thoughtTime}s</span>
          <span class="thought-toggle-arrow">▾</span>
        </summary>
        <div class="thought-body">
          <div class="thought-step"><span class="step-check">✓</span> <span>Parsed user intent & query syntax</span></div>
          <div class="thought-step"><span class="step-check">✓</span> <span>Retrieved actionable heuristics for <strong>${tone}</strong> profile</span></div>
          <div class="thought-step"><span class="step-check">✓</span> <span>Generated concise, production-ready output with zero fluff</span></div>
        </div>
      </details>
    `;

    let contentHtml = "";
    if (
      q.includes("instagram") ||
      q.includes("coffee") ||
      q.includes("promo")
    ) {
      contentHtml = `
        <p class="response-lead">Here is an engaging Instagram promotional caption:</p>
        <p style="margin-bottom: 0.75rem;">
          ☕ <em>Sip into autumn perfection.</em> Introducing our handcrafted <strong>Golden Hazelnut Latte</strong> — roasted locally and blended with creamy oat milk and a hint of warm vanilla bean.
        </p>
        <p style="margin-bottom: 0.75rem;">
          ✨ Tag a coffee lover you want to bring this week! First 50 guests get a complimentary pastry bite.
        </p>
        <p style="color: var(--teal-primary); font-weight: 500;">#CoffeeLovers #LocalRoastery #AutumnFlavors #ArtisanCoffee #WeekendVibes</p>
        <p class="response-prompt-offer" style="margin-top: 0.75rem;">Would you like 3 aesthetic photo suggestions and story sticker ideas to match?</p>
      `;
    } else if (
      q.includes("email") ||
      q.includes("collab") ||
      q.includes("partner") ||
      q.includes("speaker") ||
      q.includes("invite")
    ) {
      contentHtml = `
        <p class="response-lead">Here is a tailored, professional email draft:</p>
        <p style="margin-bottom: 0.5rem;"><strong>Subject:</strong> Quick idea for community partnership / keynote session</p>
        <p style="margin-bottom: 0.6rem;">Hi [Name],</p>
        <p style="margin-bottom: 0.6rem;">I have been admiring the community and innovation you have built at [Organization]. As a neighboring local business, we love creating memorable experiences for our guests.</p>
        <p style="margin-bottom: 0.6rem;">We’d love to explore a joint session or co-promotion that connects both of our communities together.</p>
        <p style="margin-bottom: 0.6rem;">Would you be open to a 10-minute coffee chat this Thursday to brainstorm?</p>
        <p>Best regards,<br>[Your Name]</p>
      `;
    } else if (
      q.includes("agent") ||
      q.includes("architecture") ||
      q.includes("learn") ||
      q.includes("automation")
    ) {
      contentHtml = `
        <p class="response-lead">Here is the architectural comparison between Traditional Automation & Autonomous AI Agents:</p>
        <ol class="response-numbered-list">
          <li><strong>Deterministic vs Adaptive</strong> – Traditional automation strictly follows pre-written if/else rules, whereas autonomous agents dynamically evaluate context and adjust course when conditions change.</li>
          <li><strong>Autonomous Multi-Step Tool Use</strong> – Agents formulate execution plans, invoke external tools, inspect outputs, and self-correct errors independently.</li>
          <li><strong>Natural Human Interface</strong> – Zero need to configure rigid templates; humans provide objectives in natural language, and agents handle synthesis.</li>
        </ol>
        <p class="response-prompt-offer">Would you like me to generate a printable workflow diagram or code integration snippet?</p>
      `;
    } else if (
      q.includes("write") ||
      q.includes("summary") ||
      q.includes("proposal") ||
      q.includes("hook") ||
      q.includes("market")
    ) {
      contentHtml = `
        <p class="response-lead">Here is a structured draft prepared for you (${tone.toUpperCase()} TONE):</p>
        <ol class="response-numbered-list">
          <li><strong>Core Objective</strong> – Streamline daily workflows and accelerate turnaround by 40%.</li>
          <li><strong>Actionable Strategy</strong> – Deploy intelligent automation tools with seamless integration into existing toolchains.</li>
          <li><strong>Expected Impact</strong> – Faster decisions, zero manual copy-pasting, and measurable time savings.</li>
        </ol>
        <p class="response-prompt-offer">Would you like me to refine this into a formal PDF report or bullet-point slides?</p>
      `;
    } else {
      contentHtml = `
        <p class="response-lead">Here is what I've prepared for: <em>"${escapeHtml(query)}"</em></p>
        <ol class="response-numbered-list">
          <li><strong>Key Insight</strong> – Clear, natural language requests enable faster results without prompt tuning.</li>
          <li><strong>Step-by-Step Plan</strong> – Break complex workflows into structured, manageable actions.</li>
          <li><strong>Output Optimization</strong> – Tailored tone (${tone}) ready for immediate sharing or export.</li>
        </ol>
        <p class="response-prompt-offer">Would you like me to expand on any specific aspect or export this format?</p>
      `;
    }

    return contentHtml;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
