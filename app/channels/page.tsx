import type { Metadata } from 'next'
import { ChannelsTab } from './_components/channels-tab'

export const metadata: Metadata = {
  title: 'NuverxAI | Communication Channels',
  description: 'Communication channels dashboard for monitoring and managing channel connectivity status.',
}

export default function ChannelsPage() {
  return <ChannelsTab />
}
