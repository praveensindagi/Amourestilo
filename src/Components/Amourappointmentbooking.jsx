/**
 * AmourAppointmentBooking.jsx
 * ─────────────────────────────────────────────────────────────────────
 * Luxury appointment booking — Amour Estilo · On-Demand Home Service
 *
 * Firebase Phone OTP Authentication — OTP verification now happens at
 * the END of the flow (Review & Confirm step), right before the
 * appointment is submitted. Contact details are collected up front
 * with no verification gate, so the booking starts immediately.
 *
 * REQUIRED:
 *   npm install firebase @emailjs/browser react-phone-number-input react-datepicker
 *
 * ENTRY FILE (index.js / main.jsx):
 *   import 'react-phone-number-input/style.css';
 *   import 'react-datepicker/dist/react-datepicker.css';
 *
 * Firebase:
 *   - Phone Authentication must be enabled
 *   - Firebase test number can be used during development
 *   - Test number: +1 650-555-3434
 *   - Test OTP:    654321
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import emailjs from '@emailjs/browser';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import DatePicker from 'react-datepicker';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { auth } from './firebase';
// ── CONFIG — replace with your real EmailJS / WhatsApp values ─────────
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_ADMIN_TID = 'YOUR_ADMIN_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const ADMIN_EMAIL = 'info.amourestilo@gmail.com';
const WHATSAPP_NUMBER = '919999999999';
// ─────────────────────────────────────────────────────────────────────
const SERVICES = [
  'Bridal Makeup',
  'Party & Occasion Makeup',
  'HD Makeup',
  'Fashion Shoot Makeup',
  'Hair Styling',
  'Nail Services',
  'Skin Consultation',
];
const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM',
];
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
:root{
  --bk:#0a0a0a; --wh:#ffffff; --g50:#f5f3f0; --g100:#eeebe6; --g200:#dedad4;
  --g300:#c8c3bb; --g500:#9a958e; --g700:#5c5750; --g900:#1c1a18;
  --acc:#b5a48a; --red:#b03a2e; --grn:#2e7d5b; --wa:#25D366;
  --serif:'Cormorant Garamond',serif; --sans:'DM Sans',sans-serif;
  --r:1px; --t:0.22s ease;
}
.ae{min-height:100vh;background:var(--wh);font-family:var(--sans);color:var(--bk);display:flex;flex-direction:column;align-items:center}
.ae-hd{width:100%;padding:26px 0 22px;border-bottom:1px solid var(--g200);text-align:center}
.ae-brand{font-family:var(--serif);font-size:14px;font-weight:300;letter-spacing:8px;text-transform:uppercase;color:var(--bk);margin-bottom:5px}
.ae-sub{font-size:9px;font-weight:400;letter-spacing:3px;text-transform:uppercase;color:var(--g500)}
.ae-ph{width:100%;max-width:660px;padding:48px 24px 0;text-align:center}
.ae-h1{font-family:var(--serif);font-size:clamp(30px,5vw,44px);font-weight:300;letter-spacing:2px;color:var(--bk);line-height:1.1;margin-bottom:10px}
.ae-h1 em{font-style:italic;color:var(--g700)}
.ae-h1-sub{font-size:10px;font-weight:400;letter-spacing:2.5px;text-transform:uppercase;color:var(--g500)}
.ae-prog{width:100%;max-width:660px;padding:40px 24px 0;display:flex;align-items:center}
.ae-stp{display:flex;flex-direction:column;align-items:center;flex:1;position:relative}
.ae-sn{width:28px;height:28px;border:1px solid var(--g300);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:500;color:var(--g500);background:var(--wh);position:relative;z-index:1;transition:border-color var(--t),background var(--t),color var(--t)}
.ae-stp.act .ae-sn{border-color:var(--bk);background:var(--bk);color:var(--wh)}
.ae-stp.dn .ae-sn{border-color:var(--bk);color:var(--bk)}
.ae-sl{font-size:8px;font-weight:400;letter-spacing:1.5px;text-transform:uppercase;color:var(--g500);margin-top:6px;white-space:nowrap;transition:color var(--t)}
.ae-stp.act .ae-sl,.ae-stp.dn .ae-sl{color:var(--bk)}
.ae-ln{flex:1;height:1px;background:var(--g200);margin-top:-14px;transition:background var(--t)}
.ae-ln.dn{background:var(--bk)}
.ae-card{width:100%;max-width:660px;padding:44px 24px 68px}
.ae-sh{display:flex;align-items:center;gap:14px;margin-bottom:26px}
.ae-si{font-family:var(--serif);font-size:11px;font-weight:300;letter-spacing:2px;color:var(--g500);min-width:18px}
.ae-st{font-family:var(--serif);font-size:19px;font-weight:300;letter-spacing:2px;color:var(--bk)}
.ae-sline{flex:1;height:.5px;background:var(--g200)}
.ae-f{margin-bottom:20px}
.ae-lbl{display:block;font-size:9px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;color:var(--g700);margin-bottom:7px}
.ae-opt{font-weight:300;color:var(--g500);letter-spacing:1px}
.ae-in,.ae-sel,.ae-ta{width:100%;font-family:var(--sans);font-size:13px;font-weight:300;color:var(--bk);background:var(--wh);border:1px solid var(--g300);border-radius:var(--r);padding:13px 14px;outline:none;transition:border-color var(--t);appearance:none;-webkit-appearance:none}
.ae-in::placeholder,.ae-ta::placeholder{color:var(--g500)}
.ae-in:focus,.ae-sel:focus,.ae-ta:focus{border-color:var(--bk)}
.ae-in.e,.ae-sel.e,.ae-ta.e{border-color:var(--red)}
.ae-ta{resize:vertical;min-height:84px;line-height:1.7}
.ae-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.ae-sw{position:relative}
.ae-sa{position:absolute;right:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--g500);font-size:9px}
.ae-ph-box{border:1px solid var(--g300);border-radius:var(--r);padding:13px 14px;display:flex;align-items:center;gap:8px;transition:border-color var(--t)}
.ae-ph-box:focus-within{border-color:var(--bk)}
.ae-ph-box.e{border-color:var(--red)}
.PhoneInputInput{font-family:var(--sans)!important;font-size:13px!important;font-weight:300!important;color:var(--bk)!important;background:transparent!important;border:none!important;outline:none!important;padding:0!important;width:100%}
.ae-btn-sms{font-family:var(--sans);font-size:10px;font-weight:500;letter-spacing:2px;text-transform:uppercase;background:var(--bk);color:var(--wh);border:1px solid var(--bk);border-radius:var(--r);padding:12px 18px;cursor:pointer;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;transition:background var(--t),letter-spacing .3s}
.ae-btn-sms:hover:not(:disabled){background:var(--g900);letter-spacing:2.8px}
.ae-btn-sms:disabled{background:var(--g300);border-color:var(--g300);cursor:not-allowed}
.ae-wa-hint{background:#f5f3f0;border:1px solid var(--g300);border-radius:var(--r);padding:14px 16px;margin-top:14px}
.ae-wa-hint-top{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.ae-wa-ic{font-size:16px;line-height:1}
.ae-wa-hint-title{font-size:10px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:var(--g700)}
.ae-wa-hint-body{font-size:11px;font-weight:300;color:var(--g700);line-height:1.7}
.ae-otp-row{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:end}
.ae-otp-hint{font-size:11px;font-weight:300;color:var(--g700);margin-top:8px;line-height:1.6}
.ae-digits{display:flex;gap:8px;margin-top:14px}
.ae-dig{width:46px;height:54px;text-align:center;font-family:var(--sans);font-size:20px;font-weight:300;color:var(--bk);background:var(--wh);border:1px solid var(--g300);border-radius:var(--r);outline:none;transition:border-color var(--t);caret-color:var(--bk)}
.ae-dig:focus{border-color:var(--bk)}
.ae-dig.e{border-color:var(--red)}
.ae-dig.fl{border-color:var(--g700)}
.ae-otp-meta{display:flex;align-items:center;justify-content:space-between;margin-top:12px;flex-wrap:wrap;gap:8px}
.ae-resend{font-size:10px;font-weight:400;color:var(--g500);cursor:pointer;background:none;border:none;padding:0;text-decoration:underline;text-underline-offset:3px;transition:color var(--t)}
.ae-resend:hover{color:var(--bk)}
.ae-resend:disabled{color:var(--g300);cursor:default;text-decoration:none}
.ae-ok{display:inline-flex;align-items:center;gap:7px;font-size:9px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--grn);margin-top:14px}
.ae-ok-ic{width:16px;height:16px;border:1px solid var(--grn);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px}
.ae-er{font-size:10px;font-weight:400;color:var(--red);letter-spacing:.3px;margin-top:5px}
.ae-btn{font-family:var(--sans);font-size:10px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;background:var(--bk);color:var(--wh);border:1px solid var(--bk);border-radius:var(--r);padding:12px 20px;cursor:pointer;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;transition:background var(--t),letter-spacing .3s}
.ae-btn:hover:not(:disabled){background:var(--g900);letter-spacing:3px}
.ae-btn:disabled{background:var(--g300);border-color:var(--g300);cursor:not-allowed}
.ae-btn-ol{background:var(--wh);color:var(--bk)}
.ae-btn-ol:hover:not(:disabled){background:var(--g50)}
.ae-dp{width:100%}
.ae-dp .react-datepicker-wrapper,.ae-dp .react-datepicker__input-container{width:100%}
.react-datepicker{font-family:var(--sans)!important;border:1px solid var(--g300)!important;border-radius:var(--r)!important;box-shadow:none!important}
.react-datepicker__header{background:var(--bk)!important;border-bottom:none!important;padding:12px 0 8px!important}
.react-datepicker__current-month{color:var(--wh)!important;font-size:11px!important;letter-spacing:1px}
.react-datepicker__day-name{color:var(--g500)!important;font-size:10px!important}
.react-datepicker__day{font-size:11px!important;color:var(--bk);border-radius:var(--r)!important}
.react-datepicker__day:hover{background:var(--g100)!important}
.react-datepicker__day--selected{background:var(--bk)!important;color:var(--wh)!important}
.react-datepicker__day--keyboard-selected{background:var(--g100)!important}
.react-datepicker__navigation-icon::before{border-color:var(--acc)!important}
.ae-sep{height:1px;background:var(--g100);margin:32px 0}
.ae-cr{display:flex;align-items:flex-start;gap:12px}
.ae-cb{width:16px;height:16px;border:1px solid var(--g300);border-radius:1px;accent-color:var(--bk);flex-shrink:0;margin-top:2px;cursor:pointer}
.ae-cbl{font-size:11px;font-weight:300;color:var(--g700);line-height:1.7}
.ae-link{color:var(--bk);text-decoration:underline;text-underline-offset:3px}
.ae-sub-btn{width:100%;padding:17px;font-family:var(--sans);font-size:10px;font-weight:500;letter-spacing:5px;text-transform:uppercase;background:var(--bk);color:var(--wh);border:none;border-radius:var(--r);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:12px;margin-top:32px;transition:background .4s,letter-spacing .4s}
.ae-sub-btn:hover:not(:disabled){background:var(--g900);letter-spacing:6.5px}
.ae-sub-btn:disabled{background:var(--g300);cursor:not-allowed}
@keyframes ae-sp{to{transform:rotate(360deg)}}
.ae-spin{width:13px;height:13px;border:1.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:ae-sp .7s linear infinite;flex-shrink:0}
.ae-summ{border:1px solid var(--g200);border-radius:var(--r);padding:24px 22px;margin-bottom:26px}
.ae-summ-row{display:flex;gap:16px;padding-bottom:13px;margin-bottom:13px;border-bottom:.5px solid var(--g100)}
.ae-summ-row:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
.ae-summ-k{font-size:9px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--g500);min-width:72px;padding-top:2px;flex-shrink:0}
.ae-summ-v{font-size:13px;font-weight:300;color:var(--bk);line-height:1.6}
.ae-banner{padding:13px 16px;font-size:11px;font-weight:300;letter-spacing:.3px;border-radius:var(--r);border:1px solid;margin-bottom:20px}
.ae-banner.info{background:#f7f4ee;border-color:var(--acc);color:var(--g700)}
.ae-banner.err{background:#fdf4f3;border-color:var(--red);color:var(--red)}
@keyframes ae-fi{from{opacity:0}to{opacity:1}}
@keyframes ae-up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
.ae-ov{position:fixed;inset:0;background:rgba(10,10,10,.86);display:flex;align-items:center;justify-content:center;z-index:9999;animation:ae-fi .4s ease;padding:24px}
.ae-mo{background:var(--wh);max-width:450px;width:100%;padding:50px 40px 42px;border-radius:var(--r);text-align:center;animation:ae-up .5s ease}
.ae-mo-ic{width:54px;height:54px;border:1px solid var(--bk);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 26px;font-family:var(--serif);font-size:20px;color:var(--bk)}
.ae-mo-t{font-family:var(--serif);font-size:21px;font-weight:300;letter-spacing:4px;text-transform:uppercase;color:var(--bk);margin-bottom:14px}
.ae-mo-b{font-size:12px;font-weight:300;color:var(--g700);line-height:1.9;margin-bottom:22px}
.ae-mo-tl{font-family:var(--serif);font-style:italic;font-size:14px;font-weight:300;color:var(--g500);margin-bottom:30px;letter-spacing:1px}
.ae-mo-acts{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.ae-mo-btn{font-family:var(--sans);font-size:9px;font-weight:500;letter-spacing:2px;text-transform:uppercase;padding:12px 20px;border:1px solid var(--bk);border-radius:var(--r);background:transparent;color:var(--bk);cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:6px;transition:background var(--t),color var(--t)}
.ae-mo-btn:hover{background:var(--bk);color:var(--wh)}
.ae-mo-ft{font-size:9px;font-weight:400;letter-spacing:4px;color:var(--g300);text-transform:uppercase;margin-top:30px}
.ae-ft{width:100%;border-top:1px solid var(--g100);padding:22px;text-align:center;font-size:9px;font-weight:400;letter-spacing:3px;text-transform:uppercase;color:var(--g300)}
/* Firebase invisible reCAPTCHA — fully hidden, incl. floating badge */
#recaptcha-container{position:fixed!important;bottom:0;right:0;min-height:0;width:0;height:0;overflow:hidden;opacity:0;pointer-events:none}
.grecaptcha-badge{visibility:hidden!important;opacity:0!important}
@media(max-width:580px){
  .ae-card{padding:32px 18px 56px}
  .ae-2{grid-template-columns:1fr}
  .ae-otp-row{grid-template-columns:1fr}
  .ae-otp-row .ae-btn-sms{width:100%;justify-content:center}
  .ae-digits{gap:6px}
  .ae-dig{width:40px;height:48px;font-size:18px}
  .ae-mo{padding:38px 22px 34px}
  .ae-mo-acts{flex-direction:column}
  .ae-mo-btn{width:100%;justify-content:center}
  .ae-prog{padding:32px 18px 0}
}
`;
// ── Component ─────────────────────────────────────────────────────────
export default function AmourAppointmentBooking() {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', service: '', preferredDate: null,
    preferredTime: '', address: '', specialNotes: '', agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1 = Contact, 2 = Service & Schedule, 3 = Review + OTP + Confirm

  // Firebase OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [otpErr, setOtpErr] = useState('');
  const [resend, setResend] = useState(0);
  const [otpSending, setOtpSending] = useState(false);

  const confirmationResultRef = useRef(null);
  const recaptchaRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [banner, setBanner] = useState(null);
  const digitRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const existing = document.getElementById('ae-css');
    if (existing) { existing.textContent = CSS; return; }
    const el = document.createElement('style');
    el.id = 'ae-css';
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => { const style = document.getElementById('ae-css'); if (style) style.remove(); };
  }, []);

  useEffect(() => {
    return () => {
      if (recaptchaRef.current) {
        try { recaptchaRef.current.clear(); } catch (e) {}
        recaptchaRef.current = null;
      }
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (resend <= 0) return;
    timerRef.current = setTimeout(() => setResend(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [resend]);

  const upd = useCallback((k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: '' }));
  }, []);

  // ── Firebase reCAPTCHA setup (invisible, silent) ──────────────────
  const setupRecaptcha = () => {
    if (recaptchaRef.current) return recaptchaRef.current;
    const container = document.getElementById('recaptcha-container');
    if (!container) throw new Error('Firebase reCAPTCHA container not found.');
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {},
      'expired-callback': () => {
        if (recaptchaRef.current) {
          try { recaptchaRef.current.clear(); } catch (e) {}
        }
        recaptchaRef.current = null;
      },
    });
    recaptchaRef.current = verifier;
    return verifier;
  };

  // ── OTP digit handlers ────────────────────────────────────────────
  const onDigit = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    setOtpErr('');
    if (val && i < 5) digitRefs.current[i + 1]?.focus();
    if (!val && i > 0) digitRefs.current[i - 1]?.focus();
    const code = next.join('');
    if (code.length === 6) setTimeout(() => doVerify(code), 100);
  };
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) digitRefs.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft' && i > 0) digitRefs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) digitRefs.current[i + 1]?.focus();
  };
  const onPaste = e => {
    const txt = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!txt) return;
    e.preventDefault();
    const arr = [...txt.split(''), '', '', '', '', '', ''].slice(0, 6);
    setDigits(arr);
    if (txt.length < 6) digitRefs.current[Math.min(txt.length, 5)]?.focus();
    if (txt.length === 6) setTimeout(() => doVerify(txt), 100);
  };

  // ── Send OTP using Firebase ───────────────────────────────────────
  const sendOtpViaSMS = async () => {
    if (!form.phone || !isValidPhoneNumber(form.phone)) {
      setErrors(p => ({ ...p, phone: 'Enter a valid mobile number to receive the OTP.' }));
      return;
    }
    setOtpSending(true);
    setBanner(null);
    setOtpErr('');
    try {
      const appVerifier = setupRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(auth, form.phone, appVerifier);
      confirmationResultRef.current = confirmationResult;
      setOtpSent(true);
      setOtpVerified(false);
      setDigits(['', '', '', '', '', '']);
      setResend(60);
      setBanner({ msg: `OTP sent to ${form.phone}. Enter the 6-digit code below.`, type: 'info' });
      setTimeout(() => digitRefs.current[0]?.focus(), 100);
    } catch (err) {
      let message = 'Unable to send OTP. Please check the phone number and try again.';
      if (err?.code === 'auth/invalid-phone-number') message = 'The phone number is invalid. Please check the number and try again.';
      if (err?.code === 'auth/operation-not-allowed') message = 'Phone authentication is not enabled in Firebase. Please enable the Phone provider.';
      if (err?.code === 'auth/unauthorized-domain') message = 'This website domain is not authorized in Firebase Authentication.';
      if (err?.code === 'auth/invalid-app-credential') message = 'Verification failed. Please refresh the page and try again.';
      if (err?.code === 'auth/quota-exceeded') message = 'SMS quota has been exceeded. Please use the configured Firebase test number during development.';
      setOtpErr(message);
      setBanner({ msg: 'OTP could not be sent. Please check the Firebase configuration.', type: 'err' });
      if (recaptchaRef.current) {
        try { recaptchaRef.current.clear(); } catch (e) {}
        recaptchaRef.current = null;
      }
    } finally {
      setOtpSending(false);
    }
  };

  // ── Verify Firebase OTP ───────────────────────────────────────────
  const doVerify = async code => {
    if (!confirmationResultRef.current) { setOtpErr('Please request a new OTP first.'); return; }
    if (!/^\d{6}$/.test(code)) { setOtpErr('Please enter the complete 6-digit OTP.'); return; }
    setOtpErr('');
    try {
      await confirmationResultRef.current.confirm(code);
      setOtpVerified(true);
      setOtpErr('');
      setErrors(p => ({ ...p, otp: '' }));
      setBanner({ msg: 'Identity verified successfully.', type: 'info' });
    } catch (err) {
      let message = 'Incorrect OTP. Please check the code and try again.';
      if (err?.code === 'auth/invalid-verification-code') message = 'Incorrect OTP. Please check the 6-digit code and try again.';
      if (err?.code === 'auth/code-expired') message = 'This OTP has expired. Please request a new OTP.';
      setOtpErr(message);
      setDigits(['', '', '', '', '', '']);
      setTimeout(() => digitRefs.current[0]?.focus(), 50);
    }
  };

  // Phone changed after being verified earlier in the flow — invalidate it.
  const onPhoneChange = v => {
    upd('phone', v || '');
    setOtpSent(false);
    setOtpVerified(false);
    setDigits(['', '', '', '', '', '']);
    setOtpErr('');
    setBanner(null);
    confirmationResultRef.current = null;
    if (recaptchaRef.current) {
      try { recaptchaRef.current.clear(); } catch (e) {}
      recaptchaRef.current = null;
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
    if (!form.preferredDate) e.preferredDate = 'Please select a date.';
    if (!form.preferredTime) e.preferredTime = 'Please select a time slot.';
    if (!form.address.trim()) e.address = 'Home address is required.';
    return e;
  };
  const val3 = () => {
    const e = {};
    if (!otpVerified) e.otp = 'Please verify your phone via SMS OTP before confirming.';
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

  // ── Submit ────────────────────────────────────────────────────────
  const submit = async () => {
    const e = val3();
    if (Object.keys(e).length) {
      setErrors(e);
      document.getElementById(`f-${Object.keys(e)[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitting(true);
    setBanner(null);
    const hDate = fmtHuman(form.preferredDate);
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_ADMIN_TID, {
        customer_name: form.fullName,
        customer_email: form.email,
        customer_phone: form.phone,
        service_type: form.service,
        preferred_date: hDate,
        preferred_time: form.preferredTime,
        address: form.address,
        special_notes: form.specialNotes.trim() || '—',
      }, EMAILJS_PUBLIC_KEY);
      setSuccess({
        name: form.fullName, service: form.service, date: hDate,
        time: form.preferredTime, address: form.address, gcalDate: fmtGCal(form.preferredDate),
      });
    } catch (err) {
      setBanner({ msg: 'Error sending your request. Please try again or WhatsApp us directly.', type: 'err' });
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

  // ── Step helpers ──────────────────────────────────────────────────
  const STEP_LABELS = ['Contact', 'Service', 'Confirm'];
  const ss = i => (i + 1 < step ? 'dn' : i + 1 === step ? 'act' : '');

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="ae">
      <div className="ae-hd">
        <div className="ae-brand">Amour Estilo</div>
        <div className="ae-sub">Atelier de Beauté · Bengaluru</div>
      </div>
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
        <div id="recaptcha-container" />
        {banner && <div className={`ae-banner ${banner.type}`}>{banner.msg}</div>}

        {/* ══════════════════════════════ STEP 1 — Contact Details (no OTP) ══════════════════════════════ */}
        {step === 1 && (
          <>
            <div className="ae-sh">
              <span className="ae-si">I</span>
              <span className="ae-st">Contact Details</span>
              <div className="ae-sline" />
            </div>
            <div className="ae-2">
              <div className="ae-f" id="f-fullName">
                <label className="ae-lbl">Full Name</label>
                <input
                  className={`ae-in${errors.fullName ? ' e' : ''}`}
                  type="text"
                  value={form.fullName}
                  placeholder="Your full name"
                  onChange={e => upd('fullName', e.target.value)}
                />
                {errors.fullName && <div className="ae-er">{errors.fullName}</div>}
              </div>
              <div className="ae-f" id="f-email">
                <label className="ae-lbl">Email Address</label>
                <input
                  className={`ae-in${errors.email ? ' e' : ''}`}
                  type="email"
                  value={form.email}
                  placeholder="your@email.com"
                  onChange={e => upd('email', e.target.value)}
                />
                {errors.email && <div className="ae-er">{errors.email}</div>}
              </div>
            </div>
            <div className="ae-f" id="f-phone">
              <label className="ae-lbl">Phone Number</label>
              <div className={`ae-ph-box${errors.phone ? ' e' : ''}`}>
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={form.phone}
                  onChange={onPhoneChange}
                  placeholder="Mobile number"
                />
              </div>
              {errors.phone && <div className="ae-er">{errors.phone}</div>}
              <div className="ae-wa-hint" style={{ marginTop: 12 }}>
                <div className="ae-wa-hint-top">
                  <span className="ae-wa-ic">📱</span>
                  <span className="ae-wa-hint-title">Verified at Checkout</span>
                </div>
                <div className="ae-wa-hint-body">
                  We'll send a one-time SMS code to this number at the final step to confirm your booking.
                </div>
              </div>
            </div>
            <button type="button" className="ae-sub-btn" onClick={goNext}>Continue — Service Details →</button>
          </>
        )}

        {/* ══════════════════════════════ STEP 2 — Service & Schedule ══════════════════════════════ */}
        {step === 2 && (
          <>
            <div className="ae-sh">
              <span className="ae-si">II</span>
              <span className="ae-st">Service & Schedule</span>
              <div className="ae-sline" />
            </div>
            <div className="ae-f" id="f-service">
              <label className="ae-lbl">Service Type</label>
              <div className="ae-sw">
                <select className={`ae-sel${errors.service ? ' e' : ''}`} value={form.service} onChange={e => upd('service', e.target.value)}>
                  <option value="">Select a service</option>
                  {SERVICES.map(s => <option key={s}>{s}</option>)}
                </select>
                <span className="ae-sa">▾</span>
              </div>
              {errors.service && <div className="ae-er">{errors.service}</div>}
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
              <span className="ae-si">III</span>
              <span className="ae-st">Location</span>
              <div className="ae-sline" />
            </div>
            <div className="ae-f" id="f-address">
              <label className="ae-lbl">Home Address</label>
              <textarea className={`ae-ta${errors.address ? ' e' : ''}`} value={form.address} rows={3} placeholder="Building, street, area, city, pincode" onChange={e => upd('address', e.target.value)} />
              {errors.address && <div className="ae-er">{errors.address}</div>}
            </div>
            <div className="ae-f">
              <label className="ae-lbl">Special Notes <span className="ae-opt">(Optional)</span></label>
              <textarea className="ae-ta" value={form.specialNotes} rows={3} placeholder="Occasion details, skin concerns, reference inspiration…" onChange={e => upd('specialNotes', e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" className="ae-btn ae-btn-ol" style={{ flex: '0 0 auto', padding: '15px 20px' }} onClick={goPrev}>← Back</button>
              <button type="button" className="ae-sub-btn" style={{ marginTop: 0 }} onClick={goNext}>Review Booking →</button>
            </div>
          </>
        )}

        {/* ══════════════════════════════ STEP 3 — Review, Verify (OTP), Confirm ══════════════════════════════ */}
        {step === 3 && (
          <>
            <div className="ae-sh">
              <span className="ae-si">IV</span>
              <span className="ae-st">Review & Confirm</span>
              <div className="ae-sline" />
            </div>
            <div className="ae-summ">
              {[
                ['Name', form.fullName], ['Email', form.email], ['Phone', form.phone],
                ['Service', form.service], ['Date', fmtHuman(form.preferredDate)],
                ['Time', form.preferredTime], ['Address', form.address],
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
              <span className="ae-si">V</span>
              <span className="ae-st">Verify Your Phone</span>
              <div className="ae-sline" />
            </div>
            <div className="ae-f" id="f-otp">
              <label className="ae-lbl">SMS OTP</label>
              <div className="ae-otp-row">
                <div className="ae-ph-box" style={{ pointerEvents: 'none', opacity: 0.7 }}>
                  <span style={{ fontSize: 13, fontWeight: 300, color: 'var(--g500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {form.phone}
                  </span>
                </div>
                <button
                  type="button"
                  className="ae-btn-sms"
                  onClick={sendOtpViaSMS}
                  disabled={otpSending || otpVerified || !form.phone}
                >
                  {otpSending ? (<><span className="ae-spin" />Sending</>) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1.9-2 2-2zm0 14H6l-2 2V4h16v12z" />
                      </svg>
                      {otpSent ? 'Resend' : 'Send OTP'}
                    </>
                  )}
                </button>
              </div>
              {!otpSent && !otpVerified && (
                <div className="ae-wa-hint">
                  <div className="ae-wa-hint-top">
                    <span className="ae-wa-ic">📱</span>
                    <span className="ae-wa-hint-title">Final Step — Secure Verification</span>
                  </div>
                  <div className="ae-wa-hint-body">
                    Tap <strong>Send OTP</strong> to receive a secure 6-digit code by SMS. Enter it below, then confirm your appointment.
                  </div>
                </div>
              )}
              {otpSent && !otpVerified && (
                <>
                  <p className="ae-otp-hint">
                    Enter the 6-digit code sent via SMS to <strong>{form.phone}</strong>
                  </p>
                  <div className="ae-digits" onPaste={onPaste}>
                    {digits.map((d, i) => (
                      <input
                        key={i}
                        ref={el => (digitRefs.current[i] = el)}
                        className={`ae-dig${otpErr ? ' e' : ''}${d ? ' fl' : ''}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={e => onDigit(i, e.target.value)}
                        onKeyDown={e => onKey(i, e)}
                        aria-label={`OTP digit ${i + 1}`}
                      />
                    ))}
                  </div>
                  <div className="ae-otp-meta">
                    {otpErr ? <div className="ae-er" style={{ marginTop: 0 }}>{otpErr}</div> : <div />}
                    <button type="button" className="ae-resend" disabled={resend > 0 || otpSending} onClick={sendOtpViaSMS}>
                      {resend > 0 ? `Resend in ${resend}s` : 'Resend code'}
                    </button>
                  </div>
                </>
              )}
              {otpVerified && (
                <div className="ae-ok">
                  <div className="ae-ok-ic">✓</div>
                  Identity Verified
                </div>
              )}
              {errors.otp && !otpVerified && <div className="ae-er">{errors.otp}</div>}
            </div>

            <div className="ae-sep" />
            <div className="ae-f" id="f-agreeTerms">
              <div className="ae-cr">
                <input id="ae-tc" type="checkbox" className="ae-cb" checked={form.agreeTerms} onChange={e => upd('agreeTerms', e.target.checked)} />
                <label htmlFor="ae-tc" className="ae-cbl">
                  I agree to Amour Estilo's <a href="#terms" className="ae-link">Terms of Service</a> and <a href="#privacy" className="ae-link">Privacy Policy</a>. I understand my booking is subject to availability confirmation.
                </label>
              </div>
              {errors.agreeTerms && <div className="ae-er" style={{ marginTop: 8 }}>{errors.agreeTerms}</div>}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" className="ae-btn ae-btn-ol" style={{ flex: '0 0 auto', padding: '15px 20px' }} onClick={goPrev}>← Edit</button>
              <button type="button" className="ae-sub-btn" style={{ marginTop: 0 }} onClick={submit} disabled={submitting}>
                {submitting && <span className="ae-spin" />}
                {submitting ? 'Sending…' : 'Confirm Appointment'}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="ae-ft">Amour Estilo · Luxury Beauty Atelier · Bengaluru</div>

      {success && (
        <div className="ae-ov">
          <div className="ae-mo">
            <div className="ae-mo-ic">✦</div>
            <div className="ae-mo-t">Appointment Received</div>
            <p className="ae-mo-b">
              Dear {success.name},<br /><br />
              Your request for <strong>{success.service}</strong> on <strong>{success.date}</strong> at <strong>{success.time}</strong> has been received. Our team will confirm within 24 hours.
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
