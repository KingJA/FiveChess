/**
 * Created by Administrator on 2016/12/22.
 */
window.onload=initPage;
var chess = document.getElementById("chess");
var checkerboardSize = chess.width;
var context = chess.getContext("2d");
/*行列数*/
var n = 5;
var count = 15;
var lineColor = "#a3a3a3";
var perSize = checkerboardSize / (count + 1);
var imageUrl = "/img/picture.jpg";
var image = new Image();
var history = [];
var myTurn = false;
var isOver = false;
var isPared = false;
var isWin=false;
var winCount = 0;
/*赢法数组*/
var win = [];
/*我赢统计数组*/
var myWin = [];
/*对方赢统计数组*/
var otherWin = [];

var webSocket = null;
var url = null;

var otherName = document.getElementById("otherName");
var otherHead = document.getElementById("otherHead");
var statusText = document.getElementById("statusText");


function initPage() {
    console.log("初始化页面")
    connect("/websocket");//WebSocket连接
    initGame();
}

function reStart() {
    initVariable();
    initGame();
}

function initVariable() {
     myTurn = isWin?true:false;
    statusText.innerHTML =isWin? "我方落子":"对方落子";
     isOver = false;
}
function initGame() {
    initRule();//初始化游戏逻辑
    drawChess();//绘制棋盘
}
function initRule() {
    console.log("初始化游戏规则")
//可落子区域
    for (var i = 1; i <= count + 1; i++) {
        history[i] = [];
        for (var j = 1; j < count + 1; j++) {
            history[i][j] = 0;
        }
    }
    for (var i = 1; i <= count; i++) {
        win[i] = [];
        for (var j = 1; j <= count; j++) {
            win[i][j] = [];
        }
    }

//竖向的赢法
    for (var i = 1; i <= count; i++) {
        for (var j = 1; j <= count - n + 1; j++) {
            winCount++;
            for (var k = 0; k < n; k++) {
                win[i][j + k][winCount] = true
                // console.log("竖向的赢法[" + i + "][" + (j + k) + "][" + winCount + "]");
            }

        }
    }
//横向的赢法
    for (var i = 1; i <= count; i++) {
        for (var j = 1; j <= count - n + 1; j++) {
            winCount++;
            for (var k = 0; k < n; k++) {
                win[j + k][i][winCount] = true
                // console.log("横向的赢法[" + (j + k) + "][" + i + "][" + winCount + "]");
            }

        }
    }
//右斜向的赢法
    for (var i = 1; i <= count - n + 1; i++) {
        for (var j = 1; j <= count - n + 1; j++) {
            winCount++;
            for (var k = 0; k < n; k++) {
                win[i + k][j + k][winCount] = true
                // console.log("右斜向的赢法[" + (i + k) + "][" + (j + k) + "][" + winCount + "]");
            }

        }
    }
//左斜向的赢法
    for (var i = 1; i <= count - n + 1; i++) {
        for (var j = count; j >= n; j--) {
            winCount++;
            for (var k = 0; k < n; k++) {
                win[i + k][j - k][winCount] = true
                // console.log("左斜向的赢法[" + (i + k) + "][" + (j - k) + "][" + winCount + "]");
            }

        }
    }
//初始化赢法统计数组
    for (var i = 1; i <= winCount; i++) {
        myWin[i] = 0;
        otherWin[i] = 0;
    }
}


chess.onclick = function (e) {
    //等待游戏配对
    if (!isPared) {
        return alert("等待其他玩家进来");
    }
    //1.判断游戏未来结束
    if (isOver) {
        return showWinModal();
    }

    //2.判断是否轮到我下子
    if (!myTurn) {
        return alert("等待对方落子");
    }

    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.round(x / perSize);
    var j = Math.round(y / perSize);
    //是否在可落子区域
    if (i == 0 || j == 0) {
        return;
    }

    if (!history[i][j]) {//可落子
        onStep(i, j, true);//绘制落子
        history[i][j] = 1;

        sendMsg(i, j, false);//发送服务器
        myTurn = false;
        status.innerHTML = "对方落子";
        for (var k = 1; k <= winCount; k++) {
            if (win[i][j][k]) {
                myWin[k]++;
                otherWin[k] = 6;
                if (myWin[k] == 5) {
                    isOver = true;//结束
                    sendMsg(i, j, true);//通知服务器我赢了
                    showWinModal("恭喜你赢了");
                    isWin=true;
                }
            }
        }
    }
}

function showWinModal(msg) {
    setTimeout(function () {
        var check = confirm(msg);
        if (check){
            reStart();
        }
    }, 100);
}


/**
 * 绘制棋子
 * @param i
 * @param j
 * @param me
 */
function onStep(i, j, me) {
    context.beginPath();
    context.arc(i * perSize, j * perSize, perSize / 3, 0, 2 * Math.PI);
    context.closePath();
    var gradient = context.createRadialGradient(i * perSize, j * perSize, 0, i * perSize, j * perSize, perSize * 0.25);
    if (me) {
        gradient.addColorStop(0, "#636766");
        gradient.addColorStop(1, "#0a0a0a");
    } else {
        gradient.addColorStop(0, "#f9f9f9");
        gradient.addColorStop(1, "#a0a0a0");
    }

    context.fillStyle = gradient;
    context.fill();
}


/**
 * 画棋盘线
 * @param count 格子数
 */
function drawLines() {
    console.log("绘制棋盘横竖线")
    context.strokeStyle = lineColor;
    //画横线
    for (var i = 0; i < count; i++) {
        context.moveTo(perSize, perSize + i * perSize);
        context.lineTo(checkerboardSize - perSize, perSize + i * perSize);
        context.stroke();
    }
    //画竖线
    for (var i = 0; i < count; i++) {
        context.moveTo(perSize + i * perSize, perSize);
        context.lineTo(perSize + i * perSize, checkerboardSize - perSize);
        context.stroke();
    }
}

/**
 * 绘制背景图片
 */
function drawChess() {
    console.log("清理画布："+checkerboardSize)
    context.clearRect(0,0,checkerboardSize,checkerboardSize)
    console.log("绘制棋盘背景")
    image.src = imageUrl;
    image.onload = function () {
        context.drawImage(image, 50, 50, 400, 400, 0, 0, checkerboardSize, checkerboardSize);
        drawLines();
    }

}
/**
 * 建立WebSocket连接
 * @param urlPath
 */
function connect(urlPath) {
    console.log("初始化WebSocket")
    if (!("WebSocket" in window)) {
        alert("当前浏览器不支持WebSocket，请更换浏览器或者升级到最新版本");
    }

    if (window.location.protocol == 'http:') {
        url = 'ws://' + window.location.host + urlPath;
    } else {
        url = 'wss://' + window.location.host + urlPath;
    }
    webSocket = new WebSocket(url);
    initWebSocket();
}
/**
 * 初始化WebSocket
 */
function initWebSocket() {
    webSocket.onopen = function () {
    };
    webSocket.onmessage = function (event) {
        console.log("接收到服务器的信息:" + event.data);

        var jsonObject = JSON.parse(event.data);


        if (jsonObject.resultCode == 11) {//玩家进场,通知先来的人
            myTurn = true;
            isPared = true;
            statusText.innerHTML = "我方落子";
            otherName.innerHTML = jsonObject.otherName;
            otherHead.src = "/img/head_3.jpg"
        } else if (jsonObject.resultCode == 10) {//玩家进场,通知后来的人
            otherName.innerHTML = jsonObject.otherName;
            otherHead.src = "/img/head_3.jpg";
            statusText.innerHTML = "对方落子";
            isPared = true;

        } else if (jsonObject.resultCode == 8) {//玩家落子
            myTurn = true;
            onStep(jsonObject.i, jsonObject.j, false)
            if (jsonObject.otherWin) {
                isWin=false;
                showWinModal("对方赢了，再来一局吧");
            }
        }


    };
    webSocket.onclose = function (event) {

    };
}
/**
 * 发送信息
 * @param i
 * @param j
 * @param win
 */
function sendMsg(i, j, win) {
    if (webSocket != null) {
        var msg = JSON.stringify({"resultCode": 8, "i": i, "j": j, "otherWin": win});
        webSocket.send(msg);
    } else {
        alert('connection not established, please connect.');
    }
}

