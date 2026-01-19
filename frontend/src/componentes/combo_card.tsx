
import ImgMediaCard from "./card_img";

export default function ComboCard({ combo }) {

  if (!combo) {
    return <div>Carregando combo...</div>;
  }

  const productsNames = combo.products.map((product) => product.name).join(", ");

  const product = {
    id: combo.id,
    active: combo.active,
    description: ((combo.description || "") + " (Inclui: " + productsNames + ")"),
    name: combo.name,
    price: combo.price,
    category: "Combo",
    image_url: combo.image_url
  }

  return <ImgMediaCard key={product.id} produto={product} />;



}
