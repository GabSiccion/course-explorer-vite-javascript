import { TopBar } from "./components/TopBar";
import { LoginContext } from "./helper/LoginContext";
import { SelectedCourseContext } from "./helper/SelectedCourseContext";
import { useState } from "react";
import { auth, db } from "./config/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { CourseSelection } from "./components/CourseSelection";
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

  async function deleteCourse() {
    try {
      await deleteDoc(doc(db, "courses", selectedCourse));
    } catch (error) {
      console.error(error);
    }
  }

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
          <button type="button" onClick={() => deleteCourse()}>
            Delete
          </button>
        </div>
      </SelectedCourseContext.Provider>
    </LoginContext.Provider>
  );
}

export default App;
