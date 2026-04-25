'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  email: string
  setEmail: (email: string) => void
}

// Context lưu email của người dùng đang đăng nhập trong phiên hiện tại.
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider chia sẻ trạng thái đăng nhập cơ bản cho toàn app.
export function AuthProvider({ children }: { children: ReactNode }) {
  // Email hiện tại được cập nhật sau khi người dùng đăng nhập.
  const [email, setEmail] = useState<string>('')

  return (
    <AuthContext.Provider value={{ email, setEmail }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook giúp component đọc hoặc cập nhật email đăng nhập hiện tại.
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
