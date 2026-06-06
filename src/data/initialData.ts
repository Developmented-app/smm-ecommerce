import { SmmService, Product } from '../types';

export const INITIAL_SERVICES: SmmService[] = [
  // Instagram
  {
    id: 'ig-followers-hq',
    category: 'Instagram',
    name: 'Instagram High-Quality Followers [Real Profile Pictures / Active]',
    pricePerThousand: 4.80,
    minQuantity: 100,
    maxQuantity: 10000,
    description: 'High-quality organic-looking followers. Dropping rate 0-3%. Guaranteed auto-refill for 30 days.'
  },
  {
    id: 'ig-likes-super',
    category: 'Instagram',
    name: 'Instagram Super-Fast Likes [Instant / Safe Delivery]',
    pricePerThousand: 1.20,
    minQuantity: 50,
    maxQuantity: 5000,
    description: 'Instant delivery. Safe with zero drop rate. Works with any public photo or video link.'
  },
  {
    id: 'ig-views-reels',
    category: 'Instagram',
    name: 'Instagram Reels Video Views [Viral Boosting / Global]',
    pricePerThousand: 0.80,
    minQuantity: 500,
    maxQuantity: 50000,
    description: 'High retention video views to prompt Instagram algorithm for discovery. Lifetime guarantee.'
  },
  // TikTok
  {
    id: 'tt-followers-real',
    category: 'TikTok',
    name: 'TikTok Quality Followers [Instant Activation]',
    pricePerThousand: 6.50,
    minQuantity: 100,
    maxQuantity: 15000,
    description: 'Super-premium TikTok followers with realistic feeds. Instant boost to help stream access levels.'
  },
  {
    id: 'tt-likes-organic',
    category: 'TikTok',
    name: 'TikTok Video Likes [Gradual / Algorithm Safe]',
    pricePerThousand: 2.10,
    minQuantity: 100,
    maxQuantity: 8000,
    description: 'Gradual distribution pattern to perfectly replicate viral trending timelines.'
  },
  {
    id: 'tt-views-instant',
    category: 'TikTok',
    name: 'TikTok Instant Video Views [Increases Authority]',
    pricePerThousand: 0.25,
    minQuantity: 1000,
    maxQuantity: 100000,
    description: 'Increases views count instantly. Extremely cheap and useful for social credibility.'
  },
  // YouTube
  {
    id: 'yt-subs-premium',
    category: 'YouTube',
    name: 'YouTube Active Subscribers [No-Drop Guarantee / Real]',
    pricePerThousand: 32.00,
    minQuantity: 50,
    maxQuantity: 2000,
    description: 'Premium organic subscribers. Safe for monetization rules. Weekly drip schedule options.'
  },
  {
    id: 'yt-views-monetizable',
    category: 'YouTube',
    name: 'YouTube High-Retention Watch-Time Views [Monetizable]',
    pricePerThousand: 9.50,
    minQuantity: 500,
    maxQuantity: 20000,
    description: '3-5 minutes average watch retention per view. Recommended for new videos aiming to unlock partnership status.'
  },
  // Twitter / X
  {
    id: 'tw-followers-nft',
    category: 'Twitter (X)',
    name: 'Twitter (X) Followers [Tech & Web3-Focused Profiles]',
    pricePerThousand: 14.20,
    minQuantity: 100,
    maxQuantity: 5000,
    description: 'Followers matching tech/crypto interests. Fully safe, non-suspicious patterns.'
  },
  {
    id: 'tw-retweets-premium',
    category: 'Twitter (X)',
    name: 'Twitter (X) High-Impact Retweets + Likes Custom Mix',
    pricePerThousand: 8.90,
    minQuantity: 50,
    maxQuantity: 3000,
    description: 'Shares and reposts to elevate thread reach. Highly realistic user flow distribution.'
  },
  // Facebook
  {
    id: 'fb-page-likes',
    category: 'Facebook',
    name: 'Facebook Page Likes + Followers [Global Audience]',
    pricePerThousand: 11.50,
    minQuantity: 100,
    maxQuantity: 10000,
    description: 'Boost your business page page-likes and followers count permanently.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'canva-social-bundle',
    name: 'Instagram Growth Blueprint & 150+ Canva Premium Reels Templates',
    category: 'Templates',
    price: 19.99,
    description: 'A comprehensive bundle of editable, luxury-styled Canva templates for Instagram Reels. Includes dark aesthetic videos, neutral story frameworks, and motivational highlights templates.',
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=480',
    downloadsCount: 1420,
    fileSize: '142 MB',
    rating: 4.9
  },
  {
    id: 'tiktok-viral-playbook',
    name: 'TikTok & Short-Form Video Mastery: 2026 Viral Algorithm Playbook',
    category: 'E-Books',
    price: 14.50,
    description: 'The step-by-step master strategy used by top content agencies to pull 10M+ aggregate views. Includes hooks list, retention formulas, audio sourcing secrets, and optimal export checklists.',
    imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=480',
    downloadsCount: 890,
    fileSize: '18 MB',
    rating: 4.8
  },
  {
    id: 'social-branding-kit',
    name: 'Ultimate Modern Brand Kit: Fonts, Logos, and Icons Asset Library',
    category: 'Assets',
    price: 24.99,
    description: 'An elegant designer kit containing premium customizable SVG icons, modern typography sheets, commercial-use gradients, and brand styles vectors to launch any high-end professional agency look.',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=480',
    downloadsCount: 450,
    fileSize: '310 MB',
    rating: 4.7
  },
  {
    id: 'viral-captions-bundle',
    name: '365 Days Content Calendar + 1,000+ High-Conversion Caption Fillips',
    category: 'Templates',
    price: 9.99,
    description: 'Never run out of social post ideas. Get a daily plan customized for niches alongside optimized marketing hook templates, calls to action, and thematic viral hashtag structures proven on X and IG.',
    imageUrl: 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=480',
    downloadsCount: 2110,
    fileSize: '8 MB',
    rating: 4.9
  },
  {
    id: 'influencer-contracts',
    name: 'Professional Influencer Outreach & Legal Agreement Templates',
    category: 'Assets',
    price: 15.00,
    description: 'Attorney-drafted and approved social agency legal documents, sponsorship templates, NDA agreements, and outreach email scripts written specifically for digital agency operations.',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=480',
    downloadsCount: 610,
    fileSize: '3.5 MB',
    rating: 4.6
  }
];
