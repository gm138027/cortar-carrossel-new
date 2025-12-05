import { useState, useRef, useCallback, useEffect } from "react";
import type {
  SliceData,
  SliceWorkerIncomingMessage,
  SliceWorkerOutgoingMessage,
} from "./types";
import { useAnalytics } from "../../../hooks/business/useAnalytics";
import {
  sliceImageToDataAsync,
  downloadAllSlices,
  downloadSingleSlice,
  DEFAULT_JPEG_QUALITY,
} from "./imageSplitterAlgorithm";

const WORKER_SLICE_MIME = "image/jpeg";

type WorkerPendingKind = "prepare" | "slice";

interface WorkerPendingRequest {
  kind: WorkerPendingKind;
  resolve: (value: any) => void;
  reject: (error: Error) => void;
}

interface WorkerControllerState {
  supported: boolean;
  worker: Worker | null;
  pending: Map<string, WorkerPendingRequest>;
  currentRequestId: string | null;
}

const detectWorkerSupport = (): boolean => {
  if (typeof globalThis === "undefined") {
    return false;
  }

  const hasCreateImageBitmap = typeof globalThis.createImageBitmap === "function";
  const hasImageEncoder = typeof (globalThis as { ImageEncoder?: unknown }).ImageEncoder === "function";
  const hasOffscreenCanvas = typeof (globalThis as { OffscreenCanvas?: unknown }).OffscreenCanvas === "function";

  return Boolean(hasCreateImageBitmap && (hasImageEncoder || hasOffscreenCanvas));
};

const createWorkerController = (): WorkerControllerState => ({
  supported: detectWorkerSupport(),
  worker: null,
  pending: new Map(),
  currentRequestId: null,
});

const generateRequestId = () => `slice-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const useImageSplitterState = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analytics = useAnalytics();
  const workerControllerRef = useRef<WorkerControllerState>(createWorkerController());

  const [isProcessing, setIsProcessing] = useState(false);
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(2);
  const preparedImageRef = useRef<{ id: string | null; width: number; height: number } | null>(null);
  const [preparedImageHandle, setPreparedImageHandle] = useState<{ id: string | null; width: number; height: number } | null>(null);

  const ensureWorker = useCallback((): Worker | null => {
    const controller = workerControllerRef.current;
    if (!controller.supported) {
      return null;
    }

    if (controller.worker) {
      return controller.worker;
    }

    try {
      const worker = new Worker(new URL("./workers/imageSplitter.worker.ts", import.meta.url), {
        type: "module",
      });

      worker.onmessage = (event: MessageEvent<SliceWorkerIncomingMessage>) => {
        const message = event.data;
        const controllerState = workerControllerRef.current;
        const payloadId = (message as any).payload?.id;
        if (!payloadId) {
          return;
        }

        const pending = controllerState.pending.get(payloadId);
        if (!pending) {
          return;
        }

        switch (message.type) {
          case "SLICE_RESULT": {
            if (pending.kind !== "slice") {
              return;
            }

            const slices: SliceData[] = message.payload.slices.map((slice) => {
              const objectUrl = URL.createObjectURL(slice.blob);
              return {
                ...slice,
                url: objectUrl,
                blob: slice.blob,
                objectUrl,
                objectUrlSource: "worker" as const,
              };
            });

            if (process.env.NODE_ENV !== "production") {
              console.log("[main] worker result", {
                id: message.payload.id,
                slices: slices.length,
              });
            }

            controllerState.pending.delete(message.payload.id);
            if (controllerState.currentRequestId === message.payload.id) {
              controllerState.currentRequestId = null;
            }

            pending.resolve(slices);
            break;
          }
          case "SLICE_ERROR": {
            controllerState.pending.delete(message.payload.id);
            if (controllerState.currentRequestId === message.payload.id) {
              controllerState.currentRequestId = null;
            }
            pending.reject(new Error(message.payload.error));
            break;
          }
          case "PREPARE_RESULT": {
            if (pending.kind !== "prepare") {
              return;
            }
            controllerState.pending.delete(message.payload.id);
            pending.resolve({
              preparedImageId: message.payload.preparedImageId,
              width: message.payload.width,
              height: message.payload.height,
            });
            break;
          }
          case "PREPARE_ERROR": {
            controllerState.pending.delete(message.payload.id);
            pending.reject(new Error(message.payload.error));
            break;
          }
          case "SLICE_PROGRESS": {
            break;
          }
          default:
            break;
        }
      };

      worker.onerror = (event) => {
        console.error("Image splitter worker error", event.message);
        const controllerState = workerControllerRef.current;
        controllerState.supported = false;

        controllerState.pending.forEach(({ reject }) => {
          reject(new Error(event.message || "worker error"));
        });
        controllerState.pending.clear();
        controllerState.currentRequestId = null;

        worker.terminate();
        controllerState.worker = null;
      };

      controller.worker = worker;
      return worker;
    } catch (error) {
      console.info("Image splitter worker unavailable, falling back to main thread", error);
      const controllerState = workerControllerRef.current;
      controllerState.supported = false;
      controllerState.worker = null;
      controllerState.pending.forEach(({ reject }) => {
        reject(new Error("worker-initialisation-failed"));
      });
      controllerState.pending.clear();
      controllerState.currentRequestId = null;
      return null;
    }
  }, []);

  const releasePreparedImage = useCallback(() => {
    const controller = workerControllerRef.current;
    const handle = preparedImageRef.current;

    if (handle?.id && controller.worker) {
      const releaseMessage: SliceWorkerOutgoingMessage = {
        type: "RELEASE_IMAGE",
        payload: { id: handle.id },
      };
      controller.worker.postMessage(releaseMessage);
    }

    preparedImageRef.current = null;
    setPreparedImageHandle(null);
  }, []);

  useEffect(() => {
    return () => {
      releasePreparedImage();
      const controller = workerControllerRef.current;
      if (controller.worker) {
        controller.worker.terminate();
      }
      controller.pending.forEach(({ reject }) => {
        reject(new Error("hook-unmounted"));
      });
      controller.pending.clear();
      controller.currentRequestId = null;
    };
  }, [releasePreparedImage]);

  const runAnalytics = useCallback(
    (image: HTMLImageElement, sliceCount: number) => {
      analytics.trackImageSplit({
        rows,
        columns,
        total_slices: sliceCount,
        image_width: image.width,
        image_height: image.height,
      });
    },
    [analytics, columns, rows]
  );

  const prepareImageWithWorker = useCallback(
    async (file: File, image: HTMLImageElement) => {
      const controller = workerControllerRef.current;
      const worker = ensureWorker();
      if (!worker) {
        const fallback = { id: null, width: image.width, height: image.height };
        preparedImageRef.current = fallback;
        setPreparedImageHandle(fallback);
        return fallback;
      }

      const buffer = await file.arrayBuffer();
      const requestId = generateRequestId();

      const promise = new Promise<{
        preparedImageId: string;
        width: number;
        height: number;
      }>((resolve, reject) => {
        controller.pending.set(requestId, {
          kind: "prepare",
          resolve,
          reject,
        });
      });

      const message: SliceWorkerOutgoingMessage = {
        type: "PREPARE_IMAGE",
        payload: {
          id: requestId,
          buffer,
          mimeType: file.type,
        },
      };

      worker.postMessage(message, [buffer]);
      const result = await promise;
      const handle = {
        id: result.preparedImageId,
        width: result.width,
        height: result.height,
      };
      preparedImageRef.current = handle;
      setPreparedImageHandle(handle);
      return handle;
    },
    [ensureWorker]
  );

  const sliceImageWithWorker = useCallback(async (preparedImageId: string, dimensions?: { width: number; height: number }): Promise<SliceData[]> => {
    const controller = workerControllerRef.current;
    const worker = ensureWorker();
    if (!worker) {
      throw new Error("worker-unavailable");
    }

    if (controller.currentRequestId && controller.worker) {
      const abortMessage: SliceWorkerOutgoingMessage = {
        type: "ABORT",
        payload: { id: controller.currentRequestId },
      };
      controller.worker.postMessage(abortMessage);
    }

    const requestId = generateRequestId();
    controller.currentRequestId = requestId;

    if (process.env.NODE_ENV !== "production") {
      console.log("[main] send slice request", {
        requestId,
        rows,
        columns,
        preparedImageId,
        width: dimensions?.width,
        height: dimensions?.height,
      });
    }

    const promise = new Promise<SliceData[]>((resolve, reject) => {
      controller.pending.set(requestId, { kind: "slice", resolve, reject });
    });

    const message: SliceWorkerOutgoingMessage = {
      type: "SLICE_REQUEST",
      payload: {
        id: requestId,
        preparedImageId,
        rows,
        columns,
        mimeType: WORKER_SLICE_MIME,
        quality: DEFAULT_JPEG_QUALITY,
      },
    };

    worker.postMessage(message);
    return promise;
  }, [columns, ensureWorker, rows]);

  const sliceImage = useCallback(
    (image: HTMLImageElement | null, onResult?: (slices: SliceData[]) => void) => {
      if (!image) {
        return Promise.resolve<SliceData[]>([]);
      }

      setIsProcessing(true);

      const controller = workerControllerRef.current;
      const shouldUseWorker = controller.supported;
      const preparedHandle = preparedImageRef.current;

      const execute = async (): Promise<SliceData[]> => {
        try {
          let slices: SliceData[];

          if (shouldUseWorker && preparedHandle?.id) {
            try {
              slices = await sliceImageWithWorker(preparedHandle.id, preparedHandle);
            } catch (error) {
              if ((error as Error).message === "aborted") {
                return [];
              }

              console.info("Falling back to main-thread slicing", error);
              const fallbackCanvas = canvasRef.current;
              if (!fallbackCanvas) {
                throw new Error("hidden-canvas-missing");
              }
              slices = await sliceImageToDataAsync(image, fallbackCanvas, rows, columns);
            }
          } else {
            if (shouldUseWorker && !preparedHandle?.id) {
              console.info("Worker preparation missing, using main-thread slicing");
            }
            const fallbackCanvas = canvasRef.current;
            if (!fallbackCanvas) {
              throw new Error("hidden-canvas-missing");
            }
            slices = await sliceImageToDataAsync(image, fallbackCanvas, rows, columns);
          }

          runAnalytics(image, slices.length);
          onResult?.(slices);
          return slices;
        } catch (error) {
          if ((error as Error).message !== "aborted") {
            console.error("Image slicing failed:", error);
          }
          return [];
        } finally {
          setIsProcessing(false);
        }
      };

      const promise = new Promise<SliceData[]>((resolve) => {
        setTimeout(() => {
          execute()
            .then(resolve)
            .catch((error) => {
              if ((error as Error).message !== "aborted") {
                console.error("Image slicing failed:", error);
              }
              resolve([]);
            });
        }, 0);
      });

      return promise;
    },
    [columns, runAnalytics, rows, sliceImageToDataAsync, sliceImageWithWorker]
  );

  const downloadSlices = useCallback(
    async (slicedImages: SliceData[] = []) => {
      analytics.trackDownload({
        slice_count: slicedImages.length,
        download_type: "batch",
      });

      try {
        await downloadAllSlices(slicedImages);
      } catch (error) {
        console.error("Slice download failed", error);
      }
    },
    [analytics]
  );

  const downloadSlice = useCallback(
    async (slice: SliceData, index: number) => {
      analytics.trackDownload({
        slice_count: 1,
        download_type: "single",
      });

      try {
        await downloadSingleSlice(slice, index);
      } catch (error) {
        console.error("Single slice download failed", error);
      }
    },
    [analytics]
  );

  const handleRowsChange = (newRows: number) => {
    setRows(newRows);
  };

  const handleColumnsChange = (newColumns: number) => {
    setColumns(newColumns);
  };

  const handleImageUpload = useCallback(
    (image: HTMLImageElement, file?: File | null) => {
      releasePreparedImage();

      if (!file) {
        const fallbackHandle = { id: null, width: image.width, height: image.height };
        preparedImageRef.current = fallbackHandle;
        setPreparedImageHandle(fallbackHandle);
        setIsProcessing(false);
        return;
      }

      const runPrepare = async () => {
        try {
          await prepareImageWithWorker(file, image);
        } catch (error) {
          console.error("Image preparation failed:", error);
          const fallbackHandle = { id: null, width: image.width, height: image.height };
          preparedImageRef.current = fallbackHandle;
          setPreparedImageHandle(fallbackHandle);
        } finally {
          setIsProcessing(false);
        }
      };

      void runPrepare();
    },
    [prepareImageWithWorker, releasePreparedImage]
  );

  return {
    isProcessing,
    rows,
    columns,
    canvasRef,
    handleImageUpload,
    handleRowsChange,
    handleColumnsChange,
    sliceImage,
    downloadSlices,
    downloadSlice,
  };
};




