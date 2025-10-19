export interface SlicePosition {
  x: number;
  y: number;
}

export interface SliceData {
  url: string;
  width: number;
  height: number;
  row: number;
  col: number;
  position?: SlicePosition;
  originalX?: number;
  originalY?: number;
  gridPosition: {
    row: number;
    col: number;
  };
  zIndex?: number;
  highlighted?: boolean;
  /** Original slice blob used for download or further processing. */
  blob?: Blob;
  /** Preview URL generated via URL.createObjectURL. */
  objectUrl?: string;
  /** Tracks which pipeline produced the slice (main thread or worker). */
  objectUrlSource?: "main" | "worker";
}

export interface DragState {
  slice: SliceData;
  index: number;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  initialLeft: number;
  initialTop: number;
}

export type SliceWorkerMessageType =
  | "SLICE_REQUEST"
  | "SLICE_RESULT"
  | "SLICE_ERROR"
  | "SLICE_PROGRESS"
  | "ABORT";

export interface SliceWorkerPrepareRequestPayload {
  id: string;
  buffer: ArrayBuffer;
  mimeType?: string;
}

export interface SliceWorkerPrepareResultPayload {
  id: string;
  preparedImageId: string;
  width: number;
  height: number;
}

export interface SliceWorkerRequestPayload {
  id: string;
  preparedImageId: string;
  rows: number;
  columns: number;
  mimeType: string;
  quality: number;
}

export interface SliceWorkerResultPayload {
  id: string;
  slices: Array<
    Omit<SliceData, "objectUrl" | "blob" | "objectUrlSource"> & {
      blob: Blob;
    }
  >;
}

export interface SliceWorkerErrorPayload {
  id: string;
  error: string;
}

export interface SliceWorkerReleasePayload {
  id: string;
}

export interface SliceWorkerProgressPayload {
  id: string;
  completed: number;
  total: number;
}

export type SliceWorkerIncomingMessage =
  | { type: "SLICE_RESULT"; payload: SliceWorkerResultPayload }
  | { type: "SLICE_ERROR"; payload: SliceWorkerErrorPayload }
  | { type: "SLICE_PROGRESS"; payload: SliceWorkerProgressPayload }
  | { type: "PREPARE_RESULT"; payload: SliceWorkerPrepareResultPayload }
  | { type: "PREPARE_ERROR"; payload: SliceWorkerErrorPayload };

export type SliceWorkerOutgoingMessage =
  | { type: "PREPARE_IMAGE"; payload: SliceWorkerPrepareRequestPayload }
  | { type: "SLICE_REQUEST"; payload: SliceWorkerRequestPayload }
  | { type: "RELEASE_IMAGE"; payload: SliceWorkerReleasePayload }
  | { type: "ABORT"; payload: { id: string } };
