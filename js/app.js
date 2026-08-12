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
    "CHAPTER I", "CHAPTER II", "CHAPTER III", "CHAPTER IV", "CHAPTER V",
    "CHAPTER VI", "CHAPTER VII", "CHAPTER VIII", "CHAPTER IX", "CHAPTER X"
  ];

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
    // HERO / INTRO TEMPLATE (BOOK COVER / PROLOGUE)
    hero: (slide) => {
      const p = slide.presenter;
      const m = slide.metric;
      const t = slide.theme;
      const imp = slide.impact;
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
                <h3 style="font-size: 1.65rem; font-weight: 900; margin-top: 0.25rem; color: var(--text-main);">${p.name}</h3>
                <p style="font-size: 0.925rem; color: var(--text-muted); margin-top: 0.1rem; font-weight: 600;">${p.role}</p>
              </div>
              ${p.daughterImg ? `
                <div class="avatar-thumb" onclick="event.stopPropagation(); zoomDaughter();" title="クリックで愛娘の写真拡大！">
                  <img src="${p.daughterImg}" alt="${p.daughterName}">
                </div>
              ` : ''}
            </div>
            <p style="font-size: 0.975rem; color: var(--text-muted); margin-top: 0.85rem; line-height: 1.55; font-weight: 500;">
              ${p.daughterNote ? p.daughterNote : p.note}
            </p>
            <p style="font-size: 0.85rem; color: var(--text-dim); margin-top: 0.85rem; border-top: 1px solid var(--border-card); padding-top: 0.65rem; font-weight: 700;">
              ${p.university}
            </p>
          </div>

          <!-- Bottom Row Card 1: Continuity Metric -->
          <div class="glass-card ${getCardAccentClass(slide.accent)}">
            <div>
              <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; font-weight: 800; color: #38bdf8; tracking-wider; text-transform: uppercase;">${m.badge}</span>
              <div style="font-size: 3.5rem; font-weight: 900; background: linear-gradient(135deg, #fef08a 0%, #d4af37 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-top: 0.35rem; line-height: 1; letter-spacing: -0.03em;">${m.value}</div>
              <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-top: 0.6rem;">${m.label}</h4>
            </div>
            <p style="font-size: 0.925rem; color: var(--text-muted); margin-top: 0.85rem; border-top: 1px solid var(--border-card); padding-top: 0.65rem;">
              ${m.note}
            </p>
          </div>

          <!-- Bottom Row Card 2: Today's Theme -->
          <div class="glass-card ${getCardAccentClass(slide.accent)}">
            <div>
              <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; font-weight: 800; color: #38bdf8; tracking-wider; text-transform: uppercase;">${t.badge}</span>
              <h4 style="font-size: 1.35rem; font-weight: 900; color: var(--text-main); margin-top: 0.6rem; line-height: 1.35;">${t.title}</h4>
            </div>
            <p style="font-size: 0.925rem; color: var(--text-muted); margin-top: 0.85rem; border-top: 1px solid var(--border-card); padding-top: 0.65rem;">
              ${t.note}
            </p>
          </div>

          <!-- Bottom Row Card 3: Career Track Record -->
          <div class="glass-card ${getCardAccentClass(slide.accent)}">
            <div>
              <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; font-weight: 800; color: #38bdf8; tracking-wider; text-transform: uppercase;">${imp.badge}</span>
              <h4 style="font-size: 1.35rem; font-weight: 900; color: var(--text-main); margin-top: 0.6rem; line-height: 1.35;">${imp.title}</h4>
            </div>
            <p style="font-size: 0.925rem; color: var(--text-muted); margin-top: 0.85rem; border-top: 1px solid var(--border-card); padding-top: 0.65rem;">
              ${imp.note}
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
      const storyHeader = slide.stories ? `
        <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.75rem; flex-wrap: wrap; background: rgba(15, 23, 42, 0.6); padding: 0.5rem 0.85rem; border-radius: 12px; border: 1px solid rgba(212, 175, 55, 0.25);">
          <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; font-weight: 800; color: #d4af37; letter-spacing: 0.08em; text-transform: uppercase;">スライド内共存ストーリー:</span>
          ${slide.stories.map(st => `
            <span class="story-pill story-pill-${st.tagColor || 'blue'}">
              <strong>${st.tag}</strong>: ${st.title}
            </span>
          `).join('')}
        </div>
      ` : '';

      return `
        <div class="wstar-container anim-el delay-2">
          ${storyHeader}
          <!-- STAR 2x2 Columns -->
          <div class="star-2x2">
            <!-- Situation -->
            <div class="glass-card">
              <div>
                <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; font-weight: 800; color: #d4af37; tracking-wider; text-transform: uppercase;">S : Situation</span>
                <p style="font-size: 0.975rem; color: var(--text-muted); margin-top: 0.65rem; line-height: 1.6;">${s.s}</p>
              </div>
            </div>
            <!-- Task -->
            <div class="glass-card">
              <div>
                <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; font-weight: 800; color: #d4af37; tracking-wider; text-transform: uppercase;">T : Task</span>
                <p style="font-size: 0.975rem; color: var(--text-muted); margin-top: 0.65rem; line-height: 1.6;">${s.t}</p>
              </div>
            </div>
            <!-- Action -->
            <div class="glass-card">
              <div>
                <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; font-weight: 800; color: #d4af37; tracking-wider; text-transform: uppercase;">A : Action</span>
                <p style="font-size: 0.975rem; color: var(--text-muted); margin-top: 0.65rem; line-height: 1.6;">${s.a}</p>
              </div>
            </div>
            <!-- Result -->
            <div class="glass-card ${getCardAccentClass(slide.accent)}">
              <div>
                <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; font-weight: 800; color: #d4af37; tracking-wider; text-transform: uppercase;">R : Result</span>
                <p style="font-size: 1rem; color: var(--text-main); margin-top: 0.65rem; line-height: 1.6; font-weight: 700;">${s.r}</p>
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
                ${w.lead ? `<p style="font-size: 1.15rem; font-weight: 900; color: var(--text-main); margin-top: 0.4rem; line-height: 1.4;">${w.lead}</p>` : ''}
                <p style="font-size: 1.025rem; color: var(--text-muted); margin-top: 0.5rem; line-height: 1.65;">${w.body}</p>
              </div>
              ${w.footer ? `<div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-card); font-size: 0.85rem; font-weight: 800; color: #fef08a;">${w.footer}</div>` : ''}
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
          <div class="glass-card glass-card-accent-amber" style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.98), rgba(15, 23, 42, 1)); border-color: rgba(212, 175, 55, 0.6);">
            <div style="display: flex; flex-direction: column; height: 100%;">
              <div>
                <span class="slide-badge badge-amber">${f.label}</span>
                <blockquote style="font-size: 1.35rem; font-weight: 900; color: #fef08a; font-style: normal; margin: 1.25rem 0 0.85rem 0; line-height: 1.4; border-left: 3px solid #d4af37; padding-left: 1rem;">
                  ${f.quote}
                </blockquote>
                ${f.lead ? `<p style="font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">${f.lead}</p>` : ''}
                <p style="font-size: 1.025rem; color: var(--text-muted); line-height: 1.7;">${f.body}</p>
              </div>
              ${f.footer ? `<div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-card); font-size: 0.875rem; font-weight: 800; color: #fef08a;">${f.footer}</div>` : ''}
            </div>
          </div>
        </div>
      `;
    },

    // CLOSING Q&A TEMPLATE
    closing: (slide) => {
      const cardsHtml = slide.cards.map((c, i) => `
        <div class="glass-card ${i === 0 ? 'glass-card-accent-amber' : 'glass-card-accent-blue'}" onclick="openQAModal(${i})" title="クリックで質問例・詳細モーダル表示">
          <div style="display: flex; flex-direction: column; height: 100%;">
            <div>
              <div style="font-size: 2.25rem; margin-bottom: 0.75rem;">${c.icon}</div>
              <h3 style="font-size: 1.35rem; font-weight: 900; color: var(--text-main); margin-bottom: 0.65rem; line-height: 1.35;">${c.title}</h3>
              ${c.lead ? `<p style="font-size: 1.075rem; font-weight: 800; color: #fef08a; margin-bottom: 0.45rem;">${c.lead}</p>` : ''}
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
        // SLIDE 1: HARDCOVER BOOK FRONT COVER (自伝・単行本 表紙・扉)
        slideEl.innerHTML = `
          <div class="light-sweep light-sweep-active"></div>
          <div class="book-cover-container anim-el delay-1">
            <div style="font-family: 'Cinzel', serif; font-size: 0.8rem; font-weight: 800; color: #d4af37; letter-spacing: 0.22em; text-transform: uppercase;">
              ⚜️ EXECUTIVE MEMOIR AUTOBIOGRAPHY ⚜️
            </div>
            
            <div style="margin: 1.25rem 0;">
              <span style="font-family: 'Shippori Mincho', serif; font-size: 0.9rem; font-weight: 700; color: #fef08a; letter-spacing: 0.15em; display: block; margin-bottom: 0.5rem;">― 東証上場企業 取締役の当事者記録 ―</span>
              <h1 style="font-family: 'Shippori Mincho', 'Noto Serif JP', serif; font-size: clamp(2rem, 3.8vw, 3.1rem); font-weight: 900; background: linear-gradient(135deg, #fffbeb 0%, #fef08a 40%, #d4af37 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.3;">
                自伝 『不確実性を生き抜く生存戦略』
              </h1>
              <p style="font-family: 'Shippori Mincho', serif; font-size: clamp(1rem, 1.5vw, 1.2rem); color: #e2e8f0; margin-top: 0.85rem; font-weight: 600; line-height: 1.6;">
                筑波大学新卒から一度も転職せずに東証上場企業の取締役へ。<br>激動の13年間、会社の天国と地獄をくぐり抜けた生存記録
              </p>
            </div>

            <div style="width: 100%; max-width: 780px;">
              ${bodyContent}
            </div>

            <div style="font-family: 'Shippori Mincho', serif; font-size: 1.1rem; font-weight: 800; color: #fef08a; border-top: 1px solid rgba(212,175,55,0.4); padding-top: 0.85rem; width: 100%; display: flex; justify-content: space-between; align-items: center;">
              <span>著：千葉 博文 <small style="font-size: 0.85rem; color: #94a3b8; font-weight: 600;">(株式会社デジタルプラス 取締役)</small></span>
              <span style="font-family: 'Cinzel', serif; font-size: 0.8rem; color: #d4af37; font-weight: 800;">FIRST EDITION 2026</span>
            </div>
          </div>
        `;
      } else {
        // SLIDES 2-10: PHYSICAL OPENED BOOK SPREAD (実物の開いた自伝見開き本)
        const pageLeftNum = index * 2 + 1;
        const pageRightNum = index * 2 + 2;

        slideEl.innerHTML = `
          <div class="light-sweep light-sweep-active"></div>
          ${index === slidesData.length - 1 ? '<div class="super-glow super-glow-active"></div>' : ''}
          
          <div class="real-book-spread anim-el delay-1">
            <!-- Silk Bookmark Ribbon -->
            <div class="book-silk-bookmark"></div>

            <div class="book-spread-inner">
              <!-- LEFT PAGE: Running Header, Chapter Title, Epigraph & Background -->
              <div class="book-page book-page-left">
                <div class="book-page-header">
                  <span class="book-chapter-number">${ROMAN_NUMERALS[index]}</span>
                  <span style="font-weight: 800; font-size: 0.8rem; color: #b45309;">${slide.badge}</span>
                </div>

                <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start;">
                  <h2 class="book-chapter-title">${slide.title}</h2>
                  <p class="book-chapter-subtitle">${slide.subtitle}</p>
                  
                  <div style="text-align: center; color: #b45309; margin: 0.4rem 0; font-size: 0.85rem;">── ❖ ──</div>
                  
                  <div class="book-epigraph">
                    “ ${slide.subtitle.replace(/<[^>]*>?/gm, '')} ”
                  </div>

                  <p style="font-size: 0.9rem; color: #475569; line-height: 1.65; margin-top: 0.5rem; font-weight: 600; background: rgba(255,255,255,0.6); padding: 0.65rem 0.85rem; border-radius: 6px; border: 1px solid rgba(212,175,55,0.3);">
                    📖 <strong>【手記・当事者の視点】</strong><br>
                    筑波大学卒業後、第一志望で入社したベンチャー企業で天国と地獄の双方を経験。不確実性の極限下で修羅場を突破した思考と行動の記録。
                  </p>
                </div>

                <div class="book-page-footer">
                  — Page ${pageLeftNum} —
                </div>
              </div>

              <!-- CENTER SPINE CREASE SHADOW -->
              <div class="book-center-spine"></div>

              <!-- RIGHT PAGE: Chapter Content / STAR Breakdown / Philosophy Cards -->
              <div class="book-page book-page-right">
                <div class="book-page-header">
                  <span>自伝 『不確実性を生き抜く生存戦略』</span>
                  <span>著者 千葉 博文</span>
                </div>

                <div style="flex: 1; overflow-y: auto; padding-right: 0.25rem;">
                  ${bodyContent}
                </div>

                <div class="book-page-footer">
                  — Page ${pageRightNum} —
                </div>
              </div>
            </div>
          </div>
        `;
      }

      container.appendChild(slideEl);

      // Populate Index Drawer Item
      const indexItem = document.createElement('div');
      indexItem.className = `index-item ${index === 0 ? 'active' : ''}`;
      indexItem.innerHTML = `
        <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; color: #d4af37; font-weight: 800; min-width: 75px;">${ROMAN_NUMERALS[index]}</span>
        <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${slide.badge}</span>
      `;
      indexItem.addEventListener('click', () => {
        goToSlide(index);
        closeDrawer();
      });
      slideIndexList.appendChild(indexItem);
    });

    updateNavigationState();
  }

  // ==========================================
  // 3. NAVIGATION CONTROLLER
  // ==========================================

  function goToSlide(targetIndex) {
    if (targetIndex < 0 || targetIndex >= slidesData.length) return;
    if (targetIndex === currentSlideIndex) return;

    const currentSlide = document.getElementById(slidesData[currentSlideIndex].id);
    const targetSlide = document.getElementById(slidesData[targetIndex].id);

    currentSlide.classList.remove('active');
    
    // Reset light sweep & super glow animation on active slide
    const sweep = targetSlide.querySelector('.light-sweep');
    if (sweep) {
      sweep.classList.remove('light-sweep-active');
      void sweep.offsetWidth; // Trigger reflow
      sweep.classList.add('light-sweep-active');
    }
    const superGlow = targetSlide.querySelector('.super-glow');
    if (superGlow) {
      superGlow.classList.remove('super-glow-active');
      void superGlow.offsetWidth; // Trigger reflow
      superGlow.classList.add('super-glow-active');
    }

    targetSlide.classList.add('active');

    // Reset scroll position to top
    const scrollContainer = targetSlide.querySelector('.slide-content-scroll');
    if (scrollContainer) scrollContainer.scrollTop = 0;

    currentSlideIndex = targetIndex;
    updateNavigationState();
    animateTimelineAvatar(targetIndex);
  }

  function updateNavigationState() {
    prevBtn.disabled = currentSlideIndex === 0;
    nextBtn.disabled = currentSlideIndex === slidesData.length - 1;

    // Update Progress Fill
    const progressPercent = ((currentSlideIndex + 1) / slidesData.length) * 100;
    progressFill.style.width = `${progressPercent}%`;

    // Update Chapter Counter
    currentNumDisplay.textContent = ROMAN_NUMERALS[currentSlideIndex];

    // Update Index Drawer active state
    const items = slideIndexList.querySelectorAll('.index-item');
    items.forEach((item, idx) => {
      if (idx === currentSlideIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Animate character along bottom timeline
  function animateTimelineAvatar(index) {
    const avatar = document.getElementById('timeline-avatar');
    const avatarLabel = document.getElementById('avatar-label');
    const avatarGraphic = document.getElementById('avatar-graphic');

    if (!avatar) return;

    // Calculate left position percentage (10% to 90%)
    const leftPercent = 10 + (index / (slidesData.length - 1)) * 80;
    avatar.style.left = `${leftPercent}%`;

    // Avatar walking bounce animation
    if (avatarGraphic) {
      avatarGraphic.classList.remove('avatar-floating');
      avatarGraphic.classList.add('avatar-walking');
      setTimeout(() => {
        avatarGraphic.classList.remove('avatar-walking');
        avatarGraphic.classList.add('avatar-floating');
      }, 450);
    }

    // Stage Labels
    const STAGE_LABELS = [
      "2013 覚悟の第一歩",
      "2011 原点・被災地",
      "2013 利益4億創出",
      "2018 売上99%減の地獄",
      "2020 V字回復M&A",
      "2023 GMV300億規模",
      "哲学Ⅰ 自己変革",
      "哲学Ⅱ 裁量権の本音",
      "志 地方起業家",
      "結び 未来の対話"
    ];

    if (avatarLabel && STAGE_LABELS[index]) {
      avatarLabel.textContent = STAGE_LABELS[index];
    }
  }

  // Event Listeners for Nav Buttons
  prevBtn.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlideIndex + 1));

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    // Disable slide nav if search modal or drawer is active or typing in input
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
    if (drawerEl && drawerEl.classList.contains('open')) return;
    if (searchModalEl && searchModalEl.classList.contains('open')) return;
    if (zoomModalEl && zoomModalEl.classList.contains('open')) return;

    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      goToSlide(currentSlideIndex + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      goToSlide(currentSlideIndex - 1);
    }
  });

  // ==========================================
  // 4. INDEX DRAWER CONTROLLER
  // ==========================================

  const drawerEl = document.getElementById('index-drawer');
  const openDrawerBtn = document.getElementById('open-drawer-btn');
  const drawerCloseBtn = document.getElementById('drawer-close');

  function openDrawer() {
    if (drawerEl) drawerEl.classList.add('open');
  }

  function closeDrawer() {
    if (drawerEl) drawerEl.classList.remove('open');
  }

  if (openDrawerBtn) openDrawerBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);

  if (drawerEl) {
    drawerEl.addEventListener('click', (e) => {
      if (e.target === drawerEl) closeDrawer();
    });
  }

  // ==========================================
  // 5. MEMOIR SEARCH SYSTEM (CTRL+K)
  // ==========================================

  const searchModalEl = document.getElementById('search-modal');
  const openSearchBtn = document.getElementById('open-search-btn');
  const searchCloseBtn = document.getElementById('search-close-btn');
  const searchInput = document.getElementById('search-query-input');
  const searchResultsList = document.getElementById('search-results-list');

  function openSearch() {
    if (searchModalEl) {
      searchModalEl.classList.add('open');
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      renderSearchResults('');
    }
  }

  function closeSearch() {
    if (searchModalEl) searchModalEl.classList.remove('open');
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
  // 6. "I'M FEELING LUCKY" RANDOM JUMP
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
  // 7. GOOGLE BRAND "DO A BARREL ROLL" EASTER EGG
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
  // 8. PRESENTATION COUNTDOWN TIMER
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
  // 9. GLASSMORPHIC ZOOM MODAL & DAUGHTER ZOOM
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
          "・売上99%減の事業再生時、退職勧奨やリストラの現場でどうメンバーと向き合った？",
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
  // INITIALIZATION
  // ==========================================
  renderSlides();
  updateTimerDisplay();
});
