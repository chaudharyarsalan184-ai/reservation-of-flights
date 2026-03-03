import PropTypes from 'prop-types';

/**
 * Flight listing card with airline info, times, duration, and price.
 */
function FlightCard({ airline, logo, departureTime, arrivalTime, duration, price, stops = 'Non-stop' }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src={logo}
              alt={airline}
              className="w-10 h-10 object-contain"
              loading="lazy"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{airline}</h3>
            <p className="text-sm text-gray-500">{stops}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 sm:gap-8">
          <div>
            <p className="text-sm text-gray-500">Departure</p>
            <p className="font-semibold">{departureTime}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-semibold">{duration}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Arrival</p>
            <p className="font-semibold">{arrivalTime}</p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
          <p className="text-xl font-bold text-[#FF6B35]">${price}</p>
          <button
            type="button"
            className="px-4 py-2 bg-[#FF6B35] hover:bg-[#e55a28] text-white font-medium rounded-lg transition-colors"
          >
            Select Flight
          </button>
        </div>
      </div>
    </div>
  );
}

FlightCard.propTypes = {
  airline: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  departureTime: PropTypes.string.isRequired,
  arrivalTime: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  stops: PropTypes.string,
};

export default FlightCard;
