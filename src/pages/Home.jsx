import MetaTags from '../components/MetaTags';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import DestinationCard from '../components/DestinationCard';
import FlightDealsSection from '../components/FlightDealsSection';
import SlideshowSection from '../components/SlideshowSection';
import FAQAccordion from '../components/FAQAccordion';
import BackToTop from '../components/BackToTop';
import HelpButton from '../components/HelpButton';

// Flights Channel layout: 3 cols, Cancun center spans 2 rows
// [London] [Cancun-tall] [Tokyo]
// [Paris]  [Cancun-tall] [San Juan]
const DESTINATIONS_LAYOUT = {
  topLeft: { image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80', city: 'London', country: 'United Kingdom', price: '355', slug: 'london' },
  center: { image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80', city: 'Cancun', country: 'Mexico', price: '452', featured: true, slug: 'cancun' },
  topRight: { image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', city: 'Tokyo', country: 'Japan', price: '1355', slug: 'tokyo' },
  bottomLeft: { image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', city: 'Paris', country: 'France', price: '299', slug: 'paris' },
  bottomRight: { image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80', city: 'San Juan', country: 'Puerto Rico', price: '425', slug: 'san-juan' },
};

const FAQ_ITEMS = [
  {
    question: 'What documents are required to travel?',
    answer: 'For international travel, you typically need a valid passport (with at least 6 months validity) and any required visas. Domestic flights usually require a government-issued ID. Always check the specific requirements for your destination country before booking.',
  },
  {
    question: 'Do I need a visa to visit this destination?',
    answer: 'Visa requirements vary by your nationality and destination. Many countries offer visa-free or visa-on-arrival access for short stays. Use our destination guides or check with the embassy of your destination country to confirm visa requirements before you travel.',
  },
  {
    question: 'How long can I stay as a tourist?',
    answer: 'Tourist stay limits depend on your destination. Most countries allow 30 to 90 days for visa-free visits. Some destinations require proof of onward travel. Check your specific destination\'s immigration rules or consult your embassy for accurate information.',
  },
  {
    question: 'What can I expect at customs?',
    answer: 'At customs, you\'ll present your passport and declaration form. You may be asked about your trip purpose, duration, and items you\'re carrying. Prohibited items vary by country—avoid carrying restricted foods, plants, or large amounts of currency without declaration.',
  },
  {
    question: 'Are there any travel restrictions?',
    answer: 'Travel restrictions can change based on health, security, or policy updates. We recommend checking official government travel advisories and your airline\'s latest requirements before departure. Sign up for travel alerts to stay informed.',
  },
  {
    question: 'What is the best time to visit?',
    answer: 'The best time depends on your destination and preferences. Consider weather, peak vs. off-peak seasons, local events, and crowd levels. Our destination guides provide seasonal tips to help you plan the perfect trip.',
  },
];

// Cityscape skyline. For Freepik image: download and save as public/hero.jpg, then use '/hero.jpg'
const HERO_IMAGE = 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1920&q=80';

function Home() {
  return (
    <>
      <MetaTags
        title="Reservation of Flights - Book Cheap Flights Online"
        description="Find and book cheap flights to worldwide destinations. Best deals on international and domestic flight bookings."
      />
      {/* Hero full size - 100vh */}
      <section
        className="relative min-h-screen flex flex-col w-full m-0 p-0"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
        }}
      >
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
        <div className="relative z-10">
          <Navbar transparent />
        </div>
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <HeroSection contentOnly />
        </div>
      </section>
      <main className="w-full">

        {/* Top Destinations - Flights Channel exact layout */}
        <section className="w-full max-w-[100%] section-spacing bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-6">
              Popular Destinations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-2 gap-4 sm:min-h-[480px] sm:auto-rows-[1fr]">
              <DestinationCard {...DESTINATIONS_LAYOUT.topLeft} />
              <DestinationCard {...DESTINATIONS_LAYOUT.center} />
              <DestinationCard {...DESTINATIONS_LAYOUT.topRight} />
              <DestinationCard {...DESTINATIONS_LAYOUT.bottomLeft} />
              <DestinationCard {...DESTINATIONS_LAYOUT.bottomRight} />
            </div>
          </div>
        </section>

        {/* Top Domestic / International Flight Deals - Book Now triggers call */}
        <FlightDealsSection />

        {/* Slideshow - Destination images with travel quotes, 3 sec auto-slide */}
        <SlideshowSection />

        {/* FAQ Section - No gap above (seamless with slideshow), no gap before footer */}
        <section className="w-full max-w-[100%] section-spacing-last faq-no-gap-above flex flex-col lg:flex-row min-h-[400px]">
          <div className="w-full lg:w-1/2 flex-shrink-0 relative min-h-[250px] lg:min-h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1563841930606-67e2bce48b78?w=1200&q=80"
              alt="Times Square New York"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div
            className="w-full lg:w-1/2 bg-[#283440] flex flex-col p-6 sm:p-8 lg:p-10"
          >
            <h2 className="text-lg sm:text-xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <FAQAccordion items={FAQ_ITEMS} variant="dark" />
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <HelpButton />
    </>
  );
}

export default Home;
