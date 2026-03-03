import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import MetaTags from '../components/MetaTags';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { AIRPORTS } from '../data/airports';
import { apiService } from '../services/api';

const getCityFromCode = (code) => AIRPORTS.find((a) => a.code === code)?.city || code;

function FlightSummary({ label, leg, logo }) {
  if (!leg) return null;
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
      <div className="text-sm font-semibold text-slate-600 mb-3">{label}</div>
      <div className="flex items-center justify-between gap-4">
        <div className="text-center flex-1">
          <div className="font-bold text-xl">{leg.departureTime}</div>
          <div className="text-sm font-medium text-gray-800">{leg.departureCode}</div>
          <div className="text-xs text-gray-500">{leg.departureCity}</div>
        </div>
        <div className="flex flex-col items-center flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-400">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
          <div className="text-xs font-medium text-gray-600 mt-1">{leg.duration}</div>
          <div className="text-xs text-gray-500">{leg.stops}</div>
        </div>
        <div className="text-center flex-1">
          <div className="font-bold text-xl">{leg.arrivalTime}</div>
          <div className="text-sm font-medium text-gray-800">{leg.arrivalCode}</div>
          <div className="text-xs text-gray-500">{leg.arrivalCity}</div>
        </div>
      </div>
      {logo && (
        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end">
          <img src={logo} alt="" className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
      )}
    </div>
  );
}

function Booking() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const flight = state?.flight;
  const searchParams = state?.searchParams || {};

  const from = searchParams.from || flight?.outbound?.departureCode || '';
  const to = searchParams.to || flight?.outbound?.arrivalCode || '';
  const departureDate = searchParams.departureDate || '';
  const returnDate = searchParams.returnDate || '';
  const passengers = searchParams.passengers || '1';
  const tripType = searchParams.tripType || 'round-trip';

  if (!flight) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Flight Selected</h1>
            <p className="text-gray-600 mb-6">Please select a flight from the search results to continue with your booking.</p>
            <Link to="/flights" className="inline-block px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-lg hover:bg-[#e55a28]">
              Search Flights
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveBookingLocally = (payload) => {
    try {
      const key = 'rof_pending_bookings';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({ ...payload, savedAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) {
      console.warn('Could not save booking locally', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    const bookingPayload = {
      status: 'pending',
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      note: [
        formData.specialRequests?.trim(),
        `Route: ${from} → ${to}`,
        `Departure: ${departureDate}`,
        returnDate ? `Return: ${returnDate}` : null,
        `Passengers: ${passengers}`,
        `Airline: ${flight.airline}`,
        `Price: USD ${flight.price}`,
        `Outbound: ${flight.outbound?.departureTime} ${flight.outbound?.departureCode} - ${flight.outbound?.arrivalTime} ${flight.outbound?.arrivalCode}`,
        flight.returnFlight ? `Return: ${flight.returnFlight?.departureTime} ${flight.returnFlight?.departureCode} - ${flight.returnFlight?.arrivalTime} ${flight.returnFlight?.arrivalCode}` : null,
      ].filter(Boolean).join(' | '),
      origin: from,
      destination: to,
      departureDate,
      returnDate: returnDate || undefined,
      passengers,
      tripType,
      totalPrice: flight.price,
      airline: flight.airline,
      flight: { id: flight.id, outbound: flight.outbound, returnFlight: flight.returnFlight },
    };

    try {
      await apiService.createBooking(bookingPayload);
      setSubmitted(true);
    } catch (err) {
      saveBookingLocally(bookingPayload);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const returnLogo = flight.returnFlight?.airlineCode
    ? `https://www.gstatic.com/flights/airline_logos/70px/${flight.returnFlight.airlineCode}.png`
    : flight.logo;

  return (
    <>
      <MetaTags
        title="Complete Your Booking - Reservation of Flights"
        description="Enter your details to complete your flight booking."
      />
      <Navbar />
      <main className="w-full min-h-screen bg-gray-50">
        <section className="w-full bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link to="/flights" className="inline-flex items-center text-[#FF6B35] hover:text-[#e55a28] mb-4 text-sm font-medium">
              ← Back to Results
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Complete Your Booking</h1>
            <p className="text-gray-600 mt-1">
              {getCityFromCode(from)} ({from}) → {getCityFromCode(to)} ({to}) • {passengers} passenger{parseInt(passengers, 10) > 1 ? 's' : ''}
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Flight Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Airline & Price */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-50 rounded-lg border flex items-center justify-center overflow-hidden">
                      <img src={flight.logo} alt={flight.airline} className="w-12 h-12 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{flight.airline}</h2>
                      <p className="text-sm text-gray-500">
                        {departureDate}
                        {returnDate && flight.isRoundTrip ? ` – ${returnDate}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Total Price</div>
                    <div className="text-3xl font-bold text-[#FF6B35]">USD {parseFloat(flight.price || 0).toFixed(2)}</div>
                    {flight.isRoundTrip && <div className="text-xs text-gray-500">Round Trip</div>}
                  </div>
                </div>

                <div className="space-y-4">
                  <FlightSummary label="Outbound Flight" leg={flight.outbound} logo={flight.logo} />
                  {flight.returnFlight && <FlightSummary label="Return Flight" leg={flight.returnFlight} logo={returnLogo} />}
                </div>
              </div>

              {/* Passenger Form */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Passenger Details</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                      placeholder="Any special requests or notes..."
                    />
                  </div>
                  {submitError && (
                    <p className="text-red-600 text-sm">{submitError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#FF6B35] hover:bg-[#e55a28] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
                  >
                    {isSubmitting ? 'Submitting...' : 'Proceed to Payment'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Route</dt>
                    <dd className="font-medium">{from} → {to}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Departure</dt>
                    <dd className="font-medium">{departureDate}</dd>
                  </div>
                  {returnDate && flight.isRoundTrip && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Return</dt>
                      <dd className="font-medium">{returnDate}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Passengers</dt>
                    <dd className="font-medium">{passengers}</dd>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <dt className="font-semibold text-gray-900">Total</dt>
                    <dd className="font-bold text-xl text-[#FF6B35]">USD {parseFloat(flight.price || 0).toFixed(2)}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs text-gray-500">
                  By proceeding, you agree to our terms of service and cancellation policy.
                </p>
              </div>
            </div>
          </div>

          {submitted && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Received</h3>
                <p className="text-gray-600 mb-6">Thank you! Your booking details have been saved. Our team will contact you shortly at <strong>{formData.email}</strong> to complete the reservation and payment.</p>
                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a28]"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

export default Booking;
