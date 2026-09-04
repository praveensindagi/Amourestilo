/**
 * AmourAppointmentBooking.jsx
 * ─────────────────────────────────────────────────────────────────────
 * Luxury appointment booking — Amour Estilo · On-Demand Home Service
 *
 * v5:
 *  - Payment step removed. "Confirm Booking" now saves the booking to
 *    Firestore directly and shows the confirmation dialog — no payment
 *    method picker, no dummy processing delay.
 *  - Booking fee / membership discount is still shown as informational
 *    pricing (e.g. "collected at appointment"), but nothing is charged
 *    in-app.
 *
 * REQUIRED:
 *   npm install @emailjs/browser react-phone-number-input react-datepicker
 *
 * ENTRY FILE (index.js / main.jsx):
 *   import 'react-phone-number-input/style.css';
 *   import 'react-datepicker/dist/react-datepicker.css';
 *
 * DATA: on confirm, the full booking is written to Cloud Firestore
 * (collection "bookings") via ./firebase.js — see setup guide.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import DatePicker from 'react-datepicker';
// ── CONFIG ───────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '919187461258';
// ── Pricing ──────────────────────────────────────────────────────────
const BOOKING_FEE_STANDARD = 19999;
const BOOKING_FEE_MEMBER = 14999;
const MEMBERSHIP_DISCOUNT = 5000;
const SERVICES = ['Bridal Makeup', 'Cocktail Look', 'Airbrush Makeup', 'Soft Glam', 'Party & Occasion', 'Professional Shoot'];
const SKIN_TYPES = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'];
const SKIN_CONCERNS = [
  'Acne & Blemishes', 'Open Pores', 'Pigmentation', 'Dark Circles',
  'Dryness / Flaking', 'Redness / Sensitivity', 'Uneven Tone', 'Fine Lines',
];
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];
const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM',
];
const inr = n => `₹${Number(n).toLocaleString('en-IN')}`;
const fmtHuman = d =>
  d ? d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
const fmtGCal = d => {
  if (!d) return '';
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
};
// ── Styles ────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{overflow-x:hidden;max-width:100%}
:root{
  --bk:#0a0a0a; --wh:#ffffff; --g50:#f5f3f0; --g100:#eeebe6; --g200:#dedad4;
  --g300:#c8c3bb; --g500:#9a958e; --g700:#5c5750; --g900:#1c1a18;
  --acc:#b5a48a; --red:#b03a2e; --grn:#2e7d5b; --wa:#25D366;
  --gold1:#8a6a1c; --gold2:#d4af37; --gold3:#f6e3a1; --gold-ink:#2b1f05;
  --serif:'Cormorant Garamond',serif; --sans:'DM Sans',sans-serif;
  --r:1px; --t:0.22s ease;
}
.ae{min-height:100vh;width:100%;max-width:100vw;overflow-x:hidden;background:var(--wh);font-family:var(--sans);color:var(--bk);display:flex;flex-direction:column;align-items:center}
.ae-ph{width:100%;max-width:660px;padding:40px 20px 0;text-align:center}
.ae-h1{font-family:var(--serif);font-size:clamp(28px,7vw,44px);font-weight:300;letter-spacing:1px;color:var(--bk);line-height:1.15;margin-bottom:10px}
.ae-h1 em{font-style:italic;color:var(--g700)}
.ae-h1-sub{font-size:10px;font-weight:400;letter-spacing:2px;text-transform:uppercase;color:var(--g500)}
.ae-prog{width:100%;max-width:660px;padding:32px 16px 0;display:flex;align-items:center}
.ae-stp{display:flex;flex-direction:column;align-items:center;flex:1;min-width:0;position:relative}
.ae-sn{width:26px;height:26px;border:1px solid var(--g300);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:500;color:var(--g500);background:var(--wh);position:relative;z-index:1;flex-shrink:0;transition:border-color var(--t),background var(--t),color var(--t)}
.ae-stp.act .ae-sn{border-color:var(--gold2);background:var(--gold2);color:var(--gold-ink)}
.ae-stp.dn .ae-sn{border-color:var(--bk);color:var(--bk)}
.ae-sl{font-size:8px;font-weight:400;letter-spacing:1px;text-transform:uppercase;color:var(--g500);margin-top:6px;text-align:center;max-width:100%;overflow-wrap:break-word;transition:color var(--t)}
.ae-stp.act .ae-sl,.ae-stp.dn .ae-sl{color:var(--bk)}
.ae-ln{flex:1 1 12px;height:1px;background:var(--g200);margin-top:-14px;transition:background var(--t)}
.ae-ln.dn{background:var(--bk)}
.ae-card{width:100%;max-width:660px;padding:40px 20px 60px;overflow-x:hidden}
.ae-sh{display:flex;align-items:center;gap:12px;margin-bottom:22px}
.ae-si{width:24px;height:24px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,var(--gold2),var(--gold3));color:var(--gold-ink);display:flex;align-items:center;justify-content:center;font-family:var(--sans);font-size:10px;font-weight:600}
.ae-st{font-family:var(--serif);font-size:19px;font-weight:400;letter-spacing:1px;color:var(--bk)}
.ae-sline{flex:1;height:1px;background:linear-gradient(90deg,var(--g200),transparent)}
.ae-f{margin-bottom:20px;min-width:0}
.ae-lbl{display:block;font-size:9px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--g700);margin-bottom:7px}
.ae-opt{font-weight:300;color:var(--g500);letter-spacing:1px}
.ae-in,.ae-sel,.ae-ta{width:100%;max-width:100%;font-family:var(--sans);font-size:13px;font-weight:300;color:var(--bk);background:var(--wh);border:1px solid var(--g300);border-radius:var(--r);padding:13px 14px;outline:none;transition:border-color var(--t);appearance:none;-webkit-appearance:none}
.ae-in::placeholder,.ae-ta::placeholder{color:var(--g500)}
.ae-in:focus,.ae-sel:focus,.ae-ta:focus{border-color:var(--gold2)}
.ae-in.e,.ae-sel.e,.ae-ta.e{border-color:var(--red)}
.ae-ta{resize:vertical;min-height:84px;line-height:1.7}
.ae-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;min-width:0}
.ae-sw{position:relative;min-width:0}
.ae-sa{position:absolute;right:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--g500);font-size:9px}
.ae-ph-box{border:1px solid var(--g300);border-radius:var(--r);padding:13px 14px;display:flex;align-items:center;gap:8px;transition:border-color var(--t);max-width:100%;overflow:hidden}
.ae-ph-box:focus-within{border-color:var(--gold2)}
.ae-ph-box.e{border-color:var(--red)}
.PhoneInput{width:100%;min-width:0}
.PhoneInputInput{font-family:var(--sans)!important;font-size:13px!important;font-weight:300!important;color:var(--bk)!important;background:transparent!important;border:none!important;outline:none!important;padding:0!important;width:100%;min-width:0}
.ae-er{font-size:10px;font-weight:400;color:var(--red);letter-spacing:.3px;margin-top:5px}
.ae-btn{font-family:var(--sans);font-size:10px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;background:var(--bk);color:var(--wh);border:1px solid var(--bk);border-radius:var(--r);padding:12px 20px;cursor:pointer;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;transition:background var(--t),letter-spacing .3s}
.ae-btn:hover:not(:disabled){background:var(--g900);letter-spacing:3px}
.ae-btn:disabled{background:var(--g300);border-color:var(--g300);cursor:not-allowed}
.ae-btn-ol{background:var(--wh);color:var(--bk)}
.ae-btn-ol:hover:not(:disabled){background:var(--g50)}
.ae-dp{width:100%;min-width:0}
.ae-dp .react-datepicker-wrapper,.ae-dp .react-datepicker__input-container{width:100%}
.react-datepicker{font-family:var(--sans)!important;border:1px solid var(--g300)!important;border-radius:var(--r)!important;box-shadow:none!important}
.react-datepicker__header{background:var(--bk)!important;border-bottom:none!important;padding:12px 0 8px!important}
.react-datepicker__current-month{color:var(--wh)!important;font-size:11px!important;letter-spacing:1px}
.react-datepicker__day-name{color:var(--g500)!important;font-size:10px!important}
.react-datepicker__day{font-size:11px!important;color:var(--bk);border-radius:var(--r)!important}
.react-datepicker__day:hover{background:var(--g100)!important}
.react-datepicker__day--selected{background:var(--gold2)!important;color:var(--gold-ink)!important}
.react-datepicker__day--keyboard-selected{background:var(--g100)!important}
.react-datepicker__navigation-icon::before{border-color:var(--acc)!important}
.ae-sep{height:1px;background:var(--g100);margin:30px 0}
.ae-cr{display:flex;align-items:flex-start;gap:12px}
.ae-cb{width:16px;height:16px;border:1px solid var(--g300);border-radius:1px;accent-color:var(--bk);flex-shrink:0;margin-top:2px;cursor:pointer}
.ae-cbl{font-size:11px;font-weight:300;color:var(--g700);line-height:1.7}
.ae-link{color:var(--bk);text-decoration:underline;text-underline-offset:3px}
.ae-sub-btn{width:100%;padding:17px;font-family:var(--sans);font-size:10px;font-weight:500;letter-spacing:4px;text-transform:uppercase;background:var(--bk);color:var(--wh);border:none;border-radius:var(--r);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:12px;margin-top:32px;transition:background .4s,letter-spacing .4s,box-shadow .3s}
.ae-sub-btn:hover:not(:disabled){background:var(--g900);letter-spacing:5px}
.ae-sub-btn:disabled{background:var(--g300);cursor:not-allowed}
/* Gold glossy button — shown when Membership is ON */
.ae-pay-btn-gold{
  background:linear-gradient(120deg,var(--gold1) 0%,var(--gold2) 30%,var(--gold3) 50%,var(--gold2) 70%,var(--gold1) 100%);
  background-size:220% 100%;
  color:var(--gold-ink);
  font-weight:600;
  border:1px solid var(--gold1);
  box-shadow:0 4px 18px rgba(212,175,55,.35);
  animation:ae-gold-shift 3.5s ease infinite;
}
.ae-pay-btn-gold:hover:not(:disabled){
  background:linear-gradient(120deg,var(--gold1) 0%,var(--gold2) 30%,var(--gold3) 50%,var(--gold2) 70%,var(--gold1) 100%);
  background-size:220% 100%;
  letter-spacing:5px;
}
@keyframes ae-gold-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes ae-sp{to{transform:rotate(360deg)}}
.ae-spin{width:13px;height:13px;border:1.5px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:ae-sp .7s linear infinite;flex-shrink:0}
.ae-spin.dk{border:1.5px solid rgba(43,31,5,.3);border-top-color:var(--gold-ink)}
.ae-summ{border:1px solid var(--g200);border-radius:var(--r);padding:22px 20px;margin-bottom:26px;overflow:hidden}
.ae-summ-row{display:flex;gap:14px;padding-bottom:13px;margin-bottom:13px;border-bottom:.5px solid var(--g100)}
.ae-summ-row:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
.ae-summ-k{font-size:9px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:var(--g500);min-width:88px;padding-top:2px;flex-shrink:0}
.ae-summ-v{font-size:13px;font-weight:300;color:var(--bk);line-height:1.6;min-width:0;word-break:break-word}
.ae-banner{padding:13px 16px;font-size:11px;font-weight:300;letter-spacing:.3px;border-radius:var(--r);border:1px solid;margin-bottom:20px}
.ae-banner.info{background:#f7f4ee;border-color:var(--acc);color:var(--g700)}
.ae-banner.err{background:#fdf4f3;border-color:var(--red);color:var(--red)}
@keyframes ae-fi{from{opacity:0}to{opacity:1}}
@keyframes ae-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.ae-ov{position:fixed;inset:0;background:rgba(10,10,10,.86);display:flex;align-items:center;justify-content:center;z-index:9999;animation:ae-fi .4s ease;padding:20px}
.ae-mo{background:var(--wh);max-width:440px;width:100%;padding:44px 30px 36px;border-radius:2px;text-align:center;animation:ae-up .5s ease;max-height:90vh;overflow-y:auto}
.ae-mo.gold{background:linear-gradient(160deg,#fffdf6 0%,var(--g50) 60%,#fbf3dd 100%);border:1px solid var(--gold2);box-shadow:0 10px 40px rgba(212,175,55,.28)}
.ae-mo-t{font-family:var(--serif);font-size:21px;font-weight:300;letter-spacing:2px;text-transform:uppercase;color:var(--bk);margin-bottom:10px}
.ae-mo-t.gold{color:var(--gold1)}
.ae-mo-crown-lg{font-size:30px;color:var(--gold2);margin-bottom:6px;line-height:1}
.ae-mo-b{font-size:12px;font-weight:300;color:var(--g700);line-height:1.9;margin-bottom:20px}
.ae-mo-tl{font-family:var(--serif);font-style:italic;font-size:14px;font-weight:300;color:var(--g500);margin-bottom:26px;letter-spacing:1px}
.ae-mo-tl.gold{color:var(--gold1)}
.ae-mo-acts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.ae-mo-btn{font-family:var(--sans);font-size:9px;font-weight:500;letter-spacing:2px;text-transform:uppercase;padding:12px 18px;border:1px solid var(--bk);border-radius:var(--r);background:transparent;color:var(--bk);cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:6px;transition:background var(--t),color var(--t)}
.ae-mo-btn:hover{background:var(--bk);color:var(--wh)}
.ae-mo-btn.gold{border-color:var(--gold1);color:var(--gold1)}
.ae-mo-btn.gold:hover{background:linear-gradient(120deg,var(--gold1),var(--gold2));color:var(--gold-ink);border-color:var(--gold1)}
.ae-mo-ft{font-size:9px;font-weight:400;letter-spacing:3px;color:var(--g300);text-transform:uppercase;margin-top:26px}
.ae-mo-ft.gold{color:var(--gold2)}
.ae-ft{width:100%;border-top:1px solid var(--g100);padding:22px 16px;text-align:center;font-size:9px;font-weight:400;letter-spacing:2px;text-transform:uppercase;color:var(--g300)}
.ae-congrats-ic{font-size:42px;margin-bottom:8px;line-height:1}
/* Skin type / concerns panel */
.ae-panel{border:1px solid var(--g200);border-radius:2px;background:var(--g50);padding:18px 16px;margin-bottom:20px}
.ae-pills{display:flex;flex-wrap:wrap;gap:9px}
.ae-pill{padding:10px 16px;border:1px solid var(--g300);border-radius:20px;font-size:11.5px;font-weight:400;color:var(--g700);cursor:pointer;background:var(--wh);transition:all .2s ease;user-select:none;display:inline-flex;align-items:center;gap:6px}
.ae-pill:hover{border-color:var(--gold2);color:var(--bk)}
.ae-pill.sel{background:var(--bk);border-color:var(--bk);color:var(--wh);box-shadow:0 2px 8px rgba(0,0,0,.15)}
.ae-pill.gold-sel{background:linear-gradient(120deg,var(--gold1),var(--gold2));border-color:var(--gold1);color:var(--gold-ink)}
/* Membership */
.ae-mem-card{border:1px solid var(--g300);border-radius:2px;padding:20px 18px;margin-bottom:22px;transition:border-color .25s,background .25s,box-shadow .25s}
.ae-mem-card.on{border-color:var(--gold2);background:linear-gradient(135deg,#fffdf6,var(--g50));box-shadow:0 4px 20px rgba(212,175,55,.18)}
.ae-mem-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
.ae-mem-info{flex:1;min-width:0}
.ae-mem-t{font-family:var(--serif);font-size:17px;font-weight:400;color:var(--bk);margin-bottom:6px;display:flex;align-items:center;gap:8px}
.ae-mem-crown{color:var(--gold2);font-size:15px}
.ae-mem-s{font-size:11px;font-weight:300;color:var(--g700);line-height:1.7}
.ae-switch{position:relative;width:42px;height:24px;flex-shrink:0;margin-top:2px}
.ae-switch input{opacity:0;width:0;height:0;position:absolute}
.ae-switch-track{position:absolute;inset:0;background:var(--g300);border-radius:24px;cursor:pointer;transition:background .25s}
.ae-switch-track::before{content:'';position:absolute;width:18px;height:18px;left:3px;top:3px;background:var(--wh);border-radius:50%;transition:transform .25s}
.ae-switch input:checked + .ae-switch-track{background:linear-gradient(120deg,var(--gold1),var(--gold2))}
.ae-switch input:checked + .ae-switch-track::before{transform:translateX(18px)}
/* Price breakdown */
.ae-price-box{border:1px solid var(--g200);border-radius:2px;padding:20px 18px;margin-bottom:8px}
.ae-price-row{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--g700);padding:6px 0;gap:10px}
.ae-price-row.total{border-top:1px solid var(--g200);margin-top:8px;padding-top:16px;font-size:16px;font-weight:500;color:var(--bk);font-family:var(--serif)}
.ae-price-strike{text-decoration:line-through;color:var(--g500);margin-right:8px;font-weight:300}
.ae-price-save{color:var(--grn);font-size:9px;font-weight:500;text-transform:uppercase;letter-spacing:1px;margin-top:4px;text-align:right}
.ae-pay-note{font-size:9px;font-weight:300;color:var(--g500);text-align:center;margin-top:14px;letter-spacing:.2px;line-height:1.6}
@media(max-width:580px){
  .ae-card{padding:30px 16px 50px}
  .ae-2{grid-template-columns:1fr}
  .ae-mo{padding:36px 20px 30px}
  .ae-mo-acts{flex-direction:column}
  .ae-mo-btn{width:100%;justify-content:center}
  .ae-prog{padding:26px 12px 0}
  .ae-sn{width:22px;height:22px}
  .ae-si{width:20px;height:20px;font-size:9px}
  .ae-st{font-size:16px}
  .ae-summ-k{min-width:74px;font-size:8.5px}
  .ae-pill{padding:8px 13px;font-size:11px}
}
`;
// ── Component ─────────────────────────────────────────────────────────
export default function AmourAppointmentBooking() {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    service: '', skinType: '', skinConcerns: [],
    preferredDate: null, preferredTime: '',
    pincode: '', state: '', city: '', locality: '', block: '', street: '',
    specialNotes: '', agreeTerms: false, isMember: false,
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1 = Contact, 2 = Service & Details, 3 = Review & Confirm
  const [localityOptions, setLocalityOptions] = useState([]);
  const [pincodeStatus, setPincodeStatus] = useState(''); // '', 'loading', 'ok', 'err'
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [banner, setBanner] = useState(null);
  const pinTimer = useRef(null);

  useEffect(() => {
    const existing = document.getElementById('ae-css');
    if (existing) { existing.textContent = CSS; return; }
    const el = document.createElement('style');
    el.id = 'ae-css';
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const style = document.getElementById('ae-css'); if (style) style.remove(); };
  }, []);

  const upd = useCallback((k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: '' }));
  }, []);

  const toggleConcern = c => {
    setForm(p => ({
      ...p,
      skinConcerns: p.skinConcerns.includes(c)
        ? p.skinConcerns.filter(x => x !== c)
        : [...p.skinConcerns, c],
    }));
  };

  // ── Pincode → State/City auto-lookup ───────────────────────────────
  const lookupPincode = async pin => {
    setPincodeStatus('loading');
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice?.length) {
        const po = data[0].PostOffice[0];
        setForm(p => ({ ...p, state: po.State || p.state, city: po.District || p.city }));
        setLocalityOptions([...new Set(data[0].PostOffice.map(o => o.Name))]);
        setErrors(p => ({ ...p, pincode: '' }));
        setPincodeStatus('ok');
      } else {
        setPincodeStatus('err');
        setLocalityOptions([]);
      }
    } catch (e) {
      setPincodeStatus('err');
      setLocalityOptions([]);
    }
  };

  const onPincodeChange = v => {
    const digits = v.replace(/\D/g, '').slice(0, 6);
    upd('pincode', digits);
    setPincodeStatus('');
    if (pinTimer.current) clearTimeout(pinTimer.current);
    if (digits.length === 6) {
      pinTimer.current = setTimeout(() => lookupPincode(digits), 400);
    }
  };

  // ── Validation ────────────────────────────────────────────────────
  const val1 = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'A valid email is required.';
    if (!form.phone || !isValidPhoneNumber(form.phone)) e.phone = 'A valid phone number is required.';
    return e;
  };
  const val2 = () => {
    const e = {};
    if (!form.service) e.service = 'Please select a service.';
    if (!form.skinType) e.skinType = 'Please select your skin type.';
    if (!form.preferredDate) e.preferredDate = 'Please select a date.';
    if (!form.preferredTime) e.preferredTime = 'Please select a time slot.';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode.';
    if (!form.state) e.state = 'Please select a state.';
    if (!form.city.trim()) e.city = 'Please select or enter a city.';
    if (!form.block.trim()) e.block = 'Flat / block / building is required.';
    if (!form.street.trim()) e.street = 'Street / road is required.';
    return e;
  };
  const val3 = () => {
    const e = {};
    if (!form.agreeTerms) e.agreeTerms = 'Please agree to the Terms & Privacy Policy.';
    return e;
  };
  const goNext = () => {
    const e = step === 1 ? val1() : step === 2 ? val2() : {};
    if (Object.keys(e).length) {
      setErrors(e);
      document.getElementById(`f-${Object.keys(e)[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setErrors({});
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const goPrev = () => { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const bookingFee = form.isMember ? BOOKING_FEE_MEMBER : BOOKING_FEE_STANDARD;

  // ── Confirm Booking → validate terms, then save straight to Firestore ──
  const confirmBooking = async () => {
    const e = val3();
    if (Object.keys(e).length) {
      setErrors(e);
      document.getElementById(`f-${Object.keys(e)[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setBanner(null);
    await finalizeBooking();
  };

  const finalizeBooking = async () => {
    setSubmitting(true);
    const hDate = fmtHuman(form.preferredDate);
    const address = `${form.block}, ${form.street}, ${form.locality ? form.locality + ', ' : ''}${form.city}, ${form.state} - ${form.pincode}`;
    try {
      await addDoc(collection(db, 'bookings'), {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        service: form.service,
        skinType: form.skinType,
        skinConcerns: form.skinConcerns,
        preferredDate: hDate,
        preferredTime: form.preferredTime,
        pincode: form.pincode,
        state: form.state,
        city: form.city,
        locality: form.locality || '',
        block: form.block,
        street: form.street,
        address,
        specialNotes: form.specialNotes.trim() || '',
        isMember: form.isMember,
        bookingFee: bookingFee,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setSuccess({
        name: form.fullName, service: form.service, date: hDate,
        time: form.preferredTime, address, gcalDate: fmtGCal(form.preferredDate),
        bookingFee, isMember: form.isMember,
      });
    } catch (err) {
      setBanner({ msg: 'Something went wrong and the booking could not be saved. Please try again or WhatsApp us your booking details.', type: 'err' });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Action URLs ───────────────────────────────────────────────────
  const waUrl = () => {
    if (!success) return '#';
    const m = `Hello Amour Estilo! Confirming my booking:\n📌 ${success.service}\n📅 ${success.date} at ${success.time}\n📍 ${success.address}\nName: ${success.name}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(m)}`;
  };
  const gcUrl = () => {
    if (!success) return '#';
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Amour Estilo — ' + success.service)}&dates=${success.gcalDate}/${success.gcalDate}&details=${encodeURIComponent(`Service: ${success.service}\nTime: ${success.time}`)}&location=${encodeURIComponent(success.address)}`;
  };

  const STEP_LABELS = ['Contact', 'Details', 'Confirm'];
  const ss = i => (i + 1 < step ? 'dn' : i + 1 === step ? 'act' : '');

  return (
    <div className="ae">
      <div className="ae-ph">
        <h1 className="ae-h1">Book Your <em>Session</em></h1>
        <p className="ae-h1-sub">On-Demand · Home Service · Bengaluru</p>
      </div>
      <div className="ae-prog">
        {STEP_LABELS.map((lbl, i) => (
          <React.Fragment key={lbl}>
            <div className={`ae-stp ${ss(i)}`}>
              <div className="ae-sn">{i + 1 < step ? '✓' : i + 1}</div>
              <div className="ae-sl">{lbl}</div>
            </div>
            {i < STEP_LABELS.length - 1 && <div className={`ae-ln ${i + 1 < step ? 'dn' : ''}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="ae-card">
        {banner && <div className={`ae-banner ${banner.type}`}>{banner.msg}</div>}

        {/* ══════════════════ STEP 1 — Contact Details ══════════════════ */}
        {step === 1 && (
          <>
            <div className="ae-sh">
              <span className="ae-si">1</span>
              <span className="ae-st">Contact Details</span>
              <div className="ae-sline" />
            </div>
            <div className="ae-2">
              <div className="ae-f" id="f-fullName">
                <label className="ae-lbl">Full Name</label>
                <input className={`ae-in${errors.fullName ? ' e' : ''}`} type="text" value={form.fullName} placeholder="Your full name" onChange={e => upd('fullName', e.target.value)} />
                {errors.fullName && <div className="ae-er">{errors.fullName}</div>}
              </div>
              <div className="ae-f" id="f-email">
                <label className="ae-lbl">Email Address</label>
                <input className={`ae-in${errors.email ? ' e' : ''}`} type="email" value={form.email} placeholder="your@email.com" onChange={e => upd('email', e.target.value)} />
                {errors.email && <div className="ae-er">{errors.email}</div>}
              </div>
            </div>
            <div className="ae-f" id="f-phone">
              <label className="ae-lbl">Phone Number</label>
              <div className={`ae-ph-box${errors.phone ? ' e' : ''}`}>
                <PhoneInput international defaultCountry="IN" value={form.phone} onChange={v => upd('phone', v || '')} placeholder="Mobile number" />
              </div>
              {errors.phone && <div className="ae-er">{errors.phone}</div>}
            </div>
            <button type="button" className="ae-sub-btn" onClick={goNext}>Continue — Service Details →</button>
          </>
        )}

        {/* ══════════════════ STEP 2 — Service & Details ══════════════════ */}
        {step === 2 && (
          <>
            <div className="ae-sh">
              <span className="ae-si">2</span>
              <span className="ae-st">Service</span>
              <div className="ae-sline" />
            </div>
            <div className="ae-f" id="f-service">
              <label className="ae-lbl">Service Type</label>
              <div className="ae-sw">
                <select className={`ae-sel${errors.service ? ' e' : ''}`} value={form.service} onChange={e => upd('service', e.target.value)}>
                  <option value="">Select a service</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="ae-sa">▾</span>
              </div>
              {errors.service && <div className="ae-er">{errors.service}</div>}
            </div>

            <div className="ae-sep" />
            <div className="ae-sh">
              <span className="ae-si">3</span>
              <span className="ae-st">Skin Profile</span>
              <div className="ae-sline" />
            </div>
            <div className="ae-panel" id="f-skinType">
              <label className="ae-lbl">Skin Type</label>
              <div className="ae-pills">
                {SKIN_TYPES.map(t => (
                  <div key={t} className={`ae-pill${form.skinType === t ? ' gold-sel' : ''}`} onClick={() => upd('skinType', t)}>{t}</div>
                ))}
              </div>
              {errors.skinType && <div className="ae-er">{errors.skinType}</div>}
            </div>
            <div className="ae-panel">
              <label className="ae-lbl">Skin Concerns <span className="ae-opt">(Optional — select any)</span></label>
              <div className="ae-pills">
                {SKIN_CONCERNS.map(c => (
                  <div key={c} className={`ae-pill${form.skinConcerns.includes(c) ? ' gold-sel' : ''}`} onClick={() => toggleConcern(c)}>{c}</div>
                ))}
              </div>
            </div>

            <div className="ae-sep" />
            <div className="ae-sh">
              <span className="ae-si">4</span>
              <span className="ae-st">Schedule</span>
              <div className="ae-sline" />
            </div>
            <div className="ae-2">
              <div className="ae-f" id="f-preferredDate">
                <label className="ae-lbl">Preferred Date</label>
                <div className="ae-dp">
                  <DatePicker
                    selected={form.preferredDate}
                    onChange={d => upd('preferredDate', d)}
                    minDate={new Date()}
                    placeholderText="Select date"
                    dateFormat="d MMM yyyy"
                    customInput={<input className={`ae-in${errors.preferredDate ? ' e' : ''}`} style={{ cursor: 'pointer' }} readOnly />}
                  />
                </div>
                {errors.preferredDate && <div className="ae-er">{errors.preferredDate}</div>}
              </div>
              <div className="ae-f" id="f-preferredTime">
                <label className="ae-lbl">Preferred Time</label>
                <div className="ae-sw">
                  <select className={`ae-sel${errors.preferredTime ? ' e' : ''}`} value={form.preferredTime} onChange={e => upd('preferredTime', e.target.value)}>
                    <option value="">Select time</option>
                    {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <span className="ae-sa">▾</span>
                </div>
                {errors.preferredTime && <div className="ae-er">{errors.preferredTime}</div>}
              </div>
            </div>

            <div className="ae-sep" />
            <div className="ae-sh">
              <span className="ae-si">5</span>
              <span className="ae-st">Event Location</span>
              <div className="ae-sline" />
            </div>
            <div className="ae-2">
              <div className="ae-f" id="f-pincode">
                <label className="ae-lbl">Pincode</label>
                <input
                  className={`ae-in${errors.pincode ? ' e' : ''}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={form.pincode}
                  placeholder="560001"
                  onChange={e => onPincodeChange(e.target.value)}
                />
                {pincodeStatus === 'loading' && <div style={{ fontSize: 10, color: 'var(--g500)', marginTop: 5 }}>Looking up pincode…</div>}
                {pincodeStatus === 'ok' && <div style={{ fontSize: 10, color: 'var(--grn)', marginTop: 5 }}>✓ State & city auto-filled</div>}
                {pincodeStatus === 'err' && <div style={{ fontSize: 10, color: 'var(--g500)', marginTop: 5 }}>Couldn't auto-detect — please select manually</div>}
                {errors.pincode && <div className="ae-er">{errors.pincode}</div>}
              </div>
              <div className="ae-f" id="f-locality">
                <label className="ae-lbl">Locality <span className="ae-opt">(Optional)</span></label>
                <div className="ae-sw">
                  <select className="ae-sel" value={form.locality} onChange={e => upd('locality', e.target.value)}>
                    <option value="">{localityOptions.length ? 'Select locality' : 'Enter pincode first'}</option>
                    {localityOptions.map(l => <option key={l}>{l}</option>)}
                  </select>
                  <span className="ae-sa">▾</span>
                </div>
              </div>
            </div>
            <div className="ae-2">
              <div className="ae-f" id="f-state">
                <label className="ae-lbl">State</label>
                <div className="ae-sw">
                  <select className={`ae-sel${errors.state ? ' e' : ''}`} value={form.state} onChange={e => upd('state', e.target.value)}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <span className="ae-sa">▾</span>
                </div>
                {errors.state && <div className="ae-er">{errors.state}</div>}
              </div>
              <div className="ae-f" id="f-city">
                <label className="ae-lbl">City</label>
                <input className={`ae-in${errors.city ? ' e' : ''}`} type="text" value={form.city} placeholder="City / district" onChange={e => upd('city', e.target.value)} />
                {errors.city && <div className="ae-er">{errors.city}</div>}
              </div>
            </div>
            <div className="ae-2">
              <div className="ae-f" id="f-block">
                <label className="ae-lbl">Flat / Block / Building</label>
                <input className={`ae-in${errors.block ? ' e' : ''}`} type="text" value={form.block} placeholder="e.g. Flat 4B, Prestige Towers" onChange={e => upd('block', e.target.value)} />
                {errors.block && <div className="ae-er">{errors.block}</div>}
              </div>
              <div className="ae-f" id="f-street">
                <label className="ae-lbl">Street / Road</label>
                <input className={`ae-in${errors.street ? ' e' : ''}`} type="text" value={form.street} placeholder="e.g. 100 Feet Road" onChange={e => upd('street', e.target.value)} />
                {errors.street && <div className="ae-er">{errors.street}</div>}
              </div>
            </div>
            <div className="ae-f">
              <label className="ae-lbl">Special Notes <span className="ae-opt">(Optional)</span></label>
              <textarea className="ae-ta" value={form.specialNotes} rows={3} placeholder="Occasion details, reference inspiration…" onChange={e => upd('specialNotes', e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" className="ae-btn ae-btn-ol" style={{ flex: '0 0 auto', padding: '15px 20px' }} onClick={goPrev}>← Back</button>
              <button type="button" className="ae-sub-btn" style={{ marginTop: 0 }} onClick={goNext}>Review Booking →</button>
            </div>
          </>
        )}

        {/* ══════════════════ STEP 3 — Review, Membership & Confirm ══════════════════ */}
        {step === 3 && (
          <>
            <div className="ae-sh">
              <span className="ae-si">6</span>
              <span className="ae-st">Review Your Booking</span>
              <div className="ae-sline" />
            </div>
            <div className="ae-summ">
              {[
                ['Name', form.fullName], ['Email', form.email], ['Phone', form.phone],
                ['Service', form.service],
                ['Skin Type', form.skinType],
                ['Skin Concerns', form.skinConcerns.join(', ') || '—'],
                ['Date', fmtHuman(form.preferredDate)],
                ['Time', form.preferredTime],
                ['Address', `${form.block}, ${form.street}, ${form.locality ? form.locality + ', ' : ''}${form.city}, ${form.state} - ${form.pincode}`],
                ...(form.specialNotes ? [['Notes', form.specialNotes]] : []),
              ].map(([k, v]) => (
                <div className="ae-summ-row" key={k}>
                  <div className="ae-summ-k">{k}</div>
                  <div className="ae-summ-v">{v || '—'}</div>
                </div>
              ))}
            </div>

            <div className="ae-sep" />
            <div className="ae-sh">
              <span className="ae-si">7</span>
              <span className="ae-st">Membership</span>
              <div className="ae-sline" />
            </div>
            <div className={`ae-mem-card${form.isMember ? ' on' : ''}`}>
              <div className="ae-mem-top">
                <div className="ae-mem-info">
                  <div className="ae-mem-t"><span className="ae-mem-crown">♛</span> Privé Membership</div>
                  <div className="ae-mem-s">
                    Join now and get {inr(MEMBERSHIP_DISCOUNT)} off your service booking fee —
                    {inr(BOOKING_FEE_MEMBER)} instead of {inr(BOOKING_FEE_STANDARD)}.
                  </div>
                </div>
                <label className="ae-switch">
                  <input type="checkbox" checked={form.isMember} onChange={e => upd('isMember', e.target.checked)} />
                  <span className="ae-switch-track" />
                </label>
              </div>
            </div>

            <div className="ae-price-box">
              <div className="ae-price-row">
                <span>Booking Fee</span>
                <span>
                  {form.isMember && <span className="ae-price-strike">{inr(BOOKING_FEE_STANDARD)}</span>}
                  {inr(bookingFee)}
                </span>
              </div>
              {form.isMember && <div className="ae-price-save">You save {inr(MEMBERSHIP_DISCOUNT)} with membership</div>}
              <div className="ae-price-row total">
                <span>Total Due</span>
                <span>{inr(bookingFee)}</span>
              </div>
            </div>
            <div className="ae-pay-note">Collected at the time of service — no online payment required to book.</div>

            <div className="ae-f" id="f-agreeTerms" style={{ marginTop: 20 }}>
              <div className="ae-cr">
                <input id="ae-tc" type="checkbox" className="ae-cb" checked={form.agreeTerms} onChange={e => upd('agreeTerms', e.target.checked)} />
                <label htmlFor="ae-tc" className="ae-cbl">
                  I agree to Amour Estilo's <a href="#terms" className="ae-link">Terms of Service</a> and <a href="#privacy" className="ae-link">Privacy Policy</a>. I understand my booking is subject to availability confirmation.
                </label>
              </div>
              {errors.agreeTerms && <div className="ae-er" style={{ marginTop: 8 }}>{errors.agreeTerms}</div>}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" className="ae-btn ae-btn-ol" style={{ flex: '0 0 auto', padding: '15px 20px' }} onClick={goPrev} disabled={submitting}>← Edit</button>
              <button
                type="button"
                className={`ae-sub-btn${form.isMember ? ' ae-pay-btn-gold' : ''}`}
                style={{ marginTop: 0 }}
                onClick={confirmBooking}
                disabled={submitting}
              >
                {submitting && <span className={`ae-spin${form.isMember ? ' dk' : ''}`} />}
                {submitting ? 'Confirming…' : 'Confirm Booking'}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="ae-ft">Amour Estilo · Luxury Beauty Atelier · Bengaluru</div>

      {/* Success modal */}
      {success && (
        <div className="ae-ov">
          <div className="ae-mo">
            <div className="ae-congrats-ic">🎉</div>
            <div className="ae-mo-t">Congratulations!</div>
            <p className="ae-mo-b">
              Dear {success.name},<br /><br />
              Your booking is <strong>confirmed</strong> for <strong>{success.service}</strong> on <strong>{success.date}</strong> at <strong>{success.time}</strong>{success.isMember ? ' (Privé Member Rate)' : ''}. The booking fee of <strong>{inr(success.bookingFee)}</strong> will be collected at the time of service. Our team will reach out shortly to finalize details.
            </p>
            <div className="ae-mo-tl">Luxury. Beauty. Elegance.</div>
            <div className="ae-mo-acts">
              <a href={waUrl()} target="_blank" rel="noreferrer" className="ae-mo-btn">✦ WhatsApp Us</a>
              <a href={gcUrl()} target="_blank" rel="noreferrer" className="ae-mo-btn">✦ Add to Calendar</a>
            </div>
            <div className="ae-mo-ft">Amour Estilo</div>
          </div>
        </div>
      )}
    </div>
  );
}
