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

// Draw a modern, clean envelope/mail icon (256x256)
const size = 256;
const stroke = 18;
const halfStroke = stroke / 2;

// Outer rect: x: [32, 224], y: [60, 196] (width: 192, height: 136)
const xMin = 36, xMax = 220, yMin = 64, yMax = 192;
const cornerR = 20;

// V-fold points: top-left (36, 64) -> center (128, 144) -> top-right (220, 64)
const pTopLeft = [xMin + 8, yMin + 8];
const pCenter = [128, 138];
const pTopRight = [xMax - 8, yMin + 8];

function sampleEnvelope(px, py) {
  // Check outer rounded box border
  // Top edge
  const dTop = distToSegment(px, py, xMin + cornerR, yMin, xMax - cornerR, yMin);
  // Bottom edge
  const dBottom = distToSegment(px, py, xMin + cornerR, yMax, xMax - cornerR, yMax);
  // Left edge
  const dLeft = distToSegment(px, py, xMin, yMin + cornerR, xMin, yMax - cornerR);
  // Right edge
  const dRight = distToSegment(px, py, xMax, yMin + cornerR, xMax, yMax - cornerR);

  // 4 rounded corners
  const dTL = Math.abs(Math.hypot(px - (xMin + cornerR), py - (yMin + cornerR)) - cornerR);
  const inTL = (px <= xMin + cornerR && py <= yMin + cornerR);

  const dTR = Math.abs(Math.hypot(px - (xMax - cornerR), py - (yMin + cornerR)) - cornerR);
  const inTR = (px >= xMax - cornerR && py <= yMin + cornerR);

  const dBL = Math.abs(Math.hypot(px - (xMin + cornerR), py - (yMax - cornerR)) - cornerR);
  const inBL = (px <= xMin + cornerR && py >= yMax - cornerR);

  const dBR = Math.abs(Math.hypot(px - (xMax - cornerR), py - (yMax - cornerR)) - cornerR);
  const inBR = (px >= xMax - cornerR && py >= yMax - cornerR);

  // V flap
  const dV1 = distToSegment(px, py, pTopLeft[0], pTopLeft[1], pCenter[0], pCenter[1]);
  const dV2 = distToSegment(px, py, pCenter[0], pCenter[1], pTopRight[0], pTopRight[1]);

  let minDist = Math.min(dTop, dBottom, dLeft, dRight, dV1, dV2);
  if (inTL) minDist = Math.min(minDist, dTL);
  if (inTR) minDist = Math.min(minDist, dTR);
  if (inBL) minDist = Math.min(minDist, dBL);
  if (inBR) minDist = Math.min(minDist, dBR);

  return minDist;
}

const ss = 4;
const emailPNG = createPNG(size, size, (px, py) => {
  let count = 0;
  for (let sy = 0; sy < ss; sy++) {
    for (let sx = 0; sx < ss; sx++) {
      const subX = px + (sx + 0.5) / ss;
      const subY = py + (sy + 0.5) / ss;
      const d = sampleEnvelope(subX, subY);
      if (d <= halfStroke) {
        count++;
      }
    }
  }

  const alpha = Math.round((count / (ss * ss)) * 255);
  // Neutral dark gray/charcoal tintable icon color: [153, 153, 153] (#999999) matching placeholder and user icon
  return [153, 153, 153, alpha];
});

const outPath = path.join(__dirname, '..', 'assets', 'icons', 'email.png');
fs.writeFileSync(outPath, emailPNG);
console.log('Saved clean email.png to:', outPath);
