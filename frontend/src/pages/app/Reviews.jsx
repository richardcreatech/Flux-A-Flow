import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Aside from "../../components/Aside";
import { useNavigate } from "react-router-dom";
import "../../styles/reviews.css";

const reviews = [
  {
    id: 1,
    name: "Amaka Eze",
    place: "Lagos",
    date: "May 12, 2026",
    rating: 5,
    product: "Organic Tomatoes, 5kg",
    text: "Freshest tomatoes I've gotten in months. Skin firm, color deep, lasted nearly two weeks in the fridge. Already reordered.",
    reply: {
      from: "GreenLeaf Farms",
      on: "May 13",
      text: "Thanks Amaka. Next batch ships Friday.",
    },
  },
  {
    id: 2,
    name: "Chinedu Okafor",
    place: "Abuja",
    date: "May 9, 2026",
    rating: 4,
    product: "Free-range Eggs, tray of 30",
    text: "Yolks beautifully orange, shells sturdy. Delivery took a day longer than expected but the quality made up for it.",
    reply: null,
  },
  {
    id: 3,
    name: "Funke Adebayo",
    place: "Ibadan",
    date: "May 4, 2026",
    rating: 5,
    product: "Raw Honey, 750ml",
    text: "Real, raw honey. You can taste it. Third jar this month.",
    reply: null,
  },
  {
    id: 4,
    name: "Ibrahim Musa",
    place: "Kano",
    date: "Apr 28, 2026",
    rating: 3,
    product: "Yam Tubers, 4 pieces",
    text: "Two of four tubers had bruises. Rest were fine. Packaging could be better.",
    reply: {
      from: "GreenLeaf Farms",
      on: "Apr 29",
      text: "Sorry about that. We've upgraded our cushioning — write us for a partial credit.",
    },
  },
  {
    id: 5,
    name: "Zainab Bello",
    place: "Port Harcourt",
    date: "Apr 22, 2026",
    rating: 5,
    product: "Mixed Pepper Pack",
    text: "Spicy, fresh, fairly priced. Better than what I get at the market.",
    reply: null,
  },
  {
    id: 6,
    name: "Tunde Williams",
    place: "Lagos",
    date: "Apr 18, 2026",
    rating: 4,
    product: "Sweet Potatoes, 3kg",
    text: "Tasted exactly as described. Will buy again — just wish there was a bigger size option.",
    reply: null,
  },
  {
    id: 7,
    name: "Ngozi Umeh",
    place: "Enugu",
    date: "Apr 10, 2026",
    rating: 2,
    product: "Plantains, bunch of 8",
    text: "Arrived overripe. Had to use them all in one weekend. Taste was fine but I expected greener fruit.",
    reply: null,
  },
  {
    id: 8,
    name: "Samuel Otieno",
    place: "Nairobi",
    date: "Apr 2, 2026",
    rating: 5,
    product: "Avocados, 1kg",
    text: "Creamy, perfectly ripe, immaculate condition. Best avocados I've had this year.",
    reply: null,
  },
];

const filters = [
  { key: "all", label: "All" },
  { key: "5", label: "5" },
  { key: "4", label: "4" },
  { key: "3", label: "3" },
  { key: "2", label: "2" },
  { key: "1", label: "1" },
];

function Stars({ value }) {
  return (
    <span className="stars" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={i <= value ? "on" : "off"}
        />
      ))}
    </span>
  );
}

function Reviews() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  const visible =
    filter === "all"
      ? reviews
      : reviews.filter((r) => r.rating === Number(filter));

  const avg = (
    reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <main className="page-layout">
      <Aside />

      <section id="main-page">
        <article className="rv">
          <header className="rv-head">
            <p className="rv-kicker">Reviews</p>
            <h1 className="rv-avg">
              {avg}
              <span className="rv-of">/ 5</span>
            </h1>
            <p className="rv-meta">
              Average across {reviews.length} verified reviews
            </p>
          </header>

          <nav className="rv-filters" aria-label="Filter by rating">
            {filters.map((f) => (
              <button
                key={f.key}
                className={filter === f.key ? "is-active" : ""}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </nav>

          <ol className="rv-list" key={filter}>
            {visible.map((r, i) => (
              <li key={r.id} className="rv-item" style={{ "--i": i }}>
                <div className="rv-item-top">
                  <div className="rv-who">
                    <h3>{r.name}</h3>
                    <p>
                      {r.place} <span className="rv-dot">·</span> {r.date}
                    </p>
                  </div>
                  <Stars value={r.rating} />
                </div>

                <p className="rv-product">{r.product}</p>
                <p className="rv-text">{r.text}</p>

                {r.reply && (
                  <div className="rv-reply" role="note">
                    <p className="rv-reply-head">
                      {r.reply.from}
                      <span className="rv-dot">·</span>
                      {r.reply.on}
                    </p>
                    <p className="rv-reply-text">{r.reply.text}</p>
                  </div>
                )}
              </li>
            ))}
          </ol>

          {visible.length === 0 && (
            <p className="rv-empty">No reviews at this rating.</p>
          )}
        </article>
      </section>
    </main>
  );
}

export default Reviews;
