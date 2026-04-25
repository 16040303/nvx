import type { Metadata } from 'next'
import { ConnectChannelsPage } from '../_components/connect-channels-page'

export const metadata: Metadata = {
  title: 'NuverxAI | Connect Channels',
  description: 'Connect and manage communication platforms for the NuverxAI workspace.',
}

export default function ConnectChannelsRoute() {
  return <ConnectChannelsPage />
}
