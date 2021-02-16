var express = require("express"),
  router = express.Router(),
  middleware = require("../middleware"),
  Campground = require("../models/campground");

//Index Route
router.get("/", function (req, res) {
  //Get all campgrounds from the database
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
});

//Create Route
router.post("/", middleware.isLoggedIn, function (req, res) {
  var name = req.body.name,
    price = req.body.price,
    image = req.body.image,
    desc = req.body.description,
    author = {
      id: req.user._id,
      username: req.user.username,
    },
    newCampground = {
      name: name,
      price: price,
      image: image,
      description: desc,
      author: author,
    };

  //Create a new campground and save to the Database
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //redirect back to the campground page
      res.redirect("/campgrounds");
    }
  });
});

//New - show to create new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

//SHOW more info
router.get("/:id", function (req, res) {
  //find the campground with provided id
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        if (!foundCampground) {
          return res.status(400).send("Item not found.");
        }
        // render show the template with that campground
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

//Edit Campground Route Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (
  req,
  res
) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (!foundCampground) {
      return res.status(400).send("Item not found.");
    }
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

//Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  //Find and update Campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (
    err,
    updatedCampground
  ) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      //redirect somewhere(show)
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//Destroy campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
