import { LoginContext } from "./helper/LoginContext";
import { useState } from "react";
import { auth } from "./config/Firebase";
import { LoginAuth } from "./pages/LoginAuth";
import { CourseEditor } from "./pages/CourseEditor";
import "./App.css";
import { Router, Route, Routes } from "react-router-dom";

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
    <div className="app">
      <LoginContext.Provider value={{ loginStatus, setLoginStatus }}>
        <Routes>
          <Route path="/" element={<LoginAuth />} />
          <Route path="/editor" element={<CourseEditor />} />
        </Routes>
      </LoginContext.Provider>
    </div>
  );
  /* return (
    <LoginContext.Provider value={{ loginStatus, setLoginStatus }}>
      <div className="top-bar">
        <LoginAuth />
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
  ); */
}

export default App;
