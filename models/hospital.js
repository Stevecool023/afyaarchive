const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const HospitalSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String },
  locality: { type: String },
  description: { type: String },
});

// Virtual for hospital's URL
HospitalSchema.virtual("url").get(function () {
  // again don't use arrow function in order to use the this object
  return `/archive/hospital/${this._id}`;
});

// Export model
module.exports = mongoose.model("Hospital", HospitalSchema);
