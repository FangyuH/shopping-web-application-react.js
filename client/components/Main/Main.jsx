import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import ShowProduct from "./ShowProduct/ShowProduct";
import CreateProduct from "./CreateProduct/CreateProduct";
import ShowDetail from "./ShowDetail/ShowDetail";
import EditProduct from "./EditProduct/EditProduct";

function Main(props) {
  const [mainPageStatus, setmainPageStatus] = useState("showProduct");
  const [productId, setProductId] = useState(null);
  props.setUserId(localStorage.getItem("userToken"));

  useEffect(() => {
    async function fetchData(url) {
      try {
        const res = await fetch(url);
        const data = await res.json();
        props.setUserStatus(data.userSelector);
      } catch (error) {
        console.error(error);
      }
    }
    if (props.userId !== "temporary") {
      fetchData(`http://localhost:3007/getuserStatus/${props.userId}`);
    }
  }, []);

  return (
    <div>
      {mainPageStatus === "createProduct" ? (
        <CreateProduct setmainPageStatus={setmainPageStatus} />
      ) : mainPageStatus === "showDetail" ? (
        <ShowDetail
          setmainPageStatus={setmainPageStatus}
          productId={productId}
          setProductId={setProductId}
          userId={props.userId}
          userStatus={props.userStatus}
        />
      ) : mainPageStatus === "editProduct" ? (
        <EditProduct
          setmainPageStatus={setmainPageStatus}
          productId={productId}
        />
      ) : (
        <ShowProduct
          setmainPageStatus={setmainPageStatus}
          setProductId={setProductId}
          userId={props.userId}
          setUserId={props.setUserId}
          userStatus={props.userStatus}
          tempCart={props.tempCart}
          setTempCart={props.setTempCart}
        />
      )}
    </div>
  );
}

export default Main;
