import { LoginContext } from "./helper/LoginContext";
import { useState } from "react";
import { auth } from "./config/Firebase";
import { LoginAuth } from "./pages/LoginAuth";
import { CourseExplorerEditor } from "./pages/CourseExplorerEditor";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { AccountManagement } from "./components/AccountManagement";
import { CourseContent } from "./components/CourseContent";
import { Dashboard } from "./components/Dashboard";
import { Viewer } from "./components/Viewer";
import { QuizContent } from "./components/QuizContent";

function isLoggedIn() {
  if (auth.currentUser) {
    return true;
  } else {
    return false;
  }
}

function App() {
  const [loginStatus, setLoginStatus] = useState(isLoggedIn());
  return (
    <div className="app">
      <LoginContext.Provider value={{ loginStatus, setLoginStatus }}>
        <Routes>
          <Route path="/" element={<LoginAuth />} />
          <Route path="/course_editor" element={<CourseExplorerEditor />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="course_content" element={<CourseContent />} />
            <Route path="account_management" element={<AccountManagement />} />
            <Route path="quiz_content" element={<QuizContent />} />
            <Route path="viewer" element={<Viewer />} />
          </Route>
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
