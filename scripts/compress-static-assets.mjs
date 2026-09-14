import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const TARGET_DIR = './public/brand-assets';
const MAX_SIZE_THRESHOLD = 300 * 1024; // Compress files larger than 300 KB

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      getFiles(filePath, fileList);
    } else if (/\.(png|jpe?g)$/i.test(file.name)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

async function compressAll() {
  console.log('🚀 Starting static image optimization in /public/brand-assets...');
  const files = getFiles(TARGET_DIR);
  let totalSavedBytes = 0;
  let count = 0;

  for (const filePath of files) {
    const stat = fs.statSync(filePath);
    if (stat.size < MAX_SIZE_THRESHOLD) continue;

    const originalMB = (stat.size / 1024 / 1024).toFixed(2);
    const ext = path.extname(filePath).toLowerCase();

    try {
      const buffer = await fs.promises.readFile(filePath);
      let pipeline = sharp(buffer);
      const metadata = await pipeline.metadata();

      // Resize if wider than 1920px
      if (metadata.width && metadata.width > 1920) {
        pipeline = pipeline.resize({ width: 1920, fit: 'inside' });
      }

      let compressedBuffer;
      if (ext === '.png') {
        compressedBuffer = await pipeline
          .png({ quality: 80, compressionLevel: 9, palette: true })
          .toBuffer();
      } else {
        compressedBuffer = await pipeline
          .jpeg({ quality: 82, mozjpeg: true })
          .toBuffer();
      }

      if (compressedBuffer.length < stat.size) {
        await fs.promises.writeFile(filePath, compressedBuffer);
        const newMB = (compressedBuffer.length / 1024 / 1024).toFixed(2);
        const savedMB = ((stat.size - compressedBuffer.length) / 1024 / 1024).toFixed(2);
        totalSavedBytes += stat.size - compressedBuffer.length;
        count++;
        console.log(`✅ [${count}] ${filePath}: ${originalMB} MB ➔ ${newMB} MB (Saved ${savedMB} MB)`);
      }
    } catch (err) {
      console.error(`❌ Failed to compress ${filePath}:`, err.message);
    }
  }

  const totalSavedMB = (totalSavedBytes / 1024 / 1024).toFixed(2);
  console.log(`\n🎉 Done! Compressed ${count} files. Total saved: ${totalSavedMB} MB!`);
}

compressAll();
