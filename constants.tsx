
import React from 'react';
import { BannerData, ThemeColors, BannerTheme, TagIcon } from './types';

export const BANNER_WIDTH = 1200;
export const BANNER_HEIGHT = 628;

export const PRODUCTS: Record<string, { label: string; logos: { lightBg: string; darkBg: string } }> = {
  razorpay: {
    label: 'Razorpay',
    logos: {
      lightBg: 'https://gpgzvawhakdsbakxyxxr.supabase.co/storage/v1/object/public/banner/Logos/Razorpay/Light%20BG.svg',
      darkBg: 'https://gpgzvawhakdsbakxyxxr.supabase.co/storage/v1/object/public/banner/Logos/Razorpay/Dark%20BG.svg'
    }
  },
  international: {
    label: 'International Payments',
    logos: {
      lightBg: 'https://gpgzvawhakdsbakxyxxr.supabase.co/storage/v1/object/public/banner/Logos/Razorpay-International-Payments/Razorpay%20International%20Payments%20light%20BG.svg',
      darkBg: 'https://gpgzvawhakdsbakxyxxr.supabase.co/storage/v1/object/public/banner/Logos/Razorpay-International-Payments/Razorpay%20International%20Payments%20dark%20BG.svg'
    }
  },
  rize: {
    label: 'Razorpay Rize',
    logos: {
      lightBg: 'https://gpgzvawhakdsbakxyxxr.supabase.co/storage/v1/object/public/banner/Logos/RazorpayRize/RazorpayRize%20light-BG.svg',
      darkBg: 'https://gpgzvawhakdsbakxyxxr.supabase.co/storage/v1/object/public/banner/Logos/RazorpayRize/RazorpayRize%20dark-BG.svg'
    }
  },
  razorpayx: {
    label: 'RazorpayX',
    logos: {
      lightBg: 'https://gpgzvawhakdsbakxyxxr.supabase.co/storage/v1/object/public/banner/Logos/RazorpayX/Razorpayx%20light%20BG.svg',
      darkBg: 'https://gpgzvawhakdsbakxyxxr.supabase.co/storage/v1/object/public/banner/Logos/RazorpayX/Razorpayx%20dark%20BG.svg'
    }
  }
};

export const LOGO_PRESETS = {
  lightBg: PRODUCTS.razorpay.logos.lightBg,
  darkBg: PRODUCTS.razorpay.logos.darkBg
};

export const DEFAULT_BANNER: BannerData = {
  layout: "Side Text/onLight",
  textOnLeft: true,
  textOnRight: false,

  showBg: false,
  backgroundImage: "",

  product: 'razorpay',
  logo: PRODUCTS.razorpay.logos.lightBg,
  showMerchantLogo: false,
  merchantLogo: "",
  merchantName: "",

  showTag: true,
  tag: "Deep-Dive",
  tagIcon: "check-circle",
  tagTheme: "default",

  showH1: true,
  h1Text: "Lorem ipsum dolor sit amet, consectetur",
  showH2: false,
  h2Text: "Secondary Heading Text",
  showH3: false,
  h3Text: "Tertiary Heading Text",

  showDivider: true,
  lineDivider: true,
  imageDivider: false,
  dividerImageSrc: "",

  showSubText: true,
  showParagraph: false,
  paraText: "Lorem ipsum dolor sitmet, consectetur",

  showPointers: true,
  showPoint1: true,
  p1Icon: "check-circle",
  p1Text: "Lorem ipsum dolor sitmet, consectetur adipiscing elit, sed do eiusmod tempor",
  showPoint2: true,
  p2Icon: "check-circle",
  p2Text: "Lorem ipsum dolor sitmet, consectetur adipiscing elit, sed do eiusmod tempor",
  showPoint3: false,
  p3Icon: "check-circle",
  p3Text: "",
  showPoint4: false,
  p4Icon: "check-circle",
  p4Text: "",

  theme: "default"
};

export const THEME_CONFIGS: Record<BannerTheme, ThemeColors> = {
  default: {
    text: '#192839',
    tagText: '#768EA7',
    tagBg: 'rgba(48, 94, 255, 0.09)',
    divider: 'linear-gradient(90deg, #192839 0%, rgba(25, 40, 57, 0) 100%)',
    iconStroke: '#192839'
  },
  light: {
    text: '#FFFFFF',
    tagText: '#FFFFFF',
    tagBg: 'rgba(255, 255, 255, 0.2)',
    divider: 'linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)',
    iconStroke: '#FFFFFF'
  },
  'razorpay-blue': {
    text: '#3395FF',
    tagText: '#3395FF',
    tagBg: 'rgba(51, 149, 255, 0.15)',
    divider: 'linear-gradient(90deg, #3395FF 0%, rgba(51, 149, 255, 0) 100%)',
    iconStroke: '#3395FF'
  }
};

export const ICONS: Record<TagIcon, React.ReactNode> = {
  'check-circle': <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
  'arrow-right-circle': <><circle cx="12" cy="12" r="10"/><polyline points="12 16 16 12 12 8"/><line x1="8" y1="12" x2="16" y2="12"/></>,
  'star': <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
  'zap': <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
  'award': <><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></>
};

export const IconRenderer = ({ icon, color }: { icon: TagIcon, color?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color || "currentColor"} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="w-full h-full"
  >
    {ICONS[icon]}
  </svg>
);

export const IP_VISUAL_IDENTITY = {
  name: "International Payments",
  shortName: "IP",
  description: "Razorpay's cross-border payments suite. Covers both Export Flow (Indian businesses accepting international payments, settling in INR) and Import Flow (international businesses accepting payments from Indian customers via UPI).",

  logos: {
    light: "razorpay-ip-logo-dark.svg",
    dark: "razorpay-ip-logo-white.svg"
  },

  subProducts: {
    export: {
      label: "Export Flow",
      description: "Indian businesses export goods/services, receive international payments, settle in INR.",
      products: [
        {
          name: "International Card Payments",
          description: "Accept payments from cards issued outside India. Key domains: Travel, E-commerce, Education.",
          keyAccounts: ["Indigo", "Zomato", "CueMath", "Ferns N Petals", "Sabyasachi", "FabIndia"],
          visualCues: ["international credit/debit cards", "card terminal", "diverse currency symbols on cards"]
        },
        {
          name: "MoneySaver Export Account",
          description: "Cross-border bank transfers for B2B. Most affordable way to receive big-ticket international payments.",
          merchantSegments: ["Service Exporters (IT, SaaS, Travel, Education)", "Freelancers (developers, designers, digital marketers)", "Global E-commerce Sellers (Indian D2C on Amazon.com)", "Goods Exporters (textile, jewellery, machinery, handicraft)"],
          visualCues: ["bank transfer arrows", "B2B invoice documents", "wire transfer flow between countries"]
        },
        {
          name: "Alternative Payment Methods",
          description: "PayPal, Klarna, AliPay, GrabPay, Zip, Apple Pay — region-specific payment methods.",
          visualCues: ["payment method badges/icons", "regional flags", "multi-method payment screen"]
        },
        {
          name: "Compliance Suite",
          description: "Softex filing, IEC application, Global Tax Compliance for exporters.",
          visualCues: ["compliance checkmarks", "regulatory documents", "tax calculation interface"]
        },
        {
          name: "Chargeback Shield",
          description: "Fraud protection — Razorpay guarantees no fraud chargebacks, absorbs the cost.",
          visualCues: ["shield icon", "protection barrier", "fraud detection interface"]
        }
      ]
    },
    import: {
      label: "Import Flow",
      description: "International businesses accept payments from Indian customers. Money flows out of India. UPI is the primary payment method.",
      keyAccounts: ["Coursera", "Bumble", "Wix", "DropBox", "Airbnb"],
      keyGeographies: ["USA", "UK", "Europe", "Singapore", "Malaysia"],
      visualCues: ["UPI logo as hero element", "Indian consumer with phone", "international brand storefronts", "India map with payment flows outward"]
    }
  },

  visualDNA: {
    summary: "3D renders with a bright sky-blue world, floating currency coins, global commerce objects, and diverse people. The look is clean, optimistic, and premium — not dark/corporate.",

    colorPalette: {
      primary: "#3395FF (Razorpay blue — used on 3D coins, UI accents, gradient washes)",
      secondary: "#192839 (deep navy — text, dark coin rims)",
      accent: "#4ADE80 (green — success badges, checkmarks, UPI icons)",
      background: "Light sky-blue gradient (#D4E8FF → #EFF6FF) with soft white clouds, OR bright Razorpay blue (#3366FF → #5B8DEF) for bold variants",
      metallic: "Silver-chrome (#C0C8D4) and blue-metallic (#5B8DEF) on 3D coin surfaces"
    },

    "3dObjects": [
      "Currency coins — circular, thick 3D discs with embossed currency symbols ($, ₩, ₣, ₹, ¥). Surface is blue-metallic or silver-chrome with reflective rim edges. Always floating at slight angles.",
      "Globe — large translucent blue sphere showing continental outlines, often with arc lines connecting countries and small 3D parcels landing on different locations.",
      "Shipping parcels — small brown cardboard boxes (3D) sitting on or orbiting the globe, representing cross-border e-commerce.",
      "Airplane — white commercial aircraft in flight, angled diagonally, representing international transit and global reach.",
      "3D Razorpay arrow — large chrome/blue metallic Razorpay logo arrow as a hero 3D object.",
      "Rupee symbol — 3D chrome ₹ symbol on a pedestal/column, representing Indian settlement.",
      "UPI badge — small green rounded badge with UPI logo, indicating payment method support.",
      "Credit/debit cards — 3D floating international payment cards with chip and contactless symbols.",
      "Shield — 3D metallic shield with checkmark, representing chargeback protection and security.",
      "Bank transfer arrows — 3D curved arrows connecting two bank icons across a globe, representing MoneySaver wire transfers."
    ],

    people: [
      "Indian business owner / exporter — professional attire, confident, holding phone showing payment dashboard or celebrating a successful transaction. Represents the Export Flow merchant.",
      "Freelancer at workspace — young professional at a laptop/desk setup, casual-professional attire. Represents the MoneySaver freelancer segment (developers, designers, digital marketers).",
      "Indian consumer making a payment — person holding phone with UPI payment screen, shopping or subscribing context. Represents the Import Flow buyer.",
      "International business team — diverse group in a modern office, looking at India market data on a screen. Represents Import Flow merchants expanding into India.",
      "E-commerce seller — person packing/shipping products with international shipping labels. Represents the Global E-commerce Seller segment."
    ],

    visualRules: {
      lighting: "Bright, airy, daylight feel. Soft studio lighting on 3D objects with visible reflections and subtle shadows. Sky backgrounds have natural cloud formations.",
      depth: "Objects at different Z-depths — large coins in foreground (slightly cropped at edges), globe mid-ground, smaller coins and parcels in background. Creates cinematic parallax.",
      composition: "Hero object (globe or 3D arrow) center or center-right. Currency coins scattered around floating at various angles. Airplane top-left flying toward viewer. Parcels on globe. Generous negative space on one side for text overlay.",
      texture: "3D objects have smooth, reflective metallic surfaces — not matte. Chrome highlights on edges. Coins look premium, not flat illustrations.",
      mood: "Optimistic, aspirational, global scale. NOT dark/moody. Think bright sky, clouds, open world.",
      peopleStyle: "When people are included: photorealistic render, natural skin tones, professional but approachable. Person placed on the text-opposite side, slightly overlapping with 3D objects. 3D coins/globe elements float around or behind the person to maintain the IP visual identity.",
      noGos: "No stock-photo generic handshakes. No flat 2D illustrations. No busy/cluttered compositions. No pure black backgrounds. No cartoonish or overly stylized people."
    }
  },

  domainVisualMapping: {
    description: "When Gemini identifies a merchant's domain (from web search or known key accounts), it should use these domain-specific visual objects alongside the core IP 3D elements.",
    domains: {
      "Travel & Hospitality": {
        objects: ["airplane tickets", "suitcase", "passport", "hotel building", "location pins on globe"],
        keyAccounts: ["Indigo", "Adam Vacations", "Airbnb"]
      },
      "E-commerce": {
        objects: ["shopping bags", "product boxes", "delivery truck", "storefront", "shopping cart"],
        keyAccounts: ["FabIndia", "Sabyasachi", "Ferns N Petals"]
      },
      "Education & EdTech": {
        objects: ["laptop with course interface", "graduation cap", "books", "certificate"],
        keyAccounts: ["Coursera", "CueMath"]
      },
      "SaaS & Technology": {
        objects: ["laptop with app dashboard", "cloud icon", "subscription UI", "API code blocks"],
        keyAccounts: ["Wix", "DropBox"]
      },
      "Food & Delivery": {
        objects: ["food delivery bag", "restaurant storefront", "mobile ordering screen"],
        keyAccounts: ["Zomato"]
      },
      "Social & Lifestyle": {
        objects: ["mobile app interface", "chat/social icons", "premium subscription badge"],
        keyAccounts: ["Bumble"]
      },
      "Freelance & Services": {
        objects: ["workspace setup", "design tools", "laptop with project dashboard", "invoice document"],
        keyAccounts: []
      },
      "Goods Export": {
        objects: ["textile rolls", "jewellery display", "machinery parts", "handicraft items", "shipping containers"],
        keyAccounts: []
      }
    }
  },

  merchantContextRules: {
    description: "When a merchant/co-brand is selected, Gemini should dynamically generate a context-aware prompt by combining the IP visual DNA with the merchant's industry and product.",
    instructions: "1. Search the web for what the merchant company does (industry, products, target market). 2. Identify which domain they belong to from domainVisualMapping. 3. Pick 2-3 visual objects from that domain's object list. 4. Determine if this is an Export or Import flow merchant. 5. Blend domain objects + flow-relevant IP objects into one composition — keep 3D coins, sky-blue background, but add merchant-relevant objects. 6. Use the merchant's brand color as a subtle accent alongside Razorpay blue.",
    exampleMerchants: {
      "Airbnb": "Import Flow. Travel & Hospitality. Blend IP visuals with: 3D miniature house/apartment, suitcase, location pin on globe. Feature globe with arc lines connecting traveler destinations, currency coins, UPI badge (Indian customers paying). Bright sky background. Subtle Airbnb coral (#FF5A5F) accent.",
      "Coursera": "Import Flow. Education & EdTech. Blend IP visuals with: 3D laptop showing course interface, graduation cap, certificate. Globe with students connecting from different countries, UPI badge for Indian student payments. Bright sky-blue background. Subtle Coursera blue (#0056D2) accent.",
      "Zomato": "Export Flow. Food & Delivery. Blend IP visuals with: food delivery bag, restaurant storefront, mobile ordering screen. Currency coins for international card payments, globe showing delivery reach. Subtle Zomato red (#E23744) accent.",
      "Indigo": "Export Flow. Travel & Hospitality. Blend IP visuals with: airplane (Indigo-style), boarding pass, travel suitcase. Currency coins for international ticket payments, globe with flight routes. Subtle Indigo blue (#001F6D) accent.",
      "Wix": "Import Flow. SaaS & Technology. Blend IP visuals with: laptop showing website builder, cloud hosting icon, subscription UI. UPI badge for Indian subscribers, currency coins. Subtle Wix black (#000 on one element only).",
      "FabIndia": "Export Flow. E-commerce + Goods Export. Blend IP visuals with: textile rolls, ethnic clothing display, shopping bag. Currency coins for international card payments, globe with shipping parcels. Subtle FabIndia earthy tone accent."
    }
  },

  promptGenerationRules: {
    description: "Rules for Gemini to dynamically create image generation prompts. Gemini should NOT use hardcoded prompts — it should compose prompts on-the-fly using these rules + the visual DNA above.",

    systemPrompt: "You are an image prompt generator for Razorpay International Payments blog banners. Generate image prompts that match the IP visual identity. Every prompt MUST follow these rules:",

    mandatoryElements: [
      "ALWAYS include at least 2 floating 3D currency coins (silver-chrome or blue-metallic) with embossed symbols ($, ₩, ₣, ₹, ¥)",
      "ALWAYS use a bright sky-blue gradient background with soft white clouds — NOT dark/black",
      "ALWAYS specify '3D render' style with 'reflective metallic surfaces' and 'soft studio lighting'",
      "ALWAYS leave negative space on the side where text will overlay (check textOnLeft/textOnRight setting)",
      "ALWAYS end with 'clean composition, premium fintech aesthetic, 1200x628'",
      "When people are included: ALWAYS render them photorealistically with natural skin tones, professional attire, and natural poses. Place the person on the opposite side from text. Float 3D coins/objects around them to maintain IP visual identity."
    ],

    optionalElements: [
      "3D globe with continental outlines and arc connection lines",
      "White commercial airplane in diagonal flight",
      "Small brown 3D shipping parcels on or near the globe",
      "Large 3D chrome Razorpay arrow logo as hero element",
      "3D chrome ₹ symbol on pedestal",
      "Green UPI badge",
      "3D floating credit/debit cards",
      "3D metallic shield with checkmark (for security/chargeback topics)",
      "Bank transfer flow arrows between countries",
      "People — Indian exporter, freelancer, consumer, or international team (see people descriptions in visualDNA)"
    ],

    scenarioTemplates: {
      description: "High-level scenarios the user can pick. Gemini fills in the details using visual DNA rules + sub-product context.",
      scenarios: [
        { "name": "Global Reach", "focus": "Globe + coins + airplane + parcels. Emphasize worldwide connectivity and cross-border scale." },
        { "name": "Currency World", "focus": "Multiple 3D currency coins as hero objects. Close-up, floating, metallic detail. Diverse currency symbols." },
        { "name": "Export: Cards & APMs", "focus": "Export Flow. 3D floating credit/debit cards + currency coins + payment method badges. Indian business receiving international payments." },
        { "name": "Export: MoneySaver", "focus": "Export Flow. Bank transfer arrows connecting countries on globe + B2B invoice + currency coins. Focus on affordable cross-border wire transfers." },
        { "name": "Import: UPI for Global Brands", "focus": "Import Flow. UPI badge as hero + Indian consumer with phone + international brand elements. Globe showing payment flows from India outward." },
        { "name": "Chargeback & Security", "focus": "3D metallic shield + protection barrier + currency coins. Trust and fraud prevention feel." },
        { "name": "People & Payments", "focus": "Person (exporter, freelancer, or consumer based on context) surrounded by 3D payment objects. Human-centric, aspirational." },
        { "name": "India Opportunity", "focus": "India map highlighted on globe + ₹ symbol + UPI badge + international coins flowing in. Massive market opportunity feel." },
        { "name": "Merchant Co-brand", "focus": "Combine IP visual DNA with merchant-specific objects from domainVisualMapping. Gemini researches merchant from web and blends their domain objects." },
        { "name": "Custom", "focus": "User provides free-form description. Gemini wraps it with mandatory IP visual rules." }
      ]
    },

    textSideAwareness: "Check the current banner state: if textOnLeft is true, place objects on the RIGHT side of the image. If textOnRight is true, place objects on the LEFT side. Always specify this in the prompt as 'objects concentrated on the [opposite] side, leaving generous negative space on the [text] side for text overlay.'",

    themeSyncRules: {
      "default": "Use bright sky-blue gradient background (#D4E8FF → #EFF6FF) with clouds",
      "light": "Same sky-blue background but ensure high contrast for white text overlay — slightly deeper blue gradient",
      "razorpay-blue": "Use bolder Razorpay blue background (#3366FF → #5B8DEF) with white clouds, all text-area side should be darker for contrast"
    }
  }
};
