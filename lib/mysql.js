var sql = require('./mysql_base.js');
var encoder = require('./encoder.js');


exports.saveEmail = function(params, callback) {

	var cb = function() {
		callback();
	};
	var insert = function(isFirst) {
		var q = 'INSERT INTO email (id, company, isFirst, reporter, toEmail, fromEmail, ccEmail, subject, messageId, date, htmlBody, textBody, inReplyToId, referenceId, replyTo, toName, fromName, ccName, hash, resolved) VALUES (null, "'+params.company+'",  '+isFirst+',  "'+escape(params.fromEmail)+'", "'+escape(params.toEmail)+'", "'+escape(params.fromEmail)+'", "'+escape(params.ccEmail)+'", "'+escape(params.subject)+'", "'+escape(params.messageId)+'", "'+escape(params.date)+'", "'+escape(params.htmlBody)+'", "'+escape(params.textBody)+'", "'+escape(params.inReplyToId)+'", "'+escape(params.referenceId)+'", "'+escape(params.replyTo)+'", "'+escape(params.toName)+'", "'+escape(params.fromName)+'", "'+escape(params.ccName)+'", "'+params.hash+'", 0)';
		sql.query(q, params, function(data) {
			callback(data, isFirst);
		});
	};
	var refs = params.referenceId.slice(1, -1).split('><').map(escape).join(' OR messageId=');
	if(refs === ""){// no refs so must be first email.
		insert(1);
	}else {  // email has a ref - lets see if we have an email linked to these refs.
 		var q1 = 'select * from email where messageId LIKE "%'+refs+'%"';
		sql.query(q1, params, function(error, data, params2) {
			var isFirst = (data) ? 0 : 1;
			insert(isFirst);
		});		
	}
};


exports.getEmail = function(params, callback) {
	var q = 'select * from email where id="'+params.id+'"';
	console.log(q);
	sql.query(q, params, function(data, params) {
		console.log('.', arguments);
		if(data[0] && data[0].messageId) {
			var q2 = 'select * from email where id="'+params.id+'" OR referenceId LIKE "%'+data[0].messageId+'%"';
			sql.query(q2, params, callback);
		}else {
			console.log('NOT IN HERE');
			callback(data);
		}
	});
};


exports.resolveEmail = function(params, callback) {
	var where = 'WHERE id="'+params.id+'" AND hash="'+params.hash+'" AND resolved=0';
	var q = 'SELECT * from email ' + where;
	console.log(q);
	sql.query(q, params, function(data, params) {
		var now = +new Date();
		var q1 = 'UPDATE email SET resolved=1, resolvedEpoch="'+now+'" '+where;
		console.log(q1);
		sql.query(q1, params, function(data1, params) {
			callback(data1, data);
		});
	});
	
};

exports.company = function(params, callback) {
	var q = 'select * from email where company="'+params.company+'" limit 10';
	sql.query(q, params, function(company) {
		exports.totals({company: params.company}, function(companyTotals) {
			callback(company, companyTotals);
		});
	});
};

exports.totals = function(params, callback) {
	var q = 'select sum(resolved=0) as unresolved, sum(resolved) as resolved from email where company="'+params.company+'"';
	sql.query(q, params, callback);
};

exports.browse = function(params, callback) {
	var q = 'select * from email where isFirst=1 order by id desc limit 10';
	sql.query(q, params, callback);
};

exports.install = function() {

};


