
export type BannerTheme = 'default' | 'light' | 'razorpay-blue';
export type TagIcon = 'check-circle' | 'arrow-right-circle' | 'star' | 'zap' | 'award';
export type LayoutPreset = 'Side Text/onLight' | 'Side Text/onDark';

export interface BannerData {
  layout: LayoutPreset;
  textOnLeft: boolean;
  textOnRight: boolean;

  showBg: boolean;
  backgroundImage: string;

  product: string;
  logo: string;
  showMerchantLogo: boolean;
  merchantLogo: string;
  merchantName: string;

  showTag: boolean;
  tag: string;
  tagIcon: TagIcon;
  tagTheme: BannerTheme;

  showH1: boolean;
  h1Text: string;
  showH2: boolean;
  h2Text: string;
  showH3: boolean;
  h3Text: string;

  showDivider: boolean;
  lineDivider: boolean;
  imageDivider: boolean;
  dividerImageSrc: string;

  showSubText: boolean;
  showParagraph: boolean;
  paraText: string;

  showPointers: boolean;
  showPoint1: boolean;
  p1Icon: TagIcon;
  p1Text: string;
  showPoint2: boolean;
  p2Icon: TagIcon;
  p2Text: string;
  showPoint3: boolean;
  p3Icon: TagIcon;
  p3Text: string;
  showPoint4: boolean;
  p4Icon: TagIcon;
  p4Text: string;

  theme: BannerTheme;
}

export interface ThemeColors {
  text: string;
  tagText: string;
  tagBg: string;
  divider: string;
  iconStroke: string;
}
