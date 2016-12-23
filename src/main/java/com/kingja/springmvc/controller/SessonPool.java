package com.kingja.springmvc.controller;


import org.springframework.web.socket.WebSocketSession;

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
    private static List<WebSocketSession> socketSessionsList = new ArrayList<WebSocketSession>();
    private static Map<String, WebSocketSession> socketSessionsMap = new HashMap<String, WebSocketSession>();//我的SessonId/对方的Sesson

    /**
     * 配对玩家 1VS1
     * @param socketSession
     */
    public void setPair(WebSocketSession socketSession) {
        if (socketSessionsList.size() > 0) {
            WebSocketSession otherSocketSession = socketSessionsList.remove(0);
            socketSessionsMap.put(socketSession.getId(), otherSocketSession);
            socketSessionsMap.put(otherSocketSession.getId(), socketSession);
        } else {
            socketSessionsList.add(socketSession);
        }
    }

}
