import Image from "next/image";
import Link from "next/link";

export default function ProductGrid(products) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.id}`}
          className="bg-white rounded-lg shadow-lg border-[1px] overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative h-48">
            <Image
              src={product.image}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-t-lg"
            />
          </div>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2 capitalize truncate">
              {product.name}
            </h2>
            <div className="flex justify-between items-center">
              <span className="text-green-600 font-bold">${product.price}</span>
              <span className="text-sm text-gray-500 capitalize">
                {product.category}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
