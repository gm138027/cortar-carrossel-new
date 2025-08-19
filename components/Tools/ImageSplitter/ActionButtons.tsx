import React from 'react';
import { useTranslation } from 'next-i18next';

interface ActionButtonsProps {
  image: HTMLImageElement | null;
  isProcessing: boolean;
  slicedImagesLength: number;
  onSliceImage: () => void;
  onDownloadSlices: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  image,
  isProcessing,
  slicedImagesLength,
  onSliceImage,
  onDownloadSlices
}) => {
  const { t } = useTranslation('common');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <button
          className="h-12 rounded-xl flex items-center justify-center text-base font-semibold border-0 shadow-md bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white hover:from-indigo-600 hover:via-blue-600 hover:to-purple-600 transition-all duration-300"
          onClick={onSliceImage}
          disabled={!image || isProcessing}
        >
          {isProcessing ? t('processing') : t('preview')}
        </button>
        <button
          className="h-12 rounded-xl flex items-center justify-center text-base font-semibold border-2 border-indigo-200 bg-indigo-50 text-indigo-700 shadow hover:bg-indigo-100 hover:border-indigo-400 transition-all duration-300"
          onClick={onDownloadSlices}
          disabled={!slicedImagesLength || isProcessing}
        >
          {t('download')}
        </button>

      </div>
    </div>
  );
};

export default ActionButtons;
