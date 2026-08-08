import fs from 'fs';
import path from 'path';
import { ZipArchive } from 'archiver';

const __dirname = path.resolve();
const extensionSrc = path.join(__dirname, 'extension');
const distDir = path.join(__dirname, 'dist');

const TARGETS = [
  {
    name: 'Chrome / Brave / Edge / Opera',
    folder: 'extension-chrome',
    manifest: 'manifest.chrome.json',
    zipName: 'shafinbd-jobs-extension-chrome-v1.0.0.zip'
  },
  {
    name: 'Mozilla Firefox',
    folder: 'extension-firefox',
    manifest: 'manifest.firefox.json',
    zipName: 'shafinbd-jobs-extension-firefox-v1.0.0.zip'
  }
];

const DIRECTORIES_TO_COPY = [
  'background',
  'bridge',
  'content',
  'engine',
  'icons',
  'mapping',
  'popup',
  'utils'
];

async function createZipArchive(srcFolder, zipPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    output.on('close', () => {
      resolve(archive.pointer());
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(srcFolder, false);
    archive.finalize();
  });
}

async function build() {
  console.log('\n🚀 Starting ShafinBD Extension Unified Cross-Browser Build System...\n');

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  for (const target of TARGETS) {
    const targetFolder = path.join(distDir, target.folder);
    const zipPath = path.join(distDir, target.zipName);

    console.log(`📦 Building package for: ${target.name}...`);

    // Clean target directory
    if (fs.existsSync(targetFolder)) {
      fs.rmSync(targetFolder, { recursive: true, force: true });
    }
    fs.mkdirSync(targetFolder, { recursive: true });

    // Copy directories
    for (const dir of DIRECTORIES_TO_COPY) {
      const src = path.join(extensionSrc, dir);
      const dest = path.join(targetFolder, dir);
      if (fs.existsSync(src)) {
        fs.cpSync(src, dest, { recursive: true });
      }
    }

    // Copy target manifest as manifest.json
    const manifestSrc = path.join(extensionSrc, target.manifest);
    const manifestDest = path.join(targetFolder, 'manifest.json');
    if (fs.existsSync(manifestSrc)) {
      fs.copyFileSync(manifestSrc, manifestDest);
    } else {
      // Fallback to default manifest.json
      fs.copyFileSync(path.join(extensionSrc, 'manifest.json'), manifestDest);
    }

    // Copy README if present
    const readmeSrc = path.join(extensionSrc, 'README.md');
    if (fs.existsSync(readmeSrc)) {
      fs.copyFileSync(readmeSrc, path.join(targetFolder, 'README.md'));
    }

    // Generate ZIP package
    const bytes = await createZipArchive(targetFolder, zipPath);
    const kb = (bytes / 1024).toFixed(2);

    console.log(`   ✅ Target Directory: dist/${target.folder}/`);
    console.log(`   📦 Production ZIP:   dist/${target.zipName} (${kb} KB)\n`);
  }

  console.log('✨ All browser build targets compiled and packaged successfully!\n');
}

build().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
