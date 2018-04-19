var crypto = require("crypto");
module.exports = function(mingma){
    var md5 = crypto.createHash('md5');
var password = md5.update(mingma).digest('hex');
return password;
}