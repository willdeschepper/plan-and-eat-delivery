/*
  Generate app icons for iOS and Android from a single SVG source using sharp.
  Outputs:
  - iOS AppIcon.appiconset JSON + PNGs
  - Android mipmap launchers (ic_launcher/ic_launcher_round) and Play Store 512
*/
/* eslint-disable ts/ban-ts-comment -- dev-only script; sharp/archiver are untyped optional tooling */
// @ts-nocheck

import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';
import sharp from 'sharp';

const ROOT = path.resolve(__dirname, '../../');
const SRC_SVG = path.resolve(__dirname, './icon.svg');

const iosIcons = [
  { size: 20, scale: 2 },
  { size: 20, scale: 3 },
  { size: 29, scale: 2 },
  { size: 29, scale: 3 },
  { size: 40, scale: 2 },
  { size: 40, scale: 3 },
  { size: 60, scale: 2 },
  { size: 60, scale: 3 },
  { size: 76, scale: 2 },
  { size: 83.5, scale: 2 },
  { size: 1024, scale: 1 },
];

const androidIcons = [
  { name: 'mdpi', size: 48 },
  { name: 'hdpi', size: 72 },
  { name: 'xhdpi', size: 96 },
  { name: 'xxhdpi', size: 144 },
  { name: 'xxxhdpi', size: 192 },
];

async function ensureDir(dirPath: string): Promise<void> {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

function iosIconFilename(size: number, scale: number): string {
  const pointName = String(size).replace('.', '_');
  return `Icon-App-${pointName}x${pointName}@${scale}x.png`;
}

async function generateIOS(): Promise<string> {
  const appIconsetDir = path.resolve(ROOT, 'ios/JurixAI/Images.xcassets/AppIcon.appiconset');
  await ensureDir(appIconsetDir);

  const contents: {
    images: Array<{ filename: string; size: string; scale: string; idiom?: string }>;
    info: { version: number; author: string };
  } = { images: [], info: { version: 1, author: 'xcode' } };

  for (const { size, scale } of iosIcons) {
    const px = Math.round(size * scale);
    const filename = iosIconFilename(size, scale);
    const outPath = path.join(appIconsetDir, filename);
    await sharp(SRC_SVG).resize(px, px).png({ compressionLevel: 9 }).toFile(outPath);
    contents.images.push({
      idiom: 'ios-marketing',
      size: `${size}x${size}`,
      scale: `${scale}x`,
      filename,
    });
  }

  const contentsPath = path.join(appIconsetDir, 'Contents.json');
  await fs.promises.writeFile(contentsPath, JSON.stringify(contents, null, 2), 'utf8');
  return appIconsetDir;
}

async function generateAndroid(): Promise<string> {
  const resDir = path.resolve(ROOT, 'android/app/src/main/res');
  for (const { name, size } of androidIcons) {
    const dir = path.join(resDir, `mipmap-${name}`);
    await ensureDir(dir);
    const pathStandard = path.join(dir, 'ic_launcher.png');
    const pathRound = path.join(dir, 'ic_launcher_round.png');
    await sharp(SRC_SVG).resize(size, size).png({ compressionLevel: 9 }).toFile(pathStandard);
    await sharp(SRC_SVG).resize(size, size).png({ compressionLevel: 9 }).toFile(pathRound);
  }
  // Play Store 512x512
  const playStoreDir = path.resolve(__dirname, '../../dist');
  await ensureDir(playStoreDir);
  await sharp(SRC_SVG).resize(512, 512).png({ compressionLevel: 9 }).toFile(path.join(playStoreDir, 'playstore_512.png'));
  return resDir;
}

async function zipOutputs(): Promise<void> {
  const outDir = path.resolve(__dirname, '../../dist');
  await ensureDir(outDir);

  // iOS
  const iosDir = path.resolve(ROOT, 'ios/JurixAI/Images.xcassets/AppIcon.appiconset');
  const iosZip = path.join(outDir, 'ios_appicon.zip');
  await zipDir(iosDir, iosZip);

  // Android
  const androidDir = path.resolve(ROOT, 'android/app/src/main/res');
  const androidZip = path.join(outDir, 'android_mipmap.zip');
  await zipDir(androidDir, androidZip, (filePath: string) => /mipmap-.*\/ic_launcher.*\.png$/.test(filePath));
}

async function zipDir(sourceDir: string, outPath: string, filter?: (fp: string) => boolean): Promise<void> {
  await ensureDir(path.dirname(outPath));
  const output = fs.createWriteStream(outPath);
  const archive = archiver('zip', { zlib: { level: 9 } });
  const finished = new Promise<void>((resolve, reject) => {
    output.on('close', () => resolve());
    archive.on('error', (err: Error) => reject(err));
  });
  archive.pipe(output);
  archive.glob(
    '**/*',
    {
      cwd: sourceDir,
      dot: false,
      ignore: [],
    },
    filter ? {} : undefined,
  );
  if (filter) {
    // archiver doesn't support filter directly on glob; add manually
    archive.directory(sourceDir, false, {
      filter: (entry: { name: string }) => {
        const full = path.join(sourceDir, entry.name);
        return filter(full);
      },
    });
  }
  await archive.finalize();
  await finished;
}

async function main(): Promise<void> {
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
