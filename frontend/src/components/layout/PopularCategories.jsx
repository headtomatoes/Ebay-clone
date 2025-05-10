import React from 'react';
import { Link } from 'react-router-dom';
import electronicImg from "../../assets/images/electronic.jpeg";
import bookImg from "../../assets/images/book.jpg";
import clothingImg from "../../assets/images/Clothing.webp";
import homeKitchenImg from "../../assets/images/homenchicken.webp";
import toysImg from "../../assets/images/toys.webp";
import beautyImg from "../../assets/images/beauty.webp";

const categories = [
  {
    label: 'Electronics',
    img: electronicImg,
  },
  {
    label: 'Books',
    img: bookImg,
  },
  {
    label: 'Clothing',
    img: clothingImg,
  },
  {
    label: 'Home & Kitchen',
    img: homeKitchenImg,
  },
  {
    label: 'Toys',
    img: toysImg,
  },
  {
    label: 'Beauty',
    img: beautyImg,
  },
];

export default function PopularCategories() {
  return (
    <section className="py-10 px-4 md:px-6 bg-white">
      <h2 className="text-[22px] font-bold text-gray-900 mb-6 text-center md:text-left">
        Explore Popular Categories
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 justify-center">
        {categories.map((item, idx) => (
          <Link
            to={`/categories/${encodeURIComponent(item.label)}`}
            key={idx}
            className="flex flex-col items-center hover:scale-105 transition-transform"
          >
            <div className="w-[130px] h-[130px] bg-gray-100 rounded-full flex items-center justify-center shadow-sm">
              <img
                src={item.img}
                alt={item.label}
                className="max-w-[80%] max-h-[80%] object-contain"
              />
            </div>
            <span className="mt-4 text-[16px] font-medium text-center text-gray-900">
              {item.label}
            </span>
          </Link>
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
        <button className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
          Start now
        </button>
      </div>
    </section>
  );
}