import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import "./ModalForm.css";
import EmailPasswordForm from "./EmailPasswordForm";
import api from "./../../../api";
import { updateAll } from "../../../actions";
import { useDispatch, useSelector } from "react-redux";

function SignInForm(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const update_state = useSelector((state) => state.update_state);

  function handleInputChange(event) {
    if (event.target.type === "email") {
      setEmail(event.target.value);
    } else if (event.target.type === "password") {
      setPassword(event.target.value);
    }
  }

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function isValidPassword(password) {
    return password.length >= 8;
  }

  const handleSignInClick = async (event) => {
    event.preventDefault();

    if (email === "" && password === "") {
      setEmailError("Please enter your email address.");
      setPasswordError("Please enter your password.");
      return;
    }

    if (!isValidEmail(email) && !isValidPassword(password)) {
      setEmailError("Please enter a valid email address.");
      setPasswordError("Your password must be at least 8 characters long.");
      return;
    }

    if (email === "") {
      setEmailError("Please enter your email address.");
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (email !== "" && isValidEmail(email)) {
      setEmailError("");
    }

    if (password === "") {
      setPasswordError("Please enter your password.");
      return;
    }

    if (!isValidPassword(password)) {
      setPasswordError("Your password must be at least 8 characters long.");
      return;
    }

    if (password !== "" && isValidPassword(password)) {
      setPasswordError("");
    }

    try {
      const res = await api.signinApi(email, password);

      const resData = await res.json();

      if (res.status === 401) {
        setMessage(`Invalid Email or Password`);
      } else if (res.status === 200) {
        const token = resData.token;
        localStorage.setItem("userToken", token);
        const userSelector = resData.userSelector;
        //localStorage.setItem("userSelector", userSelector);

        let count = 3;
        setMessage(
          `Signed in Successfully! Go to Home page in ${count} seconds.`
        );

        const interval = setInterval(async () => {
          count--;
          setMessage(
            `Signed in Successfully! Go to Home page in ${count} seconds.`
          );
          if (count === 0) {
            clearInterval(interval);
            //props.setPage("signin");
            props.setSignInOpen(false);
            props.setPageStatus("logout");
            props.setToken(token);
            props.setUserStatus(userSelector);
            props.setUserId(token);
            await api.mergeTempAndUser(token);
            dispatch(updateAll(!update_state));
          }
        }, 1000);
      } else {
        console.log(resData);
        console.log("failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  function handleShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <div>
      <Modal.Header id="modal-title" closeButton>
        <Modal.Title>Sign in to your account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EmailPasswordForm
          email={email}
          handleInputChange={handleInputChange}
          emailError={emailError}
          showPassword={showPassword}
          password={password}
          handleShowPassword={handleShowPassword}
          passwordError={passwordError}
        />
      </Modal.Body>
      <Modal.Footer id="modal-footer">
        <Button id="sign-in-btn" variant="primary" onClick={handleSignInClick}>
          Sign In
        </Button>
        <div className="links-container">
          <div className="left-footer">
            <div id="link-prompt">Don't have an account?</div>
            <a
              className="link-notes"
              onClick={() => {
                props.setPage("signup");
              }}
            >
              Sign up
            </a>
          </div>
          <div>
            <a
              className="link-notes"
              onClick={() => {
                props.setPage("updatePassword");
              }}
            >
              Forget Password?
            </a>
          </div>
        </div>
        {message && (
          <div className="alert alert-success" role="alert">
            {message}
          </div>
        )}
      </Modal.Footer>
    </div>
  );
}

export default SignInForm;
