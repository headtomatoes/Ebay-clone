import React from 'react';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      {/* Logo */}
      <img src="/src/assets/EBay_logo.svg" alt="eBay logo" className="h-12 mb-10" />

      {/* Form Container */}
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-2">Sign in to your account</h1>
        <p className="text-sm mb-4">
          New to eBay?{' '}
          <a href="/register" className="text-blue-600 underline font-medium">
            Create account
          </a>
        </p>

        <input
          type="text"
          placeholder="Email or username"
          className="w-full border rounded px-4 py-3 mb-4 text-sm"
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded text-sm mb-4">
          Continue
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-2 text-gray-500 text-sm">or</span>
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

        {/* Stay Signed In */}
        <div className="flex items-center mt-4">
          <input type="checkbox" id="staySignedIn" className="mr-2" />
          <label htmlFor="staySignedIn" className="text-sm">Stay signed in</label>
        </div>
      </div>
    </div>
  );
}
