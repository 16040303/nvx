'use client'

interface TimestampChipProps {
  value: string
}

export function TimestampChip({ value }: TimestampChipProps) {
  return (
    <span className="inline-flex min-h-[42px] min-w-[146px] items-center justify-center rounded-[14px] bg-[#e0f9f294] px-3 text-sm text-[#181819]">
      {value}
    </span>
  )
}
