import React, { memo } from 'react';
import { useTranslation } from 'next-i18next';
import type { ImageDisplaySize } from '../../../utils/image/displaySizeCalculator';

interface ImagePreviewProps {
  displayState: 'empty' | 'original' | 'grid' | 'puzzle'; // 添加拼图状态 / Add puzzle state
  imageData?: {
    src: string;
    width: number;
    height: number;
  };
  slicesData?: Array<{
    url: string;
    width: number;
    height: number;
    row: number;
    col: number;
    position?: { x: number; y: number };
    zIndex?: number;
    highlighted?: boolean;
  }>;
  gridConfig?: {
    rows: number;
    columns: number;
  };
  // 新增：统一的显示尺寸信息
  displaySize?: ImageDisplaySize;
  // 当前实际使用的网格配置
  currentGridConfig?: {
    rows: number;
    columns: number;
  };
  containerRef?: React.RefObject<HTMLDivElement>; // 保留容器引用 / Keep container reference

  // 拼图模式专用props / Puzzle mode specific props
  puzzleSlices?: Array<{
    url: string;
    width: number;
    height: number;
    originalRow: number;
    originalCol: number;
    currentRow: number;
    currentCol: number;
  }>;
  onPuzzleSliceSwap?: (fromIndex: number, toIndex: number) => void;
  onPuzzleDragStart?: (e: React.DragEvent, index: number) => void;
  onPuzzleDragOver?: (e: React.DragEvent) => void;
  onPuzzleDragEnd?: (e: React.DragEvent) => void;
  onPuzzleDrop?: (e: React.DragEvent, targetIndex: number) => void;


}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  displayState,
  imageData,
  slicesData = [],
  gridConfig = { rows: 2, columns: 2 },
  displaySize,
  currentGridConfig,
  containerRef,
  // 拼图模式props / Puzzle mode props
  puzzleSlices = [],
  onPuzzleSliceSwap,
  onPuzzleDragStart,
  onPuzzleDragOver,
  onPuzzleDragEnd,
  onPuzzleDrop
}) => {
  const { t } = useTranslation('common');

  // 图片预览容器（白色背景卡片）
  return (
    <div className="md:col-span-7">
      <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 h-full flex flex-col shadow">
        {/* 标题 */}
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-xl font-bold text-black">
            {t('preview_area')}
          </h2>
        </div>
        
        {/* 图片容器 */}
        <div className="flex-grow flex flex-col justify-start overflow-hidden">
          <div
            ref={containerRef}
            className="border-2 border-dashed rounded-xl p-2 relative"
            style={{
              backgroundColor: '#ffffff',
              width: '100%',
              height: '500px',
              overflow: 'hidden', // 🔧 修复：改为hidden避免滚动条闪现
              borderColor: displayState !== 'empty' ? '#6366f1' : '#d1d5db'
            }}
          >
            {/* 根据显示状态渲染不同内容 */}
            {displayState === 'empty' && (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                {t('uploadImageFirst')}
              </div>
            )}

            {displayState === 'original' && imageData && displaySize && (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={imageData.src}
                  alt={t('original_image')}
                  style={{
                    width: `${displaySize.displayWidth}px`,
                    height: `${displaySize.displayHeight}px`,
                    display: 'block'
                  }}
                />
              </div>
            )}

            {displayState === 'grid' && slicesData.length > 0 && imageData && displaySize && (
              <div className="w-full h-full flex items-center justify-center">
                <div
                  style={{
                    width: `${displaySize.displayWidth}px`,
                    height: `${displaySize.displayHeight}px`,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${currentGridConfig?.columns || gridConfig.columns}, 1fr)`,
                    gridTemplateRows: `repeat(${currentGridConfig?.rows || gridConfig.rows}, 1fr)`,
                    backgroundColor: '#ffffff',
                  }}
                >
                  {slicesData.map((slice, index) => (
                    <img
                      key={index}
                      src={slice.url}
                      alt={`Slice ${index + 1}`}
                      style={{
                        width: `${displaySize.sliceWidth}px`,
                        height: `${displaySize.sliceHeight}px`,
                        display: 'block',
                        gridRow: slice.row + 1,
                        gridColumn: slice.col + 1,
                        backgroundColor: 'white',
                        border: '1.5px solid #ffffff',
                        boxSizing: 'border-box',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 拼图模式渲染 / Puzzle mode rendering */}
            {displayState === 'puzzle' && puzzleSlices.length > 0 && displaySize && (
              <div className="w-full h-full flex items-center justify-center">
                <div
                  style={{
                    width: `${displaySize.displayWidth}px`,
                    height: `${displaySize.displayHeight}px`,
                    position: 'relative',
                    backgroundColor: '#ffffff',
                  }}
                  onDragOver={onPuzzleDragOver}
                >
                  {puzzleSlices.map((slice, index) => {
                    // 优化key生成：使用原始位置作为稳定标识符，当前位置作为变化标识符
                    const stableKey = `${slice.originalRow}_${slice.originalCol}_${slice.currentRow}_${slice.currentCol}`;

                    return (
                    <div
                      key={stableKey}
                      data-puzzle-index={index}
                      draggable={true}
                      style={{
                        position: 'absolute',
                        left: slice.currentCol * displaySize.sliceWidth,
                        top: slice.currentRow * displaySize.sliceHeight,
                        width: `${displaySize.sliceWidth}px`,
                        height: `${displaySize.sliceHeight}px`,
                        cursor: 'grab',
                        border: '1px solid #d1d5db',
                        boxSizing: 'border-box',
                        borderRadius: '2px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.2s ease',
                      }}
                      onDragStart={(e) => onPuzzleDragStart?.(e, index)}
                      onDragEnd={(e) => onPuzzleDragEnd?.(e)}
                      onDragOver={(e) => onPuzzleDragOver?.(e)}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onPuzzleDrop?.(e, index);
                      }}
                    >
                      <img
                        src={slice.url}
                        alt={`Puzzle piece ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'block',
                          pointerEvents: 'none',
                        }}
                      />
                      {/* 切片编号（渲染逻辑）/ Slice number (rendering logic) */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '2px',
                          left: '2px',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          fontSize: '12px',
                          padding: '2px 4px',
                          borderRadius: '2px',
                          pointerEvents: 'none',
                        }}
                      >
                        {index + 1}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ImagePreview);
