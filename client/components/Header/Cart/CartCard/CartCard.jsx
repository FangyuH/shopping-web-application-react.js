import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Image, Modal } from "react-bootstrap";
import "./../CartCard/CartCard.css";
import api from "../../../../api";
import { updateAll } from "../../../../actions";
import { useDispatch, useSelector } from "react-redux";

function CartCard(props) {
  const { productId, productName, price, quantity, imageURL } = props.item;
  const [itemCount, setItemCountState] = useState(quantity);
  const dispatch = useDispatch();
  const update_state = useSelector((state) => state.update_state);

  useEffect(() => {
    setItemCountState(quantity);
  }, [quantity]);

  async function setItemCount(newCount) {
    const countDiff = newCount - itemCount;
    setItemCountState(newCount);
    props.changeTotalPriceBy(countDiff * price);
    if (props.userId !== "temporary") {
      try {
        const res = await api.updateCartApi(
          props.userId,
          productId,
          productName,
          price,
          newCount,
          imageURL
        );
        const result = await res.json();
      } catch (error) {
        console.error(error);
      }
    } else {
      updateTempCart(productId, productName, price, newCount, imageURL);
    }
  }

  async function updateTempCart(
    productId,
    productName,
    price,
    newCount,
    imageURL
  ) {
    try {
      const tempCart = JSON.parse(localStorage.getItem("tempCart")) || [];
      const itemIndex = tempCart.findIndex(
        (item) => item.productId === productId
      );

      if (itemIndex === -1) {
        tempCart.push({
          productId: productId,
          productName: productName,
          price: price,
          quantity: newCount,
          imageURL: imageURL,
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
  async function handleAddButtonClick() {
    await setItemCount(itemCount + 1);
    dispatch(updateAll(!update_state));
  }

  async function handleMinusButtonClick() {
    if (itemCount > 1) {
      await setItemCount(itemCount - 1);
    } else {
      if (props.userId !== "temporary") {
        handleRemoveClick();
      } else {
        handleRemoveClickTemp();
      }
    }
    dispatch(updateAll(!update_state));
  }

  async function handleRemoveClick() {
    try {
      const res = await fetch(
        `http://localhost:3007/deletecart/${props.userId}/${productId}`,
        {
          method: "DELETE",
        }
      );
      props.setRefresh(Math.random());
      setItemCount(0);
      //console.log("remove clicked");
    } catch (error) {
      console.error(error);
    }
    dispatch(updateAll(!update_state));
  }

  async function handleRemoveClickTemp() {
    const tempCart = JSON.parse(localStorage.getItem("tempCart")) || [];
    const productIndex = tempCart.findIndex(
      (item) => item.productId === productId
    );
    const updatedCart = [...tempCart];
    updatedCart.splice(productIndex, 1);
    setItemCountState(0);
    //props.setTempCart(updatedCart);
    // update the cart in localStorage
    localStorage.setItem("tempCart", JSON.stringify(updatedCart));
    dispatch(updateAll(!update_state));
  }

  return (
    <div className="cartcard-container">
      <Image className="cart-img" src={imageURL} />
      <div className="col1">
        <h4>{productName}</h4>
        <Button variant="light" onClick={handleMinusButtonClick}>
          -
        </Button>{" "}
        <span>
          {console.log(productName + itemCount)}
          {itemCount}
        </span>{" "}
        <Button variant="light" onClick={handleAddButtonClick}>
          +
        </Button>
      </div>
      <div className="col2">
        <h5>{"$" + price}</h5>
        <h6
          id="remove"
          onClick={
            props.userId !== "temporary"
              ? handleRemoveClick
              : handleRemoveClickTemp
          }
        >
          remove
        </h6>
      </div>
    </div>
  );
}

export default CartCard;
