const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/events", (req, res) => {
  res.render("events");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

router.get("/concepts", (req, res) => {
  res.render("concepts");
});

module.exports = router;
