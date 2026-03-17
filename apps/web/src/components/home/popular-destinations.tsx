import Link from 'next/link';

const destinations = [
  { city: 'Madrid', country: 'Spain', countryCode: 'ES', count: '12,400', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop' },
  { city: 'London', country: 'UK', countryCode: 'GB', count: '28,900', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop' },
  { city: 'Paris', country: 'France', countryCode: 'FR', count: '15,200', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop' },
  { city: 'Miami', country: 'USA', countryCode: 'US', count: '9,800', image: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=400&h=300&fit=crop' },
  { city: 'Dubai', country: 'UAE', countryCode: 'AE', count: '7,600', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop' },
  { city: 'Lisbon', country: 'Portugal', countryCode: 'PT', count: '5,400', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=300&fit=crop' },
];

export function PopularDestinations() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title">Popular Destinations</h2>
          <p className="text-gray-500 mt-2">Explore properties in the world's most sought-after locations</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {destinations.map((dest) => (
            <Link
              key={dest.city}
              href={`/search?city=${dest.city}&countryCode=${dest.countryCode}`}
              className="group relative rounded-xl overflow-hidden aspect-[3/4] block"
            >
              <img
                src={dest.image}
                alt={dest.city}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <div className="font-semibold text-sm">{dest.city}</div>
                <div className="text-xs text-gray-300">{dest.count} listings</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
