import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Cart(){
  const [cart, setCart] = useState({ items:[] });
  const load = async ()=> {
    const res = await api.get("/cart");
    setCart(res.data);
  };
  useEffect(()=>{ load(); }, []);
  const inc = async (it, delta)=>{
    const q = Math.max(1, (it.quantity + delta));
    await api.put(`/cart/items/${it.id}`, { quantity: q });
    load();
  };
  const del = async (it)=>{
    await api.delete(`/cart/items/${it.id}`);
    load();
  };
  const subtotal = cart.items.reduce((s, i)=> s + i.price*i.quantity, 0);

  return (
    <div className="container grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-3">
        {cart.items.map(it=>(
          <div key={it.id} className="card grid grid-cols-[80px,1fr,auto] gap-3 p-3">
            <img src={it.thumbnail} className="h-20 w-20 rounded-xl object-cover" />
            <div>
              <div className="font-semibold">{it.name}</div>
              <div className="text-neutral-600">{it.price} ₫</div>
              <div className="mt-2 inline-flex items-center gap-2">
                <button className="btn btn-outline px-2" onClick={()=>inc(it,-1)}>-</button>
                <span>{it.quantity}</span>
                <button className="btn btn-outline px-2" onClick={()=>inc(it,1)}>+</button>
              </div>
            </div>
            <button onClick={()=>del(it)} className="btn btn-outline h-fit">Xóa</button>
          </div>
        ))}
        <Link to="/products" className="text-sm text-neutral-700 hover:text-black">← Tiếp tục mua hàng</Link>
      </div>

      <aside className="card h-fit p-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Tạm tính</span><b>{subtotal} ₫</b></div>
          <div className="flex justify-between"><span>Phí VC</span><span>0 ₫</span></div>
          <div className="flex justify-between"><span>Giảm giá</span><span>0 ₫</span></div>
          <hr className="my-2" />
          <div className="flex justify-between text-lg"><span>Tổng cộng</span><b>{subtotal} ₫</b></div>
        </div>
        <Link to="/checkout">
          <button className="btn btn-primary mt-3 w-full">TIẾN HÀNH THANH TOÁN</button>
        </Link>
      </aside>
    </div>
  );
}
