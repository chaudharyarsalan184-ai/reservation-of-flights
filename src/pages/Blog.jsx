import MetaTags from '../components/MetaTags';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import BackToTop from '../components/BackToTop';

const BLOG_POSTS = [
  {
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
    title: '10 Hidden Gems to Explore in Paris This Year',
    excerpt: 'Discover the lesser-known spots in the City of Light that will make your trip unforgettable.',
    readTime: 8,
    date: 'Feb 20, 2025',
    slug: '#',
  },
  {
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80',
    title: 'Maldives on a Budget: Tips for Affordable Island Hopping',
    excerpt: 'You don\'t need a fortune to enjoy the turquoise waters and white sand beaches of Maldives.',
    readTime: 6,
    date: 'Feb 18, 2025',
    slug: '#',
  },
  {
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
    title: 'Tokyo Travel Guide: From Shibuya to Shinjuku',
    excerpt: 'Navigate Japan\'s capital like a local with our comprehensive neighborhood guide.',
    readTime: 10,
    date: 'Feb 15, 2025',
    slug: '#',
  },
  {
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
    title: 'Dubai Layover: How to Make the Most of 24 Hours',
    excerpt: 'Turn a layover into an adventure with our guide to quick Dubai highlights.',
    readTime: 5,
    date: 'Feb 12, 2025',
    slug: '#',
  },
  {
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
    title: 'Packing Smart: Essentials for Long-Haul Flights',
    excerpt: 'What to pack for comfort and convenience on your next international journey.',
    readTime: 7,
    date: 'Feb 10, 2025',
    slug: '#',
  },
  {
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
    title: 'Best Time to Book Flights: Data-Backed Insights',
    excerpt: 'When should you book to get the best fares? We analyzed millions of bookings to find out.',
    readTime: 4,
    date: 'Feb 8, 2025',
    slug: '#',
  },
];

const CATEGORIES = [
  'All',
  'Destination Guides',
  'Travel Tips',
  'Flight Hacks',
  'Budget Travel',
  'Luxury Travel',
];

function Blog() {
  return (
    <>
      <MetaTags
        title="Travel Blog - Reservation of Flights | Travel Tips & Guides"
        description="Read our travel blog for tips, destination guides, and latest travel updates."
      />
      <Navbar />
      <main className="w-full">
        {/* Hero */}
        <section
          className="relative h-48 flex items-center justify-center w-full"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-40" />
          <h1 className="relative z-10 text-xl sm:text-2xl font-bold text-white">Travel Blog</h1>
        </section>

        <section className="w-full section-spacing-last bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Categories Sidebar */}
              <aside className="lg:w-56 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Categories</h3>
                  <ul className="space-y-2">
                    {CATEGORIES.map((cat) => (
                      <li key={cat}>
                        <button
                          type="button"
                          className="text-left text-sm text-gray-600 hover:text-[#FF6B35] transition-colors"
                        >
                          {cat}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              {/* Blog Posts Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                {BLOG_POSTS.map((post, i) => (
                  <BlogCard key={i} {...post} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

export default Blog;
