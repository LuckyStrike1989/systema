const mysql = require('mysql');     // mysql 모듈 로드

// mysql 접속 정보
const conn = { 
    host : 'localhost',
    port: '3306',
    user : 'micro',
    password : 'service',
    database : 'monolithic'
};

exports.onRequest = (res, method, pathname, params, cb) => {
    switch( method ) {
        case "POST":
            return register(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
        case "GET":
            return inquiry(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
        default:
            return process.nextTick(cb, res, null);     // 정의되지 않은 메서드면 null 리턴
    }
}

let register = (method, pathname, params, cb) => {
    let response = {
        key : params.key,
        errorcode : 0,
        errormessage : "success"
    };

    let validation = (params == null || params.userid == null || params.goodsid == null);     // 유효성 검사

    if( validation ) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        let connection = mysql.createConnection(conn);
        connection.connect();
        connection.query(
            "insert into purchases(userid, goodsid) values(?, ?)"
            , [params.userid, params.goodsid]
            , (error, results, fields) => {
                if( error ) {
                    // mysql 에러 처리
                    response.errorcode = 1;
                    response.errormessage = error;
                }
                cb(response);
            }
        );
        connection.end();
    }
};

let inquiry = (method, pathname, params, cb) => {
    let response = {
        key : params.key,
        errorcode : 0,
        errormessage : "success"
    };

    if( params.userid == null  ) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        let connection = mysql.createConnection(conn);
        connection.connect();
        connection.query(
            "select id, goodsid, date from purchases where userid = ?"
            , [params.userid]
            , (error, results, fields) => {
                if( error || results.length == 0 ) {
                    response.errorcode = 1;
                    response.errormessage = error;
                } else {
                    response.results = results;     // 조회 결과 처리
                }
                cb(response);
            }
        );
        connection.end();
    }
};