import { useEffect } from "react";
import type { AppProps } from "next/app";
import "../styles/index.css";
import { appWithTranslation } from 'next-i18next';
import Analytics from '../components/Shared/Analytics';
import Layout from '../components/Layout/Layout';

function useSideRailObserver() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const body = document.body;
    if (!body) return;

    const isDesktopLike =
      window.innerWidth >= 1280 &&
      (!window.matchMedia || !window.matchMedia('(pointer: coarse)').matches);

    if (!isDesktopLike) {
      body.classList.remove('side-rail-active', 'side-rail-left-active', 'side-rail-right-active');
      return;
    }

    const CLASS_ACTIVE = 'side-rail-active';
    const CLASS_LEFT = 'side-rail-left-active';
    const CLASS_RIGHT = 'side-rail-right-active';
    const MIN_WIDTH = 200; // ignore tiny inline ads

    const resizeObservers = new Map<HTMLElement, ResizeObserver>();

    const prepareAdSlot = (ad: HTMLElement) => {
      ad.style.display = 'block';
      if (!ad.style.minHeight) {
        ad.style.minHeight = '280px';
      }
      ad.style.width = '100%';
      ad.style.transition = 'none';

      if (!resizeObservers.has(ad) && typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.contentRect.height > 0 && entry.target instanceof HTMLElement) {
              entry.target.style.minHeight = `${entry.contentRect.height}px`;
            }
          });
        });
        observer.observe(ad);
        resizeObservers.set(ad, observer);
      }
    };

    const getRailInfo = () => {
      const ads = Array.from(document.querySelectorAll('ins.adsbygoogle')) as HTMLElement[];
      let hasLeft = false;
      let hasRight = false;

      ads.forEach((ad) => {
        if (!ad) return;

        prepareAdSlot(ad);

        const rect = ad.getBoundingClientRect();
        if (rect.width < MIN_WIDTH || rect.height < 100) return;

        const computed = window.getComputedStyle(ad);
        if (computed.position !== 'fixed') return;

        const datasetSide = ad.dataset.railSide || ad.dataset.side;
        const anchorStatus = ad.dataset.anchorStatus;
        const status = ad.dataset.status;
        const isDisplayed = anchorStatus === 'displayed' || anchorStatus === 'shown' || status === 'done' || status === 'filled';
        if (!isDisplayed) return;

        if (datasetSide === 'left') {
          hasLeft = true;
          return;
        }
        if (datasetSide === 'right') {
          hasRight = true;
          return;
        }

        const left = parseFloat(computed.left ?? '');
        const right = parseFloat(computed.right ?? '');

        if (!Number.isNaN(left) && Math.abs(left) <= 20) {
          hasLeft = true;
        } else if (!Number.isNaN(right) && Math.abs(right) <= 20) {
          hasRight = true;
        }
      });

      return { hasLeft, hasRight };
    };

    const updateClasses = () => {
      const railInfo = getRailInfo();
      if (!railInfo) {
        body.classList.remove(CLASS_ACTIVE, CLASS_LEFT, CLASS_RIGHT);
        return;
      }

      const { hasLeft, hasRight } = railInfo;
      body.classList.toggle(CLASS_LEFT, hasLeft);
      body.classList.toggle(CLASS_RIGHT, hasRight);
      body.classList.toggle(CLASS_ACTIVE, hasLeft || hasRight);
    };

    updateClasses();

    const observer = new MutationObserver(() => {
      updateClasses();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'data-anchor-status', 'data-rail-side', 'data-side', 'data-status']
    });

    const resizeHandler = () => updateClasses();
    window.addEventListener('resize', resizeHandler);

    return () => {
      resizeObservers.forEach((observer) => observer.disconnect());
      resizeObservers.clear();
      observer.disconnect();
      window.removeEventListener('resize', resizeHandler);
      body.classList.remove(CLASS_ACTIVE, CLASS_LEFT, CLASS_RIGHT);
    };
  }, []);
}

function MyApp({ Component, pageProps }: AppProps) {
  useSideRailObserver();

  return (
    <>
      {/* Google Analytics - 独立组件管理 */}
      <Analytics trackingId="G-F41WJR47SH" />

      {/* 全局布局 - 为所有页面提供统一的导航和页脚 */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default appWithTranslation(MyApp);
