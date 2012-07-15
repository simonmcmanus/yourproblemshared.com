var express = require('express');
var ds = require('./lib/datastore.js');
var app = express.createServer();
var sizlate = require('sizlate');
var ejs = require('ejs');
var urls = require('./lib/urls.js');
var encoder = require('./lib/encoder.js');
// todo - remove this hack - awaiting release of sizlate.
sizlate.classifyKeys = function(data, options) {
	if((options && !options.classifyKeys) || typeof data == "undefined"){
		return data;
	}
	var c = data.length;
	var retArray = [];
	while(c--) {
		var newObj = {};
		for(var key in data[c]){
			newObj['.'+key] = data[c][key];
		}
		retArray.push(newObj);
	}
	console.log(retArray);
	return retArray;
};

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
  app.set('dirname', __dirname);
});

app.enable("jsonp callback"); // enable jsonp

app.register('.html', sizlate);
app.register('.ejs', ejs);

app.use(urls.PUBLIC, express['static'](__dirname + '/public/assets/'));

 app.get(urls.HOME, function(req, res, next) {
    res.render('home.ejs');
});

 app.get(urls.FAQ, function(req, res, next) {
    res.render('faq.ejs');
});

 app.get(urls.CONTACT, function(req, res, next) {
    res.render('contact.ejs');
});


app.get(urls.EMAIL, function(req, res, next) {
    ds.getEmail({
        id: req.params.id
    }, function(data) {
    console.log(encoder);
        res.render('email.ejs', {  mail: data[0], encoder: encoder.encoder});
    });
});



app.get(urls.BROWSE, function(req, res, next) {
    ds.browse({}, function(data) {
    console.log(data);
//        data = sizlate.classifyKeys(data);
        if(data.length > 0) {
            res.render('search.ejs', {  data: data, urls: urls});
        }else {
            res.render('search-no-results.ejs', { data: data, urls: urls});
        }
    });
});




app.post(urls.SEARCH, function(req, res, next) {
    ds.company({
        term: req.body.term
    }, function(data) {
    console.log(data);
//        data = sizlate.classifyKeys(data);
        if(data.length > 0) {
            res.render('search.ejs', {  data: data, urls: urls});
        }else {
            res.render('search-no-results.ejs', { data: data, urls: urls});
        }
    });
});



app.get(urls.COMPANY , function(req, res, next) {
    ds.company({
        company: req.params.company
    }, function(data) {
        console.log(data);

        res.json(data);
        return;
        res.render(__dirname+'/views/index.html', {
            layout: false,
            selectors : {
                '#content': {
                    partial: 'mailsummary.html',
                    data: data
                }
            }
        });
    });
});


var sendEmail = function(to, subject, body) {
    // send email to 
    var postmark = require("postmark-api")('0193ddc8-91db-4e04-8569-72a9fe5a8c93');
    postmark.send({
        From: 'cc@yourproblemshared.com',
        To: to,
        Subject: subject,
        TextBody: body,
    }, function(response, b, c){
        console.log('RESPONSE IS ', response, b,c);
    });
};


app.post(urls.INBOUND, function(req, res, next) {
    //console.log(req.body);
    ds.saveEmail({
        to: req.body.To,
        from: req.body.From,
        cc: req.body.Cc,
        subject: req.body.Subject,
        body:  req.body.HtmlBody,
        date: req.body.Date 
    }, function(data) {
        if(data) {
            var url = 'http://yourproblemshared.com/company/gosquared.com/'+data.insertId+'/';
            //sendEmail(req.body.To, '');
            console.log(data);
            sendEmail(req.body.From, 'Relax, your problem has been shared', 'Here is the address:'+url);
            res.send('ok');
        }
    });
});


sizlate.startup(app, function(app) {
    app.listen(8002);
    console.log('check out http://localhost:8002');
});



