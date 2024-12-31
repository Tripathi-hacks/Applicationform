// require("dotenv").config(); // Load environment variables from .env file
// // Check if the MONGODB_URI is loaded correctly
// console.log('MongoDB URI:', process.env.MONGODB_URI); // Log the URI to the console

// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const path = require("path");
 

// const app = express();

// const PORT = process.env.PORT || 3000;
// const MONGO_URI = process.env.MONGO_URI;
 
// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // Serve static files (for uploaded resumes)
// app.use(express.static(path.join(__dirname, "public")));

// // Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Ensure the upload directory is correctly resolved
//     cb(null, path.join(__dirname, "uploads"));
//   },
//   filename: function (req, file, cb) {
//     // Generate a unique filename with the original file extension
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage });

// // Connect to MongoDB using an environment variable for the connection string
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Define Schema and Model for the database
// const studentSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//   },
//   phone: { type: String, required: true, match: /^\d{10}$/ },
//   education: { type: String, required: true },
//   skills: { type: String, required: true },
//   resume: { type: String, required: true }, // Store the file path
// });

// const Student = mongoose.model("students", studentSchema); // Collection: 

// // Routes
// app.get("/", (req, res) => {
//   // Serve the form.html file from the public folder
//   res.sendFile(path.join(__dirname, "public", "form.html"));
// });

// app.post("/submit_registration", upload.single("resume"), async (req, res) => {
//   try {
//     const { name, email, phone, education, skills } = req.body;
//     const resume = req.file ? req.file.path : null; // Get the file path from multer

//     // Server-side validation
//     if (!name || name.trim() === "") {
//       return res.status(400).send("Name is required.");
//     }
//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       return res.status(400).send("Invalid email address.");
//     }
//     if (!phone || !/^\d{10}$/.test(phone)) {
//       return res.status(400).send("Phone number must be 10 digits.");
//     }
//     if (!education || education.trim() === "") {
//       return res.status(400).send("Education is required.");
//     }
//     if (!skills || skills.trim() === "") {
//       return res.status(400).send("Skills are required.");
//     }
//     if (!resume) {
//       return res.status(400).send("Resume is required.");
//     }

//     // Save to database
//     const newStudent = new Student({
//       name,
//       email,
//       phone,
//       education,
//       skills,
//       resume,
//     });

//     await newStudent.save();
//     res.status(200).send("Registration successful!");
//   } catch (err) {
//     if (err.code === 11000) {
//       res.status(400).send("Email already exists.");
//     } else {
//       console.error(err);
//       res.status(500).send("Internal Server Error.");
//     }
//   }
// });
 


// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });


require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Validate MONGO_URI
if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not set in the .env file.");
  process.exit(1); // Exit if MONGO_URI is missing
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads")); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Schema and Model for the database
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: { type: String, required: true, match: /^\d{10}$/ },
  education: { type: String, required: true },
  skills: { type: String, required: true },
  resume: { type: String, required: true }, // Store the file path
});

// Use "clientsdata" as the collection name
const Student = mongoose.model("clientsdata", studentSchema);

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "FORM.html"));
});

app.post("/submit_registration", upload.single("resume"), async (req, res) => {
  try {
    const { name, email, phone, education, skills } = req.body;
    const resume = req.file ? req.file.path : null;

    // Validation
    if (!name || name.trim() === "") return res.status(400).send("Name is required.");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).send("Invalid email address.");
    if (!phone || !/^\d{10}$/.test(phone)) return res.status(400).send("Phone number must be 10 digits.");
    if (!education || education.trim() === "") return res.status(400).send("Education is required.");
    if (!skills || skills.trim() === "") return res.status(400).send("Skills are required.");
    if (!resume) return res.status(400).send("Resume is required.");

    // Save to database
    const newStudent = new Student({
      name,
      email,
      phone,
      education,
      skills,
      resume,
    });

    await newStudent.save();
    res.status(200).send("Registration successful!");
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).send("Email already exists.");
    } else {
      console.error(err);
      res.status(500).send("Internal Server Error.");
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
