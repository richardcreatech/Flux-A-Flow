import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faStore,
  faSeedling,
  faBoxOpen,
  faComments,
  faTruck,
  faStar,
  faGear,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";
import "../styles/profile.css"

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
                    <a href="#" >
                      <FontAwesomeIcon icon={faUser} />
                      <small>My Profile</small>
                    </a>
                  </li>
      
                  <li>
                    <a href="#">
                      <FontAwesomeIcon icon={faStore} />
                      <small>Marketplace</small>
                    </a>
                  </li>
      
                  <li>
                    <a href="#">
                      <FontAwesomeIcon icon={faSeedling} />
                      <small>Products</small>
                    </a>
                  </li>
      
                  <li>
                    <a href="#">
                      <FontAwesomeIcon icon={faBoxOpen} />
                      <small>Orders</small>
                    </a>
                  </li>
      
                  <li>
                    <a href="#">
                      <FontAwesomeIcon icon={faComments} />
                      <small>Messages</small>
                    </a>
                  </li>
      
                  <li>
                    <a href="#">
                      <FontAwesomeIcon icon={faTruck} />
                      <small>Delivery Settings</small>
                    </a>
                  </li>
      
                  <li>
                    <a href="#">
                      <FontAwesomeIcon icon={faStar} />
                      <small>Reviews</small>
                    </a>
                  </li>
      
                  <li>
                    <a href="#">
                      <FontAwesomeIcon icon={faGear} />
                      <small>Settings</small>
                    </a>
                  </li>
      
                  <li>
                    <a href="#">
                      <FontAwesomeIcon icon={faDoorOpen} />
                      <small>Sign Out</small>
                    </a>
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
                  <button>
                    <FontAwesomeIcon icon={faDoorOpen} /> Sign Out
                  </button>
                </div>
              </article>
            </aside>
  );
}

export default Aside;
