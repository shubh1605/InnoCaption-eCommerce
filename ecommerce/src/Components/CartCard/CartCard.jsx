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

  function updateQuantity(value) {
    setQty(value);
    var t = (priceAfterDisc * value).toFixed(2);
    setTotalPrice(t);
    var prevCart = localStorage.getItem("cartProducts");
    if (prevCart != null) {
      prevCart = JSON.parse(prevCart);
    } else {
      console.log("there is some error");
      prevCart = {};
    }
    if (pid in prevCart) {
      prevCart[pid] = {
        quantity: Number(value),
        product: props.cartProduct.product,
      };
    } else {
      console.log("some error");
    }
    localStorage.setItem("cartProducts", JSON.stringify(prevCart));
    props.calcTotal(prevCart);
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
              {/* <p className="brand">{props.cartProduct.product.brand}</p> */}
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
      {/* <MDBCard className="mb-3">
        <MDBCardBody className="single-card">
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-row align-items-center prodDetails">
              <div className="prodImage">
                <MDBCardImage
                  src={props.cartProduct.product.thumbnail}
                  fluid
                  className="rounded-3 crd-img"
                  alt="Shopping item"
                  // style={{"width":"90%", "margin":"0px"}}
                />
              </div>
              <div className="prodTitle">
                <MDBTypography>{props.cartProduct.product.title}</MDBTypography>
                <p className="brand">{props.cartProduct.product.brand}</p>
              </div>
            </div>
            <div className="d-flex flex-row align-items-center priceDetails">
              <div className="prodCommon">
                <MDBTypography>
                  ${props.cartProduct.product.price}
                </MDBTypography>
              </div>
              <div className="prodCommon">
                <MDBTypography>
                  {props.cartProduct.product.discountPercentage}%
                </MDBTypography>
              </div>
              <div className="prodCommon">
                <MDBTypography>${priceAfterDisc}</MDBTypography>
              </div>
              <div className="prodQuantity">
                <MDBTypography>
                  <MDBInput
                    id="typeNumber"
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => updateQuantity(e.target.value)}
                  />
                </MDBTypography>
              </div>
              <div className="prodCommon">
                <MDBTypography>${totalPrice}</MDBTypography>
              </div>
              <div className="prodDelete">
                <MDBIcon
                  fas
                  icon="trash-alt"
                  onClick={() => props.removeFromCart(pid)}
                />
              </div>
            </div>
          </div>
        </MDBCardBody>
      </MDBCard> */}
    </div>
  );
};

export default CartCard;
