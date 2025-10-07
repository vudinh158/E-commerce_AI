import React from "react";
import RouterView from "./router.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

export default function App(){
  return (
    <div className="app">
      <Header/>
      <main style={{maxWidth:1200, margin:"0 auto", padding:"16px"}}>
        <RouterView/>
      </main>
      <Footer/>
    </div>
  );
}
