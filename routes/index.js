var express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user");

//Home Route
router.get("/", function (req, res) {
  res.render("landing");
});

//Signup Route
router.get("/register", function (req, res) {
  res.render("register");
});

//Handle Sign up Logic
router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      return res.render("register", { error: err.message });
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Welcome to Yelpcamp " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

//Login form
router.get("/login", function (req, res) {
  res.render("login");
});

//Login Logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

//Logout
router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "Logged out successfully");
  res.redirect("/campgrounds");
});

module.exports = router;
