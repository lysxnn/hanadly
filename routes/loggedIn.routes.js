const express = require("express");
const router = express.Router();
const eventmodel = require("../models/Event.model");

const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/profile", isLoggedIn, (req, res) => {
  console.log("this is the user", req.session.user);
  res.render("auth/profile", { user: req.session.user });
});

//TODO: isLoggedIn noch einfügen
router.get("/create-event", (req, res) => {
  res.render("auth/eventform", { user: req.session.user });
});

/* POST create-event page */
router.post("/create-event", isLoggedIn, async (req, res, next) => {
  const { eventname, date, eventtype, description, contact, email } = req.body;
  const eventowner = req.session.user._id;
  let createdEvent = {
    eventname,
    date,
    eventtype,
    description,
    contact,
    email,
    eventowner,
  };
  const eventFromDB = await eventmodel.create(createdEvent);
  console.log("eventfrom DB", eventFromDB);
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
