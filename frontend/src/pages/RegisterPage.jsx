import React, { useState } from 'react';
import EBayLogo from '../assets/EBay_logo.svg';
import RegisterBanner from '../assets/ex_login.jpg';

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel with Logo and Image */}
      <div className="hidden lg:flex flex-col items-start w-[40%] h-screen">
        <img
          src={EBayLogo}
          alt="eBay Logo"
          className="w-20 h-10 ml-6 mt-6"
        />
        <img
          src={RegisterBanner}
          alt="Register Banner"
          className="object-cover w-[90%] h-[90%] ml-6 rounded-xl"
        />
      </div>

      {/* Register Form */}
      <div className="w-full max-w-md mx-auto text-center py-12 px-6">
        <h1 className="text-2xl font-semibold mb-6">Create an account</h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-6 py-2 rounded-l-full text-sm ${activeTab === 'personal' ? 'bg-black text-white' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal
          </button>
          <button
            className={`px-6 py-2 rounded-r-full text-sm ${activeTab === 'business' ? 'bg-black text-white' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('business')}
          >
            Business
          </button>
        </div>

        <div className="space-y-4 min-h-[430px]">
          {activeTab === 'personal' ? (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="First name"
                  className="w-1/2 border rounded px-4 py-3 text-sm"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  className="w-1/2 border rounded px-4 py-3 text-sm"
                />
              </div>

              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded px-4 py-3 text-sm"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded px-4 py-3 text-sm"
              />

              <p className="text-xs text-gray-600">
                By selecting <strong>Create personal account</strong>, you agree to our{' '}
                <a href="#" className="underline">User Agreement</a> and acknowledge reading our{' '}
                <a href="#" className="underline">User Privacy Notice</a>.
              </p>

              <button className="w-full bg-gray-200 text-gray-600 font-semibold py-3 rounded text-sm">
                Create personal account
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Business name"
                className="w-full border rounded px-4 py-3 text-sm"
              />
              <input
                type="email"
                placeholder="Business email"
                className="w-full border rounded px-4 py-3 text-sm"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded px-4 py-3 text-sm"
              />
              <select className="w-full border rounded px-4 py-3 text-sm">
                <option>Where is your business registered?</option>
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
              </select>
              <div className="flex items-center text-left">
                <input type="checkbox" id="buyOnly" className="mr-2" />
                <label htmlFor="buyOnly" className="text-sm">I'm only interested in buying on eBay for now</label>
              </div>
              <p className="text-xs text-gray-600">
                By selecting <strong>Create business account</strong>, you agree to our{' '}
                <a href="#" className="underline">User Agreement</a> and acknowledge reading our{' '}
                <a href="#" className="underline">User Privacy Notice</a>.
              </p>
              <button className="w-full bg-gray-200 text-gray-600 font-semibold py-3 rounded text-sm">
                Create business account
              </button>
            </>
          )}

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-2 text-gray-500 text-sm">or continue with</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center border rounded py-2 text-sm">
              <img src="https://img.icons8.com/color/24/000000/google-logo.png" className="mr-2" alt="Google" />
              Continue with Google
            </button>

            <button className="w-full flex items-center justify-center border rounded py-2 text-sm">
              <img src="https://img.icons8.com/ios-filled/24/1877f2/facebook-new.png" className="mr-2" alt="Facebook" />
              Continue with Facebook
            </button>

            <button className="w-full flex items-center justify-center border rounded py-2 text-sm">
              <img src="https://img.icons8.com/ios-filled/24/000000/mac-os.png" className="mr-2" alt="Apple" />
              Continue with Apple
            </button>
          </div>

          <p className="text-sm mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 underline font-medium">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
