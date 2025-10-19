import React from 'react';
import { useTranslation } from 'next-i18next';
import ImageUploader from './ImageUploader';
import SplitSettings from './SplitSettings';
import ActionButtons from './ActionButtons';
import PuzzleControls from './Puzzle/PuzzleControls';

interface ControlPanelProps {
  rows: number;
  columns: number;
  image: HTMLImageElement | null;
  isProcessing: boolean;
  slicedImagesLength: number;
  onRowsChange: (newRows: number) => void;
  onColumnsChange: (newColumns: number) => void;
  onSliceImage: () => void;
  onDownloadSlices: () => void;
  onImageUpload: (image: HTMLImageElement, file: File) => void;
  // 拼图控制props（通过props传递，保持解耦）
  puzzleMode?: boolean;
  onTogglePuzzleMode?: () => void;
  onResetSlicePositions?: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  rows,
  columns,
  image,
  isProcessing,
  slicedImagesLength,
  onRowsChange,
  onColumnsChange,
  onSliceImage,
  onDownloadSlices,
  onImageUpload,
  // 拼图控制props（可选，保持解耦）
  puzzleMode = false,
  onTogglePuzzleMode,
  onResetSlicePositions
}) => {
  const { t } = useTranslation('common');

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 h-full shadow border border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-center border-b border-gray-200 pb-3 text-black">
        {t('settings')}
      </h2>

      {/* 上传区域 */}
      <ImageUploader onImageUpload={onImageUpload} />

      {/* 分割线 */}
      <div className="my-4 border-t border-gray-200"></div>

      {/* 分割设置组件 */}
      <SplitSettings
        rows={rows}
        columns={columns}
        onRowsChange={onRowsChange}
        onColumnsChange={onColumnsChange}
      />

      {/* 分割线 */}
      <div className="my-4 border-t border-gray-200"></div>

      {/* 按钮组件 */}
      <ActionButtons
        image={image}
        isProcessing={isProcessing}
        slicedImagesLength={slicedImagesLength}
        onSliceImage={onSliceImage}
        onDownloadSlices={onDownloadSlices}
      />

      {/* 拼图控制按钮（独立组件，通过props解耦，始终显示） */}
      {onTogglePuzzleMode && onResetSlicePositions && (
        <div className="mt-4">
          <PuzzleControls
            isProcessing={isProcessing}
            slicedImagesLength={slicedImagesLength}
            puzzleMode={puzzleMode}
            onTogglePuzzleMode={onTogglePuzzleMode}
            onResetSlicePositions={onResetSlicePositions}
          />
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
