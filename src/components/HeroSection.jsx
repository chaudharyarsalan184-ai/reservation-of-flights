import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import AirportSelect from './AirportSelect';

// Cityscape skyline image - use /hero.jpg for local (e.g. Freepik download)
const HERO_IMAGE = 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1920&q=80';

/**
 * Full viewport hero section with flight booking form.
 * Uses high-resolution travel background with dark overlay.
 * When contentOnly=true, renders only the form/heading (no background).
 */
function HeroSection({ contentOnly = false }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: '1',
    class: 'Economy',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const tripType = formData.returnDate ? 'round-trip' : 'one-way';
    const params = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      departureDate: formData.departureDate,
      returnDate: formData.returnDate || '',
      passengers: formData.passengers,
      tripType,
    });
    navigate(`/flights?${params.toString()}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputClass = 'w-full min-w-0 px-3 py-2 bg-transparent focus:ring-0 focus:outline-none border-none text-sm';
  const boxClass = 'flex flex-col flex-1 min-w-0 rounded';

  const content = (
    <div className="relative z-10 w-full max-w-6xl mx-auto px-2 sm:px-4 py-4">
        <div className="text-center mb-4">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 drop-shadow-lg">
            Book Your Dream Flight ✈️
          </h1>
          <p className="text-sm sm:text-base text-white/90 drop-shadow">
            Discover the world with best flight deals
          </p>
        </div>

        {/* Flight booking form - fully responsive grid */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 rounded-lg shadow-lg p-3 sm:p-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3 items-end">
            <div className="min-w-0">
              <AirportSelect
                id="from"
                label="From"
                value={formData.from}
                onChange={(v) => setFormData((p) => ({ ...p, from: v }))}
                placeholder="City or code"
                useApi
              />
            </div>
            <div className="min-w-0">
              <AirportSelect
                id="to"
                label="To"
                value={formData.to}
                onChange={(v) => setFormData((p) => ({ ...p, to: v }))}
                placeholder="City or code"
                useApi
              />
            </div>
            <div className={boxClass}>
              <label htmlFor="departureDate" className="text-xs px-2 pt-1.5 text-gray-500">Departure</label>
              <input type="date" id="departureDate" name="departureDate" value={formData.departureDate} onChange={handleChange} className={inputClass} />
            </div>
            <div className={boxClass}>
              <label htmlFor="returnDate" className="text-xs px-2 pt-1.5 text-gray-500">Return</label>
              <input type="date" id="returnDate" name="returnDate" value={formData.returnDate} onChange={handleChange} className={inputClass} />
            </div>
            <div className={boxClass}>
              <label htmlFor="passengers" className="text-xs px-2 pt-1.5 text-gray-500">Passengers</label>
              <select id="passengers" name="passengers" value={formData.passengers} onChange={handleChange} className={inputClass}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className={boxClass}>
              <label htmlFor="class" className="text-xs px-2 pt-1.5 text-gray-500">Class</label>
              <select id="class" name="class" value={formData.class} onChange={handleChange} className={inputClass}>
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
                <option value="First">First</option>
              </select>
            </div>
            <button type="submit" className="col-span-1 sm:col-span-2 md:col-span-1 px-4 py-2.5 sm:px-6 bg-[#FF6B35] hover:bg-[#e55a28] text-white font-semibold rounded transition-colors text-sm sm:text-base">
              Search
            </button>
          </div>
        </form>
    </div>
  );

  if (contentOnly) return content;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center w-full"
      style={{
        backgroundImage: `url(${HERO_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 bg-black/40"
        aria-hidden="true"
      />
      {content}
    </section>
  );
}

HeroSection.propTypes = {
  contentOnly: PropTypes.bool,
};

export default HeroSection;
