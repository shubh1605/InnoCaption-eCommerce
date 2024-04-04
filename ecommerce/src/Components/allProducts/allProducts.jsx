import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../allProducts/allProducts.css";
import data_product from "../Assets/data";
import Product from "../Product/Product";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";
import ClipLoader from "react-spinners/ClipLoader";
const AllProducts = (props) => {
  const [data, setData] = useState();
  const [filteredData, setfilteredData] = useState();
  const [searchNameVal, setSearchNameVal] = useState("");
  const [searchCategoryVal, setSearchCategoryVal] = useState("");
  const [cartProducts, setCartProducts] = useState({});
  const [alertShow, alertSetShow] = useState(false);
  const [categories, setCategories] = useState();
  const [alertVariant, setAlertVariant] = useState();
  const [alertText, setAlertText] = useState();

  function addToCart(prod) {
    var prevCart = localStorage.getItem("cartProducts");
    if (prevCart != null) {
      prevCart = JSON.parse(prevCart);
    } else {
      prevCart = {};
    }
    if (prod.id in prevCart) {
      setAlertVariant("danger");
      setAlertText(prod.title.toUpperCase() + " removed from the cart");
      delete prevCart[prod.id];
    } else {
      setAlertVariant("success");
      setAlertText(prod.title.toUpperCase() + " added to the cart");
      prevCart[prod.id] = {
        quantity: 1,
        product: prod,
      };
    }
    setCartProducts(prevCart);
    localStorage.setItem("cartProducts", JSON.stringify(prevCart));
    props.getCartItemNumbers();
    alertSetShow(true);
  }

  function updateCategorySearch(key) {
    setSearchCategoryVal(key);
    getSearchedData(searchNameVal, key);
  }

  function updateNameSearch(key) {
    setSearchNameVal(key);
    getSearchedData(key, searchCategoryVal);
  }

  function getSearchedData(name, cat) {
    // setSearchVal(searchKey);
    var newFilteredData = [];
    if (name.length > 0 || cat.length > 0) {
      data
        .filter((filteredItem) => {
          return (
            filteredItem.title.toUpperCase().includes(name.toUpperCase()) &&
            filteredItem.category.toUpperCase().includes(cat.toUpperCase())
          );
        })
        .map((filteredItem) => {
          newFilteredData.push(filteredItem);
        });
      setfilteredData(newFilteredData);
    } else {
      setfilteredData(data);
    }
  }

  function isInCart(pid) {
    return pid in cartProducts;
  }

  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((response) => response.json())
      .then((response) => {
        setCategories(response);
      });

    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((res) => {
        setData(res["products"]);
        setfilteredData(res["products"]);
        // console.log(res);
      });

    var prevCart = localStorage.getItem("cartProducts");
    if (prevCart != null) {
      prevCart = JSON.parse(prevCart);
    } else {
      prevCart = {};
    }
    setCartProducts(prevCart);
  }, []);

  return (
    <div style={{ backgroundColor: "rgb(238, 238, 238)", paddingTop: "70px" }}>
      <div className="allProducts">
        <div className="wrapper">
          <div className="search-wrapper"></div>
        </div>
        <p className="all-products-text"> ALL PRODUCTS </p>

        <hr className="allproducts-hr" />
        <div className=" mt-5 search-container display flex">
          <InputGroup className="mb-3 ">
            <Form.Control
              placeholder="Search products by name"
              name="search-form"
              id="search-form"
              value={searchNameVal}
              onChange={(e) => updateNameSearch(e.target.value)}
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
          </InputGroup>
          <Form.Select onChange={(e) => updateCategorySearch(e.target.value)}>
            <option value="">All categories</option>

            {categories ? (
              categories.map((item) => (
                <option key={item.toLowerCase()} value={item.toLowerCase()}>
                  {item.toUpperCase()}
                </option>
              ))
            ) : (
              <></>
            )}
          </Form.Select>
        </div>
        <div className="container mt-4 text-center">
          <Alert
            variant={alertVariant}
            show={alertShow}
            onClose={() => alertSetShow(false)}
            dismissible
          >
            <Alert.Heading>{alertText}</Alert.Heading>
          </Alert>
        </div>

        <div className="product-list">
          {data ? (
            Object.keys(filteredData).length != 0 ? (
              filteredData.map((item, i) => {
                return (
                  <Product
                    key={i}
                    addToCartFunction={addToCart}
                    product={item}
                    isInCart={isInCart}
                  />
                );
              })
            ) : (
              <div>
                <Alert variant="info">
                  <Alert.Heading>
                    No items match the search you made!
                  </Alert.Heading>
                </Alert>
              </div>
            )
          ) : (
            <ClipLoader
              className="spinner"
              size={75}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
