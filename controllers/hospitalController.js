const Hospital = require("../models/hospital");
const Patient = require("../models/patient");
const PatientHistory = require("../models/patienthistory");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of patients and hospital counts (in parallel)
  const [
    numHospitals,
    numPatients,
  ] = await Promise.all([
    Hospital.countDocuments({}).exec(),
    Patient.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "afyaarchive",
    hospital_count: numHospitals,
    patient_count: numPatients,
  });
});

exports.staff_only = asyncHandler(async (req, res, next) => {
  // Just render a title without handling any logic
  res.render("staff-only", { title: "Critical operations" });
});

// Display list of all Hospitals.
exports.hospital_list = asyncHandler(async (req, res, next) => {
  const allHospitals = await Hospital.find({}, "name locality")
    .sort({ locality: 1 })
    .exec();

  res.render("hospital_list", { title: "Hospital List", hospital_list: allHospitals });
});

// Display detail page for a specific hospital.
exports.hospital_detail = asyncHandler(async (req, res, next) => {
  // Get details of hospital.
  const hospital = await Hospital.findById(req.params.id).exec();

  if (hospital === null) {
    // No results.
    const err = new Error("Hospital not found");
    err.status = 404;
    return next(err);
  }

  res.render("hospital_detail", {
    title: "Hospital Detail",
    hospital: hospital,
  });
});

// Display Hospital create form on GET.
exports.hospital_create_get = (req, res, next) => {
  res.render("hospital_form", { title: "Create Hospital" });
};

// Handle Hospital create on POST.
exports.hospital_create_post = [
  // Validate and sanitize fields.
  body("name", "Hospital name must contain atleast 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("category")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("locality")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Hospital object with escaped and trimmed data
    const hospital = new Hospital({
      name: req.body.name,
      category: req.body.category,
      locality: req.body.locality,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("hospital_form", {
        title: "Create Hospital",
        hospital: hospital,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Save hospital.
      await hospital.save();
      // Redirect to new hospital record.
      res.redirect(hospital.url);
    }
  }),
];

// Display Hospital delete form on GET.
exports.hospital_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of hospital
  const hospital = await Hospital.findById(req.params.id).exec();

  if (hospital === null) {
    // No results.
    res.redirect("/archive/hospitals");
  }

  res.render("hospital_delete", {
    title: "Delete Hospital",
    hospital: hospital,
  });
});

// Handle Hospital delete on POST.
exports.hospital_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of hospital
  const hospital = await Hospital.findById(req.params.id).exec();

  await Hospital.findByIdAndDelete(req.body.hospitalid);
  res.redirect("/archive/hospitals");
});

// Display Hospital update form on GET.
exports.hospital_update_get = asyncHandler(async (req, res, next) => {
  // Get hospitals for update
  const hospital = await Hospital.findById(req.params.id).exec();

  if (hospital === null) {
    // No results.
    const err = new Error("Hospital not found");
    err.status = 404;
    return next(err);
  }

  res.render("hospital_form", {
    title: "Update Hospital",
    hospital: hospital,
  });
});

// Handle Hospital update on POST.
exports.hospital_update_post = [
  // Validate and sanitize fields
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("locality", "Locality must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create hospital with escaped/trimmed data and old id.
    const hospital = new Hospital({
      name: req.body.name,
      category: req.body.category,
      locality: req.body.locality,
      description: req.body.locality,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      res.render("hospital_form", {
        name: "Update Book",
        category: category,
        locality: locality,
        description: description,
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedHospital = await Hospital.findByIdAndUpdate(req.params.id, hospital, {});
      // Redirect to book detail page.
      res.redirect(updatedHospital.url);
    }
  }),
];
