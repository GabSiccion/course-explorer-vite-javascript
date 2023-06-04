import { useState, useContext, useRef } from "react";
import { auth } from "../config/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./LoginAuth.css";
import { LoginContext } from "../helper/LoginContext";
import { Navigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

export function LoginAuth() {
  const popupRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, seterror] = useState("");

  const { loginStatus, setLoginStatus } = useContext(LoginContext);

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password).then(() => {
        setLoginStatus(true);
      });
    } catch (err) {
      console.error(err);
      seterror("Failed to Login");
    }
  };

  if (loginStatus) {
    return <Navigate to="editor" />;
  } else {
    return (
      <div className="Auth-container">
        <div className="login-background-image centered">
          <div className="login-container">
            <p className="p1">Course Explorer Admin</p>
            <input
              placeholder="Email..."
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password..."
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="popup-text" ref={popupRef}>
              {error}
            </p>
            <button onClick={signIn}>Sign in</button>
          </div>
        </div>
      </div>
    );
  }
}
