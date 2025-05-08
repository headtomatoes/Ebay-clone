// GoogleLoginButton.jsx
import React from "react";

const GOOGLE_LOGIN_URL = "http://localhost:8082/oauth2/authorization/google";

export default function GoogleLoginButton() {
  const handleLogin = () => {
    window.location.href = GOOGLE_LOGIN_URL;
  };

  return (
    <button onClick={handleLogin}>
     Login with Google
    </button>
  );
}