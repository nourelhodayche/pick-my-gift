'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { setAuth } from '@/lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const hasMinLength = form.password.length >= 8
  const hasSpecialChar = /[0-9!@#$%^&*]/.test(form.password)

const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')

  if (form.password !== form.confirmPassword)
    return setError('Passwords do not match')
  if (!agreed)
    return setError('Please agree to the Terms of Service')

  setLoading(true)

  try {
    const res = await api.post('/api/auth/register', {
      name: form.name,
      email: form.email,
      password: form.password
    })

    setAuth(res.data.token, res.data.user)

    const pendingToken = localStorage.getItem('pendingInvitationToken')
    if (pendingToken) {
      try {
        await api.post(`/api/invitations/${pendingToken}/join`)
      } catch (e) {
        // ignore already joined
      }
      localStorage.removeItem('pendingInvitationToken')
    }

    const redirectTo =
      localStorage.getItem('redirectAfterLogin') ||
      new URLSearchParams(window.location.search).get('redirect') ||
      '/dashboard'

    localStorage.removeItem('redirectAfterLogin')
    router.replace(redirectTo)
  } catch (err) {
    setError(err.response?.data?.message || 'Something went wrong')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-[#F8F9FC]">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <Link href="/" className="text-blue-600 font-bold text-xl tracking-tight">PickMyGift</Link>
        <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">Login</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">

          {/* Left Panel */}
          <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-10 bg-gradient-to-br from-[#EEF2FF] to-[#F0FDF4]">
            <div>
              <span className="inline-block bg-teal-600 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-[0.1em] uppercase mb-5">
                Aetheric Gift System
              </span>
              <h2 className="text-[26px] font-bold text-gray-900 leading-tight mb-3">
                Effortless coordination for the moments that matter.
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-7">
                Join 50,000+ organizers who have transformed group gifting into a seamless celebration.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Real-time Guest Analytics', desc: 'Track RSVPs and gift reservations instantly.' },
                  { title: 'Smart Gift Registry', desc: 'Avoid duplicate gifts with automated claiming.' }
                ].map((f) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center mt-0.5 flex-shrink-0 bg-blue-50">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{f.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <img
  src="/img-register.png"
  alt="Gift box"
  className="rounded-2xl object-cover w-full h-44 mt-8"
/>
          </div>

          {/* Right Panel */}
          <div className="flex-1 p-10">
            <h1 className="text-[26px] font-bold text-gray-900 mb-1">Create an account</h1>
            <p className="text-gray-400 text-sm mb-6">Start planning your next event in minutes.</p>

            {/* Google */}
            <button
              onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 mb-5 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[11px] text-gray-400 font-medium tracking-[0.08em] uppercase">or continue with email</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 text-sm rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  />
                </div>
              </div>

              {/* Security Check
              <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-700">Security Check:</p>
                {[
                  { label: '8+ characters', valid: hasMinLength },
                  { label: 'One number or special character', valid: hasSpecialChar }
                ].map(({ label, valid }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${valid ? 'border-green-500 bg-green-500' : 'border-gray-300'}`} />
                    <span className={`text-xs transition-colors ${valid ? 'text-green-600 font-medium' : 'text-gray-500'}`}>{label}</span>
                  </div>
                ))}
              </div> */}

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <label htmlFor="agree" className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <span className="text-blue-600 cursor-pointer hover:underline font-medium">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-blue-600 cursor-pointer hover:underline font-medium">Privacy Policy</span>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 rounded-xl transition-all duration-150 shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Creating account...
                  </>
                ) : 'Create Account →'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Log in</Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 px-2">
          <p className="text-xs text-gray-400">© 2024 PickMyGift. All rights reserved.</p>
          <div className="flex gap-5">
            {['Help Center', 'Security', 'Gift Ethics'].map((item) => (
              <span key={item} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}