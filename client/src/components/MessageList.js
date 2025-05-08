/**
 * 消息列表组件
 * 负责展示对话消息，包括文本和图片
 */

import React from 'react';
import { Avatar, Typography, Image } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import './MessageList.css';

const { Text } = Typography;

/**
 * 消息列表组件
 * @param {Object} props - 组件属性
 * @param {Array} props.messages - 消息数组
 */
const MessageList = ({ messages }) => {
  /**
   * 格式化时间戳为可读字符串
   * @param {Date} timestamp - 时间戳
   * @returns {string} - 格式化后的时间字符串
   */
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="message-list" id="src/components/MessageList.js:24:5">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`message-item ${message.type} ${message.isQuestion ? 'question-message' : ''}`}
          id={`src/components/MessageList.js:29:11-${message.id}`}
        >
          {/* 消息头部：头像和时间 */}
          <div className="message-header" id={`src/components/MessageList.js:32:11-${message.id}`}>
            <Avatar 
              icon={message.type === 'user' ? <UserOutlined /> : <RobotOutlined />} 
              className="message-avatar"
              style={{ 
                backgroundColor: message.type === 'user' ? '#1890ff' : '#52c41a' 
              }}
              id={`src/components/MessageList.js:38:13-${message.id}`}
            />
            <Text type="secondary" className="message-time" id={`src/components/MessageList.js:45:13-${message.id}`}>
              {formatTimestamp(message.timestamp)}
            </Text>
          </div>
          
          {/* 消息内容 */}
          <div className="message-content" id={`src/components/MessageList.js:51:11-${message.id}`}>
            <div className="message-text" id={`src/components/MessageList.js:52:13-${message.id}`}>
              {message.content}
            </div>
            
            {/* 如果消息包含图片，显示图片 */}
            {message.imageUrl && (
              <div className="message-image" id={`src/components/MessageList.js:58:15-${message.id}`}>
                <Image 
                  src={message.imageUrl} 
                  alt="生成的图片" 
                  width={300}
                  style={{ maxWidth: '100%' }}
                  id={`src/components/MessageList.js:63:17-${message.id}`}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
