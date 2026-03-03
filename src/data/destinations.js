/**
 * Destination content and metadata for destination detail pages.
 */
export const DESTINATIONS = {
  london: {
    city: 'London',
    country: 'United Kingdom',
    iataCode: 'LHR',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
      'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80',
      'https://images.unsplash.com/photo-1486299266160-ec2a67b27a81?w=800&q=80',
    ],
    description: 'London is one of the world\'s most visited cities. From the historic Tower of London to the modern London Eye, discover world-class museums, royal palaces, vibrant markets, and iconic landmarks like Big Ben and Buckingham Palace.',
    slug: 'london',
  },
  cancun: {
    city: 'Cancun',
    country: 'Mexico',
    iataCode: 'CUN',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
      'https://images.unsplash.com/photo-1502082553048-f809c04cb5f1?w=800&q=80',
      'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&q=80',
    ],
    description: 'Cancun offers stunning white-sand beaches, crystal-clear Caribbean waters, and ancient Mayan ruins. Enjoy water sports, explore cenotes, or relax at all-inclusive resorts. Perfect for beach getaways and adventure seekers.',
    slug: 'cancun',
  },
  tokyo: {
    city: 'Tokyo',
    country: 'Japan',
    iataCode: 'NRT',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    ],
    description: 'Tokyo blends ancient tradition with cutting-edge technology. Experience serene temples, bustling districts like Shibuya and Shinjuku, world-class sushi, and unique cultural experiences from tea ceremonies to manga culture.',
    slug: 'tokyo',
  },
  paris: {
    city: 'Paris',
    country: 'France',
    iataCode: 'CDG',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      'https://images.unsplash.com/photo-1511739001486-6dee04adadcd?w=800&q=80',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
    ],
    description: 'The City of Light delights with the Eiffel Tower, Louvre Museum, Notre-Dame, and charming cafés. Stroll along the Seine, explore Montmartre, and savor French cuisine in one of the world\'s most romantic cities.',
    slug: 'paris',
  },
  'san-juan': {
    city: 'San Juan',
    country: 'Puerto Rico',
    iataCode: 'SJU',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
      'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80',
    ],
    description: 'San Juan combines Spanish colonial history with Caribbean beauty. Wander the cobbled streets of Old San Juan, visit El Morro fortress, enjoy vibrant nightlife, and relax on stunning beaches—all without needing a passport from the US.',
    slug: 'san-juan',
  },
};

export function getDestinationBySlug(slug) {
  return DESTINATIONS[slug] || null;
}
