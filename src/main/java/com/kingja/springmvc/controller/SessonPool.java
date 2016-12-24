package com.kingja.springmvc.controller;


import com.google.gson.Gson;
import org.apache.log4j.Logger;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Description：TODO
 * Create Time：2016/12/23 16:53
 * Author:KingJA
 * Email:kingjavip@gmail.com
 */
public class SessonPool {
    private static Logger logger = Logger.getLogger(SessonPool.class);
    private Gson gson = new Gson();
    private static List<WebSocketSession> socketSessionsList = new ArrayList<WebSocketSession>();
    private static Map<String, WebSocketSession> socketSessionsMap = new HashMap<String, WebSocketSession>();//我的SessonId/对方的Sesson

    /**
     * 配对玩家 1VS1
     * @param socketSession
     */
    public static void setPair(WebSocketSession socketSession) {
        if (socketSessionsList.size() > 0) {
            WebSocketSession otherSocketSession = socketSessionsList.remove(0);
            socketSessionsMap.put(socketSession.getId(), otherSocketSession);
            socketSessionsMap.put(otherSocketSession.getId(), socketSession);
            //通知对手 我的Id
            TextMessage msgSend2Other = new TextMessage("{\"resultCode\":11,\"otherName\":"+socketSession.getId()+"}");
            //通知自己 对手的Id
            TextMessage msgSend2Me = new TextMessage("{\"resultCode\":10,\"otherName\":"+otherSocketSession.getId()+"}");
            try {
                otherSocketSession.sendMessage(msgSend2Other);
                socketSession.sendMessage(msgSend2Me);
            } catch (IOException e) {
                e.printStackTrace();
            }
            logger.error("有配对，和"+otherSocketSession.getId()+"建立连接");
            System.out.println("有配对，和"+otherSocketSession.getId()+"建立连接");
        } else {
            logger.error("没有配对，等待");
            System.out.println("没有配对，等待");
            socketSessionsList.add(socketSession);
        }
    }
    /*
    * 1:配对通知
    * */

    public static void removePair(WebSocketSession socketSession) {
        WebSocketSession otherSession = socketSessionsMap.get(socketSession.getId());

        socketSessionsMap.remove(otherSession.getId());
        socketSessionsMap.remove(socketSession);
        //通知对手 我的Id
        sendMessage(otherSession, "{\"resultCode\":4,\"otherName\":"+socketSession.getId()+"}");
    }

    private static void sendMessage(WebSocketSession otherSession, String json) {
        TextMessage msgSend2Other = new TextMessage(json);
        try {
            otherSession.sendMessage(msgSend2Other);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
