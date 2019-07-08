var fs = require('fs');
var path = require('path');
var _ = require('lodash');

function getUserFilePath(username) {
    return path.join(__dirname, 'users', username) + '.json';
}

function getUser (username) {
    var user = JSON.parse(fs.readFileSync(getUserFilePath(username), {enconding: 'utf8'}));
    user.name.full = _.startCase(user.name.first +' '+ user.name.last);
    _.keys(user.location).forEach(function (key) {
        user.location[key] = _.startCase(user.location[key]);
    }); 
    return user; 
}

function saveUser (username, data) {
    var fp = getUserFilePath(username);
    fs.unlinkSync(fp);
    fs.writeFileSync(fp, JSON.stringify(data, null, 2), {enconding: 'utf8'});
}

function verifyUser(req , res, next) {
    var fp = getUserFilePath(req.params.username);

    fs.exists(fp, function(yes){
        if(yes) {
            next(); 
        }else{
            res.redirect('/error/' + req.params.username);
        }
    })
}


exports.getUser = getUser; 
exports.getUserFilePath = getUserFilePath;
exports.saveUser = saveUser; 
exports.verifyUser = verifyUser; 