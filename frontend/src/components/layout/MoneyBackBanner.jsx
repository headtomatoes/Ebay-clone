import React from 'react';
import RegisterBanner from '../../assets/images/ex_login.jpg';


export default function MoneyBackBanner() {
  return (
    <section className="relative w-full h-[400px]">
      {/* Background image */}
      <img
        src={RegisterBanner}
        alt="Money Back Guarantee"
        className="w-full h-full object-cover"
      />

      {/* Overlay text content */}
      <div className="absolute inset-0 flex items-center px-8 md:px-16 bg-black/30">
        <div className="text-white max-w-xl">
          <h2 className="text-[36px] leading-tight font-bold mb-4">
            Get your order or your money back
          </h2>
          <p className="text-lg mb-6">
            Shop confidently with eBay Money Back Guarantee.
          </p>
          <button className="bg-white text-black font-semibold text-sm px-6 py-3 rounded-full hover:bg-gray-100 transition">
            Learn more
          </button>
        </div>
      </div>
    </section>
  );
}
