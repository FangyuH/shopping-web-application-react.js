import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Row, Col } from "react-bootstrap";
import "./ProductCard.css";
import api from "../../../../api";
import CartContent from "../../../Header/Cart/CartCard/CartContent";

function ProductCard(props) {
  const userStatus = localStorage.getItem("userSelector");
  const [count, setCount] = useState(props.quantity);

  useEffect(() => {
    setCount(props.quantity);
  }, [props.quantity]);

  //console.log("Card Quantity:" + count);
  //console.log("props.quantity:" + props.quantity);
  function handleTitleButtonClick() {
    props.setmainPageStatus("showDetail");
    props.setProductId(props.productId);
  }

  function handleEditButtonClick() {
    props.setmainPageStatus("editProduct");
    props.setProductId(props.productId);
  }

  function handleAddButtonClick() {
    setItemCount(1);
  }

  async function setItemCount(newCount) {
    setCount(newCount);
    if (props.userId !== "temporary") {
      try {
        const res = await api.updateCartApi(
          props.userId,
          props.productId,
          props.productName,
          props.price,
          newCount,
          props.imageURL
        );
        const result = await res.json();
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const tempCart = JSON.parse(localStorage.getItem("tempCart")) || [];
        const itemIndex = tempCart.findIndex(
          (item) => item.productId === props.productId
        );

        if (itemIndex === -1) {
          tempCart.push({
            productId: props.productId,
            productName: props.productName,
            price: props.price,
            quantity: newCount,
            imageURL: props.imageURL,
          });
        } else {
          tempCart[itemIndex].quantity = newCount;
        }

        props.setTempCart(
          localStorage.setItem("tempCart", JSON.stringify(tempCart))
        );
      } catch (error) {
        console.log(error);
      }
    }
  }

  // async function updateTempCart(
  //   productId,
  //   productName,
  //   price,
  //   newCount,
  //   imageURL
  // ) {
  //   try {
  //     const tempCart = JSON.parse(localStorage.getItem("tempCart")) || [];
  //     const itemIndex = tempCart.findIndex(
  //       (item) => item.productId === productId
  //     );

  //     if (itemIndex === -1) {
  //       tempCart.push({
  //         productId: productId,
  //         productName: productName,
  //         price: price,
  //         quantity: newCount,
  //         imageURL: imageURL,
  //       });
  //     } else {
  //       tempCart[itemIndex].quantity = newCount;
  //     }

  //     props.setTempCart(
  //       localStorage.setItem("tempCart", JSON.stringify(tempCart))
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  function handlePlusButtonClick() {
    setItemCount(count + 1);
  }

  function handleMinusButtonClick() {
    if (count > 1) {
      setItemCount(count - 1);
    } else {
      if (props.userId !== "temporary") {
        handleRemoveClick();
      } else {
        handleRemoveClickTemp();
      }
    }
  }

  async function handleRemoveClick() {
    try {
      const res = await fetch(
        `http://localhost:3007/deletecart/${props.userId}/${props.productId}`,
        {
          method: "DELETE",
        }
      );
      setItemCount(0);
      //console.log("remove clicked");
    } catch (error) {
      console.error(error);
    }
    //dispatch(updateAll(!update_state));
  }

  async function handleRemoveClickTemp() {
    const tempCart = JSON.parse(localStorage.getItem("tempCart")) || [];
    const productIndex = tempCart.findIndex(
      (item) => item.productId === props.productId
    );
    const updatedCart = [...tempCart];
    updatedCart.splice(productIndex, 1);
    setCount(0);
    //props.setTempCart(updatedCart);
    // update the cart in localStorage
    localStorage.setItem("tempCart", JSON.stringify(updatedCart));
    //dispatch(updateAll(!update_state));
  }

  return (
    <Card>
      <Card.Img className="card-img" variant="top" src={props.imageURL} />
      <Card.Body>
        <Card.Title onClick={handleTitleButtonClick} id="card-title">
          {props.productName}
        </Card.Title>
        <Card.Text>{"$" + props.price}</Card.Text>
        <div className="button-container">
          {count === 0 ? (
            <Button
              variant="primary"
              size="lg"
              id="add-button"
              onClick={handleAddButtonClick}
            >
              Add
            </Button>
          ) : (
            <div className="counter">
              <Button variant="light" onClick={handleMinusButtonClick}>
                -
              </Button>{" "}
              <h4>{count}</h4>{" "}
              <Button variant="light" onClick={handlePlusButtonClick}>
                +
              </Button>
            </div>
          )}
          {userStatus === "seller" ? (
            <Button variant="primary" size="lg" onClick={handleEditButtonClick}>
              Edit
            </Button>
          ) : null}
        </div>
      </Card.Body>
    </Card>
  );
}
export default ProductCard;
