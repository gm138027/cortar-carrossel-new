import { saveAs } from 'file-saver';
import type { SliceData } from './types';

/**
 * 计算列宽度数组
 * @param totalWidth 总宽度
 * @param columns 列数
 * @returns 每列的宽度数组
 */
export const calculateColumnWidths = (totalWidth: number, columns: number): number[] => {
  return Array.from({ length: columns }, (_, x) => {
    const width = x === columns - 1 
      ? totalWidth - Math.floor(totalWidth / columns) * (columns - 1) 
      : Math.floor(totalWidth / columns);
    console.log(`列 ${x+1} 宽度: ${width}px`);
    return width;
  });
};

/**
 * 计算行高度数组
 * @param totalHeight 总高度
 * @param rows 行数
 * @returns 每行的高度数组
 */
export const calculateRowHeights = (totalHeight: number, rows: number): number[] => {
  return Array.from({ length: rows }, (_, y) => {
    const height = y === rows - 1 
      ? totalHeight - Math.floor(totalHeight / rows) * (rows - 1) 
      : Math.floor(totalHeight / rows);
    console.log(`行 ${y+1} 高度: ${height}px`);
    return height;
  });
};

/**
 * 分割图片为切片（同步版本，保持向后兼容）
 * @param image 原始图片
 * @param canvas 画布元素
 * @param rows 行数
 * @param columns 列数
 * @returns 切片数据数组
 */
export const sliceImageToData = (
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  rows: number,
  columns: number
): SliceData[] => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  // 🛡️ 安全修复：重置Canvas状态，清理之前的内存占用
  canvas.width = canvas.width; // 标准的Canvas重置方法，触发内部状态清理

  const originalWidth = image.width;
  const originalHeight = image.height;

  console.log(`原图尺寸: ${originalWidth}x${originalHeight}, 分割设置: ${rows}行x${columns}列`);

  // 计算每一列的宽度（最后一列可能不同）
  const colWidths = calculateColumnWidths(originalWidth, columns);

  // 计算每一行的高度（最后一行可能不同）
  const rowHeights = calculateRowHeights(originalHeight, rows);

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
  return slices;
};

/**
 * 异步分割图片为切片（优化版本，改善INP性能）
 * @param image 原始图片
 * @param canvas 画布元素
 * @param rows 行数
 * @param columns 列数
 * @returns Promise<切片数据数组>
 */
export const sliceImageToDataAsync = async (
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  rows: number,
  columns: number
): Promise<SliceData[]> => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  // 🛡️ 安全修复：重置Canvas状态，清理之前的内存占用
  canvas.width = canvas.width; // 标准的Canvas重置方法，触发内部状态清理

  const originalWidth = image.width;
  const originalHeight = image.height;

  console.log(`异步分割 - 原图尺寸: ${originalWidth}x${originalHeight}, 分割设置: ${rows}行x${columns}列`);

  // 计算每一列的宽度（最后一列可能不同）
  const colWidths = calculateColumnWidths(originalWidth, columns);

  // 计算每一行的高度（最后一行可能不同）
  const rowHeights = calculateRowHeights(originalHeight, rows);

  const slices: SliceData[] = [];
  let offsetY = 0;

  // 异步处理每一行
  for (let y = 0; y < rows; y++) {
    let offsetX = 0;

    // 异步处理每一列
    for (let x = 0; x < columns; x++) {
      // 使用 requestAnimationFrame 让出主线程控制权
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          const currentSliceWidth = colWidths[x];
          const currentSliceHeight = rowHeights[y];

          console.log(`异步生成切片: 行=${y+1}, 列=${x+1}, 宽=${currentSliceWidth}px, 高=${currentSliceHeight}px, 偏移=(${offsetX},${offsetY})`);

          // Canvas操作
          canvas.width = currentSliceWidth;
          canvas.height = currentSliceHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // 图片绘制
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

          // 转换为DataURL
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
          resolve();
        });
      });
    }
    offsetY += rowHeights[y];
  }

  console.log(`异步分割完成，总共生成了 ${slices.length} 个切片`);
  return slices;
};

/**
 * 下载所有切片
 * @param slicedImages 切片数据数组
 */
export const downloadAllSlices = (slicedImages: SliceData[]): void => {
  slicedImages.forEach((slice, index) => {
    const fileName = `carousel-${index + 1}.png`;
    saveAs(slice.url, fileName);
  });
};
