import React, { useEffect, useState } from "react";
import api from "../api";
import ProductCard from "../components/ProductCard.jsx";

export default function Home(){
  const [banners, setBanners] = useState([]);
  const [best, setBest] = useState([]);

  useEffect(()=>{
    api.get("/banners?is_active=true").then(res=>setBanners(res.data));
    api.get("/products?sort=top_selling&limit=8").then(res=>setBest(res.data.items));
  },[]);

  return (
    <div className="container space-y-8">
      <div className="card overflow-hidden">
        {banners[0] && (
          <a href={banners[0].link_url} target="_blank" rel="noreferrer">
            <img src={banners[0].image_url} className="w-full" />
          </a>
        )}
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Sản phẩm bán chạy</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {best.map(p => <ProductCard key={p.id} p={p}/>)}
        </div>
      </section>
    </div>
  );
}
