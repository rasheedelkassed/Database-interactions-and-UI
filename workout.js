var express = require("express");
var mysql = require("./dbcon.js");
var bodyParser = require('body-parser');
var path = require("path");
var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
var handlebars = require("express-handlebars").create({ defaultLayout: "main" });

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("port", 8074);

app.use(express.static(path.join(__dirname + "/public")));

function returnTable(req, res, next){
	mysql.pool.query("SELECT * FROM workout", function(err, rows, fields){
		if(err){
			console.log(err);
			next(err);
			return;
		}
		res.type("application/json")
		res.send(rows);
	});
}

app.get("/", function(req, res, next){
	var context = {};
	res.render("sql", context)
});

app.get("/start-up", function(req, res, next){
	var context = {};
	mysql.pool.query("SELECT * FROM workout", function(err, rows, fields){
		if(err){
			console.log(err);
			next(err);
			return;
		}
	});
	returnTable(req, res, next);
});

app.get("/reset-table",function(req, res, next){
	var context = {};
	mysql.pool.query("DROP TABLE IF EXISTS workout", function(err){
		var createString = "CREATE TABLE workout(" +
		"id INT PRIMARY KEY AUTO_INCREMENT," +
		"name VARCHAR(255) NOT NULL," +
		"reps INT," +
		"weight INT," +
		"date DATE," +
		"unit VARCHAR(255))";
		mysql.pool.query(createString, function(err){
			context.results = "Table reset";
			res.render("sql",context);
		})
  });
});

app.post("/delete-row", function(req, res, next) {
	mysql.pool.query("DELETE FROM `workout` WHERE `id`= ?", [req.body.id], function(err, result){
		if(err){
			next(err);
			return;
		}
	});
	returnTable(req, res, next);
});

app.post("/input-row", function(req, res, next) {
	mysql.pool.query("INSERT INTO `workout` (`name`, `reps`, `weight`, `date`, `unit`) VALUES (?,?,?,?,?)", [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.unit], function(err, result){
		if(err){
			next(err);
			return;
		}
	});
	returnTable(req, res, next);
});

app.post("/get-data", function(req, res, next) {
	mysql.pool.query("SELECT * FROM `workout` WHERE `id`= ?", [req.body.id], function(err, result){
		if(err){
			next(err);
			return;
		}
	});
	returnTable(req, res, next);
});


app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});