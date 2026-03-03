import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { FALLBACK_IMAGE } from '../utils/images';

/**
 * Destination card - links to destination detail page with city content and flight deals.
 */
function DestinationCard({ image, city, country, price, rating = 5, to, slug, featured = false }) {
  const href = slug ? `/destination/${slug}` : (to || '/flights');
  const [imgSrc, setImgSrc] = useState(image);

  const handleImageError = () => {
    setImgSrc(FALLBACK_IMAGE);
  };

  return (
    <Link
      to={href}
      className={`group relative block overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg h-full min-h-0 ${
        featured ? 'sm:row-span-2' : ''
      }`}
    >
      <div className={`overflow-hidden bg-gray-200 relative w-full ${featured ? 'h-56 sm:h-full sm:min-h-0' : 'aspect-[4/3]'} min-h-[180px]`}>
        <img
          src={imgSrc}
          alt={`${city}, ${country}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={handleImageError}
        />
      </div>
      {/* Bottom gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
      {/* Content overlay - bottom left + blue button right */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-white font-medium text-sm sm:text-base">
            {city}, {country}
          </p>
          <p className="text-white text-xl font-bold mt-0.5">$ {price}</p>
          <p className="text-white/90 text-xs">Starting from</p>
          <div className="flex gap-0.5 mt-1">
            {[...Array(rating)].map((_, i) => (
              <svg
                key={i}
                className="w-3.5 h-3.5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        {/* Blue square button with diagonal arrow - bottom right */}
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-700 transition-colors shadow-md">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7h-10v10" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

DestinationCard.propTypes = {
  image: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  rating: PropTypes.number,
  to: PropTypes.string,
  slug: PropTypes.string,
  featured: PropTypes.bool,
};

export default DestinationCard;
