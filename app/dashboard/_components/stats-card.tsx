'use client'

interface StatsCardProps {
  value: string | number
  label: string
  icon: React.ReactNode
  valueColor?: string
}

export function StatsCard({ value, label, icon, valueColor = 'text-[#000088]' }: StatsCardProps) {
  return (
    <article className="flex h-[88px] items-center justify-between rounded-xl border border-[#3F8CFF]/40 bg-white px-5 py-4">
      <div>
        <p className={`text-[28px] font-semibold leading-none tracking-[0.14px] ${valueColor}`}>{value}</p>
        <p className="mt-2 text-[13px] font-semibold tracking-[0.065px] text-[#7D8592]">{label}</p>
      </div>
      <div className="flex h-[45px] w-[50px] items-center justify-center rounded-full bg-[#F4F9FD] text-[#0148ED]">
        {icon}
      </div>
    </article>
  )
}
