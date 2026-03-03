import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Reservation of Flights logo - airplane icon + brand name.
 */
function Logo({ className = '', showText = true, asLink = true, dark = false }) {
  const content = (
    <>
      <svg className="w-9 h-9 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
      {showText && <span className="text-lg font-bold tracking-tight">Reservation of Flights</span>}
    </>
  );

  const baseClass = `flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-900'} ${className}`;

  if (asLink) {
    return (
      <Link to="/" className={`${baseClass} transition-opacity hover:opacity-90`}>
        {content}
      </Link>
    );
  }

  return <div className={baseClass}>{content}</div>;
}

Logo.propTypes = {
  className: PropTypes.string,
  showText: PropTypes.bool,
  asLink: PropTypes.bool,
  dark: PropTypes.bool,
};

export default Logo;
