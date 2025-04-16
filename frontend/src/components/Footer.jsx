import React from 'react';

export default function Footer() {
  const links = [
    'About eBay',
    'Announcements',
    'Community',
    'Security Center',
    'Seller Center',
    'Policies',
    'Affiliates',
    'Help & Contact',
    'Site Map',
  ];

  return (
    <footer className="bg-gray-100 py-6 mt-10 text-sm text-gray-600 border-t">
      <div className="max-w-screen-xl mx-auto px-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
        {links.map((link, idx) => (
          <a key={idx} href="#" className="hover:underline">
            {link}
          </a>
        ))}
      </div>
      <div className="text-center mt-4 text-xs text-gray-500">
        © 2024 eBay Clone. All rights reserved.
      </div>
    </footer>
  );
}
