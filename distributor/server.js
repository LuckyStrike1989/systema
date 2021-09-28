'use strict';

const net = require('net');
const tcpClient = require('./client.js');

class tcpServer {
    constructor(name, port, urls) {
        // 서버 정보
        this.context = {
            port : port,
            name : name, 
            urls : urls
        }

        this.merge = {};

        /**
         * 서버 생성
         */
        this.server = net.createServer((socket) => {
            // 클라이언트 접속 처리
            this.onCreate(socket);

            // 에러 처리
            socket.on('error', (exception) => {
                this.onClose(socket);
            });

            // 접속 종료 처리
            socket.on('close', () => {
                this.onClose(socket);
            });

            // 데이터 수신 처리
            socket.on('data', (data) => {
                let key = socket.remoteAddress + ":" + socket.remotePort;
                let sz = this.merge[key] ? this.merge[key] + data.toString() : data.toString();
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
        });

        /**
         * 서버 에러 처리
         */
        this.server.on('error', (err) => {
            console.log(err);
        });

        this.server.listen(port, () => {
            console.log('listen => ', this.server.address());
        });
    }

    onCreate(socket) {
        console.log("onCreate => ", socket.remoteAddress, socket.remotePort);
    }

    onClose(socket) {
        console.log("onClose => ", socket.remoteAddress, socket.remotePort);
    }
}

module.exports = tcpServer;