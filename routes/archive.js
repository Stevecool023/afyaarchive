const express = require("express");
const router = express.Router();

// Require controller modules.
const patient_controller = require("../controllers/patientController");
const hospital_controller = require("../controllers/hospitalController");
const patient_history_controller = require("../controllers/patienthistoryController");

/// HOSPITAL ROUTES ///

// GET archive home page.
router.get("/", hospital_controller.index);

// GET request for creating a Hospital. This must come before routes that display Hospital (uses id).
router.get("/hospital/create", hospital_controller.hospital_create_get);

// POST request for creating Hospital.
router.post("/hospital/create", hospital_controller.hospital_create_post);

// GET request to delete Hospital.
router.get("/hospital/:id/delete", hospital_controller.hospital_delete_get);

// POST request for deleting Hospital.
router.post("/hospital/:id/delete", hospital_controller.hospital_delete_post);

// GET request to update Hospital.
router.get("/hospital/:id/update", hospital_controller.hospital_update_get);

// POST request to update Hospital.
router.post("/hospital/:id/update", hospital_controller.hospital_update_post);

// GET request for one Hospital.
router.get("/hospital/:id", hospital_controller.hospital_detail);

// GET request for list of all Hospitals.
router.get("/hospitals", hospital_controller.hospital_list);

/// PATIENT ROUTES ///

// GET request for creating patient. Must come before routes for id (i.d routes that display patient).
router.get("/patient/create", patient_controller.patient_create_get);

// POST request for creating patient.
router.post("/patient/create", patient_controller.patient_create_post);

// GET request to update patient.
router.get("/patient/:id/update", patient_controller.patient_update_get);

// POST request to update patient.
router.post("/patient/:id/update", patient_controller.patient_update_post);

// GET request for confirming patient id.
router.get("/patient/validate", patient_controller.patient_id_get);

// POST request for confirming patient id.
router.post("/patient/validate", patient_controller.patient_id_post);

// GET request for viewing a specific patient.
router.get("/patient/:id", patient_controller.patient_detail);

/// PATIENT HISTORY ROUTES ///

// GET request for creating patient history. This must come before routes that displays patient history (uses id).
router.get("/patienthistory/create", patient_history_controller.patienthistory_create_get);

// POST request for creating patient history.
router.post("/patienthistory/create", patient_history_controller.patienthistory_create_post);

// GET request to view specific patient's history.
router.get("/patienthistory/:id", patient_history_controller.patienthistory_detail);

// GET request to update patient's history.
router.get("/patienthistory/:id/update", patient_history_controller.patienthistory_update_get);

// POST request to update patient's history.
router.post("/patienthistory/:id/update", patient_history_controller.patienthistory_update_post);
