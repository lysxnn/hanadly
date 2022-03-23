module.exports = (req, res, next) => {
  if (req.session.user) {
    console.log("redirecting to home from isLoggedOut RG", req.session.user);
    res.redirect("/");
    return;
  }
  console.log("past routeguard");
  next();
};
