var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   =require("passport-local"),
    // Use campground schema from /models/campground.js file 
    Campground      = require("./models/campground"),
    // Use comment schema from /models/comment.js file
    Comment         = require("./models/comment"),
    // Will clear every data and create new data from DB. (error driven code)
    User            =require("./models/user"),
    seedDB          = require("./seeds");



// ============================================================================
// APP CONFIG
// ============================================================================

// use mLab db instead of local mongodb
// mongoose.connect("mongodb://admin:admin123@ds149144.mlab.com:49144/wdbc1_yelp_camp"); 

// use yelp_camp db if exists, if not, it will create yelp_camp db.
mongoose.connect("mongodb://localhost/yelp_camp");
// use body parser
app.use(bodyParser.urlencoded({extended: true}));
// set ejs to render ejs files
app.set("view engine", "ejs");
// use public directory with absolute path
app.use(express.static(__dirname + "/public"));
// remove and create new data from db
seedDB();



// ============================================================================
// PASSPORT CONFIG
// ============================================================================

// tell app to use express-session
app.use(require("express-session")({
  secret: "Once again this is another part of auth",
  resave: false,
  saveUninitialized: false
}));

// tell the app to use passport to initialize session
app.use(passport.initialize());
app.use(passport.session());

// create new local strategy using user.authenticate method during login coming from passport-local-mongoose
passport.use(new localStrategy(User.authenticate()));
// reading session and encoding it and put it back in the session
passport.serializeUser(User.serializeUser());
// reading session and un-encoding it
passport.deserializeUser(User.deserializeUser());

// middleware, pass req.user to each and every route, this will be called to every route
// this will check if there is currentUser login or none
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

// ============================================================================
// CAMPGROUND ROUTES
// ============================================================================

// ROOT ROUTE
app.get("/", function(req, res){
  res.render("landing");
});

// list all campgrounds
app.get("/campgrounds", function(req, res){
  // Get all campgrounds from db
  Campground.find({}, function(err, allCampgrounds){
    if (err) {
      console.log(err);
    } else {
      // display all campgrounds and get currentUser if any
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

// save newly added campground
app.post("/campgrounds", function(req, res){
  // get data from new campground form and add to campgrounds db
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  // make name and image variables as object
  var newCampground = {name: name, image: image, description: desc};
  // and push newCampground to campgrounds array
  // campgrounds.push(newCampground);

  // Create new campground and save to db
  Campground.create(newCampground, function(err, newlyCreated){
    if (err) {
      console.log(err)
    } else {
      // redirect back to campgrounds page which by default will go to /campgrounds app.get ROUTE
      res.redirect("/campgrounds");
    }
  });  
});

// add new campground
app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new");
});

// shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
  // find the campground with the provided ID
  // and populate with comments
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
  // Campground.findById(req.params.id, function(err, foundCampground){  
    if (err) {
      console.log(err);
    } else {
      // console.log(foundCampground);
      // render show template with that campground
      // res.send("THIS WILL BE THE SHOW PAGE SOON!");
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});



// ============================================================================
// COMMENTS ROUTES
// ============================================================================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
  // find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

// handle add comment
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
  // lookup campground using ID
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // create new comment
      Comment.create(req.body.comment, function(err, comment){
        if (err) {
          console.log(err);
        } else {
          // add comment to campground 
          campground.comments.push(comment);
          // save comment to campground
          campground.save();
          // 
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});



// ============================================================================
// AUTH ROUTES
// ============================================================================

// REGISTER ROUTES
// show user register form
app.get("/register", function(req, res){
  res.render("register");
});
// handle user register logic from register form
app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    // no need for else statement because return is used
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  });
});

// LOGIN ROUTES
// show user login form
app.get("/login", function(req, res){
  res.render("login");
});
// handle user login logic from login form
// PATTERN --->  app.post("/login", middleware, callback)
app.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), function(req, res){

});

// LOGOUT ROUTE
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
});

// MIDDLEWARE
// add isLoggedIn middleware 
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    // if authenticated, continue showing pages
    return next();
  }
  // if not authenticated, show login page, 
  res.redirect("/login");
}



// ============================================================================
// START SERVER
// ============================================================================
app.listen(3000, function(){
  console.log("Yelpcamp server has started...");
});