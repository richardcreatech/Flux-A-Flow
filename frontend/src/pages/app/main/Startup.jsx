import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../../../styles/startup.css";
import logo from "../../../assets/logo.png";

function Startup() {
  window.addEventListener(
    "keydown",
    (event) => {
      if (
        event.ctrlKey &&
        (event.key === "+" || event.key === "-" || event.key === "=")
      ) {
        event.preventDefault();
      }
    },
    { passive: false },
  );

  document.addEventListener(
    "touchmove",
    (event) => {
      if (event.scale !== 1) {
        event.preventDefault();
      }
    },
    { passive: false },
  );

  document.addEventListener(
    "gesturestart",
    function (e) {
      e.preventDefault(); // Prevent zoom gesture
    },
    { passive: false },
  );

  return (
    <main id="startup_page">
      <aside id="first_aside">
        <div id="logo">
          <img src={logo} alt="Logo" width={30} height={30} />
        </div>

        <nav id="nav">
          <ul>
            <li>
              <Link to="/main">
                <FontAwesomeIcon
                  className="icon-outline"
                  icon={faEye}
                  size="2x"
                />
              </Link>
            </li>
            <li>
              <Link to="/main">
                <FontAwesomeIcon
                  className="icon-outline"
                  icon={faLightbulb}
                  size="2x"
                />
              </Link>
            </li>
            <li>
              <Link to="/main">
                {/* <FontAwesomeIcon className="icon-outline" icon={faBookOpen} size="2x" /> */}
                <FontAwesomeIcon
                  className="icon-outline"
                  icon={faBook}
                  size="2x"
                />
              </Link>
            </li>
            <li>
              <Link to="/main">
                <FontAwesomeIcon
                  className="icon-outline"
                  icon={faCalendar}
                  size="2x"
                />
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <section id="startup_main">
        <header id="header"></header>

        <main id="startup_content">
          <aside id="startup_sidebar">
            <div id="startup_caption">
              <h2>My Startups</h2>
            </div>
            <nav>
              <ul>
                <li className="active">Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
              </ul>
            </nav>
          </aside>

          <section id="startup_view">
            <section id="startup_view_window">
              <section id="startup_target">
                <div className="container">
                  <h1 id="targetCount">90%</h1>
                  <br />
                  <input type="range" id="slider" />
                </div>
              </section>

              <section id="startup_info">
                <section id="startup_prt_1">
                  <main className="startup_grid">
                    <section id="startup_pitch_deck">
                      <section id="my pitch"></section>
                      <div id="pitch_deck_btns">
                        <button>View Pitch </button>
                        <button>Replace Pitch</button>
                      </div>
                    </section>
                    <section id="startup_pitch_deck">
                      <section id="my pitch"></section>
                      <div id="pitch_deck_btns">
                        <button>View Pitch </button>
                        <button>Replace Pitch</button>
                      </div>
                    </section>
                  </main>
<br />
                  <main className="startup_grid">
                    <section id="startup_pitch_deck">
                      <div id="pitch_deck_btns">
                        <button>View Pitch </button>
                        <button>Replace Pitch</button>
                      </div>
                    </section>
                    <section id="startup_pitch_deck">
                      <div id="pitch_deck_btns">
                        <button>View Pitch </button>
                        <button>Replace Pitch</button>
                      </div>
                    </section>
                  </main>
                </section>
              <section id="startup_prt_2">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos
                saepe maiores animi, ut nihil illum placeat provident similique
                exercitationem maxime perferendis est possimus voluptatum dolore
                ullam expedita qui voluptatem delectus?
              </section>
              </section>

            </section>
          </section>
        </main>

        <button id="create_new_strtup_btn">
          <FontAwesomeIcon icon={faPlus} /> <small>Create New Startup</small>
        </button>
      </section>
    </main>
  );
}

export default Startup;
