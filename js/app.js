/**
 * PRESENTATION ENGINE & CONTROLLER
 * 早期特別選考会 座談会スライド（約20分）
 *
 * - ← → / PageUp PageDown / Space：ページ移動
 * - N：話す用メモの表示切り替え（画面共有中は使わない）
 * - P：発表者ウィンドウを開く（メモ・次のページ・タイマー。共有するのはメインの画面だけ）
 * - optional: true のページは「時間があれば」。飛ばしても話がつながる
 * - 話す用メモは js/notes.js（手元だけ）。手元で開いたときだけ読み込み、公開ページでは読み込まない
 */

const IS_PRESENTER = new URLSearchParams(location.search).has('presenter');
const CHANNEL_NAME = 'digiplus-28sotsu-talk';
const IS_LOCAL = location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname);
const NO_NOTES_MESSAGE = '話す用メモは、手元のPCで開いたときだけ表示されます（js/notes.js）';

function loadSpeakerNotes() {
  if (!IS_LOCAL) return Promise.resolve();
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.src = `js/notes.js?v=${Date.now()}`;
    script.onload = script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

function getNotes(slide) {
  if (!window.SPEAKER_NOTES) return [NO_NOTES_MESSAGE];
  return window.SPEAKER_NOTES[slide.id] || [];
}

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

function chapterLabel(index) {
  return index === 0 ? 'COVER' : `CHAPTER ${ROMAN[index] || index}`;
}

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

document.addEventListener('DOMContentLoaded', () => {
  loadSpeakerNotes().then(() => {
    if (IS_PRESENTER) {
      initPresenterView();
    } else {
      initMainView();
    }
  });
});

/* ==========================================================================
   MAIN VIEW（学生に共有する画面）
   ========================================================================== */
function initMainView() {
  const container = document.getElementById('slides-container');
  const slideIndexList = document.getElementById('slide-index-list');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const progressFill = document.getElementById('progress-fill');
  const currentNumDisplay = document.getElementById('current-slide-num');
  const meta = PRESENTATION_DATA.meta;
  const slidesData = PRESENTATION_DATA.slides;
  const pageCount = slidesData.length - 1;

  let currentSlideIndex = 0;
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_NAME) : null;

  // Expose navigation to window for button clicks
  window.goToSlide = goToSlide;

  // ==========================================
  // 1. SLIDE TEMPLATE GENERATORS
  // ==========================================

  const templates = {
    // 自己紹介：大きな事実3つ＋写真
    intro: (slide) => {
      const p = meta.presenter;
      return `
        <div class="intro-layout anim-el delay-2">
          <div class="fact-row">
            ${slide.facts.map(f => `
              <div class="fact-tile">
                <div class="fact-value">${f.value}</div>
                <div class="fact-label">${f.label}</div>
              </div>
            `).join('')}
          </div>
          ${p.daughterImg ? `
            <div class="intro-photo" onclick="event.stopPropagation(); zoomDaughter();" title="クリックで写真を拡大">
              <img src="${p.daughterImg}" alt="${p.daughterName}">
              <span>${slide.photoNote || ''}</span>
            </div>
          ` : ''}
        </div>
      `;
    },

    // 原点：一言を大きく＋3ステップ
    quote: (slide) => `
      <div class="quote-layout anim-el delay-2">
        <blockquote class="big-quote">「${slide.quote}」</blockquote>
        <ol class="step-chain">
          ${slide.steps.map(s => `<li>${s}</li>`).join('')}
        </ol>
      </div>
    `,

    // 大きな数字3つ＋一言
    facts: (slide) => `
      <div class="facts-layout anim-el delay-2">
        <div class="fact-row">
          ${slide.facts.map(f => `
            <div class="fact-tile">
              <div class="fact-value">${f.value}</div>
              <div class="fact-label">${f.label}</div>
            </div>
          `).join('')}
        </div>
        ${slide.message ? `<p class="slide-message">${slide.message}</p>` : ''}
      </div>
    `,

    // Before → After を3つ
    change: (slide) => `
      <div class="facts-layout anim-el delay-2">
        <div class="fact-row">
          ${slide.changes.map(c => `
            <div class="fact-tile change-tile">
              <div class="change-from">${c.from}</div>
              <div class="change-arrow" aria-hidden="true">↓</div>
              <div class="fact-value">${c.to}</div>
            </div>
          `).join('')}
        </div>
        ${slide.quote ? `<blockquote class="big-quote story-quote">「${slide.quote}」</blockquote>` : ''}
        ${slide.message ? `<p class="slide-message">${slide.message}</p>` : ''}
      </div>
    `,

    // 一文だけ（上に小さな事実を並べられる）
    statement: (slide) => `
      <div class="statement-layout anim-el delay-2">
        ${slide.points ? `
          <ul class="point-chips">
            ${slide.points.map(p => `<li>${p}</li>`).join('')}
          </ul>
        ` : ''}
        <p class="statement-text">${slide.statement}</p>
        ${slide.lead ? `<p class="statement-lead">${slide.lead}</p>` : ''}
      </div>
    `,

    // 3ステップを矢印でつなぐ
    flow: (slide) => `
      <div class="facts-layout anim-el delay-2">
        <div class="flow-row">
          ${slide.steps.map((s, i) => `
            ${i > 0 ? '<div class="flow-arrow" aria-hidden="true">→</div>' : ''}
            <div class="fact-tile">
              <div class="fact-value">${s.value}</div>
              <div class="fact-label">${s.label}</div>
            </div>
          `).join('')}
        </div>
        ${slide.message ? `<p class="slide-message">${slide.message}</p>` : ''}
      </div>
    `,

    // ハードシングス：小さな数字＋「何が起きた／どう決めた／何を学んだ」の3行
    story: (slide) => `
      <div class="story-layout anim-el delay-2">
        ${slide.facts ? `
          <div class="fact-row fact-row-compact">
            ${slide.facts.map(f => `
              <div class="fact-tile">
                <div class="fact-value">${f.value}</div>
                <div class="fact-label">${f.label}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${slide.quote ? `<blockquote class="big-quote story-quote">「${slide.quote}」</blockquote>` : ''}
        <div class="story-rows">
          ${slide.rows.map(r => `
            <div class="story-row">
              <span class="story-label">${r.label}</span>
              <p>${r.text}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `,

    // 伝えたいこと2つ
    message: (slide) => `
      <div class="message-layout anim-el delay-2">
        <div class="message-grid" style="grid-template-columns: repeat(${slide.cards.length}, 1fr);">
          ${slide.cards.map(c => `
            <div class="glass-card glass-card-accent-amber message-card">
              <h3>${c.title}</h3>
              <p>${c.body}</p>
            </div>
          `).join('')}
        </div>
        ${slide.closing ? `<p class="slide-message">${slide.closing}</p>` : ''}
      </div>
    `,

    // 質問の例
    questions: (slide) => `
      <div class="question-grid anim-el delay-2">
        ${slide.questions.map(q => `<div class="question-chip">${q}</div>`).join('')}
      </div>
    `
  };

  // ==========================================
  // 2. SLIDE RENDERER
  // ==========================================

  function renderCover() {
    const c = meta.cover;
    return `
      <div class="light-sweep light-sweep-active"></div>
      <div class="landscape-picture-book-cover anim-el delay-1">
        <div class="picture-book-spine-left">
          <span class="spine-vertical-text">${meta.presenter.name}</span>
        </div>
        <div class="picture-book-ribbon"></div>
        <div class="book-cover-page">
          <div class="cover-crest">
            <img class="cover-logo" src="images/logo-Y_base.png" alt="デジタルプラス 人を不幸にしないための、デジタルと" width="300" height="55">
          </div>
          <div class="cover-title-group">
            <span class="cover-eyebrow">${c.eyebrow}</span>
            <h1 class="cover-main-title">${meta.title}</h1>
            <p class="cover-main-subtitle">${c.subtitle}</p>
          </div>
          <div class="cover-highlights-grid cover-highlights-3">
            ${c.highlights.map(h => `<div class="cover-tag-item"><span class="tag-bullet">✦</span> ${h}</div>`).join('')}
          </div>
          <div class="cover-author-footer">
            <div class="cover-author-info">
              <span class="author-name">${meta.presenter.name}</span>
              <span class="author-role">${c.authorRole}</span>
            </div>
            <button class="open-book-btn" onclick="window.goToSlide(1)">
              <span>はじめる</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderPage(slide, index) {
    const templateFn = templates[slide.type];
    const bodyContent = templateFn ? templateFn(slide) : '';
    return `
      <div class="light-sweep light-sweep-active"></div>
      <div class="landscape-picture-book anim-el delay-1">
        <div class="picture-book-spine-left">
          <span class="spine-vertical-text">${meta.presenter.name}</span>
        </div>
        <div class="picture-book-ribbon"></div>
        <div class="picture-book-page">
          <div class="picture-book-header">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="picture-book-chapter-num">${chapterLabel(index)}</span>
              <span class="picture-book-badge">${slide.badge}</span>
              ${slide.optional ? '<span class="optional-tag">時間があれば</span>' : ''}
            </div>
            <span class="running-header-title">${meta.runningTitle}</span>
          </div>
          <div class="page-heading">
            <h2 class="picture-book-title">${slide.title}</h2>
            ${slide.subtitle ? `<p class="picture-book-subtitle">${slide.subtitle}</p>` : ''}
          </div>
          <div class="picture-book-body">
            ${bodyContent}
          </div>
          <div class="picture-book-footer">
            <span>— ${chapterLabel(index)} —</span>
            <span>PAGE ${index} OF ${pageCount}</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderSlides() {
    container.innerHTML = '';
    slideIndexList.innerHTML = '';

    slidesData.forEach((slide, index) => {
      const slideEl = document.createElement('div');
      slideEl.className = `slide ${index === 0 ? 'active' : ''}`;
      slideEl.id = slide.id;
      slideEl.innerHTML = slide.type === 'cover' ? renderCover() : renderPage(slide, index);
      container.appendChild(slideEl);

      // Table of Contents Drawer Item
      const indexItem = document.createElement('div');
      indexItem.className = `index-item ${index === 0 ? 'active' : ''}`;
      indexItem.innerHTML = `
        <span class="index-roman">${index === 0 ? 'COVER' : ROMAN[index]}</span>
        <div class="index-info">
          <div class="index-badge">${slide.badge}${slide.optional ? '（時間があれば）' : ''}</div>
          <div class="index-title">${slide.title}</div>
        </div>
      `;
      indexItem.addEventListener('click', () => {
        goToSlide(index);
        closeDrawer();
      });
      slideIndexList.appendChild(indexItem);
    });

    const drawerHeading = document.getElementById('drawer-heading');
    if (drawerHeading) drawerHeading.textContent = `目次（全${pageCount}ページ）`;

    updateNavigation();
  }

  // ==========================================
  // 3. NAVIGATION CONTROLLER
  // ==========================================

  function goToSlide(index) {
    if (index < 0 || index >= slidesData.length) return;

    currentSlideIndex = index;
    const slides = container.querySelectorAll('.slide');
    slides.forEach((s, idx) => s.classList.toggle('active', idx === currentSlideIndex));

    updateNavigation();
  }

  function updateNavigation() {
    prevBtn.disabled = currentSlideIndex === 0;
    nextBtn.disabled = currentSlideIndex === slidesData.length - 1;

    currentNumDisplay.textContent = chapterLabel(currentSlideIndex);

    const progressPct = (currentSlideIndex / (slidesData.length - 1)) * 100;
    progressFill.style.width = `${progressPct}%`;
    updateTimelineAvatar(progressPct, currentSlideIndex);

    const drawerItems = slideIndexList.querySelectorAll('.index-item');
    drawerItems.forEach((item, idx) => item.classList.toggle('active', idx === currentSlideIndex));

    renderNotesPanel();
    broadcastState();
  }

  // ==========================================
  // 4. TIMELINE AVATAR
  // ==========================================

  const avatarContainer = document.getElementById('timeline-avatar');
  const avatarLabel = document.getElementById('avatar-label');

  function updateTimelineAvatar(pct, idx) {
    if (!avatarContainer) return;
    avatarContainer.style.left = `${pct}%`;
    if (avatarLabel) avatarLabel.textContent = slidesData[idx].stage || slidesData[idx].badge;
  }

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
  // 6. SPEAKER NOTES（話す用メモ）& PRESENTER WINDOW
  // ==========================================

  const notesPanel = document.getElementById('notes-panel');
  const notesToggleBtn = document.getElementById('notes-toggle-btn');
  const presenterBtn = document.getElementById('presenter-btn');

  function renderNotesPanel() {
    if (!notesPanel) return;
    const slide = slidesData[currentSlideIndex];
    const next = slidesData[currentSlideIndex + 1];
    notesPanel.innerHTML = `
      <div class="notes-panel-head">
        <span>話す用メモ：${slide.badge}${slide.optional ? '（時間があれば）' : ''}</span>
        <span class="notes-next">${next ? `次：${next.badge}${next.optional ? '（時間があれば）' : ''}` : '最後のページ'}</span>
      </div>
      <ul>${getNotes(slide).map(n => `<li>${n}</li>`).join('')}</ul>
    `;
  }

  function toggleNotes() {
    if (!notesPanel) return;
    const isOpen = notesPanel.classList.toggle('open');
    if (notesToggleBtn) notesToggleBtn.classList.toggle('active', isOpen);
  }

  function openPresenterWindow() {
    window.open(`${location.pathname}?presenter`, 'presenter-view', 'width=900,height=700');
  }

  if (notesToggleBtn) notesToggleBtn.addEventListener('click', toggleNotes);
  if (presenterBtn) presenterBtn.addEventListener('click', openPresenterWindow);

  function broadcastState() {
    if (!channel) return;
    channel.postMessage({
      type: 'state',
      index: currentSlideIndex,
      timer: formatTime(timerSeconds),
      timerRunning: isTimerRunning
    });
  }

  if (channel) {
    channel.addEventListener('message', (e) => {
      const msg = e.data || {};
      if (msg.type === 'hello') broadcastState();
      if (msg.type === 'go') goToSlide(msg.index);
      if (msg.type === 'timer-toggle') toggleTimer();
      if (msg.type === 'timer-reset') resetTimer();
    });
  }

  // ==========================================
  // 7. KEYBOARD SHORTCUTS
  // ==========================================

  document.addEventListener('keydown', (e) => {
    if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
      goToSlide(currentSlideIndex + 1);
    } else if (['ArrowLeft', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      goToSlide(currentSlideIndex - 1);
    } else if (e.key === 'Home') {
      goToSlide(0);
    } else if (e.key === 'End') {
      goToSlide(slidesData.length - 1);
    } else if (e.key.toLowerCase() === 'n') {
      toggleNotes();
    } else if (e.key.toLowerCase() === 'p') {
      openPresenterWindow();
    } else if (e.key === 'Escape') {
      closeDrawer();
      closeZoomModal();
    }
  });

  // ==========================================
  // 8. "DO A BARREL ROLL" EASTER EGG
  // ==========================================

  const brandLogo = document.getElementById('google-brand-logo');
  if (brandLogo) {
    brandLogo.addEventListener('click', () => {
      document.body.classList.add('barrel-roll');
      setTimeout(() => {
        document.body.classList.remove('barrel-roll');
      }, 1200);
    });
  }

  // ==========================================
  // 9. PRESENTATION COUNTDOWN TIMER
  // ==========================================

  const timerTotal = (meta.timerMinutes || 20) * 60;
  let timerSeconds = timerTotal;
  let timerInterval = null;
  let isTimerRunning = false;

  const timerDisplay = document.getElementById('timer-display');
  const timerToggle = document.getElementById('timer-toggle');
  const timerReset = document.getElementById('timer-reset');
  const playIcon = document.getElementById('timer-play-icon');
  const pauseIcon = document.getElementById('timer-pause-icon');

  function updateTimerDisplay() {
    if (timerDisplay) {
      timerDisplay.textContent = formatTime(timerSeconds);
      timerDisplay.classList.toggle('timer-warning', timerSeconds <= 300);
    }
    broadcastState();
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
    broadcastState();
  }

  function stopTimer() {
    isTimerRunning = false;
    if (timerInterval) clearInterval(timerInterval);
    if (playIcon) playIcon.style.display = 'inline';
    if (pauseIcon) pauseIcon.style.display = 'none';
    broadcastState();
  }

  function toggleTimer() {
    if (isTimerRunning) stopTimer();
    else startTimer();
  }

  function resetTimer() {
    stopTimer();
    timerSeconds = timerTotal;
    updateTimerDisplay();
  }

  if (timerToggle) timerToggle.addEventListener('click', toggleTimer);
  if (timerReset) timerReset.addEventListener('click', resetTimer);

  // ==========================================
  // 10. ZOOM MODAL（写真の拡大）
  // ==========================================

  const zoomModalEl = document.getElementById('zoom-modal');
  const zoomModalBody = document.getElementById('zoom-modal-body');
  const zoomCloseBtn = document.getElementById('zoom-close');

  window.zoomDaughter = function() {
    if (!zoomModalEl || !zoomModalBody) return;
    const p = meta.presenter;
    zoomModalBody.innerHTML = `
      <div style="text-align: center;">
        <span style="font-family: 'Cinzel', serif; font-size: 0.75rem; color: #B60005; font-weight: 800; letter-spacing: 0.12em;">MOST PRECIOUS MOTIVATION</span>
        <h3 style="font-size: 1.45rem; font-weight: 800; color: #231815; margin: 0.35rem 0 1.25rem 0;">${p.daughterName}ちゃん</h3>
        <div style="max-width: 440px; margin: 0 auto; border-radius: 14px; overflow: hidden; border: 1.5px solid rgba(182, 0, 5, 0.5); box-shadow: 0 15px 35px rgba(35, 24, 21, 0.14);">
          <img src="${p.daughterImg}" alt="${p.daughterName}" style="width: 100%; height: auto; display: block;">
        </div>
        <p style="font-size: 0.975rem; color: #3E3A39; margin-top: 1.25rem; font-weight: 500; line-height: 1.6;">
          娘に誇れる、明るい未来をこの手でつくる。それが、いまの原動力です。
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
}

/* ==========================================================================
   PRESENTER VIEW（千葉だけが見る画面：メモ・次のページ・タイマー）
   ========================================================================== */
function initPresenterView() {
  const slidesData = PRESENTATION_DATA.slides;
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_NAME) : null;
  let currentIndex = 0;

  document.title = `発表者メモ | ${PRESENTATION_DATA.meta.title}`;
  document.body.classList.add('presenter-mode');
  document.body.innerHTML = `
    <div class="presenter-view">
      <header class="presenter-top">
        <div>
          <span class="presenter-chapter" id="pv-chapter"></span>
          <h1 id="pv-title"></h1>
        </div>
        <div class="presenter-timer">
          <span id="pv-timer">--:--</span>
          <button id="pv-timer-toggle" class="presenter-btn">開始 / 停止</button>
          <button id="pv-timer-reset" class="presenter-btn">リセット</button>
        </div>
      </header>
      <ul class="presenter-notes" id="pv-notes"></ul>
      <footer class="presenter-bottom">
        <button id="pv-prev" class="presenter-btn">← 前へ</button>
        <span id="pv-next"></span>
        <button id="pv-next-btn" class="presenter-btn">次へ →</button>
      </footer>
      ${channel ? '' : '<p class="presenter-warning">このブラウザでは、スライド画面と連動できません。</p>'}
    </div>
  `;

  function render(index) {
    currentIndex = index;
    const slide = slidesData[index];
    const next = slidesData[index + 1];
    document.getElementById('pv-chapter').textContent =
      `${chapterLabel(index)}　${slide.badge}${slide.optional ? '（時間があれば）' : ''}`;
    document.getElementById('pv-title').textContent = slide.title;
    document.getElementById('pv-notes').innerHTML = getNotes(slide).map(n => `<li>${n}</li>`).join('');
    document.getElementById('pv-next').textContent = next
      ? `次：${next.badge}「${next.title}」${next.optional ? '（時間があれば）' : ''}`
      : '最後のページです';
  }

  function go(index) {
    if (index < 0 || index >= slidesData.length) return;
    if (channel) channel.postMessage({ type: 'go', index });
    else render(index);
  }

  document.getElementById('pv-prev').addEventListener('click', () => go(currentIndex - 1));
  document.getElementById('pv-next-btn').addEventListener('click', () => go(currentIndex + 1));
  document.getElementById('pv-timer-toggle').addEventListener('click', () => {
    if (channel) channel.postMessage({ type: 'timer-toggle' });
  });
  document.getElementById('pv-timer-reset').addEventListener('click', () => {
    if (channel) channel.postMessage({ type: 'timer-reset' });
  });

  document.addEventListener('keydown', (e) => {
    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
      go(currentIndex + 1);
    } else if (['ArrowLeft', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      go(currentIndex - 1);
    }
  });

  if (channel) {
    channel.addEventListener('message', (e) => {
      const msg = e.data || {};
      if (msg.type !== 'state') return;
      if (msg.index !== currentIndex || !document.getElementById('pv-title').textContent) render(msg.index);
      const timerEl = document.getElementById('pv-timer');
      timerEl.textContent = msg.timer;
      timerEl.classList.toggle('timer-running', msg.timerRunning);
    });
    channel.postMessage({ type: 'hello' });
  }

  render(0);
}
