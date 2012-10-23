var Client = require('mysql').Client,
    client = new Client();
    client.port = 3306;
    client.user = 'ba15827ec122fd';
    client.host = 'us-cdbr-east-02.cleardb.com';
    client.password = '57ec8d46';
//    client.connect();

	// select the database
    client.query('USE heroku_0a2f463cb6c62d6');

	var query = function(query, params, callback) {
		client.query(query,
			function selectCb(err, results, fields) {
			if (err) {
				console.log(query);
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
