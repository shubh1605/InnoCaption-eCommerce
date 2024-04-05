import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBIcon,
  MDBTypography,
  MDBInput,
} from "mdb-react-ui-kit";
import React, { useState, useEffect } from "react";
import "../CartCard/CartCard.css";

const CartCard = (props) => {
  const [qty, setQty] = useState(props.cartProduct.quantity);
  const [priceAfterDisc, setPriceAfterDisc] = useState();
  const [totalPrice, setTotalPrice] = useState();
  const [pid, setPid] = useState(props.cartProduct.product.id);

  function formatDataToSend(cart, prodid, qty) {
    var returnData = [];

    Object.keys(cart).map((item, i) => {
      if (item != prodid) {
        returnData.push({ id: item, quantity: cart[item]["quantity"] });
      } else {
        returnData.push({ id: item, quantity: qty });
      }
    });

    return returnData;
  }

  function updateQuantity(value) {
    var prevCart = localStorage.getItem("cartProducts");
    var updatedCart = formatDataToSend(prevCart, pid, value);

    fetch("https://dummyjson.com/carts/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // If want to check the error, replace updatedCart with ""
        // It will not update the quantity.
        products: updatedCart,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // If the API response has an error message do not update the cart.
        if (res["message"]) {
          console.log("error");
          props.setAlertShow(true);
        } else {
          setQty(value);
          var t = (priceAfterDisc * value).toFixed(2);
          setTotalPrice(t);

          if (prevCart != null) {
            prevCart = JSON.parse(prevCart);
          } else {
            console.log("there is some error");
            prevCart = {};
            props.setAlertShow(true);
          }
          if (pid in prevCart) {
            prevCart[pid] = {
              quantity: Number(value),
              product: props.cartProduct.product,
            };
          } else {
            console.log("some error");
            props.setAlertShow(true);
          }
          localStorage.setItem("cartProducts", JSON.stringify(prevCart));
          props.calcTotal(prevCart);
        }
      });
  }
  useEffect(() => {
    var p = (
      (Number(props.cartProduct.product.price) *
        (100 - Number(props.cartProduct.product.discountPercentage))) /
      100
    ).toFixed(2);
    setPriceAfterDisc(p);
    var t = (p * qty).toFixed(2);
    setTotalPrice(t);
  }, []);
  return (
    <div>
      <div className="card-container">
        <div className="row">
          <div className="col-md-2 col-6">
            <div className="card-image-container">
              <img
                src={props.cartProduct.product.thumbnail}
                className="card-image"
              />
            </div>
          </div>
          <div className="col-md-5 col-6">
            <div className="title">
              {props.cartProduct.product.title}
              <p className="brand">{props.cartProduct.product.brand}</p>
              <p>
                {" "}
                <span className="ogprice">
                  ${props.cartProduct.product.price}
                </span>{" "}
                <span className="newprice">${priceAfterDisc}</span>
              </p>
            </div>
          </div>

          <div className="col-md-2 col-6 qty-div">
            <label htmlFor="typeNumber" className="card-qty-label">
              Quantity
            </label>
            <input
              className="card-qty"
              id="typeNumber"
              type="number"
              min="1"
              value={qty}
              onChange={(e) => updateQuantity(e.target.value)}
            ></input>
          </div>
          <div className="col-md-2 col-6">
            <p className="totalPrice">Total Cost: &nbsp;${totalPrice}</p>
          </div>
          <div className="col-md-1">
            <button
              className="btn btn-danger remove-cart"
              onClick={() => props.removeFromCart(props.cartProduct.product.id)}
            >
              <i className="fa fa-trash" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
