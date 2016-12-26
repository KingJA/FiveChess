var webSocket = null;
var url = null;

$(function () {

});

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
            startMyTime();
        } else if (jsonObject.resultCode == 10) {//玩家进场,通知后来的人
            otherName.innerHTML = jsonObject.otherName;
            otherHead.src = "/img/head_3.jpg";
            statusText.innerHTML = "对方落子";
            isPared = true;

        } else if (jsonObject.resultCode == 8) {//玩家落子
            myTurn = true;
            if (jsonObject.otherWin) {
                isWin=false;
                statusText.innerHTML = "惜败";
                showWinModal("对方赢了，再来一局吧");
            }else{
                onStep(jsonObject.i, jsonObject.j, false)
            }
        }


    };
    webSocket.onclose = function (event) {

    };
}

