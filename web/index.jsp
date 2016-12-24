<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>绝杀五子君</title>
  <link rel="stylesheet" href="/css/wuziqi.css?v=1.1">
</head>
<body>
<div class="container">

 <div class="top"><p class="statusP"><span id="statusText">等待玩家进入</span></p></div>
<div class="left">  <div class="user">
  <p class="des"> <img class="head" src="" width="200px" height="200px" id="otherHead"></p>
  <p class="des"><span class="title" >玩家：</span><span class="text" id="otherName"></span></p>
  <p class="des"><span class="title">积分：</span><span class="text"></span></p>
  <p class="des"><span class="title">落子时间：</span><span class="text"></span></p>
  <p class="des"><span class="title">剩余时间：</span><span class="text"></span></p>

</div></div>
<div class="middle">
  <canvas id="chess" width="630" height="630"></canvas>
</div>
<div class="right">
  <div class="user">
    <p class="des"> <img class="head"  src="/img/head_7.jpg" width="200px" height="200px"  id="myHead"></p>
    <p class="des"><span class="title" >玩家：</span><span class="text" id="myName">GM玩家</span></p>
    <p class="des"><span class="title">积分：</span><span class="text">0</span></p>
    <p class="des"><span class="title">落子时间：</span><span class="text">00:00</span></p>
    <p class="des"><span class="title">剩余时间：</span><span class="text">10:00</span></p>

  </div>

</div>
</div>


<script src="/js/jquery-3.1.1.min.js"></script>
<script src="/js/wuziqi.js?v=1.0"></script>
</body>
</html>