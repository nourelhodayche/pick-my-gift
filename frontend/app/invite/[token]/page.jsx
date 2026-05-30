'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import { getUser, isAuthenticated } from '@/lib/auth'

export default function InviteTokenPage() {
  const { token } = useParams()
  const router = useRouter()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')

  const currentUser = getUser()
  const isAuth = isAuthenticated()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/invitations/${token}`)
        setEvent(res.data)
      } catch {
        setError('This invitation link is invalid or has expired.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  const handleJoin = async () => {
    if (!isAuth) {
      localStorage.setItem('redirectAfterLogin', `/invite/${token}`)
      localStorage.setItem('pendingInvitationToken', token)
      router.push(`/login?redirect=/invite/${token}`)
      return
    }

    setJoining(true)
    try {
      await api.post(`/api/invitations/${token}/join`)
      router.push(`/events/${event.event.id}`)
    } catch (e) {
      if (e.response?.status === 400) {
        router.push(`/events/${event.event.id}`)
      }
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
        <svg className="animate-spin h-6 w-6 text-[#2563FF]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-sm">
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button onClick={() => router.push('/dashboard')} className="text-[#2563FF] font-medium text-sm">
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const eventData = event?.event

  return (
<div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-10">
      {/* Main Card */}
      <div className="bg-white rounded-3xl overflow-hidden w-full max-w-3xl shadow-2xl mb-6">
        <div className="flex flex-col md:flex-row">

          {/* Left — Image */}
          <div className="md:w-[45%] relative min-h-[300px] md:min-h-[420px] bg-gray-100 flex-shrink-0">
            {eventData?.coverImage ? (
              <img
                src={eventData.coverImage}
                alt={eventData.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            )}

            {/* Special Invitation badge */}
            <div className="absolute bottom-4 left-4">
              <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#2563FF] text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                </svg>
                Special Invitation
              </span>
            </div>
          </div>

          {/* Right — Content */}
          <div className="flex-1 p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-[26px] font-bold text-[#111827] leading-tight mb-4">
                {eventData?.title}
              </h1>

              {/* Date & Time */}
              <div className="space-y-2 mb-5">
                {eventData?.date && (
                  <div className="flex items-center gap-2.5 text-sm text-[#344054]">
                    <div className="w-8 h-8 bg-[#EEF3FF] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#2563FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    {new Date(eventData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                )}
                {eventData?.eventType && (
                  <div className="flex items-center gap-2.5 text-sm text-[#344054]">
                    <div className="w-8 h-8 bg-[#EEF3FF] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#2563FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                      </svg>
                    </div>
                    {eventData.eventType}
                  </div>
                )}
              </div>

              {/* Description */}
              {eventData?.description && (
                <p className="text-[#667085] text-sm leading-relaxed mb-5">
                  {eventData.description}
                </p>
              )}

              {/* Location */}
              {eventData?.location && (
                <div className="bg-[#F8F9FC] rounded-xl p-4 flex items-start gap-3 mb-6">
                  <div className="w-8 h-8 bg-[#EEF3FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#2563FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#98A2B3] font-medium mb-0.5">Location</p>
                    <p className="text-sm font-semibold text-[#111827]">{eventData.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleJoin}
                disabled={joining}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2563FF] hover:bg-[#1D4ED8] text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-[0_8px_20px_rgba(37,99,255,0.25)] disabled:opacity-60 text-sm"
              >
                {joining ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                )}
                {joining ? 'Joining...' : isAuth ? 'Join Event & View Gifts' : 'Sign in to Join'}
              </button>

              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3.5 border border-gray-200 text-[#344054] font-semibold rounded-2xl hover:bg-gray-50 transition-all text-sm"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Feature Cards */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-3xl">
        {[
          {
            color: 'text-amber-500',
            bg: 'bg-amber-50',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v13m0-13V6a4 4 0 00-4-4H6a4 4 0 00-4 4v2h4m8 0V6a4 4 0 014-4h2a4 4 0 014 4v2h-4M3 10h18"/>
              </svg>
            ),
            title: 'Curated Wishlist',
            desc: `${eventData?.owner?.name?.split(' ')[0] || 'The host'} has hand-picked items. Explore the list to find the perfect gift.`
          },
          {
            color: 'text-pink-500',
            bg: 'bg-pink-50',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            ),
            title: 'Guest List',
            desc: 'See who else is coming and coordinate group gifts with other members.'
          },
          {
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            ),
            title: 'Easy Reservation',
            desc: 'One-tap reservation system ensures no duplicate gifts. Simple and stress-free.'
          }
        ].map((card) => (
          <div key={card.title} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
              {card.icon}
            </div>
            <p className="text-sm font-bold text-[#111827] mb-1.5">{card.title}</p>
            <p className="text-xs text-[#98A2B3] leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}