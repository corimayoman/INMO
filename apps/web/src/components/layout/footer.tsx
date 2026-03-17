import Link from 'next/link';
import { Globe } from 'lucide-react';

const footerLinks = {
  'Find Property': [
    { label: 'Buy', href: '/search?listingType=SALE' },
    { label: 'Rent', href: '/search?listingType=RENT' },
    { label: 'Short-term', href: '/search?listingType=SHORT_TERM' },
    { label: 'Commercial', href: '/search?listingType=COMMERCIAL' },
    { label: 'New Developments', href: '/search?listingType=NEW_DEVELOPMENT' },
  ],
  'For Agents': [
    { label: 'List a property', href: '/dashboard/listings/new' },
    { label: 'Agent dashboard', href: '/dashboard' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'CRM tools', href: '/dashboard/crm' },
  ],
  Company: [
    { label: 'About us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'GDPR', href: '/gdpr' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <Globe className="w-5 h-5 text-brand-400" />
              WorldPropertyFinder
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              The global platform for finding your perfect property, anywhere in the world.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold text-sm mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} WorldPropertyFinder. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>🌍 Available worldwide</span>
            <span>•</span>
            <span>150+ countries</span>
            <span>•</span>
            <span>40+ languages</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
