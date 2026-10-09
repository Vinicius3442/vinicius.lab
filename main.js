// ==========================================================================
// VINICIUS.LAB — INTERATIVIDADE (ESTILO NEAL.FUN)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('project-search');
  const searchCounter = document.getElementById('search-counter');
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');
  const noResultsMsg = document.getElementById('no-results');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const randomBtn = document.getElementById('random-btn');
  const sortingBarsContainer = document.getElementById('sorting-bars-container');

  let currentCategory = 'all';

  // --- 1. FILTRAGEM E BUSCA ---
  function updateFilter() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const category = card.getAttribute('data-category');
      const tags = card.getAttribute('data-tags') || '';
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.card-description')?.textContent.toLowerCase() || '';

      const matchesCategory = (currentCategory === 'all' || category === currentCategory);
      const matchesSearch = !query || title.includes(query) || desc.includes(query) || tags.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Contador
    searchCounter.textContent = `${visibleCount} ${visibleCount === 1 ? 'projeto' : 'projetos'}`;

    // Mensagem de nenhum resultado
    if (visibleCount === 0) {
      noResultsMsg.style.display = 'block';
    } else {
      noResultsMsg.style.display = 'none';
    }
  }

  // Evento da barra de busca
  searchInput.addEventListener('input', updateFilter);

  // Evento das pílulas de categoria
  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-filter');
      updateFilter();
    });
  });

  // Limpar busca
  clearSearchBtn?.addEventListener('click', () => {
    searchInput.value = '';
    currentCategory = 'all';
    filterPills.forEach((p) => p.classList.remove('active'));
    document.querySelector('.filter-pill[data-filter="all"]')?.classList.add('active');
    updateFilter();
  });

  // --- 2. BOTÃO DE PROJETO ALEATÓRIO COM ANIMAÇÃO LÚDICA ---
  // Sintetizador de áudio procedural simples usando Web Audio API
  function playBeep(freq = 440, type = 'sine', duration = 0.08) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignora bloqueios de áudio do navegador
    }
  }

  randomBtn.addEventListener('click', () => {
    const cards = Array.from(projectCards);
    if (cards.length === 0) return;

    randomBtn.disabled = true;
    randomBtn.style.opacity = '0.7';

    let spins = 0;
    const maxSpins = 12;
    let selectedIdx = 0;

    const interval = setInterval(() => {
      cards.forEach((c) => c.style.transform = '');
      selectedIdx = (selectedIdx + 1) % cards.length;
      const targetCard = cards[selectedIdx];
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetCard.style.transform = 'translateY(-10px) scale(1.02)';
      targetCard.style.borderColor = '#ff3366';

      playBeep(300 + spins * 35, 'triangle', 0.05);

      spins++;
      if (spins >= maxSpins) {
        clearInterval(interval);
        playBeep(659, 'sine', 0.3); // Nota de celebração

        setTimeout(() => {
          targetCard.style.borderColor = '';
          const targetUrl = targetCard.getAttribute('data-url');
          if (targetUrl) {
            window.open(targetUrl, '_blank');
          }
          randomBtn.disabled = false;
          randomBtn.style.opacity = '1';
        }, 500);
      }
    }, 120);
  });

  // --- 3. MICRO-SIMULAÇÃO DINÂMICA NO CARD DE ORDENAÇÃO ---
  if (sortingBarsContainer) {
    const bars = sortingBarsContainer.querySelectorAll('.sort-bar');
    
    function shuffleAndSortBars() {
      // Gera novas alturas
      const heights = Array.from({ length: bars.length }, () => Math.floor(Math.random() * 80) + 15);
      
      // Aplica alturas embaralhadas
      bars.forEach((bar, i) => {
        bar.style.height = `${heights[i]}%`;
      });

      // Após 600ms, ordena visualmente
      setTimeout(() => {
        heights.sort((a, b) => a - b);
        bars.forEach((bar, i) => {
          setTimeout(() => {
            bar.style.height = `${heights[i]}%`;
          }, i * 40);
        });
      }, 700);
    }

    const sortingCard = document.querySelector('.card-sorting');
    sortingCard?.addEventListener('mouseenter', shuffleAndSortBars);

    // Dispara a cada 6 segundos automaticamente
    setInterval(shuffleAndSortBars, 6000);
  }
});
