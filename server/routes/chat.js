/**
 * 聊天API路由
 * 处理用户与语言模型的对话交互
 */

const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
const languageModelService = require('../services/languageModelService');

/**
 * POST /api/chat
 * 处理用户发送的消息，并调用语言模型返回响应
 * 请求体:
 * {
 *   message: string, // 用户消息
 *   imageUrl?: string, // 可选的图片URL（如果用户上传了图片）
 *   sessionId?: string // 可选的会话ID，用于跟踪对话
 * }
 */
router.post('/', async (req, res) => {
  try {
    const { message, imageUrl, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: '消息不能为空' });
    }
    
    logger.info(`收到聊天请求: ${message}`);
    
    // 调用语言模型服务
    const response = await languageModelService.sendMessage(message, imageUrl, sessionId);
    
    logger.info(`语言模型响应成功`);
    res.json({ success: true, response });
  } catch (error) {
    logger.error(`处理聊天请求失败: ${error.message}`);
    res.status(500).json({ success: false, message: '处理请求失败', error: error.message });
  }
});

module.exports = router;
