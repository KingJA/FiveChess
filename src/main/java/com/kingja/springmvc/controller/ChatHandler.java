package com.kingja.springmvc.controller;


import com.google.gson.Gson;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Set;


/**
 * 用户通讯聊天控制器类
 * @author yyp
 *2014年12月27日下午6:56:46
 */
@RequestMapping("websocket")
public class ChatHandler extends TextWebSocketHandler {

		
	@Override
	protected void handleTextMessage(WebSocketSession session,
			TextMessage message) throws Exception {
		super.handleTextMessage(session, message);
		System.out.println("message"+message.getPayload());

		sendAll(session, message);
	}

	private void sendAll(WebSocketSession session, TextMessage message) {
		//给所有用户发送消息
		Set<String> keys = UserPool.getUserPool().keySet();
		for(String key : keys) {
			WebSocketSession webSocketSession = UserPool.get(key);
			//屏蔽状态关闭的用户
			if(!session.isOpen()) {
				UserPool.remove(session.getId());
				continue;
			}
			//排除自己
			if(session.equals(webSocketSession)) {
				continue;
			}
			try {
				//发送消息
				webSocketSession.sendMessage(message);
			} catch (IOException e) {
			}
		}
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		UserPool.add(session);
		System.out.println(session.getId()+" 建立连接");
		//进入聊天室 在头像列表中增加头像
		//增加当前聊天室人数
	}
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		UserPool.remove(session.getId());
		System.out.println("Websocket断开连接");
		//进入聊天室 在头像列表中 删除头像
		//减少当前聊天室人数
	}
	

}
