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

/*
app.get("/", function(req, res, next){
	var context = {};
	mysql.pool.query("SELECT * FROM workout", function(err, rows, fields){
		if(err){
			console.log(err);
			next(err);
			return;
		}
		context.results = JSON.stringify(rows);
		res.render("sql", context)
	});
});
*/

app.get("/", function(req, res, next){
	var getParams = [];
	var context = {};
	mysql.pool.query("SELECT * FROM workout", function(err, rows, fields){
		if(err){
			console.log(err);
			next(err);
			return;
		}
		for(var i = 0; i < rows.length; i++){
			getParams.push(rows[i]);
		}
		context.dataList = getParams;
		res.render("sql", context)
	});
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
	mysql.pool.query("SELECT * FROM `workout` WHERE `id`=?", [req.query.id], function(err, result){
		if(err){
			next(err);
			return;
		}
		if(result.length == 1){
			mysql.pool.query("DELETE * FROM `workout` WHERE `id`=?", [req.query.id], function(err, result){
				if(err){
					next(err);
					return;
				}
			});
		}
	});
	
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