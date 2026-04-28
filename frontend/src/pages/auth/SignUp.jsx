import React from "react";

function SignUp() {
  return (
    <form>
      <input type="text" placeholder="Full Name" />

      <input type="email" placeholder="Enter your email address" />

      <input type="password" placeholder="Create password" />

      <input type="password" placeholder="Confirm password" />

      <button className="primary-btn">Sign Up</button>
    </form>
  );
}

export default SignUp;
