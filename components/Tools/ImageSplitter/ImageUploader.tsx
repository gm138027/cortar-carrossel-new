import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'next-i18next';
import { useAnalytics } from '../../../hooks/business/useAnalytics';

interface ImageUploaderProps {
  onImageUpload: (image: HTMLImageElement) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const { t } = useTranslation('common');
  const analytics = useAnalytics();

  // 处理图片上传
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // 追踪图片上传事件
      analytics.trackImageUpload({
        file_size: file.size,
        file_type: file.type,
        file_name: file.name,
      });
      
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const img = new window.Image();
        img.onload = function() {
          onImageUpload(img);
        };
        img.src = e.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    }
  }, [analytics, onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false
  });

  return (
    <div className="mb-8">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed ${
          isDragActive ? 'border-indigo-400 bg-white/80' : 'border-gray-300'
        } rounded-xl p-4 text-center cursor-pointer h-[104px] flex items-center justify-center transition-all duration-300 hover:border-indigo-500 hover:bg-white/90 backdrop-blur-md bg-white/60`}
      >
        <input {...getInputProps()} />
        <p className="text-base font-bold text-gray-700 flex flex-col items-center">
          <span className="text-lg mb-1">{t('upload')}</span>
          <span className="text-xs text-gray-500">{t('dropzone')}</span>
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;
