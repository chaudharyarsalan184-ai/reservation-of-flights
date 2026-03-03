import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Domestic deals - with IATA codes for flight search
const DOMESTIC_DEALS = [
  { from: 'Los Angeles', fromCode: 'LAX', to: 'Las Vegas', toCode: 'LAS', price: '136.89', date: '18 Mar 26', image: 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=200&q=80', alt: 'Las Vegas' },
  { from: 'New York', fromCode: 'JFK', to: 'Atlanta', toCode: 'ATL', price: '313.90', date: '22 Mar 26', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=200&q=80', alt: 'Atlanta' },
  { from: 'Washington DC', fromCode: 'IAD', to: 'Miami', toCode: 'MIA', price: '189.50', date: '25 Mar 26', image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200&q=80', alt: 'Miami' },
  { from: 'New York', fromCode: 'JFK', to: 'Orlando', toCode: 'MCO', price: '245.00', date: '20 Mar 26', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=200&q=80', alt: 'Orlando', featured: true },
  { from: 'Chicago', fromCode: 'ORD', to: 'Atlanta', toCode: 'ATL', price: '156.00', date: '28 Mar 26', image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=200&q=80', alt: 'Atlanta' },
];

// International deals - with IATA codes
const INTERNATIONAL_DEALS = [
  { from: 'New York', fromCode: 'JFK', to: 'London', toCode: 'LHR', price: '489.00', date: '15 Apr 26', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200&q=80', alt: 'London' },
  { from: 'Los Angeles', fromCode: 'LAX', to: 'Tokyo', toCode: 'NRT', price: '785.50', date: '18 Apr 26', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&q=80', alt: 'Tokyo' },
  { from: 'Miami', fromCode: 'MIA', to: 'Mexico City', toCode: 'MEX', price: '312.00', date: '22 Apr 26', image: 'https://images.unsplash.com/photo-1518639192441-8fcecf6d99c6?w=200&q=80', alt: 'Mexico City' },
  { from: 'Chicago', fromCode: 'ORD', to: 'Paris', toCode: 'CDG', price: '598.00', date: '10 Apr 26', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&q=80', alt: 'Paris', featured: true },
  { from: 'San Francisco', fromCode: 'SFO', to: 'Sydney', toCode: 'SYD', price: '892.00', date: '25 Apr 26', image: 'https://images.unsplash.com/photo-1523482580671-f216146beb83?w=200&q=80', alt: 'Sydney' },
];

function DealRow({ from, fromCode, to, toCode, price, date, image, alt, featured, onBook }) {
  return (
    <div
      className={`flex flex-wrap sm:flex-nowrap items-center gap-4 py-4 px-4 rounded-lg transition-colors border-b border-gray-100 last:border-b-0 ${
        featured ? 'bg-blue-50/70' : 'hover:bg-gray-50'
      }`}
    >
      <img
        src={image}
        alt={alt}
        className="w-14 h-14 rounded-full object-cover flex-shrink-0"
        loading="lazy"
      />
      <div className="flex-1 min-w-[140px]">
        <p className="font-medium text-gray-800">
          {from} to {to}
        </p>
      </div>
      <span className="text-gray-700 font-medium text-sm min-w-[70px]">${price}</span>
      <span className="text-gray-600 text-sm min-w-[70px]">{date}</span>
      <button
        type="button"
        onClick={() => onBook(fromCode, toCode)}
        className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium text-sm transition-colors flex-shrink-0 ${
          featured
            ? 'bg-[#FF6B35] text-white hover:bg-[#e55a28] shadow-sm'
            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
      >
        Book Now
      </button>
    </div>
  );
}

function FlightDealsSection() {
  const [activeTab, setActiveTab] = useState('domestic');
  const navigate = useNavigate();
  const deals = activeTab === 'domestic' ? DOMESTIC_DEALS : INTERNATIONAL_DEALS;

  const handleBookNow = (fromCode, toCode) => {
    const dep = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const ret = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    navigate(`/flights?from=${fromCode}&to=${toCode}&departureDate=${dep}&returnDate=${ret}&passengers=1&tripType=round-trip`);
  };

  return (
    <section className="w-full max-w-[100%] section-spacing bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs + View All */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('domestic')}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'domestic'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              Top Domestic Flight Deals
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('international')}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'international'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              Top International Flight Deals
            </button>
          </div>
          <Link
            to="/flights"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center gap-1"
          >
            View All
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Deals list */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {deals.map((deal) => (
            <DealRow key={`${deal.from}-${deal.to}-${deal.date}`} {...deal} onBook={handleBookNow} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FlightDealsSection;
