import type { Metadata } from 'next'
import { MarketingAdDetailPage } from './_components/marketing-ad-detail-page'

interface AdDetailPageProps {
  params: Promise<{
    campaignId: string
  }>
}

export async function generateMetadata({
  params,
}: AdDetailPageProps): Promise<Metadata> {
  const { campaignId } = await params

  return {
    title: `NuverxAI | Ad ${campaignId}`,
    description: 'Advertising detail view and management',
  }
}

export default async function AdDetailPage({ params }: AdDetailPageProps) {
  const { campaignId } = await params

  return <MarketingAdDetailPage campaignId={campaignId} />
}
