import { LoginContext } from "./helper/LoginContext";
import { SelectedCourseContext } from "./helper/SelectedCourseContext";
import { useState } from "react";
import { auth, db } from "./config/Firebase";
import { TopBar } from "./components/TopBar";
import { CourseSelection } from "./components/CourseSelection";
import { CourseContent } from "./components/CourseContent";
import "./App.css";

function isLoggedIn() {
  if (auth.currentUser) {
    return true;
  } else {
    return false;
  }
}

function App() {
  const [loginStatus, setLoginStatus] = useState(isLoggedIn());
  const [selectedCourse, setSelectedCourse] = useState("");

  return (
    <LoginContext.Provider value={{ loginStatus, setLoginStatus }}>
      <div className="top-bar">
        <TopBar />
      </div>
      <SelectedCourseContext.Provider
        value={{ selectedCourse, setSelectedCourse }}
      >
        <div className="course-selection">
          <CourseSelection />
        </div>
        <div className="course-content">
          <CourseContent />
        </div>
      </SelectedCourseContext.Provider>
    </LoginContext.Provider>
  );
}

export default App;
