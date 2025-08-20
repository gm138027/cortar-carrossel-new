import React from 'react';
import { useTranslation } from 'next-i18next';

interface SplitSettingsProps {
  rows: number;
  columns: number;
  onRowsChange: (rows: number) => void;
  onColumnsChange: (columns: number) => void;
}

// 快速预设选项
const QUICK_PRESETS = [
  { rows: 1, columns: 3, label: '1×3' },
  { rows: 2, columns: 3, label: '2×3' },
  { rows: 3, columns: 3, label: '3×3' }
];

const SplitSettings: React.FC<SplitSettingsProps> = ({
  rows,
  columns,
  onRowsChange,
  onColumnsChange
}) => {
  const { t } = useTranslation('common');

  // 处理快速预设选择
  const handlePresetSelect = (presetRows: number, presetColumns: number) => {
    onRowsChange(presetRows);
    onColumnsChange(presetColumns);
  };

  // 检查当前设置是否匹配某个预设
  const isPresetActive = (presetRows: number, presetColumns: number) => {
    return rows === presetRows && columns === presetColumns;
  };

  return (
    <div className="space-y-4">
      {/* 快速选择区域 */}
      <div>
        <h3 className="text-sm font-medium text-black mb-2">{t('quick_presets')}</h3>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_PRESETS.map((preset) => (
            <button
              key={`${preset.rows}x${preset.columns}`}
              onClick={() => handlePresetSelect(preset.rows, preset.columns)}
              className={`
                h-10 rounded-lg text-sm font-medium transition-all duration-200
                ${isPresetActive(preset.rows, preset.columns)
                  ? 'bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }
              `}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 分割线 */}
      <div className="border-t border-gray-200"></div>

      {/* 自定义设置区域 */}
      <div>
        <h3 className="text-sm font-medium text-black mb-2">{t('custom_settings')}</h3>
        <div className="space-y-4">
          {/* 行数设置 */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-black">
              {t('rows')}
            </span>
            <div className="flex items-center bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <button
                className="w-8 h-8 flex items-center justify-center text-white bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 hover:from-indigo-600 hover:via-blue-600 hover:to-purple-600 transition-colors"
                onClick={() => onRowsChange(Math.max(1, rows - 1))}
                aria-label={t('decrease_rows')}
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
                onClick={() => onRowsChange(Math.min(10, rows + 1))}
                aria-label={t('increase_rows')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* 列数设置 */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-black">
              {t('columns')}
            </span>
            <div className="flex items-center bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <button
                className="w-8 h-8 flex items-center justify-center text-white bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 hover:from-indigo-600 hover:via-blue-600 hover:to-purple-600 transition-colors"
                onClick={() => onColumnsChange(Math.max(1, columns - 1))}
                aria-label={t('decrease_columns')}
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
                onClick={() => onColumnsChange(Math.min(10, columns + 1))}
                aria-label={t('increase_columns')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitSettings;
