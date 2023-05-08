import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Form, Pagination } from "react-bootstrap";
import "../Error/Error.css";

function Error(props) {
  function handleGoHomeButton() {
    props.setError(false);
  }
  return (
    <div className="error-container">
      <h1>Oops, something went wrong!</h1>
      <Button onClick={handleGoHomeButton}>Go Home</Button>
    </div>
  );
}

export default Error;
