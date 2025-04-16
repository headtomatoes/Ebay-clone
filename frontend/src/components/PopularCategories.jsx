import React from 'react';

const categories = [
  {
    label: 'Luxury',
    img: 'https://i.ebayimg.com/images/g/luxury/s-l1600.png',
  },
  {
    label: 'Sneakers',
    img: 'https://i.ebayimg.com/images/g/sneakers/s-l1600.png',
  },
  {
    label: 'P&A',
    img: 'https://i.ebayimg.com/images/g/rims/s-l1600.png',
  },
  {
    label: 'Refurbished',
    img: 'https://i.ebayimg.com/images/g/refurbished/s-l1600.png',
  },
  {
    label: 'Trading cards',
    img: 'https://i.ebayimg.com/images/g/cards/s-l1600.png',
  },
  {
    label: 'Pre-loved Luxury',
    img: 'https://i.ebayimg.com/images/g/preloved/s-l1600.png',
  },
  {
    label: 'Toys',
    img: 'https://i.ebayimg.com/images/g/toys/s-l1600.png',
  },
];

export default function PopularCategories() {
  return (
    <section className="py-10 bg-white px-6">
      <h2 className="text-[22px] font-bold text-gray-900 mb-6">
        Explore Popular Categories
      </h2>
      <div className="flex flex-wrap gap-10 justify-center">
        {categories.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center w-[140px]">
            <div className="w-[140px] h-[140px] bg-gray-100 rounded-full flex items-center justify-center">
              <img src={item.img} alt={item.label} className="max-w-[80%] max-h-[80%] object-contain" />
            </div>
            <span className="mt-3 text-[15px] font-medium text-center text-gray-900 leading-tight">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Shopping made easy section */}
      <div className="mt-16 rounded-xl bg-gray-100 px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-6 md:mb-0">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Shopping made easy
          </h3>
          <p className="text-sm text-gray-600">
            Enjoy reliability, secure deliveries and hassle-free returns.
          </p>
        </div>
        <button className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800">
          Start now
        </button>
      </div>
    </section>
  );
}
