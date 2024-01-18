const mongoose = require("mongoose");
const { Schema } = mongoose;

const ecuserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
  addresses: { type: [Schema.Types.Mixed] },
  // TODO:  We can make a separate Schema for this
  name: { type: String },
  orders: { type: [Schema.Types.Mixed] },
});

const virtual = ecuserSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
ecuserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const EcUser = mongoose.model("EcUser", ecuserSchema);

module.exports = EcUser;
