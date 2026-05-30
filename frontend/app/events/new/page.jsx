'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/layout/Sidebar'
import api from '@/lib/api'

const EVENT_TYPES = [
  'Wedding',
  'Birthday',
  'Baby Shower',
  'Graduation',
  'Anniversary',
  'Housewarming',
  'Engagement',
  'Other'
]

const steps = [
  {
    label: 'Event Details',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    )
  },
  {
    label: 'Add Gifts',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v13m0-13V6a4 4 0 00-4-4H6a4 4 0 00-4 4v2h4m8 0V6a4 4 0 014-4h2a4 4 0 014 4v2h-4M3 10h18"/>
      </svg>
    )
  },
  {
    label: 'Preview List',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
      </svg>
    )
  },
  {
    label: 'Invitations',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    )
  }
]

export default function CreateEventPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    date: '',
    eventType: '',
    guestCount: '',
    description: '',
    coverImage: ''
  })
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => setForm(prev => ({ ...prev, coverImage: e.target.result }))
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleImageFile(file)
  }

  const handleFileInput = (e) => {
    handleImageFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title) return setError('Event name is required')
    setLoading(true)
    try {
        const res = await api.post('/api/events', form)
        router.push(`/events/${res.data.id}/gifts`)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
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
          <p className="text-[#98A2B3] text-[12px] font-medium">Step 1 of 4</p>
        </div>

        {/* Steps nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {steps.map((step, index) => {
            const isActive = index === 0
            return (
              <div
                key={step.label}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#EEF3FF] text-[#2563FF] font-semibold'
                    : 'text-[#98A2B3]'
                }`}
              >
                <span className={isActive ? 'text-[#2563FF]' : 'text-[#C8D0DC]'}>
                  {step.icon}
                </span>
                {step.label}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-12 py-10 max-w-3xl w-full mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[28px] font-bold text-[#111827] tracking-tight leading-tight">
                Event Details
              </h1>
              <div className="h-1 w-32 bg-[#2563FF] rounded-full mt-2" />
            </div>
            <span className="text-[#2563FF] text-sm font-semibold">Step 1 of 4</span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-sm rounded-xl px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Event Name */}
            <div>
              <label className="block text-sm font-semibold text-[#344054] mb-1.5">
                Event Name
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Sarah's Wedding"
                className="w-full px-4 py-3 border border-[#D0D5DD] rounded-xl text-sm text-[#111827] placeholder-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2563FF]/20 focus:border-[#2563FF] transition-all bg-white"
              />
            </div>

            {/* Date + Event Type + Guests */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#344054] mb-1.5">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#D0D5DD] rounded-xl text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563FF]/20 focus:border-[#2563FF] transition-all bg-white"
                />
              </div>

              <div>
  <label className="block text-sm font-semibold text-[#344054] mb-1.5">Event Type</label>
  <input
    type="text"
    name="eventType"
    value={form.eventType}
    onChange={handleChange}
    placeholder="Wedding, Birthday, or type your own..."
    list="eventTypesList"
    className="w-full px-4 py-3 border border-[#D0D5DD] rounded-xl text-sm text-[#111827] placeholder-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2563FF]/20 focus:border-[#2563FF] transition-all bg-white"
  />
  <datalist id="eventTypesList">
    {['Wedding', 'Birthday', 'Baby Shower', 'Graduation', 'Anniversary', 'Housewarming', 'Engagement'].map(type => (
      <option key={type} value={type} />
    ))}
  </datalist>
</div>

              <div>
                <label className="block text-sm font-semibold text-[#344054] mb-1.5">Expected Guests</label>
                <input
                  type="number"
                  name="guestCount"
                  value={form.guestCount}
                  onChange={handleChange}
                  placeholder="e.g., 50"
                  min="1"
                  className="w-full px-4 py-3 border border-[#D0D5DD] rounded-xl text-sm text-[#111827] placeholder-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2563FF]/20 focus:border-[#2563FF] transition-all bg-white"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-[#344054] mb-1.5">Location</label>
              <input
                type="text"
                name="location"
                value={form.location || ''}
                onChange={handleChange}
                placeholder="e.g., Paris, France"
                className="w-full px-4 py-3 border border-[#D0D5DD] rounded-xl text-sm text-[#111827] placeholder-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2563FF]/20 focus:border-[#2563FF] transition-all bg-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[#344054] mb-1.5">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Tell your guests a bit about the celebration..."
                rows={4}
                className="w-full px-4 py-3 border border-[#D0D5DD] rounded-xl text-sm text-[#111827] placeholder-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2563FF]/20 focus:border-[#2563FF] transition-all bg-white resize-none"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-[11px] font-bold text-[#98A2B3] tracking-[0.12em] uppercase mb-2">
                Cover Image
              </label>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('coverInput').click()}
                className={`relative w-full h-52 rounded-2xl border-2 border-dashed overflow-hidden cursor-pointer transition-all ${
                  dragOver
                    ? 'border-[#2563FF] bg-blue-50'
                    : 'border-[#D0D5DD] hover:border-[#2563FF] hover:bg-blue-50/30'
                }`}
              >
                {form.coverImage ? (
                  <>
                    <img
                      src={form.coverImage}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                        </svg>
                      </div>
                      <p className="text-white text-sm font-semibold">Click to change photo</p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <div className="w-12 h-12 bg-[#EEF3FF] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#2563FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-[#344054] text-sm font-semibold">Drop your cover photo here</p>
                      <p className="text-[#98A2B3] text-xs mt-0.5">Recommended size: 1200 × 600px (Max 5MB)</p>
                    </div>
                  </div>
                )}
                <input
                  id="coverInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <Link
                href="/dashboard"
                className="px-6 py-3 border border-[#D0D5DD] text-[#344054] text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-[#2563FF] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-8 py-3 rounded-xl transition-all shadow-[0_4px_12px_rgba(37,99,255,0.2)] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Creating...
                  </>
                ) : 'Save & Continue to Gifts'}
              </button>
            </div>
          </form>
        </main>

        {/* Footer */}
        <div className="border-t border-[#EEF1F6] bg-white px-12 py-4 flex items-center justify-between">
          <span className="text-[#2563FF] text-xs font-semibold">Gift Registry Coordination</span>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Help Center'].map(item => (
              <span key={item} className="text-[#98A2B3] text-xs hover:text-gray-600 cursor-pointer transition-colors">{item}</span>
            ))}
          </div>
          <span className="text-[#98A2B3] text-xs">© 2024 Gift Registry Coordination</span>
        </div>
      </div>
    </div>
  )
}