import React from 'react';

interface FlagIconProps {
  locale: string;
  className?: string;
}

const FlagIcon: React.FC<FlagIconProps> = ({ locale, className = "w-5 h-4" }) => {
  const getFlagSvg = () => {
    switch (locale) {
      case 'pt':
        return (
          <svg viewBox="0 0 640 480" className={className}>
            <defs>
              <clipPath id="pt-a">
                <path fillOpacity=".7" d="M-85.3 0h682.6v512H-85.3z"/>
              </clipPath>
            </defs>
            <g fillRule="evenodd" clipPath="url(#pt-a)" transform="translate(80) scale(.9375)">
              <path fill="#060" d="M-85.3 0H238v512H-85.3z"/>
              <path fill="#ff0" d="M238 0h323.3v512H238z"/>
              <circle cx="238" cy="256" r="89" fill="#ff0" stroke="#000" strokeWidth="3"/>
              <path fill="#060" d="m238 167 23 71h-46z"/>
              <circle cx="238" cy="256" r="67" fill="#fff"/>
              <circle cx="238" cy="256" r="45" fill="#ff0"/>
              <path fill="#060" d="M238 211c25 0 45 20 45 45s-20 45-45 45-45-20-45-45 20-45 45-45z"/>
            </g>
          </svg>
        );
      case 'en':
        return (
          <svg viewBox="0 0 640 480" className={className}>
            <defs>
              <clipPath id="gb-a">
                <path fillOpacity=".7" d="M-85.3 0h682.6v512H-85.3z"/>
              </clipPath>
            </defs>
            <g clipPath="url(#gb-a)" transform="translate(80) scale(.9375)">
              <g strokeWidth="1pt">
                <path fill="#012169" d="M-256 0H768v512H-256z"/>
                <path fill="#FFF" d="m-256 0 512 256L-256 512m1024 0L256 256 768 0"/>
                <path fill="#C8102E" d="m170.7 0 341.3 256L170.7 512M-256 0l341.3 256L-256 512"/>
                <path fill="#FFF" d="M-256 176v160h1024V176z"/>
                <path fill="#C8102E" d="M-256 208v96h1024v-96z"/>
                <path fill="#FFF" d="M170.7 0v512h170.6V0z"/>
                <path fill="#C8102E" d="M204.8 0v512h102.4V0z"/>
              </g>
            </g>
          </svg>
        );
      case 'zh':
        return (
          <svg viewBox="0 0 640 480" className={className}>
            <defs>
              <path id="cn-a" fill="#ffde00" d="M-.6.8 0-1 .6.8-1-.3h2z"/>
            </defs>
            <path fill="#de2910" d="M0 0h640v480H0z"/>
            <use width="30" height="20" transform="matrix(71.9991 0 0 72 120 120)" xlinkHref="#cn-a"/>
            <use width="30" height="20" transform="matrix(-12.33562 -20.73906 20.73906 -12.33562 240 160)" xlinkHref="#cn-a"/>
            <use width="30" height="20" transform="matrix(-3.38573 -23.75998 23.75998 -3.38573 240 240)" xlinkHref="#cn-a"/>
            <use width="30" height="20" transform="matrix(6.5991 -23.0749 23.0749 6.5991 240 320)" xlinkHref="#cn-a"/>
            <use width="30" height="20" transform="matrix(14.9991 -18.73906 18.73906 14.9991 240 400)" xlinkHref="#cn-a"/>
          </svg>
        );
      case 'hi':
        return (
          <svg viewBox="0 0 640 480" className={className}>
            <path fill="#f93" d="M0 0h640v160H0z"/>
            <path fill="#fff" d="M0 160h640v160H0z"/>
            <path fill="#128807" d="M0 320h640v160H0z"/>
            <g transform="translate(320 240)">
              <circle r="52" fill="#008"/>
              <circle r="50" fill="#fff"/>
              <circle r="6" fill="#008"/>
              <g id="in-d">
                <g id="in-c">
                  <g id="in-b">
                    <g id="in-a" fill="#008">
                      <circle r="2" transform="rotate(7.5 -8 133.5)"/>
                      <path d="M0 17A17 17 0 0 1 0 51 17 17 0 0 1 0 17z"/>
                    </g>
                    <use width="100%" height="100%" transform="rotate(15)" xlinkHref="#in-a"/>
                  </g>
                  <use width="100%" height="100%" transform="rotate(30)" xlinkHref="#in-b"/>
                </g>
                <use width="100%" height="100%" transform="rotate(60)" xlinkHref="#in-c"/>
              </g>
              <use width="100%" height="100%" transform="rotate(120)" xlinkHref="#in-d"/>
              <use width="100%" height="100%" transform="rotate(240)" xlinkHref="#in-d"/>
            </g>
          </svg>
        );
      case 'ru':
        return (
          <svg viewBox="0 0 640 480" className={className}>
            <g fillRule="evenodd" strokeWidth="1pt">
              <path fill="#fff" d="M0 0h640v480H0z"/>
              <path fill="#0039a6" d="M0 160h640v320H0z"/>
              <path fill="#d52b1e" d="M0 320h640v160H0z"/>
            </g>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 640 480" className={className}>
            <rect width="640" height="480" fill="#ccc"/>
            <text x="320" y="240" textAnchor="middle" fill="#666" fontSize="24">?</text>
          </svg>
        );
    }
  };

  return getFlagSvg();
};

export default FlagIcon;
