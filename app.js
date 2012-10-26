


// need to be able to indentify whnen a new email comes in if we have alerady sent out email re this topic.




var express = require('express');
//var ds = require('./lib/redis.js');
var ds = require('./lib/mysql.js');
var fs = require('fs');

var app = express.createServer();
//var sizlate = require('sizlate');
var ejs = require('ejs');
var urls = require('./lib/urls.js');
var encoder = require('./lib/encoder.js');

app.configure(function(){
    app.use(express.methodOverride());
    app.set('port', process.env.PORT || 3000);
    app.use(express.bodyParser());
    app.use(app.router);
  app.set('dirname', __dirname);
});



app.enable("jsonp callback"); // enable jsonp

//app.register('.html', sizlate);
app.register('.ejs', ejs);

app.use(urls.PUBLIC, express['static'](__dirname + '/public/assets/'));

 app.get(urls.HOME, function(req, res, next) {
    res.render('comingsoon.ejs', {selected: 'home', hideNav:true});
});


 app.get('/home',  function(req, res, next) {
    res.render('home.ejs', {selected: 'home', hideNav:true});
});

 app.get(urls.ABOUT, function(req, res, next) {
    res.render('about.ejs', {selected: 'about', hideNav: false});
});

 app.get(urls.CONTACT, function(req, res, next) {
    res.render('contact.ejs', {selected: 'contact', hideNav: false});
});


app.get(urls.EMAIL, function(req, res, next) {
    ds.getEmail({
        id: req.params.id,
    }, function(replies) {
//        replies.push(email);
        res.render('email.ejs', {
            mail: replies,
            selected: '',
            hideNav: false, 
            encoder: encoder.encoder
        });
    });
});



app.get(urls.BROWSE, function(req, res, next) {
    ds.browse({}, function(data) {
        if(data.length > 0) {
            res.render('search.ejs', {  
                data: data.reverse(),
                urls: urls, 
                selected: 'browse', 
                hideNav: false,
                encoder: encoder.encoder
            });
        }else {
            res.render('search-no-results.ejs', {  
                urls: urls, 
                hideNav: false, 
                selected: 'browse'
            });
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
    var postmark = require("postmark-api")('d64bdb29-b589-4584-8964-23f5d7e4a614');
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

    if(!req.bodyToFull) {
        res.send('ok');
    }

    var site = req.body.ToFull[0].Email.split('@')[1];
    ds.saveEmail({
        id: req.body.MessageID,
        company: site,
        toEmail: req.body.ToFull[0].Email,
        toName: req.body.ToFull[0].Name,
        fromEmail: req.body.FromFull.Email,
        replyTo: req.body.replyTo,
        fromName: req.body.FromFull.Name,
        ccEmail: req.body.CcFull.Email,
        ccName: req.body.CcFull.Email,
        subject: req.body.Subject,
        textBody:  req.body.TextBody,
        htmlBody:  req.body.HtmlBody,
        date: req.body.Date,
        inReplyToId: headers['In-Reply-To'] || "",
        messageId: headers['Message-ID'] || "",
        referenceId: headers['References'] || ""
    }, function(data, isFirst) {

        console.log('>>>', arguments);
        // only if its the first time. 
        if(data) {
            if(+isFirst) {
                var url = 'http://yourproblemshared.com/'+site+'/mail/'+data.insertId+'/';
                fs.readFile('./views/emails/user-problem-reported.html', 'utf8', function(error, data) {
                    console.log(arguments);
                    var body = ejs.render(data, {
                        site: 'Google',
                         url: 'http://google.com'
                    });
                    sendEmail(req.body.From, 'Relax, your problem has been shared', body);
                });

                
                fs.readFile('./views/emails/site-problem-reported.html', 'utf8', function(error, data) {
                    console.log(data);
                    var body = ejs.render(data, {
                        site: 'Google',
                         url: 'http://google.com'
                    });
                    sendEmail(req.body.From, 'ACTION REQUIRED', body);
                });

            }
            res.send('ok');

        }
    });
});

//process.env.PORT = 3000;

app.listen(process.env.PORT || 3000 );
console.log('check out http://localhost:3000' );





