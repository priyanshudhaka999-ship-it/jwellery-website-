import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[AARANYA ErrorBoundary]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F4] text-[#3C2B20] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-8 text-center shadow-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-[#C89B5C] mb-2">AARANYA System Notice</p>
            <h1 className="font-serif text-3xl mb-3">Something Interrupted This View</h1>
            <p className="text-sm text-[#827466] mb-6">
              Our catalogue encountered an unexpected display error. Your wishlist and session remain intact.
            </p>
            <button
              onClick={() => (window.location.href = '/')}
              className="px-6 py-3 bg-[#C89B5C] text-white text-sm font-medium rounded-lg hover:bg-[#b5894c] transition"
            >
              Return to AARANYA Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
