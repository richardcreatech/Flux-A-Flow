import React from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import logo from "../../assets/logo.png";

function AuthForm() {
  const [mode, setMode] = React.useState("signin"); // "signin" | "signup"
  const signIn = mode === "signin";

  return (
    <div className="auth-form">
      <img src={logo} alt="Flux-A-Flow" />

      <div className="tabs">
        <button
          className={signIn ? "active" : ""}
          onClick={() => setMode("signin")}
        >
          Sign In
        </button>
        <button
          className={!signIn ? "active" : ""}
          onClick={() => setMode("signup")}
        >
          Sign Up
        </button>
      </div>

      {signIn ? <Login /> : <SignUp />}
    </div>
  );
}

export default AuthForm;
