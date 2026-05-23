import React from "react";
import AuthForm from "./AuthForm";
import AuthShowcase from "./AuthShowcase";
import "../../styles/auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import Successful from "../../components/Success";

function Auth() {

    const [darkMode, setDarkMode] = React.useState(false);

    const toggleDark = () => {
    document.body.classList.toggle("dark");
    setDarkMode(!darkMode);
  };``
  return (
    <div className="auth-container">
      <div className="auth-card">
        <AuthShowcase />
        <AuthForm />
      </div>
      <span className="drk-mode" onClick={toggleDark}>
        {darkMode ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
      </span>
    </div>
  );
}

export default Auth;
