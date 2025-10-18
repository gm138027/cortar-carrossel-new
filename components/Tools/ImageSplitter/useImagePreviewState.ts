import { useState, useRef, useMemo, useEffect, startTransition } from 'react';
import { calculateImageDisplaySize, type ImageDisplaySize } from '../../../utils/image/displaySizeCalculator';
import type { SliceData } from './types';

// 原始图片状态管理
const useOriginalImageState = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateImage = (newImage: HTMLImageElement | null) => {
    setImage(newImage);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return {
    image,
    isLoading,
    updateImage,
    setLoading
  };
};

// 分割图片状态管理
const useSlicedImageState = () => {
  const [slicedImages, setSlicedImages] = useState<SliceData[]>([]);
  
  const [showGridPreview, setShowGridPreview] = useState(false);

  const updateSlicedImages = (slices: typeof slicedImages) => {
    // Performance optimisation: use startTransition to lower priority
    startTransition(() => {
      setSlicedImages((previous) => {
        if (previous.length) {
          previous.forEach((slice) => {
            if (slice.objectUrl) {
              URL.revokeObjectURL(slice.objectUrl);
            }
          });
        }
        return slices;
      });
    });
  };

  const setGridPreview = (show: boolean) => {
    // Performance optimisation: use startTransition to lower priority
    startTransition(() => {
      setShowGridPreview(show);
    });
  };

  const clearSlicedImages = () => {
    setSlicedImages((previous) => {
      if (previous.length) {
        previous.forEach((slice) => {
          if (slice.objectUrl) {
            URL.revokeObjectURL(slice.objectUrl);
          }
        });
      }
      return [];
    });
    setShowGridPreview(false);
  };

  return {
    slicedImages,
    showGridPreview,
    updateSlicedImages,
    setGridPreview,
    clearSlicedImages
  };
};

// 主Hook：组合所有状态 / Main Hook: Combine all states
export const useImagePreviewState = (gridConfig?: { rows: number; columns: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 容器尺寸状态
  const [containerSize, setContainerSize] = useState({ width: 600, height: 500 });

  // 监听容器尺寸变化
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width || 600,
          height: rect.height || 500
        });
      }
    };

    // 初始化尺寸
    updateContainerSize();

    // 监听窗口大小变化
    window.addEventListener('resize', updateContainerSize);

    return () => {
      window.removeEventListener('resize', updateContainerSize);
    };
  }, []);

  // 组合两个状态管理 / Combine two state managements
  const originalState = useOriginalImageState();
  const slicedState = useSlicedImageState();

  // 计算当前显示状态 / Calculate current display state
  const displayState: 'empty' | 'original' | 'grid' = useMemo(() => {
    if (!originalState.image) return 'empty';
    if (slicedState.slicedImages.length > 0 && slicedState.showGridPreview) {
      return 'grid';
    }
    return 'original';
  }, [originalState.image, slicedState.slicedImages.length, slicedState.showGridPreview]);

  // 准备传递给UI组件的数据
  const imageData = originalState.image ? {
    src: originalState.image.src,
    width: originalState.image.width,
    height: originalState.image.height
  } : undefined;

  // 计算统一的显示尺寸 / Calculate unified display size
  const displaySize: ImageDisplaySize | undefined = useMemo(() => {
    if (!originalState.image) return undefined;

    // 直接使用容器尺寸状态，避免重复的DOM查询
    const config = {
      containerWidth: containerSize.width,
      containerHeight: containerSize.height,
      padding: 10,
      borderWidth: 2
    };

    // 根据显示状态决定是否使用网格配置 / Decide whether to use grid config based on display state
    // 网格模式需要网格配置来计算切片尺寸
    const shouldUseGrid = displayState === 'grid';
    const currentGridConfig = shouldUseGrid && gridConfig ? gridConfig : undefined;

    return calculateImageDisplaySize(
      originalState.image.width,
      originalState.image.height,
      config,
      currentGridConfig
    );
  }, [originalState.image, containerSize, displayState, gridConfig]);

  // 直接使用切片数据 / Directly use slice data
  const slicesData = slicedState.slicedImages;

  // 计算当前实际使用的网格配置 / Calculate current grid configuration
  const currentGridConfig = useMemo(() => {
    const shouldUseGrid = displayState === 'grid';
    return shouldUseGrid && gridConfig ? gridConfig : undefined;
  }, [displayState, gridConfig]);

  return {
    // 显示状态
    displayState,
    imageData,
    slicesData,
    displaySize,
    currentGridConfig,
    containerRef,
    containerSize,

    // 原始图片状态和方法 / Original image state and methods
    originalState,

    // 分割图片状态和方法 / Split image state and methods
    slicedState
  };
};
