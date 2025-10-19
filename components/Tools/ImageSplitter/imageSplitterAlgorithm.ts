import { saveAs } from "file-saver";
import type { SliceData } from "./types";
import { calculateColumnWidths, calculateRowHeights } from "./gridMath";

export const DEFAULT_JPEG_QUALITY = 0.95;

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("canvas toBlob returned null"));
      }
    }, type, quality);
  });
};

const yieldToMain = async () => {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
};

/**
 * Legacy synchronous slicing. Retained for fallback paths.
 */
export const sliceImageToData = (
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  rows: number,
  columns: number
): SliceData[] => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  canvas.width = canvas.width;
  const originalWidth = image.width;
  const originalHeight = image.height;

  const colWidths = calculateColumnWidths(originalWidth, columns);
  const rowHeights = calculateRowHeights(originalHeight, rows);

  const slices: SliceData[] = [];
  let offsetY = 0;
  for (let row = 0; row < rows; row++) {
    let offsetX = 0;
    for (let col = 0; col < columns; col++) {
      const currentSliceWidth = colWidths[col];
      const currentSliceHeight = rowHeights[row];

      canvas.width = currentSliceWidth;
      canvas.height = currentSliceHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(
        image,
        offsetX,
        offsetY,
        currentSliceWidth,
        currentSliceHeight,
        0,
        0,
        currentSliceWidth,
        currentSliceHeight
      );

      const dataUrl = canvas.toDataURL("image/jpeg", DEFAULT_JPEG_QUALITY);
      slices.push({
        url: dataUrl,
        width: currentSliceWidth,
        height: currentSliceHeight,
        row,
        col,
        originalX: offsetX,
        originalY: offsetY,
        gridPosition: { row, col },
      });

      offsetX += currentSliceWidth;
    }
    offsetY += rowHeights[row];
  }

  return slices;
};

/**
 * Asynchronous slicing on main thread. Serves as fallback when Worker is unavailable.
 */
export const sliceImageToDataAsync = async (
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  rows: number,
  columns: number
): Promise<SliceData[]> => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  canvas.width = canvas.width;
  const originalWidth = image.width;
  const originalHeight = image.height;

  const colWidths = calculateColumnWidths(originalWidth, columns);
  const rowHeights = calculateRowHeights(originalHeight, rows);

  const slices: SliceData[] = [];
  let offsetY = 0;

  for (let row = 0; row < rows; row++) {
    let offsetX = 0;

    for (let col = 0; col < columns; col++) {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          const currentSliceWidth = colWidths[col];
          const currentSliceHeight = rowHeights[row];

          canvas.width = currentSliceWidth;
          canvas.height = currentSliceHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.drawImage(
            image,
            offsetX,
            offsetY,
            currentSliceWidth,
            currentSliceHeight,
            0,
            0,
            currentSliceWidth,
            currentSliceHeight
          );

          const scheduleBlob = async () => {
            try {
              const blob = await canvasToBlob(
                canvas,
                "image/jpeg",
                DEFAULT_JPEG_QUALITY
              );
              const objectUrl = URL.createObjectURL(blob);
              slices.push({
                url: objectUrl,
                width: currentSliceWidth,
                height: currentSliceHeight,
                row,
                col,
                originalX: offsetX,
                originalY: offsetY,
                gridPosition: { row, col },
                blob,
                objectUrl,
                objectUrlSource: "main",
              });
            } catch (error) {
              console.error("canvas toBlob failed, fallback toDataURL", error);
              const dataUrl = canvas.toDataURL(
                "image/jpeg",
                DEFAULT_JPEG_QUALITY
              );
              slices.push({
                url: dataUrl,
                width: currentSliceWidth,
                height: currentSliceHeight,
                row,
                col,
                originalX: offsetX,
                originalY: offsetY,
                gridPosition: { row, col },
              });
            } finally {
              offsetX += currentSliceWidth;
              resolve();
            }
          };

          scheduleBlob();
        });
      });
      await yieldToMain();
    }
    offsetY += rowHeights[row];
  }

  return slices;
};

export const downloadAllSlices = (slicedImages: SliceData[]): void => {
  slicedImages.forEach((slice, index) => {
    const fileName = `carousel-${index + 1}.jpg`;
    if (slice.blob) {
      saveAs(slice.blob, fileName);
    } else {
      saveAs(slice.url, fileName);
    }
  });
};
