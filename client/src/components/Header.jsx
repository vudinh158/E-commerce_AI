import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header(){
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const onSearch = (e)=>{
    e.preventDefault();
    nav(`/products?q=${encodeURIComponent(q)}`);
  };
  const token = localStorage.getItem("access_token");

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="container flex items-center gap-4 py-3">
        <Link to="/" className="text-xl font-bold tracking-tight">LaptopStore</Link>

        <form onSubmit={onSearch} className="flex-1">
          <div className="relative">
            <input
              className="input pl-10"
              placeholder="Tìm laptop, RAM, CPU…"
              value={q}
              onChange={e=>setQ(e.target.value)}
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">🔎</span>
          </div>
        </form>

        <nav className="flex items-center gap-4">
          <Link to="/products" className="text-sm text-neutral-700 hover:text-black">Danh mục</Link>
          <Link to="/cart" className="text-sm text-neutral-700 hover:text-black">Giỏ hàng</Link>
          {token
            ? <Link to="/profile" className="btn btn-outline">Tài khoản</Link>
            : <Link to="/login" className="btn btn-primary">Đăng nhập</Link>}
        </nav>
      </div>
    </header>
  );
}
