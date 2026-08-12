/**
 * DIGITAL PLUS EXECUTIVE BRIEFING ENGINE (APP.JS)
 * Imperial Gold Hardcover Memoir Edition (Autobiography Theme)
 * Renderer & Navigation Engine for Hirofumi Chiba's Interactive Presentation
 */

(function () {
  'use strict';

  // State Management
  let currentSlideIndex = 0;
  const totalSlides = PRESENTATION_DATA.slides.length;
  let timerSeconds = 60 * 60; // 60 minutes countdown
  let timerInterval = null;
  let isTimerRunning = false;

  // DOM Elements
  const slidesContainer = document.getElementById('slides-container');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const currentSlideNum = document.getElementById('current-slide-num');
  const progressFill = document.getElementById('progress-fill');
  const indexDrawer = document.getElementById('index-drawer');
  const slideIndexList = document.getElementById('slide-index-list');
  const zoomModal = document.getElementById('zoom-modal');
  const zoomModalBody = document.getElementById('zoom-modal-body');
  const searchModal = document.getElementById('search-modal');
  const searchQueryInput = document.getElementById('search-query-input');
  const searchResultsList = document.getElementById('search-results-list');
  const timelineAvatar = document.getElementById('timeline-avatar');
  const avatarLabel = document.getElementById('avatar-label');
  const avatarGraphic = document.getElementById('avatar-graphic');

  // Timeline Avatar Stages Data (Biography Character Evolution)
  const AVATAR_STAGES = [
    { label: "表表紙", icon: "👨‍💼" },
    { label: "序章", icon: "👨‍💼" },
    { label: "原点 2011", icon: "🌱" },
    { label: "栄光 4億円", icon: "🚀" },
    { label: "試練 50年創出", icon: "🔥" },
    { label: "再生 M&A", icon: "💎" },
    { label: "飛躍 300億", icon: "👑" },
    { label: "哲学Ⅰ 学び", icon: "📖" },
    { label: "哲学Ⅱ 裁量", icon: "⚔️" },
    { label: "志 地方創生", icon: "🌟" },
    { label: "結び 対話", icon: "🤝" }
  ];

  // Helper: Escape HTML
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Generate Book Title Header for Slides 2-10
  function generatePictureBookHeader(slide) {
    const badgeText = slide.badge ? slide.badge.replace(/【STAR構造化】/g, '') : '';
    return `
      <div class="picture-book-header">
        <span class="picture-book-badge">${badgeText}</span>
        <h2 class="picture-book-title">${slide.title}</h2>
        <p class="picture-book-subtitle">${slide.subtitle}</p>
      </div>
    `;
  }

  // Slide Renderers by Type
  const renderers = {
    // COVER SLIDE (HARDCOVER MEMOIR FRONT COVER)
    cover: function (slide) {
      return `
        <div class="hardcover-wrapper">
          <div class="hardcover-book">
            <div class="hardcover-spine"></div>
            <div class="hardcover-front">
              <div class="hardcover-gold-border">
                <div class="cover-crown-emblem">⚜️</div>
                <span class="cover-edition-tag">SPECIAL EXECUTIVE AUTOBIOGRAPHY</span>
                <h1 class="cover-main-title">不確実性を生き抜く<br>生存戦略</h1>
                <p class="cover-main-subtitle">筑波大学新卒入社から一度も転職せずに東証上場企業の取締役へ。<br>激動の13年間、会社の天国と地獄をくぐり抜けた当事者の全記録</p>
                
                <div class="cover-divider-ornament">
                  <span>✦</span><span class="line"></span><span>⚜️</span><span class="line"></span><span>✦</span>
                </div>

                <div class="cover-author-box">
                  <div class="cover-author-role">株式会社デジタルプラス 取締役</div>
                  <div class="cover-author-name">千葉 博文 <span style="font-size: 1rem; font-weight: 600; color: #d4af37;">著</span></div>
                  <div class="cover-author-uni">筑波大学理工学群 社会工学類 卒</div>
                </div>

                <div class="cover-start-prompt" onclick="window.nextSlide()">
                  <span>自伝を開く (PAGE FLIP)</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    // HERO SLIDE (CHAPTER I: PROLOGUE)
    hero: function (slide) {
      const p = slide.presenter;
      return `
        <div class="picture-book-page">
          <div class="picture-book-ribbon"></div>
          ${generatePictureBookHeader(slide)}

          <div class="hero-grid">
            <!-- Author Profile Card (Top Full-Width Bento) -->
            <div class="glass-card full-width profile-card bento-hover">
              <div class="profile-header">
                <div class="avatar-ring">
                  <span class="profile-emoji">👨‍💼</span>
                </div>
                <div class="profile-meta">
                  <h3>${escapeHTML(p.name)} <span class="role-tag">${escapeHTML(p.role)}</span></h3>
                  <p class="uni-tag">🎓 ${escapeHTML(p.university)}</p>
                  <p class="bio-note">${escapeHTML(p.note)}</p>
                </div>
              </div>

              <!-- Daughter Card Embed -->
              <div class="daughter-mini-card">
                <div class="daughter-photo-wrap">
                  <img src="${p.daughterImg}" alt="${escapeHTML(p.daughterName)}" class="daughter-photo" loading="lazy">
                </div>
                <div class="daughter-info">
                  <span class="daughter-badge">MY DAUGHTER &amp; INSPIRATION</span>
                  <p class="daughter-name">${escapeHTML(p.daughterName)} ちゃん</p>
                  <p class="daughter-quote">${escapeHTML(p.daughterNote)}</p>
                </div>
              </div>
            </div>

            <!-- Card 2: 910+ Days English & Unlearn -->
            <div class="glass-card bento-hover">
              <span class="card-badge purple">${slide.metric.badge}</span>
              <div class="stat-number">${slide.metric.value}</div>
              <h4 class="card-title">${slide.metric.label}</h4>
              <p class="card-desc">${slide.metric.note}</p>
            </div>

            <!-- Card 3: Presentation Theme -->
            <div class="glass-card bento-hover">
              <span class="card-badge amber">${slide.theme.badge}</span>
              <h4 class="card-title" style="margin-top: 0.5rem; font-size: 1.15rem;">${slide.theme.title}</h4>
              <p class="card-desc" style="margin-top: 0.5rem;">${slide.theme.note}</p>
            </div>

            <!-- Card 4: Executive Track Record -->
            <div class="glass-card bento-hover">
              <span class="card-badge emerald">${slide.impact.badge}</span>
              <h4 class="card-title" style="margin-top: 0.5rem; font-size: 1.15rem;">${slide.impact.title}</h4>
              <p class="card-desc" style="margin-top: 0.5rem;">${slide.impact.note}</p>
            </div>
          </div>
        </div>
      `;
    },

    // W-STAR SLIDE (CHAPTERS III, IV, V, VI: 2x2 STAR Grid + Handwritten Note Card)
    'w-star': function (slide) {
      const star = slide.star;
      const why = slide.why;
      return `
        <div class="picture-book-page">
          <div class="picture-book-ribbon"></div>
          ${generatePictureBookHeader(slide)}

          <div class="wstar-container">
            <!-- 2x2 STAR Matrix -->
            <div class="star-2x2">
              <div class="star-card star-s clickable-card" onclick="window.zoomStarCard('S', '${escapeHTML(star.s)}')">
                <div class="star-letter">S</div>
                <div class="star-label">SITUATION (置かれた状況)</div>
                <p class="star-text">${star.s}</p>
              </div>

              <div class="star-card star-t clickable-card" onclick="window.zoomStarCard('T', '${escapeHTML(star.t)}')">
                <div class="star-letter">T</div>
                <div class="star-label">TASK (直面した壁・命題)</div>
                <p class="star-text">${star.t}</p>
              </div>

              <div class="star-card star-a clickable-card" onclick="window.zoomStarCard('A', '${escapeHTML(star.a)}')">
                <div class="star-letter">A</div>
                <div class="star-label">ACTION (実行した突破策)</div>
                <p class="star-text">${star.a}</p>
              </div>

              <div class="star-card star-r clickable-card" onclick="window.zoomStarCard('R', '${escapeHTML(star.r)}')">
                <div class="star-letter">R</div>
                <div class="star-label">RESULT (生み出した結果)</div>
                <p class="star-text">${star.r}</p>
              </div>
            </div>

            <!-- Handwritten Memoir Note Card -->
            <div class="glass-card why-card bento-hover">
              <div class="why-badge">
                <span class="crest-mini">✍️</span>
                <span>著者・千葉博文の自己省察手記</span>
              </div>
              <h3 class="why-title">${why.title}</h3>
              <p class="why-lead">${why.lead}</p>
              <div class="why-divider"></div>
              <p class="why-body">${why.body}</p>
              <div class="why-footer">${why.footer}</div>
            </div>
          </div>
        </div>
      `;
    },

    // SPLIT SLIDE (CHAPTER II & IX: 2 Large Cards)
    split: function (slide) {
      const cardsHTML = slide.cards.map(c => `
        <div class="glass-card bento-hover" style="flex: 1; display: flex; flex-direction: column;">
          <span class="card-badge ${c.badgeColor || 'amber'}">${c.badge}</span>
          <h3 class="card-title" style="font-size: 1.25rem; margin: 0.75rem 0 0.5rem 0; color: var(--text-main); font-weight: 800;">${c.title}</h3>
          <p class="card-lead" style="font-weight: 700; color: #d4af37; margin-bottom: 0.75rem; font-size: 0.95rem;">${c.lead}</p>
          <p class="card-desc" style="flex: 1; line-height: 1.65; color: var(--text-muted); font-size: 0.9rem;">${c.body}</p>
          <div class="why-footer" style="margin-top: 1rem; font-size: 0.8rem;">${c.footer}</div>
        </div>
      `).join('');

      return `
        <div class="picture-book-page">
          <div class="picture-book-ribbon"></div>
          ${generatePictureBookHeader(slide)}

          <div style="display: flex; gap: 1.5rem; height: calc(100% - 110px); width: 100%;">
            ${cardsHTML}
          </div>
        </div>
      `;
    },

    // TRUTH SLIDE (CHAPTERS VII & VIII: MYTH vs FACT Comparison)
    truth: function (slide) {
      return `
        <div class="picture-book-page">
          <div class="picture-book-ribbon"></div>
          ${generatePictureBookHeader(slide)}

          <div class="truth-grid" style="display: flex; gap: 1.5rem; height: calc(100% - 110px); width: 100%;">
            <!-- MYTH Card -->
            <div class="glass-card myth-card bento-hover" style="flex: 1; border-color: rgba(225, 29, 72, 0.35); background: linear-gradient(135deg, rgba(225, 29, 72, 0.05) 0%, rgba(15, 23, 42, 0.6) 100%);">
              <span class="card-badge rose">${slide.myth.label}</span>
              <blockquote class="myth-quote" style="font-family: 'Shippori Mincho', serif; font-size: 1.15rem; font-weight: 700; color: #f87171; margin: 1rem 0; line-height: 1.6;">${slide.myth.quote}</blockquote>
              <p class="card-desc" style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">${slide.myth.note}</p>
              <div class="why-footer" style="margin-top: auto; color: #f87171;">${slide.myth.footer}</div>
            </div>

            <!-- FACT Card -->
            <div class="glass-card fact-card bento-hover" style="flex: 1.2; border-color: rgba(212, 175, 55, 0.45); background: linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%);">
              <span class="card-badge amber">${slide.fact.label}</span>
              <blockquote class="fact-quote" style="font-family: 'Shippori Mincho', serif; font-size: 1.2rem; font-weight: 800; color: #fef08a; margin: 1rem 0; line-height: 1.6;">${slide.fact.quote}</blockquote>
              <p class="fact-lead" style="font-weight: 700; color: #d4af37; margin-bottom: 0.5rem; font-size: 1rem;">${slide.fact.lead}</p>
              <p class="card-desc" style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.65;">${slide.fact.body}</p>
              <div class="why-footer" style="margin-top: auto; color: #d4af37;">${slide.fact.footer}</div>
            </div>
          </div>
        </div>
      `;
    },

    // CLOSING SLIDE (CHAPTER X: DIALOGUE & Q&A)
    closing: function (slide) {
      const cardsHTML = slide.cards.map(c => `
        <div class="glass-card bento-hover" style="flex: 1; display: flex; flex-direction: column;">
          <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">${c.icon}</div>
          <h3 class="card-title" style="font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--text-main); font-weight: 800;">${c.title}</h3>
          <p class="card-lead" style="font-weight: 700; color: #d4af37; margin-bottom: 0.75rem; font-size: 0.95rem;">${c.lead}</p>
          <p class="card-desc" style="flex: 1; line-height: 1.65; color: var(--text-muted); font-size: 0.9rem;">${c.body}</p>
          <div class="why-footer" style="margin-top: 1rem; font-size: 0.8rem;">${c.footer}</div>
        </div>
      `).join('');

      return `
        <div class="picture-book-page">
          <div class="picture-book-ribbon"></div>
          ${generatePictureBookHeader(slide)}

          <div style="display: flex; gap: 1.5rem; height: calc(100% - 110px); width: 100%;">
            ${cardsHTML}
          </div>
        </div>
      `;
    }
  };

  // Render All Slides to DOM
  function renderSlides() {
    slidesContainer.innerHTML = '';
    PRESENTATION_DATA.slides.forEach((slide, index) => {
      const slideEl = document.createElement('div');
      slideEl.className = `slide-item ${index === 0 ? 'active' : ''}`;
      slideEl.id = slide.id;

      const renderer = renderers[slide.type] || renderers['hero'];
      slideEl.innerHTML = renderer(slide);
      slidesContainer.appendChild(slideEl);
    });

    renderIndexList();
    updateNavigationState();
  }

  // Render Table of Contents Drawer
  function renderIndexList() {
    slideIndexList.innerHTML = '';
    PRESENTATION_DATA.slides.forEach((slide, index) => {
      const indexItem = document.createElement('div');
      indexItem.className = `index-item ${index === currentSlideIndex ? 'active' : ''}`;
      indexItem.onclick = () => {
        goToSlide(index);
        closeIndexDrawer();
      };

      const titleClean = slide.title ? slide.title.replace(/【STAR構造化】/g, '') : '';
      const badgeClean = slide.badge ? slide.badge.replace(/【STAR構造化】/g, '') : '';

      indexItem.innerHTML = `
        <div class="index-item-num">${index === 0 ? 'COVER' : `CH.${index}`}</div>
        <div class="index-item-text">
          <div class="index-item-badge">${badgeClean || '章'}</div>
          <div class="index-item-title">${titleClean}</div>
        </div>
      `;
      slideIndexList.appendChild(indexItem);
    });
  }

  // Update Navigation UI & Progress
  function updateNavigationState() {
    const slideItems = document.querySelectorAll('.slide-item');
    slideItems.forEach((el, idx) => {
      if (idx === currentSlideIndex) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    prevBtn.disabled = currentSlideIndex === 0;
    nextBtn.disabled = currentSlideIndex === totalSlides - 1;

    currentSlideNum.textContent = currentSlideIndex === 0 ? 'COVER' : `${currentSlideIndex} / ${totalSlides - 1}`;
    
    // Progress Fill %
    const progressPercent = Math.round((currentSlideIndex / (totalSlides - 1)) * 100);
    progressFill.style.width = `${progressPercent}%`;

    // Move Timeline Avatar Character
    if (timelineAvatar) {
      timelineAvatar.style.left = `${progressPercent}%`;
      const stage = AVATAR_STAGES[currentSlideIndex] || AVATAR_STAGES[0];
      if (avatarLabel) avatarLabel.textContent = stage.label;
      if (avatarGraphic) avatarGraphic.textContent = stage.icon;
    }

    // Update Drawer Active State
    const indexItems = slideIndexList.querySelectorAll('.index-item');
    indexItems.forEach((item, idx) => {
      if (idx === currentSlideIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Slide Navigation Functions
  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    currentSlideIndex = index;
    updateNavigationState();
  }

  function nextSlide() {
    if (currentSlideIndex < totalSlides - 1) {
      goToSlide(currentSlideIndex + 1);
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  }

  // Global Attachments for Inline Event Handlers
  window.goToSlide = goToSlide;
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;

  // Zoom Modal for STAR Cards
  window.zoomStarCard = function (letter, text) {
    const labels = {
      S: 'SITUATION (置かれた状況)',
      T: 'TASK (直面した壁・命題)',
      A: 'ACTION (実行した突破策)',
      R: 'RESULT (生み出した結果)'
    };

    zoomModalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <span class="star-letter" style="font-size: 3rem; display: inline-block; color: #d4af37;">${letter}</span>
        <h2 style="font-family: 'Cinzel', serif; font-size: 1.25rem; font-weight: 800; color: #d4af37; margin-top: 0.5rem;">${labels[letter]}</h2>
      </div>
      <div style="font-family: 'Noto Serif JP', serif; font-size: 1.15rem; line-height: 1.85; color: var(--text-main); background: rgba(0, 0, 0, 0.25); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-card);">
        ${text}
      </div>
    `;
    zoomModal.classList.add('open');
  };

  function closeZoomModal() {
    zoomModal.classList.remove('open');
  }

  // Drawer Controls
  function openIndexDrawer() {
    indexDrawer.classList.add('open');
  }

  function closeIndexDrawer() {
    indexDrawer.classList.remove('open');
  }

  // Search Engine Modal
  function openSearchModal() {
    searchModal.classList.add('open');
    searchQueryInput.focus();
  }

  function closeSearchModal() {
    searchModal.classList.remove('open');
    searchQueryInput.value = '';
    searchResultsList.innerHTML = '';
  }

  function handleSearch(query) {
    if (!query || query.trim() === '') {
      searchResultsList.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">検索キーワードを入力してください。</p>';
      return;
    }

    const q = query.toLowerCase().trim();
    const matches = [];

    PRESENTATION_DATA.slides.forEach((slide, idx) => {
      const slideText = JSON.stringify(slide).toLowerCase();
      if (slideText.includes(q)) {
        matches.push({ slide, idx });
      }
    });

    if (matches.length === 0) {
      searchResultsList.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">「${escapeHTML(query)}」に一致する章は見つかりませんでした。</p>`;
      return;
    }

    searchResultsList.innerHTML = matches.map(m => {
      const titleClean = m.slide.title ? m.slide.title.replace(/【STAR構造化】/g, '') : '';
      const badgeClean = m.slide.badge ? m.slide.badge.replace(/【STAR構造化】/g, '') : '';
      return `
        <div class="search-result-item" onclick="window.goToSlide(${m.idx}); window.closeSearchModal();">
          <div class="search-result-header">
            <span class="search-result-badge">${badgeClean}</span>
            <span class="search-result-slide-num">${m.idx === 0 ? 'COVER' : `CH.${m.idx}`}</span>
          </div>
          <h4 class="search-result-title">${titleClean}</h4>
          <p class="search-result-sub">${m.slide.subtitle || ''}</p>
        </div>
      `;
    }).join('');
  }

  // Countdown Timer Engine
  function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
      timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  }

  function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    document.getElementById('timer-play-icon').style.display = 'none';
    document.getElementById('timer-pause-icon').style.display = 'block';

    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        updateTimerDisplay();
      } else {
        pauseTimer();
      }
    }, 1000);
  }

  function pauseTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    document.getElementById('timer-play-icon').style.display = 'block';
    document.getElementById('timer-pause-icon').style.display = 'none';
  }

  function resetTimer() {
    pauseTimer();
    timerSeconds = 60 * 60;
    updateTimerDisplay();
  }

  // "I'm Feeling Lucky" Random Jump Button
  function jumpRandomSlide() {
    const randomIndex = Math.floor(Math.random() * totalSlides);
    goToSlide(randomIndex);
  }

  // Barrel Roll Easter Egg
  function triggerBarrelRoll() {
    document.body.classList.add('barrel-roll');
    setTimeout(() => document.body.classList.remove('barrel-roll'), 1000);
  }

  // Keyboard Event Listeners
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowRight' || e.key === 'Space') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'Escape') {
      closeZoomModal();
      closeIndexDrawer();
      closeSearchModal();
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
    }
  });

  // Attach Event Listeners on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    renderSlides();
    updateTimerDisplay();

    // Prev / Next Navigation Buttons
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Modal & Drawer Trigger Buttons
    document.getElementById('open-drawer-btn').addEventListener('click', openIndexDrawer);
    document.getElementById('drawer-close').addEventListener('click', closeIndexDrawer);
    document.getElementById('zoom-close').addEventListener('click', closeZoomModal);
    document.getElementById('open-search-btn').addEventListener('click', openSearchModal);
    document.getElementById('search-close-btn').addEventListener('click', closeSearchModal);

    // Lucky & Brand Logo Easter Eggs
    document.getElementById('lucky-btn').addEventListener('click', jumpRandomSlide);
    document.getElementById('google-brand-logo').addEventListener('click', triggerBarrelRoll);

    // Search Input Real-Time Listener
    searchQueryInput.addEventListener('input', (e) => handleSearch(e.target.value));

    // Timer Toggle & Reset Buttons
    document.getElementById('timer-toggle').addEventListener('click', () => {
      if (isTimerRunning) pauseTimer();
      else startTimer();
    });
    document.getElementById('timer-reset').addEventListener('click', resetTimer);

    // Modal Overlay Click to Close
    zoomModal.addEventListener('click', (e) => {
      if (e.target === zoomModal) closeZoomModal();
    });
    indexDrawer.addEventListener('click', (e) => {
      if (e.target === indexDrawer) closeIndexDrawer();
    });
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearchModal();
    });
  });

  window.closeSearchModal = closeSearchModal;
})();
