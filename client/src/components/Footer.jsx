import React from "react";
export default function Footer(){
  return (
    <footer className="border-t border-neutral-200 mt-10 py-6 text-neutral-600">
      <div className="container text-sm">
        © {new Date().getFullYear()} <b>Smart Laptop Store</b>. All rights reserved.
      </div>
    </footer>
  );
}
