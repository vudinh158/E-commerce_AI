import React, { useState } from "react";
import api from "../api";

export default function Checkout(){
  const [info, setInfo] = useState({ full_name:"", phone:"", email:"", address:"" });
  const [created, setCreated] = useState(null);

  const submit = async ()=>{
    const items = JSON.parse(localStorage.getItem("guest_items") || "[]"); // fallback guest
    const payload = {
      customer_info: info,
      items, // [{product_variation_id, quantity}]
      payment_method: "COD",
      shipping_method: "standard"
    };
    const res = await api.post("/orders", payload);
    setCreated(res.data);
  };

  if (created) return <pre>Đã tạo đơn: {JSON.stringify(created, null, 2)}</pre>;

  return (
    <div style={{maxWidth:640}}>
      <h2>Thanh toán (Guest)</h2>
      <div style={{display:"grid", gap:8}}>
        <input placeholder="Họ tên" value={info.full_name} onChange={e=>setInfo({...info, full_name:e.target.value})}/>
        <input placeholder="SĐT" value={info.phone} onChange={e=>setInfo({...info, phone:e.target.value})}/>
        <input placeholder="Email" value={info.email} onChange={e=>setInfo({...info, email:e.target.value})}/>
        <input placeholder="Địa chỉ" value={info.address} onChange={e=>setInfo({...info, address:e.target.value})}/>
        <button onClick={submit} style={{padding:"12px 16px"}}>HOÀN TẤT ĐƠN HÀNG</button>
      </div>
    </div>
  );
}
