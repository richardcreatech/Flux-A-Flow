import React from 'react'

function Login() {
  return (
     <form>
        <input type="email" placeholder="Enter your email address" />

        <input type="password" placeholder="Enter your password" />

        <button className="primary-btn">Sign In</button>
          </form>
  )
}

export default Login