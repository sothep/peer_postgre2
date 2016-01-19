var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/example_database';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', function() { client.end(); });

/*
Looks similar to how we might connect using mongoose.  We create a string to represent the URL on port 5432.  Then, we create
a client who will be able to execute sql commands (in this case CREATE TABLE).  Then the client connects to the database, and creates a TABLE
called "items" with three columns.  We connected using psql to see that it did create this table as above.
*/
