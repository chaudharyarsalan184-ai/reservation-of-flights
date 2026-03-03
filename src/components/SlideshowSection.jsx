import { useState, useEffect } from 'react';

const FALLBACK = 'https://picsum.photos/1920/800?random=travel';
const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80',
    caption: 'Where the ocean meets the sky — paradise awaits',
    alt: 'Bali Indonesia',
  },
  {
    image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1920&q=80',
    caption: 'Every corner of the world has a story to tell',
    alt: 'London Big Ben',
  },
  {
    image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?w=1920&q=80',
    caption: 'Adventure is out there — discover new horizons',
    alt: 'Tokyo Tower',
  },
  {
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80',
    caption: 'Where the ocean meets the sky — paradise awaits',
    alt: 'Miami Beach',
  },
];

const INTERVAL_MS = 3000;

function SlideshowSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full max-w-[100%] section-spacing slideshow-no-gap-below overflow-hidden">
      <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[560px]">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.alt}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="absolute inset-0 w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
              onError={(e) => { e.target.src = FALLBACK; }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30"
              aria-hidden="true"
            />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-8 text-center">
              <p className="max-w-3xl text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-white drop-shadow-lg leading-relaxed">
                {slide.caption}
              </p>
            </div>
          </div>
        ))}

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === activeIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default SlideshowSection;
