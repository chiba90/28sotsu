/**
 * PRESENTATION ENGINE & CONTROLLER
 * Imperial Gold Hardcover Memoir Edition: 『不確実性を生き抜く生存戦略』(Napoleon Style)
 * Features: Roman Numeral Chapter Navigation, Heroic Timeline Avatar, Bento Gold Foil Cards,
 * Real-time Memoir Search (Ctrl+K), "I'm Feeling Lucky" Jump, "Do a Barrel Roll" Easter Egg.
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('slides-container');
  const slideIndexList = document.getElementById('slide-index-list');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const progressFill = document.getElementById('progress-fill');
  const currentNumDisplay = document.getElementById('current-slide-num');
  
  let currentSlideIndex = 0;
  const slidesData = PRESENTATION_DATA.slides;

  const ROMAN_NUMERALS = [
    "COVER", "CHAPTER I", "CHAPTER II", "CHAPTER III", "CHAPTER IV", "CHAPTER V",
    "CHAPTER VI", "CHAPTER VII", "CHAPTER VIII", "CHAPTER IX", "CHAPTER X"
  ];

  // Expose navigation to window for button clicks
  window.goToSlide = goToSlide;

  // ==========================================
  // 1. SLIDE TEMPLATE GENERATORS
  // ==========================================

  function createBadge(badge, accent) {
    return `<div class="slide-badge badge-${accent}">${badge}</div>`;
  }

  function getCardAccentClass(accent) {
    switch (accent) {
      case 'amber': return 'glass-card-accent-amber';
      case 'blue': return 'glass-card-accent-blue';
      case 'purple': return 'glass-card-accent-purple';
      case 'emerald': return 'glass-card-accent-emerald';
      case 'rose': return 'glass-card-accent-rose';
      default: return '';
    }
  }

  const templates = {
    // COVER TEMPLATE (FRONT HARDCOVER)
    cover: (slide) => '',

    // HERO / INTRO TEMPLATE (BOOK COVER / PROLOGUE)
    hero: (slide) => {
      const p = slide.presenter || {};
      const m = slide.metric || {};
      const t = slide.theme || {};
      const imp = slide.impact || {};
      const storiesHtml = slide.stories ? `
        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
          ${slide.stories.map(s => `<span class="story-pill story-pill-${s.pillColor || 'blue'}">${s.pill}</span>`).join('')}
        </div>
      ` : '';
      return `
        <div class="hero-grid anim-el delay-2">
          <!-- Author Info (Full Row) -->
          <div class="glass-card" style="grid-column: 1 / -1; min-height: 170px;">
            ${storiesHtml}
            <div class="profile-card-header">
              <div>
                <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; font-weight: 800; color: #fef08a; tracking-wider; text-transform: uppercase;">AUTHOR PROFILE</span>
                <h3 style="font-size: 1.65rem; font-weight: 900; margin-top: 0.25rem; color: var(--text-main);">${p.name || ''}</h3>
                <p style="font-size: 0.925rem; color: var(--text-muted); margin-top: 0.1rem; font-weight: 600;">${p.role || ''}</p>
              </div>
              ${p.daughterImg ? `
                <div class="avatar-thumb" onclick="event.stopPropagation(); zoomDaughter();" title="クリックで愛娘の写真拡大！">
                  <img src="${p.daughterImg}" alt="${p.daughterName}">
                </div>
              ` : ''}
            </div>
            <p style="font-size: 0.975rem; color: var(--text-muted); margin-top: 0.85rem; line-height: 1.55; font-weight: 500;">
              ${p.daughterNote ? p.daughterNote : (p.note || '')}
            </p>
            <p style="font-size: 0.85rem; color: var(--text-dim); margin-top: 0.85rem; border-top: 1px solid var(--border-card); padding-top: 0.65rem; font-weight: 700;">
              ${p.university || ''}
            </p>
          </div>

          <!-- Bottom Row Card 1: Continuity Metric -->
          <div class="glass-card ${getCardAccentClass(slide.accent)}">
            <div>
              <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; font-weight: 800; color: #38bdf8; tracking-wider; text-transform: uppercase;">${m.badge || ''}</span>
              <div style="font-size: 3.5rem; font-weight: 900; background: linear-gradient(135deg, #fef08a 0%, #d4af37 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-top: 0.35rem; line-height: 1; letter-spacing: -0.03em;">${m.value || ''}</div>
              <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin-top: 0.35rem;">${m.label || ''}</h4>
            </div>
            <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.65rem; border-top: 1px solid var(--border-card); padding-top: 0.5rem;">
              ${m.note || ''}
            </p>
          </div>

          <!-- Bottom Row Card 2: Core Theme -->
          <div class="glass-card ${getCardAccentClass(slide.accent)}">
            <div>
              <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; font-weight: 800; color: #38bdf8; tracking-wider; text-transform: uppercase;">${t.badge || ''}</span>
              <h4 style="font-size: 1.35rem; font-weight: 900; color: var(--text-main); margin-top: 0.6rem; line-height: 1.35;">${t.title || ''}</h4>
            </div>
            <p style="font-size: 0.925rem; color: var(--text-muted); margin-top: 0.85rem; border-top: 1px solid var(--border-card); padding-top: 0.65rem;">
              ${t.note || ''}
            </p>
          </div>

          <!-- Bottom Row Card 3: Career Track Record -->
          <div class="glass-card ${getCardAccentClass(slide.accent)}">
            <div>
              <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; font-weight: 800; color: #38bdf8; tracking-wider; text-transform: uppercase;">${imp.badge || ''}</span>
              <h4 style="font-size: 1.35rem; font-weight: 900; color: var(--text-main); margin-top: 0.6rem; line-height: 1.35;">${imp.title || ''}</h4>
            </div>
            <p style="font-size: 0.925rem; color: var(--text-muted); margin-top: 0.85rem; border-top: 1px solid var(--border-card); padding-top: 0.65rem;">
              ${imp.note || ''}
            </p>
          </div>
        </div>
      `;
    },

    // SPLIT CARDS TEMPLATE
    split: (slide) => {
      const cardsHtml = slide.cards.map(c => `
        <div class="glass-card ${getCardAccentClass(c.badgeColor)}">
          <div style="display: flex; flex-direction: column; height: 100%;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                ${c.storyTag ? `<span class="story-pill story-pill-${c.badgeColor || 'blue'}">${c.storyTag}</span>` : ''}
                <span class="slide-badge badge-${c.badgeColor}">${c.badge}</span>
              </div>
              <h3 style="font-size: 1.45rem; font-weight: 900; color: var(--text-main); margin: 0.75rem 0 0.85rem 0; line-height: 1.35;">${c.title}</h3>
              ${c.lead ? `<p style="font-size: 1.125rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.45rem;">${c.lead}</p>` : ''}
              <p style="font-size: 1.025rem; color: var(--text-muted); line-height: 1.7;">${c.body}</p>
            </div>
            ${c.footer ? `<div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-card); font-size: 0.875rem; font-weight: 800; color: #fef08a;">${c.footer}</div>` : ''}
          </div>
        </div>
      `).join('');
      return `<div class="split-grid anim-el delay-2">${cardsHtml}</div>`;
    },

    // GRID CARDS TEMPLATE
    grid: (slide) => {
      const cardsHtml = slide.cards.map(c => `
        <div class="glass-card ${getCardAccentClass(c.badgeColor)}">
          <div style="display: flex; flex-direction: column; height: 100%;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                ${c.storyTag ? `<span class="story-pill story-pill-${c.badgeColor || 'blue'}">${c.storyTag}</span>` : ''}
                <span class="slide-badge badge-${c.badgeColor}">${c.badge}</span>
              </div>
              <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--text-main); margin: 0.75rem 0 0.65rem 0; line-height: 1.35;">${c.title}</h3>
              ${c.lead ? `<p style="font-size: 1.075rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.4rem;">${c.lead}</p>` : ''}
              <p style="font-size: 0.975rem; color: var(--text-muted); line-height: 1.65;">${c.body}</p>
            </div>
            ${c.footer ? `<div style="margin-top: auto; padding-top: 0.85rem; border-top: 1px solid var(--border-card); font-size: 0.825rem; font-weight: 800; color: #fef08a;">${c.footer}</div>` : ''}
          </div>
        </div>
      `).join('');
      return `<div class="grid-3 anim-el delay-2">${cardsHtml}</div>`;
    },

    // W-STAR CASE STUDY TEMPLATE
    "w-star": (slide) => {
      const s = slide.star;
      const w = slide.why;

      return `
        <div class="wstar-container anim-el delay-2">
          <!-- STAR 2x2 Columns -->
          <div class="star-2x2">
            <!-- Situation -->
            <div class="glass-card">
              <div>
                <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; font-weight: 800; color: #d4af37; tracking-wider; text-transform: uppercase;">S : Situation</span>
                <p style="font-size: 0.925rem; color: var(--text-muted); margin-top: 0.4rem; line-height: 1.5;">${s.s}</p>
              </div>
            </div>
            <!-- Task -->
            <div class="glass-card">
              <div>
                <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; font-weight: 800; color: #d4af37; tracking-wider; text-transform: uppercase;">T : Task</span>
                <p style="font-size: 0.925rem; color: var(--text-muted); margin-top: 0.4rem; line-height: 1.5;">${s.t}</p>
              </div>
            </div>
            <!-- Action -->
            <div class="glass-card">
              <div>
                <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; font-weight: 800; color: #d4af37; tracking-wider; text-transform: uppercase;">A : Action</span>
                <p style="font-size: 0.925rem; color: var(--text-muted); margin-top: 0.4rem; line-height: 1.5;">${s.a}</p>
              </div>
            </div>
            <!-- Result -->
            <div class="glass-card ${getCardAccentClass(slide.accent)}">
              <div>
                <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; font-weight: 800; color: #d4af37; tracking-wider; text-transform: uppercase;">R : Result</span>
                <p style="font-size: 0.95rem; color: var(--text-main); margin-top: 0.4rem; line-height: 1.5; font-weight: 700;">${s.r}</p>
              </div>
            </div>
          </div>

          <!-- Why Highlight Card -->
          <div class="glass-card ${getCardAccentClass(slide.accent)}" style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98)); border-color: rgba(212, 175, 55, 0.5); padding: 0.95rem 1.15rem;">
            <div style="display: flex; flex-direction: column; height: 100%;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                  ${w.storyTag ? `<span class="story-pill story-pill-amber">${w.storyTag}</span>` : ''}
                  <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; font-weight: 800; color: #fef08a; tracking-wider; text-transform: uppercase;">${w.title}</span>
                </div>
                ${w.lead ? `<p style="font-size: 1.05rem; font-weight: 900; color: var(--text-main); margin-top: 0.35rem; line-height: 1.4;">${w.lead}</p>` : ''}
                <p style="font-size: 0.925rem; color: var(--text-muted); margin-top: 0.45rem; line-height: 1.55;">${w.body}</p>
              </div>
              ${w.footer ? `<div style="margin-top: auto; padding-top: 0.75rem; border-top: 1px solid var(--border-card); font-size: 0.825rem; font-weight: 800; color: #fef08a;">${w.footer}</div>` : ''}
            </div>
          </div>
        </div>
      `;
    },

    // TRUTH & MYTH (PHILOSOPHY TEMPLATE)
    truth: (slide) => {
      const m = slide.myth;
      const f = slide.fact;
      return `
        <div class="truth-grid anim-el delay-2">
          <!-- Myth Card -->
          <div class="glass-card glass-card-accent-rose">
            <div style="display: flex; flex-direction: column; height: 100%;">
              <div>
                <span class="slide-badge badge-rose">${m.label}</span>
                <blockquote style="font-size: 1.35rem; font-weight: 800; color: #fecdd3; font-style: italic; margin: 1.25rem 0 1rem 0; line-height: 1.45; border-left: 3px solid #f43f5e; padding-left: 1rem;">
                  ${m.quote}
                </blockquote>
                <p style="font-size: 1rem; color: var(--text-muted); line-height: 1.65;">${m.note}</p>
              </div>
              ${m.footer ? `<div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-card); font-size: 0.875rem; font-weight: 800; color: #fb7185;">${m.footer}</div>` : ''}
            </div>
          </div>

          <!-- Fact Card -->
          <div class="glass-card glass-card-accent-amber" style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));">
            <div style="display: flex; flex-direction: column; height: 100%;">
              <div>
                <span class="slide-badge badge-amber">${f.label}</span>
                <blockquote style="font-size: 1.35rem; font-weight: 900; color: #fef08a; margin: 1.25rem 0 0.85rem 0; line-height: 1.45;">
                  ${f.quote}
                </blockquote>
                ${f.lead ? `<p style="font-size: 1.125rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">${f.lead}</p>` : ''}
                <p style="font-size: 1.025rem; color: var(--text-muted); line-height: 1.7;">${f.body}</p>
              </div>
              ${f.footer ? `<div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-card); font-size: 0.875rem; font-weight: 800; color: #fef08a;">${f.footer}</div>` : ''}
            </div>
          </div>
        </div>
      `;
    },

    // CLOSING & Q&A SESSION TEMPLATE
    closing: (slide) => {
      const cardsHtml = slide.cards.map((c, idx) => `
        <div class="glass-card ${getCardAccentClass(slide.accent)}" style="cursor: pointer;" onclick="openQAModal(${idx})">
          <div style="display: flex; flex-direction: column; height: 100%;">
            <div>
              <div style="font-size: 2.25rem; margin-bottom: 0.65rem;">${c.icon}</div>
              <h3 style="font-size: 1.4rem; font-weight: 900; color: var(--text-main); margin-bottom: 0.45rem;">${c.title}</h3>
              <p style="font-size: 1.075rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.65rem;">${c.lead}</p>
              <p style="font-size: 0.975rem; color: var(--text-muted); line-height: 1.65;">${c.body}</p>
            </div>
            ${c.footer ? `<div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-card); font-size: 0.875rem; font-weight: 800; color: #fef08a;">${c.footer}</div>` : ''}
          </div>
        </div>
      `).join('');
      return `<div class="split-grid anim-el delay-2">${cardsHtml}</div>`;
    }
  };

  // ==========================================
  // 2. SLIDE RENDERER
  // ==========================================

  function renderSlides() {
    container.innerHTML = '';
    slideIndexList.innerHTML = '';

    slidesData.forEach((slide, index) => {
      const slideEl = document.createElement('div');
      slideEl.className = `slide ${index === 0 ? 'active' : ''}`;
      slideEl.id = slide.id;

      const templateFn = templates[slide.type] || templates.hero;
      const bodyContent = templateFn(slide);

      if (index === 0) {
        // SLIDE 0: LANDSCAPE AUTOBIOGRAPHY BOOK FRONT COVER (絵本・自伝 豪華ハードカバー表表紙)
        slideEl.innerHTML = `
          <div class="light-sweep light-sweep-active"></div>
          <div class="landscape-picture-book-cover anim-el delay-1">
            <!-- Left Binding Spine Fold (左側の背表紙・折り目) -->
            <div class="picture-book-spine-left">
              <span class="spine-vertical-text">自伝・千葉博文手記</span>
            </div>

            <!-- Silk Crimson Bookmark Ribbon extending from Top Left Spine -->
            <div class="picture-book-ribbon"></div>

            <!-- Front Cover Parchment & Gold Foil Stamping Area -->
            <div class="book-cover-page">
              <div class="cover-crest">⚜️ EXECUTIVE MEMOIR AUTOBIOGRAPHY ⚜️</div>

              <div class="cover-title-group">
                <span class="cover-eyebrow">― 東証上場企業 取締役の当事者記録 ―</span>
                <h1 class="cover-main-title">自伝 『不確実性を生き抜く生存戦略』</h1>
                <p class="cover-main-subtitle">
                  筑波大学新卒入社から一度も転職せずに東証上場企業の取締役へ。<br>
                  激動の13年間、会社の天国と地獄をくぐり抜けた生存記録
                </p>
              </div>

              <div class="cover-highlights-grid">
                <div class="cover-tag-item">📌 東証上場維持・売上99%減からの事業再生</div>
                <div class="cover-tag-item">📌 M&A事業統合・GMV300億円規模への飛躍</div>
                <div class="cover-tag-item">📌 綺麗事抜きのキャリア哲学・裁量権の本音</div>
                <div class="cover-tag-item">👧 愛娘・夏歌ちゃんに誇れる未来を創る原動力</div>
              </div>

              <div class="cover-author-footer">
                <div class="cover-author-info">
                  <span class="author-name">著者：千葉 博文</span>
                  <span class="author-role">株式会社デジタルプラス 取締役 (2013年新卒入社)</span>
                </div>
                <button class="open-book-btn" onclick="window.goToSlide(1)">
                  📖 本を開いて読む (第一章へ) ➔
                </button>
              </div>
            </div>
          </div>
        `;
      } else {
        // SLIDES 1-10: LANDSCAPE PICTURE BOOK PAGES (本編全10章・左綴じ横長紙面)
        slideEl.innerHTML = `
          <div class="light-sweep light-sweep-active"></div>
          ${index === slidesData.length - 1 ? '<div class="super-glow super-glow-active"></div>' : ''}
          
          <div class="landscape-picture-book anim-el delay-1">
            <!-- Left Binding Spine Fold (左側の背表紙・折り目) -->
            <div class="picture-book-spine-left">
              <span class="spine-vertical-text">自伝・千葉博文手記</span>
            </div>

            <!-- Silk Crimson Bookmark Ribbon extending from Top Left Spine -->
            <div class="picture-book-ribbon"></div>

            <!-- Main Parchment Paper Canvas (横長紙面) -->
            <div class="picture-book-page">
              <!-- Running Header Line -->
              <div class="picture-book-header">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span class="picture-book-chapter-num">${ROMAN_NUMERALS[index]}</span>
                  <span class="picture-book-badge">${slide.badge}</span>
                </div>
                <span style="font-size: 0.8rem; font-weight: 700; color: #d4af37;">自伝 『不確実性を生き抜く生存戦略』 著 千葉 博文</span>
              </div>

              <!-- Chapter Title & Subtitle -->
              <div style="margin-bottom: 0.45rem;">
                <h2 class="picture-book-title">${slide.title}</h2>
                <p class="picture-book-subtitle">${slide.subtitle}</p>
              </div>

              <!-- Content Body (STAR Grid / Story Cards) -->
              <div class="picture-book-body">
                ${bodyContent}
              </div>

              <!-- Page Footer & Running Page Number -->
              <div class="picture-book-footer">
                <span>— CHAPTER ${index} OF 10 —</span>
                <span>PAGE ${index} OF 10</span>
              </div>
            </div>
          </div>
        `;
      }

      container.appendChild(slideEl);

      // Render Table of Contents Drawer Item
      const indexItem = document.createElement('div');
      indexItem.className = `index-item ${index === 0 ? 'active' : ''}`;
      indexItem.innerHTML = `
        <span class="index-roman">${ROMAN_NUMERALS[index]}</span>
        <div class="index-info">
          <div class="index-badge">${slide.badge}</div>
          <div class="index-title">${slide.title}</div>
        </div>
      `;
      indexItem.addEventListener('click', () => {
        goToSlide(index);
        closeDrawer();
      });
      slideIndexList.appendChild(indexItem);
    });

    updateNavigation();
  }

  // ==========================================
  // 3. NAVIGATION CONTROLLER
  // ==========================================

  function goToSlide(index) {
    if (index < 0 || index >= slidesData.length) return;
    
    currentSlideIndex = index;
    const slides = container.querySelectorAll('.slide');

    slides.forEach((s, idx) => {
      if (idx === currentSlideIndex) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    updateNavigation();
  }

  function updateNavigation() {
    // Buttons disabled state
    prevBtn.disabled = currentSlideIndex === 0;
    nextBtn.disabled = currentSlideIndex === slidesData.length - 1;

    // Slide Counter Display (Roman Numeral / Title)
    currentNumDisplay.textContent = ROMAN_NUMERALS[currentSlideIndex];

    // Progress Bar Fill Percentage
    const progressPct = ((currentSlideIndex) / (slidesData.length - 1)) * 100;
    progressFill.style.width = `${progressPct}%`;

    // Interactive Hero Timeline Character Position
    updateTimelineAvatar(progressPct, currentSlideIndex);

    // Active Drawer Item Highlight
    const drawerItems = slideIndexList.querySelectorAll('.index-item');
    drawerItems.forEach((item, idx) => {
      if (idx === currentSlideIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // ==========================================
  // 4. TIMELINE AVATAR CHARACTER ENGINE
  // ==========================================

  const avatarContainer = document.getElementById('timeline-avatar');
  const avatarLabel = document.getElementById('avatar-label');
  const avatarGraphic = document.getElementById('avatar-graphic');

  const STAGE_LABELS = [
    { label: "表表紙", class: "man-dignity-badge" },
    { label: "序章", class: "man-dignity-badge" },
    { label: "原点 2011", class: "man-dignity-badge" },
    { label: "栄光 4億円", class: "man-dignity-badge" },
    { label: "試練 50年創出", class: "man-dignity-badge" },
    { label: "再生 M&A", class: "man-dignity-badge" },
    { label: "飛躍 300億", class: "man-dignity-badge" },
    { label: "哲学Ⅰ 学び", class: "man-dignity-badge" },
    { label: "哲学Ⅱ 裁量", class: "man-dignity-badge" },
    { label: "志 地方創生", class: "man-dignity-badge" },
    { label: "結び 対話", class: "man-dignity-badge" }
  ];

  function updateTimelineAvatar(pct, idx) {
    if (!avatarContainer) return;
    avatarContainer.style.left = `${pct}%`;
    const stage = STAGE_LABELS[idx] || STAGE_LABELS[0];
    if (avatarLabel) avatarLabel.textContent = stage.label;
  }

  // Prev / Next Button Handlers
  prevBtn.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlideIndex + 1));

  // ==========================================
  // 5. INDEX DRAWER CONTROLLER
  // ==========================================

  const drawerEl = document.getElementById('index-drawer');
  const openDrawerBtn = document.getElementById('open-drawer-btn');
  const closeDrawerBtn = document.getElementById('drawer-close');

  function openDrawer() {
    if (drawerEl) drawerEl.classList.add('open');
  }
  function closeDrawer() {
    if (drawerEl) drawerEl.classList.remove('open');
  }

  if (openDrawerBtn) openDrawerBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerEl) {
    drawerEl.addEventListener('click', (e) => {
      if (e.target === drawerEl) closeDrawer();
    });
  }

  // ==========================================
  // 6. REAL-TIME SEARCH ENGINE MODAL
  // ==========================================

  const searchModalEl = document.getElementById('search-modal');
  const openSearchBtn = document.getElementById('open-search-btn');
  const searchCloseBtn = document.getElementById('search-close-btn');
  const searchInput = document.getElementById('search-query-input');
  const searchResultsList = document.getElementById('search-results-list');

  function openSearch() {
    if (searchModalEl) {
      searchModalEl.classList.add('open');
      if (searchInput) searchInput.focus();
    }
  }

  function closeSearch() {
    if (searchModalEl) {
      searchModalEl.classList.remove('open');
      if (searchInput) searchInput.value = '';
      renderSearchResults('');
    }
  }

  if (openSearchBtn) openSearchBtn.addEventListener('click', openSearch);
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);

  if (searchModalEl) {
    searchModalEl.addEventListener('click', (e) => {
      if (e.target === searchModalEl) closeSearch();
    });
  }

  // Trigger search with Ctrl+K / Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') {
      closeSearch();
      closeDrawer();
      closeZoomModal();
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value.trim());
    });
  }

  function renderSearchResults(query) {
    if (!searchResultsList) return;
    searchResultsList.innerHTML = '';

    if (!query) {
      searchResultsList.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: var(--text-dim); font-size: 0.875rem;">
          💡 自伝内のキーワードを入力してください（例: M&A, GMV, 裁量権, 上場維持, ポイントゲーム）
        </div>
      `;
      return;
    }

    const lowerQuery = query.toLowerCase();
    let matchesCount = 0;

    slidesData.forEach((slide, idx) => {
      const slideText = JSON.stringify(slide).toLowerCase();
      if (slideText.includes(lowerQuery)) {
        matchesCount++;
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; color: #d4af37; font-weight: 800;">${ROMAN_NUMERALS[idx]}</span>
            <span class="slide-badge badge-${slide.accent}">${slide.badge.split('：')[0]}</span>
          </div>
          <div style="font-size: 1rem; font-weight: 800; color: var(--text-main); margin-top: 0.1rem;">${slide.title}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">${slide.subtitle}</div>
        `;
        item.addEventListener('click', () => {
          goToSlide(idx);
          closeSearch();
        });
        searchResultsList.appendChild(item);
      }
    });

    if (matchesCount === 0) {
      searchResultsList.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: var(--text-dim); font-size: 0.875rem;">
          「${query}」に一致する自伝の記述が見つかりませんでした。別のキーワードでお試しください。
        </div>
      `;
    }
  }

  // ==========================================
  // 7. "I'M FEELING LUCKY" RANDOM JUMP
  // ==========================================

  const luckyBtn = document.getElementById('lucky-btn');
  if (luckyBtn) {
    luckyBtn.addEventListener('click', () => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * slidesData.length);
      } while (randomIndex === currentSlideIndex && slidesData.length > 1);

      goToSlide(randomIndex);
    });
  }

  // ==========================================
  // 8. GOOGLE BRAND "DO A BARREL ROLL" EASTER EGG
  // ==========================================

  const googleLogo = document.getElementById('google-brand-logo');
  if (googleLogo) {
    googleLogo.addEventListener('click', () => {
      document.body.classList.add('barrel-roll');
      setTimeout(() => {
        document.body.classList.remove('barrel-roll');
      }, 1200);
    });
  }

  // ==========================================
  // 9. PRESENTATION COUNTDOWN TIMER
  // ==========================================

  let timerSeconds = 60 * 60; // 60 minutes
  let timerInterval = null;
  let isTimerRunning = false;

  const timerDisplay = document.getElementById('timer-display');
  const timerToggle = document.getElementById('timer-toggle');
  const timerReset = document.getElementById('timer-reset');
  const playIcon = document.getElementById('timer-play-icon');
  const pauseIcon = document.getElementById('timer-pause-icon');

  function updateTimerDisplay() {
    if (!timerDisplay) return;
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (timerSeconds <= 300) { // Warning under 5 mins
      timerDisplay.classList.add('timer-warning');
    } else {
      timerDisplay.classList.remove('timer-warning');
    }
  }

  function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'inline';

    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        updateTimerDisplay();
      } else {
        stopTimer();
      }
    }, 1000);
  }

  function stopTimer() {
    isTimerRunning = false;
    if (timerInterval) clearInterval(timerInterval);
    if (playIcon) playIcon.style.display = 'inline';
    if (pauseIcon) pauseIcon.style.display = 'none';
  }

  if (timerToggle) {
    timerToggle.addEventListener('click', () => {
      if (isTimerRunning) stopTimer();
      else startTimer();
    });
  }

  if (timerReset) {
    timerReset.addEventListener('click', () => {
      stopTimer();
      timerSeconds = 60 * 60;
      updateTimerDisplay();
    });
  }

  // ==========================================
  // 10. GLASSMORPHIC ZOOM MODAL & DAUGHTER ZOOM
  // ==========================================

  const zoomModalEl = document.getElementById('zoom-modal');
  const zoomModalBody = document.getElementById('zoom-modal-body');
  const zoomCloseBtn = document.getElementById('zoom-close');

  window.zoomDaughter = function() {
    if (!zoomModalEl || !zoomModalBody) return;
    zoomModalBody.innerHTML = `
      <div style="text-align: center;">
        <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; color: #d4af37; font-weight: 800; letter-spacing: 0.12em;">MOST PRECIOUS MOTIVATION</span>
        <h3 style="font-size: 1.5rem; font-weight: 900; color: #fffbeb; margin: 0.35rem 0 1.25rem 0;">千葉 フローレンス夏歌 ちゃん 👧</h3>
        <div style="max-width: 480px; margin: 0 auto; border-radius: 18px; overflow: hidden; border: 3px solid #d4af37; box-shadow: 0 15px 35px rgba(212, 175, 55, 0.4);">
          <img src="PXL_20260705_051631581.jpg" alt="千葉フローレンス夏歌ちゃん" style="width: 100%; height: auto; display: block;">
        </div>
        <p style="font-size: 1.05rem; color: #e2e8f0; margin-top: 1.25rem; font-weight: 600; line-height: 1.6;">
          「愛娘・夏歌ちゃんに誇れる、圧倒的に明るい未来をこの手で創る。」<br>
          これこそが、著者がどんな泥惨な逆境も不屈の意志で突破し続ける最大の原動力です。
        </p>
      </div>
    `;
    zoomModalEl.classList.add('open');
  };

  window.openQAModal = function(index) {
    if (!zoomModalEl || !zoomModalBody) return;
    const qData = [
      {
        title: "❓ 著者・取締役を焦らせる「NGなし」の直球質問例",
        questions: [
          "・売上99%減の事業再生時、組織再編や人員最適化の現場でどうメンバーと向き合った？",
          "・取締役として、今のぶっちゃけた役員報酬や評価制度はどう決まっている？",
          "・買収したWebメディアがGoogle大被弾した時、具体的にSEOのどこを何時間分析した？",
          "・新卒から13年間、一度も転職を考えなかった本当の理由は？"
        ]
      },
      {
        title: "🤝 本気のキャリア対話・パートナーシップ",
        questions: [
          "・「自ら仕事を作り出せるプロフェッショナル」を目指す熱量ある挑戦者を歓迎します。",
          "・綺麗事抜きの経営現場の裏側、戦略の意思決定ロジックを100%オープンに対話します。",
          "・地方起業家エコシステムの構築に参画したいパートナーを募集しています。"
        ]
      }
    ];

    const currentQ = qData[index] || qData[0];
    zoomModalBody.innerHTML = `
      <div>
        <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; color: #d4af37; font-weight: 800; letter-spacing: 0.12em;">DIRECT EXECUTIVE Q&A SESSION</span>
        <h3 style="font-size: 1.45rem; font-weight: 900; color: #fffbeb; margin: 0.35rem 0 1.25rem 0;">${currentQ.title}</h3>
        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
          ${currentQ.questions.map(q => `
            <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(212, 175, 55, 0.3); padding: 1rem 1.25rem; border-radius: 12px; font-size: 1rem; color: #fef08a; font-weight: 700; line-height: 1.5;">
              ${q}
            </div>
          `).join('')}
        </div>
        <p style="font-size: 0.9rem; color: var(--text-dim); margin-top: 1.35rem; text-align: center;">
          ※ Q&A対話セッション中は、挙手またはマイクにて直球でご質問ください。
        </p>
      </div>
    `;
    zoomModalEl.classList.add('open');
  };

  function closeZoomModal() {
    if (zoomModalEl) zoomModalEl.classList.remove('open');
  }

  if (zoomCloseBtn) zoomCloseBtn.addEventListener('click', closeZoomModal);
  if (zoomModalEl) {
    zoomModalEl.addEventListener('click', (e) => {
      if (e.target === zoomModalEl) closeZoomModal();
    });
  }

  // ==========================================
  // 11. INITIALIZATION
  // ==========================================
  renderSlides();
  updateTimerDisplay();
});
