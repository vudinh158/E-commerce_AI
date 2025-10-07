import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard.jsx";

export default function Listing(){
  const [sp] = useSearchParams();
  const [data, setData] = useState({ items:[], total:0, page:1, limit:12 });
  const [loading, setLoading] = useState(false);

  const fetchData = async ()=>{
    setLoading(true);
    const qs = sp.toString();
    const res = await api.get(`/products?${qs}`);
    setData(res.data);
    setLoading(false);
  };

  useEffect(()=>{ fetchData(); }, [sp]);

  return (
    <div className="container">
      <h2 className="mb-4 text-xl font-bold">Kết quả tìm kiếm</h2>
      {loading ? (
        <div className="py-10 text-center text-neutral-500">Đang tải…</div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {data.items.map(p => <ProductCard key={p.id} p={p}/>)}
        </div>
      )}
    </div>
  );
}
