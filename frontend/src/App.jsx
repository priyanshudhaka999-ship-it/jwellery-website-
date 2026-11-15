import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';

import HomePage from './pages/HomePage';
import CollectionsPage from './pages/CollectionsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import WishlistPage from './pages/WishlistPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ThankYouPage from './pages/ThankYouPage';
import FAQPage from './pages/FAQPage';
import LegalPage from './pages/LegalPage';
import NotFoundPage from './pages/NotFoundPage';

import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, search]);

  return null;
}

function AdminPortal() {
  const { admin } = useAuth();
  return admin ? <AdminDashboard /> : <AdminLogin />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StoreProvider>
          <Router>
            <ScrollToTop />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#FAF8F4',
                  color: '#3C2B20',
                  border: '1px solid #C89B5C',
                },
              }}
            />
            <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#3C2B20]">
              <Navbar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/collections" element={<CollectionsPage />} />
                  <Route path="/product/:slug" element={<ProductDetailsPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/thank-you" element={<ThankYouPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
                  <Route path="/terms-and-conditions" element={<LegalPage type="terms" />} />
                  <Route path="/return-and-exchange-policy" element={<LegalPage type="returns" />} />
                  <Route path="/pricing-disclaimer" element={<LegalPage type="disclaimer" />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminPortal />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>
              <Footer />
              <CookieBanner />
            </div>
          </Router>
        </StoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
