'use client'

import { ReactNode, useLayoutEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface MarketingContentTransitionProps {
  children: ReactNode
}

export function MarketingContentTransition({ children }: MarketingContentTransitionProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)

  useLayoutEffect(() => {
    setIsVisible(false)

    const frame = requestAnimationFrame(() => {
      setIsVisible(true)
    })

    return () => cancelAnimationFrame(frame)
  }, [pathname])

  return (
    <div
      className={`w-full will-change-transform transition-[opacity,transform] duration-200 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
      }`}
    >
      {children}
    </div>
  )
}
