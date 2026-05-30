'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
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

export default function AddGiftsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [event, setEvent] = useState(null)
  const [gifts, setGifts] = useState([])
  const [url, setUrl] = useState('')
  const [scraping, setScraping] = useState(false)
  const [scrapeError, setScrapeError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [validating, setValidating] = useState(false)

  //Run this code when the component loads, AND again whenever id changes.
  useEffect(() => {
    fetchEvent()
    fetchGifts()
  }, [id])

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/api/events/${id}`)
      setEvent(res.data)
    } catch (err) {
      router.push('/dashboard')
    }
  }

  const fetchGifts = async () => {
    try {
      const res = await api.get(`/api/gifts/event/${id}`)
      setGifts(res.data)
    } catch (err) {
      console.error(err)
    }
  }

 const handleScrape = async () => {
  if (!url.trim()) return
  setScrapeError('')
  setScraping(true)
  try {
    const scrapeRes = await api.post('/api/gifts/scrape', { url })
    const { title, image, price } = scrapeRes.data
    await api.post(`/api/gifts/event/${id}`, {
      name: title,
      image,
      price,
      url
    })
    setUrl('')
    fetchGifts()
  } catch (err) {
    console.error(err)
    setScrapeError(
      err.response?.data?.message || 'Could not fetch this URL. Try another link.'
    )
  } finally {
    setScraping(false)
  }
}

  const handleDelete = async (giftId) => {
    setDeletingId(giftId)
    try {
      await api.delete(`/api/gifts/${giftId}`)
      setGifts(prev => prev.filter(g => g.id !== giftId))
    } catch (err) {
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleValidate = async () => {
    if (gifts.length === 0) return
    setValidating(true)
    router.push(`/events/${id}/invite`)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleScrape()
    }
  }

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
          <p className="text-[#98A2B3] text-[12px] font-medium">Step 2 of 4</p>
        </div>

        {/* Steps nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {steps.map((step, index) => {
            const isActive = index === 1
            const isDone = index === 0
            return (
              <div
                key={step.label}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#EEF3FF] text-[#2563FF] font-semibold'
                    : isDone
                    ? 'text-[#667085]'
                    : 'text-[#C8D0DC]'
                }`}
              >
                <span className={
                  isActive ? 'text-[#2563FF]' :
                  isDone ? 'text-[#667085]' :
                  'text-[#C8D0DC]'
                }>
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
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-12 py-10">

          {/* Header */}
          <div className="mb-8">
            {event && (
              <div className="flex items-center gap-2 text-sm text-[#98A2B3] font-medium mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v13m0-13V6a4 4 0 00-4-4H6a4 4 0 00-4 4v2h4m8 0V6a4 4 0 014-4h2a4 4 0 014 4v2h-4M3 10h18"/>
                </svg>
                <span className="text-[#2563FF] font-semibold uppercase tracking-wider text-xs">
                  {event.eventType || event.title}
                </span>
              </div>
            )}
            <h1 className="text-[32px] font-bold text-[#111827] tracking-tight leading-tight mb-2">
              Build your dream gift list
            </h1>
            <p className="text-[#98A2B3] text-[15px]">
              Add products from any online store by simply pasting the URL below.
            </p>
          </div>

          {/* URL Input */}
          <div className="bg-white rounded-2xl border border-[#EEF1F6] p-5 mb-6 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-3 border border-[#D0D5DD] rounded-xl px-4 py-3 bg-white focus-within:border-[#2563FF] focus-within:ring-2 focus-within:ring-[#2563FF]/10 transition-all">
                <svg className="w-5 h-5 text-[#98A2B3] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setScrapeError('') }}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste Amazon, Etsy, or Store URL here..."
                  className="flex-1 text-sm text-[#111827] placeholder-[#98A2B3] focus:outline-none bg-transparent"
                />
                {url && (
                  <button onClick={() => setUrl('')} className="text-[#98A2B3] hover:text-gray-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                )}
              </div>
              <button
                onClick={handleScrape}
                disabled={scraping || !url.trim()}
                className="flex items-center gap-2 bg-[#2563FF] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-[0_4px_12px_rgba(37,99,255,0.2)] disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
              >
                {scraping ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Fetching...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    Fetch
                  </>
                )}
              </button>
            </div>

            {scrapeError && (
              <p className="text-red-500 text-xs mt-2 ml-1">{scrapeError}</p>
            )}

            {scraping && (
              <div className="mt-4 flex items-center gap-3 px-2">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-2 h-2 bg-[#2563FF] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}/>
                  ))}
                </div>
                <p className="text-sm text-[#98A2B3]">Fetching product info...</p>
              </div>
            )}
          </div>

          {/* Feature Cards */}
          {gifts.length === 0 && !scraping && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                {
                  color: 'text-red-500',
                  bg: 'bg-red-50',
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  ),
                  title: 'Fast Import',
                  desc: 'Paste the link and we handle the rest, including images.'
                },
                {
                  color: 'text-teal-500',
                  bg: 'bg-teal-50',
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                    </svg>
                  ),
                  title: 'Collaborative',
                  desc: 'Guests see real-time updates when gifts are reserved.'
                },
                {
                  color: 'text-blue-500',
                  bg: 'bg-blue-50',
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                  ),
                  title: 'Secure',
                  desc: 'We verify all links for a safe shopping experience.'
                }
              ].map((card) => (
                <div key={card.title} className="bg-white rounded-2xl border border-[#EEF1F6] p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
                  <div className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                    {card.icon}
                  </div>
                  <p className="text-sm font-bold text-[#111827] mb-1">{card.title}</p>
                  <p className="text-xs text-[#98A2B3] leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Gifts Table */}
          {gifts.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#EEF1F6] overflow-hidden shadow-[0_1px_3px_rgba(16,24,40,0.04)] mb-6">

              {/* Table Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEF1F6]">
                <h3 className="text-sm font-bold text-[#111827]">
                  Gift List
                  <span className="ml-2 text-xs font-semibold text-[#2563FF] bg-blue-50 px-2 py-0.5 rounded-full">
                    {gifts.length} {gifts.length === 1 ? 'item' : 'items'}
                  </span>
                </h3>
                <p className="text-xs text-[#98A2B3]">Add more gifts by pasting another URL above</p>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#EEF1F6]">
                    <th className="text-left px-6 py-3 text-[11px] font-semibold text-[#98A2B3] uppercase tracking-wider w-16">Image</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#98A2B3] uppercase tracking-wider">Product</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#98A2B3] uppercase tracking-wider w-32">Price</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#98A2B3] uppercase tracking-wider w-28">Status</th>
                    <th className="px-4 py-3 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F4F7]">
                  {gifts.map((gift) => (
                    <tr key={gift.id} className="hover:bg-[#FAFAFA] transition-colors">

                      {/* Image */}
                      <td className="px-6 py-4">
                        {gift.image ? (
                          <img
                            src={gift.image}
                            alt={gift.name}
                            className="w-12 h-12 object-cover rounded-xl bg-gray-100"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-[#F2F4F7] rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#C8D0DC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a4 4 0 00-4-4H6a4 4 0 00-4 4v2h4m8 0V6a4 4 0 014-4h2a4 4 0 014 4v2h-4M3 10h18"/>
                            </svg>
                          </div>
                        )}
                      </td>

                      {/* Product info */}
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-[#111827] line-clamp-2 max-w-xs">{gift.name}</p>
                       {gift.url && (
  <a
    href={gift.url}
    target="_blank"
    rel="noopener noreferrer"
    className="text-xs text-[#2563FF] hover:underline mt-0.5 inline-block truncate max-w-xs"
  >
    View product →
  </a>
)}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4">
                        {gift.price ? (
                          <span className="text-sm font-bold text-[#111827]">{gift.price}</span>
                        ) : (
                          <span className="text-sm text-[#98A2B3]">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          gift.status === 'reserved'
                            ? 'bg-orange-50 text-orange-500'
                            : 'bg-green-50 text-green-600'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${gift.status === 'reserved' ? 'bg-orange-400' : 'bg-green-500'}`}/>
                          {gift.status === 'reserved' ? 'Reserved' : 'Available'}
                        </span>
                      </td>

                      {/* Delete */}
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleDelete(gift.id)}
                          disabled={deletingId === gift.id || gift.status === 'reserved'}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#98A2B3] hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed mx-auto"
                        >
                          {deletingId === gift.id ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Validate Button */}
              <div className="px-6 py-4 border-t border-[#EEF1F6] bg-[#FAFAFA] flex items-center justify-between">
                <p className="text-xs text-[#98A2B3]">
                  {gifts.length} gift{gifts.length > 1 ? 's' : ''} added to your list
                </p>
                <button
                  onClick={handleValidate}
                  disabled={validating || gifts.length === 0}
                  className="flex items-center gap-2 bg-[#2563FF] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-[0_4px_12px_rgba(37,99,255,0.2)] disabled:opacity-60"
                >
                  {validating ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                  )}
                  Validate Gift List
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <div className="border-t border-[#EEF1F6] bg-white px-12 py-4 flex items-center justify-between">
          <span className="text-[#2563FF] text-xs font-semibold">Gift Registry Coordination</span>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service'].map(item => (
              <span key={item} className="text-[#98A2B3] text-xs hover:text-gray-600 cursor-pointer">{item}</span>
            ))}
          </div>
          <span className="text-[#98A2B3] text-xs">© 2024 Gift Registry Coordination</span>
        </div>
      </div>
    </div>
  )
}