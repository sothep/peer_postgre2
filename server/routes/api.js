var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/example_database';

router.post('/todos', function(req, res) { //This was triggered by curl in Step 6 of the assignment instructions.
    var results = [];

    // Grab data from http request
    var data = {text: req.body.text, complete: false}; //Actually, this ignores the request from curl; it takes the text that we give it,
                                                        //but it sets complete to false every time, even if we curl with complete:true.

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) { //"done" is new, haven't used that one before...so is "client"...

        // SQL Query > Insert Data
        client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);
          //looks like $1 and $2 choose the first and second fields of the table, to add our data.

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC"); //fetch everything from the items table, and arrange it in ascending order.

        // Stream results back one row at a time
        query.on('row', function(row) { //similar syntax to jQuery event handlers, with the .on() method
            results.push(row); //adds a row to results for displaying later
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results); //outputs the completed results to json
        });

        // Handle Errors
        if(err) {
            console.log(err);
        }

    });
});

router.get('/todos', function(req, res) {
    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
            console.log(err);
        }

    });

});

router.put('/todos/:todo_id', function(req, res) { //similar to the above, but updates existing record and selects all again, to refresh page

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.todo_id;

    // Grab data from http request
    var data = {text: req.body.text, complete: req.body.complete};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Update Data
        client.query("UPDATE items SET text=($1), complete=($2) WHERE id=($3)", [data.text, data.complete, id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
            console.log(err);
        }

    });

});

router.delete('/todos/:todo_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.todo_id;


    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Delete Data
        client.query("DELETE FROM items WHERE id=($1)", [id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
            console.log(err);
        }

    });

});


module.exports = router;
