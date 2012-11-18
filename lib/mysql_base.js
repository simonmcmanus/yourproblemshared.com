var config = require('config');
console.log(config);
var Client = require('mysql').Client,
    client = new Client();
    client.port = config.mysql.port;
    client.user = config.mysql.user;
    client.host = config.mysql.host;
    client.password = config.mysql.password;
//    client.connect();

	// select the     heroku_0a2f463cb6c62d6
	var query = function(query, params, callback) {
	    client.query('USE '+config.mysql.database);
		client.query(query,
			function selectCb(err, results, fields) {
				if (err) {
					console.log(err);
					setTimeout(function()  {
						throw err;
					}, 100);
				}
				if(callback){
					callback(results, params);
				}
			}
		);
	};
	
	exports.query = query;
