'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { clearAuth, getUser } from '@/lib/auth'

const userNavItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
      </svg>
    )
  },
  {
    label: 'My Events',
    href: '/dashboard',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    )
  },
  {
    label: 'Create Event',
    href: '/events/new',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4"/>
      </svg>
    )
  },
  {
    label: 'Gift List',
    href: '/dashboard',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v13m0-13V6a4 4 0 00-4-4H6a4 4 0 00-4 4v2h4m8 0V6a4 4 0 014-4h2a4 4 0 014 4v2h-4M3 10h18"/>
      </svg>
    )
  },
  {
    label: 'Invitations',
    href: '/dashboard',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    )
  },
  {
    label: 'My Reservations',
    href: '/reservations',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
      </svg>
    )
  }
]

const adminNavItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
      </svg>
    )
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    )
  },
  {
    label: 'Events',
    href: '/admin/events',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    )
  },
  {
    label: 'Reservations',
    href: '/admin/reservations',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
      </svg>
    )
  }
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    setMounted(true)
    setUser(getUser())
  }, [])

  if (!mounted) return null

  const navItems = user?.role === 'admin'
    ? adminNavItems
    : userNavItems

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  return (
    <aside className="w-[220px] min-h-screen bg-white border-r border-[#EEF1F6] flex flex-col flex-shrink-0">

{/* Logo */}
<div className="px-5 pt-6 pb-5 border-b border-[#EEF1F6]">
  <Link
    href="/dashboard"
    className="flex items-center gap-3 group"
  >
    <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2563FF] to-[#4F8CFF] flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,255,0.25)] transition-all duration-200 group-hover:scale-[1.03]">
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v13m0-13V6a4 4 0 00-4-4H6a4 4 0 00-4 4v2h4m8 0V6a4 4 0 014-4h2a4 4 0 014 4v2h-4M3 10h18"
        />
      </svg>

      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white border-2 border-[#2563FF]" />
    </div>

    <div className="flex flex-col">
      <h1 className="text-[17px] font-bold text-[#111827] tracking-tight leading-none">
        PickMyGift
      </h1>

      <span className="text-[11px] text-[#98A2B3] font-medium mt-1">
        Smart Event Platform
      </span>
    </div>
  </Link>
</div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#EEF3FF] text-[#2563FF] font-semibold'
                  : 'text-[#667085] hover:bg-[#F9FAFB] hover:text-[#111827]'
              }`}
            >
              <span className={isActive ? 'text-[#2563FF]' : 'text-[#98A2B3]'}>
                {item.icon}
              </span>

              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* New Event Button */}
      <div className="px-4 pb-3">
        <Link
          href="/events/new"
          className="flex items-center justify-center gap-2 w-full bg-[#2563FF] hover:bg-[#1D4ED8] text-white text-[13.5px] font-semibold py-3 rounded-2xl transition-all shadow-[0_4px_12px_rgba(37,99,255,0.2)]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4"/>
          </svg>

          New Event
        </Link>
      </div>

            {/* User Info */}
<div className="px-5 py-4 border-b border-[#EEF1F6]">
  <div className="flex items-center gap-3">

    {/* Avatar */}
    <div className="w-10 h-10 rounded-full bg-[#EEF3FF] flex items-center justify-center flex-shrink-0">
      <span className="text-[#2563FF] text-sm font-bold">
        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
      </span>
    </div>

    {/* User Details */}
    <div className="min-w-0 flex-1">
      <p className="text-[13px] font-semibold text-[#111827] truncate">
        {user?.name || 'User'}
      </p>

      <p className="text-[11px] text-[#98A2B3] truncate">
        {user?.email || 'user@email.com'}
      </p>
    </div>
  </div>
</div>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#EEF1F6]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium text-[#667085] hover:bg-red-50 hover:text-red-500 transition-all duration-150 w-full"
        >
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>

          Logout
        </button>
      </div>
    </aside>
  )
}