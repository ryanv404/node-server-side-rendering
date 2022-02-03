require("dotenv").config();

// Modules
const path = require("path");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const flash = require("connect-flash");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const {connectToDB} = require("./config/database");
const passport = require("passport");

// Routers
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const orderRouter = require("./routes/orderRoutes");
const reviewRouter = require("./routes/reviewRoutes");
// const productRouter = require("./routes/productRoutes");
const taskRouter = require("./routes/taskRoutes");

// Initialize express
const express = require("express");
const app = express();

// Trust one reverse proxy for deployment
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    // Limit each IP to a max of 60 requests per 15 minutes
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

// Body parsing middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Directory configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/public", express.static(path.join(__dirname, "public")));

// Redirect POST request to DELETE or PUT with "?_method=DELETE" or "?_method=PUT"
app.use(methodOverride("_method"));

// Config logger for use during development
if (process.env.NODE_ENV === "development") {
  const logger = require("morgan");
  app.use(logger("dev"));
};

// Set security policies
app.use(
  helmet({
    contentSecurityPolicy: require("./config/csp")
  })
);
app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(fileUpload());

// Express session config
app.use(
  session({
    name: "app-SID",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      // 1 day
      maxAge: 86400000
    }
  })
);

// Passport Config
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Flash message handling
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.isLoggedIn = req.user ? true : false;
  next();
});

// Routes
app.use("/", authRouter);
app.use("/users", require("./routes/users.js"));
app.use("/tasks", taskRouter);
app.use("/posts", require("./routes/posts.js"));
app.use("/reviews", reviewRouter);
app.use("/api/v1/users", userRouter);
// app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);

// Error handlers
app.use(require("./middleware/not-found"));
app.use(require("./middleware/error-handler"));

// Start server
const PORT = process.env.PORT || 3000;
const start_server = () => {
  app.listen(PORT, () => console.log(`[server] Listening on port: ${PORT}`));
  connectToDB();
};
start_server();

module.exports = app;
