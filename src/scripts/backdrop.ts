// Original backdrop art drawn on canvas (no game assets), ported from the v5 mockup.
// Both scenes use a seeded RNG, so the same viewport size always draws the same picture.
type Ctx = CanvasRenderingContext2D;

const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

function skyline(cx: Ctx, r: () => number, W: number, base: number, minH: number, maxH: number, color: string, wmin: number): void {
  let x = -10;
  while (x < W + 10) {
    const w = wmin + r() * wmin * 1.4;
    const h = minH + r() * (maxH - minH);
    cx.fillStyle = color;
    cx.fillRect(x, base - h, w, h + 2);
    x += w + 1.5 + r() * 5;
  }
}

/** Home: sky, sun glow, halo ring, clouds, distant skyline, sea and light shafts. */
export function drawLobby(cx: Ctx, W: number, H: number): void {
  const r = rng(7);
  const g = cx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#5fb2f0"); g.addColorStop(0.55, "#bfe2fb"); g.addColorStop(1, "#eef6fc");
  cx.fillStyle = g; cx.fillRect(0, 0, W, H);

  const sx = W * 0.72, sy = H * 0.16;
  const sg = cx.createRadialGradient(sx, sy, 0, sx, sy, Math.max(W, H) * 0.4);
  sg.addColorStop(0, "rgba(255,255,255,.95)"); sg.addColorStop(0.12, "rgba(255,255,255,.35)"); sg.addColorStop(1, "rgba(255,255,255,0)");
  cx.fillStyle = sg; cx.fillRect(0, 0, W, H);

  cx.save(); cx.translate(W * 0.36, H * 0.14); cx.rotate(-0.1); cx.strokeStyle = "rgba(255,255,255,.55)"; cx.lineWidth = 2.5;
  cx.beginPath(); cx.ellipse(0, 0, W * 0.16, H * 0.028, 0, 0, Math.PI * 2); cx.stroke(); cx.lineWidth = 1;
  cx.beginPath(); cx.ellipse(0, 0, W * 0.12, H * 0.018, 0, 0, Math.PI * 2); cx.stroke(); cx.restore();

  cx.fillStyle = "rgba(255,255,255,.88)";
  for (let k = 0; k < 7; k++) {
    const x = r() * W, y = H * (0.05 + r() * 0.28), s = (24 + r() * 60) * Math.max(0.6, W / 1200);
    cx.beginPath();
    for (let q = 0; q < 5; q++) cx.ellipse(x + (q - 2) * s * 0.6, y + (q % 2 ? -s * 0.18 : 0), s * 0.55, s * 0.32, 0, 0, Math.PI * 2);
    cx.fill();
  }

  const hz = H * 0.62;
  skyline(cx, r, W, hz, H * 0.03, H * 0.15, "#a9cdeb", Math.max(10, W / 90));
  const sea = cx.createLinearGradient(0, hz, 0, H);
  sea.addColorStop(0, "#7fcff0"); sea.addColorStop(1, "#dff5fc");
  cx.fillStyle = sea; cx.fillRect(0, hz, W, H - hz);

  cx.strokeStyle = "rgba(255,255,255,.75)"; cx.lineWidth = 1.3;
  for (let k = 0; k < 90; k++) {
    const p = Math.pow(r(), 1.5), y = hz + 4 + p * (H - hz), w = 8 + p * 90 * r(), x = r() * W;
    cx.globalAlpha = 0.2 + 0.5 * r();
    cx.beginPath(); cx.moveTo(x, y); cx.quadraticCurveTo(x + w / 2, y - 2 - p * 3, x + w, y); cx.stroke();
  }

  cx.globalAlpha = 0.18; cx.fillStyle = "#fff";
  for (let k = 0; k < 3; k++) {
    const x0 = W * (0.48 + k * 0.14);
    cx.beginPath(); cx.moveTo(x0, 0); cx.lineTo(x0 + W * 0.05, 0); cx.lineTo(x0 - W * 0.25, H); cx.lineTo(x0 - W * 0.33, H); cx.closePath(); cx.fill();
  }
  cx.globalAlpha = 1;
}

/** Sub-screens: pale low-poly triangles with a few faint vertical lines. */
export function drawPoly(cx: Ctx, W: number, H: number): void {
  const r = rng(19);
  const g = cx.createLinearGradient(0, 0, W * 0.3, H);
  g.addColorStop(0, "#c4e2fa"); g.addColorStop(0.5, "#e4f1fb"); g.addColorStop(1, "#f6f9fc");
  cx.fillStyle = g; cx.fillRect(0, 0, W, H);

  const s = Math.max(120, W / 9), h = s * 0.866;
  for (let row = -1; row * h < H + h; row++) {
    for (let col = -1; col * s < W + s; col++) {
      const x = col * s + (row % 2 ? s / 2 : 0), y = row * h;
      for (const up of [true, false]) {
        const a = r();
        if (a > 0.45) continue;
        cx.fillStyle = `rgba(255,255,255,${(a * 0.55).toFixed(3)})`;
        cx.beginPath();
        if (up) { cx.moveTo(x, y + h); cx.lineTo(x + s / 2, y); cx.lineTo(x + s, y + h); }
        else { cx.moveTo(x + s / 2, y); cx.lineTo(x + s * 1.5, y); cx.lineTo(x + s, y + h); }
        cx.closePath(); cx.fill();
      }
    }
  }
  cx.strokeStyle = "rgba(255,255,255,.55)"; cx.lineWidth = 1;
  for (let k = 0; k < 6; k++) { cx.beginPath(); cx.moveTo(r() * W, 0); cx.lineTo(r() * W, H); cx.stroke(); }
}

/** Sizes the canvas to .app and redraws on resize and after every page swap. Call once. */
export function mountBackdrop(canvas: HTMLCanvasElement): void {
  const draw = () => {
    const app = canvas.parentElement;
    const cx = canvas.getContext("2d");
    if (!app || !cx) return;
    const W = app.clientWidth, H = app.clientHeight;
    if (!W || !H) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    (document.documentElement.dataset.screen === "home" ? drawLobby : drawPoly)(cx, W, H);
  };
  // Observe the canvas itself: it fills .app, and .app is replaced on every navigation.
  new ResizeObserver(draw).observe(canvas);
  document.addEventListener("astro:after-swap", draw);
  draw();
}
