import type { Metadata } from 'next'
import { MarketingCreateCampaignPage } from './_components/marketing-create-campaign-page'

export const metadata: Metadata = {
  title: 'NuverxAI | Create Campaign',
  description: 'Create and schedule a new marketing campaign.',
}

export default function MarketingCreatePage() {
  return <MarketingCreateCampaignPage />
}
