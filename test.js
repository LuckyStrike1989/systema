const http = require('http');

let options = {
    host : "127.0.0.1"
    , port : 8000
    , headers : {       // JSON 형식의 헤더 정보
        'Content-Type' : 'application/json'
    }
};

let request = (cb, params) => {
    let req = http.request(options, (res) => {
        let data = "";
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log(options, data);
            cb();       // cb : 통신 완료 후 콜백을 알려 줌
        });
    });

    if( params ) {
        req.write(JSON.stringify(params));  // POST, PUT이면 스트링 형식으로 전송
    }

    req.end();
};

/**
 * 상품 관리 API 테스트
 */
let goods = (callback) => {
    let goods_post = (cb) => {
        options.method = "POST";
        options.path = "/goods";
        request(cb, {
            name : "test Goods",
            category : "tests",
            price : 1000,
            description : "test"
        });
    }

    let goods_get = (cb) => {
        options.method = "GET";
        options.path = "goods";
        request(cb);
    }

    let goods_delete = (cb) => {
        options.method = "DELETE";
        options.path = "/goods?id=1";
        request(cb);
    }

    goods_post(() => {
        goods_get(() => {
            goods_delete(callback);
        });
    });
}

/**
 * 회원 관리 API 테스트
 */
let members = (callback) => {
    let members_post = (cb) => {
        options.method = "POST";
        options.path = "/members";
        request(cb, {
            username : "test_account",
            password : "1234",
            passwordConfirm : "1234"
        });
    }

    let members_get = (cb) => {
        options.method = "GET";
        options.path = "/members?username=test_account&password=1234";
        request(cb);
    }

    let members_delete = (cb) => { 
        options.method = "DELETE";
        options.path = "/members?username=test_account";
        request(cb);
    }

    members_delete(() => {
        members_post(() => {
            members_get(callback);
        });
    });
}

/**
 * 구매 관리 API 테스트
 */
let purchases = (callback) => {
    let purchases_post = (cb) => {
        options.method = "POST";
        options.path = "/purchases";
        request(cb, {
            userid : 1,
            goodsid : 1
        });
    }

    let purchases_get = (cb) => {
        options.method = "GET";
        options.path = "/purchases?userid=1";
        request(cb);
    }

    purchases_post(() => {
        purchases_get(() => {
            callback();
        });
    });
}

console.log("======================================== members ========================================");
members(() => {
    console.log("======================================== goods ========================================");
    goods(() => {
        console.log("======================================== purchases ========================================");
        purchases(() => {
            console.log("done");
        });
    });
});