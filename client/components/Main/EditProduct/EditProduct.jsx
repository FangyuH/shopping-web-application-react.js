import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Row, Col, InputGroup, Image } from "react-bootstrap";
import "./EditProduct.css";
import "./../../Header/Signin/ModalForm.css";
import api from "./../../../api";

function EditProduct(props) {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [categorySelector, setCategorySelector] = useState("");
  const [price, setPrice] = useState("");
  const [inStock, setInStock] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [previewImageURL, setPreviewImageURL] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData(productId) {
      try {
        const res = await fetch(
          `http://localhost:3007/showdetail/${productId}`
        );
        const data = await res.json();
        setProductName(data.productName);
        setProductDescription(data.productDescription);
        setCategorySelector(data.categorySelector);
        setPrice(data.price);
        setInStock(data.inStock);
        setImageURL(data.imageURL);
        setPreviewImageURL(data.imageURL);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData(props.productId);
  }, [props.productId]);

  const handleButtonClick = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:3007/editproduct/${props.productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productName,
            productDescription,
            categorySelector,
            price,
            inStock,
            imageURL,
          }),
        }
      );

      const result = await res.json();
      console.log(result);
      if (res.status === 200) {
        let count = 3;
        setMessage(
          `Product updated Successfully! Back to the main page in ${count} seconds.`
        );
        const interval = setInterval(() => {
          count--;
          setMessage(
            `Product updated Successfully! Back to the main page in ${count} seconds.`
          );
          if (count === 0) {
            clearInterval(interval);
            props.setmainPageStatus("showProduct");
          }
        }, 1000);
      } else if (res.status === 400) {
        setMessage(`Please enter all information of your product`);
      } else {
        console.log("failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="create-product">
      <div className="create-product-container">
        <h2 id="title">Edit Product</h2>
        <Form className="create-form">
          <Form.Group controlId="formProduct" className="form-label">
            <Form.Label>Product name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your Product name"
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
            />
          </Form.Group>
          <Form.Group className="form-label" controlId="formProductDescription">
            <Form.Label>Product Description</Form.Label>
            <Form.Control
              value={productDescription}
              onChange={(event) => setProductDescription(event.target.value)}
              as="textarea"
              rows={5}
            />
          </Form.Group>
          <Row>
            <Form.Group
              as={Col}
              className="form-label"
              controlId="formCategory"
            >
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                id="category-selecter"
                onChange={(event) => setCategorySelector(event.target.value)}
              >
                <option value="">{categorySelector}</option>
                <option value="category1">Category1</option>
                <option value="category2">Category2</option>
                <option value="category3">Category3</option>
                <option value="category4">Category4</option>
                <option value="category5">Category5</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} className="form-label" controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group
              as={Col}
              className="form-label"
              controlId="formQuantity"
            >
              <Form.Label>In Stock Quantity</Form.Label>
              <Form.Control
                type="number"
                value={inStock}
                onChange={(event) => setInStock(event.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} className="form-label" controlId="formPrice">
              <Form.Label>Add Image Link</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={imageURL}
                  onChange={(event) => setImageURL(event.target.value)}
                />

                <Button
                  variant="primary"
                  onClick={() => setPreviewImageURL(imageURL)}
                >
                  Preview
                </Button>
              </InputGroup>
            </Form.Group>
          </Row>
          <Form.Group as={Col} className="form-label" controlId="formPreview">
            <Form.Label>Preview Image</Form.Label>
            {previewImageURL ? (
              <img
                className="form-group-border"
                src={previewImageURL}
                alt="Preview"
              />
            ) : (
              <p className="form-group-border">No image preview available</p>
            )}
          </Form.Group>
          <Form.Group>
            <Button
              id="add-product"
              variant="primary"
              onClick={handleButtonClick}
            >
              Update
            </Button>
            {message && (
              <div className="alert alert-success" role="alert">
                {message}
              </div>
            )}
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}

export default EditProduct;
