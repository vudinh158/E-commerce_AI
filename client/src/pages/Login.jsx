import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const onSubmit = async (e)=>{
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("access_token", `Bearer ${res.data.token}`);
      nav("/profile");
    } catch (e) {
      alert("Sai email hoặc mật khẩu");
    }
  };

  return (
    <form onSubmit={onSubmit} style={{maxWidth:360, margin:"40px auto", display:"grid", gap:12}}>
      <h2>Đăng nhập</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input placeholder="Mật khẩu" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
      <button type="submit">Đăng nhập</button>
      <div>Chưa có tài khoản? <Link to="/register">Đăng ký</Link></div>
    </form>
  );
}
