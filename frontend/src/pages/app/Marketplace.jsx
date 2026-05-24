import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Aside from "../../components/Aside";
import { useNavigate } from "react-router-dom";

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
     Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt quod atque ea maxime, dolorem iure reprehenderit ullam porro vero ab deleniti soluta. Saepe, optio quia. Illum error eligendi eius blanditiis, tempora nesciunt est nostrum ratione necessitatibus! Pariatur, fugit? Dolorum cum, asperiores dolore quod cumque ut. Ea minima autem facere sint voluptas esse nesciunt tenetur ipsum amet, adipisci numquam iste odio distinctio in incidunt officia aliquam earum eius voluptate maxime aspernatur sunt et! Nulla, et suscipit? Asperiores rem sapiente laborum similique corrupti in, sint doloremque temporibus voluptatibus officiis, recusandae libero debitis assumenda obcaecati. Rem quas consectetur cumque excepturi voluptates id quo magni voluptas a asperiores vel qui laboriosam debitis dolorum magnam, quos, eum quia ipsum sint aperiam ea voluptatum. Ullam nemo maxime tempora blanditiis architecto sunt aspernatur, error vitae! Aut deserunt veritatis consectetur perferendis. Adipisci maiores dolor tempora, repellat cum reiciendis explicabo ab totam ad incidunt ratione expedita dolorem necessitatibus atque delectus vero libero sunt voluptatem dolorum consectetur officiis blanditiis itaque iusto! Nesciunt harum non iste ipsum veritatis nisi cum culpa deserunt eos impedit, aperiam quod sunt in. Eveniet, id. Necessitatibus, enim iste? Dignissimos odio dolore blanditiis facilis, enim unde. Molestiae quae ipsum voluptate similique odio possimus debitis corporis, ipsam animi. Dolorem reprehenderit nostrum exercitationem corrupti eaque soluta quisquam, odio quam blanditiis sit similique a cumque vero fugit consectetur aliquam iste! Officiis deserunt quo facilis vel doloribus ipsam non aut recusandae omnis tempore tempora voluptas dolores, totam tenetur sunt cum quos commodi! Et, dolorum cumque! Provident excepturi id reiciendis, natus quas quia dolore deleniti mollitia earum incidunt architecto at aperiam fugiat dolorum eaque unde ex nam quasi asperiores odit suscipit? Quasi ratione assumenda molestias a odit incidunt officia, totam est possimus sapiente distinctio tenetur ea aspernatur eius aliquid quis modi cupiditate sint harum eum eaque ducimus rem? Ab quas soluta expedita ducimus debitis veniam ea non quos iusto excepturi porro perferendis quod, repellendus animi in fuga, beatae, placeat sed hic? Possimus modi qui ex neque nostrum veritatis et natus a facilis voluptatem laborum ad reprehenderit est sequi velit ut, tempore dolorum commodi reiciendis sit tenetur odio repellat similique. Possimus, vitae commodi optio sapiente voluptatem ratione, molestiae adipisci magnam asperiores quia rerum eius explicabo tenetur error ab reiciendis est iure ducimus ex excepturi culpa. Laudantium velit a deserunt minima, inventore officia expedita nulla debitis ea nihil, exercitationem autem, illo aspernatur commodi ratione? Rerum, quasi consequatur. Excepturi laborum quis consectetur veniam dolor necessitatibus.
      </section>
    </main>
  );
}

export default MarketPlace;