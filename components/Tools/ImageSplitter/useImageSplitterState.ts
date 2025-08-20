import { useState, useRef, useCallback } from 'react';
import type { SliceData, DragState } from './types';
import { useAnalytics } from '../../../hooks/business/useAnalytics';
import { sliceImageToData, sliceImageToDataAsync, downloadAllSlices } from './imageSplitterAlgorithm';

export const useImageSplitterState = () => {
  // 基础状态
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const analytics = useAnalytics();
  
  // 业务处理状态
  const [isProcessing, setIsProcessing] = useState(false);

  // 网格设置状态
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(2);

  // 处理图片上传 - 现在只是一个回调函数
  const handleImageUpload = useCallback((img: HTMLImageElement) => {
    // 这个函数现在需要通过参数传递给图片预览Hook
    // 暂时保留空实现
  }, []);

  // 切割图片 - 使用异步处理改善INP性能
  const sliceImage = useCallback(async (image: HTMLImageElement | null, onResult?: (slices: any[]) => void) => {
    if (!image || !canvasRef.current) return;

    setIsProcessing(true);

    try {
      // 使用异步处理改善INP性能（如需回滚，改为 sliceImageToData）
      const slices = await sliceImageToDataAsync(
        image,
        canvasRef.current,
        rows,
        columns
      );

      // 追踪图片分割事件
      analytics.trackImageSplit({
        rows,
        columns,
        total_slices: slices.length,
        image_width: image.width,
        image_height: image.height,
      });

      // 通过回调返回结果
      if (onResult) {
        onResult(slices);
      }

      return slices;
    } catch (error) {
      console.error('图片分割失败:', error);
      return [];
    } finally {
      setIsProcessing(false);
    }
  }, [rows, columns, analytics]);

  // 下载所有切片 - 现在接受切片数据参数
  const downloadSlices = (slicedImages: any[] = []) => {
    // 追踪下载事件
    analytics.trackDownload({
      slice_count: slicedImages.length,
      download_type: 'batch',
    });

    downloadAllSlices(slicedImages);
  };

  // 行列设置变更处理
  const handleRowsChange = (newRows: number) => {
    setRows(newRows);
  };

  const handleColumnsChange = (newColumns: number) => {
    setColumns(newColumns);
  };



  return {
    // 业务状态
    isProcessing,
    rows,
    columns,

    // Refs
    canvasRef,

    // 业务处理函数
    handleImageUpload,
    handleRowsChange,
    handleColumnsChange,
    sliceImage,
    downloadSlices,
  };
};
