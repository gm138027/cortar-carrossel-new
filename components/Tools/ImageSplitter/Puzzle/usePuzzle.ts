import { useState, useCallback, useEffect } from 'react';

// 常量定义
const DRAG_OPACITY = 0.5;

interface PuzzleSlice {
  url: string;
  width: number;
  height: number;
  originalRow: number;  // 原始行位置
  originalCol: number;  // 原始列位置
  currentRow: number;   // 当前行位置
  currentCol: number;   // 当前列位置
}

interface UsePuzzleProps {
  slices: Array<{
    url: string;
    width: number;
    height: number;
    row: number;
    col: number;
  }>;
}

export const usePuzzle = ({ slices }: UsePuzzleProps) => {
  const [puzzleSlices, setPuzzleSlices] = useState<PuzzleSlice[]>([]);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    dragIndex: number;
  } | null>(null);

  // 初始化拼图切片
  useEffect(() => {
    // 处理空数据情况
    if (!slices || slices.length === 0) {
      setPuzzleSlices([]);
      return;
    }

    const initialSlices: PuzzleSlice[] = slices.map(slice => ({
      url: slice.url,
      width: slice.width,
      height: slice.height,
      originalRow: slice.row,
      originalCol: slice.col,
      currentRow: slice.row,
      currentCol: slice.col,
    }));
    setPuzzleSlices(initialSlices);
  }, [slices]);

  // 交换两个切片的位置
  const swapSlices = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setPuzzleSlices(prev => {
      // 验证索引有效性
      if (fromIndex < 0 || fromIndex >= prev.length ||
          toIndex < 0 || toIndex >= prev.length) {
        console.warn('Invalid swap indices:', { fromIndex, toIndex, length: prev.length });
        return prev;
      }

      const newSlices = [...prev];

      // 获取两个切片的当前位置
      const fromSlice = newSlices[fromIndex];
      const toSlice = newSlices[toIndex];

      if (fromSlice && toSlice) {
        // 创建新对象而不是修改现有对象（确保React检测到变化）
        const tempRow = fromSlice.currentRow;
        const tempCol = fromSlice.currentCol;

        // 创建新的切片对象
        newSlices[fromIndex] = {
          ...fromSlice,
          currentRow: toSlice.currentRow,
          currentCol: toSlice.currentCol,
        };

        newSlices[toIndex] = {
          ...toSlice,
          currentRow: tempRow,
          currentCol: tempCol,
        };
      }

      return newSlices;
    });
  }, []);

  // 重置所有位置到初始状态
  const resetPositions = useCallback(() => {
    setPuzzleSlices(prev => 
      prev.map(slice => ({
        ...slice,
        currentRow: slice.originalRow,
        currentCol: slice.originalCol,
      }))
    );
  }, []);

  // HTML5 拖拽API处理函数
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDragState({
      isDragging: true,
      dragIndex: index,
    });

    // 设置拖拽数据
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';

    // 设置拖拽时的视觉效果
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = DRAG_OPACITY.toString();
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    // 恢复拖拽元素的样式
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '';
    }
    setDragState(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();

    try {
      // 从拖拽数据中获取源索引
      const sourceIndexStr = e.dataTransfer.getData('text/plain');
      const sourceIndex = parseInt(sourceIndexStr, 10);

      // 验证索引有效性
      if (isNaN(sourceIndex) || sourceIndex < 0 || sourceIndex >= puzzleSlices.length) {
        console.warn('Invalid source index:', sourceIndex);
        return;
      }

      if (targetIndex < 0 || targetIndex >= puzzleSlices.length) {
        console.warn('Invalid target index:', targetIndex);
        return;
      }

      // 执行切片交换
      if (sourceIndex !== targetIndex) {
        swapSlices(sourceIndex, targetIndex);
      }
    } catch (error) {
      console.error('Error during drag and drop:', error);
    } finally {
      setDragState(null);
    }
  }, [swapSlices, puzzleSlices.length]);

  return {
    puzzleSlices,
    dragState,
    swapSlices,
    resetPositions,
    // HTML5 拖拽API函数
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
  };
};
