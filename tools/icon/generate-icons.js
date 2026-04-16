/*
  Generate app icons for iOS AppIcon.appiconset and Android mipmap-* from a single SVG.
  - Reads iOS Contents.json and fills filenames accordingly
  - Writes Android ic_launcher assets
  - Produces zip archives in dist/
*/

const fs = require('node:fs');
const path = require('node:path');
const archiver = require('archiver');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '../../');
const SRC_SVG = path.resolve(__dirname, './icon.svg');
const IOS_APPICONSET = path.resolve(ROOT, 'ios/PetHub_Mobile/Images.xcassets/AppIcon.appiconset');

const ANDROID_MIPMAP_SPECS = [
  { name: 'mipmap-mdpi', size: 48 },
  { name: 'mipmap-hdpi', size: 72 },
  { name: 'mipmap-xhdpi', size: 96 },
  { name: 'mipmap-xxhdpi', size: 144 },
  { name: 'mipmap-xxxhdpi', size: 192 },
];

async function ensureDir(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

function parsePointSize(sizeStr) {
  // e.g. "20x20" -> 20, "83.5x83.5" -> 83.5
  const [w] = String(sizeStr).split('x');
  return Number.parseFloat(w);
}

function parseScale(scaleStr) {
  // e.g. "3x" -> 3
  return Number.parseInt(String(scaleStr).replace('x', ''), 10);
}

function filenameForIOS(sizeStr, scaleStr) {
  const safeSize = String(sizeStr).replace(/\./g, '_'); // 83.5 -> 83_5
  return `AppIcon-${safeSize}@${scaleStr}.png`;
}

async function generateIOS() {
  const contentsPath = path.join(IOS_APPICONSET, 'Contents.json');
  if (!fs.existsSync(contentsPath)) {
    throw new Error(`Contents.json not found: ${contentsPath}`);
  }
  const contents = JSON.parse(await fs.promises.readFile(contentsPath, 'utf8'));
  if (!Array.isArray(contents.images)) {
    throw new TypeError('Invalid Contents.json: missing images array');
  }

  for (const imageEntry of contents.images) {
    if (!imageEntry.size || !imageEntry.scale) {
      continue;
    }
    const sizePoint = parsePointSize(imageEntry.size); // pt
    const scale = parseScale(imageEntry.scale);
    const px = Math.round(sizePoint * scale);
    const filename = filenameForIOS(imageEntry.size, imageEntry.scale);
    const outPath = path.join(IOS_APPICONSET, filename);
    await sharp(SRC_SVG).resize(px, px).png({ compressionLevel: 9 }).toFile(outPath);
    imageEntry.filename = filename;
  }

  await fs.promises.writeFile(contentsPath, JSON.stringify(contents, null, 2), 'utf8');
}

async function generateAndroid() {
  const resDir = path.resolve(ROOT, 'android/app/src/main/res');
  for (const spec of ANDROID_MIPMAP_SPECS) {
    const dir = path.join(resDir, spec.name);
    await ensureDir(dir);
    const standard = path.join(dir, 'ic_launcher.png');
    const round = path.join(dir, 'ic_launcher_round.png');
    await sharp(SRC_SVG).resize(spec.size, spec.size).png({ compressionLevel: 9 }).toFile(standard);
    await sharp(SRC_SVG).resize(spec.size, spec.size).png({ compressionLevel: 9 }).toFile(round);
  }
}

async function zipDir(sourceDir, outPath, filterFn) {
  await ensureDir(path.dirname(outPath));
  const output = fs.createWriteStream(outPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  const finished = new Promise((resolve, reject) => {
    output.on('close', resolve);
    archive.on('error', reject);
  });

  archive.pipe(output);

  if (filterFn) {
    archive.directory(sourceDir, false, {
      filter: (entry) => {
        const fullPath = path.join(sourceDir, entry.name);
        return filterFn(fullPath);
      },
    });
  }
  else {
    archive.directory(sourceDir, false);
  }

  await archive.finalize();
  await finished;
}

async function zipOutputs() {
  const dist = path.resolve(ROOT, 'dist');
  await ensureDir(dist);

  // iOS: entire appiconset
  await zipDir(IOS_APPICONSET, path.join(dist, 'ios_appicon.zip'));

  // Android: only ic_launcher files from mipmap folders
  const resDir = path.resolve(ROOT, 'android/app/src/main/res');
  await zipDir(resDir, path.join(dist, 'android_mipmap.zip'), p => /mipmap-([^/]+)\/ic_launcher(_round)?\.png$/.test(p));
}

async function main() {
  if (!fs.existsSync(SRC_SVG)) {
    throw new Error(`Source SVG not found at ${SRC_SVG}`);
  }
  await generateIOS();
  await generateAndroid();
  await zipOutputs();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
