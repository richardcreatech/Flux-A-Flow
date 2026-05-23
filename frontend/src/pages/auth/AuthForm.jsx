import React from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import logo from "../../assets/logo.png";
import Successful from "../../components/Success";

function AuthForm() {
    const [signIn, setSignIn] = React.useState(true);
    const [signUp, setSignUp] = React.useState(false);

    function chooseSignIn() {
            setSignIn(true);
            setSignUp(false);
    }

    function chooseSignUp() {
            setSignIn(false);
            setSignUp(true);
    }

  return (
    <div className="auth-form">

      <img src={logo} alt="Logo" width={90} height={90} />

    
      {/* <form>
        <input type="email" placeholder="Enter your email address" />

        <input type="password" placeholder="Enter your password" />

        <button className="primary-btn">Sign In</button>
          </form> */}
          
          {signIn && <Login />}
          {signUp && <SignUp />}
          
  <div className="tabs">
        <button className={signIn && "active"} onClick={chooseSignIn}>
          Sign In
        </button>
        <button className={signUp && "active"} onClick={chooseSignUp}>
          Sign Up
        </button>
      </div>

    </div>
  );
}

export default AuthForm;
