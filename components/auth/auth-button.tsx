'use client'

interface AuthButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

export function AuthButton({
  children,
  onClick,
  disabled = false,
  type = 'submit',
  className = '',
}: AuthButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
        disabled
          ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
          : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-[0.98]'
      } ${className}`}
    >
      {children}
    </button>
  )
}
