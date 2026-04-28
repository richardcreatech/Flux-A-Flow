import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faUserInjured,
  faUserDoctor,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import "../../../styles/dashboard.css";

function Dashboard() {

  return (
    <main id="dashboard">
      {/* SIDEBAR */}
      <aside className="nav-bar">
      
        <nav>
          <ul className="nav-links">
            <li className="active">
              <FontAwesomeIcon icon={faGauge} />
              <span>Dashboard</span>
            </li>

            


            <li>
              <FontAwesomeIcon icon={faGear} />
              <span>Settings</span>
            </li>
          </ul>
          <ul className="quick-links">
            <li>
              <FontAwesomeIcon icon={faGauge} />
              <span>Overview</span>
            </li>

            <li>
              <FontAwesomeIcon icon={faUserInjured} />
              <span>Reviews</span>
            </li>

            <li>
              <FontAwesomeIcon icon={faUserDoctor} />
              <span>Appointments</span>
            </li>

            <li>
              <FontAwesomeIcon icon={faGear} />
              <span>Reports</span>
            </li>
          </ul>
        </nav>
      </aside>

   
    </main>
  );
}

export default Dashboard;
