import { useState, useContext } from "react";
import { auth } from "../config/Firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import "./TopBar.css";
import { LoginContext } from "../helper/LoginContext";

export function TopBar() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginStatus, setLoginStatus } = useContext(LoginContext);

  const signIn = () => {
    try {
      signInWithEmailAndPassword(auth, email, password).then(() => {
        setLoginStatus(true);
      });
    } catch (err) {
      console.error(err);
    }
  };
  const logout = () => {
    try {
      signOut(auth).then(() => {
        setLoginStatus(false);
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loginStatus) {
    return (
      <div className="Auth-container">
        <div>
          <p className="logged-email">{auth.currentUser?.email}</p>
        </div>
        <button onClick={logout}>Logout</button>
      </div>
    );
  } else {
    return (
      <div className="Auth-container">
        <div>
          <input
            placeholder="Email..."
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password..."
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={signIn}>Sign in</button>
        </div>
      </div>
    );
  }
}
