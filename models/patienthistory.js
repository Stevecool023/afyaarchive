const mongoose = require("mongoose");

const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PatientHistorySchema = new Schema({
  hospital: { type: Schema.Types.ObjectId, ref: "Hospital" },
  attended_at: { type: Date, required: true },
  medication_status: { type: String },
  medication_start: { type: Date },
  medication_end: { type: Date },
  diagnosis: [{ type: String }],
  medication: [{ type: String }],
});

// Virtual for patient's history URL
PatientHistorySchema.virtual("url").get(function () {
  // no use of arrow functions in order to deploy the this function
  return `/archive/patienthistory/${this._id}`;
});

PatientHistorySchema.virtual("attended_at_formatted").get(function () {
    return DateTime.fromJSDate(this.attended_at).toLocaleString(DateTime.DATE_MED);
});

PatientHistorySchema.virtual("med_start_date_formatted").get(function () {
  return DateTime.fromJSDate(this.medication_start).toLocaleString(DateTime.DATE_MED);
});

PatientHistorySchema.virtual("med_end_date_formatted").get(function () {
  return DateTime.fromJSDate(this.medication_end).toLocaleString(DateTime.DATE_MED);
});

// Export model
module.exports = mongoose.model("PatientHistory", PatientHistorySchema);
