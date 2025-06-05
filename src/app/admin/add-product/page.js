"use client";
import { useState, useEffect } from "react";

export default function AddProductPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    discountPercentage: "",
    rating: "",
    stock: "",
    tags: "",
    brand: "",
    sku: "",
    weight: "",
    width: "",
    height: "",
    depth: "",
    warrantyInformation: "",
    shippingInformation: "",
    availabilityStatus: "",
    returnPolicy: "",
    minimumOrderQuantity: "",
    barcode: "",
    images: [],
    thumbnail: null,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTags = (e) => {
    setForm((prev) => ({ ...prev, tags: e.target.value.split(",") }));
  };

  const handleImages = (e) => {
    const files = [...e.target.files];
    setImageFiles(files);

    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);

    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];

    URL.revokeObjectURL(newPreviews[index]);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const removeThumbnail = () => {
    URL.revokeObjectURL(thumbnailPreview);
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const uploadToCloudinary = async (file) => {
    // Use server-side API route for secure uploads
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to upload image");
    }
    
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); 
    try {
      const imageUrls = await Promise.all(imageFiles.map(uploadToCloudinary));
      let thumbnailUrl = null;
      if (thumbnailFile) {
        thumbnailUrl = await uploadToCloudinary(thumbnailFile);
      }

      const payload = {
        ...form,
        price: parseFloat(form.price),
        discountPercentage: parseFloat(form.discountPercentage),
        rating: parseFloat(form.rating),
        stock: parseInt(form.stock),
        weight: parseFloat(form.weight),
        dimensions: {
          width: parseFloat(form.width),
          height: parseFloat(form.height),
          depth: parseFloat(form.depth),
        },
        tags: Array.isArray(form.tags) ? form.tags : form.tags.split(","),
        images: imageUrls,
        thumbnail: thumbnailUrl,
        meta: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          barcode: form.barcode,
          qrCode: "",
        },
        reviews: [],
      };

      const res = await fetch("/api/admin/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage("Product added successfully!");
        setForm({
          title: "",
          description: "",
          category: "",
          price: "",
          discountPercentage: "",
          rating: "",
          stock: "",
          tags: "",
          brand: "",
          sku: "",
          weight: "",
          width: "",
          height: "",
          depth: "",
          warrantyInformation: "",
          shippingInformation: "",
          availabilityStatus: "",
          returnPolicy: "",
          minimumOrderQuantity: "",
          barcode: "",
          images: [],
          thumbnail: null,
        });
        setImageFiles([]);
        setThumbnailFile(null);
      } else {
        setMessage("Failed to add product.");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Add New Product
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Basic Information
            </h2>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Product Title"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Product Description"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32 text-gray-900 placeholder-gray-500"
              required
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                type="number"
                step="0.01"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                required
              />
              <input
                name="discountPercentage"
                value={form.discountPercentage}
                onChange={handleChange}
                placeholder="Discount %"
                type="number"
                step="0.01"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Product Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              />
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="SKU"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Brand"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
            <input
              name="tags"
              value={Array.isArray(form.tags) ? form.tags.join(",") : form.tags}
              onChange={handleTags}
              placeholder="Tags (comma separated)"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Dimensions & Weight
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="Weight"
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              />
              <input
                name="width"
                value={form.width}
                onChange={handleChange}
                placeholder="Width"
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              />
              <input
                name="height"
                value={form.height}
                onChange={handleChange}
                placeholder="Height"
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              />
              <input
                name="depth"
                value={form.depth}
                onChange={handleChange}
                placeholder="Depth"
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Additional Information
            </h2>
            <input
              name="warrantyInformation"
              value={form.warrantyInformation}
              onChange={handleChange}
              placeholder="Warranty Information"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
            <input
              name="shippingInformation"
              value={form.shippingInformation}
              onChange={handleChange}
              placeholder="Shipping Information"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
            <input
              name="returnPolicy"
              value={form.returnPolicy}
              onChange={handleChange}
              placeholder="Return Policy"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="col-span-full space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImages}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        type="button"
                      >
                        ×
                      </button>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Thumbnail Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnail}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                {thumbnailPreview && (
                  <div className="relative w-24">
                    <button
                      onClick={removeThumbnail}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      type="button"
                    >
                      ×
                    </button>
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-full">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
            {message && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  message.includes("Error")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
