import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
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
  const { t } = useTranslation('common');
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

  // 使用图片预览Hook，传入网格配置 - 使用useMemo优化
  const gridConfig = useMemo(() => ({ rows, columns }), [rows, columns]);
  const imagePreviewState = useImagePreviewState(gridConfig);

  // 从图片预览状态中获取需要的值 / Get required values from image preview state
  const image = imagePreviewState.originalState.image;
  const slicedImages = imagePreviewState.slicedState.slicedImages;
  const containerRef = imagePreviewState.containerRef;

  // 拼图状态管理（内部解耦）/ Puzzle state management (internally decoupled)
  const [puzzleMode, setPuzzleMode] = useState(false);

  // 使用useMemo优化拼图数据计算
  const puzzleSlices = useMemo(() => imagePreviewState.slicesData, [imagePreviewState.slicesData]);
  const puzzleState = usePuzzle({ slices: puzzleSlices });



  // 🔧 修复：监听网格配置变化，同步更新状态避免抖动
  useEffect(() => {
    // 检查是否需要自动重新分割：
    // 1. 有图片
    // 2. 已经有分割数据（说明用户之前分割过）
    // 3. 不在处理中（避免重复处理）
    if (image && slicedImages.length > 0 && !isProcessing) {
      // 🎯 关键修复：立即清除旧的分割数据，避免显示不一致状态
      // 这样会让显示状态回到'original'，显示原图而不是错误的网格
      imagePreviewState.slicedState.clearSlicedImages();

      // 短暂延迟后重新分割，让用户看到平滑的过渡
      // 从 旧网格 → 原图 → 新网格，而不是 旧网格 → 错误网格 → 新网格
      const timeoutId = setTimeout(() => {
        sliceImage();
      }, 50); // 50ms的短暂延迟，提供平滑过渡

      // 清理函数
      return () => clearTimeout(timeoutId);
    }
  }, [rows, columns]); // 只监听网格配置变化

  // 连接两个Hook的处理函数
  const handleImageUpload = (img: HTMLImageElement) => {
    // 上传新图片时自动退出拼图模式
    setPuzzleMode(false);

    imagePreviewState.originalState.updateImage(img);
    imagePreviewState.slicedState.clearSlicedImages();
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
