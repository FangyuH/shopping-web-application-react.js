import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Form, Pagination } from "react-bootstrap";
import "./ShowProduct.css";
import ProductCard from "./ProductCard/ProductCard";
import { updateAll } from "../../../actions";
import { useDispatch, useSelector } from "react-redux";
//import CardContent from "./ProductCard/CardContent";

function ShowProduct(props) {
  //const userStatus = localStorage.getItem("userSelector");
  //const token = localStorage.getItem("userToken");
  const [cardContent, setCardContent] = useState([]);
  const [cartContent, setCartContent] = useState([]);
  const [rankSelector, setRankSelector] = useState("last-add");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const update_state = useSelector((state) => state.update_state);
  //props.setUserId(localStorage.getItem("userToken"));

  const handleButtonClick = () => {
    props.setmainPageStatus("createProduct");
  };

  useEffect(() => {
    async function fetchData(url) {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setCardContent(data.products);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchCartData(url) {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setCartContent(data.items ? data.items : []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData(
      `http://localhost:3007/listproduct?page=${currentPage}&rankSelector=${rankSelector}`
    );
    if (props.userId !== "temporary") {
      fetchCartData(`http://localhost:3007/listcart/${props.userId}`);
    } else {
      const tempCart = JSON.parse(localStorage.getItem("tempCart")) || [];
      setCartContent(tempCart);
    }

    //console.log("UseEffect update:" + update_state);
  }, [currentPage, rankSelector, props.userId, update_state]);
  //console.log(update_state);

  const createCard = cardContent.map(
    ({ imageURL, productName, price, _id }) => {
      const matchCartProduct = cartContent.find(
        (item) => item.productId === _id
      );
      const quantity = matchCartProduct ? matchCartProduct.quantity : 0;
      //console.log("match" + quantity);
      return (
        <ProductCard
          className="card"
          key={_id}
          productId={_id}
          imageURL={imageURL}
          productName={productName}
          price={price}
          userId={props.userId}
          setmainPageStatus={props.setmainPageStatus}
          setProductId={props.setProductId}
          quantity={quantity}
          tempCart={props.tempCart}
          setTempCart={props.setTempCart}
        />
      );
    }
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handlePrevClick = () => {
    setCurrentPage(currentPage - 1);
    window.scrollTo(0, 0);
  };

  const handleNextClick = () => {
    setCurrentPage(currentPage + 1);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <div className="show-product-container">
        <div className="show-header-container">
          <h2>Products</h2>
          <Form.Select
            name="category"
            id="rank-selecter"
            value={rankSelector}
            onChange={(event) => setRankSelector(event.target.value)}
          >
            <option value="last-add">Last Add</option>
            <option value="price-l-h">Price from low to high</option>
            <option value="price-h-l">Price from high to low</option>
          </Form.Select>
          {props.userId && props.userStatus === "seller" ? (
            <Button
              id="add-product"
              variant="primary"
              onClick={handleButtonClick}
            >
              Add Product
            </Button>
          ) : null}
        </div>
        <div className="card-container">{createCard}</div>
        <Pagination className="page-button">
          <Pagination.Prev
            onClick={handlePrevClick}
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Pagination.Item>
            )
          )}
          <Pagination.Next
            onClick={handleNextClick}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </div>
  );
}
export default ShowProduct;
