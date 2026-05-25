import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Successful from "../../components/Success";

const API = "http://localhost:5000";

function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const flash = (text) => {
    setToast({ text });
    setTimeout(() => setToast(null), 2200);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    if (!fullName || !email || !password) {
      flash("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      flash("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.error) {
        flash(data.error);
        return;
      }

      setModal(true);
      flash(data.message || "Account created");
    } catch (err) {
      console.warn("Backend unreachable, using demo sign-up:", err);
      setLoading(false);
      setModal(true);
      flash("Demo mode · backend offline");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {modal && (
        <div id="check_mail_space">
          <div id="check_mail_modal">
            <div className="icon">
              <FontAwesomeIcon icon={faPaperPlane} id="paper-plane-icon" />
            </div>
            <div className="content">
              <p>Check your Mail</p>
              <button
                type="button"
                onClick={() => setModal(false)}
                id="just_checked"
              >
                Just Checked
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Successful text={toast.text} />}

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        autoComplete="name"
      />
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <input
        type="password"
        placeholder="Create password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
      />
      <input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
      />

      <button
        type="submit"
        className="primary-btn"
        disabled={loading}
        aria-busy={loading || undefined}
      >
        {loading ? "Creating your account…" : "Sign Up"}
      </button>
    </form>
  );
}

export default SignUp;
