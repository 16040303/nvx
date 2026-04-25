'use client'

import { useEffect } from 'react'

interface ConfirmActionModalProps {
  isOpen: boolean
  type: 'delete' | 'archive' | 'remove-post'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmActionModal({ isOpen, type, onConfirm, onCancel }: ConfirmActionModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const content = {
    delete: {
      title: 'Bạn có chắc chắn xóa?',
      subtitle: 'Dữ liệu sẽ không khôi phục lại!',
    },
    archive: {
      title: 'Bạn có chắc chắn lưu trữ?',
      subtitle: 'Bài viết sẽ vào mục trạng thái "Đề xuất"',
    },
    'remove-post': {
      title: 'Bạn có chắc chắn gỡ bài?',
      subtitle: 'Dữ liệu sẽ không khôi phục lại!',
    },
  }

  const config = content[type]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onCancel}
    >
      <div
        className="w-80 rounded-[20px] border-2 border-[#2f6fed] bg-white px-8 py-8 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-center text-lg font-bold text-[#2f6fed] mb-2">
          {config.title}
        </h2>

        {/* Subtitle */}
        <p className="text-center text-sm text-[#5b7ec4] mb-8">
          {config.subtitle}
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full bg-[#e5e7eb] px-6 py-3 text-sm font-semibold text-[#1f2937] transition-colors hover:bg-[#d1d5db] shadow-sm"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-full bg-[#e5e7eb] px-6 py-3 text-sm font-semibold text-[#1f2937] transition-colors hover:bg-[#d1d5db] shadow-sm"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  )
}
