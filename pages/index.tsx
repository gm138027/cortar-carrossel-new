import { useRef, useState, useCallback, useEffect } from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useDropzone } from 'react-dropzone';
import { saveAs } from 'file-saver';
import Bridge from "../components/Icons/Bridge";
import Link from 'next/link';
import { useAnalytics } from '../hooks/business/useAnalytics';

interface SlicePosition {
  x: number;
  y: number;
}

interface SliceData {
  url: string;
  width: number;
  height: number;
  row: number;
  col: number;
  position?: SlicePosition;
  originalX?: number;
  originalY?: number;
  gridPosition: {
    row: number;
    col: number;
  };
  zIndex?: number;
  highlighted?: boolean;
}

interface DragState {
  slice: SliceData;
  index: number;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  initialLeft: number;
  initialTop: number;
}

const Home: NextPage = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation('common');
  const analytics = useAnalytics();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(2);
  const [slicedImages, setSlicedImages] = useState<SliceData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showGridPreview, setShowGridPreview] = useState(false);
  const [puzzleMode, setPuzzleMode] = useState(false);
  const [activeSlice, setActiveSlice] = useState<number | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [highlightedSlice, setHighlightedSlice] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  
  // 语言切换功能
  const changeLanguage = (locale: string) => {
    const currentLocale = router.locale || 'pt';
    
    // 追踪语言切换事件
    analytics.trackLanguageChange({
      from_language: currentLocale,
      to_language: locale,
    });
    
    router.push(router.pathname, router.asPath, { locale });
  };
  
  // 用于记录已初始化的状态，确保翻译正确加载
  useEffect(() => {
    if (i18n.isInitialized) {
      console.log(`i18n 已初始化，当前语言: ${router.locale}`);
      console.log(`page_title 翻译: ${t('page_title')}`);
      console.log(`site_name 翻译: ${t('site_name')}`);
    }
  }, [i18n.isInitialized, router.locale, t]);

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
          setImage(img);
          setSlicedImages([]);
          setShowGridPreview(false);
        };
        img.src = e.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    }
  }, [analytics]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false
  });

  // 查找给定坐标下的切片索引
  const findSliceAtPosition = (x: number, y: number): number => {
    // 考虑缩放因素
    const scale = image ? Math.min(1, 400 / image.height, (window.innerWidth-100) / image.width) : 1;
    
    // 获取网格行列数
    const gridRows = rows;
    const gridCols = columns;
    
    if (!image) return -1;
    
    // 计算每个网格的大小
    const gridWidth = image.width / gridCols;
    const gridHeight = image.height / gridRows;
    
    // 计算鼠标所在的网格行列
    const gridCol = Math.floor(x / gridWidth);
    const gridRow = Math.floor(y / gridHeight);
    
    // 确保网格坐标在有效范围内
    if (gridCol < 0 || gridCol >= gridCols || gridRow < 0 || gridRow >= gridRows) {
      return -1;
    }
    
    // 查找该网格位置对应的切片
    for (let i = 0; i < slicedImages.length; i++) {
      if (dragState && i === dragState.index) continue; // 跳过当前拖动的切片
      
      const slice = slicedImages[i];
      if (slice.gridPosition.row === gridRow && slice.gridPosition.col === gridCol) {
        return i;
      }
    }
    
    return -1;
  };

  // 获取指定网格位置的切片索引
  const getSliceAtGridPosition = (row: number, col: number): number => {
    for (let i = 0; i < slicedImages.length; i++) {
      const slice = slicedImages[i];
      if (slice.gridPosition.row === row && slice.gridPosition.col === col) {
        return i;
      }
    }
    return -1;
  };

  // 交换两个切片的位置
  const swapSlices = (sourceIndex: number, targetIndex: number) => {
    if (sourceIndex === targetIndex) return;
    
    console.log(`尝试交换切片 ${sourceIndex + 1} 和 ${targetIndex + 1}`);
    
    setSlicedImages(prevSlices => {
      const newSlices = [...prevSlices];
      
      // 获取源切片和目标切片
      const sourceSlice = {...newSlices[sourceIndex]};
      const targetSlice = {...newSlices[targetIndex]};
      
      // 交换网格位置
      const sourceGridPos = {...sourceSlice.gridPosition};
      const targetGridPos = {...targetSlice.gridPosition};
      
      // 计算位置坐标
      const sourceX = targetGridPos.col * sourceSlice.width;
      const sourceY = targetGridPos.row * sourceSlice.height;
      const targetX = sourceGridPos.col * targetSlice.width;
      const targetY = sourceGridPos.row * targetSlice.height;
      
      // 更新源切片
      newSlices[sourceIndex] = {
        ...sourceSlice,
        gridPosition: targetGridPos,
        position: { x: sourceX, y: sourceY },
        originalX: sourceX,
        originalY: sourceY,
        zIndex: 1
      };
      
      // 更新目标切片
      newSlices[targetIndex] = {
        ...targetSlice,
        gridPosition: sourceGridPos,
        position: { x: targetX, y: targetY },
        originalX: targetX,
        originalY: targetY,
        zIndex: 1
      };
      
      return newSlices;
    });
  };

  // 重置所有高亮状态
  const resetHighlights = () => {
    setSlicedImages(prevSlices => 
      prevSlices.map(slice => ({
        ...slice,
        highlighted: false
      }))
    );
    setHighlightedSlice(null);
  };

  // 鼠标事件处理函数
  const handleMouseDown = (event: React.MouseEvent, index: number) => {
    if (!puzzleMode) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    // 获取当前切片
    const slice = slicedImages[index];
    
    // 获取切片在DOM中的位置
    const sliceElement = event.currentTarget as HTMLElement;
    const sliceRect = sliceElement.getBoundingClientRect();
    
    // 容器位置
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    // 鼠标相对于切片的偏移
    const offsetX = event.clientX - sliceRect.left;
    const offsetY = event.clientY - sliceRect.top;
    
    // 切片当前位置
    const position = slice.position || { x: slice.originalX || 0, y: slice.originalY || 0 };
    
    // 创建拖拽状态
    setDragState({
      slice,
      index,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: offsetX,
      offsetY: offsetY,
      initialLeft: position.x,
      initialTop: position.y
    });
    
    setActiveSlice(index);
    
    // 提高被拖动切片的层级
    setSlicedImages(prevSlices => {
      return prevSlices.map((s, i) => ({
        ...s,
        zIndex: i === index ? 100 : 1,
        highlighted: false
      }));
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!puzzleMode || !dragState) return;
    
    event.preventDefault();
    
    // 容器位置
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    // 计算缩放比例
    const scale = image ? Math.min(1, 400 / image.height, (window.innerWidth-100) / image.width) : 1;
    
    // 计算鼠标移动的距离
    const deltaX = (event.clientX - dragState.startX) / scale;
    const deltaY = (event.clientY - dragState.startY) / scale;
    
    // 设置新位置，直接基于初始位置加上移动距离
    const newX = dragState.initialLeft + deltaX;
    const newY = dragState.initialTop + deltaY;
    
    // 计算当前鼠标在哪个网格位置（切片中心点）
    const centerX = newX + dragState.slice.width / 2;
    const centerY = newY + dragState.slice.height / 2;
    
    const gridCol = Math.floor(centerX / dragState.slice.width);
    const gridRow = Math.floor(centerY / dragState.slice.height);
    
    // 查找是否有其他切片在该网格位置
    let targetIndex = -1;
    if (gridCol >= 0 && gridCol < columns && gridRow >= 0 && gridRow < rows) {
      for (let i = 0; i < slicedImages.length; i++) {
        if (i === dragState.index) continue;
        
        const slice = slicedImages[i];
        if (slice.gridPosition.row === gridRow && slice.gridPosition.col === gridCol) {
          targetIndex = i;
          break;
        }
      }
    }
    
    // 更新高亮状态
    if (targetIndex !== -1 && targetIndex !== highlightedSlice) {
      setHighlightedSlice(targetIndex);
      setSlicedImages(prevSlices => {
        return prevSlices.map((slice, i) => ({
          ...slice,
          highlighted: i === targetIndex
        }));
      });
    } else if (targetIndex === -1 && highlightedSlice !== null) {
      resetHighlights();
    }
    
    // 更新切片位置
    setSlicedImages(prevSlices => {
      return prevSlices.map((slice, i) => {
        if (i !== dragState.index) return slice;
        
        return {
          ...slice,
          position: { x: newX, y: newY }
        };
      });
    });
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    if (!puzzleMode || !dragState) return;
    
    event.preventDefault();
    
    // 重置高亮状态
    const targetIndex = highlightedSlice;
    resetHighlights();
    
    if (targetIndex !== null) {
      // 执行切片交换
      console.log(`交换切片 ${dragState.index + 1} 和切片 ${targetIndex + 1}`);
      swapSlicesAndPositions(dragState.index, targetIndex);
    } else {
      // 没有目标切片，重置当前切片位置
      resetSliceToGridPosition(dragState.index);
    }
    
    // 重置拖拽状态
    resetDragState();
  };

  // 交换两个切片的位置和内容
  const swapSlicesAndPositions = (sourceIndex: number, targetIndex: number) => {
    if (sourceIndex === targetIndex) return;
    
    setSlicedImages(prevSlices => {
      const newSlices = [...prevSlices];
      
      // 获取源切片和目标切片
      const sourceSlice = {...newSlices[sourceIndex]};
      const targetSlice = {...newSlices[targetIndex]};
      
      // 交换网格位置
      const sourceGridPos = {...sourceSlice.gridPosition};
      const targetGridPos = {...targetSlice.gridPosition};
      
      // 计算网格位置对应的实际坐标
      const sourceX = targetGridPos.col * sourceSlice.width;
      const sourceY = targetGridPos.row * sourceSlice.height;
      const targetX = sourceGridPos.col * targetSlice.width;
      const targetY = sourceGridPos.row * targetSlice.height;
      
      // 更新源切片
      newSlices[sourceIndex] = {
        ...sourceSlice,
        gridPosition: targetGridPos,
        position: { x: sourceX, y: sourceY },
        originalX: sourceX,
        originalY: sourceY,
        zIndex: 1,
        highlighted: false
      };
      
      // 更新目标切片
      newSlices[targetIndex] = {
        ...targetSlice,
        gridPosition: sourceGridPos,
        position: { x: targetX, y: targetY },
        originalX: targetX,
        originalY: targetY,
        zIndex: 1,
        highlighted: false
      };
      
      return newSlices;
    });
  };

  // 重置拖拽状态
  const resetDragState = () => {
    setActiveSlice(null);
    setDragState(null);
  };
  
  // 重置单个切片到其网格位置
  const resetSliceToGridPosition = (sliceIndex: number) => {
    setSlicedImages(prevSlices => {
      return prevSlices.map((slice, i) => {
        if (i !== sliceIndex) return slice;
        
        const row = slice.gridPosition.row;
        const col = slice.gridPosition.col;
        
        // 计算网格位置对应的坐标
        const x = col * slice.width;
        const y = row * slice.height;
        
        return {
          ...slice,
          position: { x, y },
          originalX: x,
          originalY: y,
          zIndex: 1
        };
      });
    });
  };
  
  // 重置所有切片位置到初始位置
  const resetSlicePositions = () => {
    setSlicedImages(prevSlices => {
      return prevSlices.map((slice, index) => {
        // 使用初始顺序，而不是当前的网格位置
        const rowIndex = Math.floor(index / columns);
        const colIndex = index % columns;
        
        // 计算网格位置对应的坐标
        const x = colIndex * slice.width;
        const y = rowIndex * slice.height;
        
        return {
          ...slice,
          position: { x, y },
          originalX: x,
          originalY: y,
          zIndex: 1,
          // 重置网格位置到初始状态
          gridPosition: {
            row: rowIndex,
            col: colIndex
          }
        };
      });
    });
  };

  // 切换拼图模式
  const togglePuzzleMode = () => {
    const newPuzzleMode = !puzzleMode;
    
    // 追踪拼图模式切换事件
    analytics.trackPuzzleMode({
      enabled: newPuzzleMode,
      grid_size: `${rows}x${columns}`,
    });
    
    if (puzzleMode) {
      // 退出拼图模式，重置图片顺序
      setPuzzleMode(false);
      resetSlicePositions();
    } else {
      // 进入拼图模式
      setPuzzleMode(true);
      
      // 初始化拼图模式：为每个切片设置网格位置
      setSlicedImages(prevSlices => {
        return prevSlices.map((slice, index) => {
          const rowIndex = Math.floor(index / columns);
          const colIndex = index % columns;
          
          // 计算网格中的位置坐标
          const x = colIndex * slice.width;
          const y = rowIndex * slice.height;
          
          return {
            ...slice,
            originalX: x,
            originalY: y,
            position: { x, y },
            gridPosition: {
              row: rowIndex,
              col: colIndex
            },
            zIndex: 1
          };
        });
      });
    }
  };

  // 切割图片
  const sliceImage = useCallback(() => {
    if (!image || !canvasRef.current) return;
    setIsProcessing(true);
    setShowGridPreview(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const originalWidth = image.width;
    const originalHeight = image.height;
    
    console.log(`原图尺寸: ${originalWidth}x${originalHeight}, 分割设置: ${rows}行x${columns}列`);
    
    // 计算每一列的宽度（最后一列可能不同）
    const colWidths = Array.from({ length: columns }, (_, x) => {
      const width = x === columns - 1 
        ? originalWidth - Math.floor(originalWidth / columns) * (columns - 1) 
        : Math.floor(originalWidth / columns);
      console.log(`列 ${x+1} 宽度: ${width}px`);
      return width;
    });
    
    // 计算每一行的高度（最后一行可能不同）
    const rowHeights = Array.from({ length: rows }, (_, y) => {
      const height = y === rows - 1 
        ? originalHeight - Math.floor(originalHeight / rows) * (rows - 1) 
        : Math.floor(originalHeight / rows);
      console.log(`行 ${y+1} 高度: ${height}px`);
      return height;
    });
    
    const slices: SliceData[] = [];
    let offsetY = 0;
    for (let y = 0; y < rows; y++) {
      let offsetX = 0;
      for (let x = 0; x < columns; x++) {
        const currentSliceWidth = colWidths[x];
        const currentSliceHeight = rowHeights[y];
        
        console.log(`生成切片: 行=${y+1}, 列=${x+1}, 宽=${currentSliceWidth}px, 高=${currentSliceHeight}px, 偏移=(${offsetX},${offsetY})`);
        
        canvas.width = currentSliceWidth;
        canvas.height = currentSliceHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 明确传递像素位置和尺寸，避免任何舍入误差
        ctx.drawImage(
          image,
          offsetX,
          offsetY,
          currentSliceWidth,
          currentSliceHeight,
          0,
          0,
          currentSliceWidth,
          currentSliceHeight
        );
        
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        slices.push({ 
          url: dataUrl, 
          width: currentSliceWidth, 
          height: currentSliceHeight,
          row: y,
          col: x,
          originalX: offsetX,
          originalY: offsetY,
          gridPosition: {
            row: y,
            col: x
          }
        });
        
        offsetX += currentSliceWidth;
      }
      offsetY += rowHeights[y];
    }
    
    console.log(`总共生成了 ${slices.length} 个切片`);
    
    // 追踪图片分割事件
    analytics.trackImageSplit({
      rows,
      columns,
      total_slices: slices.length,
      image_width: originalWidth,
      image_height: originalHeight,
    });
    
    setSlicedImages(slices);
    setIsProcessing(false);
    setPuzzleMode(false);
  }, [image, rows, columns]);

  // 下载所有切片
  const downloadSlices = () => {
    // 追踪下载事件
    analytics.trackDownload({
      slice_count: slicedImages.length,
      download_type: 'batch',
    });
    
    slicedImages.forEach((slice, index) => {
      const fileName = `carousel-${index + 1}.png`;
      saveAs(slice.url, fileName);
    });
  };

  // 切换预览模式
  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  // 行列设置变更处理
  const handleRowsChange = (newRows: number) => {
    setRows(newRows);
    setShowGridPreview(false);
  };

  const handleColumnsChange = (newColumns: number) => {
    setColumns(newColumns);
    setShowGridPreview(false);
  };

  return (
    <>
      <Head>
        <title>{t('seo.meta_title')}</title>
        
        <meta name="description" content={t('seo.meta_description') as string} />
        
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* 基本SEO元标签 */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="author" content="Cortar Carrossel" />
        <meta name="keywords" content={t('seo.keywords') as string} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://cortarcarrossel.com/${i18n.language !== 'pt' ? i18n.language + '/' : ''}`} />
        <meta property="og:title" content={t('seo.meta_title') as string} />
        <meta property="og:description" content={t('seo.meta_description') as string} />
        <meta property="og:image" content="https://cortarcarrossel.com/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://cortarcarrossel.com/${i18n.language !== 'pt' ? i18n.language + '/' : ''}`} />
        <meta property="twitter:title" content={t('seo.meta_title') as string} />
        <meta property="twitter:description" content={t('seo.meta_description') as string} />
        <meta property="twitter:image" content="https://cortarcarrossel.com/og-image.png" />
        
        {/* 多语言支持 */}
        <link rel="alternate" hrefLang="pt" href="https://cortarcarrossel.com/" />
        <link rel="alternate" hrefLang="en" href="https://cortarcarrossel.com/en/" />
        <link rel="alternate" hrefLang="zh" href="https://cortarcarrossel.com/zh/" />
        <link rel="alternate" hrefLang="hi" href="https://cortarcarrossel.com/hi/" />
        <link rel="alternate" hrefLang="ru" href="https://cortarcarrossel.com/ru/" />
        <link rel="alternate" hrefLang="x-default" href="https://cortarcarrossel.com/" />
        
        {/* 规范链接 */}
        <link rel="canonical" href={`https://cortarcarrossel.com/${i18n.language !== 'pt' ? i18n.language + '/' : ''}`} />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        
        {/* 结构化数据 - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Cortar Carrossel",
              "alternateName": "Cortar Imagem Carrossel",
              "url": `https://cortarcarrossel.com/${i18n.language !== 'pt' ? i18n.language + '/' : ''}`,
              "description": t('seo.schema_description'),
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "http://schema.org/InStock"
              },
              "screenshot": "/logo.png",
              "image": "/og-image.png",
              "featureList": t('seo.feature_list'),
              "softwareVersion": "1.0",
              "datePublished": "2023-01-01",
              "contentRating": "General",
              "inLanguage": ["en", "pt", "zh", "hi", "ru"],
              "author": {
                "@type": "Organization",
                "name": "Cortar Carrossel",
                "url": "https://cortarcarrossel.com/"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "156",
                "bestRating": "5"
              },
              "keywords": t('seo.keywords')
            })
          }}
        />
        
        {/* FAQ结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": t('seo.faq.what_is'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('seo.faq.what_is_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": t('seo.faq.how_to_use'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('seo.faq.how_to_use_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": t('seo.faq.is_free'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('seo.faq.is_free_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": t('seo.faq.which_platforms'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('seo.faq.which_platforms_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": t('seo.faq.best_dimensions'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('seo.faq.best_dimensions_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": t('seo.faq.puzzle_post'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('seo.faq.puzzle_post_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": t('seo.faq.marketing'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('seo.faq.marketing_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": t('seo.faq.safe_images'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('seo.faq.safe_images_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": t('seo.faq.file_formats'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('seo.faq.file_formats_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": t('seo.faq.size_limit'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('seo.faq.size_limit_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": t('seo.faq.registration'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('seo.faq.registration_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": t('seo.faq.watermarks'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('seo.faq.watermarks_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": t('seo.faq.mobile_use'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('seo.faq.mobile_use_answer')
                  }
                }
              ]
            })
          }}
        />
      </Head>
      
      {/* 主要内容区域 */}
      <div className="flex-grow flex flex-col relative">
          {/* 主内容部分 */}
          <main className="flex-grow container mx-auto p-4 py-10 relative z-10 flex justify-center">
            <div style={{width: '90%', maxWidth: '1200px'}} className="mx-auto">
              {/* 添加工具界面标题 - 优化split image关键词 */}
              <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
                {t('app_title')}
              </h1>
              <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl mx-auto">
                {t('subtitle')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* 左侧面板：统一的控制面板 */}
                <div className="md:col-span-5">
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 h-full shadow border border-gray-200">
                    <h2 className="text-xl font-bold mb-6 text-center border-b border-gray-200 pb-3 text-black">
                      {t('settings')}
                    </h2>
                    
                    {/* 上传区域 */}
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
                    
                    {/* 分割线 */}
                    <div className="my-6 border-t border-gray-200"></div>
                    
                    {/* 设置区域 */}
                    <div className="mb-8">
                      {/* 行列设置 - 高级专业UI */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-black">
                            {t('rows')}
                          </span>
                          <div className="flex items-center bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                            <button 
                              className="w-8 h-8 flex items-center justify-center text-white bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 hover:from-indigo-600 hover:via-blue-600 hover:to-purple-600 transition-colors"
                              onClick={() => handleRowsChange(Math.max(1, rows - 1))}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                              </svg>
                            </button>
                            <div className="w-10 h-8 flex items-center justify-center font-medium bg-indigo-100 text-black">
                              {rows}
                            </div>
                            <button 
                              className="w-8 h-8 flex items-center justify-center text-white bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 hover:from-indigo-600 hover:via-blue-600 hover:to-purple-600 transition-colors"
                              onClick={() => handleRowsChange(Math.min(10, rows + 1))}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-6">
                          <span className="text-sm font-medium text-black">
                            {t('columns')}
                          </span>
                          <div className="flex items-center bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                            <button 
                              className="w-8 h-8 flex items-center justify-center text-white bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 hover:from-indigo-600 hover:via-blue-600 hover:to-purple-600 transition-colors"
                              onClick={() => handleColumnsChange(Math.max(1, columns - 1))}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                              </svg>
                            </button>
                            <div className="w-10 h-8 flex items-center justify-center font-medium bg-indigo-100 text-black">
                              {columns}
                            </div>
                            <button 
                              className="w-8 h-8 flex items-center justify-center text-white bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 hover:from-indigo-600 hover:via-blue-600 hover:to-purple-600 transition-colors"
                              onClick={() => handleColumnsChange(Math.min(10, columns + 1))}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 分割线 */}
                    <div className="my-6 border-t border-gray-200"></div>
                    
                    {/* 操作按钮区 */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <button
                          className="h-12 rounded-xl flex items-center justify-center text-base font-semibold border-0 shadow-md bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white hover:from-indigo-600 hover:via-blue-600 hover:to-purple-600 transition-all duration-300"
                          onClick={sliceImage}
                          disabled={!image || isProcessing}
                        >
                          {isProcessing ? t('processing') : t('preview')}
                        </button>
                        <button
                          className="h-12 rounded-xl flex items-center justify-center text-base font-semibold border-2 border-indigo-200 bg-indigo-50 text-indigo-700 shadow hover:bg-indigo-100 hover:border-indigo-400 transition-all duration-300"
                          onClick={downloadSlices}
                          disabled={!slicedImages.length || isProcessing}
                        >
                          {t('download')}
                        </button>
                        <button
                          className="h-12 rounded-xl flex items-center justify-center text-base font-semibold border-2 border-gray-200 bg-gray-50 text-gray-700 shadow hover:bg-gray-100 hover:border-indigo-300 transition-all duration-300"
                          onClick={togglePuzzleMode}
                          disabled={isProcessing}
                        >
                          {puzzleMode ? t('exit_puzzle_mode', { ns: 'common' }) : t('enter_puzzle_mode', { ns: 'common' })}
                        </button>
                        <button
                          className="h-12 rounded-xl flex items-center justify-center text-base font-semibold border-2 border-gray-200 bg-gray-50 text-gray-700 shadow hover:bg-gray-100 hover:border-indigo-300 transition-all duration-300"
                          onClick={resetSlicePositions}
                          disabled={isProcessing}
                        >
                          {t('reset_position', { ns: 'common' })}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 右侧面板：图片预览区 */}
                <div className="md:col-span-7" key={i18n.language}>
                  <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 h-full flex flex-col shadow">
                    <div className="flex justify-center items-center mb-6">
                      <h2 className="text-xl font-bold text-black">
                        {t('preview_area', { ns: 'common' })}
                      </h2>
                    </div>
                    
                    {/* 隐藏的画布用于处理图片 */}
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    
                    {/* 图片显示区域 - 固定高度 */}
                    <div className="flex-grow flex flex-col justify-start overflow-hidden">
                      {slicedImages.length > 0 && showGridPreview ? (
                        <div 
                          ref={containerRef}
                          className={`border-2 border-dashed rounded-xl p-2 relative ${image ? 'border-indigo-300 hover:border-indigo-400' : 'border-gray-300'}`}
                          style={{
                            backgroundColor: '#f8f9fa',
                            width: '100%', 
                            height: '400px', 
                            overflow: 'auto', 
                            marginTop: '0px',
                            cursor: puzzleMode && activeSlice !== null ? 'grabbing' : 'default'
                          }}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                        >
                          {!puzzleMode ? (
                            // 普通网格显示模式
                            <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                              <div
                                style={{
                                  width: image ? image.width : 'auto',
                                  height: image ? image.height : 'auto',
                                  display: 'grid',
                                  gridTemplateColumns: image && slicedImages.length === rows * columns ? slicedImages.slice(0, columns).map(s => `${s.width}px`).join(' ') : undefined,
                                  gridTemplateRows: image && slicedImages.length === rows * columns ? Array.from({length: rows}, (_, y) => `${slicedImages[y * columns].height}px`).join(' ') : undefined,
                                  transform: image ? `scale(${Math.min(1, 400 / image.height, 1, (window.innerWidth-100) / image.width)})` : 'none',
                                  transformOrigin: 'center center',
                                  gap: '3px',
                                  backgroundColor: '#ffffff', // 改为白色分割线，更明显
                                }}
                              >
                                {slicedImages.map((slice, index) => {
                                  // 使用gridPosition来显示切片
                                  return (
                                    <img
                                      key={index}
                                      src={slice.url}
                                      alt={`Slice ${index + 1} (R${slice.gridPosition.row+1}C${slice.gridPosition.col+1})`}
                                      style={{
                                        width: `${slice.width}px`,
                                        height: `${slice.height}px`,
                                        display: 'block',
                                        gridRow: slice.gridPosition.row + 1,
                                        gridColumn: slice.gridPosition.col + 1,
                                        border: '1px solid #ffffff', // 白色边框
                                        boxSizing: 'border-box',
                                        backgroundColor: 'white', // 确保切片背景是白色
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            // 拼图模式
                            <div className="w-full h-full flex items-center justify-center">
                              <div
                                style={{
                                  width: image ? image.width : 'auto',
                                  height: image ? image.height : 'auto',
                                  position: 'relative',
                                  transform: image ? `scale(${Math.min(1, 400 / image.height, 1, (window.innerWidth-100) / image.width)})` : 'none',
                                  transformOrigin: 'center center',
                                  backgroundColor: 'rgba(79, 70, 229, 0.1)', // 更改背景为浅蓝紫色
                                }}
                              >
                                {/* 首先渲染网格底图作为参考 */}
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                                    gap: '1px',
                                    pointerEvents: 'none',
                                    zIndex: 0
                                  }}
                                >
                                  {Array.from({ length: rows * columns }).map((_, i) => (
                                    <div
                                      key={`grid-${i}`}
                                      style={{
                                        border: '1px dashed rgba(99, 102, 241, 0.4)', // 更改网格线颜色为浅蓝紫色
                                        backgroundColor: 'rgba(79, 70, 229, 0.05)' // 更改网格背景为浅蓝紫色
                                      }}
                                    />
                                  ))}
                                </div>
                                
                                {/* 渲染可拖动的切片 */}
                                {slicedImages.map((slice, index) => (
                                  <div 
                                    key={index}
                                    style={{
                                      position: 'absolute',
                                      left: `${slice.position ? slice.position.x : slice.originalX || 0}px`,
                                      top: `${slice.position ? slice.position.y : slice.originalY || 0}px`,
                                      width: `${slice.width}px`,
                                      height: `${slice.height}px`,
                                      zIndex: slice.zIndex || 1,
                                      transform: activeSlice === index ? 'scale(1.05)' : 'scale(1)',
                                      boxShadow: activeSlice === index 
                                        ? '0 0 15px rgba(79, 70, 229, 0.8)' 
                                        : slice.highlighted 
                                          ? '0 0 15px rgba(250, 204, 21, 0.8)'
                                          : 'none',
                                      transition: activeSlice === index ? 'none' : 'all 0.2s ease',
                                      outline: slice.highlighted ? '3px solid rgba(250, 204, 21, 0.8)' : 'none',
                                    }}
                                    onMouseDown={(e) => handleMouseDown(e, index)}
                                  >
                                    <img
                                      src={slice.url}
                                      alt={`Slice ${index + 1}`}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'block',
                                        cursor: puzzleMode ? 'grab' : 'default',
                                        border: activeSlice === index 
                                          ? '2px solid rgba(79, 70, 229, 0.8)' 
                                          : slice.highlighted
                                            ? '2px solid rgba(250, 204, 21, 0.8)'
                                            : '1px solid rgba(255,255,255,0.3)',
                                        boxSizing: 'border-box',
                                        userSelect: 'none',
                                        pointerEvents: 'none',
                                        opacity: slice.highlighted ? 0.8 : 1
                                      }}
                                      draggable={false}
                                    />
                                    <div 
                                      style={{
                                        position: 'absolute',
                                        top: '2px',
                                        left: '2px',
                                        background: slice.highlighted 
                                          ? 'rgba(250, 204, 21, 0.8)'
                                          : 'rgba(79, 70, 229, 0.8)',
                                        color: 'white',
                                        padding: '2px 5px',
                                        fontSize: '11px',
                                        borderRadius: '2px',
                                        pointerEvents: 'none',
                                      }}
                                    >
                                      {index + 1}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : image ? (
                        /* 切片预览 - 显示原图和网格线 */
                        <div className="border-2 border-dashed border-indigo-300 hover:border-indigo-400 rounded-xl p-2 flex items-center justify-center" style={{width: '100%', height: '400px', overflow: 'auto', marginTop: '0px'}}>
                          {/* 显示原始图片 */}
                          <img
                            src={image.src}
                            alt={t('original_image') as string}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              width: 'auto',
                              height: 'auto',
                              display: 'block',
                              margin: 'auto'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500 bg-white/60 backdrop-blur-xl" style={{height: '400px', marginTop: '0px'}}>
                          {t('uploadImageFirst')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          
          {/* SEO文案部分 */}
          <section className="container mx-auto px-4 py-6 relative z-10">
            <div style={{width: '90%', maxWidth: '1200px'}} className="mx-auto">
              
              <div className="prose prose-lg max-w-none text-gray-700 px-4 md:px-8" style={{ textAlign: 'justify' }}>
                <h2 className="text-2xl font-bold mt-0 mb-4 text-gray-800">{t('seo.faq.what_is')}</h2>
                <p className="mb-4">
                  {t('seo.faq.what_is_answer')}
                </p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">{t('seo.why_choose')}</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>{t('seo.benefits.free')}</li>
                  <li>{t('seo.benefits.custom_grid')}</li>
                  <li>{t('seo.benefits.puzzle_mode')}</li>
                  <li>{t('seo.benefits.compatible')}</li>
                  <li>{t('seo.benefits.no_registration')}</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">{t('seo.how_works')}</h2>
                <p className="mb-4">
                  {t('seo.using_tool')} <strong>{t('seo.tool_name')}</strong> {t('seo.is_simple')}
                </p>
                <ol className="list-decimal pl-6 mb-6 space-y-2">
                  <li>{t('steps.step1')}</li>
                  <li>{t('steps.step2')}</li>
                  <li>{t('steps.step3')}</li>
                  <li>{t('steps.step4')}</li>
                </ol>

                <h2 id="faq" className="text-2xl font-bold mt-8 mb-4 text-gray-800">{t('faq')}</h2>
                
                <div className="space-y-6 mt-4">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{t('seo.faq.safe_images')}</h3>
                    <p className="text-gray-700">{t('seo.faq.safe_images_answer')}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{t('seo.faq.file_formats')}</h3>
                    <p className="text-gray-700">{t('seo.faq.file_formats_answer')}</p>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{t('seo.faq.size_limit')}</h3>
                    <p className="text-gray-700">{t('seo.faq.size_limit_answer')}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{t('seo.faq.registration')}</h3>
                    <p className="text-gray-700">{t('seo.faq.registration_answer')}</p>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{t('seo.faq.watermarks')}</h3>
                    <p className="text-gray-700">{t('seo.faq.watermarks_answer')}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{t('seo.faq.mobile_use')}</h3>
                    <p className="text-gray-700">{t('seo.faq.mobile_use_answer')}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{t('seo.faq.which_platforms')}</h3>
                    <p className="text-gray-700">{t('seo.faq.which_platforms_answer')}</p>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{t('seo.faq.best_dimensions')}</h3>
                    <p className="text-gray-700">{t('seo.faq.best_dimensions_answer')}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{t('seo.faq.puzzle_post')}</h3>
                    <p className="text-gray-700">{t('seo.faq.puzzle_post_answer')}</p>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{t('seo.faq.marketing')}</h3>
                    <p className="text-gray-700">{t('seo.faq.marketing_answer')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 关键词链接区域 - 移到页脚上方，优化split image链接 */}
          <div className="w-full max-w-7xl mx-auto px-4 py-6 relative z-10">
          <div className="mx-auto" style={{width: '90%', maxWidth: '1200px'}}>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{t('related_tools')}</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              
              {/* 主要Split Image工具 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">🔥 {t('tools.image_splitter')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Link href="/split-image" className="bg-blue-50 border border-blue-200 p-3 rounded-lg hover:bg-blue-100 transition-colors block">
                                          <span className="text-blue-700 font-medium">{t('split_image.hero.title')} {t('split_image.hero.title_free')}</span>
                                          <p className="text-sm text-gray-600 mt-1">{t('split_tool_desc_short')}</p>
                  </Link>
                  <Link href="/image-splitter-online" className="bg-green-50 border border-green-200 p-3 rounded-lg hover:bg-green-100 transition-colors block">
                    <span className="text-green-700 font-medium">{t('tools.image_splitter_online')}</span>
                    <p className="text-sm text-gray-600 mt-1">{t('advanced_features_desc')}</p>
                  </Link>
                </div>
              </div>

              {/* 其他相关工具 */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-700">📸 {t('tools.carousel_and_image_tools')}</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  <li>
                    <Link href="/cortar-carrossel-infinito" className="text-blue-600 hover:underline inline-flex items-center">
                      <span className="mr-2">🔄</span> {t('tools.carousel_infinite')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/cortar-imagem-carrossel" className="text-blue-600 hover:underline inline-flex items-center">
                      <span className="mr-2">✂️</span> {t('tools.carousel_image')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/dividir-imagem-carrossel" className="text-blue-600 hover:underline inline-flex items-center">
                      <span className="mr-2">📱</span> {t('tools.divide_carousel')}
                    </Link>
                  </li>
                  <li>
                    <span className="text-gray-500 inline-flex items-center">
                      <span className="mr-2">🧩</span> {t('image_grid_maker')} ({t('coming_soon')})
                    </span>
                  </li>
                </ul>
              </div>

              {/* SEO关键词文本 */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('split_tools_description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'pt', ['common'])),
    },
  };
}

