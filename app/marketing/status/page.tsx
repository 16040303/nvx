import type { Metadata } from 'next'
import { MarketingStatusPage } from '../_components/marketing-status-page'

export const metadata: Metadata = {
  title: 'NuverxAI | Campaign Status',
  description: 'Track campaign status and progress',
}

export default function StatusPage() {
  return <MarketingStatusPage />
}
