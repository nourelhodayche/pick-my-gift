"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import api from "@/lib/api";

const IconLink = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
)
const IconTrash = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
)
const IconCopy = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)
const IconCheck = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconCalendar = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IconPin = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const IconUsers = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IconGift = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
)
const IconPlus = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IconLoader = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    style={{ animation: "spin 0.8s linear infinite" }}>
    <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
  </svg>
)
const IconX = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconExternalLink = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

const guestColors = [
  { bg: "#EFF4FF", color: "#2563FF" },
  { bg: "#FDF2F8", color: "#DB2777" },
  { bg: "#FFF7ED", color: "#EA580C" },
  { bg: "#F0FDF4", color: "#16A34A" },
  { bg: "#F5F3FF", color: "#7C3AED" },
]

function GiftCard({ gift, isOwner, myReservations, onReserve, onCancel, onDelete, loading }) {
  const isReservedByMe = myReservations?.some(r => r.giftId === gift.id)
  const isReserved = gift.status === "reserved"

  return (
    <div
      style={{
        background: "#fff", border: "1px solid #EEF1F6", borderRadius: 16,
        overflow: "hidden", display: "flex", flexDirection: "column",
        transition: "box-shadow 0.2s, transform 0.2s",
        opacity: isReserved && !isReservedByMe && !isOwner ? 0.6 : 1,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 24px rgba(37,99,255,0.08)"; e.currentTarget.style.transform = "translateY(-2px)" }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none" }}
    >
      <div style={{ height: 180, background: "#F8F9FC", position: "relative", overflow: "hidden" }}>
        {gift.image ? (
          <img src={gift.image} alt={gift.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#D0D5DD" }}>
            <IconGift />
          </div>
        )}
        {isReserved && (
          <div style={{
            position: "absolute", top: 10, right: 10,
            background: isReservedByMe ? "#2563FF" : "#111827",
            color: "#fff", fontSize: 11, fontWeight: 600,
            padding: "4px 10px", borderRadius: 20,
            display: "flex", alignItems: "center", gap: 4
          }}>
            <IconCheck />
            {isReservedByMe ? "Reserved by you" : "Taken"}
          </div>
        )}
      </div>

      <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#111827", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {gift.name}
          </p>
          {gift.price && (
            <p style={{ margin: "4px 0 0", fontWeight: 700, fontSize: 16, color: "#2563FF" }}>
              {gift.price}
            </p>
          )}
        </div>

        <div style={{ marginTop: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          {gift.url && (
            <a href={gift.url} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#98A2B3", textDecoration: "none", border: "1px solid #EEF1F6", borderRadius: 8, padding: "5px 10px" }}>
              <IconExternalLink /> View
            </a>
          )}
          {isOwner ? (
            <button onClick={() => onDelete(gift.id)}
              style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#98A2B3", background: "none", border: "1px solid #EEF1F6", borderRadius: 8, padding: "5px 10px", cursor: "pointer" }}>
              <IconTrash /> Delete
            </button>
          ) : (
            <button
              disabled={(isReserved && !isReservedByMe) || loading === gift.id}
              onClick={() => isReservedByMe ? onCancel(gift.id) : onReserve(gift.id)}
              style={{
                marginLeft: "auto", display: "flex", alignItems: "center", gap: 5,
                fontSize: 12, fontWeight: 600,
                color: isReservedByMe ? "#EF4444" : (isReserved ? "#98A2B3" : "#fff"),
                background: isReservedByMe ? "#FEF2F2" : (isReserved ? "#F8F9FC" : "#2563FF"),
                border: `1px solid ${isReservedByMe ? "#FCA5A5" : (isReserved ? "#EEF1F6" : "#2563FF")}`,
                borderRadius: 8, padding: "5px 12px",
                cursor: isReserved && !isReservedByMe ? "not-allowed" : "pointer",
                transition: "opacity 0.15s"
              }}>
              {loading === gift.id ? <IconLoader /> : isReservedByMe ? <><IconX /> Cancel</> : <><IconCheck /> Reserve</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function AddGiftModal({ eventId, onClose, onAdded }) {
  const [url, setUrl] = useState("")
  const [preview, setPreview] = useState(null)
  const [scraping, setScraping] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleScrape = async () => {
    if (!url.trim()) return
    setScraping(true)
    setError("")
    setPreview(null)
    try {
      const res = await api.post("/api/gifts/scrape", { url })
      setPreview(res.data)
    } catch {
      setError("Unable to fetch gift details. Please check the URL.")
    } finally {
      setScraping(false)
    }
  }

  const handleAdd = async () => {
    if (!preview) return
    setSaving(true)
    try {
      await api.post(`/api/gifts/event/${eventId}`, {
        name: preview.title,
        image: preview.image,
        price: preview.price,
        url: preview.url || url,
      })
      onAdded()
      onClose()
    } catch {
      setError("Failed to add gift.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(17,24,39,0.4)",
      backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 1000
    }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 28, width: 480, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Add a Gift</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#98A2B3", padding: 4 }}><IconX /></button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleScrape()}
            placeholder="Paste a product URL…"
            style={{ flex: 1, border: "1.5px solid #D0D5DD", borderRadius: 10, padding: "10px 14px", fontSize: 14, outline: "none", color: "#111827", background: "#F8F9FC" }}
          />
          <button onClick={handleScrape} disabled={scraping || !url.trim()}
            style={{ background: "#2563FF", color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, opacity: scraping || !url.trim() ? 0.6 : 1 }}>
            {scraping ? <IconLoader /> : <IconLink />}
            {scraping ? "Fetching…" : "Fetch"}
          </button>
        </div>

        {error && <p style={{ margin: "0 0 12px", fontSize: 13, color: "#EF4444" }}>{error}</p>}

        {preview && (
          <div style={{ border: "1.5px solid #EEF1F6", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 14, padding: 14, alignItems: "flex-start" }}>
              {preview.image && (
                <img src={preview.image} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 14, color: "#111827", lineHeight: 1.4 }}>{preview.title}</p>
                {preview.price && <p style={{ margin: 0, fontWeight: 700, color: "#2563FF", fontSize: 15 }}>{preview.price}</p>}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 18px", border: "1.5px solid #D0D5DD", borderRadius: 10, background: "none", fontSize: 14, cursor: "pointer", color: "#111827" }}>
            Cancel
          </button>
          {preview && (
            <button onClick={handleAdd} disabled={saving}
              style={{ padding: "10px 20px", background: "#2563FF", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", gap: 6 }}>
              {saving ? <IconLoader /> : <IconPlus />}
              {saving ? "Adding…" : "Add Gift"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EventDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [event, setEvent] = useState(null)
  const [gifts, setGifts] = useState([])
  const [myReservations, setMyReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [reservingId, setReservingId] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [confirmGiftId, setConfirmGiftId] = useState(null)

  const [currentUser] = useState(() => {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  })

  const isOwner = event?.ownerId === currentUser?.id

  const refetch = async () => {
    try {
      const [eventRes, giftsRes, resRes] = await Promise.all([
        api.get(`/api/events/${id}`),
        api.get(`/api/gifts/event/${id}`),
        api.get("/api/reservations/mine"),
      ])
      setEvent(eventRes.data)
      setGifts(giftsRes.data)
      setMyReservations(resRes.data)
    } catch {}
  }

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [eventRes, giftsRes, resRes] = await Promise.all([
          api.get(`/api/events/${id}`),
          api.get(`/api/gifts/event/${id}`),
          api.get("/api/reservations/mine"),
        ])
        if (!cancelled) {
          setEvent(eventRes.data)
          setGifts(giftsRes.data)
          setMyReservations(resRes.data)
        }
      } catch {
        if (!cancelled) setError("Failed to load event.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  const handleReserve = async (giftId) => {
    setReservingId(giftId)
    try {
      await api.post(`/api/reservations/gifts/${giftId}`)
      await refetch()
    } catch (e) {
      alert(e.response?.data?.message || "Could not reserve this gift.")
    } finally {
      setReservingId(null)
      setConfirmGiftId(null)
    }
  }

  const handleCancel = async (giftId) => {
    setReservingId(giftId)
    try {
      await api.delete(`/api/reservations/gifts/${giftId}`)
      await refetch()
    } catch {
      alert("Could not cancel reservation.")
    } finally {
      setReservingId(null)
    }
  }

  const handleDeleteGift = async (giftId) => {
    if (!confirm("Delete this gift?")) return
    try {
      await api.delete(`/api/gifts/${giftId}`)
      setGifts(prev => prev.filter(g => g.id !== giftId))
    } catch {
      alert("Could not delete gift.")
    }
  }

  const handleCopyInviteLink = () => {
    const link = `${window.location.origin}/invite/${event?.invitation?.token}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (d) => {
    if (!d) return ""
    return new Date(d).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  }

  if (loading) return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8F9FC" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "#98A2B3" }}>
          <IconLoader />
          <span style={{ fontSize: 14 }}>Loading event…</span>
        </div>
      </div>
    </div>
  )

  if (error || !event) return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8F9FC" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#98A2B3", fontSize: 14 }}>{error || "Event not found."}</p>
      </div>
    </div>
  )

  const reservedCount = gifts.filter(g => g.status === "reserved").length
  const inviteToken = event?.invitation?.token

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8F9FC" }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <main style={{ flex: 1, padding: "28px 32px", maxWidth: 1100, width: "100%" }}>

          {/* Event Header */}
          <div style={{ background: "#fff", border: "1px solid #EEF1F6", borderRadius: 24, overflow: "hidden", marginBottom: 24 }}>
            {event.coverImage && (
              <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
                <img src={event.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(17,24,39,0.5))" }} />
              </div>
            )}

            <div style={{ padding: "24px 28px 20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#2563FF", background: "#EFF4FF", padding: "3px 10px", borderRadius: 20 }}>
                      {event.eventType || "Event"}
                    </span>
                    {isOwner && (
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#059669", background: "#ECFDF5", padding: "3px 10px", borderRadius: 20 }}>
                        You're the organizer
                      </span>
                    )}
                  </div>
                  <h1 style={{ margin: "0 0 12px", fontSize: 26, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}>
                    {event.title}
                  </h1>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                    {event.date && (
                      <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#98A2B3" }}>
                        <IconCalendar /> {formatDate(event.date)}
                      </span>
                    )}
                    {event.location && (
                      <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#98A2B3" }}>
                        <IconPin /> {event.location}
                      </span>
                    )}
                    {event.guestCount && (
                      <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#98A2B3" }}>
                        <IconUsers /> {event.guestCount} guests expected
                      </span>
                    )}
                    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#98A2B3" }}>
                      <IconGift /> {gifts.length} gifts · {reservedCount} reserved
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                  {isOwner && inviteToken && (
                    <button onClick={handleCopyInviteLink}
                      style={{
                        display: "flex", alignItems: "center", gap: 7, padding: "10px 16px",
                        border: "1.5px solid #D0D5DD", borderRadius: 12, background: "#fff",
                        fontSize: 13, fontWeight: 600, color: copied ? "#059669" : "#111827",
                        cursor: "pointer", transition: "all 0.2s"
                      }}>
                      {copied ? <IconCheck /> : <IconCopy />}
                      {copied ? "Copied!" : "Copy Invite Link"}
                    </button>
                  )}
                  {isOwner && (
                    <button onClick={() => setShowAddModal(true)}
                      style={{
                        display: "flex", alignItems: "center", gap: 7, padding: "10px 18px",
                        background: "#2563FF", border: "none", borderRadius: 12,
                        color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer"
                      }}>
                      <IconPlus /> Add Gift
                    </button>
                  )}
                </div>
              </div>

              {event.description && (
                <p style={{ margin: "16px 0 0", fontSize: 14, color: "#6B7280", lineHeight: 1.6, borderTop: "1px solid #EEF1F6", paddingTop: 16 }}>
                  {event.description}
                </p>
              )}
            </div>
          </div>

          {/* Guests Section — owner only */}
          {isOwner && (
            <div style={{ background: "#fff", border: "1px solid #EEF1F6", borderRadius: 24, padding: "24px 28px", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h2 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 700, color: "#111827" }}>
                    Guests
                    <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 500, color: "#98A2B3" }}>
                      {event._count?.attendees || 0}
                      {event.guestCount ? ` / ${event.guestCount} expected` : ' joined'}
                    </span>
                  </h2>
                  <p style={{ margin: 0, fontSize: 13, color: "#98A2B3" }}>
                    People who joined via your invitation link
                  </p>
                </div>

                {inviteToken && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      background: "#F8F9FC", border: "1px solid #EEF1F6", borderRadius: 10,
                      padding: "8px 14px", fontSize: 12, color: "#667085",
                      fontFamily: "monospace", maxWidth: 240,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                    }}>
                      {typeof window !== 'undefined' ? `${window.location.origin}/invite/${inviteToken}` : ''}
                    </div>
                    <button onClick={handleCopyInviteLink}
                      style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                        background: copied ? "#ECFDF5" : "#2563FF",
                        border: "none", borderRadius: 10,
                        color: copied ? "#059669" : "#fff",
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                        whiteSpace: "nowrap", transition: "all 0.2s"
                      }}>
                      {copied ? <IconCheck /> : <IconCopy />}
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                )}
              </div>

              {!event.attendees || event.attendees.length === 0 ? (
                <div style={{ border: "1.5px dashed #D0D5DD", borderRadius: 16, padding: "32px 24px", textAlign: "center" }}>
                  <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#111827", fontSize: 14 }}>No guests yet</p>
                  <p style={{ margin: 0, color: "#98A2B3", fontSize: 13 }}>Share your invitation link to invite people</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                  {event.attendees.map((attendee, i) => {
                    const c = guestColors[i % guestColors.length]
                    return (
                      <div key={attendee.user.id} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 14px", border: "1px solid #EEF1F6",
                        borderRadius: 12, background: "#FAFAFA"
                      }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%",
                          background: c.bg, color: c.color,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, fontWeight: 700, flexShrink: 0
                        }}>
                          {attendee.user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {attendee.user.name}
                          </p>
                          <p style={{ margin: 0, fontSize: 11, color: "#98A2B3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {attendee.user.email}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Gift List */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>
                Gift List
                {gifts.length > 0 && (
                  <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 500, color: "#98A2B3" }}>
                    {reservedCount}/{gifts.length} reserved
                  </span>
                )}
              </h2>
            </div>

            {gifts.length === 0 ? (
              <div style={{ background: "#fff", border: "1.5px dashed #D0D5DD", borderRadius: 20, padding: "48px 24px", textAlign: "center" }}>
                <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#111827", fontSize: 15 }}>No gifts yet</p>
                <p style={{ margin: "0 0 20px", color: "#98A2B3", fontSize: 13 }}>
                  {isOwner ? "Add gifts by pasting product links." : "The organizer hasn't added any gifts yet."}
                </p>
                {isOwner && (
                  <button onClick={() => setShowAddModal(true)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", background: "#2563FF", border: "none", borderRadius: 12, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    <IconPlus /> Add First Gift
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 16 }}>
                {gifts.map(gift => (
                  <GiftCard
                    key={gift.id}
                    gift={gift}
                    isOwner={isOwner}
                    myReservations={myReservations}
                    onReserve={(giftId) => setConfirmGiftId(giftId)}
                    onCancel={handleCancel}
                    onDelete={handleDeleteGift}
                    loading={reservingId}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Gift Modal */}
      {showAddModal && (
        <AddGiftModal
          eventId={id}
          onClose={() => setShowAddModal(false)}
          onAdded={refetch}
        />
      )}

      {/* Confirm Reserve Modal */}
      {confirmGiftId && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(17,24,39,0.4)",
          backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000
        }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 28, width: 380, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, background: "#EFF4FF", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#2563FF" }}>
              <IconGift />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: "#111827" }}>Reserve this gift?</h3>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "#6B7280", lineHeight: 1.5 }}>
              Are you sure you want to reserve this gift? It will be marked as taken for others.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmGiftId(null)}
                style={{ flex: 1, padding: "11px", border: "1.5px solid #D0D5DD", borderRadius: 12, background: "none", fontSize: 14, cursor: "pointer", color: "#111827", fontWeight: 500 }}>
                Cancel
              </button>
              <button onClick={() => handleReserve(confirmGiftId)} disabled={!!reservingId}
                style={{ flex: 1, padding: "11px", background: "#2563FF", border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: reservingId ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {reservingId ? <IconLoader /> : <IconCheck />}
                {reservingId ? "Reserving…" : "Yes, reserve it"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}