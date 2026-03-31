import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoginButton from '../components/auth/LoginButton';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAuth } from '../context/AuthContext';
import { resolveBaseURL } from '../services/api';
import './LoginPage.css';

/* ─── Decorative food emojis ──────── */
const FOOD_ITEMS = ['🍞', '🥕', '🥗', '🍲', '🫘', '🥦', '🍎', '🌽'];

/* ─── Google "G" SVG ─────── */
function GoogleIcon() {
  return (
    <svg className="lp-google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

/* ─── Field wrapper ───────────────────────────────────── */
function Field({ label, icon, type, name, placeholder, value, onChange, minLength }) {
  return (
    <div className="lp-field">
      <label className="lp-label" htmlFor={name}>{label}</label>
      <div className="lp-input-wrap">
        <input className="lp-input" id={name} type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} minLength={minLength} required autoComplete={type === 'password' ? 'current-password' : name} />
        <span className="lp-input-icon" aria-hidden="true">{icon}</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const isGoogleAuthEnabled = process.env.REACT_APP_ENABLE_GOOGLE_AUTH !== 'false';
  const [searchParams]   = useSearchParams();
  const navigate         = useNavigate();
  const { loginWithEmail, registerWithEmail } = useAuth();

  const error            = searchParams.get('error');
  const [isRegister, setIsRegister]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useScrollReveal();

  const onChange = ({ target: { name, value } }) => setFormData(prev => ({ ...prev, [name]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isRegister) {
        await registerWithEmail(formData);
        toast.success('Account created! Welcome to FoodBridge 🎉');
      } else {
        await loginWithEmail({ email: formData.email, password: formData.password });
        toast.success('Welcome back! 🌿');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error('Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lp-root">
      <aside className="lp-left" aria-hidden="true">
        <div className="lp-deco-items">
          {FOOD_ITEMS.map((emoji, i) => <span key={i} className="lp-deco-item">{emoji}</span>)}
        </div>

        <div className="lp-left-content">
          <h1 className="lp-left-headline">
            Bridging surplus<br />
            to <span>feed people</span>
          </h1>

          <p className="lp-left-body">
            Every day, tonnes of good food go to waste while millions go hungry.
            FoodBridge connects donors with those who need it most — one meal at a time.
          </p>

          {/* New Testimonial Block */}
          <div className="lp-testimonial">
            <div className="lp-quote-icon">“</div>
            <p className="lp-quote-text">
              FoodBridge made it incredibly easy to redirect our catering surplus to local shelters. It’s a game-changer for our community.
            </p>
            <div className="lp-quote-author">
              <div className="lp-author-avatar">M</div>
              <div>
                <strong>Abhijeet Mazumdar</strong>
                <span>Asia Kitchen, Kolkata</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="lp-right">
        <div className="lp-form-wrap">
          <span className="lp-form-badge"><span className="dot" />{isRegister ? 'Join the movement' : 'Secure sign-in'}</span>
          <h2 className="lp-form-title">{isRegister ? 'Create your account' : 'Welcome back'}</h2>
          <p className="lp-form-sub">
            {isRegister ? 'Already have an account? ' : 'New to FoodBridge? '}
            <a role="button" tabIndex={0} onClick={() => setIsRegister(p => !p)}>
              {isRegister ? 'Sign in instead' : 'Create an account'}
            </a>
          </p>

          {isGoogleAuthEnabled && error && <div className="lp-error-banner" role="alert">⚠ Google sign-in failed. Please try again.</div>}

          <form onSubmit={onSubmit} noValidate>
            {isRegister && <Field label="Full name" icon="👤" type="text" name="name" placeholder="Jane Doe" value={formData.name} onChange={onChange} />}
            <Field label="Email address" icon="✉" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={onChange} />
            <Field label="Password" icon="🔒" type="password" name="password" placeholder={isRegister ? 'Minimum 8 characters' : '••••••••'} value={formData.password} onChange={onChange} minLength={8} />

            <button type="submit" className="lp-submit" disabled={isSubmitting}>
              {isSubmitting ? <><span className="lp-btn-spinner" /> Please wait…</> : isRegister ? '🌱 Create Account' : '→ Sign In'}
            </button>
          </form>

          {isGoogleAuthEnabled && (
            <>
              <div className="lp-divider">or continue with</div>
              <div className="lp-google-wrapper">
                <LoginButton />
              </div>
            </>
          )}

          <p className="lp-terms">
            By continuing you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
