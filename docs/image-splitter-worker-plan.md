# Image Splitter Worker Migration Plan

## 背景与目标
- **问题**：主线程中的 `sliceImageToDataAsync` 在每个切片上执行 `canvas.toBlob`，导致长任务（约 460 ms）并引发 487 ms 的 INP。
- **目标**：将切片绘制与编码迁移到 Web Worker，避免阻塞主线程，同时保证 UI/UX、业务逻辑不变。
- **成功标准**：
  - 交互触发切割时主线程无 >200 ms 长任务；
  - INP <200 ms（通过 Chrome DevTools / `performance.getEntriesByType('event')` 验证）；
  - 下载、拼图、多次切割等功能无回归。

## 范围
- 涉及文件：
  - `components/Tools/ImageSplitter/imageSplitterAlgorithm.ts`
  - `components/Tools/ImageSplitter/useImageSplitterState.ts`
  - `components/Tools/ImageSplitter/ImageSplitterTool.tsx`
  - `components/Tools/ImageSplitter/workers/imageSplitter.worker.ts`
  - 视需要扩展 `components/Tools/ImageSplitter/types.ts`
- 排除项：任何 UI/样式/交互层改动；Analytics、Ads、i18n 保持不变。

## 方案概述
1. **Worker 架构**：主线程在初始化时创建 Worker，将 `ImageBitmap` 作为 transferable 传入。Worker 优先使用 `createImageBitmap` + WebCodecs `ImageEncoder` 完成切片和编码；如 WebCodecs 不可用，则退回 `OffscreenCanvas` + `toBlob`。最终一次性返回 `SliceData`，用户仍一次性看到完整结果。
2. **消息协议**：
   - `PREPARE_IMAGE`：`{ id, buffer, mimeType }` —— 预解码并缓存原始位图；
   - `PREPARE_RESULT` / `PREPARE_ERROR`
   - `SLICE_REQUEST`：`{ id, preparedImageId, rows, columns, mimeType, quality }`
   - `SLICE_RESULT` / `SLICE_ERROR`
   - `RELEASE_IMAGE`：`{ id }` —— 释放缓存位图
   - `SLICE_PROGRESS`：可选调试用途
   - `ABORT`：取消当前切片任务
3. **回退策略**：检测 `createImageBitmap`、WebCodecs `ImageEncoder`、`OffscreenCanvas` 能力；不足时使用次优方案（OffscreenCanvas 或主线程旧逻辑），并在控制台提示。

## 实施步骤
### 1. 类型与消息定义
- 维护 Worker 与主线程共享的 TypeScript 类型：
  - `SliceWorkerRequest`, `SliceWorkerResponse`, `SliceWorkerMessageType`
  - 给 `SliceData` 增加 `objectUrlSource: 'worker' | 'main'` 以便调试来源（可选）。

### 2. Worker 文件实现
- 文件：`components/Tools/ImageSplitter/workers/imageSplitter.worker.ts`
- 核心逻辑：
  1. 收到 `SLICE_REQUEST` 后检测能力；
  2. WebCodecs 可用时，使用已缓存的 `ImageBitmap` + `createImageBitmap(bitmap, sx, sy, sw, sh)` 快速裁剪，并通过 `new ImageEncoder({ type, quality })` 直接编码成 `Blob`；
  3. 若 WebCodecs 不可用，退回 `OffscreenCanvas` + `convertToBlob`；
  4. 结果以 `Blob` 数组一次性回传主线程（主线程生成 `ObjectURL`）；
  5. 支持 `ABORT`，收到后立即停止剩余切片和编码。

### 3. 主线程集成
- 在 `useImageSplitterState` 中：
  1. 懒加载 Worker（`new Worker(new URL('./workers/imageSplitter.worker.ts', import.meta.url))`）；
  2. 用户上传后立即读取 `File.arrayBuffer()`，发送 `PREPARE_IMAGE`，等待返回 `preparedImageId`、宽高等元数据；
  3. 维护请求 `Map`（区分预处理与切片），接收 `PREPARE_RESULT`、`SLICE_RESULT`；
  4. 切片阶段仅发送 `preparedImageId`，如遇错误回退到主线程 `sliceImageToDataAsync`；
  5. 图片更换或组件卸载时发送 `RELEASE_IMAGE` 并终止 Worker。

### 4. 资源管理与清理
- Worker 须缓存 `ImageBitmap` 并在 `RELEASE_IMAGE` 时 `close()`，避免内存膨胀；回退路径生成的 `ObjectURL` 仍由主线程在 `clearSlicedImages` 中 `URL.revokeObjectURL`。
- 取消或卸载时，通过 `ABORT` 停止切片，并确保所有 pending promise 完成/拒绝。

### 5. 特性检测与回退
- 检测点：
  - `typeof globalThis.createImageBitmap === 'function'`
  - `typeof (globalThis as any).ImageEncoder === 'function'`
  - `typeof globalThis.OffscreenCanvas === 'function'`
- 逻辑：
  1. WebCodecs + ImageBitmap 均可用 → GPU 裁剪 + `ImageEncoder`；
  2. 仅 OffscreenCanvas 可用 → 回退到 Canvas 绘制 + `convertToBlob`；
  3. 上述能力缺失 → 控制台提示并回退主线程旧算法。

### 6. 测试与验收
- 功能：上传不同大小图片、切换行列、多次切割、拼图模式、下载等。
- 性能：
  - DevTools Performance 查看 `Longest interaction`，确保 INP <200 ms；
  - 记录 Worker 内部耗时（`console.time`）验证总处理时间 <2 秒；
  - 比较 WebCodecs 与回退路径的性能差异。
- 降级：在不支持 WebCodecs/OffscreenCanvas 的环境下确认仍可完成切割。

## 风险与缓解
- **并发请求**：用户快速重复点击切割 → 通过 `pending` map + `isProcessing` 禁用按钮。
- **内存压力**：一次性生成大量 Blob → 继续使用 `objectUrlSource` 与 `clearSlicedImages` 及时释放，必要时限制最大网格。
- **兼容性**：部分浏览器暂无 WebCodecs → 保留 OffscreenCanvas 与主线程回退逻辑，并确保构建支持 `new Worker(new URL(...))`。

## 里程碑
1. 类型与 Worker 架构准备（1 天）
2. 主线程集成与回退实现（1 天）
3. 性能验证与手动测试（0.5 天）
4. 回归测试与代码评审（0.5 天）

> 该计划保持现有 UI/UX 不变；如需增加进度提示，可在性能目标达成后单独评估。
