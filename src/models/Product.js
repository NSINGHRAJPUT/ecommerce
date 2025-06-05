const { Schema, model, models } = require("mongoose");

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a product title"],
      trim: true,
      maxlength: [100, "Product title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a product description"],
      maxlength: [2000, "Description cannot be more than 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
      min: [0, "Price cannot be negative"],
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot be more than 5"],
    },
    stock: {
      type: Number,
      required: [true, "Please provide product stock"],
      min: [0, "Stock cannot be negative"],
    },
    tags: [String],
    brand: String,
    sku: String,
    weight: Number,
    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
    },
    warrantyInformation: String,
    shippingInformation: String,
    availabilityStatus: String,
    reviews: [
      {
        rating: Number,
        comment: String,
        date: Date,
        reviewerName: String,
        reviewerEmail: String,
      },
    ],
    returnPolicy: String,
    minimumOrderQuantity: Number,
    meta: {
      createdAt: Date,
      updatedAt: Date,
      barcode: String,
      qrCode: String,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    thumbnail: String,
  },
  {
    timestamps: true,
  }
);

module.exports = models.clothesProduct || model("clothesProduct", productSchema);
