import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function OAuth2Redirect() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userId = params.get("userId");
    const username = params.get("username");
    const email = params.get("email");
    const roles = params.get("roles") ? params.get("roles").split(",") : [];

    if (token && userId && username && email) {
      // Save token and user info to context/localStorage
      login(token, { userId, username, email, roles });
      navigate("/", { replace: true });
    } else {
      navigate("/login", { state: { message: "Google login failed." } });
    }
  }, [login, navigate]);

  return <div>You are Logging with Google...</div>;
}