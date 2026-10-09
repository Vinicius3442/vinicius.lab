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

    searchCounter.textContent = `${visibleCount} ${visibleCount === 1 ? 'projeto' : 'projetos'}`;

    if (visibleCount === 0) {
      noResultsMsg.style.display = 'block';
    } else {
      noResultsMsg.style.display = 'none';
    }
  }

  searchInput.addEventListener('input', updateFilter);

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-filter');
      updateFilter();
    });
  });

  clearSearchBtn?.addEventListener('click', () => {
    searchInput.value = '';
    currentCategory = 'all';
    filterPills.forEach((p) => p.classList.remove('active'));
    document.querySelector('.filter-pill[data-filter="all"]')?.classList.add('active');
    updateFilter();
  });

  // --- 2. BOTÃO DE PROJETO ALEATÓRIO ---
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
    } catch (e) {}
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
        playBeep(659, 'sine', 0.3);

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

  // --- 3. MICRO-SIMULAÇÃO NO CARD DE ORDENAÇÃO ---
  if (sortingBarsContainer) {
    const bars = sortingBarsContainer.querySelectorAll('.sort-bar');

    function shuffleAndSortBars() {
      const heights = Array.from({ length: bars.length }, () => Math.floor(Math.random() * 80) + 15);

      bars.forEach((bar, i) => {
        bar.style.height = `${heights[i]}%`;
      });

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
    setInterval(shuffleAndSortBars, 6000);
  }

  // --- 4. ROBÔ CYBERDEFENDER (OLHOS QUE SEGUEM O MOUSE E PISCAM) ---
  const cyberCanvas = document.getElementById('cyber-robot-canvas');
  if (cyberCanvas) {
    const ctx = cyberCanvas.getContext('2d');
    let eyeTargetX = 0;
    let eyeTargetY = 0;
    let currentEyeX = 0;
    let currentEyeY = 0;
    let blinkTimer = 0;

    function resizeCyberCanvas() {
      const rect = cyberCanvas.parentElement.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        cyberCanvas.width = rect.width;
        cyberCanvas.height = rect.height;
      }
    }

    resizeCyberCanvas();
    window.addEventListener('resize', resizeCyberCanvas);

    window.addEventListener('mousemove', (e) => {
      const rect = cyberCanvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = (e.clientX - cx) / Math.max(300, window.innerWidth / 3);
      const dy = (e.clientY - cy) / Math.max(200, window.innerHeight / 3);

      eyeTargetX = Math.max(-1, Math.min(1, dx));
      eyeTargetY = Math.max(-1, Math.min(1, dy));
    });

    document.addEventListener('mouseleave', () => {
      eyeTargetX = 0;
      eyeTargetY = 0;
    });

    function drawRobotFace() {
      requestAnimationFrame(drawRobotFace);

      const w = cyberCanvas.width;
      const h = cyberCanvas.height;
      if (w === 0 || h === 0) return;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      if (Math.random() < 0.012 && blinkTimer <= 0) {
        blinkTimer = 10;
      }
      if (blinkTimer > 0) {
        blinkTimer--;
      }

      currentEyeX += (eyeTargetX - currentEyeX) * 0.12;
      currentEyeY += (eyeTargetY - currentEyeY) * 0.12;

      const baseEyeW = 44;
      const baseEyeH = 44;
      const eyeH = blinkTimer > 0 ? 4 : baseEyeH;

      const offsetX = currentEyeX * 16;
      const offsetY = currentEyeY * 12;

      const centerY = h / 2 - 2;
      const centerX = w / 2;

      ctx.fillStyle = '#4af626';
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#4af626';

      const leftEyeX = centerX - 58 + offsetX;
      const eyeY = centerY - baseEyeH / 2 + offsetY + (baseEyeH - eyeH) / 2;
      ctx.fillRect(leftEyeX, eyeY, baseEyeW, eyeH);

      const rightEyeX = centerX + 14 + offsetX;
      ctx.fillRect(rightEyeX, eyeY, baseEyeW, eyeH);

      ctx.shadowBlur = 0;
    }

    drawRobotFace();
  }

  // ============================================================
  // --- 5. DEEP BLUE CANVAS — OCEAN ANIMADO COM PEIXES E BIOLUMINESCÊNCIA ---
  // ============================================================
  const deepblueCanvas = document.getElementById('deepblue-canvas');
  if (deepblueCanvas) {
    const dbCtx = deepblueCanvas.getContext('2d');
    const depthDisplay = document.getElementById('depth-display');
    let dbAnimFrame;

    function resizeDeepblue() {
      const rect = deepblueCanvas.parentElement.getBoundingClientRect();
      deepblueCanvas.width = rect.width || 400;
      deepblueCanvas.height = rect.height || 200;
    }

    resizeDeepblue();
    window.addEventListener('resize', () => { resizeDeepblue(); });

    // Peixes
    const fishes = Array.from({ length: 7 }, (_, i) => ({
      x: Math.random() * 400,
      y: 40 + Math.random() * 130,
      speed: 0.4 + Math.random() * 0.6,
      size: 6 + Math.random() * 10,
      dir: Math.random() > 0.5 ? 1 : -1,
      wobble: Math.random() * Math.PI * 2,
      color: `hsl(${190 + Math.random() * 40}, 70%, ${55 + Math.random() * 25}%)`,
      depth: Math.random(),
    }));

    // Bolhas
    const bubbles = Array.from({ length: 18 }, () => ({
      x: Math.random(),
      y: 1 + Math.random() * 0.3,
      r: 1.5 + Math.random() * 3.5,
      speed: 0.0004 + Math.random() * 0.0006,
      wobble: Math.random() * Math.PI * 2,
      opacity: 0.2 + Math.random() * 0.5,
    }));

    // Partículas de bioluminescência
    const bioParticles = Array.from({ length: 22 }, () => ({
      x: Math.random(),
      y: 0.35 + Math.random() * 0.65,
      r: 1 + Math.random() * 2.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.015,
      color: Math.random() > 0.5 ? '#00ffcc' : '#4fc3f7',
    }));

    let tick = 0;

    function drawDeepBlue() {
      dbAnimFrame = requestAnimationFrame(drawDeepBlue);
      const w = deepblueCanvas.width;
      const h = deepblueCanvas.height;
      if (w === 0 || h === 0) return;

      tick += 0.018;

      // Fundo — gradiente oceânico profundo
      const grad = dbCtx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0077b6');
      grad.addColorStop(0.25, '#023e8a');
      grad.addColorStop(0.6, '#03045e');
      grad.addColorStop(1, '#000814');
      dbCtx.fillStyle = grad;
      dbCtx.fillRect(0, 0, w, h);

      // Raios de luz na superfície
      dbCtx.save();
      for (let i = 0; i < 5; i++) {
        const rayX = (w * (i + 0.5)) / 5 + Math.sin(tick * 0.5 + i) * 20;
        const rayGrad = dbCtx.createLinearGradient(rayX, 0, rayX + 30, h * 0.55);
        rayGrad.addColorStop(0, 'rgba(144, 224, 239, 0.18)');
        rayGrad.addColorStop(1, 'rgba(0, 119, 182, 0)');
        dbCtx.fillStyle = rayGrad;
        dbCtx.beginPath();
        dbCtx.moveTo(rayX, 0);
        dbCtx.lineTo(rayX + 25, h * 0.55);
        dbCtx.lineTo(rayX - 5, h * 0.55);
        dbCtx.closePath();
        dbCtx.fill();
      }
      dbCtx.restore();

      // Bolhas
      bubbles.forEach(b => {
        b.y -= b.speed;
        b.wobble += 0.03;
        if (b.y < -0.05) { b.y = 1.05; b.x = Math.random(); }
        const bx = b.x * w + Math.sin(b.wobble) * 6;
        const by = b.y * h;
        dbCtx.beginPath();
        dbCtx.arc(bx, by, b.r, 0, Math.PI * 2);
        dbCtx.strokeStyle = `rgba(144, 224, 239, ${b.opacity})`;
        dbCtx.lineWidth = 1;
        dbCtx.stroke();
        // Brilho interno
        dbCtx.beginPath();
        dbCtx.arc(bx - b.r * 0.3, by - b.r * 0.3, b.r * 0.35, 0, Math.PI * 2);
        dbCtx.fillStyle = `rgba(255,255,255,${b.opacity * 0.5})`;
        dbCtx.fill();
      });

      // Bioluminescência
      bioParticles.forEach(p => {
        p.phase += p.speed;
        const alpha = (Math.sin(p.phase) * 0.5 + 0.5) * 0.85;
        const px = p.x * w;
        const py = p.y * h;
        const glow = dbCtx.createRadialGradient(px, py, 0, px, py, p.r * 3.5);
        glow.addColorStop(0, p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba'));
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        dbCtx.fillStyle = glow;
        dbCtx.beginPath();
        dbCtx.arc(px, py, p.r * 3.5, 0, Math.PI * 2);
        dbCtx.fill();
        // Núcleo brilhante
        dbCtx.beginPath();
        dbCtx.arc(px, py, p.r, 0, Math.PI * 2);
        dbCtx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
        dbCtx.fill();
      });

      // Peixes
      fishes.forEach(f => {
        f.x += f.speed * f.dir;
        f.wobble += 0.08;
        if (f.x > w + 40) f.x = -40;
        if (f.x < -40) f.x = w + 40;

        const fy = f.y + Math.sin(f.wobble * 0.6) * 3;
        const alpha = 0.55 + f.depth * 0.45;

        dbCtx.save();
        dbCtx.globalAlpha = alpha;
        dbCtx.translate(f.x, fy);
        if (f.dir < 0) dbCtx.scale(-1, 1);

        // Corpo do peixe
        dbCtx.beginPath();
        dbCtx.ellipse(0, 0, f.size, f.size * 0.45, 0, 0, Math.PI * 2);
        dbCtx.fillStyle = f.color;
        dbCtx.fill();

        // Cauda
        dbCtx.beginPath();
        dbCtx.moveTo(-f.size * 0.85, 0);
        dbCtx.lineTo(-f.size * 1.5, -f.size * 0.5 + Math.sin(f.wobble) * 2);
        dbCtx.lineTo(-f.size * 1.5, f.size * 0.5 + Math.sin(f.wobble) * 2);
        dbCtx.closePath();
        dbCtx.fillStyle = f.color;
        dbCtx.fill();

        // Olhinho
        dbCtx.beginPath();
        dbCtx.arc(f.size * 0.5, -f.size * 0.08, f.size * 0.12, 0, Math.PI * 2);
        dbCtx.fillStyle = '#000';
        dbCtx.fill();

        dbCtx.restore();
      });

      // Profundidade animada (display do depth-gauge)
      if (depthDisplay) {
        const depthM = Math.round(40 + Math.sin(tick * 0.15) * 20 + tick * 8) % 11000;
        depthDisplay.textContent = `${depthM.toLocaleString('pt-BR')}m`;
      }
    }

    drawDeepBlue();
  }

  // ============================================================
  // --- 6. NEURAL CANVAS — REDE NEURAL COM NÓS PISCANDO E DADOS ---
  // ============================================================
  const neuralCanvas = document.getElementById('neural-canvas');
  if (neuralCanvas) {
    const nc = neuralCanvas.getContext('2d');

    function resizeNeural() {
      const rect = neuralCanvas.parentElement.getBoundingClientRect();
      neuralCanvas.width = rect.width || 400;
      neuralCanvas.height = rect.height || 200;
    }

    resizeNeural();
    window.addEventListener('resize', resizeNeural);

    // Definição da rede: 3 camadas [entrada, oculta, saída]
    const layers = [
      [{ x: 0.12, y: 0.25 }, { x: 0.12, y: 0.5 }, { x: 0.12, y: 0.75 }],
      [{ x: 0.42, y: 0.2 }, { x: 0.42, y: 0.42 }, { x: 0.42, y: 0.65 }, { x: 0.42, y: 0.85 }],
      [{ x: 0.75, y: 0.35 }, { x: 0.75, y: 0.65 }],
    ];

    // Estado de ativação de cada nó
    const nodeState = layers.map(layer => layer.map(() => ({
      activation: 0,
      phase: Math.random() * Math.PI * 2,
      data: (Math.random() * 2 - 1).toFixed(2),
      pulsing: false,
      pulseTimer: 0,
    })));

    // Fase de propagação: a cada ciclo, os nós de entrada "piscam" e enviam sinal
    let propagationPhase = 0; // 0=entrada, 1=oculta, 2=saída
    let propagationTimer = 0;
    const PHASE_DURATION = 55; // frames por fase

    // Partículas viajando nas conexões
    const signalParticles = [];

    let neuralTick = 0;

    function fireSignals(fromLayer, toLayer) {
      layers[fromLayer].forEach((fromNode, fi) => {
        layers[toLayer].forEach((toNode, ti) => {
          signalParticles.push({
            fromLayer, fi, toLayer, ti,
            progress: 0,
            speed: 0.025 + Math.random() * 0.02,
            strength: 0.4 + Math.random() * 0.6,
            color: fromLayer === 0 ? '#58a6ff' : fromLayer === 1 ? '#ffcc00' : '#00ff41',
          });
        });
      });
    }

    function drawNeural() {
      requestAnimationFrame(drawNeural);
      const w = neuralCanvas.width;
      const h = neuralCanvas.height;
      if (w === 0 || h === 0) return;

      neuralTick++;
      propagationTimer++;

      // Avança a fase de propagação
      if (propagationTimer >= PHASE_DURATION) {
        propagationTimer = 0;
        // Atualiza dados dos nós da camada atual
        layers[propagationPhase].forEach((_, i) => {
          nodeState[propagationPhase][i].pulsing = true;
          nodeState[propagationPhase][i].pulseTimer = 20;
          nodeState[propagationPhase][i].data = (Math.random() * 2 - 1).toFixed(2);
        });
        // Dispara partículas para a próxima camada
        if (propagationPhase < layers.length - 1) {
          fireSignals(propagationPhase, propagationPhase + 1);
        }
        propagationPhase = (propagationPhase + 1) % layers.length;
      }

      // Atualiza timers dos nós
      layers.forEach((layer, li) => {
        layer.forEach((_, ni) => {
          const state = nodeState[li][ni];
          state.phase += 0.04;
          if (state.pulseTimer > 0) state.pulseTimer--;
          else state.pulsing = false;
        });
      });

      // Fundo
      nc.fillStyle = '#0d1117';
      nc.fillRect(0, 0, w, h);

      // Grade
      nc.strokeStyle = 'rgba(48, 54, 61, 0.4)';
      nc.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < w; x += gridSize) {
        nc.beginPath(); nc.moveTo(x, 0); nc.lineTo(x, h); nc.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        nc.beginPath(); nc.moveTo(0, y); nc.lineTo(w, y); nc.stroke();
      }

      // Conexões (sinapses)
      for (let li = 0; li < layers.length - 1; li++) {
        layers[li].forEach((fromNode, fi) => {
          layers[li + 1].forEach((toNode, ti) => {
            const fx = fromNode.x * w, fy = fromNode.y * h;
            const tx = toNode.x * w, ty = toNode.y * h;
            nc.beginPath();
            nc.moveTo(fx, fy);
            nc.lineTo(tx, ty);
            nc.strokeStyle = 'rgba(88, 166, 255, 0.15)';
            nc.lineWidth = 1;
            nc.stroke();
          });
        });
      }

      // Partículas viajando nas conexões
      for (let i = signalParticles.length - 1; i >= 0; i--) {
        const p = signalParticles[i];
        p.progress += p.speed;
        if (p.progress >= 1) {
          // Ativa o nó de destino
          nodeState[p.toLayer][p.ti].pulsing = true;
          nodeState[p.toLayer][p.ti].pulseTimer = 15;
          signalParticles.splice(i, 1);
          continue;
        }

        const fromNode = layers[p.fromLayer][p.fi];
        const toNode = layers[p.toLayer][p.ti];
        const px = (fromNode.x + (toNode.x - fromNode.x) * p.progress) * w;
        const py = (fromNode.y + (toNode.y - fromNode.y) * p.progress) * h;

        nc.beginPath();
        nc.arc(px, py, 2.5, 0, Math.PI * 2);
        nc.fillStyle = p.color;
        nc.shadowBlur = 8;
        nc.shadowColor = p.color;
        nc.fill();
        nc.shadowBlur = 0;
      }

      // Nós neurais
      layers.forEach((layer, li) => {
        layer.forEach((node, ni) => {
          const nx = node.x * w;
          const ny = node.y * h;
          const state = nodeState[li][ni];
          const glow = state.pulsing ? state.pulseTimer / 20 : (Math.sin(state.phase) * 0.5 + 0.5) * 0.3;

          let fillColor, strokeColor, radius;
          if (li === 0) { fillColor = '#0d1f3c'; strokeColor = '#58a6ff'; radius = 7; }
          else if (li === 1) { fillColor = '#1c1800'; strokeColor = '#ffcc00'; radius = 9; }
          else { fillColor = '#001a00'; strokeColor = '#00ff41'; radius = 10; }

          // Halo de brilho
          if (glow > 0.05) {
            nc.beginPath();
            nc.arc(nx, ny, radius + 8, 0, Math.PI * 2);
            nc.fillStyle = strokeColor.replace('#', 'rgba(') + `, ${glow * 0.4})`;
            // Fallback para o glow
            const glowGrad = nc.createRadialGradient(nx, ny, radius, nx, ny, radius + 10);
            glowGrad.addColorStop(0, strokeColor + Math.round(glow * 255).toString(16).padStart(2, '0'));
            glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
            nc.fillStyle = glowGrad;
            nc.fill();
          }

          // Corpo do nó
          nc.beginPath();
          nc.arc(nx, ny, radius, 0, Math.PI * 2);
          nc.fillStyle = state.pulsing ? strokeColor : fillColor;
          nc.fill();
          nc.strokeStyle = strokeColor;
          nc.lineWidth = 2;
          nc.shadowBlur = state.pulsing ? 14 : 4;
          nc.shadowColor = strokeColor;
          nc.stroke();
          nc.shadowBlur = 0;

          // Dados numéricos nos nós de entrada
          if (li === 0) {
            nc.font = `bold 7px 'JetBrains Mono', monospace`;
            nc.fillStyle = state.pulsing ? '#fff' : '#58a6ff';
            nc.textAlign = 'center';
            nc.fillText(state.data, nx, ny + 2.5);
          }
        });
      });

      // Label de geração animada
      const gen = 184 + Math.floor(neuralTick / 120);
      const genEl = document.getElementById('gen-counter-live');
      if (genEl) genEl.textContent = gen;
    }

    drawNeural();
  }

  // ============================================================
  // --- 7. BLACK HOLE CANVAS — SIMULAÇÃO DE LENTE GRAVITACIONAL ---
  // ============================================================
  const bhCanvas = document.getElementById('blackhole-canvas');
  if (bhCanvas) {
    const bhCtx = bhCanvas.getContext('2d');
    let bhTick = 0;

    function resizeBH() {
      const rect = bhCanvas.parentElement.getBoundingClientRect();
      bhCanvas.width = rect.width || 400;
      bhCanvas.height = rect.height || 200;
    }

    resizeBH();
    window.addEventListener('resize', resizeBH);

    // Estrelas de fundo
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 1.8,
      brightness: 0.4 + Math.random() * 0.6,
      twinkle: Math.random() * Math.PI * 2,
    }));

    // Partículas do disco de acreção
    const accretionParticles = Array.from({ length: 120 }, (_, i) => ({
      angle: (i / 120) * Math.PI * 2,
      radiusFactor: 0.8 + Math.random() * 0.8,
      speed: 0.012 + Math.random() * 0.018,
      opacity: 0.5 + Math.random() * 0.5,
      size: 1 + Math.random() * 2.5,
      hue: 20 + Math.random() * 40, // laranja-vermelho
    }));

    function drawBlackHole() {
      requestAnimationFrame(drawBlackHole);
      const w = bhCanvas.width;
      const h = bhCanvas.height;
      if (w === 0 || h === 0) return;

      bhTick += 0.016;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const bhRadius = Math.min(w, h) * 0.11;
      const discInnerR = bhRadius * 1.35;
      const discOuterR = bhRadius * 3.2;

      // Limpa com espaço preto
      bhCtx.fillStyle = '#000005';
      bhCtx.fillRect(0, 0, w, h);

      // Estrelas (distorção gravitacional simulada)
      stars.forEach(s => {
        s.twinkle += 0.025;
        const sx = s.x * w;
        const sy = s.y * h;
        const dx = sx - cx;
        const dy = sy - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const gravEffect = Math.max(0, 1 - (bhRadius * 3.5) / Math.max(dist, 1));

        if (dist < bhRadius * 1.1) return; // dentro do horizonte

        // Posição distorcida pela gravidade
        const warpFactor = dist < discOuterR * 1.3 ? (1 - gravEffect) * 0.18 : 0;
        const warpX = sx + (cx - sx) * warpFactor;
        const warpY = sy + (cy - sy) * warpFactor;

        const alpha = s.brightness * gravEffect * (0.7 + Math.sin(s.twinkle) * 0.3);
        bhCtx.beginPath();
        bhCtx.arc(warpX, warpY, s.r * gravEffect, 0, Math.PI * 2);
        bhCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        bhCtx.fill();
      });

      // Disco de acreção — parte de trás (abaixo do buraco negro)
      bhCtx.save();
      bhCtx.globalCompositeOperation = 'lighter';
      accretionParticles.forEach(p => {
        if (p.angle > Math.PI * 0.1 && p.angle < Math.PI * 0.9) return; // frente
        p.angle += p.speed;
        const r = (discInnerR + (discOuterR - discInnerR) * p.radiusFactor * 0.5);
        const px = cx + Math.cos(p.angle) * r;
        const py = cy + Math.sin(p.angle) * r * 0.28;

        const grd = bhCtx.createRadialGradient(px, py, 0, px, py, p.size * 2.5);
        grd.addColorStop(0, `hsla(${p.hue}, 100%, 75%, ${p.opacity * 0.6})`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        bhCtx.fillStyle = grd;
        bhCtx.beginPath();
        bhCtx.arc(px, py, p.size * 2.5, 0, Math.PI * 2);
        bhCtx.fill();
      });
      bhCtx.restore();

      // Buraco negro (horizonte de eventos)
      const bhGrad = bhCtx.createRadialGradient(cx, cy, 0, cx, cy, bhRadius * 2.2);
      bhGrad.addColorStop(0, '#000');
      bhGrad.addColorStop(0.7, '#000');
      bhGrad.addColorStop(0.85, 'rgba(0,0,0,0.9)');
      bhGrad.addColorStop(1, 'rgba(0,0,0,0)');
      bhCtx.beginPath();
      bhCtx.arc(cx, cy, bhRadius * 2.2, 0, Math.PI * 2);
      bhCtx.fillStyle = bhGrad;
      bhCtx.fill();

      // Halo do horizonte de eventos
      const haloGrad = bhCtx.createRadialGradient(cx, cy, bhRadius * 0.9, cx, cy, bhRadius * 1.7);
      haloGrad.addColorStop(0, 'rgba(255, 120, 0, 0.85)');
      haloGrad.addColorStop(0.5, 'rgba(255, 60, 0, 0.3)');
      haloGrad.addColorStop(1, 'rgba(0,0,0,0)');
      bhCtx.beginPath();
      bhCtx.arc(cx, cy, bhRadius * 1.7, 0, Math.PI * 2);
      bhCtx.fillStyle = haloGrad;
      bhCtx.fill();

      // Núcleo negro absoluto
      bhCtx.beginPath();
      bhCtx.arc(cx, cy, bhRadius, 0, Math.PI * 2);
      bhCtx.fillStyle = '#000000';
      bhCtx.fill();

      // Disco de acreção — parte da frente (acima do buraco negro)
      bhCtx.save();
      bhCtx.globalCompositeOperation = 'lighter';
      accretionParticles.forEach(p => {
        if (!(p.angle > Math.PI * 0.1 && p.angle < Math.PI * 0.9)) return;
        p.angle += p.speed;
        const r = (discInnerR + (discOuterR - discInnerR) * p.radiusFactor * 0.5);
        const px = cx + Math.cos(p.angle) * r;
        const py = cy + Math.sin(p.angle) * r * 0.28;

        const grd = bhCtx.createRadialGradient(px, py, 0, px, py, p.size * 3);
        grd.addColorStop(0, `hsla(${p.hue}, 100%, 80%, ${p.opacity})`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        bhCtx.fillStyle = grd;
        bhCtx.beginPath();
        bhCtx.arc(px, py, p.size * 3, 0, Math.PI * 2);
        bhCtx.fill();
      });
      bhCtx.restore();

      // Texto de label
      bhCtx.font = `bold 9px 'JetBrains Mono', monospace`;
      bhCtx.fillStyle = 'rgba(200, 150, 255, 0.75)';
      bhCtx.textAlign = 'right';
      bhCtx.fillText('SCHWARZSCHILD r=2GM/c²', w - 10, h - 10);
    }

    drawBlackHole();
  }
});
