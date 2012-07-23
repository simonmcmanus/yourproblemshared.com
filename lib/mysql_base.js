var Client = require('mysql').Client,
    client = new Client();
    client.port = 3306;
    client.user = 'root';
    client.password = '';
//    client.connect();

	// select the database
    client.query('USE yps');

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
