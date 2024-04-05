import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import Alert from "react-bootstrap/Alert";

import React, { useState, useEffect } from "react";
import CartCard from "../CartCard/CartCard";

const Cart = (props) => {
  const [cartItems, setCartItems] = useState();
  const [totalCost, setTotalCost] = useState(0.0);
  const [alertShow, setAlertShow] = useState(false);

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

  function calcTotal(currCart) {
    var t = 0.0;
    var p = 0.0;
    Object.keys(currCart).map((item) => {
      p =
        (currCart[item].product.price *
          Number(currCart[item].quantity) *
          (100 - currCart[item].product.discountPercentage)) /
        100;
      t += p;
    });
    setTotalCost(t.toFixed(2));
  }

  function removeFromCart(pid) {
    var prevCart = localStorage.getItem("cartProducts");
    var updatedCart = formatDataToSend(prevCart, false, pid);

    fetch("https://dummyjson.com/carts/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // If want to check the error, replace updatedCart with ""
        // It will not update the cart.
        products: updatedCart,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // If the API response has an error message do not update the cart.
        if (res["message"]) {
          console.log("error");
          setAlertShow(true);
        } else {
          if (prevCart != null) {
            prevCart = JSON.parse(prevCart);
          } else {
            console.log("there is some error");
            setAlertShow(true);
            prevCart = {};
          }
          if (pid in prevCart) {
            delete prevCart[pid];
          } else {
            setAlertShow(true);
            console.log("some error");
          }
          localStorage.setItem("cartProducts", JSON.stringify(prevCart));
          setCartItems(prevCart);
          calcTotal(prevCart);
          props.getCartItemNumbers();
        }
      });
  }

  useEffect(() => {
    // Here instead of getting cart products from local storage,
    // we can get the cart of the logged in user using the backend API.
    const data = localStorage.getItem("cartProducts");
    var t = 0;

    // If there is a cart for the logged in user, get the number of products in the cart
    if (data) {
      setCartItems(JSON.parse(data));
      t = Object.keys(data).length;
    }
    // Get the total cost of the products that are in the cart.
    if (t == 0) {
      setTotalCost(0);
    } else {
      calcTotal(JSON.parse(data));
    }
  }, []);

  return (
    <div
      className="cart-main-container"
      style={{ backgroundColor: "rgb(238, 238, 238)", paddingTop: "70px" }}
    >
      <section className="h-100 h-custom">
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol>
              <MDBCard>
                <MDBCardBody className="allCardContainer">
                  <MDBRow>
                    <MDBCol lg="7">
                      <MDBTypography tag="h5">
                        <a href="/" className="text-body">
                          <MDBIcon fas icon="long-arrow-alt-left me-2" />{" "}
                          Continue shopping
                        </a>
                      </MDBTypography>

                      <hr />

                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                          <p className="mb-1">Shopping cart</p>
                          <p className="mb-0">
                            You have {props.itemNumbers} item(s) in your cart
                          </p>
                        </div>
                      </div>

                      {props.itemNumbers != 0 ? (
                        <div>
                          <Alert
                            variant="danger"
                            show={alertShow}
                            onClose={() => setAlertShow(false)}
                            dismissible
                            className="text-center"
                          >
                            <Alert.Heading>
                              Error! Please try again.
                            </Alert.Heading>
                          </Alert>
                          {Object.keys(cartItems).map((item, i) => (
                            <CartCard
                              cartProduct={cartItems[item]}
                              key={item}
                              removeFromCart={removeFromCart}
                              calcTotal={calcTotal}
                              setAlertShow={setAlertShow}
                            />
                          ))}
                        </div>
                      ) : (
                        <div>
                          <Alert variant="info">
                            <Alert.Heading>
                              No items in your cart!
                            </Alert.Heading>
                          </Alert>
                        </div>
                      )}
                    </MDBCol>

                    <MDBCol lg="5">
                      <MDBCard className="bg-primary text-white rounded-3">
                        <MDBCardBody>
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <MDBTypography tag="h5" className="mb-0">
                              Card details
                            </MDBTypography>
                          </div>

                          <p className="small">Card type</p>
                          <a href="#!" type="submit" className="text-white">
                            <MDBIcon fab icon="cc-mastercard fa-2x me-2" />
                          </a>
                          <a href="#!" type="submit" className="text-white">
                            <MDBIcon fab icon="cc-visa fa-2x me-2" />
                          </a>
                          <a href="#!" type="submit" className="text-white">
                            <MDBIcon fab icon="cc-amex fa-2x me-2" />
                          </a>
                          <a href="#!" type="submit" className="text-white">
                            <MDBIcon fab icon="cc-paypal fa-2x me-2" />
                          </a>

                          <form className="mt-4">
                            <label htmlFor="cname" className="form-label mt-4">
                              Cardholder's Name
                            </label>
                            <MDBInput
                              className=""
                              id="cname"
                              type="text"
                              size="lg"
                              placeholder="Cardholder's Name"
                              contrast
                            />
                            <label
                              htmlFor="cnumber"
                              className="form-label mt-4"
                            >
                              Card Number
                            </label>
                            <MDBInput
                              className=""
                              id="cnumber"
                              type="text"
                              size="lg"
                              minLength="19"
                              maxLength="19"
                              placeholder="1234 5678 9012 3457"
                              contrast
                            />

                            <MDBRow className="mb-4 mt-4">
                              <MDBCol md="6">
                                <label
                                  htmlFor="expiration"
                                  className="form-label"
                                >
                                  Expiration
                                </label>
                                <MDBInput
                                  className=""
                                  type="text"
                                  size="lg"
                                  minLength="7"
                                  maxLength="7"
                                  placeholder="MM/YYYY"
                                  contrast
                                  id="expiration"
                                />
                              </MDBCol>
                              <MDBCol md="6">
                                <label htmlFor="cvv" className="form-label">
                                  CVV
                                </label>
                                <MDBInput
                                  className=""
                                  size="lg"
                                  minLength="3"
                                  maxLength="3"
                                  placeholder="&#9679;&#9679;&#9679;"
                                  type="password"
                                  id="cvv"
                                  contrast
                                />
                              </MDBCol>
                            </MDBRow>
                          </form>

                          <hr />

                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Subtotal</p>
                            <p className="mb-2">${totalCost}</p>
                          </div>

                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Shipping</p>
                            <p className="mb-2">
                              {totalCost == 0.0 ? <>$0.00</> : <>$20.00</>}
                            </p>
                          </div>

                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Total(Incl. taxes)</p>
                            <p className="mb-2">
                              {" "}
                              {totalCost == 0.0 ? (
                                <>$0.00</>
                              ) : (
                                <>
                                  $
                                  {(Number(totalCost) + Number(20.0)).toFixed(
                                    2
                                  )}
                                </>
                              )}
                            </p>
                          </div>

                          {totalCost == 0.0 ? (
                            <></>
                          ) : (
                            <MDBBtn color="info me-auto" block size="lg">
                              <div className="d-flex justify-content-between">
                                <span>
                                  $
                                  {(Number(totalCost) + Number(20.0)).toFixed(
                                    2
                                  )}
                                </span>
                                <span>
                                  &nbsp; Pay Now{" "}
                                  <i className="fas fa-long-arrow-alt-right ms-2"></i>
                                </span>
                              </div>
                            </MDBBtn>
                          )}
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </div>
  );
};

export default Cart;
