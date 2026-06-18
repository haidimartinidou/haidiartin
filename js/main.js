// Site interactions. No dependencies.
(function () {
  // 1. Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // 2. Footer year
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // 3. Gallery slots whose image file isn't added yet -> styled placeholder
  document.querySelectorAll(".frame img").forEach((img) => {
    const flag = () => { const f = img.closest(".frame"); if (f) f.classList.add("missing"); };
    img.addEventListener("error", flag);
    if (img.complete && img.naturalWidth === 0) flag();
  });

  // 4. Lightbox: click a loaded gallery image to view it full-screen, with prev/next
  const thumbs = Array.from(document.querySelectorAll(".frame:not(.cover) .pic img"));
  if (thumbs.length) {
    const box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Image viewer");
    box.innerHTML =
      '<button class="lb-close" aria-label="Close">✕</button>' +
      '<button class="lb-prev" aria-label="Previous">‹</button>' +
      '<img alt="" />' +
      '<button class="lb-next" aria-label="Next">›</button>' +
      '<p class="lb-cap"></p>';
    document.body.appendChild(box);
    const lbImg = box.querySelector("img");
    const lbCap = box.querySelector(".lb-cap");
    let idx = 0;

    const items = () => thumbs.filter((t) => !t.closest(".frame").classList.contains("missing"));

    const show = (i) => {
      const list = items();
      if (!list.length) return;
      idx = (i + list.length) % list.length;
      const img = list[idx];
      lbImg.src = img.src;
      const cap = img.closest(".frame").querySelector("figcaption");
      lbCap.textContent = cap ? cap.textContent.trim() : "";
    };
    const open = (img) => {
      const list = items();
      const i = list.indexOf(img);
      if (i < 0) return;
      show(i);
      box.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    const close = () => { box.classList.remove("open"); document.body.style.overflow = ""; };

    thumbs.forEach((img) => img.addEventListener("click", () => open(img)));
    box.querySelector(".lb-close").addEventListener("click", close);
    box.querySelector(".lb-prev").addEventListener("click", (e) => { e.stopPropagation(); show(idx - 1); });
    box.querySelector(".lb-next").addEventListener("click", (e) => { e.stopPropagation(); show(idx + 1); });
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(idx - 1);
      else if (e.key === "ArrowRight") show(idx + 1);
    });
  }
})();

// Floating Figs: drifting hand-drawn objects (figs, lemons, spoons, chillies),
// ported from @chadeaux_'s Claude Design mock. They wander gently and bounce off
// the page edges. Loose, colourful, like the iPad sketches.
(function () {
  const SVG = {
    fig:
      '<svg viewBox="0 0 100 100" fill="none" style="width:100%;height:100%;display:block;overflow:visible;filter:drop-shadow(2px 5px 4px rgba(40,35,20,0.16));">' +
      '<path d="M50 18 C50 12 51 8 54 5" stroke="#6b5a2a" stroke-width="3.6" stroke-linecap="round"></path>' +
      '<path d="M54 6 C60 2 67 5 67 11 C61 12 56 11 54 6 Z" fill="#5e7a30" stroke="#2e2a16" stroke-width="2.2" stroke-linejoin="round"></path>' +
      '<path d="M50 18 C43 18 40 24 38 31 C26 39 21 54 27 67 C31 77 40 85 50 87 C60 85 69 77 73 67 C79 54 74 39 62 31 C60 24 57 18 50 18 Z" fill="var(--skin)" stroke="#2e2a16" stroke-width="3.2" stroke-linejoin="round"></path>' +
      '<path d="M38 31 C44 28 56 28 62 31 C60 39 57 43 50 43 C43 43 40 39 38 31 Z" fill="var(--shoulder)" opacity="0.92"></path>' +
      '<path d="M42 40 C38 53 40 67 47 81 M58 40 C62 53 60 67 53 81 M50 43 C50 57 50 71 50 83" stroke="var(--rib)" stroke-width="2.3" stroke-linecap="round" opacity="0.6"></path>' +
      '<path d="M34 45 C31 53 32 61 36 68" stroke="rgba(255,255,255,0.42)" stroke-width="3" stroke-linecap="round"></path>' +
      '<circle cx="50" cy="85.5" r="2.1" fill="#2e2a16" opacity="0.5"></circle></svg>',
    lemon:
      '<svg viewBox="0 0 100 88" fill="none" style="width:100%;height:100%;display:block;overflow:visible;filter:drop-shadow(2px 5px 4px rgba(40,35,20,0.16));">' +
      '<g transform="rotate(-15 50 50)">' +
      '<path d="M56 26 C64 16 80 11 94 16 C88 27 73 33 60 31 C58 30 56 28 56 26 Z" fill="#4f7a35"></path>' +
      '<path d="M60 31 C68 26 81 27 90 33 C81 37 69 36 61 32 Z" fill="#5e8c3e"></path>' +
      '<path d="M56 27 C55 22 54 18 52 15" stroke="#6b5a2a" stroke-width="2.6" stroke-linecap="round"></path>' +
      '<path d="M10 50 C10 46 13 44 17 45 C19 38 30 30 50 30 C72 30 88 40 90 48 C92 50 93 50 95 51 C93 53 92 53 90 55 C86 63 71 71 50 71 C30 71 19 61 17 55 C13 56 10 54 10 50 Z" fill="#f1c12c" stroke="#cf9a22" stroke-width="1.4" stroke-linejoin="round"></path>' +
      '<path d="M22 60 C36 69 66 69 84 58 C70 67 38 69 22 60 Z" fill="#cf9a2c" opacity="0.55"></path>' +
      '<ellipse cx="40" cy="43" rx="13" ry="6.5" fill="#fdf2c0" opacity="0.9"></ellipse>' +
      '<ellipse cx="28" cy="50" rx="5" ry="3" fill="#fdf2c0" opacity="0.75"></ellipse>' +
      '<circle cx="52" cy="55" r="1.3" fill="#bd8418"></circle><circle cx="60" cy="50" r="1.2" fill="#bd8418"></circle>' +
      '<circle cx="45" cy="58" r="1.1" fill="#bd8418"></circle><circle cx="68" cy="56" r="1.2" fill="#bd8418"></circle>' +
      '</g></svg>',
    spoon:
      '<svg viewBox="0 0 40 116" fill="none" style="width:100%;height:100%;display:block;overflow:visible;filter:drop-shadow(1.5px 4px 3px rgba(40,35,20,0.16));">' +
      '<path d="M20 114 C11 114 7 105 7 96 C7 87 13 81 20 81 C27 81 33 87 33 96 C33 105 29 114 20 114 Z" fill="#fbf8ef" stroke="#23201a" stroke-width="2.2" stroke-linejoin="round"></path>' +
      '<path d="M20 109 C13 109 10 102 10 96 C10 89 14 85 20 85 C26 85 30 89 30 96 C30 102 27 109 20 109 Z" fill="none" stroke="#23201a" stroke-width="1.1"></path>' +
      '<path d="M17 82 C16 73 16 66 16 59 C11 56 11 49 16 47 C11 44 11 36 17 34 C13 31 14 22 20 20 C26 22 27 31 23 34 C29 36 29 44 24 47 C29 49 29 56 24 59 C24 66 24 73 23 82 Z" fill="#23201a"></path>' +
      '<path d="M20 20 C16 16 16 9 20 6 C24 9 24 16 20 20 Z" fill="#23201a"></path>' +
      '<circle cx="20" cy="40.5" r="2.1" fill="#fbf8ef"></circle><circle cx="20" cy="52.5" r="1.8" fill="#fbf8ef"></circle></svg>',
    chilli:
      '<svg viewBox="0 0 46 112" fill="none" style="width:100%;height:100%;display:block;overflow:visible;">' +
      '<g filter="url(#wc)">' +
      '<path d="M23 18 C31 20 34 28 33 40 C32 54 31 68 28 81 C26 91 25 99 27 105 C27 107 24 108 23 106 C20 100 19 91 19 81 C18 67 16 54 16 40 C15 29 17 21 23 18 Z" fill="var(--c1)" opacity="0.8"></path>' +
      '<path d="M23 18 C31 20 34 28 33 40 C32 54 31 68 28 81 C26 91 25 99 27 105 C27 107 24 108 23 106 C20 100 19 91 19 81 C18 67 16 54 16 40 C15 29 17 21 23 18 Z" fill="none" stroke="var(--c2)" stroke-width="2.4" opacity="0.5"></path>' +
      '<path d="M22 30 C26 36 26 52 24 70 C23 80 22 90 23 98" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.32"></path>' +
      '</g>' +
      '<path d="M15 19 C14 12 17 6 24 5 C26 9 25 14 21 17 C19 18 17 19 15 19 Z" fill="var(--stem)" opacity="0.92"></path>' +
      '<path d="M24 5 C27 2 31 2 32 6" stroke="var(--stem)" stroke-width="2.6" stroke-linecap="round"></path></svg>',
  };

  const figVariants = [
    { skin: "#52295a", shoulder: "#6f6a2c", rib: "#834b8d" }, // Mission purple
    { skin: "#7c4a3c", shoulder: "#9a7c38", rib: "#a76e54" }, // Brown Turkey
    { skin: "#8c9a44", shoulder: "#bcc66e", rib: "#6f7a2e" }, // Green
  ];
  const chilliPalette = [
    { c1: "#9a3f33", c2: "#6f2a22" }, { c1: "#b25540", c2: "#83392b" },
    { c1: "#bd7a4a", c2: "#8f5630" }, { c1: "#d99a3f", c2: "#aa6f24" },
    { c1: "#e6cf6b", c2: "#bda33f" }, { c1: "#bcc561", c2: "#8d9a3c" },
    { c1: "#8fa84f", c2: "#637a30" },
  ];

  const SIZE = 55, DRIFT = 1;
  const small = window.matchMedia && window.matchMedia("(max-width: 760px)").matches;
  const counts = small
    ? { fig: 1, lemon: 2, spoon: 1, chilli: 3 }
    : { fig: 2, lemon: 5, spoon: 3, chilli: 6 };

  function makeOne(type, idx) {
    const s = SIZE * (0.82 + Math.random() * 0.4);
    const d = {
      type, x: Math.random(), y: Math.random(), px: 0, py: 0, placed: false,
      vx: (Math.random() * 2 - 1) || 0.4, vy: (Math.random() * 2 - 1) || 0.4,
      rot: Math.random() * 26 - 13, rotPhase: Math.random() * Math.PI * 2,
      rotAmp: 4 + Math.random() * 7, rotFreq: 0.16 + Math.random() * 0.26, vars: "",
    };
    if (type === "fig") {
      const v = figVariants[idx % 3];
      d.vars = "--skin:" + v.skin + ";--shoulder:" + v.shoulder + ";--rib:" + v.rib + ";";
      d.w = Math.round(s); d.h = Math.round(s);
    } else if (type === "lemon") {
      d.w = Math.round(s * 1.05); d.h = Math.round(s * 0.92);
    } else if (type === "spoon") {
      d.w = Math.round(s * 0.42); d.h = Math.round(s * 1.22); d.rotAmp = 3 + Math.random() * 5;
    } else if (type === "chilli") {
      const p = chilliPalette[idx % chilliPalette.length];
      d.vars = "--c1:" + p.c1 + ";--c2:" + p.c2 + ";--stem:#6f8a3a;";
      d.w = Math.round(s * 0.5); d.h = Math.round(s * 1.18);
    }
    return d;
  }

  const data = [];
  ["fig", "lemon", "spoon", "chilli"].forEach((t) => {
    for (let i = 0; i < counts[t]; i++) data.push(makeOne(t, i));
  });
  if (!data.length) return;

  const layer = document.createElement("div");
  layer.className = "figs-layer";
  layer.setAttribute("aria-hidden", "true");
  // the watercolour wobble filter the chillies reference
  layer.innerHTML =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<filter id="wc" x="-35%" y="-35%" width="170%" height="170%">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.013 0.02" numOctaves="3" seed="7" result="n"></feTurbulence>' +
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>' +
    '</filter></defs></svg>';

  const els = data.map((d) => {
    const el = document.createElement("div");
    el.className = "fig-obj";
    el.style.cssText = "width:" + d.w + "px;height:" + d.h + "px;" + d.vars;
    el.innerHTML = SVG[d.type];
    layer.appendChild(el);
    return el;
  });
  document.body.appendChild(layer);

  const sizeLayer = () => {
    layer.style.height = Math.max(document.body.scrollHeight, window.innerHeight) + "px";
  };
  sizeLayer();
  window.addEventListener("resize", sizeLayer);
  window.addEventListener("load", sizeLayer);
  if (window.ResizeObserver) new ResizeObserver(sizeLayer).observe(document.body);

  const reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  let last = performance.now();
  function loop(t) {
    const dt = Math.min(0.05, (t - last) / 1000);
    last = t;
    const W = layer.clientWidth, H = layer.clientHeight, speed = DRIFT * 17, time = t / 1000;
    for (let i = 0; i < data.length; i++) {
      const d = data[i], el = els[i];
      if (!d.placed) {
        d.px = d.x * Math.max(0, W - d.w);
        d.py = d.y * Math.max(0, H - d.h);
        d.placed = true;
      }
      if (!reduced) {
        d.px += d.vx * speed * dt; d.py += d.vy * speed * dt;
        if (d.px < 0) { d.px = 0; d.vx = Math.abs(d.vx); }
        else if (d.px > W - d.w) { d.px = W - d.w; d.vx = -Math.abs(d.vx); }
        if (d.py < 0) { d.py = 0; d.vy = Math.abs(d.vy); }
        else if (d.py > H - d.h) { d.py = H - d.h; d.vy = -Math.abs(d.vy); }
        d.vx += (Math.random() * 2 - 1) * dt * 0.35;
        d.vy += (Math.random() * 2 - 1) * dt * 0.35;
        const sp = Math.hypot(d.vx, d.vy), max = 1.7;
        if (sp > max) { d.vx = d.vx / sp * max; d.vy = d.vy / sp * max; }
      }
      const rot = d.rot + Math.sin(time * d.rotFreq + d.rotPhase) * d.rotAmp;
      el.style.transform = "translate(" + d.px.toFixed(1) + "px," + d.py.toFixed(1) + "px) rotate(" + rot.toFixed(2) + "deg)";
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // Multicolour eyebrow: tint each letter of any .rainbow element
  const palette = ["#d94f2a", "#2160c4", "#d8920f", "#5e7a30", "#834b8d", "#c9961a", "#3a8f6f", "#b8472f"];
  document.querySelectorAll(".rainbow").forEach((el) => {
    const text = el.textContent;
    el.textContent = "";
    let ci = 0;
    for (const ch of text) {
      const span = document.createElement("span");
      span.textContent = ch;
      span.style.whiteSpace = "pre";
      if (ch !== " ") { span.style.color = palette[ci % palette.length]; ci++; }
      el.appendChild(span);
    }
  });
})();
