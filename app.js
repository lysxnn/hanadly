// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalized = require("./utils/capitalized");
const projectName = "hanadly";

app.locals.appTitle = `${capitalized(projectName)} created with IronLauncher`;

const router = require("./routes/auth.routes");
app.use("/", router);

//Once the packages are installed, we have to require them
const session = require("express-session");
const MongoStore = require("connect-mongo");

const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//configure the session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false, // <== false if you don't want to save empty session object to the store
    cookie: {
      sameSite: "none",
      httpOnly: true,
      maxAge: 60000, // 60 * 1000 ms === 1 min
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/db-name",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());



// 👇 Start handling routes here
require("./config/session.config")(app);
/* const index = require("./routes/index.routes");
app.use("/", index); */

app.use("/", require("./routes/index.routes"));
app.use(require("./routes/auth.routes"));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
