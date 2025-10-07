import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Register(){
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const onSubmit = async (e)=>{
    e.preventDefault();
    const res = await api.post("/auth/register", { full_name, email, password });
    localStorage.setItem("access_token", `Bearer ${res.data.token}`);
    nav("/profile");
  };

  return (
    <form onSubmit={onSubmit} style={{maxWidth:360, margin:"40px auto", display:"grid", gap:12}}>
      <h2>Đăng ký</h2>
      <input placeholder="Họ tên" value={full_name} onChange={e=>setFullName(e.target.value)}/>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input placeholder="Mật khẩu" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
      <button type="submit">Tạo tài khoản</button>
    </form>
  );
}
