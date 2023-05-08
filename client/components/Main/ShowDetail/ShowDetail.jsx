import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Row, Col, Image } from "react-bootstrap";
import "./ShowDetail.css";
import "./../ShowProduct/ShowProduct.css";
import "./../ShowProduct/ProductCard/ProductCard.css";
import api from "./../../../api";
import { updateAll } from "../../../actions";
import { useDispatch, useSelector } from "react-redux";

function ShowDetail(props) {
  const [productDetails, setProductDetails] = useState([]);
  const userStatus = localStorage.getItem("userSelector");
  const [count, setCount] = useState(
    productDetails.quantity ? productDetails.quantity : 0
  );
  const dispatch = useDispatch();
  const update_state = useSelector((state) => state.update_state);

  useEffect(() => {
    async function fetchData(productId) {
      try {
        const res = await fetch(
          `http://localhost:3007/showdetail/${productId}`
        );
        const data = await res.json();
        setProductDetails([data]);
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchDetailQuantity(productId, userId) {
      try {
        const res = await fetch(
          `http://localhost:3007/listquantitydetail/${userId}/${productId}`
        );
        const data = await res.json();
        const quantity = data.quantity ? data.quantity : 0;
        setCount(quantity);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData(props.productId);
    if (props.userId !== "temporary") {
      fetchDetailQuantity(props.productId, props.userId);
    } else {
      const tempCart = JSON.parse(localStorage.getItem("tempCart")) || [];
      const itemIndex = tempCart.findIndex(
        (item) => item.productId === props.productId
      );
      if (itemIndex !== -1) {
        const quantity = tempCart[itemIndex].quantity;
        setCount(quantity);
      }
    }
  }, [update_state]);

  const createDetail = productDetails.map(
    ({
      imageURL,
      categorySelector,
      productName,
      price,
      productDescription,
    }) => {
      return (
        <div className="detail-container">
          <Image id="detailImage" src={imageURL} />
          <div id="details">
            <small>{categorySelector}</small>
            <h1>{productName}</h1>
            <h2>{"$" + price}</h2>
            <p>{productDescription}</p>
            <div className="button">
              {count === 0 ? (
                <Button
                  variant="primary"
                  size="lg"
                  id="addcart-button"
                  onClick={handleAddButtonClick}
                >
                  Add to Cart
                </Button>
              ) : (
                <div className="counter">
                  <Button onClick={handleMinusButtonClick}>-</Button>{" "}
                  <h4>{count}</h4>{" "}
                  <Button onClick={handlePlusButtonClick}>+</Button>
                </div>
              )}{" "}
              {userStatus === "seller" ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleEditButtonClick}
                >
                  Edit
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      );
    }
  );

  async function setItemCount(newCount) {
    setCount(newCount);
    if (props.userId !== "temporary") {
      try {
        const res = await api.updateCartApi(
          props.userId,
          props.productId,
          productDetails[0].productName,
          productDetails[0].price,
          newCount,
          productDetails[0].imageURL
        );
        const result = await res.json();
      } catch (error) {
        console.error(error);
      }
    } else {
      const tempCart = JSON.parse(localStorage.getItem("tempCart")) || [];
      const itemIndex = tempCart.findIndex(
        (item) => item.productId === props.productId
      );

      if (itemIndex === -1) {
        tempCart.push({
          productId: props.productId,
          productName: productDetails[0].productName,
          price: productDetails[0].price,
          quantity: newCount,
          imageURL: productDetails[0].imageURL,
        });
      } else {
        tempCart[itemIndex].quantity = newCount;
      }

      props.setTempCart(
        localStorage.setItem("tempCart", JSON.stringify(tempCart))
      );
    }
  }

  function handleAddButtonClick() {
    setItemCount(1);
  }

  function handlePlusButtonClick() {
    setItemCount(count + 1);
    dispatch(updateAll(!update_state));
  }

  function handleMinusButtonClick() {
    if (count > 1) {
      setItemCount(count - 1);
    }
    dispatch(updateAll(!update_state));
  }

  function handleBackButtonClick() {
    props.setmainPageStatus("showProduct");
  }

  function handleEditButtonClick() {
    props.setmainPageStatus("editProduct");
    props.setProductId(props.productId);
  }

  return (
    <div>
      <div className="show-product-container">
        <div className="show-header-container">
          <h2>Products Detail</h2>
          <Button
            id="add-product"
            variant="primary"
            onClick={handleBackButtonClick}
          >
            Back
          </Button>
        </div>
        {createDetail}
      </div>
    </div>
  );
}
export default ShowDetail;
