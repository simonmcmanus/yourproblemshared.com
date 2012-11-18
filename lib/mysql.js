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
var q = 'select email.*, company.name as companyName, company.url as companyUrl  from email, company, domain where email.id="'+params.id+'" and email.company=domain.domain AND company.id=domain.companyId';
	sql.query(q, params, function(data, params) {
		if(data[0] && data[0].messageId) {
			var q2 = 'select * from email where id="'+params.id+'" OR referenceId LIKE "%'+data[0].messageId+'%"';
			sql.query(q2, params, callback);
		}else {
			callback(data);
		}
	});
};


exports.resolveEmail = function(params, callback) {
	var where = 'WHERE id="'+params.id+'" AND hash="'+params.hash+'" AND resolved=0';
	var q = 'SELECT * FROM email ' + where;
	sql.query(q, params, function(data, params) {
		var now = +new Date();
		var q1 = 'UPDATE email SET resolved=1, resolvedEpoch="'+now+'" '+where;
		sql.query(q1, params, function(data1, params) {
			callback(data1, data);
		});
	});
};


/*
Checks to see if the passed in url is actually the primary domain used by the comany. 

 */
exports.fetchParentDomain = function(url, callback) {
	var q1 = 'SELECT company.name AS name, company.url as url from domain, company where domain="'+url+'" AND domain.companyId=company.id';
	sql.query(q1, {}, callback);
};

exports.getCompany = function(company, callback) {
	var  q = "SELECT * FROM company WHERE name="+company;
	sql.query(q, {}, callback);
};


exports.company = function(params, callback) {
	// we already know this is is the primary url.
	// we need to check all subdomains used by this company
	// this looks up emails used by those subdomains
	// lookup company
	var q = 'SELECT * FROM email WHERE company="'+params.company+'" AND  isFirst=1 ORDER BY id';


	var q = 'SELECT email.*, company.name AS companyName, company.url AS companyUrl from email, company, domain  WHERE  isFirst=1  AND company.url="'+params.company+'" AND domain.companyId=company.id and email.company=domain.domain group by subject ORDER BY email.id';
	sql.query(q, params, function(company) {
		exports.totals({company: params.company}, function(companyTotals) {
			callback(company, companyTotals);
		});
	});
};

exports.totals = function(params, callback) {
	var q = 'select sum(resolved=0) as unresolved, sum(resolved) as resolved from email where company="'+params.company+'"';

	//select count(subject) from email, company, domain where company.url ='mcdonalds.com' and  company.id=domain.companyId AND domain.domain=email.company;

	// select sum(resolved=0) as unresolved, sum(resolved) as resolved from email, company, domain where company.url ='mcdonalds.com' and  company.id=domain.companyId AND domain.domain=email.company;


	// select sum(resolved=0) as unresolved, sum(resolved) as resolved from email, company, domain where (company.url ='mcdonalds.com' and  company.id=domain.companyId AND domain.domain=email.company) OR (email.company='mcdonalds.com');
	var q = 'select sum(resolved=0) as unresolved, sum(resolved) as resolved from email, company, domain where (company.url ="' + params.company + '" and  company.id=domain.companyId AND domain.domain=email.company AND isFirst=1) OR (email.company="'+params.company+'" AND isFirst=1)';
	sql.query(q, params, callback);
};

exports.browse = function(params, callback) {
	var q = 'SELECT email.*, domain.companyId,  company.url AS companyUrl, company.name AS companyName FROM email, domain, company WHERE email.isFirst=1 AND email.company = domain.domain AND company.id=domain.companyId  GROUP BY subject order by id desc limit 10';
	sql.query(q, params, callback);
};

exports.install = function() {

};


