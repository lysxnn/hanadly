const express = require("express");
const router = express.Router();
const conceptmodel = require("../models/Concept.model")

const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("auth/profile", { user: req.session.user });
});

router.get("/create-concept", (req, res) => {
  res.render("auth/conceptform");
});

router.post("/create-concept", isLoggedIn, async (req, res, next) => {
  const { concept, description, contact, email } = req.body;
  const conceptowner = req.session.user._id;
  let createdConcept = {
    concept,
    description,
    contact,
    email,
    conceptowner,
  };
  const conceptFromDB = await conceptmodel.create(createdConcept);
  console.log("conceptfrom DB", conceptFromDB);
  res.redirect("/profile");
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
