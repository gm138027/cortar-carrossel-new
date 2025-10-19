import { calculateColumnWidths, calculateRowHeights } from "../gridMath";
import type {
  SliceWorkerIncomingMessage,
  SliceWorkerOutgoingMessage,
  SliceWorkerRequestPayload,
  SliceWorkerResultPayload,
  SliceWorkerErrorPayload,
  SliceWorkerPrepareRequestPayload,
  SliceWorkerPrepareResultPayload,
  SliceWorkerReleasePayload,
} from "../types";

declare const self: any;

interface SliceTaskState {
  id: string;
  aborted: boolean;
}

interface PreparedImageEntry {
  blob: Blob;
  width: number;
  height: number;
}

const DEFAULT_MIME = "image/jpeg";
const DEFAULT_QUALITY = 0.95;

const state: { currentTask: SliceTaskState | null } = {
  currentTask: null,
};

const preparedImages = new Map<string, PreparedImageEntry>();

const postResult = (payload: SliceWorkerResultPayload) => {
  const message: SliceWorkerIncomingMessage = {
    type: "SLICE_RESULT",
    payload,
  };
  self.postMessage(message);
};

const postError = (payload: SliceWorkerErrorPayload) => {
  const message: SliceWorkerIncomingMessage = {
    type: "SLICE_ERROR",
    payload,
  };
  self.postMessage(message);
};

const postPrepareResult = (payload: SliceWorkerPrepareResultPayload) => {
  const message: SliceWorkerIncomingMessage = {
    type: "PREPARE_RESULT",
    payload,
  };
  self.postMessage(message);
};

const postPrepareError = (payload: SliceWorkerErrorPayload) => {
  const message: SliceWorkerIncomingMessage = {
    type: "PREPARE_ERROR",
    payload,
  };
  self.postMessage(message);
};

const withAbortGuard = (taskId: string, fn: () => void) => {
  if (state.currentTask && state.currentTask.id === taskId) {
    fn();
  }
};

const getTaskAbortSignal = (taskId: string) => {
  return () =>
    Boolean(!state.currentTask || state.currentTask.id !== taskId || state.currentTask.aborted);
};

const convertCanvasToBlob = async (
  canvas: any,
  mimeType: string,
  quality: number
): Promise<Blob> => {
  if (typeof canvas.convertToBlob === "function") {
    return canvas.convertToBlob({ type: mimeType, quality });
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob?.((blob: Blob | null) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("convertToBlob/toBlob returned null"));
      }
    }, mimeType, quality);
  });
};

const encodeWithWebCodecs = async (
  sourceBitmap: ImageBitmap,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  mimeType: string,
  quality: number
): Promise<Blob> => {
  const ImageEncoderCtor = (self as any).ImageEncoder as
    | undefined
    | (new (config: { type: string; quality?: number }) => {
        encode: (bitmap: ImageBitmap) => Promise<any>;
      });

  if (!ImageEncoderCtor || typeof self.createImageBitmap !== "function") {
    throw new Error("webcodecs-unavailable");
  }

  const sliceBitmap = await self.createImageBitmap(sourceBitmap, sx, sy, sw, sh);

  try {
    const encoder = new ImageEncoderCtor({ type: mimeType, quality });
    const result = await encoder.encode(sliceBitmap);
    if (result instanceof Blob) {
      return result;
    }
    throw new Error("ImageEncoder returned unexpected result");
  } finally {
    sliceBitmap.close();
  }
};

const handlePrepareRequest = async ({
  id,
  buffer,
  mimeType,
}: SliceWorkerPrepareRequestPayload) => {
  try {
    if (typeof self.createImageBitmap !== "function") {
      throw new Error("createImageBitmap unavailable in worker");
    }

    const blob = new Blob([buffer], { type: mimeType || DEFAULT_MIME });
    const bitmap = await self.createImageBitmap(blob);

    preparedImages.set(id, {
      blob,
      width: bitmap.width,
      height: bitmap.height,
    });

    postPrepareResult({
      id,
      preparedImageId: id,
      width: bitmap.width,
      height: bitmap.height,
    });

    bitmap.close();
  } catch (error) {
    postPrepareError({
      id,
      error: (error as Error).message ?? "prepare failed",
    });
  }
};

const handleSliceRequest = async ({
  id,
  preparedImageId,
  rows,
  columns,
  mimeType,
  quality,
}: SliceWorkerRequestPayload) => {
  if (state.currentTask && state.currentTask.id !== id) {
    state.currentTask.aborted = true;
  }

  state.currentTask = { id, aborted: false };
  const isAborted = getTaskAbortSignal(id);

  let preparedBitmap: ImageBitmap | null = null;

  try {
    const entry = preparedImages.get(preparedImageId);
    if (!entry) {
      throw new Error("prepared-image-missing");
    }

    preparedBitmap = await self.createImageBitmap(entry.blob);

    const totalWidth = entry.width;
    const totalHeight = entry.height;

    const colWidths = calculateColumnWidths(totalWidth, columns);
    const rowHeights = calculateRowHeights(totalHeight, rows);

    const slices: SliceWorkerResultPayload["slices"] = [];
    const supportsWebCodecs = typeof (self as any).ImageEncoder === "function";

    const OffscreenCanvasCtor = (self as any).OffscreenCanvas as
      | undefined
      | ({ new (width: number, height: number): any });

    const useCanvasFallback = !supportsWebCodecs;
    const canvas =
      useCanvasFallback && OffscreenCanvasCtor
        ? new OffscreenCanvasCtor(totalWidth, totalHeight)
        : null;
    const ctx = canvas ? canvas.getContext("2d") : null;

    if (useCanvasFallback && (!canvas || !ctx)) {
      throw new Error("OffscreenCanvas constructor unavailable");
    }

    let offsetY = 0;
    for (let row = 0; row < rows; row++) {
      if (isAborted()) {
        throw new Error("aborted");
      }

      let offsetX = 0;
      for (let col = 0; col < columns; col++) {
        if (isAborted()) {
          throw new Error("aborted");
        }

        const sliceWidth = colWidths[col];
        const sliceHeight = rowHeights[row];

        const targetMime = mimeType || DEFAULT_MIME;
        const targetQuality = quality ?? DEFAULT_QUALITY;

        let blob: Blob;

        if (supportsWebCodecs) {
          blob = await encodeWithWebCodecs(
            preparedBitmap,
            offsetX,
            offsetY,
            sliceWidth,
            sliceHeight,
            targetMime,
            targetQuality
          );
        } else {
          if (!canvas || !ctx) {
            throw new Error("OffscreenCanvas constructor unavailable");
          }

          canvas.width = sliceWidth;
          canvas.height = sliceHeight;
          ctx.clearRect(0, 0, sliceWidth, sliceHeight);
          ctx.drawImage(
            preparedBitmap,
            offsetX,
            offsetY,
            sliceWidth,
            sliceHeight,
            0,
            0,
            sliceWidth,
            sliceHeight
          );

          blob = await convertCanvasToBlob(canvas, targetMime, targetQuality);
        }

        slices.push({
          url: "",
          width: sliceWidth,
          height: sliceHeight,
          row,
          col,
          originalX: offsetX,
          originalY: offsetY,
          gridPosition: { row, col },
          blob,
        });

        offsetX += sliceWidth;
      }

      offsetY += rowHeights[row];
    }

    postResult({ id, slices });
  } catch (error) {
    postError({ id, error: (error as Error).message ?? "unknown error" });
  } finally {
    preparedBitmap?.close?.();
    withAbortGuard(id, () => {
      state.currentTask = null;
    });
  }
};

const handleAbort = (requestId: string) => {
  if (!state.currentTask) {
    return;
  }
  if (state.currentTask.id !== requestId) {
    return;
  }
  state.currentTask.aborted = true;
};

self.onmessage = (event: MessageEvent<SliceWorkerOutgoingMessage>) => {
  const { data } = event;

  switch (data.type) {
    case "PREPARE_IMAGE": {
      void handlePrepareRequest(data.payload as SliceWorkerPrepareRequestPayload);
      break;
    }
    case "SLICE_REQUEST": {
      void handleSliceRequest(data.payload as SliceWorkerRequestPayload);
      break;
    }
    case "RELEASE_IMAGE": {
      const payload = data.payload as SliceWorkerReleasePayload;
      preparedImages.delete(payload.id);
      break;
    }
    case "ABORT": {
      handleAbort(data.payload.id);
      break;
    }
    default:
      break;
  }
};

