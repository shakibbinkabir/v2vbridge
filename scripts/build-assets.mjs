// Generates /public/favicon.ico (32x32) and /public/og-default.png (1200x630)
// from brand tokens. No external deps. Run:  node scripts/build-assets.mjs
//
// Re-run any time the brand colors or placeholder mark change. Output is
// committed so the project does not depend on a postinstall step.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const out = (rel) => resolve(root, rel);

const TEAL = [0x0f, 0x4c, 0x5c];
const CORAL = [0xe7, 0x6f, 0x51];
const CREAM = [0xf4, 0xf1, 0xed];
const WHITE = [0xff, 0xff, 0xff];

// --- shared geometry helpers ---

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  let t = ((px - x1) * dx + (py - y1) * dy) / (len2 || 1);
  t = Math.max(0, Math.min(1, t));
  const cx = x1 + t * dx;
  const cy = y1 + t * dy;
  return Math.hypot(px - cx, py - cy);
}

// --- favicon.ico (32x32, BMP-in-ICO, 32bpp BGRA) ---

function buildFavicon() {
  const W = 32;
  const H = 32;
  const xor = Buffer.alloc(W * H * 4);

  // Draw a single chevron "V" centered, white on teal.
  const xLeft = 7;
  const xMid = 16;
  const xRight = 25;
  const yTop = 7;
  const yBottom = 25;
  const stroke = 2.4;

  for (let row = 0; row < H; row++) {
    // BMP rows are bottom-up
    const y = H - 1 - row;
    for (let x = 0; x < W; x++) {
      const d1 = distToSegment(x, y, xLeft, yTop, xMid, yBottom);
      const d2 = distToSegment(x, y, xMid, yBottom, xRight, yTop);
      const onMark = Math.min(d1, d2) <= stroke;
      const c = onMark ? WHITE : TEAL;
      const o = (row * W + x) * 4;
      xor[o] = c[2]; // B
      xor[o + 1] = c[1]; // G
      xor[o + 2] = c[0]; // R
      xor[o + 3] = 0xff; // A
    }
  }

  const andMask = Buffer.alloc((W * H) / 8); // all zeros = fully visible

  const bmpHeader = Buffer.alloc(40);
  bmpHeader.writeUInt32LE(40, 0); // header size
  bmpHeader.writeInt32LE(W, 4); // width
  bmpHeader.writeInt32LE(H * 2, 8); // height (XOR + AND)
  bmpHeader.writeUInt16LE(1, 12); // planes
  bmpHeader.writeUInt16LE(32, 14); // bitcount
  // remaining fields zero

  const imageData = Buffer.concat([bmpHeader, xor, andMask]);

  const iconDir = Buffer.alloc(6);
  iconDir.writeUInt16LE(0, 0);
  iconDir.writeUInt16LE(1, 2); // type=icon
  iconDir.writeUInt16LE(1, 4); // count

  const entry = Buffer.alloc(16);
  entry[0] = W; // width (0 means 256)
  entry[1] = H;
  entry[2] = 0; // palette colors
  entry[3] = 0;
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bitcount
  entry.writeUInt32LE(imageData.length, 8);
  entry.writeUInt32LE(22, 12); // file offset

  return Buffer.concat([iconDir, entry, imageData]);
}

// --- PNG writer (RGB, 8bpp) ---

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function buildOg() {
  const W = 1200;
  const H = 630;
  const rowSize = 1 + W * 3;
  const raw = Buffer.alloc(rowSize * H);

  // V-mark geometry, scaled to canvas
  const cx = W / 2;
  const cy = H / 2 + 30;
  const armSpan = 220;
  const armRise = 220;
  const xLeft = cx - armSpan;
  const xRight = cx + armSpan;
  const xMid = cx;
  const yTop = cy - armRise;
  const yBottom = cy;
  const stroke = 22;

  // Coral keyline
  const borderInset = 24;
  const borderThickness = 6;

  function pixel(x, y) {
    // Border
    if (
      (x >= borderInset - borderThickness && x < borderInset) ||
      (x >= W - borderInset && x < W - borderInset + borderThickness) ||
      (y >= borderInset - borderThickness && y < borderInset) ||
      (y >= H - borderInset && y < H - borderInset + borderThickness)
    ) {
      return CORAL;
    }
    // V mark
    const d = Math.min(
      distToSegment(x, y, xLeft, yTop, xMid, yBottom),
      distToSegment(x, y, xMid, yBottom, xRight, yTop),
    );
    if (d <= stroke) return WHITE;
    return TEAL;
  }

  for (let y = 0; y < H; y++) {
    raw[y * rowSize] = 0; // filter: none
    for (let x = 0; x < W; x++) {
      const [r, g, b] = pixel(x, y);
      const o = y * rowSize + 1 + x * 3;
      raw[o] = r;
      raw[o + 1] = g;
      raw[o + 2] = b;
    }
  }

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", idat),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync(out("public"), { recursive: true });
writeFileSync(out("public/favicon.ico"), buildFavicon());
writeFileSync(out("public/og-default.png"), buildOg());
// Reference unused brand tokens to keep them in scope for future variants.
void [CREAM];

console.log("Wrote public/favicon.ico and public/og-default.png");
