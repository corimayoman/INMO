'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Globe, Heart, Bell, Menu, X, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Buy', href: '/search?listingType=SALE' },
  { label: 'Rent', href: '/search?listingType=RENT' },
  { label: 'Short-term', href: '/search?listingType=SHORT_TERM' },
  { label: 'Commercial', href: '/search?listingType=COMMERCIAL' },
  { label: 'New Developments', href: '/search?listingType=NEW_DEVELOPMENT' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 bg-purple-950 border-b border-purple-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <Globe className="w-6 h-6 text-pink-400" />
            <span className="hidden sm:block">WorldPropertyFinder</span>
            <span className="sm:hidden">WPF</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="px-3 py-2 text-sm font-medium text-purple-200 hover:text-white hover:bg-purple-800 rounded-lg transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link href="/favorites" className="btn-ghost text-purple-200 hover:text-white hidden sm:flex">
                  <Heart className="w-4 h-4" />
                </Link>
                <Link href="/dashboard/notifications" className="btn-ghost text-purple-200 hover:text-white hidden sm:flex">
                  <Bell className="w-4 h-4" />
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-800 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center font-medium">
                      {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase()}
                    </div>
                    <ChevronDown className="w-3 h-3 text-purple-300" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-pink-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-purple-900 hover:bg-pink-50">Dashboard</Link>
                    <Link href="/dashboard/listings" className="block px-4 py-2 text-sm text-purple-900 hover:bg-pink-50">My Listings</Link>
                    <Link href="/favorites" className="block px-4 py-2 text-sm text-purple-900 hover:bg-pink-50">Favorites</Link>
                    <Link href="/dashboard/settings" className="block px-4 py-2 text-sm text-purple-900 hover:bg-pink-50">Settings</Link>
                    <hr className="my-1 border-pink-100" />
                    <button onClick={clearAuth} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign out</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hidden sm:flex px-4 py-2 text-sm font-medium text-purple-200 hover:text-white hover:bg-purple-800 rounded-lg transition-colors">Sign in</Link>
                <Link href="/auth/register" className="btn-primary text-sm bg-pink-500 hover:bg-pink-600 border-0">List property</Link>
              </>
            )}
            <button className="lg:hidden p-2 text-purple-200 hover:text-white hover:bg-purple-800 rounded-lg transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-purple-800 bg-purple-900 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block px-3 py-2 text-sm font-medium text-purple-200 hover:text-white hover:bg-purple-800 rounded-lg" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
