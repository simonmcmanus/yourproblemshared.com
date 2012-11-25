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
var q = 'select email.*, company.name as companyName, company.url as companyUrl from email LEFT OUTER JOIN domain domain ON email.company = domain.domain LEFT JOIN company company ON company.id=domain.companyId WHERE  email.id="' + params.id + '"';
console.log(q);
	sql.query(q, params, function(data, params) {
		if(data[0] && data[0].messageId) { // lets look for follow up message and send them both in one request.
			var q2 = 'select email.*, company.name as companyName, company.url as companyUrl from email LEFT OUTER JOIN domain domain ON email.company = domain.domain LEFT JOIN company company ON company.id=domain.companyId WHERE  email.id="' + params.id + '"  OR referenceId LIKE "%'+data[0].messageId+'%"';
			sql.query(q2, params, callback);
		}else {
			console.log(data);
			callback(data);
		}
	});
};

exports.emailIsResolvable = function(params, callback) {
	var q = 'SELECT * FROM email where hash="' + params.hash + '" AND id="' + params.id + '" AND resolved=0';
	sql.query(q, params, function(data, params) {	
		callback((data && data.length > 0));
	});
}

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



exports.domainsUsedByCompany = function(domain, callback) { 
	console.log('m',domain);
	var q = 'SELECT * FROM company WHERE url="' + domain + '"';
	console.log(q);
	sql.query(q, {}, function(company) {
		console.log('c', company);
		if(company.length > 0){ // we have a company record - lets lookup subdomains.
			var q2  = 'SELECT * FROM domain where companyId="' + company[0].id + '"';
			console.log('b1', q2);
			sql.query(q2, {}, function(data, params) {
				var domains = data.map(function(a) { return a.domain });
				domains.push(domain);
				callback(domains, company);
			});
		}else { // no subdomains
			console.log('b2');
			callback([domain], []);
		}
	});

};


exports.company = function(params, callback) {
	// we already know this is is the primary url.
	// we need to check all subdomains used by this company
	
	exports.domainsUsedByCompany(params.company, function(domainList, domainInfo) {
		console.log('dk', domainList);
		console.log('dI', domainInfo);
		var q = 'SELECT * FROM email WHERE isFirst=1  AND (company="' + domainList.join('" OR company="')+'")';
//		var q = 'SELECT * FROM email, company WHERE isFirst=1  AND (email.company="' + domainList.join('" OR email.company="')+'" ) ';

//		var q = 'SELECT email.*,  company.url AS companyUrl, company.name AS companyName FROM email LEFT JOIN  company ON  email.company=company.url AND email.isFirst=1  AND (email.company="' + domainList.join('" OR email.company="')+'" ) ';
	//	SELECT * FROM EMAIL 
	//		LEFT OUTER JOIN  company
	//		ON  email.company=company.url
	//		AND email.isFirst=1
	//		AND
	//		
	//		SELECT column_name(s)
	//		
	//		
	console.log(q);
		sql.query(q, params, function(emails) {
		exports.totals({company: params.company}, function(companyTotals) {
			callback(emails, companyTotals, domainInfo[0]);
		});
	});


	});
	
	// lookup company
	// lookup other domains
	// get emails for this cmpany

//	var q = 'SELECT email.*, company.name AS companyName, company.url AS companyUrl, company.logo AS companyLogo from email LEFT OUTER JOIN domain ON  domain.domain=company.url  AND isFirst=1 AND company.url="'+params.company+'" LEFT OUTER JOIN company ON email.company=domain.domain  group by subject ORDER BY email.id';
return;
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
	var q = 'SELECT email.*, domain.companyId,  company.url AS companyUrl, company.name AS companyName from email left outer join domain on domain.domain = email.company AND email.isFirst=1 left outer join company on company.id = domain.companyId GROUP BY email.id order by email.id desc limit 10';
	sql.query(q, params, callback);
};

exports.install = function() {

};


