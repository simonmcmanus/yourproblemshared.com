var sql = require('./mysql_base.js');



exports.saveEmail = function(params, callback) {
	var q = 'INSERT INTO email VALUES (null, "'+params.to+'", "'+params.cc+'", "'+params.subject+'", "", "'+params.date+'", "'+params.body+'")';
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