import { useContext, useEffect } from "react";
import { signOut } from "firebase/auth";
import { LoginContext } from "../helper/LoginContext";
import { Navigate } from "react-router-dom";
import { auth } from "../config/Firebase";

export function CourseEditor() {
  const { loginStatus, setLoginStatus } = useContext(LoginContext);

  if (!loginStatus) {
    return <Navigate to="/" />;
  }

  const logout = async () => {
    try {
      await signOut(auth).then(() => {
        setLoginStatus(false);
      });
    } catch (err) {
      console.error(auth);
    }
    console.log(loginStatus);
  };

  return (
    <div>
      <h1>In Course Editor</h1>
      <button
        onClick={() => {
          logout();
        }}
      >
        logout
      </button>
    </div>
  );
}
