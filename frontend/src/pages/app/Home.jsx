import { useEffect, useState } from "react";
import API_BASE_URL from "../../config/api";
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

function Home() {
  const [avg, setAvg] = useState(0);
  const FALLBACK_STATS = {
    orders: { value: 24, delta: "" },
    reviews: { value: 4.1, delta: "" },
    products: { value: 12, delta: "" },
    messages: { value: 3, delta: "" },
  };
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [greet, setGreet] = useState("");

  const [dashboard, setDashboard] = useState({
    marketplaces: 0,
    products: 0,
  });

  const loadDashboard = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/auth/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    setDashboard(data);
  };

  const loadReviews = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/auth/reviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    let total = 0;

    for (let i = 0; i < data.reviews.length; i++) {
      total += data.reviews[i].rating;
    }

    const my_avg = data.reviews.length > 0 ? total / data.reviews.length : 0;

    setAvg(my_avg);
    console.log(data.reviews);
  };

  useEffect(() => {
    loadReviews();
    loadDashboard();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Set greeting based on local time
    const h = new Date().getHours();
    setGreet(
      h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening",
    );

    // Try the new /auth/home endpoint, fall back to /auth/profile, then to dummy
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/home`, {
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
        const res = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (_) {}
    })();
  }, [navigate]);

  const firstName = (user?.full_name || "").split(" ")[0] || "friend";

  const cards = [
    {
      key: "products",
      icon: faBoxOpen,
      label: "Products",
      value: dashboard.products,
      hint: stats.orders.delta,
      to: "/marketplace",
    },
    {
      key: "reviews",
      icon: faStar,
      label: "Reviews",
      value: avg,
      hint: stats.reviews.delta,
      to: "/reviews",
    },
    {
      key: "marketplaces",
      icon: faSeedling,
      label: "MarketPlaces",
      value: dashboard.marketplaces,
      hint: stats.products.delta,
      to: "/marketplace",
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
              Welcome back, <span className="hm-name">{firstName}</span>
              <span className="hm-wave" aria-hidden="true"></span>
            </h1>
            <p className="hm-sub">Here's how your farm is doing today.</p>
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

                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="hm-stat-arrow"
                />
              </li>
            ))}
          </ul>

          <section className="hm-panels">
            <article className="hm-panel hm-panel-wide">
              <header>
                <h2>Today's harvest</h2>
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
                  Create a Market
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
