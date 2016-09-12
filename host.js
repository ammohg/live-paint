/// <reference path="typings/index.d.ts" />
/**
 * Created by yusuke on 2014/11/25.
 */

$(document).ready(function () {
    MediaStream = window.MediaStream || window.webkitMediaStream || window.mozMediaStream;

    /** @type {HTMLCanvasElement} */
    var canvas = document.getElementById('canvas');

    // 定数宣言
    var APIKEY = '9365ae81-9216-4be6-ad80-a49ae077c6fe';

    // グローバル変数
    var myPeerid = '';
    var myStream = null;
    /** @type {MediaConnection[]} */
    var callList = [];
    /** @type {PeerJs.DataConnection} */
    var conn;

    // getUserMediaのcompatibility
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

    // Peerオブジェクトを生成
    var peer = new Peer({
        key: APIKEY,
        debug: 3
    });

    // エラーハンドラ
    peer.on('error', function (err) {
        console.error(err);
    });

    // openイベントのハンドラ
    peer.on('open', function (id) {
        myPeerid = id;
        console.log('My peer ID is: ' + id);

        // カメラ映像を取得して表示する
        // navigator.getUserMedia({
        //     audio: true,
        //     video: true
        // }, function(stream){
        //     $('#myStream').prop('src', URL.createObjectURL(stream));
        //     myStream = stream;

        //     // 全ユーザと接続を行う
        //     connectToPeers();
        // }, function(){
        //     console.error('getUserMedia error');
        // });

        myStream = canvas.captureStream(60);
        $('#myStream').prop('src', URL.createObjectURL(myStream));

        connectToPeers();
        setInterval(connectToPeers, 2000)
    });

    // callイベント用のハンドラを設置
    peer.on('call', function (call) {
        // 相手からcallイベントがきたらstreamを送り返す（応答する）
        call.answer(myStream);

    });

    // ユーザリストを取得して片っ端から繋ぐ
    function connectToPeers() {
        peer.listAllPeers(function (list) {
            for (var cnt = 0; cnt < list.length; cnt++) {
                var isNewPeer = callList.every(function (call) {
                    return call.peer !== list[cnt];
                });

                if (myPeerid != list[cnt] && isNewPeer) {
                    var call = peer.call(list[cnt], myStream);
                    addCall(call);

                    call.on('close', function() {
                        call.close();
                        removeCall(call);
                    })
                }
            }
        });
    }

    // コールの追加
    function addCall(call) {
        callList.push(call);
    }

    // コールの削除
    function removeCall(call) {
        var position = callList.indexOf(call);
        if (position > 0) {
            callList.splice(position, 1)
        }
    }

    peer.on('open', function () {
        // 自分のIDを表示する
        // - 自分のIDはpeerオブジェクトのidプロパティに存在する
        // - 相手はこのIDを指定することで、通信を開始することが出来る
        $('#my-id').text(peer.id);
    });

    // 相手からデータ通信の接続要求イベントが来た場合、このconnectionイベントが呼ばれる
    // - 渡されるconnectionオブジェクトを操作することで、データ通信が可能
    peer.on('connection', function (connection) {
        // データ通信用に connectionオブジェクトを保存しておく
        conn = connection;

        // 接続が完了した場合のイベントの設定
        conn.on("open", function () {
        });

        // メッセージ受信イベントの設定
        conn.on("data", function (data) {
            // 画面に受信したメッセージを表示
            console.log(data)
            if (typeof data === 'string')
                $(".messagesContainer").append($("<p>").text(data));
            else
                $(".messagesContainer").append($("<img>").attr('src', data.image).attr('width', 100));
        });
    });
});

