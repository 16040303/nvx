import type { Metadata } from 'next'
import { MarketingCampaignDetailPage } from './_components/marketing-campaign-detail-page'

interface CampaignDetailPageProps {
  params: Promise<{
    campaignId: string
  }>
}

export async function generateMetadata({
  params,
}: CampaignDetailPageProps): Promise<Metadata> {
  const { campaignId } = await params

  return {
    title: `NuverxAI | Campaign ${campaignId}`,
    description: 'Campaign detail view and management',
  }
}

export default async function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const { campaignId } = await params

  return <MarketingCampaignDetailPage campaignId={campaignId} />
}
