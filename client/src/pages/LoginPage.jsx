import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoginButton from '../components/auth/LoginButton';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAuth } from '../context/AuthContext';
import { resolveBaseURL } from '../services/api';

function LoginPage() {
  const isGoogleAuthEnabled = process.env.REACT_APP_ENABLE_GOOGLE_AUTH === 'true';
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithEmail, registerWithEmail } = useAuth();
  const error = searchParams.get('error');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useScrollReveal();

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        await registerWithEmail(formData);
        toast.success('Account created successfully');
      } else {
        await loginWithEmail({ email: formData.email, password: formData.password });
        toast.success('Logged in successfully');
      }

      navigate('/dashboard');
    } catch (err) {
      const fallbackMessage = err.message === 'Network Error'
        ? `Cannot reach server (${resolveBaseURL()}). Check backend deployment/envs.`
        : 'Authentication failed. Please try again.';
      toast.error(err.response?.data?.error || fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fb-page fb-login">
      <h1 className="fb-reveal">Login to FoodBridge</h1>
      <p className="fb-reveal">Sign in with email and password to continue.</p>
      {isGoogleAuthEnabled && error && <p className="fb-reveal fb-empty">Login failed. Please try Google sign-in again.</p>}

      <form className="fb-reveal" onSubmit={onSubmit} style={{ maxWidth: 420, width: '100%' }}>
        {isRegisterMode && (
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={onChange}
            required
            style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8 }}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={onChange}
          required
          style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8 }}
        />

        <input
          type="password"
          name="password"
          placeholder={isRegisterMode ? 'Password (min 8 chars)' : 'Password'}
          value={formData.password}
          onChange={onChange}
          minLength={8}
          required
          style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8 }}
        />

        <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: 12, borderRadius: 8 }}>
          {isSubmitting ? 'Please wait...' : isRegisterMode ? 'Create account' : 'Login'}
        </button>
      </form>

      <p className="fb-reveal" style={{ marginTop: 12 }}>
        {isRegisterMode ? 'Already have an account?' : 'New to FoodBridge?'}{' '}
        <button
          type="button"
          onClick={() => setIsRegisterMode((prev) => !prev)}
          style={{ background: 'none', border: 0, color: '#0077cc', cursor: 'pointer', padding: 0 }}
        >
          {isRegisterMode ? 'Login instead' : 'Create an account'}
        </button>
      </p>

      {isGoogleAuthEnabled && (
        <div className="fb-reveal">
          <LoginButton />
        </div>
      )}
    </div>
  );
}

export default LoginPage;
