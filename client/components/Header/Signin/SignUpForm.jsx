import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Modal } from "react-bootstrap";
import EmailPasswordForm from "./EmailPasswordForm";
import "./ModalForm.css";
import api from "./../../../api";

function SignUpForm(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userSelector, setUserSelector] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

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

  function handleSelector(event) {
    setUserSelector(event.target.value);
    //console.log(userSelector);
  }
  const handleCreateAccountClick = async (event) => {
    event.preventDefault();
    if (email === "" && password === "") {
      setEmailError("Please enter your email address.");
      setPasswordError("Please enter your password.");
      return;
    }

    if (!isValidEmail(email) && !isValidPassword(password)) {
      setEmailError(
        "Please enter a valid email address. e.g. example@email.com"
      );
      setPasswordError("Your password must be at least 8 characters long.");
      return;
    }

    if (email === "") {
      setEmailError("Please enter your email address.");
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError(
        "Please enter a valid email address. e.g. example@email.com"
      );
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
      const res = await api.signupApi(email, password, userSelector);

      const resData = await res.json();

      if (res.status === 409) {
        setEmailError("User alreay existed!");
      } else if (res.status === 200) {
        let count = 3;
        setMessage(
          `Account created Successfully! Back to Signin page in ${count} seconds.`
        );
        const interval = setInterval(() => {
          count--;
          setMessage(
            `Account created Successfully! Back to Signin page in ${count} seconds.`
          );
          if (count === 0) {
            clearInterval(interval);
            props.setPage("signin");
          }
        }, 1000);
        setEmailError("");
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
        <Modal.Title>Sign up an account</Modal.Title>
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
        <Form.Select name="user" id="user-selecter" onChange={handleSelector}>
          <option value="">--Sign up as a--</option>
          <option value="seller">Seller</option>
          <option value="customer">Customer</option>
        </Form.Select>
      </Modal.Body>
      <Modal.Footer id="modal-footer">
        <Button
          id="sign-in-btn"
          variant="primary"
          onClick={handleCreateAccountClick}
        >
          Create Account
        </Button>
        <div className="links-container">
          <div id="link-prompt">
            Already have an account?
            <a className="link-notes" onClick={() => props.setPage("signin")}>
              Sign in
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

export default SignUpForm;
