const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

//security
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

// fileUpload
const fileupload = require("express-fileupload");

const PORT = process.env.PORT || 4000;

// Load env vars
dotenv.config({ path: "./config/.env" });

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Connect to database
connectDB();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

//"_____________________________________________________SECURITY_____________________________"//
// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

//Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 1000,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

//"___________________________________________END___SECURITY_____________________________"//

// load Routers
const Users = require("./routes/user");
const Auth = require("./routes/auth");
const Requests = require("./routes/requests");
const Mazads = require("./routes/mazad");
const statist = require("./routes/statist");
const uploadRoutes = require("./routes/uploadPhoto");

//mount routes
app.use("/api/v1/users", Users);
app.use("/api/v1/auth", Auth);
app.use("/api/v1/mazads", Mazads);
app.use("/api/v1/requests", Requests);
app.use("/api/v1/statist", statist);

// file upload
app.use(fileupload());
//image upload image
app.use("/api/v1/upload", uploadRoutes);
app.use(express.static("./public"));

// errorHandler
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
