import { useEffect, useState, useRef } from "react";
import "../../styles/revenue.css";
import Aside from "../../components/Aside";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyCheck,
  faClose,
  faAdd,
} from "@fortawesome/free-solid-svg-icons";
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
  const [months, setMonths] = useState([]);
  const [my_rev, setMyRev] = useState([]);

  const data = {
    labels: months,
    datasets: [
      {
        label: "Revenue",
        data: my_rev,
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

  const [revenueData, setRevenueData] = useState([]);

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [nickname, setNickname] = useState("");
  const [desc, setDesc] = useState("");
  const [origin, setOrigin] = useState("");
  const [prods, setProds] = useState([]);
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [users_bank, setUsersBank] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [search, setSearch] = useState("");
  const [categories, set_categories] = useState(["all"]);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalPlatformFees, setTotalPlatformFees] = useState(6000);

  const [hasSocialProfile, setHasSocialProfile] = useState(false);
  const add_bank = useRef(null);
  const edit_bank = useRef(null);
  const [topProducts, setTopProducts] = useState([]);
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

  const close_form = () => {
    add_bank.current.classList.toggle("show");
  };

  const close_ed_form = () => {
    edit_bank.current.classList.toggle("show");
  };

  const add_bank_details = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const bankDetails = {
      accountName,
      accountNumber,
      bankName,
      bankCode,
    };

    const res = await fetch("http://localhost:5000/auth/bank-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bankDetails),
    });

    const data = await res.json();

    console.log(data);
  };

  const edit_bank_details = async () => {
    const token = localStorage.getItem("token");

    const bankDetails = {
      accountName,
      accountNumber,
      bankName,
      bankCode,
    };

    const res = await fetch("http://localhost:5000/auth/bank-details", {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(bankDetails),
    });

    const data = await res.json();
    console.log(data);
    location.reload();
  };

  const loadBankDetails = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/auth/bank-details", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setUsersBank(data.bankDetails);
    console.log(data);
  };

  const loadRevenue = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/auth/revenue", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    console.log(data.revenue);

    setRevenueData(data.revenue);

    const revenueData = data.revenue;
    const arr_of_months = revenueData.map((item) => item.month);
    const arr_of_revenue = revenueData.map((item) => item.revenue);

    const total = arr_of_revenue.reduce((acc, val) => acc + val, 0);
    setTotalRevenue(total);

    setMonths(arr_of_months);
    setMyRev(arr_of_revenue);
  };

  const loadTopProducts = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/auth/top-products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    console.log(data.products);

    setTopProducts(data.products);
  };

  useEffect(() => {
    check_for_token();
    check_for_social_profile();
    loadProducts();
    loadBankDetails();
    loadRevenue();
    loadTopProducts();
  }, []);

  return (
    <main className="page-layout">
      <Aside />
      <section id="main-page">
        <section id="revenue-page">
          <section id="add_bank_details" ref={add_bank}>
            <form action="" onSubmit={(e) => add_bank_details(e)}>
              <FontAwesomeIcon icon={faClose} onClick={close_form} />
              <input
                type="text"
                placeholder="Account Name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />

              <input
                type="number"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />

              <input
                type="text"
                placeholder="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />

              <input
                type="number"
                placeholder="Bank Code"
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
              />
              <button id="add_bank_dets">Add Bank Details</button>
            </form>
          </section>
          <section id="edit_bank_details" ref={edit_bank}>
            <form action="" onSubmit={(e) => edit_bank_details(e)}>
              <FontAwesomeIcon icon={faClose} onClick={close_ed_form} />
              <input
                type="text"
                placeholder="Account Name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />

              <input
                type="number"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />

              <input
                type="text"
                placeholder="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />

              <input
                type="number"
                placeholder="Bank Code"
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
              />
              <button id="add_bank_dets">Edit Bank Details</button>
            </form>
          </section>

          <section id="rev-sep">
            <small className="revenue_dets">Revenue Summary</small>
            {!users_bank && (
              <FontAwesomeIcon icon={faAdd} onClick={close_form} />
            )}
          </section>

          <section id="revenue_details">
            <article className="metric-card total-revenue">
              <span>
                <FontAwesomeIcon icon={faMoneyCheck} />
              </span>
              <div>
                <p>Total Revenue</p>
                <h1>₦{totalRevenue}</h1>
              </div>
            </article>
            <article className="metric-card platform-fees">
              <span>
                <FontAwesomeIcon icon={faMoneyCheck} />
              </span>
              <div>
                <p>Platform Fees</p>
                <h1>₦{totalPlatformFees}</h1>
              </div>
            </article>

            <article className="metric-card net-earnings">
              <span>
                <FontAwesomeIcon icon={faMoneyCheck} />
              </span>
              <div>
                <p>Net Revenue</p>
                <h1>₦{totalRevenue - totalPlatformFees}</h1>
              </div>
            </article>
          </section>

          <small className="revenue_dets">Revenue Overview</small>
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
                {topProducts.map((product) => (
                  <li key={product.productId}>
                    <span>
                      <img src={product.imageURL} alt={product.productName} />

                      <small>{product.totalOrders} Orders</small>
                    </span>

                    <span>
                      <p>₦{product.totalRevenue.toLocaleString()}</p>
                    </span>
                  </li>
                ))}
              </ul>
            </article>
{/* 
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
            </article> */}

            <article className="payment-card">
              <header>
                <h2>Payment details</h2>
              </header>
              <div className="bank_account_card">
                <div className="card_header">
                  <small>Payout Account</small>

                  <div className="card_chip" onClick={close_ed_form}></div>
                </div>

                <div className="card_body">
                  <h3>{users_bank?.bankName || "No Bank Added"}</h3>

                  <p className="account_number">
                    {users_bank?.accountNumber
                      ? `**** **** **** ${users_bank.accountNumber.slice(-4)}`
                      : "Add your payout account"}
                  </p>
                </div>

                <div className="card_footer">
                  <span>{users_bank?.accountName || "Not Configured"}</span>

                  {users_bank?.verified && (
                    <span className="verified_badge">✓ Verified</span>
                  )}
                </div>
              </div>
            </article>
          </section>
        </section>
      </section>
    </main>
  );
}

export default Revenue;
