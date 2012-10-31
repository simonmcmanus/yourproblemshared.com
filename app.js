


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
    res.render('comingsoon.ejs', {
        selected: 'home', 
        hideNav:true, 
        page: 'home',
        isResolved: false,
        message :''
    });
});


 app.get('/home',  function(req, res, next) {
    res.render('home.ejs', {
        selected: 'home',
         hideNav:false,
         page: 'home',
         isResolved: false,
         message :''
     });
});

  app.get('/sample',  function(req, res, next) {
    res.render('emails/site-problem-reported.ejs', {
        selected: 'home',
         hideNav:false, 
         page: 'home',
         company: 'Sample Company',
         url: 'http://yourproblemshared.com/company.com/mail/21',
         isPre: true,
         isResolved: false,
         resolvedUrl: 'http://yourproblemshared.com/resolve',
         message :''

     });
});



app.get(urls.RESOLVE,  function(req, res, next) {
    ds.resolveEmail({
        id: req.params.id, 
        hash: req.params.hash
    }, function(data, email) {
        if(data.affectedRows > 0) {
            // send email to say emails marked as resolved.
            res.render('resolved.ejs', {
                 hideNav: false,
                    isResolved: 1,
                    page: '',
                selected: '',
                message :''
            });  
            fs.readFile('./views/emails/user-problem-resolved.ejs', 'utf8', function(error, data) {
                sendEmail(email.fromEmail, null, 'Issue Resolved', data);
            });
            fs.readFile('./views/emails/site-problem-resolved.ejs', 'utf8', function(error, data) {
                sendEmail(email.toEmail, null, 'Issue Resolved', data);
            });
        }else {
             res.render('resolveError.ejs', {
                 hideNav: false,
                 isResolved: false,
                    page: '',
                selected: '',
                message :''
            });
        }
    });


});

 app.get(urls.ABOUT, function(req, res, next) {
    res.render('about.ejs', {
        selected: 'about', 
        hideNav: false, 
        page: 'about',
        isResolved: false,
        message :''
    });
});

 app.get(urls.CONTACT, function(req, res, next) {
    res.render('contact.ejs', {
        selected: 'contact', 
        hideNav: false, 
        page: 'contact',
        isResolved: false,
        message :''
    });
});


app.get(urls.EMAIL, function(req, res, next) {
    var moment = require('moment');
    ds.getEmail({
        id: req.params.id,
    }, function(replies) {
//        replies.push(email);
//        
        if(replies[0].resolved === 1) {
            var msg = 'Problem was <strong>resolved  '+moment(+replies[0].resolvedEpoch).fromNow()+'</strong>'
        }else {
            var msg = 'Problem reported to <strong>'+replies[0].company+'</strong> '+moment(new Date(unescape(replies[0].date))).fromNow()+' and remains <strong>UNRESOLVED</strong> '
        }
        res.render('email.ejs', {
            mail: replies,
            selected: '',
            moment: moment,
            page: 'browse',
            hideNav: false, 
            encoder: encoder.encoder, 
            isResolved: replies[0].resolved,
            message :msg
        });
    });
}); 



app.get(urls.BROWSE, function(req, res, next) {
    ds.browse({}, function(data) {
        if(data.length > 0) {
            res.render('search.ejs', {  
                data: data.reverse(),
                urls: urls, 
                company: 'Browse',
                page: 'browse',
                selected: 'browse', 
                moment: require('moment'),
                hideNav: false,
                isResolved: false,
                encoder: encoder.encoder,
                message :''
            });
        }else {
            res.render('search-no-results.ejs', {  
                urls: urls, 
                page: 'browse',
                hideNav: false, 
                isResolved: false,
                selected: 'browse',
                message :''
            });
        }
    });
});




app.post(urls.SEARCH, function(req, res, next) {
    ds.company({
        term: req.body.term
    }, function(data) {
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
        if(data.length > 0) {
            res.render('search.ejs', { 
                data: data, 
                selected: '',
                company: req.params.company,
                encoder: encoder.encoder,
                hideNav: false,
                page: 'browse',
                moment: require('moment'),
                isResolved:false,
                urls: urls,
                message :''
            });
        }else {
            res.render('search-no-results.ejs', {  
                urls: urls, 
                page: 'browse',
                isResolved: false,
                company: req.params.company,
                hideNav: false, 
                selected: 'browse',
                message :''
            });
        }
    });
});


var sendEmail = function(to, cc, subject, body) {
    if(to === 'cc@yourproblemshared.com') {
        return; // failsafe
    }
    var postmark = require("postmark-api")('d64bdb29-b589-4584-8964-23f5d7e4a614');
    postmark.send({
        From: 'simon@yourproblemshared.com',
        To: to,
        Cc: cc,
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

    // if(!req.bodyToFull) {
    //     res.send('ok');
    // }



    if(req.body.ToFull[0].Email === 'cc@yourproblemshared.com'){
        if(req.body.From === 'cc@yourproblemshared.com') {
            return; // that shit cray.
        }
        fs.readFile('./views/emails/user-report-failed.ejs', 'utf8', function(error, data) {
            sendEmail(req.body.From, 'simon@yourproblemshared.com', 'Submission failed', data);
        });
        return;
    }

    var site = req.body.ToFull[0].Email.split('@')[1];

    var crypto = require('crypto');
    var name = req.body.FromFull.Email+req.body.Subject;
    var hash = crypto.createHash('md5').update(name).digest("hex");

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
        referenceId: headers['References'] || "",
        hash: hash
    }, function(insertData, isFirst) {
       // only if its the first time. 
        if(insertData) {
            if(+isFirst) {
                var url = 'http://yourproblemshared.com/'+site+'/mail/'+insertData.insertId+'/';
                fs.readFile('./views/emails/user-problem-reported.ejs', 'utf8', function(error, data) {
                    var body = ejs.render(data, {
                 company: site,
                        to: req.body.ToFull[0].Email,
                     url: url,
              resolveUrl: 'http://yourproblemshared.com'+urls.get('RESOLVE', {
                         hash: hash,
                      company: site,
                           id: insertData.insertId
                        })
                    });
                    sendEmail(req.body.From, null, 'Relax, your problem has been shared', body);
                });

                fs.readFile('./views/emails/site-problem-reported.ejs', 'utf8', function(error, data) {
                    console.log('>>>',arguments);
                    var body = ejs.render(data, {
                          isPre: false,
                        company: site,
                            url: url
                    });
                    sendEmail(req.body.ToFull[0].Email, null, 'ATTENTION REQUIRED', body);
                });
            }
            res.send('ok');
        }
    });
});

//process.env.PORT = 3000;

app.listen(process.env.PORT || 3000 );
console.log('check out http://localhost:3000' );





