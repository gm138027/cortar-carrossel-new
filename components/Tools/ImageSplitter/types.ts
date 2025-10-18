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
  /**
   * 原始切片 Blob 数据，用于下载或进一步处理
   */
  blob?: Blob;
  /**
   * 通过 URL.createObjectURL 生成的预览地址
   */
  objectUrl?: string;
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
