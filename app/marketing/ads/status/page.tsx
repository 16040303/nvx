import type { Metadata } from 'next'
import { MarketingStatusPage } from '../../_components/marketing-status-page'

export const metadata: Metadata = {
  title: 'NuverxAI | Ad Status',
  description: 'Track advertising status and progress',
}

export default function AdvertisingStatusPage() {
  return <MarketingStatusPage mode="ad" />
}
