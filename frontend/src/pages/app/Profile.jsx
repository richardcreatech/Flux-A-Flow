import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoltLightning } from "@fortawesome/free-solid-svg-icons";
import Aside from "../../components/Aside";
import { useNavigate } from "react-router-dom";
import "../../styles/profile.css";

function Profile() {
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
        {!hasSocialProfile && (
          <section id="social_profile_creation_space">
            <form
              onSubmit={(e) => handleProfileCreation(e)}
              id="profileForm"
              enctype="multipart/form-data"
            >
              <div>
                <label for="profile_picture">Profile Picture</label>

                <label for="profile_picture" className="custom-file-upload">
                  Choose Profile Picture
                </label>

                <input
                  type="file"
                  id="profile_picture"
                  name="profile_picture"
                  accept="image/*"
                  onChange={(e) => {
                    handleUploadedProfilePicture(e);
                  }}
                />
              </div>
              <div>
                <label for="nickname">Nickname</label>
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  type="text"
                  id="nickname"
                  name="nickname"
                  placeholder="Enter Nickname"
                  required
                />
                <input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  type="text"
                  id="nickname"
                  name="nickname"
                  placeholder="Enter Description"
                  required
                />
                <input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  type="text"
                  id="nickname"
                  name="nickname"
                  placeholder="Enter Origin Country"
                  required
                />
              </div>

              <button type="submit">
                <FontAwesomeIcon icon={faBoltLightning} />
                Create a Social Profile
              </button>
            </form>
          </section>
        )}
        {handleProfileCreation && (
          <section id="my_profile">
            <article>
              <div id="my_pic">
                <img src={profilePicture} alt="" width={50} height={50} />
              </div>
              <div id="my_info">
                <h3>{nickname} </h3>
                <small>{origin}</small>
                <p>{desc}</p>
              </div>
            </article>

            <article id="edit_prof_pic">
              <label htmlFor="profile_upload" id="profile_preview">
                {preview ? (
                  <img src={preview} alt="Preview" />
                ) : (
                  <span>Upload Photo</span>
                )}
              </label>

              <input
                id="profile_upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              <button>Save Changes</button>
            </article>

            <article id="edit_profile">
              <div>
                <h2>Profile Information</h2>
                <p>Update your personal and farm details</p>
              </div>
              <br />
              <form id="edit_pnl" action="">
                <label>
                  <p>Nickname</p>
                  <input type="text" name="" id="" />
                </label>

                <label>
                  <p>Origin</p>
                  <input type="text" name="" id="" />
                </label>

                <label>
                  <p>Description</p>
                  <textarea name="" id=""></textarea>
                </label>

                <button id="edit_btn">Edit Profile</button>
              </form>
            </article>
          </section>
        )}
      </section>
    </main>
  );
}

export default Profile;
