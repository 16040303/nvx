'use client'

import { useEffect, useRef, useState } from 'react'
import { Calendar, ChevronDown, Plus, Search } from 'lucide-react'

interface ListToolbarOption {
  value: string
  label: string
}

interface ListToolbarProps {
  searchInputId: string
  searchLabel: string
  searchPlaceholder: string
  searchValue: string
  onSearchChange: (value: string) => void
  filterSelectId: string
  filterLabel: string
  filterValue: string
  onFilterChange: (value: string) => void
  filterOptions: ListToolbarOption[]
  calendarButtonId?: string
  calendarAriaLabel?: string
  onCalendarButtonClick?: () => void
  resetButtonId?: string
  resetButtonLabel?: string
  onResetButtonClick?: () => void
  showResetButton?: boolean
  addButtonId: string
  addButtonAriaLabel: string
  onAddButtonClick: () => void
}

export function ListToolbar({
  searchInputId,
  searchLabel,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filterSelectId,
  filterLabel,
  filterValue,
  onFilterChange,
  filterOptions,
  calendarButtonId,
  calendarAriaLabel,
  onCalendarButtonClick,
  resetButtonId,
  resetButtonLabel,
  onResetButtonClick,
  showResetButton,
  addButtonId,
  addButtonAriaLabel,
  onAddButtonClick,
}: ListToolbarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterMenuRef = useRef<HTMLDivElement | null>(null)
  const selectedFilterLabel =
    filterOptions.find((option) => option.value === filterValue)?.label ?? filterOptions[0]?.label ?? ''

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      <div className="relative w-full max-w-[454px] flex-1">
        <label htmlFor={searchInputId} className="sr-only">
          {searchLabel}
        </label>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
        <input
          id={searchInputId}
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="h-10 w-full rounded-[14px] border border-[#e6e7e9] bg-white pl-10 pr-4 text-sm text-[#181819] outline-none transition-colors placeholder:text-[#6b7280] focus:border-[#3f8cff]"
        />
      </div>

      <div ref={filterMenuRef} className="relative w-full max-w-[180px]">
        <label id={`${filterSelectId}-label`} className="sr-only">
          {filterLabel}
        </label>
        <button
          id={filterSelectId}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isFilterOpen}
          aria-labelledby={`${filterSelectId}-label`}
          onClick={() => setIsFilterOpen((current) => !current)}
          className="flex h-10 w-full items-center justify-between rounded-[14px] border border-[#dedede] bg-white px-4 pr-10 text-left text-sm text-[#181819] outline-none transition-colors focus:border-[#3f8cff]"
        >
          <span className="block truncate">{selectedFilterLabel}</span>
        </button>
        <ChevronDown
          className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280] transition-transform duration-200 ${
            isFilterOpen ? 'rotate-180' : ''
          }`}
        />

        {isFilterOpen && (
          <div
            role="listbox"
            className="absolute left-0 top-[calc(100%+8px)] z-30 w-full overflow-hidden rounded-[14px] border border-[#d7def0] bg-white py-1.5 shadow-[0_16px_36px_rgba(15,23,42,0.14)] animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150"
          >
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === filterValue}
                onClick={() => {
                  onFilterChange(option.value)
                  setIsFilterOpen(false)
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#f3f7ff] ${
                  option.value === filterValue ? 'font-semibold text-[#3f8cff]' : 'text-[#181819]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {calendarButtonId && (
        <div className="flex items-center gap-2">
          <button
            id={calendarButtonId}
            type="button"
            onClick={onCalendarButtonClick}
            aria-label={calendarAriaLabel ?? 'Calendar'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#9aa0a6] transition-colors hover:text-[#6b7280]"
          >
            <Calendar className="h-7 w-7" />
          </button>

          {showResetButton ? (
            <button
              id={resetButtonId}
              type="button"
              onClick={onResetButtonClick}
              className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#dbe6f5] bg-[#f8fbff] px-3 text-sm font-medium text-[#5b6b82] transition-colors hover:border-[#bfd4f7] hover:bg-[#eef5ff] hover:text-[#34558b]"
            >
              {resetButtonLabel ?? 'Đặt lại'}
            </button>
          ) : null}
        </div>
      )}

      <button
        id={addButtonId}
        type="button"
        onClick={onAddButtonClick}
        className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#3f8cff] text-white transition-transform hover:scale-105"
        aria-label={addButtonAriaLabel}
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  )
}
