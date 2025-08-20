import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../../../hooks/business/useAnalytics';
import ControlPanel from './ControlPanel';
import ImagePreview from './ImagePreview';
import { useImageSplitterState } from './useImageSplitterState';
import { useImagePreviewState } from './useImagePreviewState';
import { usePuzzle } from './Puzzle/usePuzzle';


/**
 * 图片分割工具主入口组件
 * 封装所有业务逻辑，提供完整的图片分割功能
 */
const ImageSplitterTool: React.FC = () => {
  const analytics = useAnalytics();

  // 使用业务逻辑Hook
  const {
    isProcessing,
    rows,
    columns,
    canvasRef,
    handleRowsChange,
    handleColumnsChange,
    sliceImage: businessSliceImage,
    downloadSlices: businessDownloadSlices,
  } = useImageSplitterState();

  // 使用图片预览Hook，传入网格配置
  const imagePreviewState = useImagePreviewState({ rows, columns });

  // 从图片预览状态中获取需要的值 / Get required values from image preview state
  const image = imagePreviewState.originalState.image;
  const slicedImages = imagePreviewState.slicedState.slicedImages;
  const containerRef = imagePreviewState.containerRef;

  // 拼图状态管理（内部解耦）/ Puzzle state management (internally decoupled)
  const [puzzleMode, setPuzzleMode] = useState(false);
  const puzzleState = usePuzzle({
    slices: imagePreviewState.slicesData
  });



  // 🔧 修复：监听网格配置变化，同步更新状态避免抖动
  useEffect(() => {
    // 检查是否需要自动重新分割：
    // 1. 有图片
    // 2. 已经有分割数据（说明用户之前分割过）
    // 3. 不在处理中（避免重复处理）
    if (image && slicedImages.length > 0 && !isProcessing) {
      // 🛡️ 安全修复：清理所有相关状态，防止内存累积
      imagePreviewState.slicedState.clearSlicedImages();
      setPuzzleMode(false); // 重置拼图状态

      // 🛡️ 安全修复：重置Canvas状态，清理内存占用
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.width;
      }

      // 根据图片大小调整延迟时间，大图片需要更多清理时间
      const pixels = image.width * image.height;
      const delay = pixels > 8000000 ? 100 : pixels > 4000000 ? 75 : 50;

      const timeoutId = setTimeout(() => {
        sliceImage();
      }, delay);

      // 清理函数
      return () => clearTimeout(timeoutId);
    }
  }, [rows, columns]); // 只监听网格配置变化

  // 连接两个Hook的处理函数
  const handleImageUpload = (img: HTMLImageElement) => {
    // 🛡️ 安全修复：新图片上传时完全清理所有状态，防止内存累积
    setPuzzleMode(false);
    imagePreviewState.slicedState.clearSlicedImages();

    // 🛡️ 安全修复：重置Canvas状态，清理之前图片的内存占用
    if (canvasRef.current) {
      canvasRef.current.width = canvasRef.current.width;
    }

    imagePreviewState.originalState.updateImage(img);
  };

  const sliceImage = () => {
    const image = imagePreviewState.originalState.image;
    if (!image) return;

    businessSliceImage(image, (slices) => {
      imagePreviewState.slicedState.updateSlicedImages(slices);
      imagePreviewState.slicedState.setGridPreview(true);
    });
  };

  const downloadSlices = () => {
    const slices = imagePreviewState.slicedState.slicedImages;
    businessDownloadSlices(slices);
  };

  // 拼图控制函数（内部解耦）/ Puzzle control functions (internally decoupled)
  const togglePuzzleMode = () => {
    const newPuzzleMode = !puzzleMode;

    // 追踪拼图模式切换事件 / Track puzzle mode toggle event
    analytics.trackPuzzleMode({
      enabled: newPuzzleMode,
      grid_size: `${rows}x${columns}`,
    });

    setPuzzleMode(newPuzzleMode);
  };

  const resetSlicePositions = () => {
    // 重置拼图切片位置 / Reset puzzle slice positions
    if (puzzleMode) {
      puzzleState.resetPositions();
    }
  };





  return (
    <>
      {/* 隐藏的画布用于处理图片 */}
      <canvas ref={canvasRef} className="hidden"></canvas>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* 左侧面板：统一的控制面板 */}
        <div className="md:col-span-5">
          <ControlPanel
            rows={rows}
            columns={columns}
            image={image}
            isProcessing={isProcessing}
            slicedImagesLength={slicedImages.length}
            onRowsChange={handleRowsChange}
            onColumnsChange={handleColumnsChange}
            onSliceImage={sliceImage}
            onDownloadSlices={downloadSlices}
            onImageUpload={handleImageUpload}
            // 拼图控制props（通过props传递，保持解耦）
            puzzleMode={puzzleMode}
            onTogglePuzzleMode={togglePuzzleMode}
            onResetSlicePositions={resetSlicePositions}
          />
        </div>

        {/* 右侧面板：统一的图片预览组件 / Right panel: Unified image preview component */}
        <ImagePreview
          displayState={puzzleMode ? 'puzzle' : imagePreviewState.displayState}
          imageData={imagePreviewState.imageData}
          slicesData={imagePreviewState.slicesData}
          gridConfig={{ rows, columns }}
          displaySize={imagePreviewState.displaySize}
          currentGridConfig={imagePreviewState.currentGridConfig}
          containerRef={containerRef}
          // 拼图模式props（只在拼图模式下传递）
          puzzleSlices={puzzleMode ? puzzleState.puzzleSlices : undefined}
          onPuzzleSliceSwap={puzzleMode ? puzzleState.swapSlices : undefined}
          onPuzzleDragStart={puzzleMode ? puzzleState.handleDragStart : undefined}
          onPuzzleDragOver={puzzleMode ? puzzleState.handleDragOver : undefined}
          onPuzzleDragEnd={puzzleMode ? puzzleState.handleDragEnd : undefined}
          onPuzzleDrop={puzzleMode ? puzzleState.handleDrop : undefined}
        />
      </div>
    </>
  );
};

export default ImageSplitterTool;
