import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/market.css";
import Aside from "../../components/Aside";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";

function MarketPlace() {
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);
  const [nickname, setNickname] = useState("");
  const [desc, setDesc] = useState("");
  const [origin, setOrigin] = useState("");
  const [hasSocialProfile, setHasSocialProfile] = useState(false);

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

  const handleProfileCreation = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("profile_picture", profilePicture);
    formData.append("nickname", nickname);
    formData.append("description", desc);
    formData.append("originCountry", origin);

    const res = await fetch("http://localhost:5000/auth/upload-profile", {
      method: "POST",
      headers: {
        // This tells the backend WHO is making the request
        Authorization: `Bearer ${token}`,
      },
      body: formData, // Note: Don't set Content-Type header manually for FormData
    });

    const data = await res.json();
    location.reload();
  };

  useEffect(() => {
    check_for_social_profile();
    check_for_token();
  }, []);

  return (
    <main className="page-layout">
      <Aside />

      <section id="main-page">

        <section id="save_a_marketplace">
          <form action="">
          <span><FontAwesomeIcon icon={faClose}/></span>
            <label htmlFor="">
              <p>Title</p>
              <input type="text" name="" id="" />
            </label>
            <label htmlFor="">
              <p>Description</p>
              <input type="text" name="" id="" />
            </label>

            <button>Create MarketPlace</button>
          </form>
      </section>

        <main id="marketplace_idle">
          <img src={logo} alt="" />
          <p>There are No Marketplaces</p>
          <br /> <button id="create_a_marketplace">< FontAwesomeIcon icon={faPlus} />Create a Marketplace</button>
        </main>
      </section>
    </main>
  );
}

export default MarketPlace;
