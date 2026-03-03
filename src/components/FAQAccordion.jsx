import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Accordion-style FAQ component with expandable Q&A items.
 * variant="dark" for split-panel layout with dark blue-grey background.
 */
function FAQAccordion({ items, variant = 'default' }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const isDark = variant === 'dark';

  return (
    <div className={isDark ? 'divide-y divide-white/20' : 'space-y-2'}>
      {items.map((item, index) => (
        <div
          key={index}
          className={isDark ? '' : 'border border-gray-200 rounded-lg overflow-hidden bg-white'}
        >
          <button
            type="button"
            onClick={() => toggleItem(index)}
            className={`w-full flex justify-between items-center text-left transition-colors ${
              isDark
                ? 'px-6 py-5 text-white hover:bg-white/5'
                : 'px-6 py-4 bg-white hover:bg-gray-50'
            }`}
          >
            <span className={`font-medium pr-4 ${isDark ? 'text-base' : 'font-semibold text-gray-900'}`}>
              {item.question}
            </span>
            <svg
              className={`w-5 h-5 flex-shrink-0 transition-transform ${isDark ? 'text-white/80' : 'text-gray-500'} ${
                openIndex === index ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className={`${isDark ? 'px-6 pb-5 text-white/80 text-sm' : 'px-6 pb-4 text-gray-600'} border-t ${isDark ? 'border-white/20' : 'border-gray-100'}`}>
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

FAQAccordion.propTypes = {
  variant: PropTypes.oneOf(['default', 'dark']),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FAQAccordion;
