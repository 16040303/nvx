export type ChannelPlatformGroup = {
  id: string
  title: string
  items: Array<{
    id: string
    name: string
    connectedLabel: string
    accent: string
    textColor?: string
    logoSrc?: string
  }>
}

export const CHANNEL_PLATFORM_GROUPS: ChannelPlatformGroup[] = [
  {
    id: 'social-core',
    title: 'Mạng xã hội phổ biến',
    items: [
      { id: 'facebook', name: 'Facebook', connectedLabel: 'Bạn đã kết nối 1 trang', accent: '#1877F2', logoSrc: '/assets/channel-logos/facebook.jpg' },
      { id: 'zalo-oa', name: 'Zalo OA', connectedLabel: 'Bạn đã kết nối 2 trang', accent: '#0068FF', logoSrc: '/assets/channel-logos/zalo-oa.png' },
      { id: 'instagram', name: 'Instagram', connectedLabel: 'Bạn đã kết nối 0 trang', accent: '#E4405F', logoSrc: '/assets/channel-logos/instagram.png' },
      { id: 'whatsapp', name: 'WhatsApp', connectedLabel: 'Bạn đã kết nối 0 trang', accent: '#25D366', logoSrc: '/assets/channel-logos/whatsapp.png' },
    ],
  },
  {
    id: 'chat-platforms',
    title: 'Kênh chat và cộng đồng',
    items: [
      { id: 'wechat', name: 'Wechat', connectedLabel: 'Bạn đã kết nối 0 trang', accent: '#51C332', logoSrc: '/assets/channel-logos/wechat.png' },
      { id: 'telegram', name: 'Telegram', connectedLabel: 'Bạn đã kết nối 0 trang', accent: '#229ED9', logoSrc: '/assets/channel-logos/telegram.png' },
      { id: 'line', name: 'Line', connectedLabel: 'Bạn đã kết nối 0 trang', accent: '#00C300', logoSrc: '/assets/channel-logos/line.png' },
      { id: 'viber', name: 'Viber', connectedLabel: 'Bạn đã kết nối 0 trang', accent: '#7360F2', logoSrc: '/assets/channel-logos/viber.png' },
    ],
  },
  {
    id: 'commerce',
    title: 'Sàn thương mại điện tử',
    items: [
      { id: 'tiktok', name: 'TikTok', connectedLabel: 'Bạn đã kết nối 0 trang', accent: '#111111', textColor: '#111111', logoSrc: '/assets/channel-logos/tiktok.png' },
      { id: 'lazada', name: 'Lazada', connectedLabel: 'Bạn đã kết nối 0 trang', accent: '#0F146D', logoSrc: '/assets/channel-logos/lazada.jpg' },
      { id: 'shopee', name: 'Shopee', connectedLabel: 'Bạn đã kết nối 0 trang', accent: '#EE4D2D', logoSrc: '/assets/channel-logos/shopee.png' },
    ],
  },
  {
    id: 'travel',
    title: 'OTA và du lịch',
    items: [
      { id: 'booking', name: 'Booking.com', connectedLabel: 'Bạn đã kết nối 0 trang', accent: '#003580' },
      { id: 'agoda', name: 'Agoda', connectedLabel: 'Bạn đã kết nối 0 trang', accent: '#6B3EF3' },
      { id: 'traveloka', name: 'Traveloka', connectedLabel: 'Bạn đã kết nối 0 trang', accent: '#00A5FF' },
      { id: 'expedia', name: 'Expedia', connectedLabel: 'Bạn đã kết nối 0 trang', accent: '#FDB813', textColor: '#7A4A00' },
    ],
  },
  {
    id: 'direct',
    title: 'Liên hệ trực tiếp',
    items: [
      { id: 'email', name: 'Email', connectedLabel: 'Bạn đã kết nối 0 trang', accent: '#D44638' },
      { id: 'sms', name: 'SMS', connectedLabel: 'Bạn đã kết nối 0 trang', accent: '#22C55E' },
      { id: 'google-business', name: 'Google Business', connectedLabel: 'Bạn đã kết nối 0 trang', accent: '#4285F4' },
      { id: 'discord', name: 'Discord', connectedLabel: 'Bạn đã kết nối 0 trang', accent: '#5865F2' },
    ],
  },
]
