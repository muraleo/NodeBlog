var express     = require("express"),
	app         = express(),
	bodyParser  = require("body-parser"),
	mongoose    = require("mongoose"),
	methodOverride = require("method-override");


mongoose.connect("mongodb://localhost/node_blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
})
var Blog = mongoose.model("Blog", blogSchema);

//REST ROUTES
app.get("/", function(req, res){
	res.redirect("/blogs");
})

//index route
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, results){
		if(err){
			console.log(err);
		} else {
			res.render("blogs", {blogs:results});
		}
	});
});

// new route
app.get("/blogs/new", function(req, res){
	res.render("new");
})

// create route
app.post("/blogs", function(req, res){
	Blog.create(req.body.blog, function(err, results){
		if(err){
			console.log(err);
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	})
})

// show route
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, results){
		if(err){
			console.log(err);
		} else {
			res.render("show", {blogs: results});
		}
	})
})

// edit route
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, results){
		if(err){
			console.log(err);
		} else {
			res.render("edit", {blogs: results})
		}
	})
})

// put route
app.put("/blogs/:id", function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/"+req.params.id);
		}
	})
})

// delete route
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err, result){
		if(err){
			console.log(err);
		} else {
			res.redirect("/blogs");
		}
	})
})

app.listen(3000, function(){
	console.log("Blog starts servering");
})