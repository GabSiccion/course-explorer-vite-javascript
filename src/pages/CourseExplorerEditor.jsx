import { useContext } from "react";
import { signOut } from "firebase/auth";
import { LoginContext } from "../helper/LoginContext";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../config/Firebase";
import { Navbar } from "../components/Navbar";

export function CourseExplorerEditor() {
  const { loginStatus, setLoginStatus } = useContext(LoginContext);

  if (!loginStatus) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
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
