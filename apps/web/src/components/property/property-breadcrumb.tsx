import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function PropertyBreadcrumb({ listing }: { listing: any }) {
  const { location } = listing;
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: location?.country, href: `/search?countryCode=${location?.countryCode}` },
    { label: location?.city, href: `/search?city=${location?.city}&countryCode=${location?.countryCode}` },
    { label: listing.title, href: null },
  ].filter((c) => c.label);

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-brand-600 transition-colors">{crumb.label}</Link>
          ) : (
            <span className="text-gray-900 font-medium truncate max-w-xs">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
