'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface DatePickerModalProps {
  open: boolean
  onClose: () => void
  selectedDate: Date | null
  onConfirm: (date: Date) => void
}

const DAY_LABELS = ['CN', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7']

function buildCalendarCells(year: number, month: number) {
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: { date: Date; isCurrentMonth: boolean }[] = []

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), isCurrentMonth: false })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), isCurrentMonth: true })
  }

  let nextDay = 1
  while (cells.length % 7 !== 0) {
    cells.push({ date: new Date(year, month + 1, nextDay++), isCurrentMonth: false })
  }

  return cells
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  )
}

export function DatePickerModal({ open, onClose, selectedDate, onConfirm }: DatePickerModalProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [pickedDate, setPickedDate] = useState<Date | null>(selectedDate)

  useEffect(() => {
    if (open) {
      setPickedDate(selectedDate)
      if (selectedDate) {
        setViewYear(selectedDate.getFullYear())
        setViewMonth(selectedDate.getMonth())
      }
    }
  }, [open, selectedDate])

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const cells = buildCalendarCells(viewYear, viewMonth)

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent
        showCloseButton={false}
        className="w-[min(92vw,420px)] gap-0 rounded-[20px] border-0 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.15)]"
      >
        <DialogTitle className="text-xl font-semibold text-[#111827]">Chọn thời gian</DialogTitle>

        {/* Month navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#3f8cff] transition-colors hover:bg-[#eff6ff]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-base font-bold text-[#111827]">
            Tháng {viewMonth + 1}, {viewYear}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#3f8cff] transition-colors hover:bg-[#eff6ff]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Day-of-week labels */}
        <div className="mt-4 grid grid-cols-7 text-center">
          {DAY_LABELS.map((label) => (
            <div key={label} className="py-2 text-sm font-medium text-[#9ca3af]">
              {label}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 text-center">
          {cells.map((cell, idx) => {
            const isToday = isSameDay(cell.date, today)
            const isPicked = pickedDate !== null && isSameDay(cell.date, pickedDate)
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setPickedDate(cell.date)}
                className={[
                  'mx-auto my-0.5 flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors',
                  !cell.isCurrentMonth ? 'text-[#d1d5db]' : 'text-[#111827] hover:bg-[#eff6ff]',
                  isPicked ? 'bg-[#3f8cff] !text-white hover:bg-[#3f8cff]' : '',
                  isToday && !isPicked ? 'font-bold text-[#3f8cff]' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {String(cell.date.getDate()).padStart(2, '0')}
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (pickedDate) {
                onConfirm(pickedDate)
                onClose()
              }
            }}
            disabled={!pickedDate}
            className="h-10 min-w-[110px] rounded-[14px] bg-[#3f8cff] px-6 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(63,140,255,0.35)] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Xác nhận
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
