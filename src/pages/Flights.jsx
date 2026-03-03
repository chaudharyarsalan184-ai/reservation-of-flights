import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import MetaTags from '../components/MetaTags';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FlightResultCard from '../components/FlightResultCard';
import BackToTop from '../components/BackToTop';
import { apiService } from '../services/api';
import { getAirlineName, formatDuration } from '../utils/airlines';
import { AIRPORTS } from '../data/airports';

const getCityFromCode = (code) => AIRPORTS.find((a) => a.code === code)?.city || code;

const SAMPLE_FLIGHTS = [
  {
    id: 's1',
    airline: 'Delta Air Lines',
    airlineCode: 'DL',
    logo: 'https://www.gstatic.com/flights/airline_logos/70px/DL.png',
    price: '306.81',
    isRoundTrip: true,
    outbound: { departureTime: '19:35', departureCode: 'JFK', departureCity: 'New York', arrivalTime: '23:15', arrivalCode: 'SFO', arrivalCity: 'San Francisco', duration: '06:40', stops: 'Non-Stop' },
    returnFlight: { departureTime: '14:04', departureCode: 'SFO', departureCity: 'San Francisco', arrivalTime: '22:29', arrivalCode: 'JFK', arrivalCity: 'New York', duration: '05:25', stops: 'Non-Stop', airlineCode: 'DL' },
  },
  {
    id: 's2',
    airline: 'United Airlines',
    airlineCode: 'UA',
    logo: 'https://www.gstatic.com/flights/airline_logos/70px/UA.png',
    price: '310',
    isRoundTrip: true,
    outbound: { departureTime: '08:00', departureCode: 'JFK', departureCity: 'New York', arrivalTime: '11:20', arrivalCode: 'SFO', arrivalCity: 'San Francisco', duration: '06:20', stops: 'Non-Stop' },
    returnFlight: { departureTime: '07:00', departureCode: 'SFO', departureCity: 'San Francisco', arrivalTime: '15:28', arrivalCode: 'JFK', arrivalCity: 'New York', duration: '05:28', stops: 'Non-Stop', airlineCode: 'UA' },
  },
];

const AIRLINE_OPTIONS = ['All', 'Delta Air Lines', 'United Airlines', 'American Airlines', 'Frontier Airlines', 'Alaska Airlines'];

function Flights() {
  const [searchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedAirlines, setSelectedAirlines] = useState(['All']);
  const [stops, setStops] = useState('all');
  const [departureTime, setDepartureTime] = useState('all');
  const [filterSearch, setFilterSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [flights, setFlights] = useState(SAMPLE_FLIGHTS);
  const [searchMeta, setSearchMeta] = useState({ from: '', to: '', fromLabel: 'New York', toLabel: 'London' });
  const lastProcessedKey = useRef('');

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const departureDate = searchParams.get('departureDate') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const passengers = searchParams.get('passengers') || '1';
  const tripType = searchParams.get('tripType') || 'one-way';

  const searchKey = useMemo(() => `${from}-${to}-${departureDate}-${returnDate}-${passengers}-${tripType}`, [from, to, departureDate, returnDate, passengers, tripType]);

  useEffect(() => {
    if (!from || !to || !departureDate) {
      setFlights(SAMPLE_FLIGHTS);
      setSearchMeta({ from: 'JFK', to: 'SFO', fromLabel: 'New York', toLabel: 'San Francisco' });
      return;
    }

    if (lastProcessedKey.current === searchKey) return;

    lastProcessedKey.current = searchKey;
    let cancelled = false;

    const fetchFlights = async () => {
      if (cancelled) return;
      setIsLoading(true);
      setError(null);
      try {
        const params = {
          originLocationCode: from,
          destinationLocationCode: to,
          departureDate,
          adults: passengers,
        };
        if (returnDate && tripType === 'round-trip') {
          params.returnDate = returnDate;
          params.tripType = 'round-trip';
        }

        const offers = await apiService.searchFlights(params);
        if (cancelled) return;

        const offerList = Array.isArray(offers) ? offers : [];
        const transformed = [];
        const fromCity = getCityFromCode(from);
        const toCity = getCityFromCode(to);

        offerList.forEach((offer, idx) => {
          const outboundItinerary = offer.itineraries?.[0];
          const returnItinerary = offer.itineraries?.[1];
          const isRoundTrip = tripType === 'round-trip' && returnItinerary?.segments?.length > 0;

          if (!outboundItinerary?.segments?.length) return;

          const outFirstSeg = outboundItinerary.segments[0];
          const outLastSeg = outboundItinerary.segments[outboundItinerary.segments.length - 1];
          const airlineCode = outFirstSeg.carrierCode;
          const airline = getAirlineName(airlineCode);
          const outStops = outboundItinerary.segments.length - 1;

          const outbound = {
            departureTime: new Date(outFirstSeg.departure.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            departureCode: outFirstSeg.departure.iataCode,
            departureCity: fromCity,
            arrivalTime: new Date(outLastSeg.arrival.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            arrivalCode: outLastSeg.arrival.iataCode,
            arrivalCity: toCity,
            duration: formatDuration(outboundItinerary.duration || 'PT0H0M'),
            stops: outStops === 0 ? 'Non-Stop' : `${outStops} Stop${outStops > 1 ? 's' : ''}`,
          };

          let returnFlight = null;
          if (isRoundTrip && returnItinerary?.segments?.length > 0) {
            const retFirstSeg = returnItinerary.segments[0];
            const retLastSeg = returnItinerary.segments[returnItinerary.segments.length - 1];
            const retAirlineCode = retFirstSeg.carrierCode;
            const retStops = returnItinerary.segments.length - 1;
            returnFlight = {
              departureTime: new Date(retFirstSeg.departure.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
              departureCode: retFirstSeg.departure.iataCode,
              departureCity: toCity,
              arrivalTime: new Date(retLastSeg.arrival.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
              arrivalCode: retLastSeg.arrival.iataCode,
              arrivalCity: fromCity,
              duration: formatDuration(returnItinerary.duration || 'PT0H0M'),
              stops: retStops === 0 ? 'Non-Stop' : `${retStops} Stop${retStops > 1 ? 's' : ''}`,
              airlineCode: retAirlineCode,
            };
          }

          transformed.push({
            id: offer.id || `f-${idx}`,
            airline,
            airlineCode,
            logo: `https://www.gstatic.com/flights/airline_logos/70px/${airlineCode}.png`,
            price: offer.price?.total?.toString() || '0',
            isRoundTrip,
            outbound,
            returnFlight,
          });
        });

        setFlights(transformed);
        setSearchMeta({ from, to, fromLabel: from, toLabel: to });
      } catch (err) {
        if (!cancelled) {
          setError(err.isTimeout ? 'Search is taking longer than expected. Please try again.' : err.isNetworkError ? 'Unable to connect. Check your internet connection.' : err.message || 'Failed to fetch flights.');
          setFlights([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchFlights();
    return () => {
      cancelled = true;
      lastProcessedKey.current = '';
    };
  }, [searchKey, from, to, departureDate, returnDate, passengers, tripType]);

  const filteredFlights = useMemo(() => {
    return flights.filter((f) => {
      const price = parseFloat(f.price) || 0;
      if (price < priceRange[0] || price > priceRange[1]) return false;
      if (selectedAirlines[0] !== 'All' && !selectedAirlines.includes(f.airline)) return false;
      const outStops = f.outbound?.stops || '';
      if (stops === 'non-stop' && outStops !== 'Non-Stop') return false;
      if (stops === '1-stop' && !outStops.startsWith('1')) return false;
      return true;
    });
  }, [flights, priceRange, selectedAirlines, stops]);

  const bestPriceByAirline = useMemo(() => {
    const byAirline = {};
    filteredFlights.forEach((f) => {
      const p = parseFloat(f.price) || 0;
      if (!byAirline[f.airline] || p < byAirline[f.airline].price) {
        byAirline[f.airline] = { price: p, airlineCode: f.airlineCode };
      }
    });
    return Object.entries(byAirline)
      .map(([airline, { price, airlineCode }]) => ({ airline, price, airlineCode }))
      .sort((a, b) => a.price - b.price)
      .slice(0, 10);
  }, [filteredFlights]);

  const toggleAirline = (airline) => {
    if (airline === 'All') setSelectedAirlines(['All']);
    else {
      setSelectedAirlines((prev) => {
        const filtered = prev.filter((a) => a !== 'All');
        if (filtered.includes(airline)) {
          const next = filtered.filter((a) => a !== airline);
          return next.length ? next : ['All'];
        }
        return [...filtered, airline];
      });
    }
  };

  const airlineList = useMemo(() => {
    const airlines = [...new Set(flights.map((f) => f.airline))];
    return airlines.length ? ['All', ...airlines.sort()] : AIRLINE_OPTIONS;
  }, [flights]);

  return (
    <>
      <MetaTags
        title="Search Flights - Book Domestic & International Flights"
        description="Search and compare flights from top airlines. Find the best deals on flight bookings."
      />
      <Navbar />
      <main className="w-full">
        <section className="w-full bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link to="/" className="inline-flex items-center text-[#FF6B35] hover:text-[#e55a28] mb-2 text-sm font-medium">
              ← Back to Search
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Flight Results</h1>
            <p className="text-gray-600 text-sm mt-1">
              {isLoading ? 'Searching...' : error ? 'Error loading flights' : `${getCityFromCode(from) || searchMeta.fromLabel || from} → ${getCityFromCode(to) || searchMeta.toLabel || to}${departureDate ? ` • ${departureDate}` : ''} • ${passengers} passenger${parseInt(passengers, 10) > 1 ? 's' : ''}`}
            </p>
          </div>
        </section>

        {isLoading && (
          <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            <div className="inline-block w-10 h-10 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600">Searching for flights...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <a href="/" className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a28]">
              Back to Search
            </a>
          </div>
        )}

        {!isLoading && !error && (
          <section className="w-full section-spacing-last bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Sidebar - Best Price by Airlines + Filters */}
                <aside className="lg:col-span-1">
                  <div className="sticky top-6 space-y-6">
                    {/* Best Price by Airlines */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Best Price by Airlines</h2>
                        <button type="button" className="text-[#FF6B35] hover:text-[#e55a28] font-semibold text-sm">
                          Show All
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Airline</th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bestPriceByAirline.map(({ airline, price, airlineCode }) => (
                              <tr key={airline} className="border-b border-gray-100">
                                <td className="px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={`https://www.gstatic.com/flights/airline_logos/70px/${airlineCode}.png`}
                                      alt=""
                                      className="w-5 h-5 object-contain"
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                    <span className="font-medium text-gray-900 text-xs">{airline}</span>
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-center text-[#FF6B35] font-semibold text-xs">
                                  ${price.toFixed(0)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Filter Your Search */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Filter Your Search</h3>
                      <input
                        type="text"
                        placeholder="Type here to search"
                        value={filterSearch}
                        onChange={(e) => setFilterSearch(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-4"
                      />
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="number"
                              value={priceRange[0]}
                              onChange={(e) => setPriceRange(([, max]) => [parseInt(e.target.value, 10) || 0, max])}
                              className="w-20 px-2 py-1 border rounded text-sm"
                            />
                            <span className="text-gray-500">-</span>
                            <input
                              type="number"
                              value={priceRange[1]}
                              onChange={(e) => setPriceRange(([min]) => [min, parseInt(e.target.value, 10) || 500])}
                              className="w-20 px-2 py-1 border rounded text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Airlines</label>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {airlineList.map((a) => (
                              <label key={a} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedAirlines.includes(a) || (a === 'All' && selectedAirlines[0] === 'All')}
                                  onChange={() => toggleAirline(a)}
                                  className="rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                                />
                                <span className="text-sm text-gray-700">{a}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Stops</label>
                          <select value={stops} onChange={(e) => setStops(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                            <option value="all">All</option>
                            <option value="non-stop">Non-stop only</option>
                            <option value="1-stop">1 Stop</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Main Content - Search Summary + Flight Cards */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Search Summary Bar */}
                  <div className="bg-[#FF6B35] text-white px-6 py-3 rounded-lg">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-sm">
                        {getCityFromCode(from)} ({from}) → {getCityFromCode(to)} ({to}) • {departureDate}
                        {returnDate && ` – ${returnDate}`} • {passengers} passenger{parseInt(passengers, 10) > 1 ? 's' : ''}
                      </span>
                      <span className="font-semibold">{filteredFlights.length} Results found</span>
                    </div>
                  </div>

                  {/* Flight Result Cards */}
                  {filteredFlights.length > 0 ? (
                    filteredFlights.map((flight, i) => (
                      <FlightResultCard
                        key={flight.id || `${flight.airline}-${i}`}
                        airline={flight.airline}
                        airlineCode={flight.airlineCode}
                        logo={flight.logo}
                        price={flight.price}
                        isRoundTrip={flight.isRoundTrip}
                        outbound={flight.outbound}
                        returnFlight={flight.returnFlight}
                      />
                    ))
                  ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                      No flights found for the selected criteria.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

export default Flights;
