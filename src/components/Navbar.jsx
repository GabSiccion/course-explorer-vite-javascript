import { useState } from "react";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { IconContext } from "react-icons";
import "./Navbar.css";

export function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: "black" }}>
        <div className="navbar">
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
              <Link to="course_analytics">
                <IoIcons.IoMdPeople />
                <span>Courses Analytics</span>
              </Link>
            </li>
            <li key="2" className="nav-text">
              <Link to="course_content">
                <IoIcons.IoMdPeople />
                <span>Courses Contents</span>
              </Link>
            </li>
            <li key="3" className="nav-text">
              <Link to="account_management">
                <IoIcons.IoMdPeople />
                <span>Accounts Management</span>
              </Link>
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}
