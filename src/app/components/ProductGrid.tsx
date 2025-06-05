import Link from "next/link"
import Image from "next/image"

export type Product = {
  id: number
  name: string
  price: number
  image: string
  category: string
}

type ProductGridProps = {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product:any) => (
        <Link key={`${product._id}${new Date()}`} href={`/product/${product.id}`} className="group">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-64">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                style={{ objectFit: "fill" }}
                className="group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

