var express = require("express");
var mysql = require("./dbcon.js");

var app = express();
var handlebars = require("express-handlebars").create({ defaultLayout: "main" });

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("port", 8074);

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS todo", function(err){
    var createString = "CREATE TABLE todo(" +
    "id INT PRIMARY KEY AUTO_INCREMENT," +
    "name VARCHAR(255) NOT NULL," +
    "done BOOLEAN," +
    "due DATE)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('sql',context);
    })
  });
});