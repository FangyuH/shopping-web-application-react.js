import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Modal } from "react-bootstrap";
import "./ModalForm.css";

function UpdatePasswordForm(props) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  function handleInputChange(event) {
    setEmail(event.target.value);
  }

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function handleUpdateClick(event) {
    event.preventDefault();
    if (email === "") {
      setEmailError("Please enter your email address.");
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      props.setPage("emailSent");
    }
  }
  return (
    <div>
      <Modal.Header id="modal-title" closeButton>
        <small>Enter your email link, we will send you the recovery link</small>
        <Modal.Title>Update your password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="modal-form">
          <Form.Group id="1" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={handleInputChange}
            />
            {emailError && <div style={{ color: "red" }}>{emailError}</div>}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer id="modal-footer">
        <Button id="sign-in-btn" variant="primary" onClick={handleUpdateClick}>
          Update password
        </Button>
      </Modal.Footer>
    </div>
  );
}

export default UpdatePasswordForm;
