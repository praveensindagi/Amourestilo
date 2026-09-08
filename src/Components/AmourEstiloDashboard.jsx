import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Calendar, Clock, MapPin, Phone, Mail, ChevronRight, Plus,
  SlidersHorizontal, ArrowUpDown, X, User, Users, TrendingUp,
  DollarSign, Star, LayoutGrid, List as ListIcon, LogOut, Sparkles,
  AlertCircle, Globe, Car, Sun, Moon, UserPlus, Check,
  Home, PieChart, Scissors, RefreshCw, Crown, Eye, EyeOff
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

/* ------------------------------------------------------------------ */
/* FIREBASE CONFIG                                                     */
/* Web API key is meant to be public/client-side — safe to keep here.  */
/* Real access control happens via Firestore security rules + the     */
/* signed-in user's ID token, not by hiding this key.                 */
/* ------------------------------------------------------------------ */

const firebaseConfig = {
  apiKey: "AIzaSyB6uMlx2FvQOnjhRANRD0jllQmksIuGl_o",
  authDomain: "amour-estilo.firebaseapp.com",
  projectId: "amour-estilo",
};

const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

/* ---- Firebase Auth (REST) ---- */
async function signInWithEmail(email, password) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, returnSecureToken: true }) }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message?.replace(/_/g, " ") || "Sign-in failed");
  return data; // { idToken, refreshToken, localId, email, expiresIn }
}

/* ---- Firestore REST value encode/decode ---- */
function decodeValue(val) {
  if (val == null) return null;
  if ("stringValue" in val) return val.stringValue;
  if ("integerValue" in val) return parseInt(val.integerValue, 10);
  if ("doubleValue" in val) return val.doubleValue;
  if ("booleanValue" in val) return val.booleanValue;
  if ("timestampValue" in val) return val.timestampValue;
  if ("nullValue" in val) return null;
  if ("arrayValue" in val) return (val.arrayValue.values || []).map(decodeValue);
  if ("mapValue" in val) return decodeFields(val.mapValue.fields || {});
  return null;
}
function decodeFields(fields) {
  const out = {};
  Object.entries(fields || {}).forEach(([k, val]) => { out[k] = decodeValue(val); });
  return out;
}
function decodeDoc(doc) {
  const id = doc.name.split("/").pop();
  return { id, ...decodeFields(doc.fields) };
}
function encodeValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "string") return { stringValue: val };
  if (typeof val === "number") return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  if (typeof val === "boolean") return { booleanValue: val };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(encodeValue) } };
  if (typeof val === "object") return { mapValue: { fields: encodeFields(val) } };
  return { stringValue: String(val) };
}
function encodeFields(obj) {
  const out = {};
  Object.entries(obj).forEach(([k, val]) => { out[k] = encodeValue(val); });
  return out;
}

/* ---- Firestore REST — bookings collection ---- */
async function fetchBookings(idToken) {
  const res = await fetch(`${FIRESTORE_BASE}/bookings?pageSize=300`, { headers: { Authorization: `Bearer ${idToken}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to fetch bookings");
  return (data.documents || []).map(decodeDoc);
}
async function patchBooking(id, patchObj, idToken) {
  const mask = Object.keys(patchObj).map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join("&");
  const res = await fetch(`${FIRESTORE_BASE}/bookings/${id}?${mask}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ fields: encodeFields(patchObj) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to update booking");
  return data;
}

/* ---- Map a raw Firestore booking doc to the shape the UI uses ---- */
function mapBookingDoc(doc) {
  const address = doc.address || [doc.block, doc.street, doc.locality, doc.city, doc.state].filter(Boolean).join(", ");
  const shortDate = typeof doc.preferredDate === "string" && doc.preferredDate.includes(", ")
    ? doc.preferredDate.split(", ").slice(1).join(", ")
    : doc.preferredDate || "";
  return {
    id: doc.id,
    clientName: doc.fullName || "Unnamed client",
    clientPhone: doc.phone || "",
    clientEmail: doc.email || "",
    service: { name: doc.service || "Service", category: doc.service || "Other" },
    artistId: doc.artistId || null,
    artistName: doc.artistName || "Unassigned",
    location: { type: "outcall", address: address || "Address not provided" },
    date: shortDate,
    startTime: doc.preferredTime || "",
    status: doc.status || "pending",
    payment: { total: doc.bookingFee || 0, isMember: !!doc.isMember },
    skinType: doc.skinType || "",
    skinConcerns: doc.skinConcerns || [],
    notes: doc.specialNotes || "",
    createdAt: doc.createdAt || "",
  };
}

/* ------------------------------------------------------------------ */
/* STATIC DATA (artists roster is local-only — not in Firestore yet)  */
/* ------------------------------------------------------------------ */

const INITIAL_ARTISTS = [
  { id: "a1", name: "Bhavana K R", specialties: ["Bridal Makeup", "Airbrush Makeup"], rating: 4.9, bookingsThisMonth: 14, revenueGenerated: 412000 },
  { id: "a2", name: "Ritika Shah", specialties: ["Soft Glam", "Cocktail Look"], rating: 4.7, bookingsThisMonth: 9, revenueGenerated: 186000 },
  { id: "a3", name: "Aisha Khan", specialties: ["Professional Shoot", "Party & Occasion"], rating: 4.8, bookingsThisMonth: 7, revenueGenerated: 154000 },
];

const SPECIALTY_OPTIONS = ["Bridal Makeup", "Cocktail Look", "Airbrush Makeup", "Soft Glam", "Party & Occasion", "Professional Shoot"];
const CATEGORY_VAR = {
  "Bridal Makeup": "--pink", "Cocktail Look": "--purple", "Airbrush Makeup": "--teal",
  "Soft Glam": "--yellow", "Party & Occasion": "--indigo", "Professional Shoot": "--blue",
};

const REVENUE_TREND = [
  { month: "Mar", revenue: 320000 }, { month: "Apr", revenue: 385000 },
  { month: "May", revenue: 410000 }, { month: "Jun", revenue: 398000 },
  { month: "Jul", revenue: 452000 }, { month: "Aug", revenue: 470000 },
  { month: "Sep (pred.)", revenue: 505000 },
];

/* ------------------------------------------------------------------ */
/* THEME                                                               */
/* ------------------------------------------------------------------ */

const THEME_CSS = `
  .theme-light {
    --bg:#F1F2F6; --bg2:#FFFFFF; --bg3:#F3F4F8; --bg4:#F3F4F8;
    --border:#EAEBF0; --border2:#F0F1F4;
    --label:rgba(15,17,23,0.94); --label2:rgba(15,17,23,0.56); --label3:rgba(15,17,23,0.36);
    --accent:#B8843A; --accentSoft: rgba(184,132,58,0.14);
    --green:#16A34A; --blue:#2563EB; --orange:#EA8C00; --red:#DC2626;
    --yellow:#B8860B; --purple:#7C3AED; --teal:#0D9488; --indigo:#4F46E5; --pink:#DB2777;
    --pillBg:#15161A; --pillText:#FFFFFF;
    --navBg:#15161A; --navIcon:#8B8D96; --navIconActive:#FFFFFF;
    --shadow: 0 1px 2px rgba(20,21,26,0.04), 0 10px 24px -14px rgba(20,21,26,0.16);
  }
  .theme-dark {
    --bg:#0B0B0D; --bg2:#17181C; --bg3:#1F2024; --bg4:#1F2024;
    --border:#2A2B30; --border2:#242529;
    --label:rgba(248,248,250,0.96); --label2:rgba(248,248,250,0.60); --label3:rgba(248,248,250,0.38);
    --accent:#E0B168; --accentSoft: rgba(224,177,104,0.16);
    --green:#3DDC84; --blue:#5B9BFF; --orange:#FFB020; --red:#FF5C5C;
    --yellow:#F0C929; --purple:#B084F9; --teal:#2FE0C7; --indigo:#8B92FF; --pink:#FF6FB0;
    --pillBg:#FFFFFF; --pillText:#0B0B0D;
    --navBg:#1C1D21; --navIcon:#7C7E86; --navIconActive:#FFFFFF;
    --shadow: 0 1px 2px rgba(0,0,0,0.3), 0 10px 24px -14px rgba(0,0,0,0.5);
  }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  @keyframes slideUp { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
  .animate-slide-up { animation: slideUp .22s ease-out; }
  @keyframes spin { to { transform: rotate(360deg) } }
  .spin { animation: spin 1s linear infinite; }
  .card-surface { background: var(--bg2); border: 1px solid var(--border); box-shadow: var(--shadow); }
`;

const STATUS_STYLE = {
  confirmed: { v: "--green", label: "Confirmed" },
  pending: { v: "--orange", label: "Pending" },
  in_progress: { v: "--blue", label: "In progress" },
  completed: { v: "--indigo", label: "Completed" },
  cancelled: { v: "--red", label: "Cancelled" },
};

const NAV_ITEMS = [
  { key: "home", label: "Overview", icon: Home, roles: ["super_admin"] },
  { key: "bookings", label: "Bookings", icon: Calendar, roles: ["artist", "admin", "super_admin"] },
  { key: "team", label: "Team", icon: Users, roles: ["admin", "super_admin"] },
  { key: "analytics", label: "Analytics", icon: PieChart, roles: ["super_admin"] },
  { key: "profile", label: "Profile", icon: User, roles: ["artist", "admin", "super_admin"] },
];

/* ------------------------------------------------------------------ */
/* HELPERS                                                            */
/* ------------------------------------------------------------------ */

function initials(name) { return (name || "?").split(" ").map((n) => n[0]).slice(0, 2).join(""); }
function formatMoney(n) { return `₹${Number(n || 0).toLocaleString("en-IN")}`; }
const v = (name) => `var(${name})`;
const tint = (cssVar, pct = 14) => `color-mix(in srgb, ${v(cssVar)} ${pct}%, transparent)`;

/* ------------------------------------------------------------------ */
/* SHARED COMPONENTS                                                  */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.pending;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: tint(s.v, 14) }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: v(s.v) }} />
      <span className="text-[11px] font-semibold tracking-wide" style={{ color: v(s.v) }}>{s.label}</span>
    </span>
  );
}

function CategoryChip({ category }) {
  const cv = CATEGORY_VAR[category] || "--accent";
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ color: v(cv), backgroundColor: tint(cv, 15) }}>
      {category}
    </span>
  );
}

function IconAvatar({ icon: Icon, colorVar = "--accent", size = 40 }) {
  return (
    <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: size, height: size, backgroundColor: tint(colorVar, 15) }}>
      <Icon size={size * 0.45} style={{ color: v(colorVar) }} />
    </div>
  );
}

function SegmentedTabs({ tabs, active, onChange }) {
  return (
    <div className="flex bg-[var(--bg4)] rounded-full p-1 overflow-x-auto no-scrollbar">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className="flex-1 whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all"
          style={active === t.key ? { backgroundColor: v("--pillBg"), color: v("--pillText") } : { color: v("--label2") }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function BookingCard({ booking, role, onOpen }) {
  const cv = CATEGORY_VAR[booking.service.category] || "--accent";
  return (
    <button onClick={() => onOpen(booking.id)} className="w-full text-left card-surface rounded-3xl p-4 hover:-translate-y-0.5 transition-transform">
      <div className="flex items-start gap-3 mb-3">
        <IconAvatar icon={Sparkles} colorVar={cv} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[var(--label)] font-bold text-[15px] truncate">{booking.clientName}</p>
            <StatusBadge status={booking.status} />
          </div>
          <p className="text-[var(--label3)] text-xs mt-0.5 font-medium flex items-center gap-1.5">
            {booking.service.name}
            {booking.payment.isMember && <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: v("--accent"), backgroundColor: tint("--accent", 16) }}><Crown size={9} /> Privé</span>}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[var(--label3)] mb-3 pl-[52px]">
        <span className="flex items-center gap-1.5"><Calendar size={13} /> {booking.date || "No date"}</span>
        <span className="flex items-center gap-1.5"><Clock size={13} /> {booking.startTime || "—"}</span>
        <span className="flex items-center gap-1.5"><Car size={13} /> Outcall</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[var(--border2)] pl-[52px]">
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "super_admin") && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--label)]">
              <span className="w-5 h-5 rounded-full bg-[var(--bg3)] flex items-center justify-center text-[9px] font-semibold">{booking.artistId ? initials(booking.artistName) : "?"}</span>
              {booking.artistName}
            </span>
          )}
          {role === "artist" && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--label2)]"><Globe size={12} /> via website</span>
          )}
        </div>
        {role !== "artist" && (
          <span className="text-xs font-bold" style={{ color: v("--accent") }}>{formatMoney(booking.payment.total)}</span>
        )}
      </div>
    </button>
  );
}

/* ---- Bottom sheet ---- */
function Sheet({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[var(--bg2)] rounded-t-3xl p-5 pb-8 animate-slide-up max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="w-10 h-1 bg-[var(--border)] rounded-full mx-auto mb-5" />
        {children}
      </div>
    </div>
  );
}

function FilterSheet({ open, onClose, filters, setFilters, showArtistFilter, artists }) {
  return (
    <Sheet open={open} onClose={onClose}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[var(--label)] font-semibold text-lg">Filter bookings</h3>
        <button onClick={onClose} className="text-[var(--label2)]"><X size={20} /></button>
      </div>
      <div className="space-y-5">
        {showArtistFilter && (
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[var(--label3)] mb-2">Artist</p>
            <div className="flex flex-wrap gap-2">
              <Chip active={!filters.artistId} onClick={() => setFilters((f) => ({ ...f, artistId: null }))}>All artists</Chip>
              {artists.map((a) => (
                <Chip key={a.id} active={filters.artistId === a.id} onClick={() => setFilters((f) => ({ ...f, artistId: a.id }))}>{a.name}</Chip>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-[var(--label3)] mb-2">Service</p>
          <div className="flex flex-wrap gap-2">
            {["All", ...SPECIALTY_OPTIONS].map((s) => (
              <Chip key={s} active={filters.service === s} onClick={() => setFilters((f) => ({ ...f, service: s }))}>{s}</Chip>
            ))}
          </div>
        </div>
      </div>
      <button onClick={onClose} className="w-full mt-6 py-3.5 rounded-2xl font-semibold text-sm" style={{ backgroundColor: v("--accent"), color: "#fff" }}>
        Apply filters
      </button>
    </Sheet>
  );
}

function Chip({ active, onClick, children, colorVar }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2 rounded-xl text-xs font-medium border transition-colors"
      style={active
        ? { backgroundColor: colorVar ? tint(colorVar, 18) : v("--pillBg"), color: colorVar ? v(colorVar) : v("--pillText"), borderColor: "transparent" }
        : { borderColor: v("--border"), color: v("--label2"), backgroundColor: v("--bg3") }}
    >
      {children}
    </button>
  );
}

/* ---- Assign artist sheet ---- */
function AssignArtistSheet({ open, onClose, artists, currentArtistId, onAssign }) {
  const [choice, setChoice] = useState(currentArtistId);
  React.useEffect(() => { if (open) setChoice(currentArtistId); }, [open, currentArtistId]);
  return (
    <Sheet open={open} onClose={onClose}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[var(--label)] font-semibold text-lg">Assign artist</h3>
        <button onClick={onClose} className="text-[var(--label2)]"><X size={20} /></button>
      </div>
      <div className="space-y-2">
        {artists.map((a) => (
          <button
            key={a.id}
            onClick={() => setChoice(a.id)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl border transition-colors"
            style={{ borderColor: choice === a.id ? v("--accent") : v("--border"), backgroundColor: choice === a.id ? tint("--accent", 10) : v("--bg3") }}
          >
            <span className="w-9 h-9 rounded-full bg-[var(--bg2)] flex items-center justify-center text-[11px] font-semibold text-[var(--label)]">{initials(a.name)}</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-[var(--label)]">{a.name}</p>
              <p className="text-[11px] text-[var(--label2)]">{a.specialties.join(" · ")}</p>
            </div>
            {choice === a.id && <Check size={18} style={{ color: v("--accent") }} />}
          </button>
        ))}
      </div>
      <button onClick={() => { onAssign(choice); onClose(); }} className="w-full mt-6 py-3.5 rounded-2xl font-semibold text-sm" style={{ backgroundColor: v("--accent"), color: "#fff" }}>
        Confirm assignment
      </button>
    </Sheet>
  );
}

/* ---- Add artist sheet ---- */
function AddArtistSheet({ open, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [specs, setSpecs] = useState([]);
  function toggleSpec(s) { setSpecs((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s])); }
  function submit() {
    if (!name.trim()) return;
    onAdd({ id: `a${Date.now()}`, name: name.trim(), specialties: specs.length ? specs : [SPECIALTY_OPTIONS[0]], rating: 5.0, bookingsThisMonth: 0, revenueGenerated: 0 });
    setName(""); setSpecs([]); onClose();
  }
  return (
    <Sheet open={open} onClose={onClose}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[var(--label)] font-semibold text-lg">Add artist</h3>
        <button onClick={onClose} className="text-[var(--label2)]"><X size={20} /></button>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-[var(--label3)] mb-2">Full name</p>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rhea D'Souza"
            className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-3.5 py-3 text-sm text-[var(--label)] outline-none" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-[var(--label3)] mb-2">Specialties</p>
          <div className="flex flex-wrap gap-2">
            {SPECIALTY_OPTIONS.map((s) => (
              <Chip key={s} active={specs.includes(s)} onClick={() => toggleSpec(s)} colorVar={CATEGORY_VAR[s]}>{s}</Chip>
            ))}
          </div>
        </div>
      </div>
      <button onClick={submit} className="w-full mt-6 py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2" style={{ backgroundColor: v("--accent"), color: "#fff" }}>
        <UserPlus size={16} /> Add to team
      </button>
      <p className="text-[10px] text-[var(--label3)] text-center mt-3">Team roster is local to this dashboard for now — not yet stored in Firestore.</p>
    </Sheet>
  );
}

/* ---- Booking detail modal ---- */
function BookingDetail({ booking, role, onClose, onStatusChange, onOpenAssign, saving }) {
  if (!booking) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-[var(--bg2)] rounded-t-3xl sm:rounded-3xl p-6 max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[var(--label3)] mb-1">Booking #{booking.id.slice(0, 6)}</p>
            <h3 className="text-[var(--label)] font-semibold text-xl">{booking.clientName}</h3>
          </div>
          <button onClick={onClose} className="text-[var(--label2)]"><X size={22} /></button>
        </div>

        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <StatusBadge status={booking.status} />
          <CategoryChip category={booking.service.category} />
          {booking.payment.isMember && <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full" style={{ color: v("--accent"), backgroundColor: tint("--accent", 16) }}><Crown size={11} /> Privé Member</span>}
        </div>

        <div className="space-y-4">
          <DetailRow icon={Sparkles} label="Service" value={booking.service.name} />
          <DetailRow icon={Calendar} label="Date & time" value={`${booking.date || "No date"}, ${booking.startTime || "—"}`} />
          <DetailRow icon={MapPin} label="Location" value={booking.location.address} />
          {role !== "artist" && <DetailRow icon={Phone} label="Phone" value={booking.clientPhone || "—"} />}
          {role !== "artist" && <DetailRow icon={Mail} label="Email" value={booking.clientEmail || "—"} />}
          {booking.skinType && <DetailRow icon={Sparkles} label="Skin type" value={booking.skinType} />}

          {(role === "admin" || role === "super_admin") && (
            <DetailRow icon={User} label="Assigned artist" value={booking.artistName} action={
              <button onClick={onOpenAssign} className="text-xs font-semibold" style={{ color: v("--accent") }}>Reassign</button>
            } />
          )}

          {role !== "artist" && (
            <div className="rounded-2xl p-4" style={{ backgroundColor: v("--bg3") }}>
              <p className="text-[11px] uppercase tracking-wider text-[var(--label3)] mb-2">Payment</p>
              <Row label="Booking fee" value={formatMoney(booking.payment.total)} valueColor={v("--accent")} />
              <p className="text-[11px] text-[var(--label3)] mt-1.5">Collected at appointment — no online payment on file.</p>
            </div>
          )}

          {booking.skinConcerns?.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[var(--label3)] mb-1.5">Skin concerns</p>
              <div className="flex flex-wrap gap-1.5">
                {booking.skinConcerns.map((c) => <span key={c} className="text-[11px] px-2 py-1 rounded-lg bg-[var(--bg3)] text-[var(--label2)]">{c}</span>)}
              </div>
            </div>
          )}

          {booking.notes && (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[var(--label3)] mb-1.5">Notes</p>
              <p className="text-sm text-[var(--label2)] leading-relaxed">{booking.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          {booking.status === "pending" && role !== "artist" && (
            <button disabled={saving} onClick={() => onStatusChange(booking.id, "confirmed")} className="flex-1 py-3 rounded-2xl font-semibold text-sm disabled:opacity-50" style={{ backgroundColor: v("--green"), color: "#fff" }}>
              {saving ? "Saving…" : "Confirm booking"}
            </button>
          )}
          {booking.status === "confirmed" && role === "artist" && (
            <button disabled={saving} onClick={() => onStatusChange(booking.id, "completed")} className="flex-1 py-3 rounded-2xl font-semibold text-sm disabled:opacity-50" style={{ backgroundColor: v("--blue"), color: "#fff" }}>
              {saving ? "Saving…" : "Mark completed"}
            </button>
          )}
          {booking.status !== "cancelled" && booking.status !== "completed" && role !== "artist" && (
            <button disabled={saving} onClick={() => onStatusChange(booking.id, "cancelled")} className="flex-1 py-3 rounded-2xl font-semibold text-sm border disabled:opacity-50" style={{ color: v("--red"), borderColor: v("--red") }}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, valueColor }) {
  return (
    <div className="flex justify-between text-sm mb-1.5 last:mb-0">
      <span className="text-[var(--label3)] font-medium">{label}</span>
      <span className={valueColor ? "font-bold" : "font-semibold"} style={{ color: valueColor || v("--label") }}>{value}</span>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, action }) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <IconAvatar icon={Icon} colorVar="--accent" size={32} />
        <div>
          <p className="text-[11px] text-[var(--label3)] font-medium uppercase tracking-wide">{label}</p>
          <p className="text-sm text-[var(--label)] font-semibold mt-0.5">{value}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* GRID TABLE                                                          */
/* ------------------------------------------------------------------ */

function BookingGridTable({ bookings, onOpen, sortKey, onSort }) {
  const cols = [
    { key: "date", label: "Date" }, { key: "clientName", label: "Client" },
    { key: "service", label: "Service" }, { key: "artistName", label: "Artist" },
    { key: "status", label: "Status" }, { key: "payment", label: "Fee" },
  ];
  return (
    <div className="overflow-x-auto rounded-3xl card-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border2)]">
            {cols.map((c) => (
              <th key={c.key} className="text-left px-4 py-3">
                <button onClick={() => onSort(c.key)} className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-[var(--label3)]">
                  {c.label}{sortKey === c.key && <ArrowUpDown size={11} style={{ color: v("--accent") }} />}
                </button>
              </th>
            ))}
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} onClick={() => onOpen(b.id)} className="border-b border-[var(--border2)] hover:bg-[var(--bg3)] cursor-pointer transition-colors last:border-0">
              <td className="px-4 py-3 text-[var(--label)] whitespace-nowrap">{b.date || "—"}<div className="text-[var(--label3)] text-xs">{b.startTime}</div></td>
              <td className="px-4 py-3 text-[var(--label)]">{b.clientName}</td>
              <td className="px-4 py-3 text-[var(--label2)]">{b.service.name}</td>
              <td className="px-4 py-3 text-[var(--label2)]">{b.artistName}</td>
              <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
              <td className="px-4 py-3"><span className="font-bold" style={{ color: v("--accent") }}>{formatMoney(b.payment.total)}</span></td>
              <td className="px-4 py-3"><ChevronRight size={16} className="text-[var(--label3)]" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* NAVIGATION                                                          */
/* ------------------------------------------------------------------ */

function Sidebar({ items, active, onChange, themeMode, toggleTheme, onLogout, roleLabel }) {
  return (
    <div className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-[var(--bg2)] border-r border-[var(--border)] px-4 py-6 z-40">
      <div className="mb-8 px-2 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: tint("--accent", 16) }}>
          <Scissors size={16} style={{ color: v("--accent") }} />
        </div>
        <div>
          <p className="text-[var(--label)] font-semibold text-[15px] leading-tight">Amour Estilo</p>
          <p className="text-[var(--label3)] text-[11px] capitalize">{roleLabel}</p>
        </div>
      </div>

      <div className="flex-1 space-y-1">
        {items.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className="w-full flex items-center gap-3 px-3.5 py-2.75 rounded-2xl text-sm font-medium transition-colors"
              style={isActive ? { backgroundColor: tint("--accent", 14), color: v("--accent") } : { color: v("--label2") }}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl p-4 mb-3" style={{ backgroundColor: tint("--accent", 10) }}>
        <p className="text-[var(--label)] text-sm font-semibold mb-0.5">Live from Firestore</p>
        <p className="text-[var(--label2)] text-xs leading-relaxed">Bookings sync directly from your website's booking form.</p>
      </div>

      <div className="space-y-1 pt-3 border-t border-[var(--border2)]">
        <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-[var(--label2)] hover:bg-[var(--bg3)]">
          {themeMode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {themeMode === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium" style={{ color: v("--red") }}>
          <LogOut size={18} /> Log out
        </button>
      </div>
    </div>
  );
}

function MobileTopBar({ themeMode, toggleTheme, title }) {
  return (
    <div className="md:hidden sticky top-0 z-30 bg-[var(--bg)]/90 backdrop-blur-md px-5 pt-6 pb-3 flex items-center justify-between">
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase" style={{ color: v("--accent") }}>Amour Estilo</p>
        <h1 className="text-lg font-semibold mt-0.5 text-[var(--label)]">{title}</h1>
      </div>
      <button onClick={toggleTheme} className="w-9 h-9 rounded-full card-surface flex items-center justify-center">
        {themeMode === "dark" ? <Sun size={15} style={{ color: v("--accent") }} /> : <Moon size={15} style={{ color: v("--accent") }} />}
      </button>
    </div>
  );
}

function MobileBottomNav({ items, active, onChange }) {
  const centerIdx = Math.floor(items.length / 2);
  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
      <div className="relative flex items-center justify-around rounded-full px-2 py-3 shadow-2xl" style={{ backgroundColor: v("--navBg") }}>
        {items.map((item, i) => {
          const isActive = active === item.key;
          if (i === centerIdx) {
            return (
              <button key={item.key} onClick={() => onChange(item.key)} className="relative -mt-8">
                <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4" style={{ backgroundColor: isActive ? v("--accent") : "var(--bg2)", borderColor: v("--navBg") }}>
                  <item.icon size={22} style={{ color: isActive ? "#fff" : v("--label") }} strokeWidth={2.2} />
                </div>
              </button>
            );
          }
          return (
            <button key={item.key} onClick={() => onChange(item.key)} className="flex flex-col items-center gap-1 px-3 py-1">
              <item.icon size={22} strokeWidth={isActive ? 2.4 : 1.8} style={{ color: isActive ? v("--navIconActive") : v("--navIcon") }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LOGIN — real Firebase Auth email/password                          */
/* ------------------------------------------------------------------ */

function LoginScreen({ onLogin, themeMode, toggleTheme, loading, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState("admin");

  const roles = [
    { key: "artist", label: "Artist", icon: User, cv: "--blue" },
    { key: "admin", label: "Admin", icon: Users, cv: "--purple" },
    { key: "super_admin", label: "Super Admin", icon: TrendingUp, cv: "--green" },
  ];

  function submit(e) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    onLogin(email.trim(), password, role);
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-6 relative py-10">
      <button onClick={toggleTheme} className="absolute top-6 right-6 w-10 h-10 rounded-full card-surface flex items-center justify-center">
        {themeMode === "dark" ? <Sun size={16} style={{ color: v("--accent") }} /> : <Moon size={16} style={{ color: v("--accent") }} />}
      </button>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: tint("--accent", 16) }}>
        <Scissors size={24} style={{ color: v("--accent") }} />
      </div>
      <p className="text-[11px] tracking-[0.3em] uppercase mb-2" style={{ color: v("--accent") }}>Amour Estilo</p>
      <h1 className="text-[var(--label)] text-2xl font-semibold mb-1">Studio Dashboard</h1>
      <p className="text-[var(--label3)] text-sm mb-8">Sign in with your staff account</p>

      <form onSubmit={submit} className="w-full max-w-sm space-y-3">
        {error && (
          <div className="flex items-start gap-2 rounded-2xl p-3 text-xs font-medium" style={{ backgroundColor: tint("--red", 14), color: v("--red") }}>
            <AlertCircle size={14} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        <div>
          <p className="text-[11px] uppercase tracking-wider text-[var(--label3)] mb-1.5 font-medium">Email</p>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@amourestilo.com" required
            className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-2xl px-4 py-3.5 text-sm text-[var(--label)] outline-none focus:border-[var(--accent)]" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-[var(--label3)] mb-1.5 font-medium">Password</p>
          <div className="relative">
            <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
              className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-2xl px-4 py-3.5 text-sm text-[var(--label)] outline-none focus:border-[var(--accent)] pr-11" />
            <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--label3)]">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-[var(--label3)] mb-2 font-medium mt-1">Sign in as</p>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <button type="button" key={r.key} onClick={() => setRole(r.key)}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-colors"
                style={role === r.key ? { borderColor: v(r.cv), backgroundColor: tint(r.cv, 12) } : { borderColor: v("--border"), backgroundColor: v("--bg2") }}>
                <r.icon size={16} style={{ color: role === r.key ? v(r.cv) : v("--label3") }} />
                <span className="text-[10px] font-semibold" style={{ color: role === r.key ? v(r.cv) : v("--label3") }}>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60" style={{ backgroundColor: v("--accent"), color: "#fff" }}>
          {loading && <RefreshCw size={15} className="spin" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE: BOOKINGS                                                     */
/* ------------------------------------------------------------------ */

function BookingsPage({ role, bookings, artists, onOpenBooking, loading, error, onRetry }) {
  const [tab, setTab] = useState(role === "artist" ? "upcoming" : "pending");
  const [view, setView] = useState("card");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ artistId: null, service: "All" });
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const currentArtistId = "a1";

  const tabs = role === "artist"
    ? [{ key: "upcoming", label: "Upcoming" }, { key: "completed", label: "Completed" }]
    : [{ key: "pending", label: "Pending" }, { key: "upcoming", label: "Upcoming" }, { key: "completed", label: "Completed" }, { key: "cancelled", label: "Cancelled" }];

  const filtered = useMemo(() => {
    let list = [...bookings];
    if (role === "artist") list = list.filter((b) => b.artistId === currentArtistId);
    if (tab === "pending") list = list.filter((b) => b.status === "pending");
    else if (tab === "upcoming") list = list.filter((b) => b.status === "confirmed" || b.status === "in_progress");
    else if (tab === "completed") list = list.filter((b) => b.status === "completed");
    else if (tab === "cancelled") list = list.filter((b) => b.status === "cancelled");
    if (filters.artistId) list = list.filter((b) => b.artistId === filters.artistId);
    if (filters.service !== "All") list = list.filter((b) => b.service.category === filters.service);
    list.sort((a, b) => {
      let av, bv;
      if (sortKey === "date") { av = a.createdAt || ""; bv = b.createdAt || ""; }
      else if (sortKey === "service") { av = a.service.name; bv = b.service.name; }
      else { av = a[sortKey]; bv = b[sortKey]; }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [role, tab, filters, sortKey, sortDir, bookings]);

  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  if (loading) {
    return <div className="flex flex-col items-center justify-center py-20 text-[var(--label3)]"><RefreshCw size={22} className="spin mb-3" style={{ color: v("--accent") }} /> Loading bookings from Firestore…</div>;
  }
  if (error) {
    return (
      <div className="card-surface rounded-3xl p-6 text-center">
        <AlertCircle size={20} style={{ color: v("--red") }} className="mx-auto mb-2" />
        <p className="text-[var(--label)] font-semibold text-sm mb-1">Couldn't load bookings</p>
        <p className="text-[var(--label3)] text-xs mb-4">{error}</p>
        <button onClick={onRetry} className="px-4 py-2 rounded-xl text-xs font-semibold" style={{ backgroundColor: v("--accent"), color: "#fff" }}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4"><SegmentedTabs tabs={tabs} active={tab} onChange={setTab} /></div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setFilterOpen(true)} className="flex items-center gap-1.5 text-xs font-medium text-[var(--label2)] px-3 py-2 rounded-xl card-surface">
          <SlidersHorizontal size={13} /> Filter
        </button>
        {role !== "artist" && (
          <div className="flex items-center gap-2">
            <button onClick={() => handleSort("date")} className="flex items-center gap-1.5 text-xs font-medium text-[var(--label2)] px-3 py-2 rounded-xl card-surface">
              <ArrowUpDown size={13} /> Sort
            </button>
            <div className="flex bg-[var(--bg4)] rounded-xl p-0.5">
              <button onClick={() => setView("card")} className="p-2 rounded-lg" style={view === "card" ? { backgroundColor: v("--pillBg"), color: v("--pillText") } : { color: v("--label3") }}><LayoutGrid size={14} /></button>
              <button onClick={() => setView("grid")} className="p-2 rounded-lg" style={view === "grid" ? { backgroundColor: v("--pillBg"), color: v("--pillText") } : { color: v("--label3") }}><ListIcon size={14} /></button>
            </div>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 card-surface rounded-3xl">
          <p className="text-[var(--label)] font-medium mb-1">No bookings here yet</p>
          <p className="text-[var(--label3)] text-sm">New {tab} bookings will show up in this tab.</p>
        </div>
      ) : view === "grid" && role !== "artist" ? (
        <BookingGridTable bookings={filtered} onOpen={onOpenBooking} sortKey={sortKey} onSort={handleSort} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((b) => <BookingCard key={b.id} booking={b} role={role} onOpen={onOpenBooking} />)}
        </div>
      )}

      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} setFilters={setFilters} showArtistFilter={role !== "artist"} artists={artists} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE: OVERVIEW / ANALYTICS                                          */
/* ------------------------------------------------------------------ */

function OverviewPage({ bookings, artists }) {
  const totalRevenue = bookings.reduce((s, b) => s + (b.payment.total || 0), 0);
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const avgBookingValue = bookings.length ? Math.round(totalRevenue / bookings.length) : 0;
  const pendingList = bookings.filter((b) => b.status === "pending").slice(0, 3);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <StatTile icon={DollarSign} label="Booked value" value={formatMoney(totalRevenue)} cv="--green" />
        <StatTile icon={AlertCircle} label="Pending" value={pendingCount} cv="--orange" />
        <StatTile icon={TrendingUp} label="Avg. booking" value={formatMoney(avgBookingValue)} cv="--blue" />
      </div>

      <RevenueChartCard />

      {pendingList.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-wider text-[var(--label3)] mb-3">Needs your attention</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {pendingList.map((b) => <BookingCard key={b.id} booking={b} role="super_admin" onOpen={() => {}} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function RevenueChartCard() {
  return (
    <div className="card-surface rounded-3xl p-4">
      <p className="text-[11px] uppercase tracking-wider text-[var(--label3)] mb-3">Revenue trend & prediction <span className="opacity-60">(sample)</span></p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={REVENUE_TREND}>
          <CartesianGrid stroke="var(--border2)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "var(--label3)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip contentStyle={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12, color: "var(--label)" }} />
          <Line type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--accent)" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function AnalyticsPage({ artists, bookings }) {
  const byCategory = SPECIALTY_OPTIONS.map((cat) => ({ cat, count: bookings.filter((b) => b.service.category === cat).length })).filter((c) => c.count > 0);
  const total = bookings.length || 1;

  return (
    <div className="space-y-5">
      <RevenueChartCard />
      <div className="card-surface rounded-3xl p-4">
        <p className="text-[11px] uppercase tracking-wider text-[var(--label3)] mb-3">Artist performance <span className="opacity-60">(sample)</span></p>
        <div className="space-y-3">
          {artists.map((a) => (
            <div key={a.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-full bg-[var(--bg3)] flex items-center justify-center text-[10px] font-semibold">{initials(a.name)}</span>
                <div>
                  <p className="text-sm font-medium text-[var(--label)]">{a.name}</p>
                  <p className="text-[11px] text-[var(--label3)] flex items-center gap-1"><Star size={10} fill="var(--yellow)" color="var(--yellow)" /> {a.rating} · {a.bookingsThisMonth} bookings</p>
                </div>
              </div>
              <p className="text-sm font-bold" style={{ color: v("--green") }}>{formatMoney(a.revenueGenerated)}</p>
            </div>
          ))}
        </div>
      </div>
      {byCategory.length > 0 && (
        <div className="card-surface rounded-3xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-[var(--label3)] mb-3">Bookings by service</p>
          <div className="space-y-2.5">
            {byCategory.map((c) => (
              <div key={c.cat} className="flex items-center gap-3">
                <CategoryChip category={c.cat} />
                <div className="flex-1 h-2 rounded-full bg-[var(--bg3)] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(c.count / total) * 100}%`, backgroundColor: v(CATEGORY_VAR[c.cat]) }} />
                </div>
                <span className="text-xs text-[var(--label2)] w-5 text-right">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE: TEAM                                                          */
/* ------------------------------------------------------------------ */

function TeamPage({ artists, onAddClick }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] uppercase tracking-wider text-[var(--label3)]">{artists.length} team members</p>
        <button onClick={onAddClick} className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl" style={{ backgroundColor: v("--accent"), color: "#fff" }}>
          <Plus size={14} /> Add artist
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {artists.map((a) => (
          <div key={a.id} className="flex items-center gap-3 p-4 rounded-3xl card-surface">
            <span className="w-11 h-11 rounded-full bg-[var(--bg3)] flex items-center justify-center text-[12px] font-semibold text-[var(--label)]">{initials(a.name)}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--label)]">{a.name}</p>
              <p className="text-[11px] text-[var(--label3)] flex items-center gap-1 mt-0.5"><Star size={10} fill="var(--yellow)" color="var(--yellow)" /> {a.rating} · {a.bookingsThisMonth} bookings this month</p>
              <div className="flex gap-1 mt-1.5 flex-wrap">{a.specialties.map((s) => <CategoryChip key={s} category={s} />)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE: PROFILE                                                      */
/* ------------------------------------------------------------------ */

function ProfilePage({ role, email, onLogout, themeMode, toggleTheme }) {
  const roleLabels = { artist: "Artist", admin: "Studio Admin", super_admin: "Super Admin — Owner" };
  return (
    <div className="max-w-sm">
      <div className="card-surface rounded-3xl p-5 mb-4 text-center">
        <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-semibold" style={{ backgroundColor: tint("--accent", 16), color: v("--accent") }}>
          {initials(email)}
        </div>
        <p className="text-[var(--label)] font-semibold">{roleLabels[role]}</p>
        <p className="text-[var(--label3)] text-xs mt-0.5">{email}</p>
      </div>
      <button onClick={toggleTheme} className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl card-surface mb-2">
        <span className="flex items-center gap-3 text-sm text-[var(--label)]">{themeMode === "dark" ? <Sun size={17} /> : <Moon size={17} />} Appearance</span>
        <span className="text-xs text-[var(--label3)] capitalize">{themeMode} mode</span>
      </button>
      <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border" style={{ color: v("--red"), borderColor: v("--red") }}>
        <LogOut size={17} /> Log out
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN APP                                                            */
/* ------------------------------------------------------------------ */

export default function AmourEstiloDashboard() {
  const [themeMode, setThemeMode] = useState("light");
  const [role, setRole] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [idToken, setIdToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [section, setSection] = useState("bookings");
  const [addArtistOpen, setAddArtistOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [artists, setArtists] = useState(INITIAL_ARTISTS);

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleTheme = () => setThemeMode((m) => (m === "dark" ? "light" : "dark"));
  const selected = bookings.find((b) => b.id === selectedId) || null;

  const loadBookings = useCallback(async (token) => {
    setBookingsLoading(true); setBookingsError("");
    try {
      const docs = await fetchBookings(token);
      setBookings(docs.map(mapBookingDoc));
    } catch (err) {
      setBookingsError(err.message);
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  async function handleLogin(email, password, chosenRole) {
    setAuthLoading(true); setAuthError("");
    try {
      const auth = await signInWithEmail(email, password);
      setIdToken(auth.idToken);
      setAuthEmail(auth.email || email);
      setRole(chosenRole);
      setSection(chosenRole === "super_admin" ? "home" : "bookings");
      await loadBookings(auth.idToken);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    setIdToken(null); setRole(null); setBookings([]); setAuthEmail(""); setAuthError("");
  }

  async function handleStatusChange(id, newStatus) {
    setSaving(true);
    setBookings((cur) => cur.map((b) => (b.id === id ? { ...b, status: newStatus } : b))); // optimistic
    try {
      await patchBooking(id, { status: newStatus }, idToken);
    } catch (err) {
      setBookingsError(`Update failed: ${err.message}`);
      loadBookings(idToken); // reconcile with server on failure
    } finally {
      setSaving(false);
    }
  }

  async function handleAssign(artistId) {
    const artist = artists.find((a) => a.id === artistId);
    if (!artist || !selected) return;
    setSaving(true);
    setBookings((cur) => cur.map((b) => (b.id === selected.id ? { ...b, artistId: artist.id, artistName: artist.name } : b)));
    try {
      await patchBooking(selected.id, { artistId: artist.id, artistName: artist.name }, idToken);
    } catch (err) {
      setBookingsError(`Assignment failed: ${err.message}`);
      loadBookings(idToken);
    } finally {
      setSaving(false);
    }
  }

  function handleAddArtist(newArtist) { setArtists((cur) => [...cur, newArtist]); }

  if (!role || !idToken) {
    return (
      <div className={`theme-${themeMode}`}>
        <style>{THEME_CSS}</style>
        <LoginScreen onLogin={handleLogin} themeMode={themeMode} toggleTheme={toggleTheme} loading={authLoading} error={authError} />
      </div>
    );
  }

  const navItems = NAV_ITEMS.filter((i) => i.roles.includes(role));
  const pageTitle = navItems.find((i) => i.key === section)?.label || "Dashboard";
  const roleLabels = { artist: "Artist", admin: "Admin", super_admin: "Super Admin" };

  return (
    <div className={`theme-${themeMode} min-h-screen bg-[var(--bg)] text-[var(--label)]`} style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}>
      <style>{THEME_CSS}</style>

      <Sidebar items={navItems} active={section} onChange={setSection} themeMode={themeMode} toggleTheme={toggleTheme} onLogout={handleLogout} roleLabel={roleLabels[role]} />
      <MobileTopBar themeMode={themeMode} toggleTheme={toggleTheme} title={pageTitle} />

      <div className="md:pl-64 pb-28 md:pb-10">
        <div className="px-5 md:px-8 pt-4 md:pt-8 max-w-5xl">
          <div className="hidden md:flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">{pageTitle}</h2>
            <button onClick={() => loadBookings(idToken)} className="flex items-center gap-1.5 text-xs font-medium text-[var(--label2)] px-3 py-2 rounded-xl card-surface">
              <RefreshCw size={13} className={bookingsLoading ? "spin" : ""} /> Refresh
            </button>
          </div>

          {section === "home" && <OverviewPage bookings={bookings} artists={artists} />}
          {section === "bookings" && <BookingsPage role={role} bookings={bookings} artists={artists} onOpenBooking={setSelectedId} loading={bookingsLoading} error={bookingsError} onRetry={() => loadBookings(idToken)} />}
          {section === "team" && <TeamPage artists={artists} onAddClick={() => setAddArtistOpen(true)} />}
          {section === "analytics" && <AnalyticsPage artists={artists} bookings={bookings} />}
          {section === "profile" && <ProfilePage role={role} email={authEmail} onLogout={handleLogout} themeMode={themeMode} toggleTheme={toggleTheme} />}
        </div>
      </div>

      <MobileBottomNav items={navItems} active={section} onChange={setSection} />

      <AddArtistSheet open={addArtistOpen} onClose={() => setAddArtistOpen(false)} onAdd={handleAddArtist} />
      <AssignArtistSheet open={assignOpen} onClose={() => setAssignOpen(false)} artists={artists} currentArtistId={selected?.artistId} onAssign={handleAssign} />
      <BookingDetail booking={selected} role={role} onClose={() => setSelectedId(null)} onStatusChange={handleStatusChange} onOpenAssign={() => setAssignOpen(true)} saving={saving} />
    </div>
  );
}

function StatTile({ icon: Icon, label, value, cv }) {
  return (
    <div className="card-surface rounded-3xl p-3.5">
      <IconAvatar icon={Icon} colorVar={cv} size={32} />
      <p className="text-[10px] text-[var(--label3)] mt-2 uppercase tracking-wider font-medium">{label}</p>
      <p className="text-base font-bold mt-0.5" style={{ color: v(cv) }}>{value}</p>
    </div>
  );
}
