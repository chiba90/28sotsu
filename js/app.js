/**
 * PRESENTATION ENGINE & CONTROLLER
 * Google Workspace / Material Design Edition
 * Features: Unified Title Positioning, Space-Efficient Layouts,
 * Real-time Presentation Search (Ctrl+K), "I'm Feeling Lucky" Jump, "Do a Barrel Roll" Easter Egg,
 * Light Sweep Transition Streak, and Final Slide Ray of Hope Aura.
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
    // HERO / INTRO TEMPLATE
    hero: (slide) => {
      const p = slide.presenter;
      const m = slide.metric;
      const t = slide.theme;
      return `
        <div class="hero-grid anim-el delay-2">
          <!-- Presenter Info -->
          <div class="glass-card" style="grid-column: 1 / -1; min-height: 200px; md:grid-column: span 1;">
            <div class="profile-card-header">
              <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: var(--google-blue); tracking-wider; text-transform: uppercase;">PRESENTER PROFILE</span>
                <h3 style="font-size: 1.6rem; font-weight: 800; margin-top: 0.2rem; color: #202124;">${p.name}</h3>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.1rem; font-weight: 500;">${p.role}</p>
              </div>
              <div class="avatar-thumb" onclick="event.stopPropagation(); zoomDaughter();" title="クリックで娘の写真拡大！">
                <img src="${p.daughterImg}" alt="${p.daughterName}">
              </div>
            </div>
            <p style="font-size: 0.95rem; color: var(--text-muted); margin-top: 0.85rem; line-height: 1.5; font-weight: 500;">
              ${p.daughterNote}
            </p>
            <p style="font-size: 0.85rem; color: var(--text-dim); margin-top: 0.85rem; border-top: 1px solid var(--border-card); padding-top: 0.6rem; font-weight: 600;">
              ${p.university}
            </p>
          </div>

          <!-- Continuity Metric Card -->
          <div class="glass-card ${getCardAccentClass(slide.accent)}">
            <div>
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-${slide.accent}); tracking-wider; text-transform: uppercase;">${m.badge}</span>
              <div style="font-size: 3.4rem; font-weight: 800; color: var(--google-blue); margin-top: 0.35rem; line-height: 1; letter-spacing: -0.02em;">${m.value}</div>
              <h4 style="font-size: 1.15rem; font-weight: 700; color: #202124; margin-top: 0.6rem;">${m.label}</h4>
            </div>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.85rem; border-top: 1px solid var(--border-card); padding-top: 0.6rem;">
              ${m.note}
            </p>
          </div>

          <!-- Today's Theme Card -->
          <div class="glass-card ${getCardAccentClass(slide.accent)}">
            <div>
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-${slide.accent}); tracking-wider; text-transform: uppercase;">${t.badge}</span>
              <h4 style="font-size: 1.35rem; font-weight: 800; color: #202124; margin-top: 0.6rem; line-height: 1.35;">${t.title}</h4>
            </div>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.85rem; border-top: 1px solid var(--border-card); padding-top: 0.6rem;">
              ${t.note}
            </p>
          </div>
        </div>
      `;
    },

    // SPLIT CARDS TEMPLATE (2 COLUMNS)
    split: (slide) => {
      const cardsHtml = slide.cards.map(c => `
        <div class="glass-card ${getCardAccentClass(c.badgeColor)}">
          <div>
            <span class="slide-badge badge-${c.badgeColor}">${c.badge}</span>
            <h3 style="font-size: 1.45rem; font-weight: 800; color: #202124; margin: 0.75rem 0 0.85rem 0; line-height: 1.35;">${c.title}</h3>
            <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.65;">${c.body}</p>
          </div>
        </div>
      `).join('');
      return `<div class="split-grid anim-el delay-2">${cardsHtml}</div>`;
    },

    // GRID CARDS TEMPLATE (3 COLUMNS)
    grid: (slide) => {
      const cardsHtml = slide.cards.map(c => `
        <div class="glass-card ${getCardAccentClass(c.badgeColor)}">
          <div>
            <span class="slide-badge badge-${c.badgeColor}">${c.badge}</span>
            <h3 style="font-size: 1.3rem; font-weight: 700; color: #202124; margin: 0.75rem 0 0.65rem 0; line-height: 1.35;">${c.title}</h3>
            <p style="font-size: 1rem; color: var(--text-muted); line-height: 1.6;">${c.body}</p>
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
                <span style="font-size: 0.75rem; font-weight: 700; color: var(--google-blue); tracking-wider; text-transform: uppercase;">S : Situation</span>
                <p style="font-size: 0.975rem; color: var(--text-muted); margin-top: 0.65rem; line-height: 1.55;">${s.s}</p>
              </div>
            </div>
            <!-- Task -->
            <div class="glass-card">
              <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: var(--google-blue); tracking-wider; text-transform: uppercase;">T : Task</span>
                <p style="font-size: 0.975rem; color: var(--text-muted); margin-top: 0.65rem; line-height: 1.55;">${s.t}</p>
              </div>
            </div>
            <!-- Action -->
            <div class="glass-card">
              <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: var(--google-blue); tracking-wider; text-transform: uppercase;">A : Action</span>
                <p style="font-size: 0.975rem; color: var(--text-muted); margin-top: 0.65rem; line-height: 1.55;">${s.a}</p>
              </div>
            </div>
            <!-- Result -->
            <div class="glass-card ${getCardAccentClass(slide.accent)}">
              <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-${slide.accent}); tracking-wider; text-transform: uppercase;">R : Result</span>
                <p style="font-size: 1rem; color: #202124; margin-top: 0.65rem; line-height: 1.55; font-weight: 600;">${s.r}</p>
              </div>
            </div>
          </div>

          <!-- Why Highlight Card -->
          <div class="glass-card ${getCardAccentClass(slide.accent)}" style="background: var(--google-blue-bg);">
            <div>
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--google-blue); tracking-wider; text-transform: uppercase;">${w.title}</span>
              <p style="font-size: 1.05rem; color: #202124; margin-top: 0.75rem; line-height: 1.65; font-weight: 500;">${w.body}</p>
            </div>
          </div>
        </div>
      `;
    },

    // TRUTH & FANTASY COMPARISON TEMPLATE
    truth: (slide) => {
      const m = slide.myth;
      const f = slide.fact;
      return `
        <div class="truth-grid anim-el delay-2">
          <!-- Myth Card -->
          <div class="glass-card" style="border-color: rgba(217, 48, 37, 0.3); background: var(--google-red-bg);">
            <div>
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--google-red); tracking-wider; text-transform: uppercase; padding: 0.25rem 0.65rem; background: #ffffff; border-radius: 4px;">${m.label}</span>
              <h3 style="font-size: 1.35rem; font-weight: 800; color: #c5221f; margin: 1rem 0 0.85rem 0; line-height: 1.4;">"${m.quote}"</h3>
              ${m.body ? `<p style="font-size: 1rem; color: #5c0b0a; line-height: 1.6; border-top: 1px solid rgba(217, 48, 37, 0.15); padding-top: 0.75rem;">${m.body}</p>` : ''}
            </div>
            <div style="font-size: 0.8rem; color: #c5221f; margin-top: 1.25rem; font-weight: 600;">${m.note || ''}</div>
          </div>

          <!-- Fact Card -->
          <div class="glass-card ${getCardAccentClass(slide.accent)}" style="background: #ffffff;">
            <div>
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-${slide.accent}); tracking-wider; text-transform: uppercase; padding: 0.25rem 0.65rem; background: var(--google-red-bg); border-radius: 4px;">${f.label}</span>
              <h3 style="font-size: 1.45rem; font-weight: 800; color: #202124; margin: 1rem 0 0.85rem 0; line-height: 1.4;">"${f.quote}"</h3>
              <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.65; border-top: 1px solid var(--border-card); padding-top: 0.75rem;">${f.body}</p>
            </div>
          </div>
        </div>
      `;
    },

    // CLOSING / QA TEMPLATE
    closing: (slide) => {
      const cardsHtml = slide.cards.map(c => `
        <div class="glass-card ${getCardAccentClass(slide.accent)}">
          <div>
            <div style="font-size: 2.2rem; margin-bottom: 0.65rem;">${c.icon}</div>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: #202124; margin-bottom: 0.75rem;">${c.title}</h3>
            <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.65;">${c.body}</p>
          </div>
          <div style="font-size: 0.85rem; color: var(--google-blue); font-weight: 700; margin-top: 1.5rem; border-top: 1px solid var(--border-card); padding-top: 0.75rem;">
            ${c.note}
          </div>
        </div>
      `).join('');
      return `<div class="split-grid anim-el delay-2" style="position: relative; z-index: 10;">${cardsHtml}</div>`;
    }
  };

  // ==========================================
  // 2. RENDER SLIDES & BUILD TIMELINE
  // ==========================================

  function renderSlides() {
    container.innerHTML = '';
    slideIndexList.innerHTML = '';

    slidesData.forEach((slide, index) => {
      const slideSection = document.createElement('section');
      slideSection.className = `slide ${index === currentSlideIndex ? 'active' : ''}`;
      slideSection.id = slide.id;

      const renderContent = templates[slide.type];
      const contentHtml = renderContent ? renderContent(slide) : '';

      const isFinalSlide = index === slidesData.length - 1;
      const extraEffects = isFinalSlide 
        ? '<div class="light-sweep"></div><div class="super-glow"></div>' 
        : '<div class="light-sweep"></div>';

      slideSection.innerHTML = `
        ${extraEffects}
        <div class="slide-content-scroll" style="position: relative; z-index: 5;">
          <div class="slide-header-block anim-el delay-1">
            ${createBadge(slide.badge, slide.accent)}
            <h2 class="slide-title">${slide.title}</h2>
            <p class="slide-subtitle">${slide.subtitle}</p>
          </div>
          ${contentHtml}
        </div>
      `;

      container.appendChild(slideSection);

      const drawerItem = document.createElement('div');
      drawerItem.className = `index-item ${index === currentSlideIndex ? 'active' : ''}`;
      const plainTitle = slide.title.replace(/<\/?[^>]+(>|$)/g, "");
      drawerItem.innerHTML = `<span style="font-weight: 700;">${index + 1}.</span> ${plainTitle}`;
      drawerItem.addEventListener('click', () => {
        jumpToSlide(index);
        closeDrawer();
      });
      slideIndexList.appendChild(drawerItem);
    });

    bindCardClickEvents();
  }

  // ==========================================
  // 3. SLIDE CONTROLLER & STATE
  // ==========================================

  function jumpToSlide(index) {
    if (index >= 0 && index < slidesData.length) {
      currentSlideIndex = index;
      
      const domSlides = document.querySelectorAll('.slide');
      domSlides.forEach((slide, idx) => {
        const sweepEl = slide.querySelector('.light-sweep');
        const superGlowEl = slide.querySelector('.super-glow');

        if (idx === currentSlideIndex) {
          slide.classList.add('active');
          
          // Trigger Light Sweep Streak
          if (sweepEl) {
            sweepEl.classList.remove('light-sweep-active');
            void sweepEl.offsetWidth; // Reflow
            sweepEl.classList.add('light-sweep-active');
          }

          // Trigger Ray of Hope Grand Aura on Final Slide
          if (superGlowEl) {
            superGlowEl.classList.remove('super-glow-active');
            void superGlowEl.offsetWidth;
            superGlowEl.classList.add('super-glow-active');
          }
        } else {
          slide.classList.remove('active');
          if (sweepEl) sweepEl.classList.remove('light-sweep-active');
          if (superGlowEl) superGlowEl.classList.remove('super-glow-active');
        }
      });

      const drawerItems = document.querySelectorAll('.index-item');
      drawerItems.forEach((item, idx) => {
        if (idx === currentSlideIndex) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      updateControls();
    }
  }

  function updateControls() {
    prevBtn.disabled = currentSlideIndex === 0;
    nextBtn.disabled = currentSlideIndex === slidesData.length - 1;

    const progressPercent = ((currentSlideIndex + 1) / slidesData.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
    currentNumDisplay.textContent = `${currentSlideIndex + 1} / ${slidesData.length}`;
  }

  function goToNext() {
    if (currentSlideIndex < slidesData.length - 1) {
      jumpToSlide(currentSlideIndex + 1);
    }
  }

  function goToPrev() {
    if (currentSlideIndex > 0) {
      jumpToSlide(currentSlideIndex - 1);
    }
  }

  prevBtn.addEventListener('click', goToPrev);
  nextBtn.addEventListener('click', goToNext);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowRight' || e.key === ' ') {
      goToNext();
    } else if (e.key === 'ArrowLeft') {
      goToPrev();
    }
  });

  // Mobile Touch Swipe Handling
  let touchStartX = 0;
  let touchEndX = 0;
  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 65) {
      goToNext();
    } else if (touchEndX - touchStartX > 65) {
      goToPrev();
    }
  }, { passive: true });

  // ==========================================
  // 4. GOOGLE EASTER EGGS & INTERACTIVE TRICKS
  // ==========================================

  // Google Barrel Roll
  window.doBarrelRoll = function() {
    document.body.classList.remove('barrel-roll');
    void document.body.offsetWidth;
    document.body.classList.add('barrel-roll');
    setTimeout(() => {
      document.body.classList.remove('barrel-roll');
    }, 1200);
  };

  const brandLogo = document.getElementById('google-brand-logo');
  if (brandLogo) {
    brandLogo.addEventListener('click', window.doBarrelRoll);
  }

  // Google "I'm Feeling Lucky" Random Jump
  const luckyBtn = document.getElementById('lucky-btn');
  if (luckyBtn) {
    luckyBtn.addEventListener('click', () => {
      const randomIndex = Math.floor(Math.random() * slidesData.length);
      jumpToSlide(randomIndex);
      window.doBarrelRoll();
    });
  }

  // ==========================================
  // 5. GOOGLE PRESENTATION SEARCH SYSTEM
  // ==========================================

  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-query-input');
  const searchResultsList = document.getElementById('search-results-list');
  const openSearchBtn = document.getElementById('open-search-btn');
  const searchCloseBtn = document.getElementById('search-close-btn');

  function openSearch() {
    searchModal.classList.add('open');
    searchInput.value = '';
    searchInput.focus();
    renderSearchResults('');
  }

  function closeSearch() {
    searchModal.classList.remove('open');
  }

  openSearchBtn.addEventListener('click', openSearch);
  searchCloseBtn.addEventListener('click', closeSearch);
  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
  });

  searchInput.addEventListener('input', (e) => {
    renderSearchResults(e.target.value.trim().toLowerCase());
  });

  function renderSearchResults(query) {
    searchResultsList.innerHTML = '';

    const matches = slidesData.filter((slide, idx) => {
      if (!query) return true;
      const fullText = (slide.title + ' ' + slide.subtitle + ' ' + JSON.stringify(slide)).toLowerCase();
      return fullText.includes(query);
    });

    if (matches.length === 0) {
      searchResultsList.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-dim); font-size: 0.9rem;">一致するスライドが見つかりませんでした</div>`;
      return;
    }

    matches.forEach(slide => {
      const slideIndex = slidesData.findIndex(s => s.id === slide.id);
      const item = document.createElement('div');
      item.className = 'search-result-item';
      const plainTitle = slide.title.replace(/<\/?[^>]+(>|$)/g, "");
      const plainSubtitle = slide.subtitle.replace(/<\/?[^>]+(>|$)/g, "");

      item.innerHTML = `
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--google-blue);">SLIDE ${slideIndex + 1} • ${slide.badge}</div>
        <div style="font-size: 1rem; font-weight: 700; color: var(--text-main);">${plainTitle}</div>
        <div style="font-size: 0.85rem; color: var(--text-muted);">${plainSubtitle}</div>
      `;

      item.addEventListener('click', () => {
        jumpToSlide(slideIndex);
        closeSearch();
      });

      searchResultsList.appendChild(item);
    });
  }

  // ==========================================
  // 6. MODALS & INDEX TIMELINE DRAWER
  // ==========================================

  const indexDrawer = document.getElementById('index-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close');
  const openDrawerBtn = document.getElementById('open-drawer-btn');

  function openDrawer() {
    indexDrawer.classList.add('open');
  }

  function closeDrawer() {
    indexDrawer.classList.remove('open');
  }

  openDrawerBtn.addEventListener('click', openDrawer);
  drawerCloseBtn.addEventListener('click', closeDrawer);
  indexDrawer.addEventListener('click', (e) => {
    if (e.target === indexDrawer) closeDrawer();
  });

  // ==========================================
  // 7. INTERACTIVE ZOOM MODAL
  // ==========================================

  const zoomModal = document.getElementById('zoom-modal');
  const zoomModalBody = document.getElementById('zoom-modal-body');
  const zoomCloseBtn = document.getElementById('zoom-close');

  function openZoomModal(contentHtml) {
    zoomModalBody.innerHTML = `
      <div style="font-size: 1.1rem; color: #202124; line-height: 1.75;">
        ${contentHtml}
      </div>
    `;
    zoomModal.classList.add('open');
  }

  function closeZoomModal() {
    zoomModal.classList.remove('open');
  }

  zoomCloseBtn.addEventListener('click', closeZoomModal);
  zoomModal.addEventListener('click', (e) => {
    if (e.target === zoomModal) closeZoomModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeZoomModal();
      closeDrawer();
      closeSearch();
    }
  });

  function bindCardClickEvents() {
    document.querySelectorAll('.glass-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.avatar-thumb')) return;

        const clone = card.cloneNode(true);
        const badges = clone.querySelectorAll('.slide-badge');
        badges.forEach(b => {
          b.style.marginBottom = '1.25rem';
        });

        openZoomModal(clone.innerHTML);
      });
    });
  }

  // Daughter Zoom Specific Handler
  window.zoomDaughter = function() {
    const daughterHtml = `
      <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1.25rem;">
        <div style="width: 100%; max-width: 360px; aspect-ratio: 3/4; overflow: hidden; border-radius: 16px; border: 2px solid var(--google-blue); box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          <img src="PXL_20260705_051631581.jpg" alt="千葉フローレンス夏歌" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div>
          <h3 style="font-size: 1.8rem; font-weight: 800; color: #202124;">千葉フローレンス夏歌 ちゃん</h3>
          <p style="font-size: 0.95rem; color: var(--google-blue); font-weight: 700; margin-top: 0.2rem;">Natsuka Florence Chiba</p>
          <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.7; margin-top: 0.85rem; max-width: 520px;">
            「娘に誇れる圧倒的に明るい未来をつくること」<br>
            千葉パパを無限に走らせるエネルギー源であり、泥臭い仕事もすべての逆境も笑顔で乗り越えるための原点です。
          </p>
        </div>
      </div>
    `;
    openZoomModal(daughterHtml);
  };

  // ==========================================
  // 8. PRESENTATION TIMER
  // ==========================================

  const timerToggle = document.getElementById('timer-toggle');
  const timerReset = document.getElementById('timer-reset');
  const timerDisplay = document.getElementById('timer-display');
  const timerPlayIcon = document.getElementById('timer-play-icon');
  const timerPauseIcon = document.getElementById('timer-pause-icon');

  const INITIAL_SECONDS = 60 * 60; // 60 minutes
  let remainingSeconds = INITIAL_SECONDS;
  let timerInterval = null;

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateTimerUI() {
    timerDisplay.textContent = formatTime(remainingSeconds);
    if (remainingSeconds <= 300) {
      timerDisplay.classList.add('timer-warning');
    } else {
      timerDisplay.classList.remove('timer-warning');
    }
  }

  function toggleTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerPlayIcon.style.display = 'block';
      timerPauseIcon.style.display = 'none';
    } else {
      timerPlayIcon.style.display = 'none';
      timerPauseIcon.style.display = 'block';
      timerInterval = setInterval(() => {
        if (remainingSeconds > 0) {
          remainingSeconds--;
          updateTimerUI();
        } else {
          clearInterval(timerInterval);
          timerInterval = null;
          timerPlayIcon.style.display = 'block';
          timerPauseIcon.style.display = 'none';
        }
      }, 1000);
    }
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    remainingSeconds = INITIAL_SECONDS;
    updateTimerUI();
    timerPlayIcon.style.display = 'block';
    timerPauseIcon.style.display = 'none';
  }

  timerToggle.addEventListener('click', toggleTimer);
  timerReset.addEventListener('click', resetTimer);

  // ==========================================
  // INITIALIZATION
  // ==========================================
  renderSlides();
  jumpToSlide(0); // Trigger initial animations
  updateControls();
  updateTimerUI();
});
