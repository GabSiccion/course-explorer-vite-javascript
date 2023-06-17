import { useState } from "react";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { IconContext } from "react-icons";
import "./Navbar.css";
import { auth } from "../config/Firebase";
import { signOut } from "firebase/auth";
import { useContext } from "react";
import { LoginContext } from "../helper/LoginContext";

export function Navbar() {
  const { loginStatus, setLoginStatus } = useContext(LoginContext);

  const logout = async () => {
    try {
      await signOut(auth).then(() => {
        setLoginStatus(false);
      });
    } catch (err) {
      console.error(auth);
    }
  };

  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

  return (
    <div class="sticky-top">
      <IconContext.Provider value={{ color: "green" }}>
        <div className="navbar sticky-top">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            <li key="1" className="nav-text">
              <Link to="dashboard">
                <IoIcons.IoMdHome />
                <span>Dashboard</span>
              </Link>
            </li>
            <li key="2" className="nav-text">
              <Link to="course_content">
                <IoIcons.IoMdBook />
                <span>Courses</span>
              </Link>
            </li>
            <li key="3" className="nav-text">
              <Link to="quiz_content">
                <IoIcons.IoMdSchool />
                <span>Quizes</span>
              </Link>
            </li>
            <li key="4" className="nav-text">
              <Link to="account_management">
                <IoIcons.IoMdLock />
                <span>Accounts</span>
              </Link>
            </li>
            <li key="5" className="nav-text">
              <Link to="#" onClick={logout}>
                <IoIcons.IoIosLogOut />
                <span>Logout</span>
              </Link>
            </li>
            <li key="6" className="nav-text">
              <Link to="viewer_site">
                <IoIcons.IoIosBriefcase />
                <span>Viewer</span>
              </Link>
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </div>
  );
}
