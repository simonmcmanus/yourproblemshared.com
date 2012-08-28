var redis = require("redis");
var client = redis.createClient(6789, '');


exports.saveEmail = function(params, callback) {
	var id = 'yps:email:' + params.id;
	client.lpush('yps:emails', id);
	client.hmset(id, 
		toEmail, params.toEmail,
		fromEmail, params.fromEmail,
		ccEmail, params.ccEmail,
		subject, params.subject,
 		messageId,	params.messageId,
 		date, params.date,
 		htmlBody, params.htmlBody,
 		textBody, params.textBody,
 		inReplyToId, params.inReplyToId,
 		referenceId, params.referenceId,
 		replyTo, params.replyTo,
 		toName, params.toName,
 		fromName, params.fromName,
 		ccName, params.ccName
 	);
};


exports.getEmail = function(params, callback) {
	client.hgetall('yps:email:' + params.id, function(error, data) {
		console.log('YPS, ', data);
	});
};

exports.company = function(params, callback) {
};

exports.browse = function(params, callback) {
	client.lrange('ups:emails', 0, 0, function(error, data) {
		console.log('DAREA ISL ', data);
	});	
};
