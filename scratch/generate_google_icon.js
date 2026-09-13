const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function createPNG(width, height, getPixel) {
  const rawData = Buffer.alloc(height * (width * 4 + 1));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter: None
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

// Google Official Colors
const RED = [234, 67, 53];     // #EA4335
const YELLOW = [251, 188, 5];   // #FBBC05
const GREEN = [52, 168, 83];    // #34A853
const BLUE = [66, 133, 244];    // #4285F4

// Exact Google G shape definition in normalized [-1, 1] coords
// Outer radius R = 0.9, Inner radius r = 0.48
// Bar thickness = 0.42 (y in [-0.21, 0.21], x in [0, 0.9])
// Cutout on upper right: angle from roughly 0 to -45 degrees (in math angle: 0 to 45 deg or in screen space)

function sampleGoogleG(nx, ny) {
  const dist = Math.hypot(nx, ny);
  const R = 0.92;
  const r = 0.50;
  const barHalfH = 0.21;

  // Check if inside the horizontal bar
  const inBar = (nx >= -0.05 && nx <= R && ny >= -barHalfH && ny <= barHalfH);

  // Check if inside ring
  const inRing = (dist <= R && dist >= r);

  // Cutout zone: between bar top (ny = -barHalfH) and upper quadrant where nx > 0 and ny < -barHalfH
  // Specifically, Google G has open space in upper-right quadrant
  const inCutout = (nx > 0.05 && ny < -barHalfH && ny > -0.7 * nx - 0.2);

  if (inBar) {
    return BLUE;
  }

  if (inRing && !inCutout) {
    // Determine color by angle:
    // math angle: theta = atan2(-ny, nx) in radians
    const theta = Math.atan2(-ny, nx) * (180 / Math.PI); // -180 to 180, 0 is right, 90 is top, -90 is bottom

    if (theta >= 40 && theta <= 145) {
      return RED;
    } else if (theta > 145 || theta <= -140) {
      return YELLOW;
    } else if (theta > -140 && theta <= -40) {
      return GREEN;
    } else {
      return BLUE;
    }
  }

  return null;
}

const targetSize = 256;
const ss = 4; // 4x supersampling for ultra-smooth antialiasing

const img = createPNG(targetSize, targetSize, (px, py) => {
  let rSum = 0, gSum = 0, bSum = 0, aCount = 0;

  for (let sy = 0; sy < ss; sy++) {
    for (let sx = 0; sx < ss; sx++) {
      const subX = px + (sx + 0.5) / ss;
      const subY = py + (sy + 0.5) / ss;

      const nx = (subX / targetSize) * 2 - 1;
      const ny = (subY / targetSize) * 2 - 1;

      const col = sampleGoogleG(nx, ny);
      if (col) {
        rSum += col[0];
        gSum += col[1];
        bSum += col[2];
        aCount++;
      }
    }
  }

  const totalSamples = ss * ss;
  if (aCount === 0) {
    return [0, 0, 0, 0];
  }

  const alpha = Math.round((aCount / totalSamples) * 255);
  const r = Math.round(rSum / aCount);
  const g = Math.round(gSum / aCount);
  const b = Math.round(bSum / aCount);

  return [r, g, b, alpha];
});

const outPath = path.join(__dirname, '..', 'assets', 'icons', 'google.png');
fs.writeFileSync(outPath, img);
console.log('Saved pristine google.png to:', outPath);
