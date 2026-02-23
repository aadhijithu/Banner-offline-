
import React, { useRef, useEffect, useState } from 'react';
import { BannerData, ThemeColors } from '../types';
import { THEME_CONFIGS, BANNER_WIDTH, BANNER_HEIGHT, IconRenderer } from '../constants';

interface BannerPreviewProps {
  data: BannerData;
}

export const BannerPreview: React.FC<BannerPreviewProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const theme: ThemeColors = THEME_CONFIGS[data.theme];
  // Determine specific theme for the tag, fallback to global theme if undefined
  const tagTheme: ThemeColors = THEME_CONFIGS[data.tagTheme || data.theme];

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        const padding = 60; // Increased padding for better visual breathing room
        const availableWidth = width - padding;
        const availableHeight = height - padding;
        const scaleX = availableWidth / BANNER_WIDTH;
        const scaleY = availableHeight / BANNER_HEIGHT;
        setScale(Math.min(scaleX, scaleY));
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex items-center justify-center bg-transparent overflow-hidden"
    >
      <div 
        style={{ 
          width: BANNER_WIDTH, 
          height: BANNER_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flexShrink: 0,
        }}
        className="shadow-2xl rounded-sm transition-all duration-300 ease-out ring-1 ring-black/5"
      >
        <div 
          id="capture-area"
          className="relative w-full h-full bg-white overflow-hidden"
          style={{ fontFamily: "'TASA Orbiter Display', 'Inter', sans-serif" }}
        >
          {/* Background Layer */}
          <div className="absolute inset-0 w-full h-full z-0 bg-[#d9d9d9]">
            {data.showBg && data.backgroundImage && (
              <img 
                src={data.backgroundImage} 
                alt="Background" 
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Text Block */}
          <div 
            className="absolute z-10 flex flex-col justify-between items-start"
            style={{
              top: '75px',
              left: data.textOnRight ? '620px' : '215px',
              width: '365px',
              height: '478px',
            }}
          >
            {/* Logo Row */}
            <div className="flex items-center gap-[10px] h-[35px]">
              {data.logo && (
                <div className="w-[117.5px] h-[25px]">
                  <img src={data.logo} alt="Razorpay" className="w-full h-full object-contain" />
                </div>
              )}
              
              {data.showMerchantLogo && data.merchantLogo && (
                <div className="flex items-center gap-[10px] h-[35px]">
                   <div className="w-[1px] h-[35px] bg-[#c0c0c0]"></div>
                   <img src={data.merchantLogo} alt="Merchant" className="h-[25px] w-auto object-contain" />
                </div>
              )}
            </div>

            {/* Content Group */}
            <div className="flex flex-col gap-[20px] w-full">
              
              {/* Tag Badge */}
              {data.showTag && (
                <div 
                  className="inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-[20px] self-start"
                  style={{ backgroundColor: tagTheme.tagBg }}
                >
                  <div className="w-[24px] h-[24px] flex items-center justify-center p-[4px]">
                     <IconRenderer icon={data.tagIcon} color={(data.tagTheme || data.theme) === 'razorpay-blue' ? '#3395FF' : tagTheme.tagText} />
                  </div>
                  <span 
                    className="font-medium text-[14px] leading-[20px] tracking-normal"
                    style={{ 
                      color: tagTheme.tagText,
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    {data.tag}
                  </span>
                </div>
              )}

              {/* Inner Content */}
              <div className="flex flex-col gap-[20px] w-full">
                
                {/* Headings */}
                {data.showH1 && (
                  <h1 className="w-full overflow-hidden text-ellipsis font-semibold text-[48px] leading-[56px]" style={{ color: theme.text }}>
                    {data.h1Text}
                  </h1>
                )}
                {data.showH2 && (
                  <h2 className="w-full overflow-hidden text-ellipsis font-semibold text-[36px] leading-[44px]" style={{ color: theme.text }}>
                    {data.h2Text}
                  </h2>
                )}
                {data.showH3 && (
                  <h3 className="w-full overflow-hidden text-ellipsis font-medium text-[28px] leading-[36px]" style={{ color: theme.text }}>
                    {data.h3Text}
                  </h3>
                )}

                {/* Divider */}
                {data.showDivider && (
                  <div>
                    {data.imageDivider && data.dividerImageSrc ? (
                       <div className="w-[90px] h-[12px]">
                         <img src={data.dividerImageSrc} alt="divider" className="w-full h-full object-contain" />
                       </div>
                    ) : data.lineDivider ? (
                      <div className="w-[240px] h-[1px]" style={{ background: theme.divider }}></div>
                    ) : null}
                  </div>
                )}

                {/* Sub-text: Paragraph */}
                {data.showSubText && data.showParagraph && (
                  <p className="w-full font-normal text-[24px] leading-[32px]" style={{ color: theme.text }}>
                    {data.paraText}
                  </p>
                )}

                {/* Sub-text: Pointers */}
                {data.showSubText && data.showPointers && (
                  <div className="flex flex-col gap-[10px] w-full">
                    {[1, 2, 3, 4].map(num => {
                      const show = data[`showPoint${num}` as keyof BannerData];
                      const text = data[`p${num}Text` as keyof BannerData];
                      const icon = data[`p${num}Icon` as keyof BannerData];
                      
                      if (!show) return null;
                      
                      return (
                        <div key={num} className="flex items-start gap-[10px] w-full">
                          <div className="w-[28px] h-[28px] shrink-0 flex items-center justify-center p-[4px]">
                             <IconRenderer icon={icon as any} color={data.theme === 'razorpay-blue' ? theme.text : theme.iconStroke} />
                          </div>
                          <span className="flex-1 font-normal text-[18px] leading-[26px]" style={{ color: theme.text }}>
                            {text as string}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>

            {/* Spacer for bottom alignment if content is short */}
            <div></div> 

          </div>
        </div>
      </div>
    </div>
  );
};
