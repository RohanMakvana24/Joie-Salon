import type { BookPageSpec } from '../data/lookbookBooks';

const imagePromiseCache = new Map<string, Promise<HTMLImageElement>>();

export function loadGalleryImage(src: string): Promise<HTMLImageElement> {
  const existing = imagePromiseCache.get(src);
  if (existing) return existing;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      if (typeof img.decode === 'function') {
        img.decode().then(() => resolve(img), () => resolve(img));
      } else {
        resolve(img);
      }
    };
    img.onerror = () => {
      imagePromiseCache.delete(src);
      reject(new Error(`Failed to load lookbook image: ${src}`));
    };
    img.src = src;
  });

  imagePromiseCache.set(src, promise);
  return promise;
}

export function getLookbookPageImageSources(page: BookPageSpec): string[] {
  const sources = new Set<string>();
  if (page.primaryItem) sources.add(page.primaryItem.image);
  page.collageItems?.forEach((item) => sources.add(item.image));
  page.indexItems?.forEach((item) => sources.add(item.image));
  return [...sources];
}
