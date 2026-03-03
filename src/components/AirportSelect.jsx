import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { AIRPORTS } from '../data/airports';
import { apiService } from '../services/api';

/**
 * Searchable airport dropdown - fully responsive with touch support.
 * When useApi=true, uses API city search (matches reference frontend); else uses static data.
 */
function AirportSelect({ id, label, value, onChange, placeholder, useApi = false }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [apiOptions, setApiOptions] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const containerRef = useRef(null);

  const selectedAirport =
    apiOptions.find((a) => a.code === value) ||
    AIRPORTS.find((a) => a.code === value) ||
    (value ? { code: value, city: value } : null);
  const displayValue = selectedAirport ? `${selectedAirport.code} - ${selectedAirport.city}` : value || '';

  const apiSearch = useCallback(
    debounce(async (q) => {
      if (q.length < 2) {
        setApiOptions([]);
        setApiLoading(false);
        return;
      }
      setApiLoading(true);
      try {
        const results = await apiService.searchCities(q);
        setApiOptions(
          (results || []).map((c) => ({
            code: c.iataCode,
            city: c.address?.cityName || c.name || '',
            name: c.name || '',
            country: c.address?.countryName || '',
          }))
        );
      } catch {
        setApiOptions([]);
      } finally {
        setApiLoading(false);
      }
    }, 600),
    []
  );

  const q = query.trim().toLowerCase();
  const staticFiltered = q
    ? AIRPORTS.filter(
        (a) =>
          a.code.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.country.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q)
      ).slice(0, 12)
    : AIRPORTS.slice(0, 12);

  // Common typos (e.g. ifk -> jfk)
  const TYPO_MAP = { ifk: 'jfk', jf: 'jfk' };
  const typoExpand = TYPO_MAP[q];
  const typoFiltered =
    typoExpand && !staticFiltered.length
      ? AIRPORTS.filter((a) => a.code.toLowerCase().includes(typoExpand)).slice(0, 12)
      : staticFiltered;

  // When useApi: prefer API results; fall back to static (or typo-corrected) when API returns empty
  const filtered =
    useApi && query.trim().length >= 2
      ? (apiOptions.length > 0 ? apiOptions : typoFiltered)
      : typoFiltered;

  useEffect(() => {
    setHighlightIndex(0);
  }, [query, isOpen]);

  useEffect(() => {
    if (useApi && query.trim().length >= 2) {
      apiSearch(query.trim());
    } else if (useApi) {
      setApiOptions([]);
    }
    return () => apiSearch.cancel?.();
  }, [query, useApi, apiSearch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSelect = (airport) => {
    onChange(airport.code);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[highlightIndex]) {
      e.preventDefault();
      handleSelect(filtered[highlightIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col flex-1 min-w-0 rounded relative">
      <label htmlFor={id} className="text-xs px-2 pt-1.5 text-gray-500">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={isOpen ? query : displayValue}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (!isOpen) onChange('');
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full min-w-0 px-3 py-2 bg-transparent focus:ring-0 focus:outline-none border-none text-sm"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 p-1"
          aria-label="Toggle dropdown"
        >
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <ul
          className="absolute top-full left-0 right-0 mt-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] max-h-48 overflow-y-auto"
          role="listbox"
        >
          {filtered.length ? (
            filtered.map((airport, i) => (
              <li
                key={`${airport.code}-${airport.city || ''}-${i}`}
                role="option"
                aria-selected={i === highlightIndex}
                className={`px-3 py-2.5 cursor-pointer text-sm flex flex-col gap-0.5 min-h-[3rem] justify-center touch-manipulation ${
                  i === highlightIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSelect(airport)}
                onMouseEnter={() => setHighlightIndex(i)}
              >
                <span className="font-medium text-gray-900">
                  {airport.code} - {airport.city}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {airport.name}, {airport.country}
                </span>
              </li>
            ))
          ) : (
            <li className="px-3 py-4 text-sm text-gray-500">
              {apiLoading && useApi ? 'Searching...' : 'No airports found'}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

AirportSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  useApi: PropTypes.bool,
};

export default AirportSelect;
