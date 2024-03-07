const Patient = require("../models/patient");
const asyncHandler = require("express-async-handler");

// Display patient view form on GET.
exports.patient_detail_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Patient detail: ${req.params.id}`);
});

// View Patient details on POST.
exports.patient_detail_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Patient view POST');
});

// Display patient create form on GET.
exports.patient_create_get = asyncHandler(async (req, res, next) => {
  res.send("not implemented: patient create get");
});

// Handle patient create on POST.
exports.patient_create_post = asyncHandler(async (req, res, next) => {
  res.send('not implemented: patient create post');
});

// Display patient update form on GET.
exports.patient_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Patient update GET");
});

// Handle patient update on POST.
exports.patient_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Patient update POST");
});
