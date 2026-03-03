import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Logo from './Logo';

/**
 * Sticky navigation bar with active link highlighting and mobile menu.
 */
function Navbar({ className = '', transparent = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
    { to: '/blog', label: 'Blog' },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 ${transparent ? 'bg-transparent shadow-none' : 'bg-white shadow-md'} ${className}`}
      role="navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo dark={transparent} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? transparent ? 'text-white font-semibold' : 'text-gray-900 font-semibold'
                      : transparent
                        ? 'text-white/90 hover:bg-white/20 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className={`md:hidden p-2 rounded-md ${transparent ? 'text-white hover:bg-white/20' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 border-t ${transparent ? 'border-white/20' : 'border-gray-200'}`}>
            <div className="flex flex-col space-y-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md text-base font-medium ${
                      isActive ? (transparent ? 'text-white font-semibold' : 'text-gray-900 font-semibold') : transparent ? 'text-white hover:bg-white/20' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  className: PropTypes.string,
  transparent: PropTypes.bool,
};

export default Navbar;
