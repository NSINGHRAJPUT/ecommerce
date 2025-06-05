"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import s1 from '../assets/slider/Accessories.png';
import s2 from '../assets/slider/Summer Collection.png';
import s4 from '../assets/slider/Winter Wear.png';
import s5 from '../assets/slider/Spring Fashion.png';
import s6 from '../assets/slider/Footwear.png';
import s7 from '../assets/slider/formal wear.png';
import s8 from '../assets/slider/casual outfits.png';

// const slides = [
//   { id: 1, image: "/placeholder.svg?height=400&width=800", alt: "Summer Collection" },
//   { id: 2, image: "/placeholder.svg?height=400&width=800", alt: "Autumn Styles" },
//   { id: 3, image: "/placeholder.svg?height=400&width=800", alt: "Winter Wear" },
//   { id: 4, image: "/placeholder.svg?height=400&width=800", alt: "Spring Fashion" },
//   { id: 5, image: "/placeholder.svg?height=400&width=800", alt: "Accessories" },
//   { id: 6, image: "/placeholder.svg?height=400&width=800", alt: "Footwear" },
//   { id: 7, image: "/placeholder.svg?height=400&width=800", alt: "Formal Wear" },
//   { id: 8, image: "/placeholder.svg?height=400&width=800", alt: "Casual Outfits" },
// ]

const slides = [
  { id: 1, image: s1, alt: "Summer Collection" },
  { id: 3, image: s2, alt: "Winter Wear" },
  { id: 4, image: s4, alt: "Spring Fashion" },
  { id: 5, image: s5, alt: "Accessories" },
  { id: 6, image: s6, alt: "Footwear" },
  { id: 7, image: s7, alt: "Formal Wear" },
  { id: 8, image: s8, alt: "Casual Outfits" },
]

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide]) // Added nextSlide to dependencies

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
        >
          <Image src={slide.image || "/placeholder.svg"} alt={slide.alt} fill style={{ objectFit: "fill", width: '100%' }} />
        </div>
      ))}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  )
}

