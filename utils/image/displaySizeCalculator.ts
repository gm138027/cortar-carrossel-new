/**
 * 统一的图片显示尺寸计算模块
 * 解决原图和切割图显示不一致的问题
 */

export interface DisplaySizeConfig {
  /** 容器宽度 */
  containerWidth: number;
  /** 容器高度 */
  containerHeight: number;
  /** 容器内边距 */
  padding: number;
  /** 边框宽度（如果使用边框作为分割线） */
  borderWidth?: number;
}

export interface GridConfig {
  rows: number;
  columns: number;
}

export interface ImageDisplaySize {
  /** 图片显示宽度 */
  displayWidth: number;
  /** 图片显示高度 */
  displayHeight: number;
  /** 缩放比例 */
  scale: number;
  /** 单个切片显示宽度 */
  sliceWidth: number;
  /** 单个切片显示高度 */
  sliceHeight: number;
  /** 是否需要缩放 */
  needsScaling: boolean;
}

/**
 * 计算图片在容器中的最佳显示尺寸
 * @param originalWidth 原始图片宽度
 * @param originalHeight 原始图片高度
 * @param config 容器配置
 * @param gridConfig 网格配置（可选，用于切割模式）
 * @returns 计算后的显示尺寸信息
 */
export const calculateImageDisplaySize = (
  originalWidth: number,
  originalHeight: number,
  config: DisplaySizeConfig,
  gridConfig?: GridConfig
): ImageDisplaySize => {
  // 输入验证
  if (originalWidth <= 0 || originalHeight <= 0) {
    throw new Error('图片尺寸必须大于0');
  }

  if (config.containerWidth <= 0 || config.containerHeight <= 0) {
    throw new Error('容器尺寸必须大于0');
  }

  if (gridConfig && (gridConfig.rows <= 0 || gridConfig.columns <= 0)) {
    throw new Error('网格配置必须大于0');
  }
  // 计算可用空间（减去内边距）
  const availableWidth = config.containerWidth - (config.padding * 2);
  const availableHeight = config.containerHeight - (config.padding * 2);

  // 计算基础缩放比例（确保图片完全显示在容器内）
  const scaleX = availableWidth / originalWidth;
  const scaleY = availableHeight / originalHeight;
  
  // 选择较小的缩放比例，确保图片完全适应容器
  // 同时限制最大缩放比例为1，避免小图片被放大
  const baseScale = Math.min(scaleX, scaleY, 1);

  // 计算基础显示尺寸
  const baseDisplayWidth = originalWidth * baseScale;
  const baseDisplayHeight = originalHeight * baseScale;

  // 计算单个切片尺寸（基于基础显示尺寸）
  const sliceWidth = gridConfig ? baseDisplayWidth / gridConfig.columns : baseDisplayWidth;
  const sliceHeight = gridConfig ? baseDisplayHeight / gridConfig.rows : baseDisplayHeight;

  return {
    displayWidth: baseDisplayWidth,
    displayHeight: baseDisplayHeight,
    scale: baseScale,
    sliceWidth,
    sliceHeight,
    needsScaling: baseScale < 1
  };
};

/**
 * 获取容器的默认配置
 * @param containerElement 容器DOM元素
 * @returns 容器配置
 */
export const getDefaultDisplayConfig = (containerElement?: HTMLElement): DisplaySizeConfig => {
  if (!containerElement) {
    // 默认配置（当容器元素不可用时）
    return {
      containerWidth: 600,
      containerHeight: 500,
      padding: 8, // 🔧 修复：与CSS的p-2(8px)保持一致
      borderWidth: 5
    };
  }

  const rect = containerElement.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(containerElement);
  
  // 获取内边距
  const paddingLeft = parseInt(computedStyle.paddingLeft) || 0;
  const paddingRight = parseInt(computedStyle.paddingRight) || 0;
  const paddingTop = parseInt(computedStyle.paddingTop) || 0;
  const paddingBottom = parseInt(computedStyle.paddingBottom) || 0;
  
  // 计算实际可用空间
  const actualWidth = rect.width - paddingLeft - paddingRight;
  const actualHeight = rect.height - paddingTop - paddingBottom;

  return {
    containerWidth: actualWidth,
    containerHeight: actualHeight,
    padding: 8, // 🔧 修复：与CSS的p-2(8px)保持一致，避免双重边距
    borderWidth: 5
  };
};

/**
 * 验证计算结果是否合理
 * @param result 计算结果
 * @param config 配置
 * @returns 验证结果和建议
 */
export const validateDisplaySize = (
  result: ImageDisplaySize,
  config: DisplaySizeConfig
): { valid: boolean; warnings: string[] } => {
  const warnings: string[] = [];

  // 检查是否超出容器
  if (result.displayWidth > config.containerWidth - config.padding * 2) {
    warnings.push('显示宽度超出容器');
  }

  if (result.displayHeight > config.containerHeight - config.padding * 2) {
    warnings.push('显示高度超出容器');
  }

  // 检查切片是否过小
  if (result.sliceWidth < 20) {
    warnings.push('切片宽度过小，可能影响用户体验');
  }

  if (result.sliceHeight < 20) {
    warnings.push('切片高度过小，可能影响用户体验');
  }

  // 检查缩放比例是否过小
  if (result.scale < 0.1) {
    warnings.push('缩放比例过小，图片可能过于模糊');
  }

  return {
    valid: warnings.length === 0,
    warnings
  };
};
