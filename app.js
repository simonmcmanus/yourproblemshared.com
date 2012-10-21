var express = require('express');
var ds = require('./lib/redis.js');
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

// req.body = {
//   "From": "myUser@theirDomain.com",
//   "FromFull": {
//     "Email": "myUser@theirDomain.com",
//     "Name": "John Doe"
//   },
//   "To": "451d9b70cf9364d23ff6f9d51d870251569e+ahoy@inbound.postmarkapp.com",
//   "ToFull": [
//     {
//       "Email": "451d9b70cf9364d23ff6f9d51d870251569e+ahoy@inbound.postmarkapp.com",
//       "Name": ""
//     }
//   ],
//   "Cc": "\"Full name\" <sample.cc@emailDomain.com>, \"Another Cc\" <another.cc@emailDomain.com>",
//   "CcFull": [
//     {
//       "Email": "sample.cc@emailDomain.com",
//       "Name": "Full name"
//     },
//     {
//       "Email": "another.cc@emailDomain.com",
//       "Name": "Another Cc"
//     }
//   ],
//   "ReplyTo": "myUsersReplyAddress@theirDomain.com",
//   "Subject": "This is an inbound message",
//   "MessageID": "22c74902-a0c1-4511-804f2-341342852c90",
//   "Date": "Thu, 5 Apr 2012 16:59:01 +0200",
//   "MailboxHash": "ahoy",
//   "TextBody": "[ASCII]",
//   "HtmlBody": "[HTML(encoded)]",
//   "Tag": "",
//   "Headers": [
//     {
//       "Name": "X-Spam-Checker-Version",
//       "Value": "SpamAssassin 3.3.1 (2010-03-16) onrs-ord-pm-inbound1.wildbit.com"
//     },
//     {
//       "Name": "X-Spam-Status",
//       "Value": "No"
//     },
//     {
//       "Name": "X-Spam-Score",
//       "Value": "-0.1"
//     },
//     {
//       "Name": "X-Spam-Tests",
//       "Value": "DKIM_SIGNED,DKIM_VALID,DKIM_VALID_AU,SPF_PASS"
//     },
//     {
//       "Name": "Received-SPF",
//       "Value": "Pass (sender SPF authorized) identity=mailfrom; client-ip=209.85.160.180; helo=mail-gy0-f180.google.com; envelope-from=myUser@theirDomain.com; receiver=451d9b70cf9364d23ff6f9d51d870251569e+ahoy@inbound.postmarkapp.com"
//     },
//     {
//       "Name": "DKIM-Signature",
//       "Value": "v=1; a=rsa-sha256; c=relaxed\/relaxed;        d=wildbit.com; s=google;        h=mime-version:reply-to:date:message-id:subject:from:to:cc         :content-type;        bh=cYr\/+oQiklaYbBJOQU3CdAnyhCTuvemrU36WT7cPNt0=;        b=QsegXXbTbC4CMirl7A3VjDHyXbEsbCUTPL5vEHa7hNkkUTxXOK+dQA0JwgBHq5C+1u         iuAJMz+SNBoTqEDqte2ckDvG2SeFR+Edip10p80TFGLp5RucaYvkwJTyuwsA7xd78NKT         Q9ou6L1hgy\/MbKChnp2kxHOtYNOrrszY3JfQM="
//     },
//     {
//       "Name": "MIME-Version",
//       "Value": "1.0"
//     },
//     {
//       "Name": "Message-ID",
//       "Value": "<CAGXpo2WKfxHWZ5UFYCR3H_J9SNMG+5AXUovfEFL6DjWBJSyZaA@mail.gmail.com>"
//     }
//   ],
//   "Attachments": [
//     {
//       "Name": "myimage.png",
//       "Content": "[BASE64-ENCODED CONTENT]",
//       "ContentType": "image/png",
//       "ContentLength": 4096
//     },
//     {
//       "Name": "mypaper.doc",
//       "Content": "[BASE64-ENCODED CONTENT]",
//       "ContentType": "application/msword",
//       "ContentLength": 16384
//     }
//   ]
// };
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

    if(!req.bodyToFull) {
        res.send('ok');
    }
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
//            var url = 'http://yourproblemshared.com/company/gosquared.com/'+data.insertId+'/';
            //sendEmail(req.body.To, '');
            console.log(data);
            sendEmail(req.body.From, 'Relax, your problem has been shared', 'Here is the address:');
            res.send('ok');
        }
    });
});

//process.env.PORT = 3000;

app.listen(process.env.PORT || 3000 );
console.log('check out http://localhost:3000' );





