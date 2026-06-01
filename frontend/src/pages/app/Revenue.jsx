import { useEffect, useState } from "react";
import "../../styles/revenue.css";
import Aside from "../../components/Aside";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyCheck } from "@fortawesome/free-solid-svg-icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
);

function Revenue() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Revenue",
        data: [40000, 80000, 60000, 120000, 245000],
        borderColor: "#1a7f3c",
        borderWidth: 2,
        pointRadius: 4,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2.5,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `₦${ctx.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (v) => `₦${(v / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [nickname, setNickname] = useState("");
  const [desc, setDesc] = useState("");
  const [origin, setOrigin] = useState("");
  const [prods, setProds] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, set_categories] = useState(["all"]);

  const transactions = [
    {
      date: "Jun 2, 2025 09:41 AM",
      orderId: "#ORD-1256",
      product: "Fresh Tomatoes (20kg)",
      buyer: "Adaeze Chinaza",
      amount: 12000,
      status: "Completed",
    },
    {
      date: "Jun 2, 2025 08:22 AM",
      orderId: "#ORD-1255",
      product: "Maize (50kg)",
      buyer: "Emeka Okafor",
      amount: 18500,
      status: "Completed",
    },
    {
      date: "Jun 1, 2025 07:15 PM",
      orderId: "#ORD-1254",
      product: "Rice Local (25kg)",
      buyer: "Patrick Eze",
      amount: 15000,
      status: "Completed",
    },
    {
      date: "Jun 1, 2025 03:11 PM",
      orderId: "#ORD-1253",
      product: "Fresh Pepper (5kg)",
      buyer: "Blessing Nwosu",
      amount: 7500,
      status: "Pending",
    },
    {
      date: "Jun 1, 2025 11:05 AM",
      orderId: "#ORD-1252",
      product: "Yam (30kg)",
      buyer: "Chinedu Obasi",
      amount: 16000,
      status: "Completed",
    },
  ];

  const [hasSocialProfile, setHasSocialProfile] = useState(false);

  const [my_markets, set_my_markets] = useState([]);

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState("My Market");

  const filteredProducts = prods.filter((product) => {
    if (selectedMarket == "all") {
      return product.name.toLowerCase().includes(search.toLowerCase());
    }
    return (
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      product.marketplaceName == selectedMarket
    );
  });

  const check_for_social_profile = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/auth/social-profile", {
        method: "GET",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
        setHasSocialProfile(data.hasProfile);
        return;
      }

      if (data.hasProfile) {
        setNickname(data.profile.nickname);
        setHasSocialProfile(data.hasProfile);
        setDesc(data.profile.description);
        setOrigin(data.profile.originCountry);
        setProfilePicture(data.profile.profilePicture);
      } else {
        setNickname("");

        setProfilePicture(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const check_for_token = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/register");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ FIXED
        },
      });

      if (!res.ok) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();
      setUser(data.user); // ✅ store user
    } catch (err) {
      console.error(err);
    }
  };

  const loadProducts = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/auth/all-products",

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();
    setProds(data.products);
    console.log(data.products[0]);
    let all_categories = [...categories];

    for (let i = 0; i < data.products.length; i++) {
      const marketName = data.products[i].marketplaceName;

      if (!all_categories.includes(marketName)) {
        all_categories.push(marketName);
      }
    }

    set_categories(all_categories);
  };

  useEffect(() => {
    check_for_token();
    check_for_social_profile();
    loadProducts();
  }, []);

  return (
    <main className="page-layout">
      <Aside />
      <section id="main-page">
        <section id="revenue-page">
          <small className="revenue_dets">Revenue Summary</small>
          <section id="revenue_details">
            <article className="metric-card total-revenue">
              <span>
                <FontAwesomeIcon icon={faMoneyCheck} />
              </span>
              <div>
                <p>Total Revenue</p>
                <h1>₦245000</h1>
              </div>
            </article>
            <article className="metric-card platform-fees">
              <span>
                <FontAwesomeIcon icon={faMoneyCheck} />
              </span>
              <div>
                <p>Platform Fees</p>
                <h1>₦45000</h1>
              </div>
            </article>
            <article className="metric-card total-orders">
              <span>
                <FontAwesomeIcon icon={faMoneyCheck} />
              </span>
              <div>
                <p>Total Orders</p>
                <h1>500</h1>
              </div>
            </article>
            <article className="metric-card net-earnings">
              <span>
                <FontAwesomeIcon icon={faMoneyCheck} />
              </span>
              <div>
                <p>Total Revenue</p>
                <h1>₦98000</h1>
              </div>
            </article>
          </section>

          <small className="revenue_dets">Revenue Summary</small>
          <br />
          <br />
          <section id="revenue_diary">
            <br />
            <article className="chart-card">
              <Line data={data} options={options} />
            </article>
            <article className="products-card">
              <header>
                <h2>Top Performing Products</h2>
                <p>View All</p>
              </header>

              <ul>
                <li>
                  <span>
                    <img
                      src={
                        "https://i.pinimg.com/736x/44/41/58/4441584c95a505aa32af278fbd1ccec2.jpg"
                      }
                      alt=""
                    />
                    <small>152 Orders</small>
                  </span>

                  <span>
                    <p>₦400000</p>
                  </span>
                </li>
                <li>
                  <span>
                    <img
                      src={
                        "https://i.pinimg.com/736x/44/41/58/4441584c95a505aa32af278fbd1ccec2.jpg"
                      }
                      alt=""
                    />
                    <small>152 Orders</small>
                  </span>

                  <span>
                    <p>₦400000</p>
                  </span>
                </li>
                <li>
                  <span>
                    <img
                      src={
                        "https://i.pinimg.com/736x/44/41/58/4441584c95a505aa32af278fbd1ccec2.jpg"
                      }
                      alt=""
                    />
                    <small>152 Orders</small>
                  </span>

                  <span>
                    <p>₦400000</p>
                  </span>
                </li>
                <li>
                  <span>
                    <img
                      src={
                        "https://i.pinimg.com/736x/44/41/58/4441584c95a505aa32af278fbd1ccec2.jpg"
                      }
                      alt=""
                    />
                    <small>152 Orders</small>
                  </span>

                  <span>
                    <p>₦400000</p>
                  </span>
                </li>
                <li>
                  <span>
                    <img
                      src={
                        "https://i.pinimg.com/736x/44/41/58/4441584c95a505aa32af278fbd1ccec2.jpg"
                      }
                      alt=""
                    />
                    <small>152 Orders</small>
                  </span>

                  <span>
                    <p>₦400000</p>
                  </span>
                </li>
                <li>
                  <span>
                    <img
                      src={
                        "https://i.pinimg.com/736x/44/41/58/4441584c95a505aa32af278fbd1ccec2.jpg"
                      }
                      alt=""
                    />
                    <small>152 Orders</small>
                  </span>

                  <span>
                    <p>₦400000</p>
                  </span>
                </li>
                <li>
                  <span>
                    <img
                      src={
                        "https://i.pinimg.com/736x/44/41/58/4441584c95a505aa32af278fbd1ccec2.jpg"
                      }
                      alt=""
                    />
                    <small>152 Orders</small>
                  </span>

                  <span>
                    <p>₦400000</p>
                  </span>
                </li>
                <li>
                  <span>
                    <img
                      src={
                        "https://i.pinimg.com/736x/44/41/58/4441584c95a505aa32af278fbd1ccec2.jpg"
                      }
                      alt=""
                    />
                    <small>152 Orders</small>
                  </span>

                  <span>
                    <p>₦400000</p>
                  </span>
                </li>
                <li>
                  <span>
                    <img
                      src={
                        "https://i.pinimg.com/736x/44/41/58/4441584c95a505aa32af278fbd1ccec2.jpg"
                      }
                      alt=""
                    />
                    <small>152 Orders</small>
                  </span>

                  <span>
                    <p>₦400000</p>
                  </span>
                </li>
              </ul>
            
            </article>

            <article className="recent-transactions">
              <div className="recent-transactions__header">
                <h2>Recent Transactions</h2>
                <a href="/transactions">View all</a>
              </div>

              <table className="recent-transactions__table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Buyer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.orderId}>
                      <td>{tx.date}</td>
                      <td>{tx.orderId}</td>
                      <td>{tx.product}</td>
                      <td>{tx.buyer}</td>
                      <td>₦{tx.amount.toLocaleString()}</td>
                      <td>
                        <span
                          className={`status-badge status-badge--${tx.status.toLowerCase()}`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <a
                href="/transactions"
                className="recent-transactions__footer-link"
              >
                View all transactions →
              </a>
            </article>

            <article className="payment-card">
              <header>
                <h2>Payment details</h2>
              </header>
              <div>
                <span>
                  <small>Bank Account</small>
                  <p>Zenith Bank</p>
                  <p>**** **** **** 1234</p>
                </span>
                <button>Edit Bank Account</button>
              </div>
            </article>
          </section>
        </section>
      </section>
    </main>
  );
}

export default Revenue;
