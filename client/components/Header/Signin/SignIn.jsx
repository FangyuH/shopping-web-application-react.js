import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import UpdatePasswordForm from "./UpdatePasswordForm";
import UpdatePasswordResult from "./UpdatePasswordResult";
import { propTypes } from "react-bootstrap/esm/Image";

function SignIn(props) {
  const [signInOpen, setSignInOpen] = useState(false);
  const [page, setPage] = useState("signin");

  function handleClose() {
    if (page === "signin") {
      setSignInOpen(false);
    } else {
      setPage("signin");
    }
  }

  return (
    <div className="text-center">
      <Button variant="primary" onClick={() => setSignInOpen(true)}>
        Sign in
      </Button>

      <Modal
        className="popup-container"
        show={signInOpen}
        onHide={handleClose}
        centered
      >
        {page === "signin" ? (
          <SignInForm
            setPage={setPage}
            setSignInOpen={setSignInOpen}
            setPageStatus={props.setPageStatus}
            setToken={props.setToken}
            setUserId={props.setUserId}
            setUserStatus={props.setUserStatus}
            temporary={props.temporary}
          />
        ) : page === "updatePassword" ? (
          <UpdatePasswordForm setPage={setPage} />
        ) : page === "emailSent" ? (
          <UpdatePasswordResult setPage={setPage} />
        ) : (
          <SignUpForm setPage={setPage} />
        )}
      </Modal>
    </div>
  );
}

export default SignIn;
