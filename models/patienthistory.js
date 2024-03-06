const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PatientHistorySchema = new Schema({
  attended_at: { type: Date, required: true },
  medication_status: { type: String },
  medication_start: { type: Date },
  medication_end: { type: Date },
  hospital: { type: String },
  diagnosis: { type: [String] },
  medication: { type: [String] },
});

// Virtual for patient's history URL
PatientHistorySchema.virtual("url").get(function () {
  // no use of arrow functions in order to deploy the this function
  return `/archive/patienthistory/${this._id}`;
});

// Export model
module.exports = mongoose.model("PatientHistory", PatientHistorySchema);
