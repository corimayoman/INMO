'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!Cookies.get('cookie_consent')) setVisible(true);
  }, []);

  const accept = () => {
    Cookies.set('cookie_consent', 'accepted', { expires: 365 });
    setVisible(false);
  };

  const decline = () => {
    Cookies.set('cookie_consent', 'declined', { expires: 365 });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-gray-300">
          We use cookies to improve your experience. By continuing, you agree to our{' '}
          <Link href="/cookies" className="underline hover:text-white">Cookie Policy</Link> and{' '}
          <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>.
        </p>
        <div className="flex gap-3 shrink-0">
          <button onClick={decline} className="px-4 py-2 text-sm border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors">
            Decline
          </button>
          <button onClick={accept} className="px-4 py-2 text-sm bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors">
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
