import React, { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { createDonationOrder, verifyDonationPayment } from '../services/donation.service';
import './DonateMoneyPage.css';

/* ─── Razorpay loader ─────────────────────────────────────── */
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

/* ─── Preset amounts ──────────────────────────────────────── */
const PRESETS = [
  { label: '₹100',  value: 100,  emoji: '🌱' },
  { label: '₹500',  value: 500,  emoji: '🍱' },
  { label: '₹1000', value: 1000, emoji: '🥗' },
  { label: '₹2500', value: 2500, emoji: '🍽️' },
  { label: '₹5000', value: 5000, emoji: '🌟' },
];

/* ─── Floating particles ──────────────────────────────────── */
function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: 6 + Math.random() * 10,
    left: Math.random() * 100,
    delay: Math.random() * 14,
    duration: 12 + Math.random() * 10,
    color: i % 3 === 0
      ? 'rgba(16,185,129,0.25)'
      : i % 3 === 1
      ? 'rgba(5,150,105,0.18)'
      : 'rgba(245,158,11,0.2)',
  }));

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="fb-particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </>
  );
}

/* ─── 3-D card tilt hook ──────────────────────────────────── */
function use3DTilt(ref) {
  useEffect(() => {
    const card = ref.current;
    if (!card) return;

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(900px) rotateY(${dx * 5}deg) rotateX(${-dy * 4}deg) scale3d(1.01,1.01,1.01)`;
    };

    const onLeave = () => {
      card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, [ref]);
}

/* ─── Ripple effect ───────────────────────────────────────── */
function useRipple() {
  const [ripples, setRipples] = useState([]);

  const addRipple = useCallback((e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const id = Date.now();
    const x = e.clientX - rect.left - 5;
    const y = e.clientY - rect.top - 5;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
  }, []);

  return [ripples, addRipple];
}

/* ─── Success Splash ──────────────────────────────────────── */
function SuccessSplash({ onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fb-success-splash" onClick={onClose}>
      <div className="fb-success-icon">💚</div>
      <h2>Thank you, legend!</h2>
      <p>Your donation will help feed real people today.</p>
      <p style={{ marginTop: '0.4rem', fontSize: '0.8rem', opacity: 0.6 }}>
        Tap anywhere to continue
      </p>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
function DonateMoneyPage() {
  const [form, setForm] = useState({
    donorName: '',
    donorEmail: '',
    amount: 500,
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const cardRef = useRef(null);
  use3DTilt(cardRef);
  const [ripples, addRipple] = useRipple();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const selectPreset = (val) => {
    setForm((prev) => ({ ...prev, amount: val }));
  };

  const openCheckout = async (e) => {
    addRipple(e);
    setSubmitting(true);

    try {
      const response = await createDonationOrder({
        donorName: form.donorName.trim(),
        donorEmail: form.donorEmail.trim(),
        amount: Number(form.amount),
        message: form.message.trim(),
      });

      const { gateway, order, donation, razorpayKeyId, message } = response.data;

      if (gateway !== 'razorpay') {
        toast.info(message || 'Online payment is not configured yet.');
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please retry.');
        return;
      }

      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'FoodBridge Donations',
        description: 'Support meals for people in need',
        order_id: order.id,
        prefill: { name: form.donorName, email: form.donorEmail },
        notes: { donationId: String(donation.id), message: form.message },
        config: {
          display: {
            blocks: {
              preferred: {
                name: 'Donate via',
                instruments: [
                  { method: 'upi' }, { method: 'card' },
                  { method: 'netbanking' }, { method: 'wallet' },
                ],
              },
            },
            sequence: ['block.preferred'],
            preferences: { show_default_blocks: true },
          },
        },
        theme: { color: '#10b981' },
        handler: async (paymentResponse) => {
          await verifyDonationPayment({ donationId: donation.id, ...paymentResponse });
          setShowSuccess(true);
          setForm({ donorName: '', donorEmail: '', amount: 500, message: '' });
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', () =>
        toast.error('Payment failed or cancelled. Please try again.')
      );
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to initiate donation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fb-donate-page">
      <Particles />

      {showSuccess && <SuccessSplash onClose={() => setShowSuccess(false)} />}

      {/* ── Card ── */}
      <div className="fb-donate-card" ref={cardRef}>
        <p className="fb-donate-chip">🔒 Secure payment integration</p>

        <h1>
          Donate for <span>food support</span>
        </h1>
        <p className="fb-donate-subtitle">
          Every rupee feeds someone who needs it today. UPI, cards, net banking,
          and wallets accepted — safe, instant, and transparent.
        </p>

        {/* preset amounts */}
        <div className="fb-amount-presets">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              className={`fb-preset-btn ${form.amount === p.value ? 'active' : ''}`}
              onClick={() => selectPreset(p.value)}
            >
              <span>{p.emoji} {p.label}</span>
            </button>
          ))}
        </div>

        {/* form grid */}
        <div className="fb-donate-grid">
          <label>
            Full Name
            <div className="fb-input-wrap">
              <span className="fb-input-icon">👤</span>
              <input
                name="donorName"
                value={form.donorName}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>
          </label>

          <label>
            Email
            <div className="fb-input-wrap">
              <span className="fb-input-icon">✉️</span>
              <input
                name="donorEmail"
                type="email"
                value={form.donorEmail}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>
          </label>

          <label>
            Amount (₹)
            <div className="fb-input-wrap">
              <span className="fb-input-icon">₹</span>
              <input
                name="amount"
                type="number"
                min="1"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>
          </label>

          <label className="full-width">
            Message <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="3"
              placeholder="Leave a kind word for the team ✨"
            />
          </label>
        </div>

        <div className="fb-divider">choose your impact</div>

        {/* CTA */}
        <button
          type="button"
          className="fb-donate-btn"
          onClick={openCheckout}
          disabled={submitting}
        >
          {ripples.map((r) => (
            <span
              key={r.id}
              className="btn-ripple"
              style={{ left: r.x, top: r.y }}
            />
          ))}
          <span className="fb-btn-inner">
            {submitting ? (
              <>⏳ Processing…</>
            ) : (
              <>
                Donate ₹{Number(form.amount).toLocaleString('en-IN')} Securely
                <span className="fb-btn-icon">→</span>
              </>
            )}
          </span>
        </button>

        {/* trust signals */}
        <div className="fb-trust-bar">
          <span className="fb-trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            256-bit SSL
          </span>
          <span className="fb-trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            RBI Compliant
          </span>
          <span className="fb-trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            Instant Receipt
          </span>
          <span className="fb-trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            100% Transparent
          </span>
        </div>
      </div>
    </div>
  );
}

export default DonateMoneyPage;
