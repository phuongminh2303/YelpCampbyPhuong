var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");

//root route
router.get("/", function (req, res) {
    res.render("landing");
});

// show register form
router.get("/register", function (req, res) {
    res.render("register", { page: "register" });
});

//handle sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    // eval(require("locus"));
    // eval(require('@huangchaowh/locus'))
    if (req.body.adminCode === "abc12345") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            // req.flash("error", err.message);
            console.log(err);
            return res.render("register", { error: err.message });
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp, " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function (req, res) {
    res.render("login", { page: "login" });
});

//handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function (req, res) {
    });

// logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Log out successfully!");
    res.redirect("/campgrounds");
});

// USER Profile
router.get("/users/:id", function (req, res) {
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            res.flash("error", "Something went wrong");
            return res.redirect("/");
        }
        Campground.find().where("author.id").equals(foundUser._id).exec(function (err, campgrounds) {
            if (err) {
                res.flash("error", "Something went wrong");
                return res.redirect("/");
            }
            res.render("users/show", { user: foundUser, campgrounds: campgrounds });
        });
    });
});

module.exports = router;