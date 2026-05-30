'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/layout/Sidebar'
import api from '@/lib/api'
import { isAuthenticated } from '@/lib/auth'

const colors = [
  'bg-blue-100 text-blue-600',
  'bg-pink-100 text-pink-600',
  'bg-orange-100 text-orange-600',
  'bg-green-100 text-green-600',
  'bg-purple-100 text-purple-600',
]

function GuestAvatars({ attendees, count }) {
  if (!attendees || attendees.length === 0) {
    return <span className="text-xs text-[#98A2B3]">No guests yet</span>
  }
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {attendees.slice(0, 3).map((attendee, i) => (
          <div
            key={attendee.user.id}
            className={`relative w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold cursor-default group/avatar ${colors[i % colors.length]}`}
          >
            {attendee.user.name?.charAt(0).toUpperCase()}

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#111827] text-white text-[11px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none z-10">
              {attendee.user.name}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#111827]" />
            </div>
          </div>
        ))}
      </div>

      {count > 3 && (
        <span className="text-xs text-[#98A2B3] font-medium">+{count - 3} more</span>
      )}

      {count > 0 && (
        <span className="text-xs text-[#98A2B3]">{count} guest{count > 1 ? 's' : ''}</span>
      )}
    </div>
  )
}

export default function MyEventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState({ created: [], attending: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    const load = async () => {
      try {
        const res = await api.get('/api/events/mine')
        setEvents(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="bg-white border-b border-[#EEF1F6] px-10 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#111827] tracking-tight">My Events</h1>
            <p className="text-[14px] text-[#98A2B3] mt-1">All your events in one place.</p>
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

        <main className="flex-1 p-10 space-y-10">

          {/* Events Created By Me */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-[#2563FF] rounded-full" />
                <h2 className="text-[17px] font-bold text-[#111827]">Events Created By Me</h2>
              </div>
              {events.created.length > 0 && (
                <span className="text-xs font-semibold text-[#2563FF] bg-blue-50 px-3 py-1 rounded-full">
                  {events.created.length} Active
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-3 gap-5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-gray-100 rounded-[24px] animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                {events.created.map(event => (
                  <div
                    key={event.id}
                    className="bg-white border border-[#EEF1F6] rounded-[24px] overflow-hidden hover:shadow-[0_4px_20px_rgba(37,99,255,0.08)] hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    {/* Cover Image */}
                    <div className="h-44 bg-[#F8F9FC] relative overflow-hidden">
                      {event.coverImage ? (
                        <img src={event.coverImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-[#D0D5DD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className="bg-[#2563FF] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                          Organizer
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-[#111827] text-[15px] leading-snug mb-2 group-hover:text-[#2563FF] transition-colors">
                        {event.title}
                      </h3>

                      {event.date && (
                        <div className="flex items-center gap-2 text-xs text-[#98A2B3] mb-2">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                      )}

                      {event.location && (
                        <div className="flex items-center gap-2 text-xs text-[#98A2B3] mb-3">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                          </svg>
                          {event.location}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#F2F4F7]">
                        <div className="flex items-center gap-2">
                          <GuestAvatars
                            attendees={event.attendees}
                            count={event._count?.attendees || 0}
                          />
                          <span className="text-xs text-[#98A2B3]">
                            · {event.gifts?.length || 0} gifts
                          </span>
                        </div>
                        <Link
                          href={`/events/${event.id}`}
                          className="text-xs font-semibold text-[#2563FF] hover:underline flex items-center gap-1"
                        >
                          Manage
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Plan a New Celebration */}
                <Link href="/events/new">
                  <div className="bg-[#EEF3FF] border-2 border-dashed border-[#BFDBFE] rounded-[24px] min-h-[280px] flex flex-col items-center justify-center p-6 hover:bg-[#E0EBFF] transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-full border-2 border-[#2563FF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-[#2563FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                      </svg>
                    </div>
                    <p className="text-[#2563FF] font-bold text-[15px] text-center mb-2">Plan a New Celebration</p>
                    <p className="text-[#667085] text-xs text-center leading-relaxed">
                      From weddings to casual dinners, start your registry here.
                    </p>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Events I'm Participating In */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-pink-500 rounded-full" />
                <h2 className="text-[17px] font-bold text-[#111827]">Events I&apos;m Participating In</h2>
              </div>
              {events.attending.length > 0 && (
                <span className="text-xs font-semibold text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
                  {events.attending.length} Upcoming
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-5">
                {[1, 2].map(i => (
                  <div key={i} className="h-40 bg-gray-100 rounded-[24px] animate-pulse" />
                ))}
              </div>
            ) : events.attending.length === 0 ? (
              <div className="bg-white border border-[#EEF1F6] rounded-[24px] p-10 text-center">
                <p className="text-[#98A2B3] text-sm">You haven&apos;t joined any events yet.</p>
                <p className="text-[#98A2B3] text-xs mt-1">Ask a friend to share their invitation link!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5">
                {events.attending.map(event => (
                  <div
                    key={event.id}
                    className="bg-white border border-[#EEF1F6] rounded-[24px] overflow-hidden hover:shadow-[0_4px_20px_rgba(37,99,255,0.08)] hover:-translate-y-0.5 transition-all duration-200 flex"
                  >
                    {/* Image */}
                    <div className="w-36 flex-shrink-0 bg-[#F8F9FC] relative overflow-hidden">
                      {event.coverImage ? (
                        <img src={event.coverImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-[#D0D5DD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-[#111827] text-[14px] leading-snug">{event.title}</h3>
                          <span className="bg-orange-50 text-orange-500 text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                            GUEST
                          </span>
                        </div>

                        {event.date && (
                          <div className="flex items-center gap-1.5 text-xs text-[#98A2B3] mb-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        )}

                        {event.location && (
                          <div className="flex items-center gap-1.5 text-xs text-[#98A2B3]">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            {event.location}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F2F4F7]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                            </svg>
                          </div>
                          <span className="text-xs text-green-600 font-semibold">RSVP Confirmed</span>
                        </div>
                        <Link
                          href={`/events/${event.id}`}
                          className="text-xs font-semibold text-[#2563FF] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          View Gift List
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}