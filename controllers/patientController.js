// const mongoose = require('mongoose');

const Patient = require("../models/patient");
const PatientHistory = require("../models/patienthistory");

const flash = require('express-flash');
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display patient id validation form on GET.
exports.patient_id_get = asyncHandler(async (req, res, next) => {
  // Get all patients in order to validate patient.
  const allPatients = await Patient.find().exec();

  res.render("validate_form", {
    title: "Validate Patient availability",
    patients: allPatients,
  });
});

// Validate patient id on POST.
exports.patient_id_post = [
  // Validate and sanitize name and ID.
  body("first_name", "Patient name must contain atleast 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("surname", "Name must contain atleast 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("national_id", "ID must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors, render the form again with sanitized data and error messages.
      const allPatients = await Patient.find().exec();
      res.render("validate_form", {
        title: "Validate Patient availability",
        patients: allPatients,
        errors: errors.array(),
      });
      return;
    } else {
      // Data form is valid.
      // Check if patient with the id exists.
      const patientExists = await Patient.findOne({ national_id: req.body.national_id }).exec();
      if (patientExists) {
        // redirect to patient detail page.
        res.redirect(patientExists.url);
      } else {
        // Flash message indicating patient is not available.
        // req.flash("error", "Patient with the provided ID does not exist.");
        
        // Render form again with an error message.
        res.render("validate_form", {
          title: "Validate Patient Availability",
          errors: [{ msg: "Patient with the provided ID does not exist." }],
        });
      }
    }
  })
];

// Display patient page for a specific patient.
exports.patient_detail = asyncHandler(async (req, res, next) => {
  // Get details for patients.
  const patient = await Patient.findById(req.params.id).exec();

  if (patient === null) {
    // No results.
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  console.log("Patient:", patient);
  console.log("Patient history:", patient.patient_history);
  console.log("Patient diagnosis:", patient.patient_history.diagnosis);

  res.render("patient_detail", {
    title: patient.name,
    patient: patient,
  });
});

// Display patient create form on GET.
exports.patient_create_get = (req, res, next) => {
  res.render("patient_form", { title: "Create Patient" });
};

// Handle patient create on POST.
exports.patient_create_post = [
  // Validate data fields.
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("surname")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Surname must be specified.")
    .isAlphanumeric()
    .withMessage("Surname has non-alphanumeric characters."),
  body("national_id", "ID must not be empty").trim().isLength({ min: 1 }).escape(),
  body("date_of_birth", "Invalid date of birth")
    .isISO8601()
    .toDate(),
  body("chronic_illness")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("patient_history")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from request.
    const errors = validationResult(req);

    // Create Patient object.
    const patient = new Patient({
      first_name: req.body.first_name,
      surname: req.body.surname,
      national_id: req.body.national_id,
      date_of_birth: req.body.date_of_birth,
      chronic_illness: req.body.chronic_illness,
      patient_history: req.body.patient_history,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("patient_form", {
        title: "Create Patient",
        patient: patient,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Save patient.
      await patient.save();

      // Redirect to patient's record.
      res.redirect(patient.url);
    }
  }),
];

// Display patient update form on GET.
exports.patient_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Patient update GET");
});

// Handle patient update on POST.
exports.patient_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Patient update POST");
});
