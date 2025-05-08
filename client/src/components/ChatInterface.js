/**
 * 聊天界面组件
 * 包含消息列表、输入区域和图片上传功能
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Spin, Alert } from 'antd';
import MessageList from './MessageList';
import InputArea from './InputArea';
import axios from 'axios';
import './ChatInterface.css';

/**
 * 聊天界面组件
 * 管理对话状态和API交互
 * @param {Object} props - 组件属性
 * @param {string} props.sessionId - 当前会话ID
 */
const ChatInterface = ({ sessionId }) => {
  // 消息列表状态
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'assistant', 
      content: '您好！我是AI助手。您可以输入描述来生成图片，或者上传一张白天的图片，我可以帮您转换为夜景效果。',
      timestamp: new Date()
    }
  ]);
  
  // 加载状态
  const [loading, setLoading] = useState(false);
  
  // 错误状态
  const [error, setError] = useState(null);
  
  // 上传的图片URL
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  
  // 消息列表底部引用，用于自动滚动
  const messagesEndRef = useRef(null);
  
  // 每当消息更新时，自动滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  /**
   * 发送消息到后端
   * @param {string} messageText - 用户输入的消息文本
   */
  const sendMessage = async (messageText) => {
    try {
      // 添加用户消息到列表
      const userMessage = {
        id: messages.length + 1,
        type: 'user',
        content: messageText,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setLoading(true);
      setError(null);
      
      // 准备API请求数据
      const requestData = {
        message: messageText,
        sessionId
      };
      
      // 如果有上传的图片，也发送图片URL
      if (uploadedImageUrl) {
        requestData.imageUrl = uploadedImageUrl;
      }
      
      console.log('发送消息到服务器:', requestData);
      
      // 发送请求到后端API
      const response = await axios.post('/api/chat', requestData);
      console.log('服务器响应:', response.data);
      
      // 处理API响应
      if (response.data.success) {
        // 添加助手回复到消息列表
        const assistantMessage = {
          id: messages.length + 2,
          type: 'assistant',
          content: response.data.response.text,
          imageUrl: response.data.response.imageUrl,
          isQuestion: response.data.response.isQuestion, // 传递是否是提问消息的标志
          timestamp: new Date()
        };
        
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
        
        // 如果生成了新图片，清除当前上传的图片
        if (response.data.response.imageUrl) {
          setUploadedImageUrl(null);
        }
      } else {
        setError('消息发送失败，请重试');
      }
    } catch (err) {
      console.error('发送消息时出错:', err);
      setError('发送消息时出错，请重试');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理图片上传完成事件
   * @param {string} imageUrl - 上传完成后的图片URL
   */
  const handleImageUploaded = (imageUrl) => {
    console.log('图片上传完成:', imageUrl);
    setUploadedImageUrl(imageUrl);
  };

  return (
    <Card className="chat-interface" id="src/components/ChatInterface.js:105:5">
      {/* 错误提示 */}
      {error && (
        <Alert
          message="错误"
          description={error}
          type="error"
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 16 }}
          id="src/components/ChatInterface.js:114:9"
        />
      )}
      
      {/* 消息列表 */}
      <div className="messages-container" id="src/components/ChatInterface.js:122:7">
        <MessageList messages={messages} id="src/components/ChatInterface.js:123:9" />
        <div ref={messagesEndRef} id="src/components/ChatInterface.js:124:9" />
      </div>
      
      {/* 加载中指示器 */}
      {loading && (
        <div className="loading-container" id="src/components/ChatInterface.js:129:9">
          <Spin tip="正在处理..." />
        </div>
      )}
      
      {/* 输入区域 */}
      <InputArea 
        onSendMessage={sendMessage} 
        onImageUploaded={handleImageUploaded}
        uploadedImageUrl={uploadedImageUrl}
        disabled={loading}
        id="src/components/ChatInterface.js:138:7"
      />
    </Card>
  );
};

export default ChatInterface;
