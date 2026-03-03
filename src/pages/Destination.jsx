import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MetaTags from '../components/MetaTags';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FlightResultCard from '../components/FlightResultCard';
import BackToTop from '../components/BackToTop';
import { getDestinationBySlug } from '../data/destinations';
import { FALLBACK_IMAGE } from '../utils/images';
import { apiService } from '../services/api';
import { getAirlineName, formatDuration } from '../utils/airlines';
import { AIRPORTS } from '../data/airports';

function getCityFromCode(code) {
  return AIRPORTS.find((a) => a.code === code)?.city || code;
}

function Destination() {
  const { city: slug } = useParams();
  const destination = getDestinationBySlug(slug);

  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = 'JFK';
  const to = destination?.iataCode || '';
  const departureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const returnDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const passengers = '1';
  const tripType = 'round-trip';

  useEffect(() => {
    if (!destination?.iataCode) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const fetchFlights = async () => {
      try {
        const offers = await apiService.searchFlights({
          originLocationCode: from,
          destinationLocationCode: to,
          departureDate,
          returnDate,
          adults: passengers,
          tripType: 'round-trip',
        });
        if (cancelled) return;

        const offerList = Array.isArray(offers) ? offers : [];
        const transformed = [];
        const fromCity = getCityFromCode(from);
        const toCity = destination.city;

        offerList.forEach((offer, idx) => {
          const outboundItinerary = offer.itineraries?.[0];
          const returnItinerary = offer.itineraries?.[1];

          if (!outboundItinerary?.segments?.length) return;

          const outFirstSeg = outboundItinerary.segments[0];
          const outLastSeg = outboundItinerary.segments[outboundItinerary.segments.length - 1];
          const airlineCode = outFirstSeg.carrierCode;
          const airline = getAirlineName(airlineCode);

          const outbound = {
            departureTime: new Date(outFirstSeg.departure.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            departureCode: outFirstSeg.departure.iataCode,
            departureCity: fromCity,
            arrivalTime: new Date(outLastSeg.arrival.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            arrivalCode: outLastSeg.arrival.iataCode,
            arrivalCity: toCity,
            duration: formatDuration(outboundItinerary.duration || 'PT0H0M'),
            stops: outboundItinerary.segments.length - 1 === 0 ? 'Non-Stop' : `${outboundItinerary.segments.length - 1} Stop(s)`,
          };

          let returnFlight = null;
          if (returnItinerary?.segments?.length > 0) {
            const retFirstSeg = returnItinerary.segments[0];
            const retLastSeg = returnItinerary.segments[returnItinerary.segments.length - 1];
            const retStops = returnItinerary.segments.length - 1;
            returnFlight = {
              departureTime: new Date(retFirstSeg.departure.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
              departureCode: retFirstSeg.departure.iataCode,
              departureCity: toCity,
              arrivalTime: new Date(retLastSeg.arrival.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
              arrivalCode: retLastSeg.arrival.iataCode,
              arrivalCity: fromCity,
              duration: formatDuration(returnItinerary.duration || 'PT0H0M'),
              stops: retStops === 0 ? 'Non-Stop' : `${retStops} Stop(s)`,
              airlineCode: retFirstSeg.carrierCode,
            };
          }

          transformed.push({
            id: offer.id || `f-${idx}`,
            airline,
            airlineCode,
            logo: `https://www.gstatic.com/flights/airline_logos/70px/${airlineCode}.png`,
            price: offer.price?.total?.toString() || '0',
            isRoundTrip: !!returnFlight,
            outbound,
            returnFlight,
          });
        });

        setFlights(transformed);
      } catch (err) {
        if (!cancelled) {
          setError(err.isNetworkError ? 'Unable to load flights. Try again later.' : err.message || 'Failed to load flights.');
          setFlights([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchFlights();
    return () => { cancelled = true; };
  }, [destination?.iataCode, destination?.city]);

  if (!destination) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Destination not found</h1>
            <Link to="/" className="mt-4 inline-block text-[#FF6B35] hover:underline">Back to Home</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const { city, country, image, images, description } = destination;

  return (
    <>
      <MetaTags
        title={`${city}, ${country} - Flights & Travel Guide`}
        description={description}
      />
      <Navbar />
      <main className="w-full">
        {/* City hero with beautiful image */}
        <section className="relative w-full h-[50vh] min-h-[320px]">
          <img
            src={image}
            alt={`${city}, ${country}`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
              {city}, {country}
            </h1>
            <p className="text-white/90 text-sm sm:text-base mt-2 max-w-2xl">
              Discover flights and explore this amazing destination
            </p>
          </div>
        </section>

        {/* City content - beautiful images and description */}
        <section className="w-full section-spacing bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {images.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden shadow-md aspect-[4/3]">
                  <img src={img} alt={`${city} view ${i + 1}`} className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.target.src = FALLBACK_IMAGE; }} />
                </div>
              ))}
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
          </div>
        </section>

        {/* Real flight deals to this city */}
        <section className="w-full section-spacing-last bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Flight Deals to {city}
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Round-trip from {getCityFromCode(from)} — Sample dates. Prices may vary.
            </p>

            {isLoading && (
              <div className="py-12 text-center">
                <div className="inline-block w-10 h-10 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-gray-600">Loading flight deals...</p>
              </div>
            )}

            {error && !isLoading && (
              <div className="py-12 text-center text-gray-600">
                <p>{error}</p>
                <Link to="/flights" className="mt-4 inline-block text-[#FF6B35] hover:underline">Search flights manually</Link>
              </div>
            )}

            {!isLoading && !error && flights.length > 0 && (
              <div className="space-y-4">
                {flights.slice(0, 6).map((flight, i) => (
                  <FlightResultCard
                    key={flight.id || i}
                    airline={flight.airline}
                    airlineCode={flight.airlineCode}
                    logo={flight.logo}
                    price={flight.price}
                    isRoundTrip={flight.isRoundTrip}
                    outbound={flight.outbound}
                    returnFlight={flight.returnFlight}
                  />
                ))}
              </div>
            )}

            {!isLoading && !error && flights.length === 0 && (
              <div className="py-12 text-center text-gray-600">
                <p>No flights found for the selected dates.</p>
                <Link
                  to={`/flights?from=${from}&to=${to}&departureDate=${departureDate}&returnDate=${returnDate}&passengers=1&tripType=round-trip`}
                  className="mt-4 inline-block px-6 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a28]"
                >
                  Search with different dates
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

export default Destination;
