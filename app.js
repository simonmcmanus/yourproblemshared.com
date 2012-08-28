var express = require('express');
var ds = require('./lib/redis.js');
var app = express.createServer();
//var sizlate = require('sizlate');
var ejs = require('ejs');
var urls = require('./lib/urls.js');
var encoder = require('./lib/encoder.js');

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
  app.set('dirname', __dirname);
});

app.enable("jsonp callback"); // enable jsonp

//app.register('.html', sizlate);
app.register('.ejs', ejs);

app.use(urls.PUBLIC, express['static'](__dirname + '/public/assets/'));

 app.get(urls.HOME, function(req, res, next) {
    res.render('home.ejs', {selected: 'home'});
});

 app.get(urls.ABOUT, function(req, res, next) {
    res.render('about.ejs', {selected: 'about'});
});

 app.get(urls.CONTACT, function(req, res, next) {
    res.render('contact.ejs', {selected: 'contact'});
});


app.get(urls.EMAIL, function(req, res, next) {
    ds.getEmail({
        id: req.params.id
    }, function(data) {
        console.log(arguments) ;
        res.render('email.ejs', {  
            mail: data[0],
            selected: '',
             encoder: encoder.encoder});
    });
});



app.get(urls.BROWSE, function(req, res, next) {
    ds.browse({}, function(data) {
    console.log(data);
//        data = sizlate.classifyKeys(data);
        if(data.length > 0) {
            res.render('search.ejs', {  data: data.reverse(), urls: urls, selected: 'browse'});
        }else {
            res.render('search-no-results.ejs', {  urls: urls});
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
            res.render('search.ejs', {  data: data, selected: '',  urls: urls});
        }else {
            res.render('search-no-results.ejs', { data: data, selected: '', urls: urls});
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

    var sortHeaders = function(headers) {
        var obj = {};
        if(!headers) {
            return {};
        }
        var c = headers.length;
        while(c--) {
            obj[headers[c].Name] = headers[c].Value;
        }
        return obj;
    }

    var headers = sortHeaders(req.body.Headers);

    console.log(headers);
    ds.saveEmail({
        toEmail: req.body.ToFull.Email,
        toName: req.body.ToFull.Name,
        fromEmail: req.body.FromFull.Email,
        replyTo: req.body.FromFull.replyTo,
        fromName: req.body.ToFull.Name,
        ccEmail: req.body.CcFull.Email,
        ccName: req.body.CcFull.Email,
        subject: req.body.Subject,
        textBody:  req.body.TextBody,
        htmlBody:  req.body.HtmlBody,
        date: req.body.Date,
        inReplyToId: headers['In-Reply-To'] || "",
        messageId: headers['Message-ID'] || "",
        referenceId: headers['References'] || ""
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

app.listen( process.env.PORT || 8002);
console.log('check out http://localhost:8002');





