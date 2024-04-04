import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AllProducts from './Components/allProducts/allProducts';
import Cart from './Components/Cart/Cart';
import CustomNavbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {React, useState, useEffect} from 'react';
function App() {
  const [itemNumbers, setItemNumbers] = useState(0);
  useEffect(() => {
    getCartItemNumbers();
  })

  function getCartItemNumbers(){
    var prevCart = localStorage.getItem("cartProducts");
    var t = 0;
    if (prevCart != null) {
      prevCart = JSON.parse(prevCart);
      t = Object.keys(prevCart).length;
    }
    setItemNumbers(t);
  };
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomNavbar itemNumbers={itemNumbers} />}>
          <Route index element={<AllProducts getCartItemNumbers={getCartItemNumbers} />} />
          <Route path="cart" element={<Cart getCartItemNumbers={getCartItemNumbers} itemNumbers={itemNumbers}/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
