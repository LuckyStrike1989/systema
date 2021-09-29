let map = {};

class distributor extends require('./server.js') {
    constructor() {
        // Server 클래스 생성자 호출
        super("distributor", 9000, ["POST/distributes", "GET/distributes"]);
    }
}

new distributor();
