import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { updatePageMeta } from '../utils/seo';

export default function AdminLogin() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@aaranyajewels.example.com');
  const [password, setPassword] = useState('ChangeMeImmediately!2026');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    updatePageMeta({
      title: 'Admin Login | AARANYA',
      description: 'Protected administrator sign-in for AARANYA Fine Indian Jewellery.',
    });
    if (admin) {
      navigate('/admin');
    }
  }, [admin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both admin email and password.');
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Authenticated successfully');
      navigate('/admin');
    } catch (err) {
      setError(err.friendlyMessage || 'Invalid admin credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-4 py-16">
      <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-3xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full border-2 border-[#C89B5C] bg-[#FAF8F4] flex items-center justify-center mx-auto font-serif text-2xl font-bold">
            A
          </div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#C89B5C] font-bold">
            JWT + HTTP-Only Cookie Auth
          </p>
          <h1 className="font-serif text-3xl font-semibold text-[#3C2B20]">
            AARANYA Admin Sign In
          </h1>
          <p className="text-xs text-[#827466]">
            No public registration exists. Initial superadmin is seeded via{' '}
            <code className="bg-[#FAF8F4] px-1 border">scripts/seedAdmin.js</code>.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#3C2B20] mb-1">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DED0] bg-white text-xs text-[#3C2B20]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#3C2B20] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DED0] bg-white text-xs text-[#3C2B20]"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-[#C89B5C] hover:bg-[#b5894c] text-white text-xs font-semibold transition"
          >
            {submitting ? 'Signing In...' : 'Sign In to Admin Dashboard'}
          </button>
        </form>
      </div>
    </section>
  );
}
