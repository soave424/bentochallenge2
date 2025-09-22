import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      { protocol: 'https', hostname: 'img.daily.co.kr' },
      { protocol: 'https', hostname: 'mblogthumb-phinf.pstatic.net' },
      { protocol: 'https', hostname: 'www.gamachi.co.kr' },
      { protocol: 'https', hostname: 'recipe1.ezmember.co.kr' },
      { protocol: 'https', hostname: 'cafe24.poxo.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'img4.yna.co.kr' },
      { protocol: 'https', hostname: 'guryelocalfood.com' },
      { protocol: 'https', hostname: 'top-brix.com' },
      { protocol: 'https', hostname: 'sellermatch.co.kr' },
      { protocol: 'https', hostname: 'www.k-health.com' },
      { protocol: 'https', hostname: 'www.daehannews.kr' },
      { protocol: 'https', hostname: 'newmarket.co.kr' },
      { protocol: 'https', hostname: 'm.wiggle-wiggle.com' },
      { protocol: 'https', hostname: 'm.gainglobal.kr' },
      { protocol: 'https', hostname: 'gi.esmplus.com' },
      { protocol: 'https', hostname: 'img1.newsis.com' },
      { protocol: 'https', hostname: 'oasisprodproduct.edge.naverncp.com' },
      { protocol: 'https', hostname: 'i.namu.wiki' },
      { protocol: 'https', hostname: 'www.coffeebeankorea.com' },
      { protocol: 'https', hostname: 'm.boxgogo.co.kr' },
      { protocol: 'https', hostname: 'shop4.daumcdn.net' },
      { protocol: 'https', hostname: 'm.9062.co.kr' },
      { protocol: 'https', hostname: 'godomall.speedycdn.net' },
      { protocol: 'https', hostname: 'item.elandrs.com' },
      { protocol: 'https', hostname: 'image.made-in-china.com' },
      { protocol: 'https', hostname: 'gdimg1.gmarket.co.kr' },
      { protocol: 'https', hostname: 'sitem.ssgcdn.com' },
      { protocol: 'https', hostname: 'webimage.10x10.co.kr' },
      { protocol: 'https', hostname: 'sojoong.joins.com' },
      { protocol: 'https', hostname: 'img.etoday.co.kr' },
      { protocol: 'https', hostname: 'm.health.chosun.com' },
      { protocol: 'https', hostname: 'moongchi.kr' },
    ],
  },
};

export default nextConfig;

    
