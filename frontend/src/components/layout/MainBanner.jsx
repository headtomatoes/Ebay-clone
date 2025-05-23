import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Slides data
const slides = [
  {
    bgColor: 'bg-[#6A5ACD]',
    textColor: 'text-black',
    title: "Whatever you're into, it's here",
    subtitle: "Turn a wrench, get a tech upgrade, and find everything you love.",
    buttonLabel: "Explore now",
    layout: 'split',
    categories: [
      {
        name: 'Electronics', // navigate to /categories/Electronics
        icon: 'https://i.postimg.cc/VvjWb7Vb/device.webp',
      },
      {
        name: 'Electronics',
        label: '',
        icon: 'https://i.postimg.cc/N0S0Rd1b/headphone.jpg',
      },
    ],
  },
  {
    bgColor: 'bg-[#F9B5C6]',
    textColor: 'text-white',
    title: 'Deals you don\'t want to miss',
    subtitle: 'Limited-time offers across all categories.',
    buttonLabel: 'Explore now',
    layout: 'split', // changed from 'centered'
    categories: [
      {
        name: 'Toys',
        label: 'Toys',
        icon: 'https://i.postimg.cc/fb6y7pCL/toys.webp',
      },
      {
        name: 'Beauty',
        label: 'Beauty',
        icon: 'https://i.postimg.cc/3wP6KF8V/beauty.jpg',
      },
    ],
  },
  {
    bgImage: 'https://i.postimg.cc/zDTp9Ryt/ex-login.jpg',
    layout: 'image-left',
    textColor: 'text-white',
    title: 'Get your order or your money back',
    subtitle: "Shop confidently with eBay Money Back Guarantee.",
    buttonLabel: 'Learn more',
  }
];

export default function MainBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

   const [isPaused, setIsPaused] = useState(false);

    // Auto slide every 6 seconds unless paused
    useEffect(() => {
      if (isPaused) return;
      const interval = setInterval(() => {
        nextSlide();
      }, 6000);
      return () => clearInterval(interval);
    }, [isPaused]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/categories/${categoryName}`);
  };

  return (
    <section className="w-full h-[420px] overflow-hidden relative ">
      {/* Slide container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`min-w-full h-full px-16 py-8 flex ${
              slide.layout === 'split'
                ? 'justify-between items-center'
                : 'flex-col justify-center items-center text-center'
            } ${slide.bgColor || ''} ${slide.textColor || ''}`}
            style={{
              backgroundImage: slide.bgImage ? `url(${slide.bgImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Left content (text & button) */}
            <div className={slide.layout === 'split' ? 'max-w-lg' : 'max-w-xl'}>
              <h2 className="text-4xl font-bold leading-snug mb-4">{slide.title}</h2>
              <p className="text-base mb-6">{slide.subtitle}</p>
              <button
                className="bg-black text-white px-6 py-3 text-lg rounded-full hover:bg-gray-800 transition"
                onClick={() => navigate('/products')}
              >
                {slide.buttonLabel}
              </button>
            </div>

            {/* Right content (category icons) */}
            {slide.categories?.length > 0 && (
              <div
                className={`${
                  slide.layout === 'split'
                    ? 'flex gap-10 items-center'
                    : 'flex mt-8 gap-12 ml-40'
                }`}
              >
                {slide.categories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="text-center cursor-pointer"
                    onClick={() => handleCategoryClick(cat.name)}
                  >
                    <img
                      src={cat.icon}
                      alt={cat.label}
                      className="w-40 h-40 rounded-full object-cover shadow"
                    />
                    <p className="font-semibold text-lg">{cat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dot navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-[8px] h-[8px] rounded-full border ${
              currentIndex === idx
                ? 'bg-white border-white'
                : 'bg-transparent border-white/70'
            }`}
            style={{ padding: 0 }}
          ></button>
        ))}
      </div>
    </section>
  );
}
