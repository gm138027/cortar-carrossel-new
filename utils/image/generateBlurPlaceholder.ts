import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import type { ImageProps } from "../core/types";

const cache = new Map<ImageProps, string>();

export default async function getBase64ImageUrl(
  image: ImageProps,
): Promise<string> {
  let url = cache.get(image);
  if (url) {
    return url;
  }

  try {
    const response = await fetch(
      `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_jpg,w_8,q_70/${image.public_id}.${image.format}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const minified = await imagemin.buffer(Buffer.from(buffer), {
      plugins: [imageminJpegtran()],
    });

    url = `data:image/jpeg;base64,${Buffer.from(minified).toString("base64")}`;
    cache.set(image, url);
    return url;
  } catch (error) {
    console.warn('Failed to generate blur placeholder:', error);
    // 返回一个简单的灰色占位符
    const fallbackPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgOCA4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4=';
    cache.set(image, fallbackPlaceholder);
    return fallbackPlaceholder;
  }
}
