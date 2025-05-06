/**
 * 输入区域组件
 * 负责用户输入文本和上传图片功能
 */

import React, { useState } from 'react';
import { Input, Button, Upload, message, Space, Tooltip } from 'antd';
import { SendOutlined, PictureOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import './InputArea.css';

const { TextArea } = Input;

/**
 * 输入区域组件
 * @param {Object} props - 组件属性
 * @param {Function} props.onSendMessage - 发送消息回调函数
 * @param {Function} props.onImageUploaded - 图片上传成功回调函数
 * @param {string} props.uploadedImageUrl - 当前上传的图片URL
 * @param {boolean} props.disabled - 是否禁用输入
 */
const InputArea = ({ onSendMessage, onImageUploaded, uploadedImageUrl, disabled }) => {
  // 输入文本状态
  const [inputText, setInputText] = useState('');
  // 上传中状态
  const [uploading, setUploading] = useState(false);

  /**
   * 处理发送按钮点击事件
   */
  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    } else {
      message.warning('请输入消息内容');
    }
  };

  /**
   * 处理键盘事件，按下Enter发送消息
   * @param {Object} e - 键盘事件对象
   */
  const handleKeyDown = (e) => {
    // 使用Shift+Enter换行，仅按Enter发送消息
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * 处理图片上传前的检查
   * @param {Object} file - 上传的文件对象
   * @returns {boolean|Promise} - 是否允许上传
   */
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
      return false;
    }
    
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能超过5MB!');
      return false;
    }
    
    return true;
  };

  /**
   * 处理图片上传
   * @param {Object} options - 上传配置项
   */
  const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    
    // 如果已经有上传的图片，先删除
    if (uploadedImageUrl) {
      handleClearImage();
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    setUploading(true);
    
    try {
      // 调用上传API
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setUploading(false);
      
      if (response.data.success) {
        message.success('图片上传成功');
        onSuccess(response.data, file);
        
        // 调用父组件的回调函数，传递图片URL
        onImageUploaded(response.data.imageUrl);
      } else {
        message.error('图片上传失败');
        onError(new Error('上传失败'));
      }
    } catch (error) {
      setUploading(false);
      message.error('上传出错: ' + error.message);
      onError(error);
    }
  };

  /**
   * 清除已上传的图片
   */
  const handleClearImage = () => {
    onImageUploaded(null);
  };

  return (
    <div className="input-area" id="src/components/InputArea.js:110:5">
      {/* 显示已上传的图片预览 */}
      {uploadedImageUrl && (
        <div className="uploaded-image-preview" id="src/components/InputArea.js:113:9">
          <div className="image-preview-container" id="src/components/InputArea.js:114:11">
            <img 
              src={uploadedImageUrl} 
              alt="已上传图片" 
              className="preview-image"
              id="src/components/InputArea.js:118:13"
            />
            <Button 
              icon={<DeleteOutlined />} 
              danger 
              className="delete-image-btn"
              onClick={handleClearImage}
              disabled={disabled}
              id="src/components/InputArea.js:125:13"
            >
              移除
            </Button>
          </div>
          <p className="upload-hint" id="src/components/InputArea.js:131:11">已上传图片，您可以要求将其转换为夜景效果</p>
        </div>
      )}
      
      {/* 输入区域 */}
      <div className="input-container" id="src/components/InputArea.js:137:7">
        <TextArea
          placeholder="请输入消息，或描述您想要生成的图片..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          autoSize={{ minRows: 1, maxRows: 4 }}
          disabled={disabled}
          id="src/components/InputArea.js:144:9"
        />
        
        <Space className="input-actions" id="src/components/InputArea.js:147:9">
          {/* 图片上传按钮 */}
          <Upload
            showUploadList={false}
            beforeUpload={beforeUpload}
            customRequest={handleUpload}
            disabled={disabled || uploading}
            id="src/components/InputArea.js:153:11"
          >
            <Tooltip title="上传图片" id="src/components/InputArea.js:158:13">
              <Button
                icon={<PictureOutlined />}
                loading={uploading}
                disabled={disabled}
                id="src/components/InputArea.js:162:15"
              />
            </Tooltip>
          </Upload>
          
          {/* 发送按钮 */}
          <Tooltip title="发送消息" id="src/components/InputArea.js:169:11">
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={disabled || !inputText.trim()}
              id="src/components/InputArea.js:174:13"
            />
          </Tooltip>
        </Space>
      </div>
    </div>
  );
};

export default InputArea;
