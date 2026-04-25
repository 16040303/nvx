'use client'

import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, hideClose, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex w-full flex-col items-center justify-center gap-1 text-center">
              {title && <ToastTitle className="text-center">{title}</ToastTitle>}
              {description && (
                <ToastDescription asChild>
                  <div className="flex w-full justify-center text-center">{description}</div>
                </ToastDescription>
              )}
            </div>
            {action}
            {!hideClose && <ToastClose />}
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
