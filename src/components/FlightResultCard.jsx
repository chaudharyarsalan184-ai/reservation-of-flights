import PropTypes from 'prop-types';

/**
 * Flight result card with outbound and return in same card (side by side).
 * Matches skyfareshub layout, uses ROF color theme (#FF6B35).
 */
function FlightResultCard({
  airline,
  airlineCode,
  logo,
  price,
  isRoundTrip,
  outbound,
  returnFlight,
  onBook,
}) {
  const FlightLeg = ({ label, labelColor, depTime, depCode, depCity, arrTime, arrCode, arrCity, duration, stops, logo: legLogo }) => (
    <div className="border border-gray-200 rounded-lg p-4 flex-1 min-w-0">
      <div className={`text-sm font-semibold mb-3 ${labelColor}`}>{label}</div>
      <div className="flex items-center justify-between gap-2">
        <div className="text-center flex-1">
          <div className="font-bold text-lg">{depTime}</div>
          <div className="text-sm text-gray-600">{depCode}</div>
          <div className="text-xs text-gray-500 truncate">{depCity}</div>
        </div>
        <div className="flex flex-col items-center flex-shrink-0 px-2">
          <div className="w-6 h-6 text-gray-400">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
          <div className="text-xs font-medium text-gray-600 mt-0.5">{duration}</div>
          <div className="text-xs text-gray-500">{stops}</div>
        </div>
        <div className="text-center flex-1">
          <div className="font-bold text-lg">{arrTime}</div>
          <div className="text-sm text-gray-600">{arrCode}</div>
          <div className="text-xs text-gray-500 truncate">{arrCity}</div>
        </div>
      </div>
      {legLogo && (
        <div className="mt-2 flex justify-end">
          <img src={legLogo} alt="" className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-50 rounded-lg border flex items-center justify-center overflow-hidden">
            <img src={logo} alt={airline} className="w-10 h-10 object-contain" loading="lazy" onError={(e) => { e.target.src = ''; e.target.alt = airline; }} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{airline}</h3>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Best Deals</div>
          <div className="font-bold text-2xl text-[#FF6B35]">USD {parseFloat(price).toFixed(2)}</div>
          {isRoundTrip && <div className="text-xs text-gray-500">Round Trip Total</div>}
        </div>
      </div>

      <div className={`grid gap-4 mb-4 ${returnFlight ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
        <FlightLeg
          label={returnFlight ? 'Outbound Flight' : 'Flight'}
          labelColor="text-slate-600"
          depTime={outbound.departureTime}
          depCode={outbound.departureCode}
          depCity={outbound.departureCity}
          arrTime={outbound.arrivalTime}
          arrCode={outbound.arrivalCode}
          arrCity={outbound.arrivalCity}
          duration={outbound.duration}
          stops={outbound.stops}
          logo={logo}
        />
        {returnFlight && (
          <FlightLeg
            label="Return Flight"
            labelColor="text-[#FF6B35]"
            depTime={returnFlight.departureTime}
            depCode={returnFlight.departureCode}
            depCity={returnFlight.departureCity}
            arrTime={returnFlight.arrivalTime}
            arrCode={returnFlight.arrivalCode}
            arrCity={returnFlight.arrivalCity}
            duration={returnFlight.duration}
            stops={returnFlight.stops}
            logo={`https://www.gstatic.com/flights/airline_logos/70px/${returnFlight.airlineCode || airlineCode}.png`}
          />
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onBook?.()}
          className="px-8 py-3 bg-[#FF6B35] hover:bg-[#e55a28] text-white font-bold rounded-lg transition-colors"
        >
          BOOK NOW
        </button>
      </div>
    </div>
  );
}

FlightResultCard.propTypes = {
  airline: PropTypes.string.isRequired,
  airlineCode: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  isRoundTrip: PropTypes.bool,
  outbound: PropTypes.shape({
    departureTime: PropTypes.string.isRequired,
    departureCode: PropTypes.string.isRequired,
    departureCity: PropTypes.string.isRequired,
    arrivalTime: PropTypes.string.isRequired,
    arrivalCode: PropTypes.string.isRequired,
    arrivalCity: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    stops: PropTypes.string.isRequired,
  }).isRequired,
  returnFlight: PropTypes.shape({
    departureTime: PropTypes.string.isRequired,
    departureCode: PropTypes.string.isRequired,
    departureCity: PropTypes.string.isRequired,
    arrivalTime: PropTypes.string.isRequired,
    arrivalCode: PropTypes.string.isRequired,
    arrivalCity: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    stops: PropTypes.string.isRequired,
    airlineCode: PropTypes.string,
  }),
  onBook: PropTypes.func,
};

export default FlightResultCard;
