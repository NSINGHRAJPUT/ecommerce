const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

async function createAdminUser() {
  try {
    await dbConnect();
    
    const User = mongoose.models.ClothesUser;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const adminData = {
      name: "Admin User",
      email: "admin@example.com", 
      password: hashedPassword,
      role: "admin"
    };

    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (!existingAdmin) {
      const admin = await User.create(adminData);
      console.log("Admin user created successfully");
      return admin;
    } else {
      console.log("Admin user already exists");
      return existingAdmin;
    }

  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

module.exports = dbConnect;
module.exports.createAdminUser = createAdminUser;
