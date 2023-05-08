import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form } from "react-bootstrap";
import "./ModalForm.css";

function EmailPasswordForm(props) {
  return (
    <Form id="modal-form">
      <Form.Group controlId="formBasicEmail">
        <Form.Label className="form-label">Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={props.email}
          onChange={props.handleInputChange}
        />
        {props.emailError && (
          <div style={{ color: "red" }}>{props.emailError}</div>
        )}
      </Form.Group>
      <Form.Group controlId="formBasicPassword">
        <Form.Label className="form-label">Password</Form.Label>
        <Form.Control
          type={props.showPassword ? "text" : "password"}
          placeholder="Enter password"
          value={props.password}
          onChange={props.handleInputChange}
        />
        <a href="#" onClick={props.handleShowPassword} id="show-link">
          {props.showPassword ? "Hide" : "Show"}
        </a>
        {props.passwordError && (
          <div style={{ color: "red" }}>{props.passwordError}</div>
        )}
      </Form.Group>
    </Form>
  );
}

export default EmailPasswordForm;
