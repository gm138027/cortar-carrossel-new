import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import useKeypress from "react-use-keypress";
import type { ImageProps } from "../../utils/core/types";
import SharedModal from "./SharedModal";

export default function Modal({
  images,
  onClose,
}: {
  images: ImageProps[];
  onClose?: () => void;
}) {
  let overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { photoId } = router.query;
  let index = Number(photoId);

  const [direction, setDirection] = useState(0);
  const [curIndex, setCurIndex] = useState(index);

  // 修复aria-hidden问题：确保body不会被完全隐藏
  useEffect(() => {
    // 当模态框打开时，移除body上可能的aria-hidden属性
    const body = document.body;
    const originalAriaHidden = body.getAttribute('aria-hidden');

    // 如果body被设置为aria-hidden="true"，移除它
    if (originalAriaHidden === 'true') {
      body.removeAttribute('aria-hidden');
    }

    return () => {
      // 清理时恢复原始状态（如果需要的话）
      if (originalAriaHidden && originalAriaHidden !== 'true') {
        body.setAttribute('aria-hidden', originalAriaHidden);
      }
    };
  }, []);

  function handleClose() {
    router.push("/", undefined, { shallow: true });
    onClose?.();
  }

  function changePhotoId(newVal: number) {
    if (newVal > index) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setCurIndex(newVal);
    router.push(
      {
        query: { photoId: newVal },
      },
      `/p/${newVal}`,
      { shallow: true },
    );
  }

  useKeypress("ArrowRight", () => {
    if (index + 1 < images.length) {
      changePhotoId(index + 1);
    }
  });

  useKeypress("ArrowLeft", () => {
    if (index > 0) {
      changePhotoId(index - 1);
    }
  });

  return (
    <Dialog
      static
      open={true}
      onClose={handleClose}
      initialFocus={overlayRef}
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      <Dialog.Overlay
        ref={overlayRef}
        as={motion.div}
        key="backdrop"
        className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <SharedModal
        index={curIndex}
        direction={direction}
        images={images}
        changePhotoId={changePhotoId}
        closeModal={handleClose}
        navigation={true}
      />
    </Dialog>
  );
}
