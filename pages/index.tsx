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
  }, []);

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
    setSlicedImages(slices);
    setIsProcessing(false);
    setPuzzleMode(false);
  }, [image, rows, columns]);

  // 下载所有切片
  const downloadSlices = () => {
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
        
        <meta name="description" content={t('seo.meta_description')} />
        
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        
        {/* 基本SEO元标签 */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="author" content="Cortar Carrossel" />
        <meta name="keywords" content={t('seo.keywords')} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://cortarcarrossel.com/${i18n.language !== 'pt' ? i18n.language + '/' : ''}`} />
        <meta property="og:title" content={t('seo.meta_title')} />
        <meta property="og:description" content={t('seo.meta_description')} />
        <meta property="og:image" content="https://cortarcarrossel.com/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://cortarcarrossel.com/${i18n.language !== 'pt' ? i18n.language + '/' : ''}`} />
        <meta property="twitter:title" content={t('seo.meta_title')} />
        <meta property="twitter:description" content={t('seo.meta_description')} />
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
      
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef0ff 0%, #ecebfc 100%)', fontFamily: 'Inter, sans-serif' }} className="text-black relative">
        {/* 背景模糊效果 */}
        <div className="absolute inset-0 backdrop-blur-[100px] pointer-events-none"></div>
        
        {/* 头部 */}
        <header className="bg-white/80 backdrop-blur-xl p-4 border-b border-gray-200 sticky top-0 z-50 shadow-sm" key={i18n.language}>
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-10 w-10 relative mr-3 cursor-pointer" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
                <Image 
                  src="/logo.png" 
                  alt={t('site_name') + ' Logo'} 
                  fill 
                  className="object-contain" 
                  priority
                />
              </div>
              <h1 className="text-xl font-bold text-black cursor-pointer" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
                {t('site_name')}
              </h1>
            </div>
            
            {/* 主导航 */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="text-gray-800 hover:text-indigo-600 font-medium transition-colors">
                {t('home', { ns: 'common' })}
              </a>
              <a href="#faq" onClick={(e) => { e.preventDefault(); document.getElementById('faq')?.scrollIntoView({behavior: 'smooth'}); }} className="text-gray-800 hover:text-indigo-600 font-medium transition-colors">
                {t('faq', { ns: 'common' })}
              </a>
            </div>
            
            {/* 语言切换按钮组 */}
            <div className="flex space-x-2">
              {['en', 'zh', 'pt', 'hi', 'ru'].map((locale) => (
                <button
                  key={locale}
                  onClick={() => changeLanguage(locale)}
                  className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all duration-200 text-black bg-gray-100 hover:bg-gray-200`}
                >
                  {locale === 'en' ? 'EN' : 
                   locale === 'zh' ? '中' : 
                   locale === 'pt' ? 'PT' : 
                   locale === 'hi' ? 'HI' : 'RU'}
                </button>
              ))}
            </div>
            
            {/* 移动端菜单按钮 */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>
        
        <main className="container mx-auto p-4 py-10 relative z-10 flex justify-center">
          <div style={{width: '90%', maxWidth: '1200px'}} className="mx-auto">
            {/* 添加工具界面标题 - 多语言版本 */}
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
              Cortar Carrossel | {t('app_title')}
            </h1>
            
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
                                gap: '1px',
                                backgroundColor: 'rgba(99, 102, 241, 0.6)', // 更淡的分割线颜色
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
                                      border: '1px solid transparent', // 预留边框空间但不显示
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
                          alt={t('original_image')}
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
        
        {/* SEO文案部分 - 添加在工具界面下方 */}
        <section className="container mx-auto px-4 py-12 relative z-10">
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
        
        <footer className="p-6 text-center text-gray-500 sm:p-10 relative z-10 border-t border-gray-200 bg-white/80 backdrop-blur-xl mt-10">
          <div className="max-w-6xl mx-auto">
            {/* Logo和版权部分 */}
            <div className="flex justify-center items-center mb-6">
              <div className="h-8 w-8 relative mr-2">
                <Image
                  src="/logo.png" 
                  alt={t('site_name') + ' Logo'} 
                  fill 
                  className="object-contain"
                />
              </div>
              <span className="font-light text-black">{t('site_name')} © {new Date().getFullYear()}</span>
            </div>
            
            {/* 社交媒体平台部分 */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4">{t('suitablePlatforms')}</h3>
              <p className="text-sm text-gray-600 mb-4 max-w-2xl mx-auto">
                {t('platformDescription')}
              </p>
              
              <div className="flex flex-wrap justify-center items-center gap-8 mt-4">
                {/* Instagram */}
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 relative mb-2 rounded-lg overflow-hidden bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700 p-2">
                    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-600">Instagram</span>
                </div>
                
                {/* Twitter/X */}
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 relative mb-2 rounded-lg overflow-hidden bg-black p-2">
                    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-600">Twitter/X</span>
                </div>
                
                {/* Facebook */}
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 relative mb-2 rounded-lg overflow-hidden bg-blue-600 p-2">
                    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-600">Facebook</span>
                </div>
                
                {/* TikTok */}
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 relative mb-2 rounded-lg overflow-hidden bg-black p-2">
                    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-600">TikTok</span>
                </div>
                
                {/* Pinterest */}
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 relative mb-2 rounded-lg overflow-hidden bg-red-600 p-2">
                    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-600">Pinterest</span>
                </div>
                
                {/* LinkedIn */}
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 relative mb-2 rounded-lg overflow-hidden bg-blue-700 p-2">
                    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-600">LinkedIn</span>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              {t('subtitle')}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
}

