import ProductCard from "./ProductCard";
import type { Combo, Produto } from "../../types";

interface ComboCardProps {
  combo: Combo;
  onAdd: (item: Produto | Combo, quantity: number) => void;
}

export default function ComboCard({ combo, onAdd }: ComboCardProps) {
  if (!combo) {
    return <div>Carregando combo...</div>;
  }

  const productsNames = combo.products?.map((product) => product.name).join(", ") || "";
  
  const productData: Produto = {
    id: combo.id,
    description: `${combo.descricao || ""} (Inclui: ${productsNames})`,
    name: combo.name,
    price: combo.price,
    category: "outros",
    image_url: combo.image_url
  };

  return <ProductCard produto={productData} onAdd={onAdd} />;
}
