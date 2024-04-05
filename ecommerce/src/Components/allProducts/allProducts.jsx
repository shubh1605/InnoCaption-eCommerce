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

  function formatDataToSend(cart, isAdding, prodid) {
    var returnData = [];
    if (isAdding) {
      Object.keys(cart).map((item, i) => {
        returnData.push({ id: item, quantity: cart[item]["quantity"] });
      });
      returnData.push({ id: prodid, quantity: 1 });
    } else {
      Object.keys(cart).map((item, i) => {
        if (item != prodid) {
          returnData.push({ id: item, quantity: cart[item]["quantity"] });
        }
      });
    }
    return returnData;
  }

  function addToCart(prod) {
    // Here instead of getting cart products from local storage,
    // we can get the cart of the logged in user using the backend API.
    var prevCart = localStorage.getItem("cartProducts");

    // If there is a cart for the logged in user, update in the previously stored cart
    // Else create a new cart with no products using the backend API.
    // After this step, we will have a cart id. For now considering it 1.
    if (prevCart != null) {
      prevCart = JSON.parse(prevCart);
    } else {
      prevCart = {};
    }

    if (prod.id in prevCart) {
      var updatedCart = formatDataToSend(prevCart, false, prod.id);
      fetch("https://dummyjson.com/carts/1", {
        // If want to check the error, replace updatedCart with ""
        // It will not update the cart.
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: updatedCart,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          // If the API response has an error message do not update the cart and show an error alert
          if (res["message"]) {
            console.log("error");
            setAlertVariant("danger");
            setAlertText("Something went wrong, try again!");
            alertSetShow(true);
          } else {
            delete prevCart[prod.id];
            console.log("no error");
            setAlertVariant("danger");
            setAlertText(prod.title.toUpperCase() + " removed from the cart");
            setCartProducts(prevCart);
            localStorage.setItem("cartProducts", JSON.stringify(prevCart));
            props.getCartItemNumbers();
            alertSetShow(true);
          }
        });
    } else {
      var updatedCart = formatDataToSend(prevCart, true, prod.id);
      fetch("https://dummyjson.com/carts/1", {
        method: "PUT" /* or PATCH */,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: updatedCart,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          // If the API response has an error message do not update the cart and show an error alert
          if (res["message"]) {
            console.log("error");
            setAlertVariant("danger");
            setAlertText("Something went wrong, try again!");
            alertSetShow(true);
          } else {
            console.log(res);
            prevCart[prod.id] = {
              quantity: 1,
              product: prod,
            };
            setAlertVariant("success");
            setAlertText(prod.title.toUpperCase() + " added to the cart");
            setCartProducts(prevCart);
            localStorage.setItem("cartProducts", JSON.stringify(prevCart));
            props.getCartItemNumbers();
            alertSetShow(true);
          }
        });
    }
  }

  // Get key for category search
  function updateCategorySearch(key) {
    setSearchCategoryVal(key);
    getSearchedData(searchNameVal, key);
  }
  // Get key for title search
  function updateNameSearch(key) {
    setSearchNameVal(key);
    getSearchedData(key, searchCategoryVal);
  }

  function getSearchedData(name, cat) {
    var newFilteredData = [];
    if (name.length > 0 || cat.length > 0) {
      data
        .filter((filteredItem) => {
          // Filter on both types of searches (category and title)
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
    // Returns if a product is present in cart or not
    return pid in cartProducts;
  }

  useEffect(() => {
    // Get all product categories
    fetch("https://dummyjson.com/products/categories")
      .then((response) => response.json())
      .then((response) => {
        setCategories(response);
      });

    // Get all products
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((res) => {
        setData(res["products"]);
        setfilteredData(res["products"]);
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
