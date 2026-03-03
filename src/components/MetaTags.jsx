import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable component for setting page meta tags (title and description).
 * Updates document head for SEO and social sharing.
 */
function MetaTags({ title, description }) {
  useEffect(() => {
    document.title = title;
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;

    // Cleanup: restore default on unmount
    return () => {
      document.title = 'Reservation of Flights - Book Cheap Flights Online';
    };
  }, [title, description]);

  return null;
}

MetaTags.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default MetaTags;
