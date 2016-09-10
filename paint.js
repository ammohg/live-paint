
$(document).ready(function () {
    //canvasの読み込み設定
    var canvas = document.getElementById("canvas");
    canvas.width = 500;
    canvas.height = 400;
    var ctx = canvas.getContext("2d");

    // 背景を白に
    var fillStyle = ctx.fillStyle;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = fillStyle;

    //マウスを操作する
    var mouse = { x: 0, y: 0, x1: 0, y1: 0, color: "black" };
    var draw = false;

    //マウスの座標を取得する
    canvas.addEventListener("mousemove", function (e) {
        var rect = e.target.getBoundingClientRect();
        ctx.lineWidth = document.getElementById("lineWidth").value;
        ctx.globalAlpha = document.getElementById("alpha").value / 100;

        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        //クリック状態なら描画をする
        if (draw === true) {
            ctx.beginPath();
            ctx.moveTo(mouseX1, mouseY1);
            ctx.lineTo(mouseX, mouseY);
            ctx.lineCap = "round";
            ctx.stroke();
            mouseX1 = mouseX;
            mouseY1 = mouseY;
        }
    });

    //クリックしたら描画をOKの状態にする
    canvas.addEventListener("mousedown", function (e) {
        draw = true;
        mouseX1 = mouseX;
        mouseY1 = mouseY;
        undoImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    });

    //クリックを離したら、描画を終了する
    canvas.addEventListener("mouseup", function (e) {
        draw = false;
    });


    //線の太さの値を変える
    lineWidth.addEventListener("mousemove", function () {
        var lineNum = document.getElementById("lineWidth").value;
        document.getElementById("lineNum").innerHTML = lineNum;
    });

    //透明度の値を変える
    alpha.addEventListener("mousemove", function () {
        var alphaNum = document.getElementById("alpha").value;
        document.getElementById("alphaNum").innerHTML = alphaNum;
    });

    //色を選択
    $('.rgb').change(function (e) {
        ctx.strokeStyle = 'rgb(' + [$('#rgb-r').val(), $('#rgb-g').val(), $('#rgb-b').val()].join(',') + ')'
    });

    //消去ボタンを起動する
    $('#clear').click(function (e) {
        if (!confirm('本当に消去しますか？')) return;
        e.preventDefault();
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        var fillStyle = ctx.fillStyle;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = fillStyle;
    });

    //戻るボタンを配置
    $('#undo').click(function (e) {
        ctx.putImageData(undoImage, 0, 0);
    });


    //保存する
    function save() {
        var can = canvas.toDataURL("image/png");
        can = can.replace("image/png", "image/octet-stream");
        window.open(can, "save");

    }

    //スマホ用
    var finger = new Array;
    for (var i = 0; i < 10; i++) {
        finger[i] = {
            x: 0, y: 0, x1: 0, y1: 0,
            color: "rgb("
            + Math.floor(Math.random() * 16) * 15 + ","
            + Math.floor(Math.random() * 16) * 15 + ","
            + Math.floor(Math.random() * 16) * 15
            + ")"
        };
    }

    //タッチした瞬間座標を取得
    canvas.addEventListener("touchstart", function (e) {
        e.preventDefault();
        var rect = e.target.getBoundingClientRect();
        ctx.lineWidth = document.getElementById("lineWidth").value;
        ctx.globalAlpha = document.getElementById("alpha").value / 100;
        undoImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < finger.length; i++) {
            finger[i].x1 = e.touches[i].clientX - rect.left;
            finger[i].y1 = e.touches[i].clientY - rect.top;



        }
    });

    //タッチして動き出したら描画
    canvas.addEventListener("touchmove", function (e) {
        e.preventDefault();
        var rect = e.target.getBoundingClientRect();
        for (var i = 0; i < finger.length; i++) {
            finger[i].x = e.touches[i].clientX - rect.left;
            finger[i].y = e.touches[i].clientY - rect.top;
            ctx.beginPath();
            ctx.moveTo(finger[i].x1, finger[i].y1);
            ctx.lineTo(finger[i].x, finger[i].y);
            ctx.lineCap = "round";
            ctx.stroke();
            finger[i].x1 = finger[i].x;
            finger[i].y1 = finger[i].y;

        }
    });

    //線の太さの値を変える
    lineWidth.addEventListener("touchmove", function () {
        var lineNum = document.getElementById("lineWidth").value;
        document.getElementById("lineNum").innerHTML = lineNum;
    });

    //透明度の値を変える
    alpha.addEventListener("touchmove", function () {
        var alphaNum = document.getElementById("alpha").value;
        document.getElementById("alphaNum").innerHTML = alphaNum;
    });
});