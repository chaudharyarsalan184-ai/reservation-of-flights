import { useState, useEffect } from 'react';
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
  const dep = leg.departure || {};
  const arr = leg.arrival || {};
  const depTime = dep.time || leg.departureTime;
  const depCode = dep.code || leg.departureCode;
  const depCity = dep.city || leg.departureCity;
  const arrTime = arr.time || leg.arrivalTime;
  const arrCode = arr.code || leg.arrivalCode;
  const arrCity = arr.city || leg.arrivalCity;
  const duration = leg.duration;
  const stops = leg.stops;
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
      <div className="text-sm font-semibold text-slate-600 mb-3">{label}</div>
      <div className="flex items-center justify-between gap-4">
        <div className="text-center flex-1">
          <div className="font-bold text-xl">{depTime}</div>
          <div className="text-sm font-medium text-gray-800">{depCode}</div>
          <div className="text-xs text-gray-500 truncate">{depCity}</div>
        </div>
        <div className="flex flex-col items-center flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-400">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
          <div className="text-xs font-medium text-gray-600 mt-1">{duration}</div>
          <div className="text-xs text-gray-500">{stops === 0 || stops === 'Non-Stop' ? 'Non-Stop' : `${stops} Stop(s)`}</div>
        </div>
        <div className="text-center flex-1">
          <div className="font-bold text-xl">{arrTime}</div>
          <div className="text-sm font-medium text-gray-800">{arrCode}</div>
          <div className="text-xs text-gray-500 truncate">{arrCity}</div>
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
  const bookingState = state;
  const { flight, searchParams, outboundFlight, returnFlight } = bookingState || {};

  const from = searchParams?.from || flight?.departure?.code || '';
  const to = searchParams?.to || flight?.arrival?.code || '';
  const departureDate = searchParams?.departureDate || '';
  const returnDate = searchParams?.returnDate || '';
  const passengers = searchParams?.passengers || '1';
  const tripType = searchParams?.tripType || 'round-trip';

  const [contactDetails, setContactDetails] = useState({ email: '' });
  const [passengersList, setPassengersList] = useState([]);
  const [paymentData, setPaymentData] = useState({
    cardHolderFirstName: '',
    cardHolderLastName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    billingAddress: '',
    city: '',
    state: '',
    country: 'United States',
    zipCode: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [confirmState, setConfirmState] = useState(null);

  useEffect(() => {
    const count = parseInt(passengers, 10) || 1;
    setPassengersList(Array.from({ length: count }, () => ({
      title: 'Mr',
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      gender: 'M',
    })));
  }, [passengers]);

  const updatePassenger = (index, field, value) => {
    setPassengersList((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };
  const updatePayment = (field, value) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
  };

  if (!bookingState || !flight) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Flight Selected</h1>
            <p className="text-gray-600 mb-6">Please select a flight from the search results to continue.</p>
            <Link to="/flights" className="inline-block px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-lg hover:bg-[#e55a28]">
              Search Flights
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleConfirmBooking = async () => {
    if (!acceptedTerms) {
      setSubmitError('Please accept the terms and conditions');
      return;
    }
    const allPassengersValid = passengersList.every((p) => p.firstName && p.lastName);
    if (!contactDetails.email || !allPassengersValid) {
      setSubmitError('Please fill in all required passenger details');
      return;
    }
    if (!paymentData.cardNumber || !paymentData.cardHolderFirstName || !paymentData.cardHolderLastName) {
      setSubmitError('Please fill in all payment details');
      return;
    }

    setIsProcessing(true);
    setSubmitError(null);

    const bookingPayload = {
      flight,
      searchParams,
      passengers: passengersList,
      contactDetails,
      outboundFlight,
      returnFlight,
      paymentData,
    };

    try {
      const result = await apiService.createBooking(bookingPayload);
      setConfirmState({
        pnr: result?.pnr,
        referenceNo: result?.referenceNo,
        status: result?.status || 'pending',
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Booking failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const logoUrl = `https://www.gstatic.com/flights/airline_logos/70px/${flight.airlineCode}.png`;
  const returnLogoUrl = returnFlight ? `https://www.gstatic.com/flights/airline_logos/70px/${(returnFlight.airlineCode || flight.airlineCode)}.png` : logoUrl;

  return (
    <>
      <MetaTags title="Complete Your Booking - Reservation of Flights" description="Enter your details to complete your flight booking." />
      <Navbar />
      <main className="w-full min-h-screen bg-gray-50">
        <section className="w-full bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button onClick={() => navigate(-1)} className="inline-flex text-[#FF6B35] hover:text-[#e55a28] mb-4 text-sm font-medium">
              ← Back to Results
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Complete Your Booking</h1>
            <p className="text-gray-600 mt-1">
              {getCityFromCode(from)} ({from}) → {getCityFromCode(to)} ({to}) • {passengers} passenger{parseInt(passengers, 10) > 1 ? 's' : ''}
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Flight Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4 text-[#FF6B35]">Your Selected Flight</h2>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <img src={logoUrl} alt={flight.airline} className="w-12 h-12 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                    <div>
                      <div className="font-semibold text-gray-900">{flight.airline}</div>
                      {tripType === 'round-trip' && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Round Trip</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Total Price</div>
                    <div className="font-bold text-2xl text-[#FF6B35]">USD {(flight.price || 0).toFixed(2)}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <FlightSummary label={tripType === 'round-trip' ? 'Outbound Flight' : 'Flight'} leg={outboundFlight || flight} logo={logoUrl} />
                  {tripType === 'round-trip' && returnFlight && <FlightSummary label="Return Flight" leg={returnFlight} logo={returnLogoUrl} />}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={contactDetails.email}
                    onChange={(e) => setContactDetails({ email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35]"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Passengers */}
              {passengersList.map((p, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Passenger {idx + 1}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        value={p.firstName}
                        onChange={(e) => updatePassenger(idx, 'firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        value={p.lastName}
                        onChange={(e) => updatePassenger(idx, 'lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Payment - matches reference */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder First Name *</label>
                    <input value={paymentData.cardHolderFirstName} onChange={(e) => updatePayment('cardHolderFirstName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder Last Name *</label>
                    <input value={paymentData.cardHolderLastName} onChange={(e) => updatePayment('cardHolderLastName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number *</label>
                  <input value={paymentData.cardNumber} onChange={(e) => updatePayment('cardNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="flex gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Month</label>
                    <select value={paymentData.expiryMonth} onChange={(e) => updatePayment('expiryMonth', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Year</label>
                    <select value={paymentData.expiryYear} onChange={(e) => updatePayment('expiryYear', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="">YYYY</option>
                      {Array.from({ length: 15 }, (_, i) => (
                        <option key={i} value={String(new Date().getFullYear() + i)}>{new Date().getFullYear() + i}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input value={paymentData.cvv} onChange={(e) => updatePayment('cvv', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="123" maxLength={4} />
                  </div>
                </div>
                <label className="flex items-start gap-3 mb-4">
                  <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-1" />
                  <span className="text-sm text-gray-600">By checking this box, you agree to our Terms & Conditions.</span>
                </label>
              </div>

              {submitError && <p className="text-red-600 text-sm">{submitError}</p>}
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={isProcessing}
                className="w-full py-4 bg-[#FF6B35] hover:bg-[#e55a28] disabled:opacity-70 text-white font-bold rounded-lg transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Fare Details</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ADT x {passengers}</span>
                    <span className="font-medium">USD {((flight.price || 0) * 0.8).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium">USD {((flight.price || 0) * 0.2).toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#FF6B35]">USD {(flight.price || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success / Confirmation Modal - matches reference */}
          {submitted && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {confirmState?.status === 'pending' ? 'Booking Pending' : 'Booking Received'}
                </h3>
                {confirmState?.pnr && <p className="text-sm text-gray-600 mb-1">PNR: {confirmState.pnr}</p>}
                {confirmState?.referenceNo && <p className="text-sm text-gray-600 mb-2">Reference: {confirmState.referenceNo}</p>}
                <p className="text-gray-600 mb-6">Your booking has been submitted. Our team will contact you at <strong>{contactDetails.email}</strong> to complete the reservation.</p>
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a28]">
                  Back to Home
                </button>
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
