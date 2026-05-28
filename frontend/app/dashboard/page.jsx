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

  const [events, setEvents] = useState({
    created: [],
    attending: [],
  })

  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('created')

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

  const displayedEvents =
    activeTab === 'created'
      ? events.created
      : events.attending

  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="bg-white border-b border-[#EEF1F6] px-10 py-6 flex items-center justify-between">

          <div>
            <h1 className="text-[34px] leading-tight font-semibold tracking-[-0.02em] text-[#111827]">
              {getGreeting()}, {user?.name?.split(' ')[0]}!
            </h1>

            <p className="text-[15px] text-[#98A2B3] mt-1 font-medium">
              You have{' '}
              {events.created.length + events.attending.length} events.
              Ready to coordinate?
            </p>
          </div>

          <Link
            href="/events/new"
            className="flex items-center gap-2 bg-[#2563FF] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-5 py-3 rounded-2xl transition-all shadow-[0_8px_20px_rgba(37,99,255,0.18)]"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
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
                sub: `${events.attending.length} attending`,
                icon: (
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                ),
                bg: 'bg-blue-50',
              },

              {
                label: 'GIFTS RESERVED',
                value: reservations.length,
                sub: 'by you',
                icon: (
                  <svg
                    className="w-6 h-6 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v13m0-13V6a4 4 0 00-4-4H6a4 4 0 00-4 4v2h4m8 0V6a4 4 0 014-4h2a4 4 0 014 4v2h-4M3 10h18"
                    />
                  </svg>
                ),
                bg: 'bg-pink-50',
              },

              {
                label: 'TOTAL EVENTS',
                value:
                  events.created.length +
                  events.attending.length,
                sub: 'created & attending',
                icon: (
                  <svg
                    className="w-6 h-6 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ),
                bg: 'bg-orange-50',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-[28px] border border-[#EEF1F6] p-6 flex items-start justify-between shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:shadow-[0_4px_12px_rgba(16,24,40,0.06)] transition-all duration-200"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#98A2B3] font-semibold mb-3">
                    {stat.label}
                  </p>

                  <p className="text-[42px] leading-none font-semibold tracking-tight text-[#111827] mb-2">
                    {loading ? '—' : stat.value}
                  </p>

                  <p className="text-sm text-[#98A2B3]">
                    {stat.sub}
                  </p>
                </div>

                <div
                  className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}
                >
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Events */}
          <div className="bg-white rounded-[30px] border border-[#EEF1F6] shadow-[0_1px_2px_rgba(16,24,40,0.04)] overflow-hidden">

            {/* Tabs */}
            <div className="flex items-center border-b border-[#EEF1F6] px-6">

              <div className="flex gap-2">

                {[
                  {
                    key: 'created',
                    label: 'Created by me',
                    count: events.created.length,
                  },

                  {
                    key: 'attending',
                    label: 'Attending',
                    count: events.attending.length,
                  },
                ].map((tab) => (

                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-5 text-sm font-semibold border-b-2 transition-all -mb-px ${
                      activeTab === tab.key
                        ? 'border-[#2563FF] text-[#2563FF]'
                        : 'border-transparent text-[#98A2B3] hover:text-gray-700'
                    }`}
                  >
                    {tab.label}

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        activeTab === tab.key
                          ? 'bg-blue-50 text-[#2563FF]'
                          : 'bg-gray-100 text-[#98A2B3]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">

              {loading ? (

                <div className="grid grid-cols-2 gap-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-44 bg-gray-100 rounded-[24px] animate-pulse"
                    />
                  ))}
                </div>

              ) : displayedEvents.length === 0 ? (

                <div className="text-center py-20">

                  <div className="w-16 h-16 bg-gray-100 rounded-[24px] flex items-center justify-center mx-auto mb-5">
                    <svg
                      className="w-8 h-8 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  <p className="text-[#98A2B3] text-sm mb-3">
                    {activeTab === 'created'
                      ? 'No events created yet.'
                      : 'No events joined yet.'}
                  </p>

                  {activeTab === 'created' && (
                    <Link
                      href="/events/new"
                      className="text-[#2563FF] text-sm font-semibold hover:underline"
                    >
                      Create your first event →
                    </Link>
                  )}
                </div>

              ) : (

                <div className="grid grid-cols-2 gap-5">

                  {displayedEvents.map((event) => (

                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                    >
                      <div className="group border border-[#EEF1F6] rounded-[26px] p-6 hover:border-blue-200 hover:shadow-[0_4px_12px_rgba(16,24,40,0.06)] transition-all duration-200 cursor-pointer bg-white">

                        <div className="flex items-start justify-between mb-4">

                          <h3 className="font-semibold text-[#111827] text-[15px] leading-snug group-hover:text-[#2563FF] transition-colors">
                            {event.title}
                          </h3>

                          <span
                            className={`text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0 ml-3 ${
                              activeTab === 'created'
                                ? 'bg-blue-50 text-[#2563FF]'
                                : 'bg-teal-50 text-teal-600'
                            }`}
                          >
                            {activeTab === 'created'
                              ? 'Owner'
                              : 'Attending'}
                          </span>
                        </div>

                        {event.description && (
                          <p className="text-sm text-[#98A2B3] mb-4 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        <div className="space-y-2 mb-5">

                          {event.date && (
                            <div className="flex items-center gap-2 text-sm text-[#98A2B3]">

                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>

                              {new Date(event.date).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )}
                            </div>
                          )}

                          {event.location && (
                            <div className="flex items-center gap-2 text-sm text-[#98A2B3]">

                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />

                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>

                              {event.location}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-[#F2F4F7]">

                          <div className="flex items-center gap-2 text-sm text-[#98A2B3]">

                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 8v13m0-13V6a4 4 0 00-4-4H6a4 4 0 00-4 4v2h4m8 0V6a4 4 0 014-4h2a4 4 0 014 4v2h-4M3 10h18"
                              />
                            </svg>

                            {event.gifts?.length || 0} gifts
                          </div>

                          <div className="flex items-center gap-2 text-sm text-[#98A2B3]">

                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>

                            {event._count?.attendees || 0} guests
                          </div>

                          <span className="text-sm text-[#2563FF] font-semibold group-hover:underline">
                            View →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}