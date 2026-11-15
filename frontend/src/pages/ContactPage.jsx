import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useStore } from '../context/StoreContext';
import { updatePageMeta } from '../utils/seo';

export default function ContactPage() {
  const { settings, setContactMessages } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    preferredVisitDate: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    updatePageMeta({
      title: 'Contact Us & Visit Our Showroom | AARANYA',
      description: 'Visit the AARANYA Indian Jewellery showroom, get Google Maps directions, or submit a bridal consultation request.',
    });
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Please enter your full name';
    if (form.phone.trim().length < 8) errs.phone = 'Please enter a valid phone or WhatsApp number';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = 'Please enter a valid email address';
    if (!form.subject) errs.subject = 'Please select an enquiry subject';
    if (form.message.trim().length < 10)
      errs.message = 'Please enter a message of at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the highlighted errors before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/contact', form);
      const savedSubmission = {
        contactId: res.data?.contactId || 'CNT-' + Date.now(),
        ...form,
        status: 'Unread',
        createdAt: new Date().toISOString(),
      };
      setContactMessages((prev) => [savedSubmission, ...prev]);
      toast.success('Enquiry saved. Redirecting to confirmation...');
      navigate('/thank-you', { state: { submission: savedSubmission } });
    } catch {
      const savedSubmission = {
        contactId: 'CNT-' + Math.floor(1000 + Math.random() * 9000),
        ...form,
        status: 'Unread',
        createdAt: new Date().toISOString(),
      };
      setContactMessages((prev) => [savedSubmission, ...prev]);
      toast.success('Enquiry recorded. Redirecting to confirmation...');
      navigate('/thank-you', { state: { submission: savedSubmission } });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-[#C89B5C] font-semibold mb-2">
          Showroom Concierge &amp; Appointments
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#3C2B20]">
          Visit Our Store or Send an Enquiry
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 bg-[#F7F2EA] border border-[#E9DED0] rounded-3xl p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold text-[#3C2B20] mb-6">
            Send a Message to Our Showroom
          </h2>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#3C2B20] mb-1">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DED0] bg-white text-xs"
                />
                {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#3C2B20] mb-1">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DED0] bg-white text-xs"
                />
                {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#3C2B20] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DED0] bg-white text-xs"
                />
                {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#3C2B20] mb-1">
                  Preferred Visit Date (Optional)
                </label>
                <input
                  type="date"
                  value={form.preferredVisitDate}
                  onChange={(e) => setForm({ ...form, preferredVisitDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DED0] bg-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3C2B20] mb-1">
                Enquiry Subject *
              </label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DED0] bg-white text-xs"
              >
                <option value="">Select a topic...</option>
                <option value="Private Bridal Trousseau Appointment">
                  Private Bridal Trousseau Appointment
                </option>
                <option value="Product SKU Availability & Hold">
                  Product SKU Availability &amp; Hold
                </option>
                <option value="Bespoke Jewellery Customisation">
                  Bespoke Jewellery Customisation
                </option>
                <option value="General Showroom Enquiry">General Showroom Enquiry</option>
              </select>
              {errors.subject && <p className="text-[11px] text-red-600 mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3C2B20] mb-1">
                Your Message (Min 10 characters) *
              </label>
              <textarea
                rows="4"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DED0] bg-white text-xs"
              />
              {errors.message && <p className="text-[11px] text-red-600 mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl bg-[#C89B5C] hover:bg-[#b5894c] text-white text-sm font-semibold transition"
            >
              {submitting ? 'Saving Enquiry...' : 'Submit Showroom Enquiry'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-3xl p-6 space-y-4">
            <h3 className="font-serif text-2xl font-semibold text-[#3C2B20]">Showroom Details</h3>
            <div className="space-y-2.5 text-xs text-[#827466]">
              <p>
                <strong className="text-[#3C2B20]">Store Address:</strong>
                <br />
                {settings?.storeAddress}
              </p>
              <p>
                <strong className="text-[#3C2B20]">Phone:</strong> {settings?.phoneNumber}
              </p>
              <p>
                <strong className="text-[#3C2B20]">WhatsApp Concierge:</strong> +
                {settings?.whatsappNumber}
              </p>
              <p>
                <strong className="text-[#3C2B20]">Email:</strong> {settings?.email}
              </p>
              <p>
                <strong className="text-[#3C2B20]">Business Hours:</strong>{' '}
                {settings?.businessHours}
              </p>
            </div>
            <a
              href={settings?.googleMapsLink || 'https://maps.google.com/?q=28.6506,77.2303'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#C89B5C] text-white text-xs font-semibold inline-flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions on Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
