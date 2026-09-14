/**
 * Utility for client-side image compression and format optimization (WebP/JPEG).
 * Reduces image size by 80-90% before uploading to Supabase Storage,
 * ensuring ultra-fast site loading speeds.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default 0.82)
  outputFormat?: 'image/webp' | 'image/jpeg';
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.82,
    outputFormat = 'image/webp',
  } = options;

  // Don't compress non-image files (PDFs, SVGs, etc.)
  if (!file.type.startsWith('image/') || file.type.includes('svg')) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect-ratio scaling
        if (width > maxWidth || height > maxHeight) {
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          const bestRatio = Math.min(widthRatio, heightRatio);

          width = Math.round(width * bestRatio);
          height = Math.round(height * bestRatio);
        }

        // Create canvas for rendering
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file); // Fallback to original if canvas fails
        }

        // Smooth image scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }

            // Create new compressed File object
            const originalNameWithoutExt = file.name.substring(
              0,
              file.name.lastIndexOf('.')
            ) || file.name;
            
            const ext = outputFormat === 'image/webp' ? '.webp' : '.jpg';
            const compressedFileName = `${originalNameWithoutExt}${ext}`;

            const compressedFile = new File([blob], compressedFileName, {
              type: outputFormat,
              lastModified: Date.now(),
            });

            // Log size comparison for monitoring
            const originalKB = (file.size / 1024).toFixed(1);
            const compressedKB = (compressedFile.size / 1024).toFixed(1);
            console.log(
              `[imageCompressor] compressed "${file.name}" (${originalKB} KB ➔ ${compressedKB} KB, format: ${outputFormat})`
            );

            resolve(compressedFile);
          },
          outputFormat,
          quality
        );
      };

      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
