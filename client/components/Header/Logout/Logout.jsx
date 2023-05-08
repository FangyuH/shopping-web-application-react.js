import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Badge } from "react-bootstrap";
import api from "./../../../api";
import { updateAll } from "../../../actions";
import { useDispatch, useSelector } from "react-redux";

function Logout(props) {
  const dispatch = useDispatch();
  const update_state = useSelector((state) => state.update_state);
  const handleLogoutClick = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await api.logoutApi(token);
      //const data = await res1.json();
      //console.log(data.message);
      if (res.status === 200) {
        //localStorage.removeItem("userToken");
        localStorage.setItem("userToken", "temporary");
        //dispatch(updateAll(!update_state));
        props.setTemprary(localStorage.getItem("userToken"));
        //localStorage.setItem("tempCart", null);
        //console.log(localStorage.getItem("tempCart"));
        //props.setTempCart([]);
        props.setPageStatus("signin");
        props.setToken("");
        props.setUserStatus("");
        props.setUserId("temporary");
      } else {
        alert("Failed to logout!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Button type="primary" onClick={handleLogoutClick}>
        <Badge bg="warning">{props.userStatus}</Badge>
        Logout
      </Button>
    </div>
  );
}

export default Logout;
