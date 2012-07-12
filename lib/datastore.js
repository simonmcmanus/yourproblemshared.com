var sql = require('./mysql_base.js');
var encoder = require('./encoder.js');



exports.saveEmail = function(params, callback) {
// this all needs encoding.
	var q = 'INSERT INTO email VALUES (null, "'+escape(params.to)+'",  "'+escape(params.from)+'", "'+escape(params.cc)+'", "'+params.subject+'", "", "'+params.date+'", "'+params.body+'")';
	sql.query(q, params, callback);
};


exports.getEmail = function(params, callback) {
	var q = 'select * from email where id="'+params.id+'"';
	sql.query(q, params, callback);
};

exports.company = function(params, callback) {
	var company = params.company;
	var q = 'select * from email where email.to="'+company+'"';
	sql.query(q, params, callback);
};