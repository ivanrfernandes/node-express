var express = require('express');
var helpers = require('./helpers');
var fs = require('fs');

var User = require('./db').User; 

var router = express.Router({
    mergeParams: true
});

router.use(function (req, res, next) {
    console.log(req.method, 'for', req.params.username + ' at ' + req.path);
    next();
});

router.get('/', function (req, res) {
    var username = req.params.username;
    User.findOne({username: username}, function(err, user){
        res.render('user', {
            user: user,
            address: user.location
        });
    })
});

router.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Broke!');
})

router.get('/edit', function(req, res){
    res.send('Editing ' + req.params.username);
})

router.put('/', function (req, res) {
    var username = req.params.username;
    
    User.findOne({username: username}, function(err, user){
        if(err) throw err; 

        user.name.full = req.body.name; 
        user.location = req.body.location;
        user.save(function(){
            res.end(); 
        });
    });
});

router.delete('/', function (req, res) {
    //Teste para commit
    var username = req.params.username;
    User.deleteOne({username: username}, function(err){
        if(err) throw err; 
    });
    res.sendStatus(200);
});

module.exports = router; 