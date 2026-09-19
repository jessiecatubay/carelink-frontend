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

// Generate an ultra-clean 6-tooth gear icon (256x256)
const size = 256;
const cx = 128;
const cy = 128;
const innerRadius = 38;
const bodyRadius = 78;
const outerRadius = 104;
const numTeeth = 6;
const toothWidthAngle = (Math.PI * 2) / (numTeeth * 2); // angle of tooth vs valley

function isInsideGear(px, py) {
  const dx = px - cx;
  const dy = py - cy;
  const dist = Math.hypot(dx, dy);

  // Inner hole
  if (dist < innerRadius) {
    return false;
  }

  // Angle around center [0, 2PI)
  let angle = Math.atan2(dy, dx);
  if (angle < 0) angle += Math.PI * 2;

  // Modulo for tooth segment
  const segmentAngle = (Math.PI * 2) / numTeeth;
  const modAngle = angle % segmentAngle;

  // Tooth extends to outerRadius
  const halfTooth = toothWidthAngle * 0.45;
  const toothCenter = segmentAngle / 2;

  if (Math.abs(modAngle - toothCenter) < halfTooth) {
    return dist <= outerRadius;
  }

  // Body circle
  return dist <= bodyRadius;
}

const ss = 4;
const settingsPNG = createPNG(size, size, (px, py) => {
  let count = 0;
  for (let sy = 0; sy < ss; sy++) {
    for (let sx = 0; sx < ss; sx++) {
      const subX = px + (sx + 0.5) / ss;
      const subY = py + (sy + 0.5) / ss;
      if (isInsideGear(subX, subY)) {
        count++;
      }
    }
  }

  const alpha = Math.round((count / (ss * ss)) * 255);
  // CareLink Teal #0AA7A8: RGB(10, 167, 168) or neutral dark gray [55, 65, 81] (#374151)
  return [10, 167, 168, alpha];
});

const outPath = path.join(__dirname, '..', 'assets', 'icons', 'settings.png');
fs.writeFileSync(outPath, settingsPNG);
console.log('Saved clean settings.png to:', outPath);
