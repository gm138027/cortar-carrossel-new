import React from 'react';
import GoogleAd from './GoogleAd';

interface FixedBannerAdProps {
  adSlot: string;
  position: 'top' | 'bottom';
  className?: string;
}

const FixedBannerAd: React.FC<FixedBannerAdProps> = ({ adSlot, position, className = '' }) => (
  <div
    className={`manual-fixed-banner manual-fixed-banner--${position} ${className}`}
    role="complementary"
    aria-hidden="true"
  >
    <GoogleAd adSlot={adSlot} />
  </div>
);

export default FixedBannerAd;

