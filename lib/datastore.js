var sql = require('./mysql_base.js');
var encoder = require('./encoder.js');





exports.saveEmail = function(params, callback) {
	var q = 'INSERT INTO email (id, toEmail, fromEmail, ccEmail, subject, messageId, date, htmlBody, textBody, inReplyToId, referenceId, replyTo, toName, fromName, ccName) VALUES (null, "'+escape(params.toEmail)+'", "'+escape(params.fromEmail)+'", "'+escape(params.ccEmail)+'", "'+escape(params.subject)+'", "'+escape(params.messageId)+'", "'+escape(params.date)+'", "'+escape(params.htmlBody)+'", "'+escape(params.textBody)+'", "'+escape(params.inReplyToId)+'", "'+escape(params.referenceId)+'", "'+escape(params.replyTo)+'", "'+escape(params.toName)+'", "'+escape(params.fromName)+'", "'+escape(params.ccName)+'")';
	sql.query(q, params, callback);
};


exports.getEmail = function(params, callback) {
	var q = 'select * from email where id="'+params.id+'"';
	sql.query(q, params, function(data, params) {
		console.log('>>>>', data);
		if(data[0].referenceId) {
			var q2 = 'select * from email where id="'+params.id+'" OR referenceId="'+data[0].referenceId+'"';
			sql.query(q2, params, callback);
		}else {
			callback(data);
		}
	});
};

exports.company = function(params, callback) {
	var q = 'select * from email where email.to LIKE "%'+params.term+'%" OR email.subject LIKE "%'+params.term+'%" OR email.textBody LIKE "%'+params.term+'%"';
	sql.query(q, params, callback);
};

exports.browse = function(params, callback) {
	var q = 'select * from email order by id desc limit 10';
	sql.query(q, params, callback);
};


