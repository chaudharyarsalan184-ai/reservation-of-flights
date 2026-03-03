import { useState, useEffect } from 'react';
import MetaTags from '../components/MetaTags';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestimonialCard from '../components/TestimonialCard';
import BackToTop from '../components/BackToTop';

const TEAM = [
  { name: 'Sarah Johnson', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80' },
  { name: 'Michael Chen', role: 'COO', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80' },
  { name: 'Emily Davis', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80' },
  { name: 'James Wilson', role: 'Customer Success Director', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80' },
];

const TESTIMONIALS = [
  { name: 'Alex Thompson', role: 'Frequent Traveler', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', quote: 'Amazing service! I found a flight to Tokyo for half the price I saw elsewhere. The booking process was smooth and the support team was incredibly helpful.', rating: 5 },
  { name: 'Maria Garcia', role: 'Business Traveler', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', quote: 'Best flight booking platform I have used. The filters make it easy to find exactly what I need, and the prices are always competitive.', rating: 5 },
  { name: 'David Lee', role: 'Adventure Seeker', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', quote: 'Booked my dream trip to Maldives through Reservation of Flights. Everything was seamless from search to boarding pass.', rating: 5 },
];

const AWARDS = [
  { title: 'Best Travel Platform 2024', icon: '🏆' },
  { title: 'Customer Satisfaction Award', icon: '⭐' },
  { title: 'Innovation in Travel Tech', icon: '💡' },
  { title: 'Top Rated by Users', icon: '👍' },
];

function About() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <MetaTags
        title="About Us - Reservation of Flights | Our Story & Mission"
        description="Learn about Reservation of Flights, our mission to make travel accessible, and our commitment to customer satisfaction."
      />
      <Navbar />
      <main className="w-full">
        {/* Hero */}
        <section
          className="relative h-64 flex items-center justify-center w-full"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-40" />
          <h1 className="relative z-10 text-xl sm:text-2xl font-bold text-white">About Us</h1>
        </section>

        {/* Company History & Mission */}
        <section className="w-full section-spacing bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Reservation of Flights was founded in 2015 with a simple mission: to make air travel 
              accessible and affordable for everyone. What started as a small startup has grown into 
              one of the most trusted flight comparison platforms, serving millions of travelers across 150+ countries.
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 mt-6">Our Mission</h2>
            <p className="text-gray-600">
              We believe that travel opens minds and creates connections. Our mission is to remove 
              barriers to travel by providing transparent pricing, comprehensive search options, and 
              exceptional customer support. We partner with leading airlines to bring you the best 
              deals without compromising on quality or reliability.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full section-spacing bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-8">Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM.map((member) => (
                <div key={member.name} className="bg-white rounded-lg shadow-md p-4 text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover mb-3"
                    loading="lazy"
                  />
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-[#FF6B35]">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards */}
        <section className="w-full section-spacing bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-8">Awards & Achievements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {AWARDS.map((award) => (
                <div
                  key={award.title}
                  className="flex flex-col items-center p-6 bg-gray-50 rounded-lg text-center"
                >
                  <span className="text-4xl mb-2">{award.icon}</span>
                  <p className="font-semibold text-gray-900">{award.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Slider - last section, no gap before footer */}
        <section className="w-full section-spacing-last bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-8">What Our Customers Say</h2>
            <div className="overflow-hidden">
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={t.name}
                  className={`transition-opacity duration-500 ${
                    i === testimonialIndex ? 'opacity-100 block' : 'opacity-0 hidden'
                  }`}
                >
                  <div className="flex justify-center">
                    <TestimonialCard {...t} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTestimonialIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === testimonialIndex ? 'bg-[#FF6B35]' : 'bg-gray-300'
                  }`}
                  aria-label={`View testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

export default About;
