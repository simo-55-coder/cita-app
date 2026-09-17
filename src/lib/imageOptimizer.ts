/**
 * Optimizes an image File into a web-ready, lightweight data URL for CV profile pictures.
 * Automatically downscales large images (e.g. 10MB phone camera shots) to a max dimension
 * of 600px, compressing to high-quality JPEG (~40KB - 80KB).
 * Ensures instant loading, zero localStorage quota issues, and reliable rendering in PDFs.
 */
export async function processProfileImage(file: File): Promise<string> {
  if (!file) {
    throw new Error('لم يتم تحديد أي ملف');
  }

  // Acceptable image types or fallbacks
  if (file.type && !file.type.startsWith('image/')) {
    throw new Error('الملف المحدد ليس ملف صورة صالح');
  }

  const maxDimension = 600;
  const quality = 0.88;

  // Try using createImageBitmap if supported for fast native decoding and auto orientation
  if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      let { width, height } = bitmap;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(bitmap, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        bitmap.close();
        if (dataUrl && dataUrl.startsWith('data:image/')) {
          return dataUrl;
        }
      }
      bitmap.close();
    } catch {
      // Fall through to FileReader fallback
    }
  }

  // Fallback: FileReader + HTMLImageElement
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('تعذر قراءة ملف الصورة'));
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        reject(new Error('فشل في تحميل محتوى الصورة'));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('تعذر معالجة تنسيق الصورة'));
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
          } else {
            resolve(src);
          }
        } catch {
          resolve(src);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}
