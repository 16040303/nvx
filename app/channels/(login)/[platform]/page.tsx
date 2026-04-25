'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, Settings2, X } from 'lucide-react'
import { PlatformId } from '@/lib/channels-context'

const PLATFORM_INFO: Record<PlatformId, { name: string; color: string; hint: string }> = {
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    hint: 'Kết nối Facebook cần cấu hình Meta App credentials hợp lệ.',
  },
  'zalo-oa': {
    name: 'Zalo OA',
    color: '#0068FF',
    hint: 'Kết nối Zalo OA cần cấu hình app OA và callback URL hợp lệ.',
  },
  instagram: {
    name: 'Instagram',
    color: '#E4405F',
    hint: 'Instagram thường dùng Meta authorize flow và quyền business phù hợp.',
  },
  whatsapp: {
    name: 'WhatsApp',
    color: '#25D366',
    hint: 'Kết nối WhatsApp cần cấu hình Business Platform riêng.',
  },
  wechat: {
    name: 'Wechat',
    color: '#51C332',
    hint: 'Kết nối Wechat cần cấu hình provider credential tương ứng.',
  },
  telegram: {
    name: 'Telegram',
    color: '#229ED9',
    hint: 'Telegram cần bot token hoặc flow business phù hợp.',
  },
  line: {
    name: 'Line',
    color: '#00C300',
    hint: 'Kết nối Line cần cấu hình Line Login hoặc Messaging API.',
  },
  viber: {
    name: 'Viber',
    color: '#7360F2',
    hint: 'Kênh này hiện chưa có flow popup authorize tiêu chuẩn trong dự án.',
  },
  tiktok: {
    name: 'TikTok',
    color: '#111111',
    hint: 'TikTok cần client key/client secret và callback hợp lệ.',
  },
  lazada: {
    name: 'Lazada',
    color: '#0F146D',
    hint: 'Lazada dùng partner authorize flow và app key/app secret.',
  },
  shopee: {
    name: 'Shopee',
    color: '#EE4D2D',
    hint: 'Shopee dùng partner auth flow với partner id và partner key.',
  },
  booking: {
    name: 'Booking.com',
    color: '#003580',
    hint: 'Kênh này chưa nằm trong scope kết nối thật hiện tại.',
  },
  agoda: {
    name: 'Agoda',
    color: '#6B3EF3',
    hint: 'Kênh này chưa nằm trong scope kết nối thật hiện tại.',
  },
  traveloka: {
    name: 'Traveloka',
    color: '#00A5FF',
    hint: 'Kênh này chưa nằm trong scope kết nối thật hiện tại.',
  },
  expedia: {
    name: 'Expedia',
    color: '#FDB813',
    hint: 'Kênh này chưa nằm trong scope kết nối thật hiện tại.',
  },
  email: {
    name: 'Email',
    color: '#D44638',
    hint: 'Email thường dùng SMTP/IMAP credentials thay vì popup OAuth chuẩn.',
  },
  sms: {
    name: 'SMS',
    color: '#22C55E',
    hint: 'SMS thường dùng provider credential như Twilio thay vì popup login public.',
  },
  'google-business': {
    name: 'Google Business',
    color: '#4285F4',
    hint: 'Kênh này chưa nằm trong scope 6 provider hiện tại.',
  },
  discord: {
    name: 'Discord',
    color: '#5865F2',
    hint: 'Kênh này chưa nằm trong scope 6 provider hiện tại.',
  },
}

export default function PlatformLoginPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const platformId = params.platform as PlatformId
  const platform = PLATFORM_INFO[platformId]
  const mode = searchParams.get('mode')

  const title = useMemo(() => {
    if (mode === 'configuration-required') {
      return 'Thiếu cấu hình kết nối'
    }

    if (mode === 'configuration-invalid') {
      return 'Cấu hình chưa hợp lệ'
    }

    return 'Kết nối kênh'
  }, [mode])

  const description = useMemo(() => {
    if (!platform) {
      return 'Không tìm thấy nền tảng cần kết nối.'
    }

    if (mode === 'configuration-required') {
      return `${platform.name} chưa có đủ credential để mở authorize URL thật.`
    }

    if (mode === 'configuration-invalid') {
      return `${platform.name} đã có cấu hình nhưng chưa thể tạo authorize URL hợp lệ.`
    }

    return platform.hint
  }, [mode, platform])

  const handleClose = () => {
    try {
      window.close()
    } catch {
      router.push('/channels/connect')
    }
  }

  if (!platform) {
    router.replace('/channels/connect')
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_40%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] p-4">
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl">
        <div className="h-2 w-full" style={{ backgroundColor: platform.color }} />

        <div className="p-7">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-lg"
                style={{ backgroundColor: platform.color }}
              >
                {platform.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{platform.name}</p>
                <h1 className="text-xl font-bold text-slate-950">{title}</h1>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
              {mode?.includes('configuration') ? (
                <Settings2 className="h-6 w-6" />
              ) : (
                <AlertCircle className="h-6 w-6" />
              )}
            </div>
            <h2 className="text-base font-semibold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            <p className="mt-4 text-sm leading-6 text-slate-500">{platform.hint}</p>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              href="/channels/connect"
              className="inline-flex w-full items-center justify-center rounded-[18px] bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Quay về trang kết nối
            </Link>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex w-full items-center justify-center rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
