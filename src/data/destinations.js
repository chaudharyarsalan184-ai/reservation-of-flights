/**
 * Destination content and metadata for destination detail pages.
 */
export const DESTINATIONS = {
  london: {
    city: 'London',
    country: 'United Kingdom',
    iataCode: 'LHR',
    image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    description: 'London is one of the world\'s most visited cities. From the historic Tower of London to the modern London Eye, discover world-class museums, royal palaces, vibrant markets, and iconic landmarks like Big Ben and Buckingham Palace.',
    slug: 'london',
  },
  cancun: {
    city: 'Cancun',
    country: 'Mexico',
    iataCode: 'CUN',
    image: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2685332/pexels-photo-2685332.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1680140/pexels-photo-1680140.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    description: 'Cancun offers stunning white-sand beaches, crystal-clear Caribbean waters, and ancient Mayan ruins. Enjoy water sports, explore cenotes, or relax at all-inclusive resorts. Perfect for beach getaways and adventure seekers.',
    slug: 'cancun',
  },
  tokyo: {
    city: 'Tokyo',
    country: 'Japan',
    iataCode: 'NRT',
    image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1616516/pexels-photo-1616516.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3782137/pexels-photo-3782137.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    description: 'Tokyo blends ancient tradition with cutting-edge technology. Experience serene temples, bustling districts like Shibuya and Shinjuku, world-class sushi, and unique cultural experiences from tea ceremonies to manga culture.',
    slug: 'tokyo',
  },
  paris: {
    city: 'Paris',
    country: 'France',
    iataCode: 'CDG',
    image: 'https://images.pexels.com/photos/941415/pexels-photo-941415.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      'https://images.pexels.com/photos/941415/pexels-photo-941415.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2265845/pexels-photo-2265845.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/161901/pexels-photo-161901.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    description: 'The City of Light delights with the Eiffel Tower, Louvre Museum, Notre-Dame, and charming cafés. Stroll along the Seine, explore Montmartre, and savor French cuisine in one of the world\'s most romantic cities.',
    slug: 'paris',
  },
  'san-juan': {
    city: 'San Juan',
    country: 'Puerto Rico',
    iataCode: 'SJU',
    image: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    description: 'San Juan combines Spanish colonial history with Caribbean beauty. Wander the cobbled streets of Old San Juan, visit El Morro fortress, enjoy vibrant nightlife, and relax on stunning beaches—all without needing a passport from the US.',
    slug: 'san-juan',
  },
};

export function getDestinationBySlug(slug) {
  return DESTINATIONS[slug] || null;
}
