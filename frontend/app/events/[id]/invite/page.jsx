'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'

const steps = [
  { label: 'Event Details', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>
  )},
  { label: 'Add Gifts', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v13m0-13V6a4 4 0 00-4-4H6a4 4 0 00-4 4v2h4m8 0V6a4 4 0 014-4h2a4 4 0 014 4v2h-4M3 10h18"/>
    </svg>
  )},
  { label: 'Preview List', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    </svg>
  )},
  { label: 'Invitations', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
    </svg>
  )}
]

export default function InvitePage() {
  const { id } = useParams()
  const router = useRouter()
  const [event, setEvent] = useState(null)
  const [token, setToken] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/events/${id}`)
        setEvent(res.data)
        const t = res.data?.invitation?.token
        if (t) setToken(t)
      } catch {
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  const inviteLink = token
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${token}`
    : ''

  const handleCopy = () => {
    if (!inviteLink) return
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`You're invited to ${event?.title}! View the gift list and reserve a gift here: ${inviteLink}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const handleEmail = () => {
    const subject = encodeURIComponent(`You're invited to ${event?.title}!`)
    const body = encodeURIComponent(`Hi!\n\nYou're invited to ${event?.title}.\n\nView the gift list and reserve a gift here:\n${inviteLink}\n\nSee you there!`)
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }

  if (loading) return (
    <div className="flex min-h-screen bg-[#F8F9FC] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin h-6 w-6 text-[#2563FF]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="text-sm text-[#98A2B3]">Loading...</p>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">

      {/* Left Panel — Steps */}
      <div className="w-[220px] min-h-screen bg-white border-r border-[#EEF1F6] flex flex-col flex-shrink-0">

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 pt-6 pb-5 border-b border-[#EEF1F6]">
          <div className="w-9 h-9 bg-[#2563FF] rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_4px_10px_rgba(37,99,255,0.25)]">
            <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 00-4-4H6a4 4 0 00-4 4v2h4m8 0V6a4 4 0 014-4h2a4 4 0 014 4v2h-4M3 10h18"/>
            </svg>
          </div>
          <div>
            <p className="text-[#111827] font-bold text-[15px] leading-tight tracking-tight">PickMyGift</p>
            <p className="text-[#98A2B3] text-[10px] font-semibold tracking-[0.12em] uppercase">Event Management</p>
          </div>
        </div>

        {/* Step info */}
        <div className="px-5 py-5 border-b border-[#EEF1F6]">
          <p className="text-[#2563FF] font-bold text-[15px] leading-tight mb-0.5">Create Event</p>
          <p className="text-[#98A2B3] text-[12px] font-medium">Step 4 of 4</p>
        </div>

        {/* Steps nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {steps.map((step, index) => {
            const isActive = index === 3
            const isDone = index < 3
            return (
              <div
                key={step.label}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all ${
                  isActive ? 'bg-[#EEF3FF] text-[#2563FF] font-semibold'
                  : isDone ? 'text-[#667085]'
                  : 'text-[#C8D0DC]'
                }`}
              >
                <span className={isActive ? 'text-[#2563FF]' : isDone ? 'text-[#667085]' : 'text-[#C8D0DC]'}>
                  {step.icon}
                </span>
                {step.label}
                {isDone && (
                  <svg className="w-3.5 h-3.5 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">

        {/* Header */}
        <div className="text-center mb-10 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
            </svg>
            Event Created Successfully
          </div>
          <h1 className="text-[32px] font-bold text-[#111827] tracking-tight leading-tight mb-3">
            Share Your Invitation Link
          </h1>
          <p className="text-[#98A2B3] text-[15px] leading-relaxed">
            The fastest way to invite friends and family to collaborate on your registry is by sharing your unique event link.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#EEF1F6] shadow-[0_4px_24px_rgba(16,24,40,0.06)] p-8 w-full max-w-lg">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#EEF3FF] rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-[#2563FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
            </div>
          </div>

          <h2 className="text-center text-lg font-bold text-[#111827] mb-1">Your Magic Invite Link</h2>
          <p className="text-center text-sm text-[#98A2B3] mb-6">
            Anyone with this link can join your event, view the registry, and contribute to gift ideas.
          </p>

          {/* Link input */}
          <div className="flex items-center gap-2 border border-[#D0D5DD] rounded-xl px-4 py-3 bg-[#F8F9FC] mb-4">
            <span className="flex-1 text-sm text-[#344054] truncate font-medium">
              {inviteLink || 'Generating link...'}
            </span>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 text-[#2563FF] hover:text-[#1D4ED8] transition-colors"
            >
              {copied ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              )}
            </button>
          </div>

          {/* Copy + Email buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 bg-[#2563FF] hover:bg-[#1D4ED8] text-white text-sm font-semibold py-3 rounded-xl transition-all shadow-[0_4px_12px_rgba(37,99,255,0.2)]"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  Copy Invite Link
                </>
              )}
            </button>
            <button
              onClick={handleEmail}
              className="flex-1 flex items-center justify-center gap-2 border border-[#D0D5DD] text-[#344054] text-sm font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Share via Email
            </button>
          </div>

          {/* WhatsApp + QR */}
          <div className="flex justify-center gap-8 pt-4 border-t border-[#EEF1F6]">
            <button
              onClick={handleWhatsApp}
              className="flex flex-col items-center gap-2 text-[#98A2B3] hover:text-[#111827] transition-colors"
            >
              <div className="w-11 h-11 rounded-full border border-[#EEF1F6] flex items-center justify-center hover:border-[#D0D5DD] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <span className="text-xs font-medium">WhatsApp</span>
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: event?.title, url: inviteLink })
                }
              }}
              className="flex flex-col items-center gap-2 text-[#98A2B3] hover:text-[#111827] transition-colors"
            >
              <div className="w-11 h-11 rounded-full border border-[#EEF1F6] flex items-center justify-center hover:border-[#D0D5DD] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
              </div>
              <span className="text-xs font-medium">Socials</span>
            </button>

            <button
              onClick={() => alert('QR Code feature coming soon!')}
              className="flex flex-col items-center gap-2 text-[#98A2B3] hover:text-[#111827] transition-colors"
            >
              <div className="w-11 h-11 rounded-full border border-[#EEF1F6] flex items-center justify-center hover:border-[#D0D5DD] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                </svg>
              </div>
              <span className="text-xs font-medium">QR Code</span>
            </button>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="flex items-center justify-between w-full max-w-lg mt-8">
          <button
            onClick={() => router.push(`/events/${id}/gifts`)}
            className="flex items-center gap-2 text-sm font-semibold text-[#344054] border border-[#D0D5DD] px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Gifts
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 bg-[#2563FF] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-[0_4px_12px_rgba(37,99,255,0.2)]"
          >
            Complete & Go to Dashboard
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-2 mt-6 text-xs text-[#98A2B3]">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          All guest interactions are private and secure.
        </div>
      </div>
    </div>
  )
}