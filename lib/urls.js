exports.HOME		= '/';
exports.EMAIL		= exports.HOME + 'company/:company/:id';
exports.INBOUND		= exports.HOME + 'mail/sent';
exports.COMPANY		= exports.HOME + 'mail/company/:company';

exports.get = function() {
	return exports.build(exports[type], tokens);
}


exports.build = function() {
	for(var token in tokens){
		str = str.replace(':'+token, tokens[token]);
	}
	return str;
};