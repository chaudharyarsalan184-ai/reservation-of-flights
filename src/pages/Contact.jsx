import { useState } from 'react';
import MetaTags from '../components/MetaTags';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <MetaTags
        title="Contact Us - Reservation of Flights | Customer Support"
        description="Get in touch with our support team for flight bookings, cancellations, or any travel-related queries."
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
          <h1 className="relative z-10 text-xl sm:text-2xl font-bold text-white">Contact Us</h1>
        </section>

        <section className="w-full section-spacing-last bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Send us a message</h2>
                  {submitted ? (
                    <p className="text-green-600 font-medium">Thank you! We will get back to you soon.</p>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-[#FF6B35] hover:bg-[#e55a28] text-white font-semibold rounded-lg transition-colors"
                      >
                        Send Message
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <p className="text-gray-600 text-sm">📞 +1 (800) 123-4567</p>
                  <p className="text-gray-600 text-sm mt-1">📧 support@reservationofflights.com</p>
                  <p className="text-gray-600 text-sm mt-1">📍 123 Aviation Blvd, New York, NY 10001</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Business Hours</h3>
                  <p className="text-gray-600 text-sm">Mon - Fri: 9:00 AM - 8:00 PM</p>
                  <p className="text-gray-600 text-sm">Sat: 10:00 AM - 6:00 PM</p>
                  <p className="text-gray-600 text-sm">Sun: 12:00 PM - 5:00 PM</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8 rounded-lg overflow-hidden shadow-md">
              <iframe
                title="Office location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.184133395389!2d-73.98811768428678!3d40.74844097932833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1635000000000!5m2!1sen!2sus"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

export default Contact;
