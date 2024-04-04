import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Outlet } from "react-router-dom";
import React from "react";
import "../Navbar/Navbar.css";

const CustomNavbar = (props) => {
  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">Ecommerce</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Nav.Link href="/cart">
                <div>
                  My cart &nbsp;
                  <i className="fa-sharp fa-solid fa-cart-shopping"></i>
                  <span className="number" id="">
                    {props.itemNumbers}
                  </span>
                </div>
              </Nav.Link>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};

export default CustomNavbar;
