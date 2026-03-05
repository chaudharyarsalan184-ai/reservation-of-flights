import { AIRPORTS } from '../data/airports';

export function getCityFromCode(code) {
  return AIRPORTS.find((a) => a.code === code)?.city || code;
}

export function buildBookingState(flight, from, to, departureDate, returnDate, passengers, tripType) {
  const fromCity = getCityFromCode(from) || flight.outbound?.departureCity;
  const toCity = getCityFromCode(to) || flight.outbound?.arrivalCity;
  const parseStops = (s) => (typeof s === 'string' && s === 'Non-Stop') ? 0 : parseInt(String(s || '0').replace(/\D/g, ''), 10) || 0;
  const out = flight.outbound;
  const ret = flight.returnFlight;
  const outboundRef = out ? {
    airline: flight.airline,
    airlineCode: flight.airlineCode,
    flightNumber: `${flight.airlineCode} 1`,
    departure: { time: out.departureTime, airport: fromCity, city: fromCity, code: out.departureCode },
    arrival: { time: out.arrivalTime, airport: toCity, city: toCity, code: out.arrivalCode },
    duration: out.duration,
    stops: parseStops(out.stops),
  } : null;
  const returnRef = ret ? {
    airline: ret.airlineCode ? (flight.airline || `${ret.airlineCode} Airlines`) : flight.airline,
    airlineCode: ret.airlineCode || flight.airlineCode,
    flightNumber: `${ret.airlineCode || flight.airlineCode} 1`,
    departure: { time: ret.departureTime, airport: toCity, city: toCity, code: ret.departureCode },
    arrival: { time: ret.arrivalTime, airport: fromCity, city: fromCity, code: ret.arrivalCode },
    duration: ret.duration,
    stops: parseStops(ret.stops),
  } : null;
  const combinedFlight = {
    id: flight.id,
    airline: flight.airline,
    airlineCode: flight.airlineCode,
    flightNumber: outboundRef?.flightNumber,
    departure: outboundRef?.departure,
    arrival: outboundRef?.arrival,
    duration: outboundRef?.duration,
    stops: outboundRef?.stops ?? 0,
    price: parseFloat(flight.price || 0),
    returnFlight: returnRef,
  };
  return {
    flight: combinedFlight,
    searchParams: { from, to, departureDate, returnDate, passengers, tripType: tripType || 'round-trip', fromCity, toCity },
    outboundFlight: outboundRef,
    returnFlight: returnRef,
  };
}
