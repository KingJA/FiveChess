package com.kingja.springmvc.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by 一线生 on 2015/11/22.
 * 说明：用户池（sessionId/session）
 */
public class UserPool {
    private static Logger LOG = LoggerFactory.getLogger(UserPool.class);

    private static Map<String, Object> USER_POOL = new HashMap<String, Object>();

    public static void add(WebSocketSession session) {
        USER_POOL.put(session.getId(), session);
        LOG.info("user [" + session.getId() + "] connected");
    }

    public static void remove(String sessionId) {
        USER_POOL.remove(sessionId);
        LOG.info("user [" + sessionId + "] closed");
    }

    public static WebSocketSession get(String sessionId) {
        return (WebSocketSession) USER_POOL.get(sessionId);
    }

    public static Map<String, Object> getUserPool() {
        return USER_POOL;
    }
}
