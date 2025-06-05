import Carousel from "./components/Carousel";
import CategoryList from "./components/CategoryList";
import ProductList from "./components/ProductList";

export default function Home() {
  return (
    <div className="space-y-8">
      <Carousel />
      <CategoryList />
      <ProductList />
    </div>
  );
}
