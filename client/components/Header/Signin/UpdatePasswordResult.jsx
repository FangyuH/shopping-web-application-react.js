import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";
import "./ModalForm.css";

function UpdatePasswordResult() {
  return (
    <div>
      <Modal.Header id="modal-title" closeButton></Modal.Header>
      <Modal.Body>
        <div className="email-sent">
          <img
            id="email-sent-img"
            alt=""
            src="data:image/png;base64,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"
          />
          <h6 id="email-sent-note">
            We have sent the update password link to your emial, please check
            that ！
          </h6>
        </div>
      </Modal.Body>
    </div>
  );
}

export default UpdatePasswordResult;