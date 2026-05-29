import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/disp.css";
import Aside from "../../components/Aside";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";

function Prod() {
  const navigate = useNavigate();
  const create_a_market = useRef(null);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [nickname, setNickname] = useState("");
  const [desc, setDesc] = useState("");
  const [origin, setOrigin] = useState("");
  const [prods, setProds] = useState([]);
  const [hasSocialProfile, setHasSocialProfile] = useState(false);

  const [my_markets, set_my_markets] = useState([]);

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

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
  };

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

  useEffect(() => {
    check_for_token();
    check_for_social_profile();
    loadProducts();
  }, []);

  const heights = [18, 24, 20, 16, 22];

  return (
    <main className="page-layout">
      <Aside />

      <section id="main-page">
        <section id="products-page">
          {prods?.map(
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

                  <h2>{name} <sup>  <span className="marketplace_tag">● {marketplaceName}</span></sup></h2>

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
