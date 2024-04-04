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
  const [alertShow, setAlertShow] = useState(true);

  function calcTotal(currCart) {
    var t = 0.0;
    var p = 0.0;
    Object.keys(currCart).map((item) => {
      // var p = any;
      p =
        (currCart[item].product.price *
          Number(currCart[item].quantity) *
          (100 - currCart[item].product.discountPercentage)) /
        100;
      // console.log(p);
      t += p;
    });
    setTotalCost(t.toFixed(2));
  }

  function removeFromCart(pid) {
    var prevCart = localStorage.getItem("cartProducts");
    if (prevCart != null) {
      prevCart = JSON.parse(prevCart);
    } else {
      console.log("there is some error");
      prevCart = {};
    }
    if (pid in prevCart) {
      delete prevCart[pid];
    } else {
      console.log("some error");
    }
    localStorage.setItem("cartProducts", JSON.stringify(prevCart));
    setCartItems(prevCart);
    calcTotal(prevCart);
    props.getCartItemNumbers();
  }

  useEffect(() => {
    const data = localStorage.getItem("cartProducts");
    var t = 0;
    if (data) {
      setCartItems(JSON.parse(data));
      t = Object.keys(data).length;
    }
    if (t == 0) {
      setTotalCost(0);
    } else {
      calcTotal(JSON.parse(data));
    }
  }, []);

  // console.log(cartItems)

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
                          {Object.keys(cartItems).map((item, i) => (
                            <CartCard
                              cartProduct={cartItems[item]}
                              key={i}
                              removeFromCart={removeFromCart}
                              calcTotal={calcTotal}
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
                                <>${Number(totalCost) + Number(20.0)}</>
                              )}
                            </p>
                          </div>

                          {totalCost == 0.0 ? (
                            <></>
                          ) : (
                            <MDBBtn color="info me-auto" block size="lg">
                              <div className="d-flex justify-content-between">
                                <span>${Number(totalCost) + Number(20.0)}</span>
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
