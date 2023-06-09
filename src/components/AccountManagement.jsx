import "../index.css";
import { auth } from "../config/Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { AuthErrorCodes } from "firebase/auth";
import { useState } from "react";

export function AccountManagement() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signUpNewUser = async () => {
    //confirm password
    if (password.length >= 6) {
      if (password !== confirmPassword) {
        alert("password and confirm password are not the same");
      } else {
        try {
          await createUserWithEmailAndPassword(auth, email, password).catch(
            (reason) => {
              alert(reason);
            }
          );
        } catch (err) {
          console.log(AuthErrorCodes[err]);
        }
      }
    } else {
      alert("password too short, minimum of 5 characters");
    }
  };

  return (
    <div className="page-container">
      <h1>Register a new user</h1>
      <div className="sign-up-container">
        <input
          placeholder="Email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={signUpNewUser}>Create Account</button>
      </div>
    </div>
  );
}
