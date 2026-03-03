import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Best Flight Deals - Multi-column links for flights only.
 * variant="overlay" for use on image background with dark overlay.
 */
const DEAL_CITIES = [
  'New York', 'Newark', 'Atlanta', 'Philadelphia', 'Minneapolis', 'Boston',
  'Tampa', 'St Louis', 'Indianapolis', 'London', 'Paris', 'Burbank',
  'Bogota', 'Hartford', 'Vancouver', 'Miami', 'Chicago', 'Los Angeles',
  'Dallas', 'Seattle', 'Las Vegas', 'Phoenix', 'San Francisco', 'Denver',
  'Houston', 'Orlando', 'Tokyo', 'Dubai', 'Singapore', 'Sydney',
  'Toronto', 'Montreal', 'Mexico City', 'Cancún', 'Barcelona', 'Rome',
];

function BestFlightDeals({ variant = 'default' }) {
  const isOverlay = variant === 'overlay';

  return (
    <div
      className={`rounded-xl p-6 sm:p-8 w-full ${
        isOverlay
          ? 'bg-white/10 backdrop-blur-sm border border-white/20'
          : 'bg-white shadow-lg border border-gray-100'
      }`}
    >
      <h2
        className={`text-base sm:text-lg font-bold mb-1 ${
          isOverlay ? 'text-white' : 'text-gray-800'
        }`}
      >
        Travel Deals for Top Destinations
      </h2>
      <p
        className={`text-sm mb-6 ${
          isOverlay ? 'text-white/80' : 'text-gray-500'
        }`}
      >
        We know a better way to get there
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-6 gap-y-4 max-h-[320px] overflow-y-auto pr-1">
        {DEAL_CITIES.map((city) => (
          <Link
            key={city}
            to={`/flights?to=${encodeURIComponent(city)}`}
            className={`text-sm hover:underline ${
              isOverlay
                ? 'text-white hover:text-white/90'
                : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            Flights To {city}
          </Link>
        ))}
      </div>
    </div>
  );
}

BestFlightDeals.propTypes = {
  variant: PropTypes.oneOf(['default', 'overlay']),
};

export default BestFlightDeals;
