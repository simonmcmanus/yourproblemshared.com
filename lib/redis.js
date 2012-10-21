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


	refsArray = params.referenceId.slice(1, -1).split('><');
	multiRefs = [];
	var c = refsArray.length;
	while(c--) {
		multiRefs[c] = ['lpush', 'yps:emailsByRef:'+refsArray[c], id];
	}
	client.multi(multiRefs.concat([
		['lpush', 'yps:emails', id],
		['hmset', id, 
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
	 		'ccName', params.ccName ]
	])).exec(callback);
};




exports.getEmail = function(params, callback) {
	client.hgetall('yps:email:' + params.id, function(error, email) {
		client.lrange('yps:emailsByRef:'+email['messageId'].slice(1, -1), 0, -1, function(error, emailIds) {
			var multi = [];
			var c = emailIds.length;
			while(c--) {
				multi[c] = ['hgetall', emailIds[c]];
			}
			client.multi(multi).exec(function(error, replies) {
				callback(error, email, replies);
			});
		});
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
			var ids = {};

			var c = replies.length;
			while(c--) {
				if(ids[replies[c].referenceId]) { // we have the original message.
					ids[replies[c].referenceId].push(replies[c]);
				}else {
					ids[replies[c].messageId] = [replies[c]];
				}
			}	

			// give it the data its expecting.
			var out = [];
			for(id in ids) {
				out.push(ids[id]);
			}





        callback(null, out);
    });
		
	});	
};
