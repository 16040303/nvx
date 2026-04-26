import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/language-context'
import { AuthProvider } from '@/lib/auth-context'
import { ChannelsProvider } from '@/lib/channels-context'
import { ProfileProvider } from '@/lib/profile-context'
import { WorkspaceShell } from '@/components/app-shell/workspace-shell'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'NuverxAI - CX Hub & Marketing',
  description: 'Hợp nhất CSKH và marketing trong một nền tảng thông minh, dẫn dắt bởi AI',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/assets/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/assets/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/assets/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/assets/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        <LanguageProvider>
          <AuthProvider>
            <ChannelsProvider>
              <ProfileProvider>
                <WorkspaceShell>{children}</WorkspaceShell>
              </ProfileProvider>
            </ChannelsProvider>
          </AuthProvider>
        </LanguageProvider>
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
