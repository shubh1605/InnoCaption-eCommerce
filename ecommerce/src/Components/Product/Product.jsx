import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import React, { useState, useEffect } from "react";
import "../Product/Product.css";

const Product = (props) => {
  return (
    <div className="content">
      <img src={props.product.thumbnail} alt="smartwatch" />
      <h3 className="name">{props.product.title}</h3>
      <p className="brand-name">{props.product.brand}</p>
      <hr className="product-hr" />
      <div className="product-description">
        {" "}
        <p> {props.product.description}</p>
      </div>
      <hr className="product-hr" />
      <div className="product-footer">
        <div className="left-half">
          <div className="price"> ${props.product.price}</div>
          <div className="discount-prod">
            {props.product.discountPercentage}% off
          </div>
        </div>
        <div className="right-half">
          <div className="ratings"> Ratings</div>
          <div className="rate">{props.product.rating} / 5</div>
        </div>
      </div>

      <button
        className="button"
        onClick={() => props.addToCartFunction(props.product)}
      >
        {props.isInCart(props.product.id) ? (
          <>Remove from Cart</>
        ) : (
          <>Add to Cart</>
        )}
        &nbsp;<i className="fa-sharp fa-solid fa-cart-shopping"></i>
      </button>
    </div>

    // </div>
  );
};

export default Product;
