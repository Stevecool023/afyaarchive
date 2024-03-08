const mongoose = require("mongoose");

const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PatientSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  surname: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  patient_history: { type: Schema.Types.Mixed },
  national_id: { type: Number, required: true },
  chronic_illness: { type: String },
});

// Virtual for patient's full name
PatientSchema.virtual("name").get(function () {
  // To avoid errors in cases where a patient does not have either a surname of first name
  // Handle the exception by returning an empty string for that case.
  let fullname = "";
  if (this.first_name && this.surname) {
    fullname = `${this.surname}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for patient's URL
PatientSchema.virtual("url").get(function () {
  // don't use arrow function coz the this object is needed
  return `/archive/patient/${this._id}`;
});

PatientSchema.virtual("date_birth_formatted").get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
});

// Export model
module.exports = mongoose.model("Patient", PatientSchema);
