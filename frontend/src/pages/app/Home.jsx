import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSeedling,
  faBoxOpen,
  faStar,
  faArrowRight,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import Aside from "../../components/Aside";
import "../../styles/home.css";

const FALLBACK_STATS = {
  orders: { value: 24, delta: "+3 this week" },
  reviews: { value: 4.1, delta: "8 verified" },
  products: { value: 12, delta: "2 low stock" },
  messages: { value: 3, delta: "unread" },
};

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [greet, setGreet] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Set greeting based on local time
    const h = new Date().getHours();
    setGreet(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");

    // Try the new /auth/home endpoint, fall back to /auth/profile, then to dummy
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/home", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          if (data.stats) setStats(data.stats);
          return;
        }
      } catch (_) {}

      try {
        const res = await fetch("http://localhost:5000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (_) {}
    })();
  }, [navigate]);

  const firstName =
    (user?.full_name || "").split(" ")[0] || "friend";

  const cards = [
    {
      key: "orders",
      icon: faBoxOpen,
      label: "Orders",
      value: stats.orders.value,
      hint: stats.orders.delta,
      to: "/marketplace",
    },
    {
      key: "reviews",
      icon: faStar,
      label: "Reviews",
      value: stats.reviews.value,
      hint: stats.reviews.delta,
      to: "/reviews",
    },
    {
      key: "products",
      icon: faSeedling,
      label: "Products",
      value: stats.products.value,
      hint: stats.products.delta,
      to: "/marketplace",
    },
    {
      key: "messages",
      icon: faComments,
      label: "Messages",
      value: stats.messages.value,
      hint: stats.messages.delta,
      to: "/",
    },
  ];

  return (
    <main className="page-layout">
      <Aside />

      <section id="main-page">
        <div className="hm">
          <header className="hm-hero">
            <p className="hm-eyebrow">{greet}</p>
            <h1 className="hm-title">
              Welcome back,{" "}
              <span className="hm-name">{firstName}</span>
              <span className="hm-wave" aria-hidden="true">

              </span>
            </h1>
            <p className="hm-sub">
              Here&rsquo;s how your farm is doing today.
            </p>
          </header>

          <ul className="hm-stats">
            {cards.map((c, i) => (
              <li
                key={c.key}
                className="hm-stat"
                style={{ "--i": i }}
                onClick={() => navigate(c.to)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") navigate(c.to);
                }}
              >
                <span className="hm-stat-icon">
                  <FontAwesomeIcon icon={c.icon} />
                </span>
                <span className="hm-stat-label">{c.label}</span>
                <span className="hm-stat-value">{c.value}</span>
                <span className="hm-stat-hint">{c.hint}</span>
                <FontAwesomeIcon icon={faArrowRight} className="hm-stat-arrow" />
              </li>
            ))}
          </ul>

          <section className="hm-panels">
            <article className="hm-panel hm-panel-wide">
              <header>
                <h2>Today&rsquo;s harvest</h2>
                <span className="hm-pill">Live</span>
              </header>
              <ul className="hm-feed">
                <li>
                  <span className="hm-dot" />
                  New order from <strong>Amaka Eze</strong> · Lagos
                  <time>2m ago</time>
                </li>
                <li>
                  <span className="hm-dot" />
                  <strong>Funke Adebayo</strong> left a 5-star review
                  <time>1h ago</time>
                </li>
                <li>
                  <span className="hm-dot" />
                  Restock alert: <strong>Sweet Potatoes, 3kg</strong>
                  <time>3h ago</time>
                </li>
                <li>
                  <span className="hm-dot" />
                  Delivery completed in <strong>Abuja</strong>
                  <time>Yesterday</time>
                </li>
              </ul>
            </article>

            <article className="hm-panel">
              <header>
                <h2>Quick start</h2>
              </header>
              <div className="hm-actions">
                <button
                  className="hm-action hm-action-primary"
                  onClick={() => navigate("/marketplace")}
                >
                  <FontAwesomeIcon icon={faSeedling} />
                  List a product
                </button>
                <button
                  className="hm-action"
                  onClick={() => navigate("/reviews")}
                >
                  <FontAwesomeIcon icon={faStar} />
                  Read reviews
                </button>
                <button
                  className="hm-action"
                  onClick={() => navigate("/profile")}
                >
                  <FontAwesomeIcon icon={faBoxOpen} />
                  Edit profile
                </button>
              </div>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}

export default Home;
