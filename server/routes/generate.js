/**
 * 图像生成API路由
 * 处理图像生成请求并返回生成的图像
 */

const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
const imageGenerationService = require('../services/imageGenerationService');

/**
 * POST /api/generate/text-to-image
 * 文本生成图像API
 * 请求体:
 * {
 *   prompt: string,    // 图像生成提示文本
 *   modelType: string  // 模型类型，默认为"star3"
 * }
 */
router.post('/text-to-image', async (req, res) => {
  try {
    const { prompt, modelType = 'star3' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ success: false, message: '提示文本不能为空' });
    }
    
    logger.info(`收到文生图请求，提示: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`);
    
    const result = await imageGenerationService.textToImage(prompt, modelType);
    
    logger.info('文生图请求完成');
    res.json({ success: true, ...result });
  } catch (error) {
    logger.error(`文生图请求失败: ${error.message}`);
    res.status(500).json({ success: false, message: '生成图像失败', error: error.message });
  }
});

/**
 * POST /api/generate/day-to-night
 * 白天转夜景API
 * 请求体:
 * {
 *   imageUrl: string  // 要转换的图像URL
 * }
 */
router.post('/day-to-night', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: '图像URL不能为空' });
    }
    
    logger.info(`收到白天转夜景请求，图像URL: ${imageUrl}`);
    
    const result = await imageGenerationService.dayToNight(imageUrl);
    
    logger.info('白天转夜景请求完成');
    res.json({ success: true, ...result });
  } catch (error) {
    logger.error(`白天转夜景请求失败: ${error.message}`);
    res.status(500).json({ success: false, message: '白天转夜景失败', error: error.message });
  }
});

module.exports = router;
