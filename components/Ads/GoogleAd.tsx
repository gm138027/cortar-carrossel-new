import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

interface GoogleAdProps {
  adSlot: string;
  className?: string;
  style?: React.CSSProperties;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidthResponsive?: boolean;
  layoutKey?: string;
}

const AD_CLIENT = 'ca-pub-9027033456343227';

const GoogleAd: React.FC<GoogleAdProps> = ({
  adSlot,
  className = '',
  style,
  format = 'auto',
  fullWidthResponsive = true,
  layoutKey,
}) => {
  const adRef = useRef<HTMLElement | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const adElement = adRef.current;
    if (!adElement || initialized) return;
    if (adElement.getAttribute('data-adsbygoogle-status') === 'done') {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      setInitialized(true);
    } catch (error) {
      console.error('Failed to load Google AdSense slot', error);
    }
  }, [initialized]);

  return (
    <ins
      ref={adRef as React.RefObject<HTMLElement>}
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', ...style }}
      data-ad-client={AD_CLIENT}
      data-ad-slot={adSlot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
    />
  );
};

export default GoogleAd;
