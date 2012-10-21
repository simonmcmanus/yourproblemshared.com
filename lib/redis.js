var redis = require("redis");

if (process.env.REDISTOGO_URL) {
	var rtg   = require("url").parse(process.env.REDISTOGO_URL);
	var client = require("redis").createClient(rtg.port, rtg.hostname);
	client.auth(rtg.auth.split(":")[1]);
} else {
	var client = redis.createClient();
}



exports.saveEmail = function(params, callback) {
	var id = 'yps:email:' + params.id;
	client.lpush('yps:emails', id);
	// add company here. 
	client.hmset(id, 
		'id', params.id,
		'toEmail', params.toEmail,
		'fromEmail', params.fromEmail,
		'ccEmail', params.ccEmail,
		'subject', params.subject,
 		'messageId',	params.messageId,
 		'date', params.date,
 		'htmlBody', params.htmlBody,
 		'textBody', params.textBody,
 		'inReplyToId', params.inReplyToId,
 		'referenceId', params.referenceId,
 		'replyTo', params.replyTo,
 		'toName', params.toName,
 		'fromName', params.fromName,
 		'ccName', params.ccName
 	, function() {
 		console.log(arguments);
 	});
};


exports.getEmail = function(params, callback) {
	client.hgetall('yps:email:' + params.id, function(error, data) {
		callback(null, data);
	});
};

exports.company = function(params, callback) {
};

exports.browse = function(params, callback) {
	client.lrange('yps:emails', 0, -1, function(error, data) {
		var multi = [];
		var c = data.length;
		while(c--) {
			multi[c] = ['hgetall', data[c]];
		};
		client.multi(multi).exec(function (err, replies) {
        callback(null, replies);
    });
		
	});	
};
