import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Card } from "react-bootstrap";
import "./../Cart/Cart.css";
import CartCard from "./CartCard/CartCard";
import CartContent from "./CartCard/CartContent";
import { updateAll } from "../../../actions";
import { useDispatch, useSelector } from "react-redux";

function Cart(props) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartContent, setCartContent] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [refresh, setRefresh] = useState(Math.random());
  const dispatch = useDispatch();
  const update_state = useSelector((state) => state.update_state);
  props.setUserId(localStorage.getItem("userToken"));

  function handleCartClick() {
    setCartOpen(true);
  }

  function handleClose() {
    setCartOpen(false);
  }

  useEffect(() => {
    async function fetchData(url) {
      try {
        const res = await fetch(
          `http://localhost:3007/listcart/${props.userId}`
        );
        const data = await res.json();
        const items = data.items ? data.items : [];
        setCartContent(items);
        const initialTotalPrice = items.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.price * currentValue.quantity;
        }, 0);
        setTotalPrice(initialTotalPrice);
      } catch (error) {
        console.error(error);
      }
    }
    if (props.userId !== "temporary") {
      fetchData();
    } else {
      const items = JSON.parse(localStorage.getItem("tempCart")) || [];
      setCartContent(items);
      const initialTotalPrice = items.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.price * currentValue.quantity;
      }, 0);
      setTotalPrice(initialTotalPrice);
    }
  }, [cartOpen, refresh, update_state]);

  function changeTotalPriceBy(change) {
    setTotalPrice(totalPrice + change);
  }

  function handleCheckoutButton() {
    props.setError(true);
    setCartOpen(false);
  }

  const createCartCard = cartContent.map((item) => {
    return (
      <CartCard
        item={item}
        changeTotalPriceBy={changeTotalPriceBy}
        userId={props.userId}
        setRefresh={setRefresh}
        setTempCart={props.setTempCart}
      />
    );
  });

  return (
    <div>
      <Button variant="primary" onClick={handleCartClick}>
        Cart
      </Button>

      <Modal className="popup-cart" show={cartOpen} onHide={handleClose}>
        <Modal.Header id="modal-title" closeButton>
          <Modal.Title>Shopping Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>{createCartCard}</Modal.Body>
        <Modal.Footer>
          <h4>Subtotal{"$" + totalPrice.toFixed(2)}</h4>

          <Button onClick={handleCheckoutButton}>Continue to Checkout</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default Cart;
