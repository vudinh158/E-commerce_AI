import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function ProductDetail(){
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [vId, setVId] = useState(null);

  useEffect(()=>{
    api.get(`/products/${slug}`).then(res=>{
      setP(res.data);
      const def = res.data.variations.find(v => v.is_default) || res.data.variations[0];
      setVId(def?.id);
    });
  }, [slug]);

  const addToCart = async ()=>{
    const token = localStorage.getItem("access_token");
    if(!token) return alert("Hãy đăng nhập trước khi thêm giỏ");
    await api.post("/cart/items", { product_variation_id: vId, quantity: 1 });
    alert("Đã thêm vào giỏ hàng");
  };

  if(!p) return <div className="container py-10 text-neutral-500">Đang tải…</div>;
  const activeVar = p.variations.find(v => v.id === vId);
  const price = activeVar?.sale_price ?? activeVar?.price;

  return (
    <div className="container grid gap-8 md:grid-cols-2">
      <div className="card overflow-hidden">
        <img src={p.images?.[0]?.image_url} className="w-full" />
        <div className="flex gap-2 overflow-x-auto p-3">
          {p.images.map(img=>(
            <img key={img.id} src={img.image_url} className="h-20 w-20 rounded-xl object-cover" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{p.name}</h1>
        <div className="text-neutral-600">★ {p.rating_average} ({p.review_count})</div>
        <div className="text-3xl font-extrabold text-neutral-900">{price} ₫</div>

        <div className="space-y-2">
          <div className="text-sm text-neutral-600">Biến thể</div>
          <div className="flex flex-wrap gap-2">
            {p.variations.map(v=>(
              <button
                key={v.id}
                onClick={()=>setVId(v.id)}
                className={`btn ${vId===v.id ? "btn-outline bg-neutral-50" : "btn-outline"}`}
              >
                {v.sku}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={addToCart} className="btn btn-primary">MUA NGAY</button>
          <button onClick={addToCart} className="btn btn-outline">THÊM VÀO GIỎ</button>
        </div>
      </div>
    </div>
  );
}
