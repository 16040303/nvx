'use client'

import Image from 'next/image'

export function NuverxLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/images/logo.jpg"
        alt="NuverxAI Logo"
        width={40}
        height={40}
        className="rounded-[8px] object-cover"
        priority
      />
      <span className="text-xl font-bold text-gray-900">NuverxAI</span>
    </div>
  )
}
