import React, { useEffect, useState } from "react";
import api from "../api";

export default function Profile(){
  const [me, setMe] = useState(null);
  useEffect(()=>{
    api.get("/me").then(res=>setMe(res.data));
  },[]);
  if(!me) return "Đang tải...";
  return (
    <div>
      <h2>Tài khoản của tôi</h2>
      <div><b>Họ tên:</b> {me.full_name}</div>
      <div><b>Email:</b> {me.email}</div>
      <div><b>Phone:</b> {me.phone || "-"}</div>
    </div>
  );
}
