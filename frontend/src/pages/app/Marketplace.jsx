import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/market.css";
import Aside from "../../components/Aside";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import io from "socket.io-client";

// const socket = io("http://localhost:5000", {
//   auth: {
//     token: localStorage.getItem("token"),
//   },
// });

function MarketPlace() {
  const create_a_market = useRef(null);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);
  const [nickname, setNickname] = useState("");
  const [desc, setDesc] = useState("");
  const [origin, setOrigin] = useState("");
  const [hasSocialProfile, setHasSocialProfile] = useState(false);

  const [my_markets, set_my_markets] = useState([]);

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUploadedProfilePicture = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const [market_name, set_market_name] = useState("");
  const [market_desc, set_market_desc] = useState("");

  const check_for_social_profile = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://flux-a-flow.onrender.com/auth/social-profile", {
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
      const res = await fetch("https://flux-a-flow.onrender.com/auth/profile", {
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

  const show_pop_up = () => {
    create_a_market.current.classList.toggle("show");
  };

  const loadMarkets = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://flux-a-flow.onrender.com/auth/marketplaces", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    set_my_markets(data.marketplaces);
  };

  const create_my_marketplace = async (e) => {
    e.preventDefault();
    // alert(`${market_name}  -  ${market_desc}`);

    const token = localStorage.getItem("token");

    const res = await fetch("https://flux-a-flow.onrender.com/auth/marketplace", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        title: market_name,
        description: market_desc,
      }),
    });

    const data = await res.json();
    location.reload();
  };

  const open_new_page = async (arg) => {
   location.assign(`marketplace/${arg}`)
 } 

  useEffect(() => {
    check_for_social_profile();
    check_for_token();
    loadMarkets();
  }, []);

  return (
    <main className="page-layout">
      <Aside />

      <section id="main-page">
        <section id="save_a_marketplace" ref={create_a_market}>
          <form action="" onSubmit={create_my_marketplace}>
            <span onClick={show_pop_up}>
              <FontAwesomeIcon icon={faClose} />
            </span>
            <label htmlFor="">
              <p>Title</p>
              <input
                type="text"
                value={market_name}
                onChange={(e) => set_market_name(e.target.value)}
                name=""
                id=""
              />
            </label>
            <label htmlFor="">
              <p>Description</p>
              <input
                type="text"
                name=""
                onChange={(e) => set_market_desc(e.target.value)}
                id=""
              />
            </label>

            <button>Create MarketPlace</button>
          </form>
        </section>

        {my_markets.length == 0 && (
          <main id="marketplace_idle">
            <img src={logo} alt="" />
            <p>There are No Marketplaces</p>
            <br />{" "}
            <button id="create_a_marketplace" onClick={show_pop_up}>
              <FontAwesomeIcon icon={faPlus} />
              Create a Marketplace
            </button>
          </main>
        )}
        {my_markets.length != 0 && (
          <button className="create_a_marketplace" onClick={show_pop_up}>
            <FontAwesomeIcon icon={faPlus} />
            Create a Marketplace
          </button>
        )}

        {my_markets.length !== 0 && (
          <section id="all_my_marketplaces">
            {my_markets.map((market) => (
              <article className="marketplace_card" key={market._id}>
                <div className="market_info">
                  <div className="about_market">
                    <h2>{market.title}</h2>

                    <p>{market.description || "No description"}</p>
                  </div>
                  <footer>

                    <button onClick={() => open_new_page(market._id)}>Open →</button>
                    <small>
                      {market.products?.length || 0}
                      {" "}{market.products?.length > 1  || market.products?.length ==0 ? "Categories" : "Category" }
                    </small>
                  </footer>
                </div>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

export default MarketPlace;
