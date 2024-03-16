#!/usr/bin/env node

console.log(
  'This script populates some patients, patient histories and hospitals to the database. The database is specified as an argument in the terminal - e.g.: node populatedb "mongodb url"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Patient = require("./models/patient");
const PatientHistory = require("./models/patienthistory");
const Hospital = require("./models/hospital");

const patients = [];
const patientHistories = [];
const hospitals = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected");
  await createHospitals();
  await createPatientHistories();
  await createPatients();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// pass index to the ...Create functions so that, for example, hospital[0] will always be KNH, regardless of the order in which the elements of promise.all's argument complete.
async function patientCreate(index, first_name, surname, date_of_birth, history, national_id, chronic) {
  const patientdetail = { first_name: first_name, surname: surname, date_of_birth: date_of_birth, national_id: national_id };
  if (history != false) patientdetail.patient_history = history;
  if (chronic != false) patientdetail.chronic_illness = chronic;

  const patient = new Patient(patientdetail);

  await patient.save();
  patients[index] = patient;
  console.log(`Added patient: ${first_name} ${surname}`);
}

async function patientHistoryCreate(index, attended_at, med_status, med_start, med_end, hospital, diagnosis, medication) {
  const patienthistorydetail = {
    attended_at: attended_at,
    hospital: hospital,
    diagnosis: diagnosis,
    medication: medication,
  };
  if (med_status != false) patienthistorydetail.medication_status = med_status;
  if (med_start != false) patienthistorydetail.medication_start = med_start;
  if (med_end != false) patienthistorydetail.medication_end = med_end;
  
  const patienthistory = new PatientHistory(patienthistorydetail);
  await patienthistory.save();
  patientHistories[index] = patienthistory;
  console.log(`Added patienthistory: ${diagnosis}`);
}

async function hospitalCreate(index, name, category, locality, description) {
  const hospital = new Hospital({
    name: name,
    category: category,
    locality: locality,
    description: description,
  });
  await hospital.save();
  hospitals[index] = hospital;
  console.log(`Aded hospital: ${name}`);
}

async function createHospitals() {
  console.log("Adding Hospitals");
  await Promise.all([
    hospitalCreate(0,
        "Kenyatta National Hospital",
        "Level 6 - National Referral Hospital",
        "Nairobi",
        "Kenyatta National Hospital is the largest hospital in Kenya and the oldest teaching hospital, serving as a national referral and teaching hospital. It offers a wide range of medical services and specializes in various fields including cardiology, oncology, and neurosurgery."
    ),
    hospitalCreate(1,
        "Thika Medical Center",
        "Level 5",
        "Thika",
        "Thika Medical Center is a reputable Level 5 hospital located in the heart of Thika town. With state-of-the-art facilities and highly skilled medical professionals, it provides comprehensive healthcare services to the residents of Thika and its surrounding areas."
    ),
    hospitalCreate(2,
        "Moi Teaching and Referral Hospital",
        "Level 6 - Teaching and Referral Hospital",
        "Eldoret",
        "Moi Teaching and Referral Hospital, located in Eldoret, is one of the leading teaching and referral hospitals in East Africa. It offers specialized medical care, advanced diagnostic services, and conducts groundbreaking medical research, making it a center of excellence in healthcare."
    ),
    hospitalCreate(3,
        "Aga Khan University Hospital",
        "Private Hospital",
        "Nairobi",
        "Aga Khan University Hospital is a world-class private hospital located in Nairobi. Known for its exceptional standards of care, cutting-edge technology, and commitment to patient-centered services, it provides a wide range of medical and surgical specialties to patients across Kenya and beyond."
    ),
    hospitalCreate(4,
        "Coast General Hospital",
        "Level 5",
        "Mombasa",
        "Coast General Hospital, situated in Mombasa, is a prominent Level 5 hospital serving the coastal region of Kenya. With a dedicated team of healthcare professionals and modern medical facilities, it offers comprehensive healthcare services ranging from primary care to specialized treatments."
    ),
    hospitalCreate(5,
        "Nairobi Hospital",
        "Private Hospital",
        "Nairobi",
        "Nairobi Hospital is a leading private hospital in Kenya, renowned for its excellence in medical care and patient satisfaction. With a legacy spanning over six decades, it provides a wide range of medical services, advanced diagnostics, and personalized care to its patients."
    ),
    hospitalCreate(6,
        "Kisumu County Referral Hospital",
        "Level 5",
        "Kisumu",
        "Kisumu County Referral Hospital is a major Level 5 healthcare facility in Kisumu, offering comprehensive medical services to the residents of Kisumu County and beyond. It is equipped with modern amenities and staffed by highly trained medical professionals to ensure quality healthcare delivery."
    ),
    hospitalCreate(7,
        "Machakos Level 5 Hospital",
        "Level 5",
        "Machakos",
        "Machakos Level 5 Hospital is a state-of-the-art healthcare facility located in Machakos town. As a Level 5 hospital, it provides specialized medical care, surgical services, and emergency treatment to the residents of Machakos County, playing a crucial role in the region's healthcare system."
    ),
    hospitalCreate(8,
        "Avenue Healthcare",
        "Private Hospital",
        "Nairobi",
        "Avenue Healthcare is a premier private hospital located in Nairobi, dedicated to providing comprehensive healthcare services in a patient-centric environment. With a focus on innovation and excellence, it offers a wide range of medical specialties and personalized care to meet the diverse needs of its patients."
    ),
    hospitalCreate(9,
        "Embu Level 5 Hospital",
        "Level 5",
        "Embu",
        "Embu Level 5 Hospital is a modern healthcare facility serving the residents of Embu County and its environs. With a commitment to excellence and compassion, it offers a wide range of medical services, including surgery, obstetrics, pediatrics, and internal medicine, to promote the health and well-being of the community."
    ),
    hospitalCreate(10,
        "Karen Hospital",
        "Private Hospital",
        "Nairobi",
        "Karen Hospital is a renowned private hospital located in the serene suburb of Karen in Nairobi. With a focus on holistic healthcare and patient satisfaction, it offers a comprehensive range of medical services, advanced diagnostics, and personalized treatment plans to meet the unique needs of each patient."
    ),
    hospitalCreate(11,
        "Nakuru Level 5 Hospital",
        "Level 5",
        "Nakuru",
        "Nakuru Level 5 Hospital is a leading healthcare facility in Nakuru County, providing quality medical services to the residents of Nakuru and its environs. With modern infrastructure and a skilled team of healthcare professionals, it offers a wide range of healthcare services, including surgery, maternity care, and specialized clinics."
    ),
    hospitalCreate(12,
        "Aga Khan Hospital, Mombasa",
        "Private Hospital",
        "Mombasa",
        "Aga Khan Hospital, Mombasa, is a state-of-the-art private hospital offering world-class healthcare services to the coastal region of Kenya. With a focus on excellence and innovation, it provides a wide range of medical specialties, advanced diagnostics, and personalized care to its patients."
    ),
    hospitalCreate(13,
        "Eldoret Level 5 Hospital",
        "Level 5",
        "Eldoret",
        "Eldoret Level 5 Hospital is a major healthcare facility in Eldoret, equipped with modern amenities and staffed by a team of skilled healthcare professionals. It offers a comprehensive range of medical services, including surgery, internal medicine, pediatrics, and obstetrics, to meet the healthcare needs of the community."
    ),
    hospitalCreate(14,
        "Kisii Teaching and Referral Hospital",
        "Level 6 - Teaching and Referral Hospital",
        "Kisii",
        "Kisii Teaching and Referral Hospital is a premier healthcare institution in the Western region of Kenya, serving as a hub for specialized medical care, research, and training. With state-of-the-art facilities and a multidisciplinary team of experts, it provides high-quality healthcare services to patients from Kisii County and beyond."
    ),
    hospitalCreate(15,
        "Avenue Hospital Parklands",
        "Private Hospital",
        "Nairobi",
        "Avenue Hospital Parklands is a leading private healthcare facility located in the vibrant neighborhood of Parklands in Nairobi. Committed to delivering excellence in patient care, it offers a comprehensive range of medical services, advanced diagnostics, and personalized treatment plans to meet the healthcare needs of its diverse patient population."
    ),
    hospitalCreate(16,
        "Meru Level 5 Hospital",
        "Level 5",
        "Meru",
        "Meru Level 5 Hospital is a flagship healthcare facility in Meru County, providing comprehensive medical services to the residents of Meru and its environs. With modern infrastructure and a skilled workforce, it offers a wide range of healthcare services, including surgery, obstetrics, pediatrics, and internal medicine, to promote health and well-being."
    ),
    hospitalCreate(17,
        "Mombasa Hospital",
        "Private Hospital",
        "Mombasa",
        "Mombasa Hospital is a prestigious private healthcare institution located in the coastal city of Mombasa. With a legacy of excellence spanning decades, it offers a comprehensive range of medical specialties, advanced diagnostics, and personalized care to patients from Mombasa and its surrounding areas."
    ),
    hospitalCreate(18,
        "Kisumu Level 5 Hospital",
        "Level 5",
        "Kisumu",
        "Kisumu Level 5 Hospital is a major healthcare facility in Kisumu County, providing quality medical services to the residents of Kisumu and its environs. With modern infrastructure and a dedicated team of healthcare professionals, it offers a wide range of healthcare services, including surgery, maternity care, and specialized clinics, to promote the health and well-being of the community."
    ),
    hospitalCreate(19,
        "Pandya Memorial Hospital",
        "Private Hospital",
        "Mombasa",
        "Pandya Memorial Hospital is a leading private healthcare institution located in Mombasa, dedicated to providing quality medical services to patients in the coastal region of Kenya. With a commitment to excellence and patient-centered care, it offers a wide range of medical specialties, advanced diagnostics, and personalized treatment plans to meet the healthcare needs of its diverse patient population."
    ),
    hospitalCreate(20,
        "Nyeri Level 5 Hospital",
        "Level 5",
        "Nyeri",
        "Nyeri Level 5 Hospital is a prominent healthcare facility in Nyeri County, offering comprehensive medical services to the residents of Nyeri and its environs. With modern infrastructure and a skilled workforce, it provides a wide range of healthcare services, including surgery, internal medicine, pediatrics, and obstetrics, to promote the health and well-being of the community."
    ),
    hospitalCreate(21,
        "Avenue Hospital Kiambu",
        "Private Hospital",
        "Kiambu",
        "Avenue Hospital Kiambu is a leading private healthcare facility located in Kiambu County, dedicated to providing high-quality medical services in a patient-friendly environment. With a focus on excellence and compassion, it offers a wide range of medical specialties, advanced diagnostics, and personalized care to meet the healthcare needs of its diverse patient population."
    ),
    hospitalCreate(22,
        "Nanyuki Level 5 Hospital",
        "Level 5",
        "Nanyuki",
        "Nanyuki Level 5 Hospital is a key healthcare institution in Laikipia County, offering a wide range of medical services to the residents of Nanyuki and its environs. With modern facilities and a skilled workforce, it provides quality healthcare services, including surgery, internal medicine, pediatrics, and obstetrics, to promote health and well-being."
    ),
    hospitalCreate(23,
        "Bungoma Level 5 Hospital",
        "Level 5",
        "Bungoma",
        "Bungoma Level 5 Hospital is a major healthcare facility in Bungoma County, providing comprehensive medical services to the residents of Bungoma and its environs. With modern infrastructure and a dedicated team of healthcare professionals, it offers a wide range of healthcare services, including surgery, maternity care, and specialized clinics, to meet the healthcare needs of the community."
    ),
    hospitalCreate(24,
        "Embu Level 6 Hospital",
        "Level 6 - Referral Hospital",
        "Embu",
        "Embu Level 6 Hospital is a premier referral hospital in Embu County, serving as a hub for specialized medical care, research, and training. With state-of-the-art facilities and a multidisciplinary team of experts, it provides high-quality healthcare services to patients from Embu County and its neighboring regions."
    ),
    hospitalCreate(25,
        "Kitale Level 5 Hospital",
        "Level 5",
        "Kitale",
        "Kitale Level 5 Hospital is a leading healthcare institution in Trans-Nzoia County, offering comprehensive medical services to the residents of Kitale and its environs. With modern infrastructure and a skilled workforce, it provides quality healthcare services, including surgery, internal medicine, pediatrics, and obstetrics, to promote health and well-being."
    ),
    hospitalCreate(26,
        "PCEA Kikuyu Hospital",
        "Faith-Based Hospital",
        "Kikuyu",
        "PCEA Kikuyu Hospital is a renowned faith-based healthcare institution located in Kikuyu town. With a mission to provide holistic healthcare services guided by Christian values, it offers a wide range of medical specialties, advanced diagnostics, and compassionate care to its patients."
    ),
    hospitalCreate(27,
        "Kakamega Level 5 Hospital",
        "Level 5",
        "Kakamega",
        "Kakamega Level 5 Hospital is a major healthcare facility in Kakamega County, providing comprehensive medical services to the residents of Kakamega and its environs. With modern infrastructure and a skilled workforce, it offers a wide range of healthcare services, including surgery, internal medicine, pediatrics, and obstetrics, to promote health and well-being."
    ),
    hospitalCreate(28,
        "Nairobi West Hospital",
        "Private Hospital",
        "Nairobi",
        "Nairobi West Hospital is a leading private healthcare facility located in the bustling Nairobi West area. With a focus on excellence and patient satisfaction, it offers a comprehensive range of medical services, advanced diagnostics, and personalized care to meet the healthcare needs of its diverse patient population."
    ),
    hospitalCreate(29,
        "Murang'a Level 5 Hospital",
        "Level 5",
        "Murang'a",
        "Murang'a Level 5 Hospital is a key healthcare institution in Murang'a County, providing quality medical services to the residents of Murang'a and its environs. With modern facilities and a dedicated team of healthcare professionals, it offers a wide range of healthcare services, including surgery, internal medicine, pediatrics, and obstetrics, to promote health and well-being."
    ),
    hospitalCreate(30,
        "Bomet Level 5 Hospital",
        "Level 5",
        "Bomet",
        "Bomet Level 5 Hospital is a leading healthcare facility in Bomet County, offering comprehensive medical services to the residents of Bomet and its environs. With modern infrastructure and a skilled workforce, it provides quality healthcare services, including surgery, internal medicine, pediatrics, and obstetrics, to promote health and well-being."
    ),
    hospitalCreate(31,
        "Kericho Level 5 Hospital",
        "Level 5",
        "Kericho",
        "Kericho Level 5 Hospital is a major healthcare facility in Kericho County, providing comprehensive medical services to the residents of Kericho and its environs. With modern infrastructure and a skilled workforce, it offers a wide range of healthcare services, including surgery, internal medicine, pediatrics, and obstetrics, to promote health and well-being."
    ),
    hospitalCreate(32,
        "Machakos Level 6 Hospital",
        "Level 6 - Referral Hospital",
        "Machakos",
        "Machakos Level 6 Hospital is a premier referral hospital in Machakos County, serving as a hub for specialized medical care, research, and training. With state-of-the-art facilities and a multidisciplinary team of experts, it provides high-quality healthcare services to patients from Machakos County and its neighboring regions."
    ),
    hospitalCreate(33,
        "Bondo Level 5 Hospital",
        "Level 5",
        "Bondo",
        "Bondo Level 5 Hospital is a key healthcare institution in Bondo sub-county, providing quality medical services to the residents of Bondo and its environs. With modern facilities, patients are handled with very high level of accuracy in treatment."
    ),
  ]);
}

async function createPatientHistories() {
  console.log("Adding patient histories");
  await Promise.all([
    patientHistoryCreate(0, "2023-08-20", "Under Medication", "2023-08-20", "2023-10-15", hospitals[5], ["Hypertension"], ["Lisinopril", "Amlodipine"]),
    patientHistoryCreate(1, "2023-05-12", "Under Medication", "2023-05-12", "2023-08-30", hospitals[12], ["Type 2 Diabetes"], ["Metformin", "Gliclazide"]),
    patientHistoryCreate(2, "2023-09-28", "Under Medication", "2023-09-28", "2024-01-15", hospitals[18], ["Asthma"], ["Salbutamol", "Fluticasone"]),
    patientHistoryCreate(3, "2023-11-05", "Under Medication", "2023-11-05", "2024-02-20", hospitals[25], ["Rheumatoid Arthritis"], ["Methotrexate", "Prednisone"]),
    patientHistoryCreate(4, "2023-07-10", "Under Medication", "2023-07-10", "2023-10-25", hospitals[8], ["Depression", "Anxiety"], ["Sertraline", "Lorazepam"]),
    patientHistoryCreate(5, "2023-06-15", false, null, null, hospitals[14], ["Migraine"], ["Sumatriptan"]),
    patientHistoryCreate(6, "2023-10-02", "Under Medication", "2023-10-02", "2024-01-10", hospitals[28], ["Chronic Kidney Disease"], ["Furosemide", "Losartan"]),
    patientHistoryCreate(7, "2023-08-18", false, null, null, hospitals[3], ["Asthma"], ["Albuterol"]),
    patientHistoryCreate(8, "2023-11-30", "Under Medication", "2023-11-30", "2024-03-05", hospitals[19], ["Osteoarthritis"], ["Ibuprofen", "Acetaminophen"]),
    patientHistoryCreate(9, "2023-09-10", "Under Medication", "2023-09-10", "2024-01-15", hospitals[22], ["Hyperthyroidism"], ["Propylthiouracil", "Propranolol"]),
    patientHistoryCreate(10, "2023-12-25", false, null, null, hospitals[7], ["Hypertension"], ["Atenolol"]),
    patientHistoryCreate(11, "2023-10-15", false, null, null, hospitals[17], ["Type 1 Diabetes"], ["Insulin"]),
    patientHistoryCreate(12, "2023-07-05", "Under Medication", "2023-07-05", "2023-10-20", hospitals[11], ["Chronic Obstructive Pulmonary Disease"], ["Salmeterol", "Fluticasone"]),
    patientHistoryCreate(13, "2023-05-20", false, null, null, hospitals[29], ["Gastroesophageal Reflux Disease"], ["Omeprazole"]),
    patientHistoryCreate(14, "2023-09-08", "Under Medication", "2023-09-08", "2024-01-05", hospitals[2], ["Epilepsy"], ["Levetiracetam", "Lamotrigine"]),
    patientHistoryCreate(15, "2023-08-30", false, null, null, hospitals[9], ["Chronic Kidney Disease"], ["Vitamin D"]),
    patientHistoryCreate(16, "2023-11-18", "Under Medication", "2023-11-18", "2024-02-25", hospitals[26], ["Hypothyroidism"], ["Levothyroxine"]),
    patientHistoryCreate(17, "2023-10-02", false, null, null, hospitals[21], ["Rheumatoid Arthritis"], ["Hydroxychloroquine"]),
    patientHistoryCreate(18, "2023-07-15", "Under Medication", "2023-07-15", "2023-10-30", hospitals[33], ["Atrial Fibrillation"], ["Warfarin"]),
    patientHistoryCreate(19, "2023-06-20", false, null, null, hospitals[10], ["Migraine"], ["Propranolol"]),
    patientHistoryCreate(20, "2023-09-28", "Under Medication", "2023-09-28", "2024-01-15", hospitals[16], ["Asthma"], ["Budesonide", "Formoterol"]),
    patientHistoryCreate(21, "2023-08-12", false, null, null, hospitals[20], ["Osteoarthritis"], ["Naproxen"]),
    patientHistoryCreate(22, "2023-11-05", "Under Medication", "2023-11-05", "2024-02-20", hospitals[24], ["Major Depressive Disorder"], ["Escitalopram"]),
    patientHistoryCreate(23, "2023-07-10", false, null, null, hospitals[6], ["Chronic Obstructive Pulmonary Disease"], ["Tiotropium"]),
    patientHistoryCreate(24, "2023-06-15", "Under Medication", "2023-06-15", "2023-09-30", hospitals[27], ["Gastroesophageal Reflux Disease"], ["Ranitidine"]),
    patientHistoryCreate(25, "2023-10-02", false, null, null, hospitals[31], ["Type 2 Diabetes"], ["Sitagliptin", "Metformin"]),
    patientHistoryCreate(26, "2023-08-18", "Under Medication", "2023-08-18", "2023-12-25", hospitals[30], ["Atrial Fibrillation"], ["Dabigatran"]),
    patientHistoryCreate(27, "2023-11-30", false, null, null, hospitals[15], ["Hypothyroidism"], ["Liothyronine"]),
    patientHistoryCreate(28, "2023-09-10", "Under Medication", "2023-09-10", "2024-01-15", hospitals[23], ["Epilepsy"], ["Phenytoin", "Valproic Acid"]),
    patientHistoryCreate(29, "2023-12-25", false, null, null, hospitals[13], ["Hypertension"], ["Losartan"]),
    patientHistoryCreate(30, "2023-10-15", "Under Medication", "2023-10-15", "2024-02-01", hospitals[32], ["Type 1 Diabetes"], ["Glargine", "Lispro"]),
    patientHistoryCreate(31, "2023-07-05", false, null, null, hospitals[1], ["Chronic Kidney Disease"], ["Furosemide"]),
    patientHistoryCreate(32, "2023-05-20", "Under Medication", "2023-05-20", "2023-09-01", hospitals[4], ["Asthma"], ["Montelukast", "Fluticasone"]),
  ]);
}

async function createPatients() {
  console.log("Adding patients");
  await Promise.all([
    patientCreate(0, "John", "Doe", "1973-06-06", [patientHistories[17], patientHistories[27]], 00012345, "epilepsy"),
    patientCreate(1, "Asenath", "Mbuvi", "1999-12-01", false, 01012345, false),
    patientCreate(2, "Emily", "Smith", "1985-09-15", false, 02012345, "asthma"),
    patientCreate(3, "David", "Johnson", "1978-03-24", patientHistories[7], 03012345, false),
    patientCreate(4, "Sophia", "Brown", "1992-11-05", false, 04012345, "diabetes"),
    patientCreate(5, "Michael", "Lee", "1982-07-17", false, 05012345, false),
    patientCreate(6, "Emma", "Jones", "1975-02-28", patientHistories[0], 06012345, "hypertension"),
    patientCreate(7, "Ethan", "Garcia", "1989-10-10", false, 07012345, false),
    patientCreate(8, "Olivia", "Martinez", "1965-08-03", false, 08012345, "arthritis"),
    patientCreate(9, "Aiden", "Lopez", "1970-04-12", false, 09012345, false),
    patientCreate(10, "Isabella", "Hernandez", "1996-06-22", false, 10012345, "migraine"),
    patientCreate(11, "Noah", "Miller", "1987-12-30", [patientHistories[25], patientHistories[4], patientHistories[11]], 11012345, false),
    patientCreate(12, "Mia", "Jackson", "1980-05-19", false, 12012345, "asthma"),
    patientCreate(13, "James", "Gonzalez", "1968-09-08", false, 13012345, false),
    patientCreate(14, "Charlotte", "Wilson", "1977-03-11", false, 14012345, "diabetes"),
    patientCreate(15, "Benjamin", "Taylor", "1990-07-25", false, 15012345, false),
    patientCreate(16, "Amelia", "White", "1956-11-14", patientHistories[19], 16012345, "hypertension"),
    patientCreate(17, "Lucas", "Martin", "1983-01-02", false, 17012345, false),
    patientCreate(18, "Harper", "Rodriguez", "1972-08-27", false, 18012345, "arthritis"),
    patientCreate(19, "Mason", "Lopez", "1986-04-05", patientHistories[13], 19012345, false),
    patientCreate(20, "Evelyn", "Perez", "1993-06-09", false, 20012345, "migraine"),
    patientCreate(21, "Elijah", "Gomez", "1979-12-18", false, 21012345, false),
    patientCreate(22, "Abigail", "Flores", "1988-05-31", patientHistories[3], 22012345, "asthma"),
    patientCreate(23, "Alexander", "Hill", "1967-09-21", false, 23012345, false),
    patientCreate(24, "Elizabeth", "Scott", "1974-02-10", false, 24012345, "diabetes"),
    patientCreate(25, "Daniel", "Young", "1981-07-03", false, 25012345, false),
    patientCreate(26, "Sofia", "King", "1960-11-24", false, 26012345, "hypertension"),
    patientCreate(27, "Matthew", "Adams", "1976-01-15", false, 27012345, false),
    patientCreate(28, "Chloe", "Rivera", "1971-08-28", false, 28012345, "arthritis"),
    patientCreate(29, "Lucas", "Diaz", "1984-04-14", patientHistories[30], 29012345, false),
    patientCreate(30, "Madison", "Evans", "1995-06-27", false, 30012345, "migraine"),
    patientCreate(31, "Avery", "Perez", "1985-12-19", false, 31012345, false),
    patientCreate(32, "Jackson", "Campbell", "1963-09-02", false, 32012345, "asthma"),
    patientCreate(33, "Liam", "Torres", "1973-03-25", [patientHistories[15], patientHistories[20]], 33012345, false),
    patientCreate(34, "Aria", "Parker", "1978-11-11", false, 34012345, "diabetes"),
    patientCreate(35, "Jacob", "Stewart", "1989-07-20", [patientHistories[26], patientHistories[8]], 35012345, false),
    patientCreate(36, "Grace", "Sanchez", "1975-02-14", false, 36012345, "hypertension"),
    patientCreate(37, "Ella", "Mitchell", "1991-10-08", false, 37012345, false),
    patientCreate(38, "Logan", "Hill", "1969-04-22", false, 38012345, "arthritis"),
    patientCreate(39, "Riley", "Nguyen", "1982-06-03", false, 39012345, false),
    patientCreate(40, "Scarlett", "Gonzalez", "1966-06-17", false, 40012345, "migraine"),
    patientCreate(41, "Gabriel", "Carter", "1980-12-30", false, 41012345, false),
    patientCreate(42, "Zoey", "Edwards", "1997-05-19", patientHistories[1], 42012345, "asthma"),
    patientCreate(43, "Nathan", "Gutierrez", "1976-09-11", false, 43012345, false),
    patientCreate(44, "Addison", "Hill", "1983-03-04", false, 44012345, "diabetes"),
    patientCreate(45, "Lily", "Ross", "1962-07-25", false, 45012345, false),
    patientCreate(46, "Wyatt", "Ward", "1978-01-16", patientHistories[10], 46012345, "hypertension"),
    patientCreate(47, "Zoe", "Washington", "1984-12-18", false, 47012345, false),
    patientCreate(48, "Henry", "Price", "1970-08-27", false, 48012345, "arthritis"),
    patientCreate(49, "Leah", "Butler", "1986-04-07", patientHistories[21], 49012345, false),
    patientCreate(50, "Luke", "Barnes", "1977-06-21", false, 50012345, "migraine"),
    patientCreate(51, "Hannah", "Fisher", "1965-10-10", false, 51012345, false),
    patientCreate(52, "Oliver", "Ramirez", "1979-05-29", patientHistories[23], 52012345, "asthma"),
    patientCreate(53, "Lillian", "Reed", "1992-09-08", false, 53012345, false),
    patientCreate(54, "Gabriel", "Harris", "1988-03-17", false, 54012345, "diabetes"),
    patientCreate(55, "Carter", "Bailey", "1964-07-03", false, 55012345, false),
    patientCreate(56, "Skylar", "Russell", "1971-01-24", patientHistories[5], 56012345, "hypertension"),
    patientCreate(57, "Nora", "Coleman", "1987-11-08", false, 57012345, false),
    patientCreate(58, "Christian", "Bryant", "1973-04-22", false, 58012345, "arthritis"),
    patientCreate(59, "Paisley", "Nguyen", "1980-06-03", false, 59012345, false),
    patientCreate(60, "Lincoln", "Thompson", "1966-06-17", false, 60012345, "migraine"),
    patientCreate(61, "Samantha", "Scott", "1978-12-30", false, 61012345, false),
    patientCreate(62, "Hunter", "Ward", "1996-05-19", false, 62012345, "asthma"),
    patientCreate(63, "Hazel", "Gutierrez", "1977-09-11", false, 63012345, false),
    patientCreate(64, "Penelope", "Hill", "1983-03-04", false, 64012345, "diabetes"),
    patientCreate(65, "Leo", "Ross", "1962-07-25", false, 65012345, false),
    patientCreate(66, "Violet", "Ward", "1978-01-16", false, 66012345, "hypertension"),
    patientCreate(67, "Sawyer", "Washington", "1984-12-18", false, 67012345, false),
    patientCreate(68, "Bella", "Price", "1970-08-27", false, 68012345, "arthritis"),
    patientCreate(69, "Cole", "Butler", "1986-04-07", patientHistories[12], 69012345, false),
    patientCreate(70, "Clara", "Barnes", "1977-06-21", false, 70012345, "migraine"),
    patientCreate(71, "Ellie", "Fisher", "1965-10-10", false, 71012345, false),
    patientCreate(72, "Xavier", "Ramirez", "1979-05-29", [patientHistories[22], patientHistories[14]], 72012345, "asthma"),
    patientCreate(73, "Mila", "Reed", "1992-09-08", false, 73012345, false),
    patientCreate(74, "Silas", "Harris", "1988-03-17", false, 74012345, "diabetes"),
    patientCreate(75, "Luna", "Bailey", "1964-07-03", false, 75012345, false),
    patientCreate(76, "Eli", "Russell", "1971-01-24", [patientHistories[16], patientHistories[24], patientHistories[32]], 76012345, "hypertension"),
    patientCreate(77, "Aurora", "Coleman", "1987-11-08", false, 77012345, false),
    patientCreate(78, "Owen", "Bryant", "1973-04-22", false, 78012345, "arthritis"),
    patientCreate(79, "Levi", "Nguyen", "1980-06-03", false, 79012345, false),
    patientCreate(80, "Nathan", "Thompson", "1966-06-17", false, 80012345, "migraine"),
    patientCreate(81, "Sarah", "Scott", "1978-12-30", false, 81012345, false),
    patientCreate(82, "Julian", "Ward", "1996-05-19", false, 82012345, "asthma"),
    patientCreate(83, "Amara", "Gutierrez", "1977-09-11", false, 83012345, false),
    patientCreate(84, "Aaron", "Hill", "1983-03-04", false, 84012345, "diabetes"),
    patientCreate(85, "Ivy", "Ross", "1962-07-25", false, 85012345, false),
    patientCreate(86, "Ezra", "Ward", "1978-01-16", false, 86012345, "hypertension"),
    patientCreate(87, "Alice", "Washington", "1984-12-18", false, 87012345, false),
    patientCreate(88, "Wyatt", "Price", "1970-08-27", false, 88012345, "arthritis"),
    patientCreate(89, "Elena", "Butler", "1986-04-07", false, 89012345, false),
    patientCreate(90, "Eliana", "Barnes", "1977-06-21", false, 90012345, "migraine"),
    patientCreate(91, "Tristan", "Fisher", "1965-10-10", false, 91012345, false),
    patientCreate(92, "Adrian", "Ramirez", "1979-05-29", [patientHistories[6], patientHistories[28], patientHistories[29]], 92012345, "asthma"),
    patientCreate(93, "Ariana", "Reed", "1992-09-08", false, 93012345, false),
    patientCreate(94, "Ezekiel", "Harris", "1988-03-17", false, 94012345, "diabetes"),
    patientCreate(95, "Julia", "Bailey", "1964-07-03", false, 95012345, false),
    patientCreate(96, "Xander", "Russell", "1971-01-24", false, 96012345, "hypertension"),
    patientCreate(97, "Sienna", "Coleman", "1987-11-08", false, 97012345, false),
    patientCreate(98, "Gavin", "Bryant", "1973-04-22", false, 98012345, "arthritis"),
    patientCreate(99, "Caleb", "Nguyen", "1980-06-03", [patientHistories[2], patientHistories[18], patientHistories[31], patientHistories[9]], 99012345, false),
  ]);
}
