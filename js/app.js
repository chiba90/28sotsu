/**
 * DIGITAL PLUS EXECUTIVE BRIEFING ENGINE (APP.JS)
 * Imperial Gold Hardcover Memoir Edition (Autobiography Theme)
 * Author: 千葉 博文 (Hirofumi Chiba) - Director, Digital Plus, Inc.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================
  // 1. STATE & CONSTANTS
  // ==========================================
  let currentSlide = 0;
  const slides = PRESENTATION_DATA.slides;
  const totalSlides = slides.length;

  const slidesContainer = document.getElementById('slides-container');
  const slideIndexList = document.getElementById('slide-index-list');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const currentSlideNum = document.getElementById('current-slide-num');
  const progressFill = document.getElementById('progress-fill');
  const timelineAvatar = document.getElementById('timeline-avatar');
  const avatarLabel = document.getElementById('avatar-label');

  // Timeline Avatar Stages
  const STAGES = [
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

  // ==========================================
  // 2. SLIDE GENERATORS
  // ==========================================

  function renderSlides() {
    if (!slidesContainer) return;
    slidesContainer.innerHTML = '';

    slides.forEach((slide, index) => {
      const slideEl = document.createElement('div');
      slideEl.className = `slide ${index === 0 ? 'active' : ''}`;
      slideEl.id = slide.id;

      if (slide.type === 'cover') {
        slideEl.innerHTML = generateCoverHTML(slide);
      } else if (slide.type === 'hero') {
        slideEl.innerHTML = generateHeroHTML(slide);
      } else if (slide.type === 'w-star') {
        slideEl.innerHTML = generateWStarHTML(slide);
      } else if (slide.type === 'truth') {
        slideEl.innerHTML = generateTruthHTML(slide);
      } else if (slide.type === 'split') {
        slideEl.innerHTML = generateSplitHTML(slide);
      } else if (slide.type === 'closing') {
        slideEl.innerHTML = generateClosingHTML(slide);
      }

      slidesContainer.appendChild(slideEl);
    });

    renderIndexList();
    updateUI();
  }

  // Cover Slide (Front Cover)
  function generateCoverHTML(slide) {
    return `
      <div class="picture-book-cover">
        <div class="picture-book-cover-frame">
          <div class="picture-book-cover-badge">SPECIAL EXECUTIVE AUTOBIOGRAPHY</div>
          <h1 class="picture-book-cover-title">${slide.title}</h1>
          <p class="picture-book-cover-subtitle">${slide.subtitle}</p>
          <div class="picture-book-cover-divider"></div>
          <div class="picture-book-cover-author">
            <span class="author-role">著者 / 株式会社デジタルプラス 取締役</span>
            <span class="author-name">千葉 博文</span>
            <span class="author-uni">筑波大学理工学群 社会工学類 卒</span>
          </div>
          <button class="picture-book-start-btn" onclick="nextSlide()">
            自伝を開く (PAGE FLIP) →
          </button>
        </div>
      </div>
    `;
  }

  // Chapter Header Component
  function generateChapterHeader(slide) {
    const cleanBadge = slide.badge ? slide.badge.replace(/【STAR構造化】/g, '') : '';
    const cleanTitle = slide.title ? slide.title.replace(/【STAR構造化】/g, '') : '';
    return `
      <div class="picture-book-header">
        <span class="picture-book-badge">${cleanBadge}</span>
        <h2 class="picture-book-title">${cleanTitle}</h2>
        <p class="picture-book-subtitle">${slide.subtitle}</p>
      </div>
    `;
  }

  // Hero Slide (Slide 1)
  function generateHeroHTML(slide) {
    const p = slide.presenter;
    return `
      <div class="picture-book-page">
        <div class="picture-book-ribbon"></div>
        ${generateChapterHeader(slide)}
        
        <div class="hero-grid">
          <!-- Card 1: Executive Profile (Full Width) -->
          <div class="glass-card full-width profile-card bento-hover">
            <div class="profile-header">
              <div class="avatar-ring">
                <span class="profile-emoji">👨‍💼</span>
              </div>
              <div class="profile-meta">
                <h3>${p.name} <span class="role-tag">${p.role}</span></h3>
                <p class="uni-tag">🎓 ${p.university}</p>
                <p class="bio-note">${p.note}</p>
              </div>
            </div>
            <!-- Daughter Card Embed -->
            <div class="daughter-mini-card" onclick="zoomDaughter()">
              <div class="daughter-photo-wrap">
                <img src="${p.daughterImg}" alt="${p.daughterName}" class="daughter-photo">
              </div>
              <div class="daughter-info">
                <span class="daughter-badge">MY DAUGHTER & INSPIRATION</span>
                <p class="daughter-name">${p.daughterName} ちゃん</p>
                <p class="daughter-quote">${p.daughterNote}</p>
              </div>
            </div>
          </div>

          <!-- Card 2: Continuous Learning -->
          <div class="glass-card bento-hover">
            <span class="card-badge purple">${slide.metric.badge}</span>
            <div class="stat-number">${slide.metric.value}</div>
            <h4 class="card-title">${slide.metric.label}</h4>
            <p class="card-desc">${slide.metric.note}</p>
          </div>

          <!-- Card 3: Core Theme -->
          <div class="glass-card bento-hover">
            <span class="card-badge amber">${slide.theme.badge}</span>
            <h4 class="card-title" style="margin-top: 0.5rem; font-size: 1.1rem;">${slide.theme.title}</h4>
            <p class="card-desc" style="margin-top: 0.35rem;">${slide.theme.note}</p>
          </div>

          <!-- Card 4: Impact -->
          <div class="glass-card bento-hover">
            <span class="card-badge emerald">${slide.impact.badge}</span>
            <h4 class="card-title" style="margin-top: 0.5rem; font-size: 1.1rem;">${slide.impact.title}</h4>
            <p class="card-desc" style="margin-top: 0.35rem;">${slide.impact.note}</p>
          </div>
        </div>
      </div>
    `;
  }

  // W-STAR Slide (Slides 3-6)
  function generateWStarHTML(slide) {
    const star = slide.star;
    const why = slide.why;

    return `
      <div class="picture-book-page">
        <div class="picture-book-ribbon"></div>
        ${generateChapterHeader(slide)}

        <div class="wstar-container">
          <!-- Left 2x2 STAR Grid -->
          <div class="star-2x2">
            <div class="star-card star-s">
              <div class="star-letter">S</div>
              <div class="star-label">SITUATION (置かれた状況)</div>
              <p class="star-text">${star.s}</p>
            </div>
            <div class="star-card star-t">
              <div class="star-letter">T</div>
              <div class="star-label">TASK (直面した壁・命題)</div>
              <p class="star-text">${star.t}</p>
            </div>
            <div class="star-card star-a">
              <div class="star-letter">A</div>
              <div class="star-label">ACTION (実行した突破策)</div>
              <p class="star-text">${star.a}</p>
            </div>
            <div class="star-card star-r">
              <div class="star-letter">R</div>
              <div class="star-label">RESULT (生み出した結果)</div>
              <p class="star-text">${star.r}</p>
            </div>
          </div>

          <!-- Right Why Card -->
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
  }

  // Truth Slide (Slides 7-8: MYTH vs FACT)
  function generateTruthHTML(slide) {
    return `
      <div class="picture-book-page">
        <div class="picture-book-ribbon"></div>
        ${generateChapterHeader(slide)}

        <div class="truth-grid">
          <!-- MYTH Card -->
          <div class="glass-card myth-card bento-hover">
            <span class="card-badge rose">${slide.myth.label}</span>
            <blockquote class="myth-quote">${slide.myth.quote}</blockquote>
            <p class="card-desc">${slide.myth.note}</p>
            <div class="why-footer" style="margin-top: auto; color: #f87171;">${slide.myth.footer}</div>
          </div>

          <!-- FACT Card -->
          <div class="glass-card fact-card bento-hover">
            <span class="card-badge amber">${slide.fact.label}</span>
            <blockquote class="fact-quote">${slide.fact.quote}</blockquote>
            <p class="fact-lead">${slide.fact.lead}</p>
            <p class="card-desc">${slide.fact.body}</p>
            <div class="why-footer" style="margin-top: auto; color: #d4af37;">${slide.fact.footer}</div>
          </div>
        </div>
      </div>
    `;
  }

  // Split Slide (Slides 2 & 9: 2 Large Cards)
  function generateSplitHTML(slide) {
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
        ${generateChapterHeader(slide)}

        <div style="display: flex; gap: 1.5rem; height: calc(100% - 110px); width: 100%;">
          ${cardsHTML}
        </div>
      </div>
    `;
  }

  // Closing Slide (Slide 10)
  function generateClosingHTML(slide) {
    const cardsHTML = slide.cards.map((c, idx) => `
      <div class="glass-card bento-hover" style="flex: 1; display: flex; flex-direction: column; cursor: pointer;" onclick="openQAModal(${idx})">
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
        ${generateChapterHeader(slide)}

        <div style="display: flex; gap: 1.5rem; height: calc(100% - 110px); width: 100%;">
          ${cardsHTML}
        </div>
      </div>
    `;
  }

  // ==========================================
  // 3. INDEX DRAWER RENDERER
  // ==========================================
  function renderIndexList() {
    if (!slideIndexList) return;
    slideIndexList.innerHTML = '';

    slides.forEach((s, idx) => {
      const cleanTitle = s.title ? s.title.replace(/【STAR構造化】/g, '') : '';
      const cleanBadge = s.badge ? s.badge.replace(/【STAR構造化】/g, '') : '';

      const item = document.createElement('div');
      item.className = `index-item ${idx === currentSlide ? 'active' : ''}`;
      item.onclick = () => {
        goToSlide(idx);
        closeIndexDrawer();
      };
      item.innerHTML = `
        <div class="index-item-num">${idx === 0 ? 'COVER' : `CH.${idx}`}</div>
        <div class="index-item-text">
          <div class="index-item-badge">${cleanBadge || '章'}</div>
          <div class="index-item-title">${cleanTitle}</div>
        </div>
      `;
      slideIndexList.appendChild(item);
    });
  }

  // ==========================================
  // 4. NAVIGATION ENGINE
  // ==========================================
  function goToSlide(idx) {
    if (idx < 0 || idx >= totalSlides) return;
    currentSlide = idx;

    const allSlides = document.querySelectorAll('.slide');
    allSlides.forEach((s, i) => {
      if (i === currentSlide) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    updateUI();
  }

  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }

  window.goToSlide = goToSlide;
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;

  function updateUI() {
    if (prevBtn) prevBtn.disabled = (currentSlide === 0);
    if (nextBtn) nextBtn.disabled = (currentSlide === totalSlides - 1);

    if (currentSlideNum) {
      currentSlideNum.textContent = (currentSlide === 0) ? 'COVER' : `${currentSlide} / ${totalSlides - 1}`;
    }

    const pct = Math.round((currentSlide / (totalSlides - 1)) * 100);
    if (progressFill) progressFill.style.width = `${pct}%`;

    if (timelineAvatar) {
      timelineAvatar.style.left = `${pct}%`;
      const stage = STAGES[currentSlide] || STAGES[0];
      if (avatarLabel) avatarLabel.textContent = stage.label;
    }

    const indexItems = document.querySelectorAll('.index-item');
    indexItems.forEach((item, i) => {
      if (i === currentSlide) item.classList.add('active');
      else item.classList.remove('active');
    });
  }

  // ==========================================
  // 5. INDEX DRAWER CONTROLS
  // ==========================================
  const indexDrawer = document.getElementById('index-drawer');
  const openDrawerBtn = document.getElementById('open-drawer-btn');
  const closeDrawerBtn = document.getElementById('drawer-close');

  function openIndexDrawer() {
    if (indexDrawer) indexDrawer.classList.add('open');
  }
  function closeIndexDrawer() {
    if (indexDrawer) indexDrawer.classList.remove('open');
  }

  if (openDrawerBtn) openDrawerBtn.addEventListener('click', openIndexDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeIndexDrawer);
  if (indexDrawer) {
    indexDrawer.addEventListener('click', (e) => {
      if (e.target === indexDrawer) closeIndexDrawer();
    });
  }

  // ==========================================
  // 6. KEYBOARD ENGINE
  // ==========================================
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === 'Space') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'Escape') {
      closeIndexDrawer();
      closeSearchModal();
      closeZoomModal();
    }
  });

  // ==========================================
  // 7. SEARCH ENGINE MODAL
  // ==========================================
  const searchModal = document.getElementById('search-modal');
  const openSearchBtn = document.getElementById('open-search-btn');
  const closeSearchBtn = document.getElementById('search-close-btn');
  const searchQueryInput = document.getElementById('search-query-input');
  const searchResultsList = document.getElementById('search-results-list');

  function openSearchModal() {
    if (!searchModal) return;
    searchModal.classList.add('open');
    if (searchQueryInput) searchQueryInput.focus();
  }
  function closeSearchModal() {
    if (!searchModal) return;
    searchModal.classList.remove('open');
    if (searchQueryInput) searchQueryInput.value = '';
    if (searchResultsList) searchResultsList.innerHTML = '';
  }

  if (openSearchBtn) openSearchBtn.addEventListener('click', openSearchModal);
  if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearchModal);
  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearchModal();
    });
  }

  if (searchQueryInput) {
    searchQueryInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        searchResultsList.innerHTML = '';
        return;
      }

      const results = [];
      slides.forEach((s, idx) => {
        const text = JSON.stringify(s).toLowerCase();
        if (text.includes(q)) {
          results.push({ slide: s, index: idx });
        }
      });

      if (results.length === 0) {
        searchResultsList.innerHTML = `<p style="padding: 1.5rem; text-align: center; color: var(--text-dim);">「${q}」に一致する結果は見つかりませんでした</p>`;
        return;
      }

      searchResultsList.innerHTML = results.map(r => `
        <div class="search-result-item" onclick="goToSlide(${r.index}); closeSearchModal();">
          <div class="search-result-badge">${r.index === 0 ? 'COVER' : `CH.${r.index}`}</div>
          <div class="search-result-title">${r.slide.title.replace(/【STAR構造化】/g, '')}</div>
        </div>
      `).join('');
    });
  }

  // ==========================================
  // 8. PRESENTATION TIMER
  // ==========================================
  let timerSeconds = 60 * 60;
  let timerInterval = null;
  let isTimerRunning = false;

  const timerDisplay = document.getElementById('timer-display');
  const timerToggle = document.getElementById('timer-toggle');
  const timerReset = document.getElementById('timer-reset');
  const playIcon = document.getElementById('timer-play-icon');
  const pauseIcon = document.getElementById('timer-pause-icon');

  function updateTimerDisplay() {
    if (!timerDisplay) return;
    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    timerDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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
  // INITIALIZATION
  // ==========================================
  renderSlides();
  updateTimerDisplay();
});
