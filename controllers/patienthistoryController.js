const PatientHistory = require("../models/patienthistory");
const Patient = require("../models/patient");
const Hospital = require("../models/hospital");

const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

// Display detail page for a specific patient history.
exports.patienthistory_detail = asyncHandler(async (req, res, next) => {
  const [patienthistory, hospital] = await Promise.all([
    PatientHistory.findById(req.params.id).populate("hospital").exec(),
    Hospital.find({ patienthistory: req.params.id }).exec(),
  ]);

  if (patienthistory === null) {
    const err = new Error("Patient history not found");
    err.status = 404;
    return next(err);
  }

  const patient = await Patient.findOne({ patient_history: req.params.id }).exec();

  res.render("patienthistory_detail", {
    title: "Patient History Detail",
    patienthistory: patienthistory,
    patient: patient,
    hospital: hospital,
  });
});

// Display PatientHistory create form on GET.
exports.patienthistory_create_get = asyncHandler(async (req, res, next) => {
  // Get all hospitals and patients which can be used to add to our patient history.
  const [allHospitals, allPatients] = await Promise.all([
    Hospital.find().exec(),
    Patient.find().exec(),
  ]);

  res.render("patienthistory_form", {
    title: "Create Patient History",
    hospitals: allHospitals,
    patients: allPatients,
  });
});

// Handle Patient History create on POST.
exports.patienthistory_create_post = [
  // Validate and sanitize fields.
  body("attended_at")
    .isISO8601()
    .toDate(),
  body("medication_status")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("medication_start")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("medication_end")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("diagnosis")
    .isArray({ min: 1 })
    .custom((value) => {
      // Ensure all elements in the array are strings
      return value.every((elem) => typeof elem === "string" && elem.trim().length > 0);
    }),
  body("medication")
    .isArray({ min: 1 })
    .custom((value) => {
      // Ensure all elements in the array are strings
      return value.every((elem) => typeof elem === "string" && elem.trim().length > 0);
    }),
  body("hospital")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from a reequest.
    const errors = validationResult(req);

    // Create a Patient History Object with sanitized data.
    const patienthistory = new PatientHistory({
      attended_at: req.body.attended_at,
      medication_status: req.body.medication_status,
      medication_start: req.body.medication_start,
      medication_end: req.body.medication_end,
      diagnosis: req.body.diagnosis,
      medication: req.body.medication,
      hospital: req.body.hospital,
    });

    if (!errors.isEmpty()) {
      // If there are errors, render form again with sanitized values/error messages.

      // Get all hospitals and all patients for form.
       const [allHospitals, allPatients] = await Promise.all([
         Hospital.find().exec(),
         Patient.find().exec(),
       ]);

      // Mark the selected hospital as checked.
      for (const hospital of allHospitals) {
        if (patienthistory.hospital.includes(hospital._id)) {
          hospital.checked = "true";
        }
      }
      res.render("patienthistory_form", {
        title: "Create Patient History",
        hospitals: allHospitals,
        patients: allPatients,
        patienthistory: patienthistory,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save book.
      await patienthistory.save();
      res.redirect(patienthistory.url);
    }
  }),
];

// Display Patient History update form on GET.
exports.patienthistory_update_get = asyncHandler(async (req, res,next) => {
  res.send("NOT IMPLEMENTED YET: patient history update GET.");
});

// Handle Patient History update on post.
exports.patienthistory_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED: patient history update on POST.");
});
