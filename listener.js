/// <reference path="typings/index.d.ts" />
/**
 * Created by yusuke on 2014/11/25.
 */

$(document).ready(function () {
    MediaStream = window.MediaStream || window.webkitMediaStream || window.mozMediaStream;

    /** @type {HTMLCanvasElement} */
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext("2d");

    // 定数宣言
    var APIKEY = '9365ae81-9216-4be6-ad80-a49ae077c6fe';

    /** @type {PeerJs.DataConnection} */
    var conn;

    // グローバル変数
    var myPeerid = '';
    var myStream = null;

    /** @type {PeerJs.MediaConnection} */
    var host = null;

    // Peerオブジェクトを生成
    var peer = new Peer({ key: APIKEY, debug: 3 });

    // エラーハンドラ
    peer.on('error', function (err) {
        console.error(err);
    });

    // openイベントのハンドラ
    peer.on('open', function (id) {
        myPeerid = id;
        console.log('My peer ID is: ' + id);
    });

    // callイベント用のハンドラを設置
    peer.on('call', function (call) {
        // 相手からcallイベントがきたらstreamを送り返す（応答する）
        call.answer();

        // hostを登録
        host = call;

        setupCallEventHandlers(call);

        console.log('id!!!!!', call.id);

        var peer_id = call.id;

        // 相手への接続を開始する
        conn = peer.connect('host');

        // 接続が完了した場合のイベントの設定
        conn.on("open", function () {
            // 相手のIDを表示する
            // - 相手のIDはconnectionオブジェクトのidプロパティに存在する
            $("#peer-id").text(conn.id);
        });

        // メッセージ受信イベントの設定
        conn.on("data", onRecvMessage);

    });

    // callオブジェクトのイベントをセットする
    function setupCallEventHandlers(call) {
        // 相手からstreamイベンがきたらそのstreamをVIDEO要素に表示する
        call.on('stream', function (stream) {
            addVideo(call, stream);
        });

        // 相手からcloseイベントがきたらコネクションを切断して保存した
        // callオブジェクトを削除、対応するVIDEOS要素も削除
        call.on('close', function () {
            call.close();
            removeVideo(call);
        });
    }

    // VIDEO要素を追加する
    function addVideo(call, stream) {
        var videoDom = $('<video autoplay>');
        videoDom.attr('id', call.peer);
        videoDom.prop('src', URL.createObjectURL(stream));

        $('.videoContainer').append(videoDom);
    }

    // VIDEO要素を削除する
    function removeVideo(call) {
        $('#' + call.peer).remove();
    }
    $('#commentbutton').click(function () {
        $comment = $('#comment');
        conn.send($comment.val())
        $comment.val('')
    })
    $('#sendImage').click(function() {
        conn.send({
            image: canvas.toDataURL('image/png')
        })
    })
    // 相手からデータ通信の接続要求イベントが来た場合、このconnectionイベントが呼ばれる
    // - 渡されるconnectionオブジェクトを操作することで、データ通信が可能
    peer.on('connection', function (connection) {

        // データ通信用に connectionオブジェクトを保存しておく
        conn = connection;

        // 接続が完了した場合のイベントの設定
        conn.on("open", function () {
            // 相手のIDを表示する
            // - 相手のIDはconnectionオブジェクトのidプロパティに存在する
            $("#peer-id").text(conn.id);
        });

        // メッセージ受信イベントの設定
        conn.on("data", onRecvMessage);
    });

    $('#copy').click(function() {
        ctx.drawImage($('video')[0], 0,0)
    })
    
});

function onRecvMessage(data) {
    // 画面に受信したメッセージを表示
    $("#messagesContainer").append($("<p>").text(conn.id + ": " + data).css("font-weight", "bold"));
}