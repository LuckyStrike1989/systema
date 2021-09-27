const mysql = require('mysql');     // mysql 모듈 로드

// mysql 접속 정보
const db_info = { 
    host : 'localhost',
    port: '3306',
    user : 'micro',
    password : 'service',
    database : 'monolithic'
}

let connection = mysql.createConnection(db_info);

connection.connect(function(err) {
    if(err) console.error('mysql connection error : ' + err);
    else console.log('mysql is connected successfully!');
});

connection.end();