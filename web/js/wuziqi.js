/**
 * Created by Administrator on 2016/12/22.
 */
window.onload = initPage;
var chess = document.getElementById("chess");
var checkerboardSize = chess.width;
var context = chess.getContext("2d");
/*行列数*/
var n = 2;
var count = 2;
var lineColor = "#a3a3a3";
var perSize = checkerboardSize / (count + 1);
var imageUrl = "/img/picture.jpg";
var image = new Image();
var history = [];
var myTurn = false;
var isOver = false;
var isPared = false;
var isWin = false;
var winCount = 0;
/*赢法数组*/
var win = [];
/*我赢统计数组*/
var myWin = [];
/*对方赢统计数组*/
var otherWin = [];
/*剩余时间，初始600秒*/
var myLeftTime = 600;
var myTotleTime = 0;
var myTimeInterval;
var global = {
    myLeftTime: 600,
    myTotleTime: 0
};

function startMyTime() {
    myTimeInterval = setInterval(function () {
        showTime(myTotleTime, myTotle);
        showTime(myLeftTime, myLeft);
        if (myLeftTime == 0) {
            clearInterval(myTimeInterval);
            console.log("时间到了");
        } else {
            myTotleTime++;
            myLeftTime--;
        }
    }, 1000);
}

function stopMyTime() {
    clearInterval(myTimeInterval);
}
function showTime(time, timeNode) {
    var min = Math.floor(time / 60);
    var sec = time % 60;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;
    timeNode.innerHTML = min + ":" + sec;
}


var otherName = document.getElementById("otherName");
var otherHead = document.getElementById("otherHead");
var statusText = document.getElementById("statusText");
var myLeft = document.getElementById("myLeftTime");
var myTotle = document.getElementById("myTotleTime");


function initPage() {
    console.log("初始化页面")
    connect("/websocket");//WebSocket连接
    initGame();
}

function reStart() {
    setTimeout(function () {
        initVariable();
        initGame();
    }, 100);
}

function initVariable() {
    myTurn = isWin ? true : false;
    statusText.innerHTML = isWin ? "我方落子" : "对方落子";
    isOver = false;
}
function initGame() {
    initTime();
    initRule();//初始化游戏逻辑
    drawChess();//绘制棋盘
}
function initTime() {
    myLeftTime = global.myLeftTime;
    myTotleTime = global.myTotleTime;
    showTime(myTotleTime, myTotle);
    showTime(myLeftTime, myLeft);
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
                console.log("竖向的赢法[" + i + "][" + (j + k) + "][" + winCount + "]");
            }

        }
    }
//横向的赢法
    for (var i = 1; i <= count; i++) {
        for (var j = 1; j <= count - n + 1; j++) {
            winCount++;
            for (var k = 0; k < n; k++) {
                win[j + k][i][winCount] = true
                console.log("横向的赢法[" + (j + k) + "][" + i + "][" + winCount + "]");
            }

        }
    }
//右斜向的赢法
    for (var i = 1; i <= count - n + 1; i++) {
        for (var j = 1; j <= count - n + 1; j++) {
            winCount++;
            for (var k = 0; k < n; k++) {
                win[i + k][j + k][winCount] = true
                console.log("右斜向的赢法[" + (i + k) + "][" + (j + k) + "][" + winCount + "]");
            }

        }
    }
//左斜向的赢法
    for (var i = 1; i <= count - n + 1; i++) {
        for (var j = count; j >= n; j--) {
            winCount++;
            for (var k = 0; k < n; k++) {
                win[i + k][j - k][winCount] = true
                console.log("左斜向的赢法[" + (i + k) + "][" + (j - k) + "][" + winCount + "]");
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
        statusText.innerHTML = "对方落子";
        stopMyTime();
        for (var k = 1; k <= winCount; k++) {
            if (win[i][j][k]) {
                myWin[k]++;
                otherWin[k] = n + 1;
                if (myWin[k] == n) {
                    isOver = true;//结束
                    sendMsg(i, j, true);//通知服务器我赢了
                    showWinModal("恭喜你赢了");
                    statusText.innerHTML = "获胜";
                    isWin = true;
                }
            }
        }
    }
}

function showWinModal(msg) {
    setTimeout(function () {
        alert(msg);
        reStart();
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
    console.log("落子完成")
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
    console.log("绘制棋盘背景")
    image.src = imageUrl;
    image.onload = function () {
        context.drawImage(image, 50, 50, 400, 400, 0, 0, checkerboardSize, checkerboardSize);
        drawLines();
    }

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

