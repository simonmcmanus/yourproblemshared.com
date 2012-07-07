var express = require('express');
var ds = require('./lib/datastore.js');
var app = express.createServer();
var sizlate = require('sizlate');
var urls = require('./lib/urls.js');



app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);

  app.set('dirname', __dirname);
});

app.enable("jsonp callback"); // enable jsonp


app.register('.html', sizlate);

 app.get(urls.HOME, function(req, res, next) {
    res.render('home.html', {
        selectors: {}
    });
});


app.get(urls.EMAIL, function(req, res, next) {
    ds.getEmail({
        id: req.params.id
    }, function(data) {
        data = sizlate.classifyKeys(data);
        res.render('email.html', {
            selectors: data
        });
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





app.get(urls.INBOUND, function(req, res, next) {


    ds.saveEmail({
        to: 'gosquared.com',
        from: 'mcmanus.simon@gmail.com',
        cc: 'cc@yourproblemshared.com', 
        body:  'Here is my email body', //req.body.body ||
        date: '12-23-2-3 sdf-3' //req.body.date
    }, function(data) {
        if(data) {
            // send company-problem-reported
            // send userx§-problem-reported
            res.send('ok');
        }
    });
});


sizlate.startup(app,
function(app) {
    app.listen(8080);
    console.log('check out http://localhost:8080');
});



