import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faStore,
  faSeedling,
  faBoxOpen,
  faCoins,
  faTruck,
  faStar,
  faGear,
  faChartDiagram,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Aside() {
  return (
    <aside>
      <div>
        <img src={logo} alt="" />
        <h3>Flux-A-Flow</h3>
      </div>

      <nav>
        <ul>
          <li>
            <Link to="/home">
              <FontAwesomeIcon icon={faChartDiagram} />
              <small>Home</small>
            </Link>
          </li>

          <li>
            <Link to="/profile">
              <FontAwesomeIcon icon={faUser} />
              <small>My Profile</small>
            </Link>
          </li>

          <li>
            <Link to="/marketplace">
              <FontAwesomeIcon icon={faStore} />
              <small>Marketplace</small>
            </Link>
          </li>

          <li>
            <Link to="/reviews">
              <FontAwesomeIcon icon={faStar} />
              <small>Reviews</small>
            </Link>
          </li>

          <li>
            <Link to="/prod">
              <FontAwesomeIcon icon={faSeedling} />
              <small>Products</small>
            </Link>
          </li>

          <li>
            <Link to="/revenue">
              <FontAwesomeIcon icon={faCoins} />
              <small>Revenue</small>
            </Link>
          </li>

        
        </ul>
      </nav>
      <hr />
      <article id="my_aside_profile">
        <div id="sign_out_box">
          <strong>Don't leave</strong>
          <br />
          <small>Thank you for your patronage</small>
          <br />
          <button onClick={() => {
            localStorage.removeItem('token');
            location.assign("/")
          }}>
            <FontAwesomeIcon icon={faDoorOpen} />{" "}
            <span className="btn-label">Sign Out</span>
          </button>
        </div>
      </article>
    </aside>
  );
}

export default Aside;
