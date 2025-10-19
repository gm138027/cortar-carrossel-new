/**
 * Core grid math utilities shared between main-thread and worker slicing code.
 */
export const calculateColumnWidths = (totalWidth: number, columns: number): number[] => {
  if (columns <= 0) {
    throw new Error('columns must be greater than 0');
  }

  return Array.from({ length: columns }, (_, x) => {
    const baseWidth = Math.floor(totalWidth / columns);
    return x === columns - 1 ? totalWidth - baseWidth * (columns - 1) : baseWidth;
  });
};

export const calculateRowHeights = (totalHeight: number, rows: number): number[] => {
  if (rows <= 0) {
    throw new Error('rows must be greater than 0');
  }

  return Array.from({ length: rows }, (_, y) => {
    const baseHeight = Math.floor(totalHeight / rows);
    return y === rows - 1 ? totalHeight - baseHeight * (rows - 1) : baseHeight;
  });
};
