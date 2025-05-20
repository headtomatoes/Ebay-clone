import React, { useState, useEffect } from 'react';
import banner1 from '../../assets/images/ex_mainbanner2.jpg';
import banner2 from '../../assets/images/ex_mainbanner1.jpg';

const images = [banner1, banner2];

export default function MainBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="w-full h-[350px] bg-white relative overflow-hidden">
      {/* Banner Image */}
      <img
        src={images[currentIndex]}
        alt="Banner"
        className="w-full h-full object-cover transition-all duration-700"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center px-12 bg-black/30">
        <div className="text-white max-w-md">
          <h2 className="text-3xl font-bold mb-3">Returns made simple</h2>
          <p className="text-sm mb-4">
            Not happy with your purchase? It’s easy to start a return.
          </p>
          <button className="bg-white text-black px-5 py-2 rounded hover:bg-gray-200 text-sm font-semibold">
            Learn more
          </button>
        </div>
      </div>

      {/* Prev Button */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 text-black px-2 py-1 rounded-full hover:bg-white"
      >
        ◀
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 text-black px-2 py-1 rounded-full hover:bg-white"
      >
        ▶
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${
              currentIndex === idx ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => goToSlide(idx)}
          ></button>
        ))}
      </div>
    </section>
  );
}