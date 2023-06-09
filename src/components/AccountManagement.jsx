import "../index.css";
import { auth } from "../config/Firebase";
import {
  createUserWithEmailAndPassword,
  updatePassword,
  AuthErrorCodes,
  sendEmailVerification,
} from "firebase/auth";
import { useState } from "react";
import { Button } from "react-bootstrap";

export function AccountManagement() {
  return (
    <div className="container">
      <div className="row mt-4">
        <CreateNewUser />
        <ChangePassword />
        <VerifyEmail />
      </div>
    </div>
  );
}

function CreateNewUser() {
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
          await createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
              sendEmailVerification(result.user);
            })
            .then(
              alert(
                "Account created, check the account's email for verification."
              )
            )
            .catch((reason) => {
              alert(reason);
            });
        } catch (err) {
          console.log(AuthErrorCodes[err]);
        }
      }
      clearStates();
    } else {
      alert("password too short, minimum of 5 characters");
    }
  };

  const clearStates = () => {
    setPassword("");
    setEmail("");
    setConfirmPassword("");
  };

  return (
    <div className="sign-up-container pt-4 pb-4 col-4 border border-white rounded">
      <h2>New Account</h2>
      <input
        className="mt-1 mb-1"
        placeholder="Email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="mt-1 mb-1"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="mt-1 mb-1"
        placeholder="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button className="mt-1" variant="success" onClick={signUpNewUser}>
        Create Account
      </Button>
    </div>
  );
}

function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const UpdatePassword = async () => {
    const user = auth.currentUser;

    if (newPassword === confirmNewPassword) {
      updatePassword(user, newPassword)
        .then(() => {
          alert("Password updated");
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Password don't match");
    }
  };

  return (
    <div className="change-password-container pt-4 pb-4 col-4 border border-white rounded">
      <h2>Update Password</h2>
      <input
        className="mt-1 mb-1"
        placeholder="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        className="mt-1 mb-1"
        placeholder="Confirm New Password"
        type="password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
      />
      <Button className="mt-1" variant="success" onClick={UpdatePassword}>
        Change Password
      </Button>
    </div>
  );
}

function VerifyEmail() {
  const user = auth.currentUser;

  const SendEmailVerification = async () => {
    sendEmailVerification(auth.currentUser).then(() => {
      alert("Email verification sent!");
    });
  };

  if (user.emailVerified) {
    return (
      <div className="verify-email-container pt-4 pb-4 col-4 border border-white rounded">
        <h2>Email Verified</h2>
      </div>
    );
  } else {
    return (
      <div className="verify-email-container mt-4 mb-4 col-4 border border-white rounded">
        <Button variant="success" onClick={SendEmailVerification}>
          Verify Email
        </Button>
      </div>
    );
  }
}
