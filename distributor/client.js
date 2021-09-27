'use strict';

const net = require('net');

/**
 * tcpclient 클래스
 */
class tcpClient {
    /**
     * 생성자
     * @param {*} host 접속정보 IP 
     * @param {*} port 접속정보 Port
     * @param {*} onCreate 접속 완료
     * @param {*} onRead 데이터 수신
     * @param {*} onEnd 접속 종료
     * @param {*} onError 에러 발생 이벤트
     */
    constructor(host, port, onCreate, onRead, onEnd, onError) {
        this.options = {
            host : host,
            port : port
        };

        this.onCreate = onCreate;
        this.onRead = onRead;
        this.onEnd = onEnd;
        this.onError = onError;
    }
}

module.exports = tcpClient;
