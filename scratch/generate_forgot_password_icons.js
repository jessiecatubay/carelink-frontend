const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function createPNG(width, height, getPixel) {
  const rawData = Buffer.alloc(height * (width * 4 + 1));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8);
  ihdr.writeUInt8(6, 9);
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = crc32(body);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc >>> 0, 0);
  return Buffer.concat([len, body, crcBuf]);
}

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ 0xffffffff;
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * (x2 - x1);
  const projY = y1 + t * (y2 - y1);
  return Math.hypot(px - projX, py - projY);
}

const CYAN = [18, 165, 181]; // #12A5B5
const RED = [241, 106, 102];  // #F16A66
const WHITE = [255, 255, 255];
const PINK_GLOW = [254, 226, 226]; // Soft reddish/cyan glow
const CYAN_GLOW = [224, 247, 250];

// 1. Mail with Lock (mail-lock.png)
function sampleMailLock(px, py) {
  // Envelope dimensions
  const x1 = 44, y1 = 70, x2 = 212, y2 = 186;
  const stroke = 12;
  const half = stroke / 2;

  // Background circle glow
  const distCenter = Math.hypot(px - 128, py - 128);
  let bgGlow = 0;
  if (distCenter <= 120) {
    bgGlow = Math.max(0, (1 - distCenter / 120) * 0.45);
  }

  // Envelope lines
  const dTop = distToSegment(px, py, x1, y1, x2, y1);
  const dBot = distToSegment(px, py, x1, y2, x2, y2);
  const dLeft = distToSegment(px, py, x1, y1, x1, y2);
  const dRight = distToSegment(px, py, x2, y1, x2, y2);
  const dV1 = distToSegment(px, py, x1, y1, 128, 140);
  const dV2 = distToSegment(px, py, x2, y1, 128, 140);

  const envDist = Math.min(dTop, dBot, dLeft, dRight, dV1, dV2);

  // Lock in center: body (112..144, 126..156), shackle (arch 116..140, 108..126)
  const inLockBody = (px >= 110 && px <= 146 && py >= 126 && py <= 158);
  const dLockShackle = Math.abs(Math.hypot(px - 128, py - 126) - 12);
  const inShackleArch = (dLockShackle <= 5 && py <= 126 && py >= 106);

  if (inLockBody || inShackleArch) {
    return [RED[0], RED[1], RED[2], 255];
  }

  // White border around lock
  const nearLock = (px >= 104 && px <= 152 && py >= 102 && py <= 164);
  if (nearLock) {
    const distToLock = Math.min(
      distToSegment(px, py, 110, 126, 146, 126),
      distToSegment(px, py, 110, 158, 146, 158),
      distToSegment(px, py, 110, 126, 110, 158),
      distToSegment(px, py, 146, 126, 146, 158)
    );
    if (distToLock < 8) return [WHITE[0], WHITE[1], WHITE[2], 255];
  }

  if (envDist <= half) {
    return [CYAN[0], CYAN[1], CYAN[2], 255];
  }

  if (bgGlow > 0) {
    return [254, 242, 242, Math.round(bgGlow * 255)]; // Soft pinkish glow
  }

  return [0, 0, 0, 0];
}

// 2. Mail with Down Arrow (mail-sent.png)
function sampleMailSent(px, py) {
  const x1 = 44, y1 = 70, x2 = 212, y2 = 186;
  const stroke = 12;
  const half = stroke / 2;

  const distCenter = Math.hypot(px - 128, py - 128);
  let bgGlow = 0;
  if (distCenter <= 120) {
    bgGlow = Math.max(0, (1 - distCenter / 120) * 0.45);
  }

  const dTop = distToSegment(px, py, x1, y1, x2, y1);
  const dBot = distToSegment(px, py, x1, y2, x2, y2);
  const dLeft = distToSegment(px, py, x1, y1, x1, y2);
  const dRight = distToSegment(px, py, x2, y1, x2, y2);
  const dV1 = distToSegment(px, py, x1, y1, 128, 140);
  const dV2 = distToSegment(px, py, x2, y1, 128, 140);

  const envDist = Math.min(dTop, dBot, dLeft, dRight, dV1, dV2);

  // Red Down Arrow in center
  // Stem: (128, 98) to (128, 134)
  const dStem = distToSegment(px, py, 128, 96, 128, 132);
  // Arrow heads: (114, 118) to (128, 132) and (142, 118) to (128, 132)
  const dHead1 = distToSegment(px, py, 116, 118, 128, 132);
  const dHead2 = distToSegment(px, py, 140, 118, 128, 132);
  const arrowDist = Math.min(dStem, dHead1, dHead2);

  if (arrowDist <= 6) {
    return [RED[0], RED[1], RED[2], 255];
  }

  if (envDist <= half) {
    return [CYAN[0], CYAN[1], CYAN[2], 255];
  }

  if (bgGlow > 0) {
    return [254, 242, 242, Math.round(bgGlow * 255)];
  }

  return [0, 0, 0, 0];
}

// 3. Password Lock (password-lock.png)
function samplePasswordLock(px, py) {
  const distCenter = Math.hypot(px - 128, py - 128);
  let bgGlow = 0;
  if (distCenter <= 120) {
    bgGlow = Math.max(0, (1 - distCenter / 120) * 0.45);
  }

  // Shackle arch
  const dShackle = Math.abs(Math.hypot(px - 128, py - 100) - 34);
  const inShackle = (dShackle <= 8 && py <= 100 && py >= 56);
  const inShackleLegs = ((Math.abs(px - 94) <= 8 || Math.abs(px - 162) <= 8) && py >= 90 && py <= 116);

  // Padlock Body: outer rounded box (64..192, 112..200)
  const bx1 = 64, by1 = 112, bx2 = 192, by2 = 196;
  const dBodyTop = distToSegment(px, py, bx1 + 16, by1, bx2 - 16, by1);
  const dBodyBot = distToSegment(px, py, bx1 + 16, by2, bx2 - 16, by2);
  const dBodyLeft = distToSegment(px, py, bx1, by1 + 16, bx1, by2 - 16);
  const dBodyRight = distToSegment(px, py, bx2, by1 + 16, bx2, by2 - 16);
  const bodyBorder = Math.min(dBodyTop, dBodyBot, dBodyLeft, dBodyRight);

  // Password slot in center: (80..176, 134..162)
  const inSlot = (px >= 80 && px <= 176 && py >= 134 && py <= 162);
  const dSlot = Math.min(
    distToSegment(px, py, 80, 134, 176, 134),
    distToSegment(px, py, 80, 162, 176, 162),
    distToSegment(px, py, 80, 134, 80, 162),
    distToSegment(px, py, 176, 134, 176, 162)
  );

  // Asterisks inside slot (red/pink dots: x = 98, 118, 138, 158, y = 148)
  const dots = [98, 118, 138, 158];
  for (const dx of dots) {
    if (Math.hypot(px - dx, py - 148) <= 5) {
      return [RED[0], RED[1], RED[2], 255];
    }
  }

  if (dSlot <= 4) {
    return [CYAN[0], CYAN[1], CYAN[2], 255];
  }

  if (inShackle || inShackleLegs || bodyBorder <= 6) {
    return [CYAN[0], CYAN[1], CYAN[2], 255];
  }

  if (bgGlow > 0) {
    return [254, 242, 242, Math.round(bgGlow * 255)];
  }

  return [0, 0, 0, 0];
}

const targetSize = 256;
const ss = 4;

function generate(sampler, fileName) {
  const buf = createPNG(targetSize, targetSize, (px, py) => {
    let rSum = 0, gSum = 0, bSum = 0, aCount = 0;
    for (let sy = 0; sy < ss; sy++) {
      for (let sx = 0; sx < ss; sx++) {
        const subX = px + (sx + 0.5) / ss;
        const subY = py + (sy + 0.5) / ss;
        const [r, g, b, a] = sampler(subX, subY);
        if (a > 0) {
          rSum += r * (a / 255);
          gSum += g * (a / 255);
          bSum += b * (a / 255);
          aCount += a;
        }
      }
    }
    const total = ss * ss;
    if (aCount === 0) return [0, 0, 0, 0];
    const a = Math.min(255, Math.round(aCount / total));
    const r = Math.round((rSum / aCount) * 255);
    const g = Math.round((gSum / aCount) * 255);
    const b = Math.round((bSum / aCount) * 255);
    return [r, g, b, a];
  });

  const outPath = path.join(__dirname, '..', 'assets', 'icons', fileName);
  fs.writeFileSync(outPath, buf);
  console.log('Saved:', outPath);
}

generate(sampleMailLock, 'mail-lock.png');
generate(sampleMailSent, 'mail-sent.png');
generate(samplePasswordLock, 'password-lock.png');
