var ds = require('./lib/mysql.js');
ds.saveEmail({
    id: null,
    company: 'uk.mcd.com',
    toEmail: 'simon@yourproblemshared.com',
    toName: 'TEST TO',
    isFirst: '1',
    fromEmail: 'mcmanus.simon@gmail.com',
    replyTo: 'simon@yourproblemshared.com',
    fromName: 'test from',
    ccEmail: 'non',
    ccName: '',
    subject: 'beagle box',
    textBody: 'no beagle box',
    htmlBody:  'no beagle box',
    date: '1234567',
    inReplyToId: '',
    messageId: '1',
    referenceId: '',
    hash: 'hash'
}, function() {
    console.log('inserted');
});



var ds = require('./lib/mysql.js');
ds.saveEmail({
    id: null,
    company: 'fr.mcd.com',
    toEmail: 'simon@yourproblemshared.com',
    toName: 'TEST TO',
    isFirst: '1',
    fromEmail: 'mcmanus.simon@gmail.com',
    replyTo: 'simon@yourproblemshared.com',
    fromName: 'test from',
    ccEmail: 'non',
    ccName: '',
    subject: 'bonjour',
    textBody: 'francais?',
    htmlBody:  'bon',
    date: '1234567',
    inReplyToId: '',
    messageId: '1',
    referenceId: '1',
    hash: 'hash'
}, function() {
    console.log('inserted');
});



var ds = require('./lib/mysql.js');
ds.saveEmail({
    id: null,
    company: 'mcdonalds.com',
    toEmail: 'simon@yourproblemshared.com',
    toName: 'TEST TO',
    isFirst: '1',
    fromEmail: 'mcmanus.simon@gmail.com',
    replyTo: 'simon@yourproblemshared.com',
    fromName: 'test from',
    ccEmail: 'non',
    ccName: '',
    subject: 'IMG A FHOSR',
    textBody: 'francais?',
    htmlBody:  'bon',
    date: '1234567',
    inReplyToId: '',
    messageId: '1',
    referenceId: '',
    hash: 'hash'
}, function() {
    console.log('inserted');
});


ds.saveEmail({
    id: null,
    company: 'facebook.com',
    toEmail: 'simon@yourproblemshared.com',
    toName: 'TEST TO',
    isFirst: '1',
    fromEmail: 'mcmanus.simon@gmail.com',
    replyTo: 'simon@yourproblemshared.com',
    fromName: 'test from',
    ccEmail: 'non',
    ccName: '',
    subject: 'really LOOOOOOOOONG email body',
    textBody: 'This is a really long message that nobody will ever bother to read so I really doThis is a really long message that nobody will ever bother to read so I really dont know why im bThis is a really long message that nobody will ever bother to read so I really dont know why im bother iThis is a really long message that nobody will ever bother to read so I really dont know why im This is a really long message that nobody will ever bother to read so I really dont know wThis is a really long message that nobody will ever bother to read so I really dont knoThis is a really long message that nobody will ever bother to read so I really dont kThis is a really long message that nobody will ever bother to read so I reallyThis is a really long message that nobody will ever bother to read so I really dont know why im bother ing to type anything that makes sense dont know why im bother ing to type anything that makes sensenow why im bother ing to type anything that makes sensew why im bother ing to type anything that makes sensehy im bother ing to type anything that makes sensebother ing to type anything that makes senseng to type anything that makes senseother ing to type anything that makes sensent knoThis is a really long message that nobody will ever bother to read so I really dont know why im This is a really long message that nobody will ever bother to read so I really dont know why im bother ing to type anything that makes sensebother ing to type anything that makes sensew why im bother ing to type anything that makes sense - This is a really long message that nobody will ever bother to read so I really dont know why im bother ing to type anything that makes sense - This is a really long message that nobody will ever bother to read so I really dont know why im bother ing to type anything that makes sense - This is a really long message that nobody will ever bother to read so I really dont know why im bother ing to type anything that makes sense -This is a really long message that nobody will ever bother to read so I really dont know why im bother ing to type anything that makes sense',
    htmlBody: 'This is a really long message that nobody will ever bother to read so I really doThis is a really long message that nobody will ever bother to read so I really dont know why im bThis is a really long message that nobody will ever bother to read so I really dont know why im bother iThis is a really long message that nobody will ever bother to read so I really dont know why im This is a really long message that nobody will ever bother to read so I really dont know wThis is a really long message that nobody will ever bother to read so I really dont knoThis is a really long message that nobody will ever bother to read so I really dont kThis is a really long message that nobody will ever bother to read so I reallyThis is a really long message that nobody will ever bother to read so I really dont know why im bother ing to type anything that makes sense dont know why im bother ing to type anything that makes sensenow why im bother ing to type anything that makes sensew why im bother ing to type anything that makes sensehy im bother ing to type anything that makes sensebother ing to type anything that makes senseng to type anything that makes senseother ing to type anything that makes sensent knoThis is a really long message that nobody will ever bother to read so I really dont know why im This is a really long message that nobody will ever bother to read so I really dont know why im bother ing to type anything that makes sensebother ing to type anything that makes sensew why im bother ing to type anything that makes sense - This is a really long message that nobody will ever bother to read so I really dont know why im bother ing to type anything that makes sense - This is a really long message that nobody will ever bother to read so I really dont know why im bother ing to type anything that makes sense - This is a really long message that nobody will ever bother to read so I really dont know why im bother ing to type anything that makes sense -This is a really long message that nobody will ever bother to read so I really dont know why im bother ing to type anything that makes sense',
    date: '1234567',
    inReplyToId: '',
    messageId: '2',
    referenceId: '',
    hash: 'hash'
}, function() {
    console.log('inserted');
});

//insert into domain (id, companyId, domain) values (null, 12,  'uk.mcd.com')
//select email.subject, domain.companyId from email, domain where  email.company = domain.domain group  by subject;
//insert into company (id, name, url) values (12, 'McDs', 'mcdonalds.com');
//select email.subject, domain.companyId, company.name from email, domain, company  where  email.company = domain.domain and company.id=domain.companyId  group  by subject;