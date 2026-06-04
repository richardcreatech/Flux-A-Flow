import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/disp.css";
import Aside from "../../components/Aside";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import API_BASE_URL from "../../config/api";

function Prod() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [nickname, setNickname] = useState("");
  const [desc, setDesc] = useState("");
  const [origin, setOrigin] = useState("");
  const [prods, setProds] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, set_categories] = useState(["all"]);

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
      const res = await fetch(`${API_BASE_URL}/auth/social-profile`, {
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
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
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

    const res = await fetch(`${API_BASE_URL}/auth/all-products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
      <section id="main-page" className="prod_page">
        <section id="search_my_prod">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <nav>
            <ul>
              {categories?.map((i) => (
                <li onClick={() => setSelectedMarket(i)}>{i}</li>
              ))}
            </ul>
          </nav>
        </section>
        <section id="products-page">
          {filteredProducts?.map(
            ({
              imageURL,

              marketplaceName,

              name,

              price,

              quantity,

              _id,
            }) => (
              <article className="product_card" key={_id}>
                <img src={imageURL} alt="" />

                <div className="product_content">
                  <h2>
                    {name}{" "}
                    <sup>
                      {" "}
                      <span className="marketplace_tag">
                        ● {marketplaceName}
                      </span>
                    </sup>
                  </h2>

                  <div className="product_stats">
                    <span>
                      <small>Price</small>

                      <p>₦{price}</p>
                    </span>

                    <span>
                      <small>Quantity</small>

                      <p>{quantity}</p>
                    </span>
                  </div>
                </div>
              </article>
            ),
          )}
        </section>
      </section>
    </main>
  );
}

export default Prod;
