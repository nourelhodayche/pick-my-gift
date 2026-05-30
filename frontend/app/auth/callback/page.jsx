'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { setAuth } from '@/lib/auth'

export default function AuthCallback() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const token = params.get('token')
    const user = params.get('user')

    if (token && user) {
      setAuth(token, JSON.parse(decodeURIComponent(user)))

      const redirectTo = localStorage.getItem('redirectAfterLogin') || '/dashboard'
      localStorage.removeItem('redirectAfterLogin')
      router.push(redirectTo)
    } else {
      router.push('/login')
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin h-6 w-6 text-[#2563FF]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="text-sm text-[#98A2B3]">Signing you in...</p>
      </div>
    </div>
  )
}