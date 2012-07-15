var sql = require('./mysql_base.js');
var encoder = require('./encoder.js');



exports.saveEmail = function(params, callback) {
	var q = 'INSERT INTO email VALUES (null, "'+escape(params.to)+'",  "'+escape(params.from)+'", "'+escape(params.cc)+'", "'+params.subject+'", "", "'+params.date+'", "'+params.htmlBody+'", "'+escape(params.textBody)+'")';
	sql.query(q, params, callback);
};


exports.getEmail = function(params, callback) {
	var q = 'select * from email where id="'+params.id+'"';
	sql.query(q, params, callback);
};

exports.company = function(params, callback) {
	var q = 'select * from email where email.to LIKE "%'+params.term+'%"';
	sql.query(q, params, callback);
};

exports.browse = function(params, callback) {
	var q = 'select * from email order by id desc limit 10';
	sql.query(q, params, callback);
};


