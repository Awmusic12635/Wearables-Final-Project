var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var db = firebase.database();
var app = express();


/* GET home page. */
router.get('/', function(req, res, next) {
    var data={};
    db.ref('/settings').once('value').then(function(snapshot) {

        data['tempmin'] = snapshot.val().tempmin;
        data['tempmax'] = snapshot.val().tempmax;
        data['humidmin'] = snapshot.val().humidmin;
        data['humidmax'] = snapshot.val().humidmax;
        data['lummin'] = snapshot.val().lummin;
        data['lummax'] = snapshot.val().lummax;

        return res.render('index', { title: 'Wearables Final' , settings:data});
    });
});


router.post('/history/add', function(req, res, next) {

    var data = {
      "temp":req.body.temp,
      "humidity":req.body.humidity,
      "light": req.body.light,
      "ts":Date.now()
    };

    db.ref('/history').push(data).then(function(){
        return res.json({status:"success"});
    });
});

router.get('/history', function(req, res, next) {

    db.ref('/history').limitToFirst(2).once('value').then(function (snapshot) {
        var events = snapshot.val();
        return res.json(events);
    });
});

router.get('/settings', function(req, res, next) {
    var data={};
    db.ref('/settings').once('value').then(function(snapshot) {

        data['tempmin'] = snapshot.val().tempmin;
        data['tempmax'] = snapshot.val().tempmax;
        data['humidmin'] = snapshot.val().humidmin;
        data['humidmax'] = snapshot.val().humidmax;
        data['lummin'] = snapshot.val().lummin;
        data['lummax'] = snapshot.val().lummax;

        return res.json(data);
    });
});

router.post('/settings', function(req, res, next) {
    var settings = {
        'tempmin':req.body.tempmin,
        'tempmax':req.body.tempmax,
        'humidmin':req.body.humidmin,
        'humidmax':req.body.humidmax,
        'lummin':req.body.lummin,
        'lummax':req.body.lummax
    };
    db.ref('/settings').set(settings).then(function(){
        return res.redirect('back');
    });
});

module.exports = router;
