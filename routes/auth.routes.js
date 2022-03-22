const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Require pw encription + number of rounds running the salt
const bcrypt = require("bcrypt");
const saltRounds = 12;

// Require User model for DB
const User = require("../models/User.model");

// Require middleware
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET signup page */
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

/* GET signup-success page */
router.get("/signup-success", isLoggedOut, (req, res) => {
  res.render("auth/signup-success");
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("auth/profile");
});

/* _________POST ROUTES_________ */

/* POST signup page */
router.post("/signup", isLoggedOut, (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;

  // make sure users fill all mandatory fields:
  if (!username || !email || !password || !firstname || !lastname) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email,firstname, lastname and password.",
    });
    return;
  }

  if (!username) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please provide an existing username",
    });
  }
  //Checks if the length is smaller than 8 chars and returns an errorMessage if it's not equal or higher than 8 chars
  /*   if (password.length < 8) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  } */
  //Password = Minimum eight characters, at least one letter and one number:
  /*   const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!regex.test(password)) {
    return res.status(400).render("/signup", {
      errorMessage:
        "Your password needs to have a minimum of eight characters and at least one letter and one number.",
    });
  } */
  //Search if Username already exists. If this is the case, return errorMessage
  User.findOne({ username }).then((found) => {
    if (found) {
      //Why using '.' when rendering over the signup? 'Rico, line 55
      return res.status(400).render("auth/signup", {
        errorMessage:
          "The username is already taken. Please choose another one.",
      });
    }
  });
  //If the User doesn't exist in our DB => create new User and save it in our DB
  //also => encrypt user password
  return (
    bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({
          username,
          firstname,
          lastname,
          email,
          password: hashedPassword,
        });
      })
      // Bind the user to the session object
      .then((user) => {
        req.session.user = user;
        console.log(req.session);
        return user;
      })
      //Render signup-success page after creating an account- might be wrong?
      /*       .then(() => {
        return res.render("auth/signup-success");
      }) */
      .then(() => {
        res.redirect("/profile");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        }
        //Why do we compare the Errorcode and define an errorMessage, saying that the useer already exists,
        //when we have already defined that in line 53 - 57?
        if (error.code === 11000) {
          return res.status(400).render("auth/signup", {
            errorMessage:
              "Username need to be unique. The username you chose is already in use.",
          });
        }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message });
      })
  );
});

/* GET login page */
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

/* POST login page */
router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;
  console.log("SESSION =====> ", req.session);
  if (!email) {
    return res.status(400).render("auth/login", {
      errorMessage: "Please provide your email.",
    });
  }

  if (password.length < 8) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }
  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ email }).then((user) => {
    // If the user isn't found, send the errorMessage
    if (!user) {
      res.render("auth/login", {
        errorMessage: "This Email is not registered. Please try another one.",
      });
      return;
    } else if (bcryptjs.compareSync(password, user.password)) {
      res.render("users/user-profile", { user });
    } else {
      res.render("auth/login", { errorMessage: "Incorrect password." });
    }
  });
  //If username is saved in our DB =>
  //Checks if the in putted password matches the one saved in users id
  bcrypt
    .compare(password, user.password)
    .then((isSamePassword) => {
      if (!isSamePassword) {
        return res.status(400).render("auth/login", {
          errorMessage: "Wrong credentials.",
        });
      }
      req.session.user = user._id;
      return res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});

module.exports = router;
