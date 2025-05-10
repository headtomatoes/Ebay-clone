import React from "react";

const GOOGLE_LOGIN_URL = "http://localhost:8082/oauth2/authorization/google";

export default function GoogleLoginButton() {
  const handleLogin = () => {
    window.location.href = GOOGLE_LOGIN_URL;
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        color: "#444",
        border: "1px solid #ddd",
        borderRadius: "4px",
        padding: "10px 16px",
        fontSize: "16px",
        fontWeight: 500,
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        transition: "background 0.2s",
        width: "100%",
        marginTop: "8px"
      }}
      onMouseOver={e => (e.currentTarget.style.background = "#f7f7f7")}
      onMouseOut={e => (e.currentTarget.style.background = "#fff")}
      type="button"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        style={{ width: 22, height: 22, marginRight: 12 }}
      />
      <span>Sign in with Google</span>
    </button>
  );
}