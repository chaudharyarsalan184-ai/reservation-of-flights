import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FALLBACK_IMAGE } from '../utils/images';

/**
 * Blog post card with image, title, excerpt, read time, and date.
 */
function BlogCard({ image, title, excerpt, readTime, date, slug = '#' }) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={slug} className="block">
        <div className="aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          />
        </div>
      </Link>
      <div className="p-5">
        <div className="flex gap-3 text-sm text-gray-500 mb-2">
          <span>{date}</span>
          <span>•</span>
          <span>{readTime} min read</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link to={slug} className="hover:text-[#FF6B35] transition-colors">
            {title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{excerpt}</p>
        <Link
          to={slug}
          className="text-[#FF6B35] font-medium hover:text-[#e55a28] text-sm"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}

BlogCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  excerpt: PropTypes.string.isRequired,
  readTime: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  slug: PropTypes.string,
};

export default BlogCard;
