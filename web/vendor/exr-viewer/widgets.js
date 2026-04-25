// ──────────────────────────────────────────────────────────
// DaVinci-style Color Wheel  +  RGB Histogram
// ──────────────────────────────────────────────────────────
// ── HSV helpers ──────────────────────────────────────────
function hsvToRgb(h, s, v) {
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: return [v, t, p];
        case 1: return [q, v, p];
        case 2: return [p, v, t];
        case 3: return [p, q, v];
        case 4: return [t, p, v];
        default: return [v, p, q];
    }
}
// ══════════════════════════════════════════════════════════
//  Color Wheel
// ══════════════════════════════════════════════════════════
const WHEEL_CANVAS = 160; // canvas backing store (hi-res for CSS scaling)
const WHEEL_R = 70; // wheel radius in backing store px
const DOT_R = 6;
export class ColorWheel {
    constructor(container, label, sensitivity, // how much wheel offset maps to RGB
    center) {
        this.label = label;
        this.sensitivity = sensitivity;
        this.center = center;
        this.dx = 0;
        this.dy = 0;
        this.master = 0;
        this.dragging = false;
        this.rgbEls = [null, null, null];
        this.onUpdate = () => { };
        this.values = [center, center, center];
        // wrapper
        const wrap = document.createElement('div');
        wrap.className = 'wheel-cell';
        // label + reset button
        const lbl = document.createElement('div');
        lbl.className = 'wheel-title';
        const lblText = document.createElement('span');
        lblText.textContent = label;
        lbl.appendChild(lblText);
        this.rstBtn = document.createElement('button');
        this.rstBtn.className = 'wheel-reset';
        this.rstBtn.innerHTML = '&#x21ba;';
        this.rstBtn.title = 'Reset ' + label;
        this.rstBtn.addEventListener('click', () => this.reset());
        lbl.appendChild(this.rstBtn);
        wrap.appendChild(lbl);
        // canvas
        this.cvs = document.createElement('canvas');
        this.cvs.width = WHEEL_CANVAS;
        this.cvs.height = WHEEL_CANVAS;
        this.cvs.className = 'wheel-cvs';
        wrap.appendChild(this.cvs);
        // master slider row
        const mRow = document.createElement('div');
        mRow.className = 'wheel-master-row';
        this.masterInput = document.createElement('input');
        this.masterInput.type = 'range';
        this.masterInput.min = '-0.5';
        this.masterInput.max = '0.5';
        this.masterInput.step = '0.005';
        this.masterInput.value = '0';
        this.masterInput.className = 'wheel-master-sl';
        this.masterValEl = document.createElement('span');
        this.masterValEl.className = 'wheel-master-val';
        this.masterValEl.textContent = '0.00';
        mRow.appendChild(this.masterInput);
        mRow.appendChild(this.masterValEl);
        wrap.appendChild(mRow);
        // RGB readout row
        const rgbRow = document.createElement('div');
        rgbRow.className = 'wheel-rgb-row';
        const colors = ['r', 'g', 'b'];
        for (let i = 0; i < 3; i++) {
            const span = document.createElement('span');
            span.className = `wheel-rgb ${colors[i]}`;
            span.textContent = center.toFixed(2);
            rgbRow.appendChild(span);
            this.rgbEls[i] = span;
        }
        wrap.appendChild(rgbRow);
        container.appendChild(wrap);
        this.el = wrap;
        this.ctx = this.cvs.getContext('2d');
        this.bg = this.createBg();
        this.draw();
        // master slider events
        this.masterInput.addEventListener('input', () => {
            this.master = +this.masterInput.value;
            this.masterValEl.textContent = this.master.toFixed(2);
            this.computeValues();
            this.onUpdate();
        });
        // wheel drag events
        this.cvs.addEventListener('pointerdown', (e) => this.onDown(e));
        window.addEventListener('pointermove', (e) => this.onMove(e));
        window.addEventListener('pointerup', () => this.onUp());
        this.cvs.addEventListener('dblclick', () => this.reset());
    }
    updateRgbReadout() {
        for (let i = 0; i < 3; i++) {
            this.rgbEls[i].textContent = this.values[i].toFixed(2);
        }
    }
    syncResetBtn() {
        const modified = Math.abs(this.dx) > 0.5 || Math.abs(this.dy) > 0.5 || Math.abs(this.master) > 0.001;
        this.rstBtn.classList.toggle('show', modified);
    }
    reset() {
        this.dx = 0;
        this.dy = 0;
        this.master = 0;
        this.masterInput.value = '0';
        this.masterValEl.textContent = '0.00';
        this.computeValues();
        this.draw();
        this.onUpdate();
    }
    setValues(rgb) {
        // reverse-map rgb to wheel position + master
        // master = average offset from center
        const avg = (rgb[0] + rgb[1] + rgb[2]) / 3 - this.center;
        this.master = Math.max(-0.5, Math.min(0.5, avg));
        this.masterInput.value = String(this.master);
        this.masterValEl.textContent = this.master.toFixed(2);
        // wheel position from residual (simplified — set to center)
        this.dx = 0;
        this.dy = 0;
        this.values = rgb;
        this.draw();
    }
    /** Full wheel state (for UI restoration). Pairs with setState(). */
    getState() {
        return { dx: this.dx, dy: this.dy, master: this.master };
    }
    /** Restore exact wheel dot + master position. Recomputes rgb values. */
    setState(s) {
        this.dx = s.dx ?? 0;
        this.dy = s.dy ?? 0;
        this.master = s.master ?? 0;
        this.masterInput.value = String(this.master);
        this.masterValEl.textContent = this.master.toFixed(2);
        this.computeValues();
        this.draw();
    }
    // ── Internals ──────────────────────────────────────────
    onDown(e) {
        this.dragging = true;
        this.cvs.setPointerCapture(e.pointerId);
        this.updateDot(e);
    }
    onMove(e) {
        if (!this.dragging)
            return;
        this.updateDot(e);
    }
    onUp() { this.dragging = false; }
    updateDot(e) {
        const rect = this.cvs.getBoundingClientRect();
        const scale = WHEEL_CANVAS / rect.width;
        const cx = WHEEL_CANVAS / 2;
        let px = (e.clientX - rect.left) * scale - cx;
        let py = (e.clientY - rect.top) * scale - cx;
        // clamp to circle
        const dist = Math.sqrt(px * px + py * py);
        if (dist > WHEEL_R) {
            px *= WHEEL_R / dist;
            py *= WHEEL_R / dist;
        }
        this.dx = px;
        this.dy = py;
        this.computeValues();
        this.draw();
        this.onUpdate();
    }
    computeValues() {
        this.syncResetBtn();
        const normDist = Math.sqrt(this.dx * this.dx + this.dy * this.dy) / WHEEL_R;
        if (normDist < 0.01) {
            this.values = [
                this.center + this.master,
                this.center + this.master,
                this.center + this.master,
            ];
            this.updateRgbReadout();
            return;
        }
        // Non-linear power curve: gentle near center, strong at edge
        // Matches DaVinci Resolve's feel — fine control for subtle grades,
        // full range when pushed hard.
        const curved = Math.pow(normDist, 1.8);
        // DaVinci orientation: Red at top (12 o'clock), hue increases clockwise
        let hue = -Math.atan2(this.dx, -this.dy) / (2 * Math.PI);
        if (hue < 0)
            hue += 1;
        const [pr, pg, pb] = hsvToRgb(hue, 1, 1);
        const avg = (pr + pg + pb) / 3;
        const s = curved * this.sensitivity;
        this.values = [
            this.center + (pr - avg) * s * 3 + this.master,
            this.center + (pg - avg) * s * 3 + this.master,
            this.center + (pb - avg) * s * 3 + this.master,
        ];
        this.updateRgbReadout();
    }
    createBg() {
        const sz = WHEEL_CANVAS;
        const img = new ImageData(sz, sz);
        const cx = sz / 2;
        for (let y = 0; y < sz; y++) {
            for (let x = 0; x < sz; x++) {
                const ndx = (x - cx) / WHEEL_R;
                const ndy = (y - cx) / WHEEL_R;
                const d = Math.sqrt(ndx * ndx + ndy * ndy);
                if (d > 1.05)
                    continue;
                // ring edge fade
                const alpha = d > 1.0 ? 0 : (d > 0.92 ? 1 : d < 0.05 ? 0.6 : 0.85);
                // DaVinci orientation: Red at top, clockwise
                let hue = -Math.atan2(ndx, -ndy) / (2 * Math.PI);
                if (hue < 0)
                    hue += 1;
                const sat = Math.min(d, 1.0) * 0.65;
                const val = 0.20 + Math.min(d, 1.0) * 0.15;
                const [r, g, b] = hsvToRgb(hue, sat, val);
                const i = (y * sz + x) * 4;
                img.data[i] = Math.round(r * 255);
                img.data[i + 1] = Math.round(g * 255);
                img.data[i + 2] = Math.round(b * 255);
                img.data[i + 3] = Math.round(alpha * 255);
            }
        }
        return img;
    }
    draw() {
        const ctx = this.ctx;
        const cx = WHEEL_CANVAS / 2;
        ctx.clearRect(0, 0, WHEEL_CANVAS, WHEEL_CANVAS);
        ctx.putImageData(this.bg, 0, 0);
        // outer ring
        ctx.beginPath();
        ctx.arc(cx, cx, WHEEL_R + 1, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
        // cross-hairs (subtle)
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.beginPath();
        ctx.moveTo(cx - WHEEL_R, cx);
        ctx.lineTo(cx + WHEEL_R, cx);
        ctx.moveTo(cx, cx - WHEEL_R);
        ctx.lineTo(cx, cx + WHEEL_R);
        ctx.stroke();
        // indicator dot
        const dotX = cx + this.dx;
        const dotY = cx + this.dy;
        ctx.beginPath();
        ctx.arc(dotX, dotY, DOT_R, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // inner dot highlight
        ctx.beginPath();
        ctx.arc(dotX, dotY, DOT_R - 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fill();
    }
}
// ══════════════════════════════════════════════════════════
//  RGB Histogram
// ══════════════════════════════════════════════════════════
export function computeHistogram(pixels) {
    const rH = new Uint32Array(256);
    const gH = new Uint32Array(256);
    const bH = new Uint32Array(256);
    for (let i = 0; i < pixels.length; i += 4) {
        rH[pixels[i]]++;
        gH[pixels[i + 1]]++;
        bH[pixels[i + 2]]++;
    }
    return [rH, gH, bH];
}
export function drawHistogram(ctx, rH, gH, bH, w, h) {
    ctx.clearRect(0, 0, w, h);
    // background
    ctx.fillStyle = '#111113';
    ctx.fillRect(0, 0, w, h);
    // find peak (skip extremes 0 and 255 which often spike)
    let peak = 1;
    for (let i = 2; i < 254; i++) {
        peak = Math.max(peak, rH[i], gH[i], bH[i]);
    }
    const logPeak = Math.log(peak + 1);
    const channels = [
        [rH, 'rgba(220, 60, 60, 0.55)'],
        [gH, 'rgba(60, 200, 80, 0.55)'],
        [bH, 'rgba(60, 120, 220, 0.55)'],
    ];
    const binW = w / 256;
    for (const [hist, color] of channels) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let i = 0; i < 256; i++) {
            const v = hist[i] > 0 ? (Math.log(hist[i] + 1) / logPeak) * (h - 2) : 0;
            ctx.lineTo(i * binW, h - v);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
    }
    // border
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
}
// ══════════════════════════════════════════════════════════
//  RGB Parade
// ══════════════════════════════════════════════════════════
export function drawParade(ctx, pixels, srcW, srcH, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#111113';
    ctx.fillRect(0, 0, w, h);
    const secW = Math.floor(w / 3);
    const gap = 2;
    // accumulation buffers: [secW × h]
    const rBuf = new Float32Array(secW * h);
    const gBuf = new Float32Array(secW * h);
    const bBuf = new Float32Array(secW * h);
    for (let i = 0; i < pixels.length; i += 4) {
        const px = ((i >> 2) % srcW);
        const sx = Math.min(Math.floor(px * secW / srcW), secW - 1);
        const ry = h - 1 - Math.min(Math.floor(pixels[i] * (h - 1) / 255), h - 1);
        const gy = h - 1 - Math.min(Math.floor(pixels[i + 1] * (h - 1) / 255), h - 1);
        const by = h - 1 - Math.min(Math.floor(pixels[i + 2] * (h - 1) / 255), h - 1);
        rBuf[ry * secW + sx]++;
        gBuf[gy * secW + sx]++;
        bBuf[by * secW + sx]++;
    }
    // find peak for normalization
    let peak = 1;
    for (let i = 0; i < rBuf.length; i++)
        peak = Math.max(peak, rBuf[i], gBuf[i], bBuf[i]);
    const logPeak = Math.log(peak + 1);
    // draw via ImageData
    const img = ctx.createImageData(w, h);
    const d = img.data;
    for (let sy = 0; sy < h; sy++) {
        for (let sx = 0; sx < secW; sx++) {
            const idx = sy * secW + sx;
            // Red section
            const rv = rBuf[idx] > 0 ? Math.log(rBuf[idx] + 1) / logPeak : 0;
            const ri = (sy * w + sx) * 4;
            d[ri] = Math.min(rv * 400, 255) | 0;
            d[ri + 3] = 255;
            // Green section
            const gv = gBuf[idx] > 0 ? Math.log(gBuf[idx] + 1) / logPeak : 0;
            const gi = (sy * w + sx + secW + gap) * 4;
            if (sx + secW + gap < w) {
                d[gi + 1] = Math.min(gv * 400, 255) | 0;
                d[gi + 3] = 255;
            }
            // Blue section
            const bv = bBuf[idx] > 0 ? Math.log(bBuf[idx] + 1) / logPeak : 0;
            const bi = (sy * w + sx + (secW + gap) * 2) * 4;
            if (sx + (secW + gap) * 2 < w) {
                d[bi + 2] = Math.min(bv * 400, 255) | 0;
                d[bi + 3] = 255;
            }
        }
    }
    ctx.putImageData(img, 0, 0);
    // section labels
    ctx.font = '9px sans-serif';
    ctx.fillStyle = 'rgba(255,80,80,0.5)';
    ctx.fillText('R', 3, 10);
    ctx.fillStyle = 'rgba(80,220,80,0.5)';
    ctx.fillText('G', secW + gap + 3, 10);
    ctx.fillStyle = 'rgba(80,140,255,0.5)';
    ctx.fillText('B', (secW + gap) * 2 + 3, 10);
    // border
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
}
//# sourceMappingURL=widgets.js.map