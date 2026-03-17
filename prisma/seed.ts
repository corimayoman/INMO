import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminHash = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@worldpropertyfinder.com' },
    update: {},
    create: {
      email: 'admin@worldpropertyfinder.com',
      passwordHash: adminHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
      emailVerified: true,
    },
  });

  // Create demo agent
  const agentHash = await bcrypt.hash('Agent123!', 12);
  const agentUser = await prisma.user.upsert({
    where: { email: 'agent@demo.com' },
    update: {},
    create: {
      email: 'agent@demo.com',
      passwordHash: agentHash,
      firstName: 'Maria',
      lastName: 'Garcia',
      role: 'AGENT',
      emailVerified: true,
    },
  });

  // Create demo agency
  const agency = await prisma.agency.upsert({
    where: { slug: 'premium-realty-madrid' },
    update: {},
    create: {
      name: 'Premium Realty Madrid',
      slug: 'premium-realty-madrid',
      description: 'Leading real estate agency in Madrid with 20+ years of experience.',
      country: 'Spain',
      city: 'Madrid',
      isVerified: true,
    },
  });

  // Create agent profile
  const agent = await prisma.agent.upsert({
    where: { userId: agentUser.id },
    update: {},
    create: {
      userId: agentUser.id,
      agencyId: agency.id,
      languages: ['en', 'es'],
      specialties: ['Residential', 'Luxury'],
      isVerified: true,
    },
  });

  // Create sample locations
  const locations = [
    { id: 'ES-Madrid-28001-40.4168--3.7038', country: 'Spain', countryCode: 'ES', city: 'Madrid', neighborhood: 'Centro', postalCode: '28001', address: 'Calle Gran Via 1', latitude: 40.4168, longitude: -3.7038, geohash: 'ezjmg' },
    { id: 'ES-Marbella-29600-36.5101--4.8825', country: 'Spain', countryCode: 'ES', city: 'Marbella', neighborhood: 'Golden Mile', postalCode: '29600', latitude: 36.5101, longitude: -4.8825, geohash: 'eyp0k' },
    { id: 'GB-London-SW1A-51.5074--0.1278', country: 'United Kingdom', countryCode: 'GB', city: 'London', neighborhood: 'Westminster', postalCode: 'SW1A', latitude: 51.5074, longitude: -0.1278, geohash: 'gcpvj' },
    { id: 'US-Miami-33101-25.7617--80.1918', country: 'United States', countryCode: 'US', city: 'Miami', neighborhood: 'Downtown', postalCode: '33101', latitude: 25.7617, longitude: -80.1918, geohash: 'dhwfw' },
    { id: 'FR-Paris-75001-48.8566-2.3522', country: 'France', countryCode: 'FR', city: 'Paris', neighborhood: 'Marais', postalCode: '75001', latitude: 48.8566, longitude: 2.3522, geohash: 'u09wj' },
  ];

  for (const loc of locations) {
    await prisma.location.upsert({ where: { id: loc.id }, update: {}, create: loc });
  }

  // Create sample listings
  const sampleListings = [
    {
      title: 'Stunning 3-Bedroom Apartment in Madrid Centro',
      slug: 'stunning-3-bedroom-apartment-madrid-centro',
      description: 'Beautiful renovated apartment in the heart of Madrid. Features high ceilings, original hardwood floors, and a private terrace with city views.',
      listingType: 'SALE' as const,
      propertyType: 'APARTMENT' as const,
      status: 'ACTIVE' as const,
      locationId: 'ES-Madrid-28001-40.4168--3.7038',
      agentId: agent.id,
      agencyId: agency.id,
      price: 485000,
      currency: 'EUR',
      pricePerSqm: 5389,
      builtArea: 90,
      bedrooms: 3,
      bathrooms: 2,
      hasBalcony: true,
      hasElevator: true,
      hasAirConditioning: true,
      isFurnished: false,
      isFeatured: true,
      publishedAt: new Date(),
      amenities: ['Gym', 'Concierge', 'Storage room'],
    },
    {
      title: 'Luxury Villa with Pool - Marbella Golden Mile',
      slug: 'luxury-villa-pool-marbella-golden-mile',
      description: 'Exceptional villa on the prestigious Golden Mile. Private pool, landscaped gardens, and panoramic sea views. Walking distance to the beach.',
      listingType: 'SALE' as const,
      propertyType: 'VILLA' as const,
      status: 'ACTIVE' as const,
      locationId: 'ES-Marbella-29600-36.5101--4.8825',
      agentId: agent.id,
      agencyId: agency.id,
      price: 2850000,
      currency: 'EUR',
      pricePerSqm: 5700,
      builtArea: 500,
      lotArea: 1200,
      bedrooms: 5,
      bathrooms: 4,
      hasPool: true,
      hasGarden: true,
      hasTerrace: true,
      hasParking: true,
      hasAirConditioning: true,
      isFurnished: true,
      isFeatured: true,
      publishedAt: new Date(),
      amenities: ['Home cinema', 'Wine cellar', 'Staff quarters', 'Smart home'],
    },
    {
      title: 'Modern Studio Apartment - Central London',
      slug: 'modern-studio-apartment-central-london',
      description: 'Stylish studio apartment in Westminster. Recently refurbished with high-end finishes. Perfect for professionals.',
      listingType: 'RENT' as const,
      propertyType: 'STUDIO' as const,
      status: 'ACTIVE' as const,
      locationId: 'GB-London-SW1A-51.5074--0.1278',
      agentId: agent.id,
      agencyId: agency.id,
      price: 2800,
      currency: 'GBP',
      builtArea: 35,
      bedrooms: 0,
      bathrooms: 1,
      hasElevator: true,
      isFurnished: true,
      publishedAt: new Date(),
      amenities: ['Concierge', 'Gym', 'Roof terrace'],
    },
    {
      title: 'Waterfront Condo with Bay Views - Miami',
      slug: 'waterfront-condo-bay-views-miami',
      description: 'Spectacular waterfront condo in downtown Miami. Floor-to-ceiling windows with stunning Biscayne Bay views. Resort-style amenities.',
      listingType: 'SALE' as const,
      propertyType: 'APARTMENT' as const,
      status: 'ACTIVE' as const,
      locationId: 'US-Miami-33101-25.7617--80.1918',
      agentId: agent.id,
      agencyId: agency.id,
      price: 1250000,
      currency: 'USD',
      pricePerSqm: 8929,
      builtArea: 140,
      bedrooms: 2,
      bathrooms: 2,
      hasPool: true,
      hasParking: true,
      hasAirConditioning: true,
      isFurnished: false,
      isFeatured: true,
      publishedAt: new Date(),
      amenities: ['Pool', 'Gym', 'Spa', 'Valet parking', 'Concierge'],
    },
    {
      title: 'Charming Haussmann Apartment - Le Marais, Paris',
      slug: 'charming-haussmann-apartment-marais-paris',
      description: 'Classic Haussmann-style apartment in the vibrant Marais district. Original parquet floors, high ceilings, and beautiful moldings.',
      listingType: 'SALE' as const,
      propertyType: 'APARTMENT' as const,
      status: 'ACTIVE' as const,
      locationId: 'FR-Paris-75001-48.8566-2.3522',
      agentId: agent.id,
      agencyId: agency.id,
      price: 920000,
      currency: 'EUR',
      pricePerSqm: 12267,
      builtArea: 75,
      bedrooms: 2,
      bathrooms: 1,
      hasElevator: true,
      isFurnished: false,
      publishedAt: new Date(),
      amenities: ['Cellar', 'Bike storage'],
    },
  ];

  for (const listing of sampleListings) {
    const existing = await prisma.listing.findUnique({ where: { slug: listing.slug } });
    if (!existing) {
      const created = await prisma.listing.create({ data: listing });
      // Add placeholder media
      await prisma.listingMedia.create({
        data: {
          listingId: created.id,
          type: 'IMAGE',
          url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=800&h=600&fit=crop`,
          isPrimary: true,
          sortOrder: 0,
        },
      });
    }
  }

  // Create sample source connectors
  await prisma.sourceConnector.upsert({
    where: { id: 'connector-spain-idealista' },
    update: {},
    create: {
      id: 'connector-spain-idealista',
      name: 'Spain - Idealista Partner API',
      country: 'Spain',
      countryCode: 'ES',
      connectorType: 'spain-idealista',
      config: { apiKey: 'REPLACE_WITH_REAL_KEY', apiSecret: 'REPLACE_WITH_REAL_SECRET', rateLimit: 60 },
      isActive: false,
      cronSchedule: '0 */6 * * *',
    },
  });

  await prisma.sourceConnector.upsert({
    where: { id: 'connector-uk-rightmove' },
    update: {},
    create: {
      id: 'connector-uk-rightmove',
      name: 'UK - Rightmove Data Feed',
      country: 'United Kingdom',
      countryCode: 'GB',
      connectorType: 'uk-rightmove',
      config: { feedUrl: 'https://api.rightmove.co.uk', apiKey: 'REPLACE_WITH_REAL_KEY', rateLimit: 120 },
      isActive: false,
      cronSchedule: '0 */4 * * *',
    },
  });

  await prisma.sourceConnector.upsert({
    where: { id: 'connector-us-mls' },
    update: {},
    create: {
      id: 'connector-us-mls',
      name: 'US - RESO Web API / MLS',
      country: 'United States',
      countryCode: 'US',
      connectorType: 'us-reso-mls',
      config: { apiUrl: 'https://api.mlsgrid.com/v2', apiKey: 'REPLACE_WITH_REAL_KEY', rateLimit: 200 },
      isActive: false,
      cronSchedule: '0 */2 * * *',
    },
  });

  console.log('Seed complete!');
  console.log('Admin login: admin@worldpropertyfinder.com / Admin123!');
  console.log('Agent login: agent@demo.com / Agent123!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
