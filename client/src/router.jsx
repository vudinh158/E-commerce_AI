import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Listing from "./pages/Listing.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";

const Private = ({children})=>{
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" replace/>;
};

export default function RouterView(){
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/products" element={<Listing/>}/>
      <Route path="/product/:slug" element={<ProductDetail/>}/>
      <Route path="/cart" element={<Private><Cart/></Private>}/>
      <Route path="/checkout" element={<Checkout/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/profile" element={<Private><Profile/></Private>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  );
}
