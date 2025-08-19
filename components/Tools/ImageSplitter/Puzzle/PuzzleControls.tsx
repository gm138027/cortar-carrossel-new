import React from 'react';
import { useTranslation } from 'next-i18next';

interface PuzzleControlsProps {
  isProcessing: boolean;
  slicedImagesLength: number;
  puzzleMode: boolean;
  onTogglePuzzleMode: () => void;
  onResetSlicePositions: () => void;
}

const PuzzleControls: React.FC<PuzzleControlsProps> = ({
  isProcessing,
  slicedImagesLength,
  puzzleMode,
  onTogglePuzzleMode,
  onResetSlicePositions
}) => {
  const { t } = useTranslation('common');

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        className="h-12 rounded-xl flex items-center justify-center text-base font-semibold border-2 border-gray-200 bg-gray-50 text-gray-700 shadow hover:bg-gray-100 hover:border-indigo-300 transition-all duration-300"
        onClick={onTogglePuzzleMode}
        disabled={isProcessing || !slicedImagesLength}
      >
        {puzzleMode ? t('exit_puzzle_mode') : t('enter_puzzle_mode')}
      </button>

      <button
        className="h-12 rounded-xl flex items-center justify-center text-base font-semibold border-2 border-gray-200 bg-gray-50 text-gray-700 shadow hover:bg-gray-100 hover:border-indigo-300 transition-all duration-300"
        onClick={onResetSlicePositions}
        disabled={isProcessing || !puzzleMode}
      >
        {t('reset_position')}
      </button>
    </div>
  );
};

export default PuzzleControls;
