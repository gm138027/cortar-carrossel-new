import React from 'react';
import GoogleAd from './GoogleAd';

interface SidebarAdProps {
  adSlot: string;
  position: 'left' | 'right';
}

const SidebarAd: React.FC<SidebarAdProps> = ({ adSlot, position }) => (
  <div
    className={`manual-sidebar-ad manual-sidebar-ad--${position}`}
    aria-hidden="true"
  >
    <GoogleAd adSlot={adSlot} />
  </div>
);

export default SidebarAd;

