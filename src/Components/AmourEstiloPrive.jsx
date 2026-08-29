import React, { useEffect, useRef, useState } from "react";

/**
 * Amour Estilo Privé — Membership
 *
 * 3 full-height pages, scroll-snapped:
 *   1. About the membership
 *   2. Benefits (numbered, priority order)
 *   3. Join (fee waived, limited period) -> opens a join dialog
 *
 * Join dialog collects name / email / phone / payment method, then
 * saves the signup to shared storage so it shows up on the built-in
 * "Sign-ups" dashboard (linked at the bottom of the Join page).
 *
 * NOTE ON PAYMENT: this is a front-end demo with no payment gateway
 * wired up. To keep this safe, the form only ever stores the last 4
 * digits of the card (never the full number/CVV) — enough to show a
 * record on the dashboard, not enough to be sensitive data. A real
 * launch would swap this for Razorpay/Stripe and never touch raw
 * card numbers in the browser at all.
 */

const GOLD = "#EDC967";
const GOLD_DIM = "#a4884a";
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'Inter', -apple-system, sans-serif";

// In-memory fallback so the flow always works even if window.storage
// is missing or flaky. Writes go to memory immediately (guaranteed to
// succeed for the current session) and to persistent storage as a
// best-effort extra — a persistence hiccup never blocks someone from
// joining. Reads merge both sources.
const memoryDB = {};

async function storageSet(key, value) {
  memoryDB[key] = value;
  if (typeof window !== "undefined" && window.storage) {
    try {
      await window.storage.set(key, value, true);
    } catch (err) {
      console.error("Persistent storage write failed, kept in-memory copy:", err);
    }
  }
  return { key, value };
}

async function storageList(prefix) {
  const keys = new Set(Object.keys(memoryDB).filter((k) => k.startsWith(prefix)));
  if (typeof window !== "undefined" && window.storage) {
    try {
      const res = await window.storage.list(prefix, true);
      (res?.keys || []).forEach((k) => keys.add(k));
    } catch (err) {
      console.error("Persistent storage list failed, showing in-memory data:", err);
    }
  }
  return { keys: Array.from(keys) };
}

async function storageGet(key) {
  if (typeof window !== "undefined" && window.storage) {
    try {
      const res = await window.storage.get(key, true);
      if (res) return res;
    } catch (err) {
      // fall through to memory
    }
  }
  if (key in memoryDB) return { key, value: memoryDB[key] };
  return null;
}

const BENEFITS = [
  {
    n: "01",
    title: "Priority Bookings",
    copy: "Wedding season fills fast. Members skip the wait and hold their date with the studio first.",
  },
  {
    n: "02",
    title: "50% Off Your First Order",
    copy: "Up to ₹5,000 off, applied the moment you make your first booking as a Privé member.",
  },
  {
    n: "03",
    title: "Birthday Month Discount",
    copy: "An exclusive rate reserved just for you, valid through your birthday month, every year.",
  },
  {
    n: "04",
    title: "Complimentary Cleanup Kit",
    copy: "A full at-home cleanup kit, on us — sent to every member as part of the circle.",
  },
  {
    n: "05",
    title: "Exclusive Access to Events",
    copy: "Trunk shows and studio evenings are announced to Privé members first, with a seat always held.",
  },
];

function useInView(ref, threshold = 0.35) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

const inputStyle = {
  fontFamily: SANS,
  fontSize: 14,
  color: "#f2f2f2",
  background: "#161616",
  border: "1px solid #2c2c2c",
  borderRadius: 10,
  padding: "12px 14px",
  width: "100%",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  fontFamily: SANS,
  fontSize: 11,
  letterSpacing: "0.12em",
  color: "#8a8a8a",
  display: "block",
  marginBottom: 6,
};

function formatCard(value) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function Barcode({ value }) {
  // Deterministic pseudo-barcode generated from the member ID —
  // visual only, not a scannable real barcode.
  const bars = [];
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    bars.push(1 + (code % 4));
  }
  const gap = 2;
  let x = 0;
  const segments = bars.map((w, i) => {
    const rectX = x;
    x += w + gap;
    return { x: rectX, w };
  });
  const totalWidth = x;

  return (
    <svg
      width="100%"
      height="26"
      viewBox={`0 0 ${totalWidth} 26`}
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      {segments.map((s, i) => (
        <rect key={i} x={s.x} y={0} width={s.w} height={26} fill="#171208" />
      ))}
    </svg>
  );
}

function MembershipCardPreview({ name, memberNo, joinedAt }) {
  const since = joinedAt
    ? new Date(joinedAt).toLocaleDateString("en-IN", { month: "2-digit", year: "numeric" })
    : "";
  const INK = "#2b2007";
  const id = memberNo || "AE-000000";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 340,
        aspectRatio: "1.45 / 1",
        margin: "0 auto",
        borderRadius: 14,
        position: "relative",
        overflow: "hidden",
        background: GOLD,
        boxShadow: "0 20px 45px -18px rgba(237,201,103,0.45)",
      }}
    >
      {/* metallic sheen, kept within the gold family */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.35) 48%, rgba(255,255,255,0) 66%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(120deg, rgba(43,32,7,0.05) 0px, rgba(43,32,7,0.05) 1px, transparent 1px, transparent 6px)",
        }}
      />

      <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "16px 20px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.25em", color: INK, fontWeight: 600 }}>
            AMOUR ESTILO
          </span>
          <span style={{ fontFamily: SANS, fontSize: 9, letterSpacing: "0.2em", color: "rgba(43,32,7,0.65)" }}>
            MEMBER SINCE {since}
          </span>
        </div>

        <div style={{ textAlign: "center" }}>
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 30, color: INK, letterSpacing: "0.02em" }}>
            Privé
          </span>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
            <div>
              <p style={{ fontFamily: SANS, fontSize: 8, letterSpacing: "0.18em", color: "rgba(43,32,7,0.6)", marginBottom: 2 }}>
                FULL NAME
              </p>
              <p style={{ fontFamily: SANS, fontSize: 13, letterSpacing: "0.05em", color: INK, fontWeight: 600 }}>
                {(name || "MEMBER").toUpperCase()}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: SANS, fontSize: 8, letterSpacing: "0.18em", color: "rgba(43,32,7,0.6)", marginBottom: 2 }}>
                MEMBER ID
              </p>
              <p style={{ fontFamily: SANS, fontSize: 13, letterSpacing: "0.05em", color: INK, fontWeight: 600 }}>
                {id}
              </p>
            </div>
          </div>

          <div
            style={{
              background: "#f4ecd8",
              borderRadius: 6,
              padding: "8px 10px 6px",
            }}
          >
            <Barcode value={id} />
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: "0.25em",
                color: "#171208",
                textAlign: "center",
                marginTop: 4,
              }}
            >
              {id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function JoinDialog({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    card: "",
    expiry: "",
    cvv: "",
  });
  const [addPayment, setAddPayment] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | saving | done | error
  const [record, setRecord] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid phone number";
    if (!form.gender) e.gender = "Required";
    if (!form.dob) e.dob = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (addPayment) {
      if (form.card.replace(/\D/g, "").length < 12) e.card = "Enter a valid card number";
      if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = "MM/YY";
      if (!/^\d{3,4}$/.test(form.cvv)) e.cvv = "3-4 digits";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("saving");
    try {
      const id = `member_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const memberNo = `AE-${Math.floor(100000 + Math.random() * 900000)}`;
      const newRecord = {
        id,
        memberNo,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        gender: form.gender,
        dob: form.dob,
        address: form.address.trim(),
        paymentAdded: addPayment,
        cardLast4: addPayment ? form.card.replace(/\D/g, "").slice(-4) : null,
        joinedAt: new Date().toISOString(),
      };
      const result = await storageSet(`members:${id}`, JSON.stringify(newRecord));
      if (!result) throw new Error("Storage write failed");
      setRecord(newRecord);
      setStatus("done");
    } catch (err) {
      console.error("Join signup error:", err);
      setStatus("error");
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.78)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 440,
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#0a0a0a",
          border: `1px solid ${GOLD_DIM}`,
          borderRadius: 16,
          padding: "32px 28px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            color: "#8a8a8a",
            fontSize: 20,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {status === "done" ? (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.3em", color: GOLD }}>
              WELCOME
            </p>
            <h3
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: 30,
                color: "#f2f2f2",
                marginTop: 10,
                marginBottom: 6,
              }}
            >
              Congratulations!
            </h3>
            <p style={{ fontFamily: SANS, fontSize: 14, color: "#8f8f8f", marginBottom: 26 }}>
              You're now an Amour Estilo Privé member.
            </p>

            <MembershipCardPreview name={record?.name} memberNo={record?.memberNo} joinedAt={record?.joinedAt} />

            <button
              onClick={onClose}
              style={{
                marginTop: 28,
                fontFamily: SANS,
                fontSize: 13,
                letterSpacing: "0.06em",
                padding: "12px 32px",
                borderRadius: 9999,
                border: "none",
                cursor: "pointer",
                color: "#0a0a08",
                background: GOLD,
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.3em", color: GOLD }}>
              JOIN PRIVÉ
            </p>
            <h3
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: 30,
                color: "#f2f2f2",
                marginTop: 8,
                marginBottom: 24,
              }}
            >
              Complete your membership
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>FULL NAME</label>
                <input
                  style={inputStyle}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Meera Iyer"
                />
                {errors.name && <ErrorText text={errors.name} />}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>EMAIL</label>
                <input
                  type="email"
                  style={inputStyle}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@email.com"
                />
                {errors.email && <ErrorText text={errors.email} />}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>PHONE</label>
                <input
                  type="tel"
                  style={inputStyle}
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <ErrorText text={errors.phone} />}
              </div>

              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>GENDER</label>
                  <select
                    style={{ ...inputStyle, appearance: "none" }}
                    value={form.gender}
                    onChange={(e) => update("gender", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {errors.gender && <ErrorText text={errors.gender} />}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>DATE OF BIRTH</label>
                  <input
                    type="date"
                    style={{ ...inputStyle, colorScheme: "dark" }}
                    value={form.dob}
                    onChange={(e) => update("dob", e.target.value)}
                  />
                  {errors.dob && <ErrorText text={errors.dob} />}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>ADDRESS</label>
                <textarea
                  style={{ ...inputStyle, resize: "none", minHeight: 64, fontFamily: SANS }}
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Flat / Street / City / Pincode"
                />
                {errors.address && <ErrorText text={errors.address} />}
              </div>

              <div
                style={{
                  borderTop: "1px solid #232323",
                  paddingTop: 18,
                  marginBottom: 6,
                }}
              >
                <button
                  type="button"
                  onClick={() => setAddPayment((v) => !v)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      border: `1px solid ${addPayment ? GOLD : "#4a4a4a"}`,
                      background: addPayment ? GOLD : "transparent",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontFamily: SANS, fontSize: 13, color: "#c9c9c9" }}>
                    Add a payment method{" "}
                    <span style={{ color: "#6b6b6b" }}>(optional)</span>
                  </span>
                </button>
                <p style={{ fontFamily: SANS, fontSize: 12, color: "#6b6b6b", marginTop: 8, lineHeight: 1.6 }}>
                  Membership is free right now. Saving a card just means
                  you're set up in advance for whenever the ₹5,000 fee
                  applies again — via Razorpay, UPI, or your preferred
                  method. Fully optional.
                </p>

                {addPayment && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>CARD NUMBER</label>
                      <input
                        style={inputStyle}
                        value={form.card}
                        onChange={(e) => update("card", formatCard(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        inputMode="numeric"
                      />
                      {errors.card && <ErrorText text={errors.card} />}
                    </div>

                    <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>EXPIRY</label>
                        <input
                          style={inputStyle}
                          value={form.expiry}
                          onChange={(e) => update("expiry", formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          inputMode="numeric"
                        />
                        {errors.expiry && <ErrorText text={errors.expiry} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>CVV</label>
                        <input
                          style={inputStyle}
                          value={form.cvv}
                          onChange={(e) => update("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                          placeholder="123"
                          inputMode="numeric"
                        />
                        {errors.cvv && <ErrorText text={errors.cvv} />}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {status === "error" && (
                <p style={{ fontFamily: SANS, fontSize: 12, color: "#e07a6b", marginTop: 8 }}>
                  Something went wrong saving your membership. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "saving"}
                style={{
                  marginTop: 22,
                  width: "100%",
                  fontFamily: SANS,
                  fontSize: 14,
                  letterSpacing: "0.08em",
                  padding: "15px",
                  borderRadius: 9999,
                  border: "none",
                  cursor: status === "saving" ? "default" : "pointer",
                  color: "#0a0a08",
                  background: GOLD,
                  opacity: status === "saving" ? 0.6 : 1,
                }}
              >
                {status === "saving" ? "Joining…" : "Join Privé"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function ErrorText({ text }) {
  return (
    <p style={{ fontFamily: SANS, fontSize: 11, color: "#e07a6b", marginTop: 5 }}>{text}</p>
  );
}

function Dashboard({ onBack }) {
  const [members, setMembers] = useState(null); // null = loading
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const list = await storageList("members:");
        const keys = list?.keys || [];
        const records = [];
        for (const k of keys) {
          try {
            const res = await storageGet(k);
            if (res?.value) records.push(JSON.parse(res.value));
          } catch (_) {
            // skip unreadable entries
          }
        }
        records.sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));
        if (!cancelled) setMembers(records);
      } catch (err) {
        console.error("Dashboard load error:", err);
        if (!cancelled) setError(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        padding: "48px 24px",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <button
          onClick={onBack}
          style={{
            fontFamily: SANS,
            fontSize: 12,
            letterSpacing: "0.1em",
            color: "#8a8a8a",
            background: "none",
            border: "none",
            cursor: "pointer",
            marginBottom: 32,
          }}
        >
          ← Back
        </button>

        <p style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.3em", color: GOLD }}>
          ADMIN
        </p>
        <h2
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 36,
            color: "#f2f2f2",
            marginTop: 8,
            marginBottom: 32,
          }}
        >
          Privé Sign-ups
        </h2>

        {error && (
          <p style={{ fontFamily: SANS, fontSize: 13, color: "#e07a6b" }}>
            Couldn't load sign-ups right now.
          </p>
        )}

        {members === null && !error && (
          <p style={{ fontFamily: SANS, fontSize: 13, color: "#8a8a8a" }}>Loading…</p>
        )}

        {members && members.length === 0 && (
          <p style={{ fontFamily: SANS, fontSize: 13, color: "#8a8a8a" }}>
            No sign-ups yet — they'll appear here as members join.
          </p>
        )}

        {members && members.length > 0 && (
          <div style={{ border: "1px solid #1e1e1e", borderRadius: 12, overflow: "hidden" }}>
            {members.map((m, i) => (
              <div
                key={m.id}
                style={{
                  padding: "16px 18px",
                  borderTop: i === 0 ? "none" : "1px solid #1e1e1e",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontFamily: SANS, fontSize: 14, color: "#f2f2f2", fontWeight: 600 }}>
                    {m.name} <span style={{ color: GOLD_DIM, fontWeight: 400 }}>· {m.memberNo}</span>
                  </span>
                  <span style={{ fontFamily: SANS, fontSize: 12, color: m.paymentAdded ? GOLD_DIM : "#4a4a4a" }}>
                    {m.paymentAdded ? `•••• ${m.cardLast4}` : "No payment on file"}
                  </span>
                </div>
                <p style={{ fontFamily: SANS, fontSize: 12, color: "#a8a8a8", marginTop: 6 }}>
                  {m.email} · {m.phone}
                </p>
                <p style={{ fontFamily: SANS, fontSize: 12, color: "#6b6b6b", marginTop: 4 }}>
                  {m.gender} · DOB {m.dob} · {m.address}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("landing"); // landing | dashboard
  const [showJoin, setShowJoin] = useState(false);

  const containerRef = useRef(null);
  const page1Ref = useRef(null);
  const page2Ref = useRef(null);
  const page3Ref = useRef(null);
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || view !== "landing") return;
    function onScroll() {
      const h = el.clientHeight;
      setActivePage(Math.round(el.scrollTop / h));
    }
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [view]);

  function goToPage(i) {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: i * el.clientHeight, behavior: "smooth" });
  }

  const aboutInView = useInView(page1Ref, 0.4);
  const benefitsInView = useInView(page2Ref, 0.25);
  const joinInView = useInView(page3Ref, 0.4);

  if (view === "dashboard") {
    return (
      <>
        <GlobalFont />
        <Dashboard onBack={() => setView("landing")} />
      </>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        width: "100%",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        background: "#000000",
      }}
    >
      <GlobalFont />

      {/* page indicator */}
      <div
        style={{
          position: "fixed",
          right: 28,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          zIndex: 10,
        }}
      >
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => goToPage(i)}
            aria-label={`Go to page ${i + 1}`}
            style={{
              width: 7,
              height: 7,
              borderRadius: "9999px",
              border: `1px solid ${activePage === i ? GOLD : "#4a4a4a"}`,
              background: activePage === i ? GOLD : "transparent",
              cursor: "pointer",
              padding: 0,
              transition: "background 300ms ease, border-color 300ms ease",
            }}
          />
        ))}
      </div>

      {/* PAGE 1 — ABOUT */}
      <section
        ref={page1Ref}
        style={{
          height: "100vh",
          scrollSnapAlign: "start",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: 620,
            opacity: aboutInView ? 1 : 0,
            transform: aboutInView ? "translateY(0px)" : "translateY(24px)",
            transition: "opacity 900ms ease, transform 900ms ease",
          }}
        >
          <p style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.4em", color: "#7a7a7a" }}>
            MEMBERSHIP
          </p>
          <h1
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: "clamp(44px, 8vw, 84px)",
              marginTop: 20,
              lineHeight: 1.05,
              color: GOLD,
            }}
          >
            Amour Estilo Privé
          </h1>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 16,
              color: "#a8a8a8",
              marginTop: 28,
              lineHeight: 1.8,
            }}
          >
            An inner circle for Amour Estilo's most valued clients. Not a
            card, not a login — a standing relationship with the studio,
            where your history, your preferences, and your next look are
            already known before you walk in.
          </p>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 13,
              letterSpacing: "0.1em",
              color: "#6b6b6b",
              marginTop: 40,
            }}
          >
            SCROLL TO EXPLORE
          </p>
        </div>
      </section>

      {/* PAGE 2 — BENEFITS */}
      <section
        ref={page2Ref}
        style={{
          height: "100vh",
          scrollSnapAlign: "start",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 680, width: "100%" }}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 12,
              letterSpacing: "0.4em",
              color: "#7a7a7a",
              textAlign: "center",
              marginBottom: 12,
              opacity: benefitsInView ? 1 : 0,
              transition: "opacity 700ms ease",
            }}
          >
            MEMBERSHIP BENEFITS
          </p>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: "clamp(32px, 5vw, 52px)",
              color: GOLD,
              textAlign: "center",
              marginBottom: 48,
              opacity: benefitsInView ? 1 : 0,
              transition: "opacity 700ms ease",
            }}
          >
            What Privé Unlocks
          </h2>

          <div>
            {BENEFITS.map((b, i) => (
              <div
                key={b.n}
                style={{
                  display: "flex",
                  gap: 28,
                  alignItems: "flex-start",
                  padding: "20px 0",
                  borderTop: "1px solid #1e1e1e",
                  opacity: benefitsInView ? 1 : 0,
                  transform: benefitsInView ? "translateX(0px)" : "translateX(-20px)",
                  transition: `opacity 600ms ease ${i * 110}ms, transform 600ms ease ${i * 110}ms`,
                }}
              >
                <span
                  style={{
                    fontFamily: SERIF,
                    fontSize: 26,
                    color: GOLD_DIM,
                    minWidth: 44,
                  }}
                >
                  {b.n}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: SANS,
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#f2f2f2",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {b.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: 14,
                      color: "#8f8f8f",
                      marginTop: 6,
                      lineHeight: 1.65,
                      maxWidth: 480,
                    }}
                  >
                    {b.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAGE 3 — JOIN */}
      <section
        ref={page3Ref}
        style={{
          height: "100vh",
          scrollSnapAlign: "start",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            opacity: joinInView ? 1 : 0,
            transform: joinInView ? "translateY(0px)" : "translateY(24px)",
            transition: "opacity 900ms ease, transform 900ms ease",
          }}
        >
          <p style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.35em", color: GOLD }}>
            LIMITED PERIOD OFFER
          </p>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: "clamp(36px, 6vw, 60px)",
              color: GOLD,
              marginTop: 18,
            }}
          >
            Join Privé
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 16,
              marginTop: 32,
            }}
          >
            <span
              style={{
                fontFamily: SANS,
                fontSize: 24,
                color: "#6b6b6b",
                textDecoration: "line-through",
                textDecorationColor: "#6b6b6b",
              }}
            >
              ₹5,000
            </span>
            <span
              style={{
                fontFamily: SERIF,
                fontSize: 56,
                color: "#f2f2f2",
              }}
            >
              ₹0
            </span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 13, color: "#7a7a7a", marginTop: 10 }}>
            Membership fee waived — limited period offer
          </p>

          <button
            onClick={() => setShowJoin(true)}
            style={{
              marginTop: 44,
              fontFamily: SANS,
              fontSize: 14,
              letterSpacing: "0.08em",
              padding: "16px 44px",
              borderRadius: 9999,
              border: "none",
              cursor: "pointer",
              color: "#0a0a08",
              background: GOLD,
            }}
          >
            Join Privé
          </button>

          <p
            style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "#4a4a4a",
              marginTop: 64,
            }}
          >
            AMOUR ESTILO · BENGALURU
          </p>

          <button
            onClick={() => setView("dashboard")}
            style={{
              display: "block",
              margin: "18px auto 0",
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "#4a4a4a",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            View sign-ups (admin)
          </button>
        </div>
      </section>

      {showJoin && <JoinDialog onClose={() => setShowJoin(false)} />}
    </div>
  );
}

function GlobalFont() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Inter:wght@400;500;600&display=swap');
      ::-webkit-scrollbar { display: none; }
    `}</style>
  );
}
