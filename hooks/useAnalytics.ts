import { useCallback } from 'react';

interface ImageUploadEvent {
  file_size: number;
  file_type: string;
  file_name?: string;
}

interface ImageSplitEvent {
  rows: number;
  columns: number;
  total_slices: number;
  image_width?: number;
  image_height?: number;
}

interface DownloadEvent {
  slice_count: number;
  download_type: 'single' | 'batch';
}

interface LanguageChangeEvent {
  from_language: string;
  to_language: string;
}

interface PuzzleModeEvent {
  enabled: boolean;
  grid_size: string;
}

interface PageViewEvent {
  page_title: string;
  page_location: string;
  language: string;
}

export const useAnalytics = () => {
  const trackEvent = useCallback((eventName: string, parameters: any = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'Image Splitter',
        event_label: parameters.label || '',
        value: parameters.value || 0,
        ...parameters,
      });
    }
  }, []);

  // 图片上传事件
  const trackImageUpload = useCallback((data: ImageUploadEvent) => {
    trackEvent('image_upload', {
      event_category: 'User Interaction',
      file_size_kb: Math.round(data.file_size / 1024),
      file_type: data.file_type,
      custom_parameters: {
        file_name: data.file_name,
      }
    });
  }, [trackEvent]);

  // 图片分割事件
  const trackImageSplit = useCallback((data: ImageSplitEvent) => {
    trackEvent('image_split', {
      event_category: 'Core Function',
      rows: data.rows,
      columns: data.columns,
      total_slices: data.total_slices,
      grid_size: `${data.rows}x${data.columns}`,
      custom_parameters: {
        image_width: data.image_width,
        image_height: data.image_height,
      }
    });
  }, [trackEvent]);

  // 下载事件
  const trackDownload = useCallback((data: DownloadEvent) => {
    trackEvent('download_slices', {
      event_category: 'Conversion',
      slice_count: data.slice_count,
      download_type: data.download_type,
      value: data.slice_count, // 用切片数量作为价值指标
    });
  }, [trackEvent]);

  // 语言切换事件
  const trackLanguageChange = useCallback((data: LanguageChangeEvent) => {
    trackEvent('language_change', {
      event_category: 'User Preference',
      from_language: data.from_language,
      to_language: data.to_language,
      label: `${data.from_language}_to_${data.to_language}`,
    });
  }, [trackEvent]);

  // 拼图模式切换
  const trackPuzzleMode = useCallback((data: PuzzleModeEvent) => {
    trackEvent('puzzle_mode_toggle', {
      event_category: 'Feature Usage',
      enabled: data.enabled,
      grid_size: data.grid_size,
      label: data.enabled ? 'enabled' : 'disabled',
    });
  }, [trackEvent]);

  // 页面浏览事件（用于SPA路由）
  const trackPageView = useCallback((data: PageViewEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-F41WJR47SH', {
        page_title: data.page_title,
        page_location: data.page_location,
        custom_map: {
          language: data.language,
        }
      });
    }
  }, []);

  // 自定义事件追踪
  const trackCustomEvent = useCallback((eventName: string, parameters: any = {}) => {
    trackEvent(eventName, parameters);
  }, [trackEvent]);

  return {
    trackImageUpload,
    trackImageSplit,
    trackDownload,
    trackLanguageChange,
    trackPuzzleMode,
    trackPageView,
    trackCustomEvent,
  };
};

export default useAnalytics;