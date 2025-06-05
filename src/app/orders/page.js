"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const cookies = new Cookies();
  const token = cookies.get("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/user/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Orders fetched successfully:", response);  
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-medium text-gray-800 mb-6">My Orders</h1>
        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <img src="/empty-orders.png" className="w-48 mx-auto mb-4" alt="No orders" />
            <p className="text-xl text-gray-600">No orders found</p>
            <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">Start Shopping</button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow">
                <div className="border-b p-4 flex justify-between items-center bg-blue-50">
                  <div>
                    <p className="text-sm text-gray-700">ORDER ID: #{order._id}</p>
                    <p className="text-sm text-gray-700">Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">Total: ₹{order.totalAmount}</p>
                    <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-6">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex items-center py-2 border-b">
                        <div className="w-16 h-16 bg-gray-200 rounded mr-4"></div>
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-900">{item.product ? item.product.name : 'Product Unavailable'}</h3>
                          <p className="text-sm text-gray-700">Quantity: {item.quantity}</p>
                          <p className="text-sm font-medium text-gray-900">₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Delivery Address</h3>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-700">
                          {order.shippingAddress.street}<br/>
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br/>
                          {order.shippingAddress.country}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Information</h3>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-700">Method: {order.paymentMethod}</p>
                        <p className={`mt-1 font-medium ${
                          order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          Status: {order.paymentStatus}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 font-medium">
                      Need Help?
                    </button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
