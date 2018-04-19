var mysql  = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    port: '3306',
    database: 'hotel',
});
//连接数据库
connection.connect();
//查询数据

module.exports.find = function (sql,callback) {

    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            callback(false);
            return;
        }
        callback(result);
    });
    

}
//增加数据
module.exports.insert = function (addSql,addSqlParams,callback) {
    connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
            console.log('[INSERT ERROR] - ',err.message);
            callback(false);
            return;
        }
        callback(true);
    });
    
}
//删除数据
module.exports.remove = function (delSql,callback) {
    connection.query(delSql,function (err, result) {
        if(err){
            console.log('[DELETE ERROR] - ',err.message);
            callback(false);
            return;
        }
        console.log('DELETE affectedRows',result.affectedRows);
        callback(true);
    });

    
}
//更新数据
module.exports.update = function (modSql,callback) {
    connection.query(modSql,function (err, result) {
        if(err){
            console.log('[UPDATE ERROR] - ',err.message);
            callback(false);
            return;
        }
        console.log('UPDATE affectedRows',result.affectedRows);
    });
    callback(true);
    
}

