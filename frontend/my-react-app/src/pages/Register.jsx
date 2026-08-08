import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', otp: '' });
  const navigate = useNavigate();

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function sendOtp(e) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3003/users/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('OTP sent to your email.');
        setOtpSent(true);
      } else {
        alert(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      console.log('Request failed:', err);
      alert('Failed to send OTP.');
    }
  }

  async function verifyAndRegister(e) {
    e.preventDefault();
    if (!otpVerified) {
      try {
        const verifyResponse = await fetch('http://localhost:3003/users/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, code: form.otp }),
        });
        const verifyData = await verifyResponse.json();
        if (!verifyResponse.ok) {
          alert(verifyData.message || 'Invalid OTP.');
          return;
        }
        setOtpVerified(true);
      } catch (err) {
        alert('OTP verification failed.');
        return;
      }
    }

    try {
      const response = await fetch('http://localhost:3003/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registration successful! Please log in.');
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.log('Request failed:', err);
      alert('Registration failed. Please try again.');
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <form className="flex flex-col gap-4 bg-paper border border-line rounded p-6 w-full max-w-sm" onSubmit={verifyAndRegister}>
        <h1 className="text-2xl font-bold text-ink mb-2">Register</h1>

        <input type="text" placeholder="Username" className="border border-line p-2 rounded bg-white text-ink" name="name" value={form.name} onChange={updateField} required />
        <input type="email" placeholder="Email" className="border border-line p-2 rounded bg-white text-ink" name="email" value={form.email} onChange={updateField} required />

        {!otpSent && (
          <button type="button" onClick={sendOtp} className="bg-accent text-cream py-2 px-4 rounded hover:bg-accent-dark">
            Send OTP
          </button>
        )}

        {otpSent && (
          <>
            <input type="text" placeholder="Enter OTP" className="border border-line p-2 rounded bg-white text-ink" name="otp" value={form.otp} onChange={updateField} required />
            {!otpVerified && (
              <button type="button" onClick={verifyAndRegister} className="bg-sage text-cream py-2 px-4 rounded hover:opacity-90">
                Verify OTP
              </button>
            )}
            {otpVerified && <p className="text-sage text-sm">OTP verified. Enter your password to finish.</p>}
          </>
        )}

        <input type="password" placeholder="Password" className="border border-line p-2 rounded bg-white text-ink" name="password" value={form.password} onChange={updateField} required />

        <button type="submit" disabled={!otpVerified} className="bg-ink text-cream py-2 px-4 rounded hover:opacity-90 disabled:opacity-40">
          Register
        </button>
      </form>
    </div>
  )
}
