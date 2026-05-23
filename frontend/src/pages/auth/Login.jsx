import  { useState } from "react";
import Successful from "../../components/Success";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [data, setData] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      
      const data = await response.json();
      setData(data);
      
      setTimeout(() => {
        localStorage.setItem("token",data.token)
        location.assign("/main");  
        setData(null);
      },2000);

      if (!response.ok) {
        console.log(data.message);
        return;
      }

      console.log("Login successful:", data);
      setFormData({})
    } catch (error) {
      console.log("Something went wrong:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
         { data && <Successful text={data.message} /> }
      
      <input
        type="email"
        name="email"
        placeholder="Enter your email address"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
      />

      <button type="submit" className="primary-btn">
        Sign In
      </button>
    </form>
  );
}

export default Login;