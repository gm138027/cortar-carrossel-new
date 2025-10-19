import React, { useEffect, useState } from "react";
import { useAnalytics } from "../../../hooks/business/useAnalytics";
import ControlPanel from "./ControlPanel";
import ImagePreview from "./ImagePreview";
import { useImageSplitterState } from "./useImageSplitterState";
import { useImagePreviewState } from "./useImagePreviewState";
import { usePuzzle } from "./Puzzle/usePuzzle";
import type { SliceData } from "./types";

const ImageSplitterTool: React.FC = () => {
  const analytics = useAnalytics();

  const {
    isProcessing,
    rows,
    columns,
    canvasRef,
    handleRowsChange,
    handleColumnsChange,
    sliceImage: businessSliceImage,
    downloadSlices: businessDownloadSlices,
    handleImageUpload: stateHandleImageUpload,
  } = useImageSplitterState();

  const imagePreviewState = useImagePreviewState({ rows, columns });
  const displayState = imagePreviewState.displayState;

  const image = imagePreviewState.originalState.image;
  const slicedImages = imagePreviewState.slicedState.slicedImages;
  const containerRef = imagePreviewState.containerRef;

  const [puzzleMode, setPuzzleMode] = useState(false);
  const puzzleState = usePuzzle({ slices: imagePreviewState.slicesData });



  async function decodeSliceImages(slices: SliceData[]) {
    await Promise.all(
      slices.map((slice) => {
        if (!slice.url) {
          return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
          const img = new Image();
          const finish = () => resolve();
          img.onload = finish;
          img.onerror = finish;
          img.src = slice.url;

          if (typeof img.decode === "function") {
            img
              .decode()
              .then(() => finish())
              .catch(() => {
                if (img.complete) {
                  finish();
                }
              });
          } else if (img.complete) {
            finish();
          }
        });
      })
    );
  }


  async function sliceImage() {
    const currentImage = imagePreviewState.originalState.image;
    if (!currentImage) {
      return;
    }

    imagePreviewState.slicedState.setGridPreview(false);

    const slices = await businessSliceImage(currentImage);
    if (!slices || !slices.length) {
      return;
    }

    try {
      await decodeSliceImages(slices);
    } catch (error) {
      console.warn("slice decode failed", error);
    }

    imagePreviewState.slicedState.updateSlicedImages(slices);
    imagePreviewState.slicedState.setGridPreview(true);
  }


  const prevGridRef = React.useRef<{ rows: number; columns: number } | null>(null);

  useEffect(() => {
    if (!image || isProcessing) {
      prevGridRef.current = { rows, columns };
      return;
    }

    const prev = prevGridRef.current;
    prevGridRef.current = { rows, columns };

    if (!prev) {
      return;
    }

    if (prev.rows === rows && prev.columns === columns) {
      return;
    }

    if (slicedImages.length > 0) {
      imagePreviewState.slicedState.clearSlicedImages();
      setPuzzleMode(false);

      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.width;
      }

      const pixels = image.width * image.height;
      const delay = pixels > 8_000_000 ? 100 : pixels > 4_000_000 ? 75 : 50;

      const timeoutId = setTimeout(() => {
        void sliceImage();
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [rows, columns, image, slicedImages.length, isProcessing, sliceImage]);

  const handleImageUpload = (img: HTMLImageElement, file: File) => {
    setPuzzleMode(false);
    imagePreviewState.slicedState.clearSlicedImages();

    if (canvasRef.current) {
      canvasRef.current.width = canvasRef.current.width;
    }

    imagePreviewState.originalState.updateImage(img);
    stateHandleImageUpload(img, file);
  };

  const downloadSlices = () => {
    const slices = imagePreviewState.slicedState.slicedImages;
    businessDownloadSlices(slices);
  };

  const togglePuzzleMode = () => {
    const nextPuzzleMode = !puzzleMode;

    analytics.trackPuzzleMode({
      enabled: nextPuzzleMode,
      grid_size: `${rows}x${columns}`,
    });

    setPuzzleMode(nextPuzzleMode);
  };

  const resetSlicePositions = () => {
    if (puzzleMode) {
      puzzleState.resetPositions();
    }
  };

  return (
    <>
      <canvas ref={canvasRef} className="hidden"></canvas>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5">
          <ControlPanel
            rows={rows}
            columns={columns}
            image={image}
            isProcessing={isProcessing}
            slicedImagesLength={slicedImages.length}
            onRowsChange={handleRowsChange}
            onColumnsChange={handleColumnsChange}
            onSliceImage={sliceImage}
            onDownloadSlices={downloadSlices}
            onImageUpload={handleImageUpload}
            puzzleMode={puzzleMode}
            onTogglePuzzleMode={togglePuzzleMode}
            onResetSlicePositions={resetSlicePositions}
          />
        </div>

        <ImagePreview
          displayState={puzzleMode ? "puzzle" : imagePreviewState.displayState}
          imageData={imagePreviewState.imageData}
          slicesData={imagePreviewState.slicesData}
          gridConfig={{ rows, columns }}
          displaySize={imagePreviewState.displaySize}
          currentGridConfig={imagePreviewState.currentGridConfig}
          containerRef={containerRef}
          puzzleSlices={puzzleMode ? puzzleState.puzzleSlices : undefined}
          onPuzzleSliceSwap={puzzleMode ? puzzleState.swapSlices : undefined}
          onPuzzleDragStart={puzzleMode ? puzzleState.handleDragStart : undefined}
          onPuzzleDragOver={puzzleMode ? puzzleState.handleDragOver : undefined}
          onPuzzleDragEnd={puzzleMode ? puzzleState.handleDragEnd : undefined}
          onPuzzleDrop={puzzleMode ? puzzleState.handleDrop : undefined}
        />
      </div>
    </>
  );
};

export default ImageSplitterTool;






