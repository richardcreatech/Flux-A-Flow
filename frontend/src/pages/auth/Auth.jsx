import React from "react";
import AuthForm from "./AuthForm";
import "../../styles/auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

function Auth() {
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDark = () => {
    document.body.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <AuthForm />
      </div>
      <span
        className="drk-mode"
        onClick={toggleDark}
        role="button"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <FontAwesomeIcon icon={faSun} />
        ) : (
          <FontAwesomeIcon icon={faMoon} />
        )}
      </span>
    </div>
  );
}

export default Auth;
