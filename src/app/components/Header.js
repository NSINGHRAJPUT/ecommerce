"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart, User } from "lucide-react";
import Cookies from "universal-cookie";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [user, setUser] = useState(null);
  const cookies = new Cookies();
  const token = cookies.get("token");
  const { cartItems } = useCart();

  useEffect(() => {
    if (token) {
      fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          }
        });
    }
  }, [token]);

  const handleLogout = () => {
    cookies.remove("token");
    setUser(null);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Stylish Threads
        </Link>
        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <Link
                href="/products"
                className="text-gray-600 hover:text-gray-800"
              >
                Products
              </Link>
            </li>
            {token ? (
              <>
                <li>
                  <Link
                    href="/cart"
                    className="text-gray-600 hover:text-gray-800 flex items-center"
                  >
                    <ShoppingCart className="w-5 h-5 mr-1" />
                    Cart ({cartItems.length})
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account"
                    className="text-gray-600 hover:text-gray-800 flex items-center"
                  >
                    <User className="w-5 h-5 mr-1" />
                    {user?.name}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
