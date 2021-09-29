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

    /**
     * 접속 함수
     */
    connect() {
        this.client = net.connect(this.options, () => {
            if( this.onCreate ) {
                // 접속 완료 이벤트 콜백
                this.onCreate(this.options);
            }
        });
        
        this.client.on('data', (data) => {
            // 데이터 수신 처리
            let sz = this.merge ? this.merge + data.toString() : data.toString();
            let arr = sz.split('¶');

            for(let n in arr) {
                if( (sz.charAt(sz.length - 1) != '¶') && (n == arr.length - 1) ) {
                    this.merge = arr[n];
                    break;
                } else if( arr[n] == "" ) {
                    break;
                } else {
                    this.onRead(this.options, JSON.parse(arr[n]));
                }
            }
        });

        this.client.on('close', () => {
            // 접속 종료 처리
            if( this.onEnd ) {
                this.onEnd(this.options);
            }
        });

        this.client.on('error', (err) => {
            // 에러 발생 처리
            if( this.onError ) {
                this.onError(this.options, err);
            }
        });
    }

    /**
     * 데이터 발송
     */
    write(packet) {
        this.client.write(JSON.stringify(packet) + '¶');
    }
}

module.exports = tcpClient;
