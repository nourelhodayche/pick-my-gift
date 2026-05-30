'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/layout/Sidebar'
import api from '@/lib/api'
import { getUser, isAuthenticated } from '@/lib/auth'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const router = useRouter()
  const user = getUser()
  const [events, setEvents] = useState({ created: [], attending: [] })
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    const loadData = async () => {
      try {
        const [eventsRes, resRes] = await Promise.all([
          api.get('/api/events/mine'),
          api.get('/api/reservations/mine'),
        ])
        setEvents(eventsRes.data)
        setReservations(resRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="bg-white border-b border-[#EEF1F6] px-10 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-[28px] leading-tight font-bold tracking-tight text-[#111827]">
              {getGreeting()}, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-[14px] text-[#98A2B3] mt-1 font-medium">
              Here's an overview of your activity.
            </p>
          </div>
          <Link
            href="/events/new"
            className="flex items-center gap-2 bg-[#2563FF] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-5 py-3 rounded-2xl transition-all shadow-[0_8px_20px_rgba(37,99,255,0.18)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            New Event
          </Link>
        </div>

        <main className="flex-1 p-10 space-y-8">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-5">
            {[
              {
                label: 'TOTAL ORGANIZED EVENTS',
                value: events.created.length,
                sub: 'events created by you',
                href: '/events/mine',
                icon: (
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                ),
                bg: 'bg-blue-50',
              },
              {
                label: 'GIFTS RESERVED',
                value: reservations.length,
                sub: 'gifts reserved by you',
                href: '/reservations',
                icon: (
                  <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a4 4 0 00-4-4H6a4 4 0 00-4 4v2h4m8 0V6a4 4 0 014-4h2a4 4 0 014 4v2h-4M3 10h18"/>
                  </svg>
                ),
                bg: 'bg-pink-50',
              },
              {
                label: 'TOTAL EVENTS',
                value: events.created.length + events.attending.length,
                sub: 'created & attending',
                href: '/events/mine',
                icon: (
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                ),
                bg: 'bg-orange-50',
              },
            ].map((stat) => (
              <Link key={stat.label} href={stat.href}>
                <div className="bg-white rounded-[28px] border border-[#EEF1F6] p-6 flex items-start justify-between shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:shadow-[0_4px_12px_rgba(16,24,40,0.06)] transition-all duration-200 cursor-pointer">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#98A2B3] font-semibold mb-3">{stat.label}</p>
                    <p className="text-[42px] leading-none font-semibold tracking-tight text-[#111827] mb-2">{loading ? '—' : stat.value}</p>
                    <p className="text-sm text-[#98A2B3]">{stat.sub}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    {stat.icon}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-[28px] border border-[#EEF1F6] p-6">
            <h2 className="text-[15px] font-bold text-[#111827] mb-5">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: 'Create New Event',
                  desc: 'Start a new gift registry',
                  href: '/events/new',
                  color: 'bg-blue-50 text-[#2563FF]',
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                },
                {
                  label: 'My Events',
                  desc: 'View all your events',
                  href: '/events/mine',
                  color: 'bg-orange-50 text-orange-500',
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                },
                {
                  label: 'My Reservations',
                  desc: 'Gifts you have reserved',
                  href: '/reservations',
                  color: 'bg-pink-50 text-pink-500',
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                },
              ].map(action => (
                <Link key={action.label} href={action.href}>
                  <div className="flex items-center gap-4 p-4 border border-[#EEF1F6] rounded-2xl hover:border-[#2563FF]/20 hover:shadow-[0_2px_8px_rgba(37,99,255,0.06)] transition-all cursor-pointer group">
                    <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      {action.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#111827] group-hover:text-[#2563FF] transition-colors">{action.label}</p>
                      <p className="text-xs text-[#98A2B3]">{action.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-white rounded-[28px] border border-[#EEF1F6] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-bold text-[#111827]">Recent Events</h2>
              <Link href="/events/mine" className="text-sm text-[#2563FF] font-semibold hover:underline">
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}
              </div>
            ) : events.created.length + events.attending.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-[#98A2B3] text-sm">No events yet.</p>
                <Link href="/events/new" className="text-[#2563FF] text-sm font-semibold hover:underline mt-2 inline-block">
                  Create your first event →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {[...events.created.slice(0, 2), ...events.attending.slice(0, 1)].map(event => (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <div className="flex items-center gap-4 p-4 border border-[#EEF1F6] rounded-2xl hover:border-[#2563FF]/20 transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-[#F8F9FC] overflow-hidden flex-shrink-0">
                        {event.coverImage ? (
                          <img src={event.coverImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#D0D5DD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#111827] truncate group-hover:text-[#2563FF] transition-colors">{event.title}</p>
                        <p className="text-xs text-[#98A2B3]">
                          {event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date set'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#98A2B3]">
                        <span>{event.gifts?.length || 0} gifts</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}