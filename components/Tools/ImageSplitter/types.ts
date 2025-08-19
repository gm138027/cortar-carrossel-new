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
