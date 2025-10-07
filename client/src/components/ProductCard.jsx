import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ p }){
  const price =
    p.min_price === p.max_price ? p.min_price : `${p.min_price} - ${p.max_price}`;
  return (
    <Link to={`/product/${p.slug}`} className="card group overflow-hidden">
      <div className="relative">
        <img
          src={p.thumbnail}
          alt={p.name}
          className="aspect-square w-full object-cover transition group-hover:scale-[1.02]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/80 px-2 py-1 text-xs text-white">
          ★ {p.rating_average} ({p.review_count})
        </span>
      </div>
      <div className="space-y-1 p-4">
        <div className="line-clamp-2 min-h-[40px] font-semibold text-neutral-800">{p.name}</div>
        <div className="text-lg font-extrabold text-neutral-900">{price} ₫</div>
      </div>
    </Link>
  );
}
