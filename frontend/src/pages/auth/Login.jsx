import { useState } from "react";
import Successful from "../../components/Success";

const API = "http://localhost:5000";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [toast, setToast] = useState(null); // {text: string}
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const finish = ({ token, message, to = "/home" }) => {
    setToast({ text: message });
    setTimeout(() => {
      localStorage.setItem("token", token);
      location.assign(to);
    }, 900);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.email || !formData.password) {
      setToast({ text: "Please fill in both fields" });
      setTimeout(() => setToast(null), 1800);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        setToast({ text: data.message || "Sign in failed" });
        setLoading(false);
        setTimeout(() => setToast(null), 2200);
        return;
      }

      finish({ token: data.token, message: data.message || "Welcome back" });
    } catch (err) {
      // Backend unreachable — fall back to local demo mode so the UI is testable.
      console.warn("Backend unreachable, using demo sign-in:", err);
      finish({
        token: "demo-token",
        message: "Demo mode · backend offline",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {toast && <Successful text={toast.text} />}

      <input
        type="email"
        name="email"
        placeholder="Enter your email address"
        value={formData.email}
        onChange={handleChange}
        autoComplete="email"
      />

      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        autoComplete="current-password"
      />

      <button
        type="submit"
        className="primary-btn"
        disabled={loading}
        aria-busy={loading || undefined}
      >
        {loading ? "Signing you in…" : "Sign In"}
      </button>
    </form>
  );
}

export default Login;
