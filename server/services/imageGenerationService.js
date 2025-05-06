/**
 * 图像生成服务
 * 负责调用各种图像生成模型API
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

/**
 * 基于文本生成图像
 * 调用LiblibAI Star-3 Alpha文生图API
 * @param {string} prompt - 图像生成提示文本
 * @param {string} modelType - 模型类型，默认为"star3"
 * @returns {object} - 包含生成图像URL的对象
 */
async function textToImage(prompt, modelType = 'star3') {
  try {
    logger.info(`开始调用文生图API，提示: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`); 
    
    // 获取实际的API密钥和URL
    const API_KEY = process.env.LIBLIB_API_KEY;
    
    // 根据LiblibAI文档构建请求体和URL
    // 使用星流Star-3 Alpha文生图API
    const API_URL = 'https://api.liblib.ai/liblibai/v1/text2image/star/alpha';
    
    // 构建请求参数
    const requestData = {
      "accessKey": API_KEY,
      "modelUUID": "share-libs-llm-xcomposer-star3",
      "prompt": prompt,
      "negativePrompt": "",
      "samples": 1,
      "width": 1024,
      "height": 1024,
      "seed": Math.floor(Math.random() * 1000000),
      "steps": 30,
      "guidanceScale": 7.0,
      "clipSkip": 2
    };
    
    logger.info('发送文生图API请求，请求参数:', JSON.stringify(requestData, null, 2));
    
    // 发送实际API请求
    const response = await axios.post(API_URL, requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    logger.info('文生图API调用成功，处理返回结果');
    
    // 处理API响应
    if (response.data && response.data.code === 0 && response.data.data && response.data.data.images && response.data.data.images.length > 0) {
      // 获取生成的图像URL
      const generatedImageUrl = response.data.data.images[0];
      logger.info(`获取到文生图生成的图像URL: ${generatedImageUrl}`);
      
      // 下载图像到服务器
      const filename = `generated_${Date.now()}.png`;
      const localPath = path.join(__dirname, '../uploads', filename);
      
      // 下载生成的图像
      await downloadImage(generatedImageUrl, localPath);
      
      // 构建本地访问URL
      const imageUrl = `/uploads/${filename}`;
    
    logger.info(`文生图完成，图像已保存到本地，URL: ${imageUrl}`);
      
      return { 
        imageUrl,
        originalUrl: generatedImageUrl,
        prompt,
        modelType
      };
    } else {
      // API调用成功但没有返回预期的数据
      logger.error('文生图API调用未返回预期数据:', JSON.stringify(response.data));
      throw new Error('文生图API调用未返回预期的图像数据');
    }
  } catch (error) {
    logger.error(`文生图API调用失败: ${error.message}`);
    throw new Error(`文生图失败: ${error.message}`);
  }
}

/**
 * 将白天图片转换为夜景
 * 调用LiblibAI白天转夜景API
 * @param {string} imageUrl - 输入图像的URL
 * @returns {object} - 包含生成图像URL的对象
 */
async function dayToNight(imageUrl) {
  try {
    logger.info(`开始调用白天转夜景API，图像URL: ${imageUrl}`);
    
    // 获取实际的API密钥
    const API_KEY = process.env.LIBLIB_API_KEY;
    
    // LiblibAI白天转夜景API的URL和UUID
    const API_URL = 'https://api.liblib.ai/workflow';
    const WORKFLOW_UUID = '1badca36971c412db7973421f6425a8f'; // 白天转夜景工作流UUID
    
    // 从URL中解析图像路径
    // 移除URL前缀，只获取文件路径部分
    const imagePath = imageUrl.startsWith('/uploads/') 
      ? path.join(__dirname, '..', imageUrl) 
      : imageUrl;
    
    logger.info(`图像路径: ${imagePath}`);
    
    // 检查文件是否存在
    if (!fs.existsSync(imagePath)) {
      throw new Error(`找不到图像文件: ${imagePath}`);
    }
    
    // 构建FormData，根据LiblibAI API文档
    const formData = new FormData();
    formData.append('uuid', WORKFLOW_UUID); // 白天转夜景API的UUID
    formData.append('accessKey', API_KEY); // 添加Access Key
    formData.append('image', fs.createReadStream(imagePath)); // 添加图片文件
    
    logger.info('发送白天转夜景API请求');
    
    // 发送实际API请求
    const response = await axios.post(API_URL, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    logger.info('白天转夜景API调用成功，处理返回结果');
    
    // 处理API响应
    if (response.data && response.data.code === 0 && response.data.data && response.data.data.result) {
      // 获取生成的图像URL
      const generatedImageUrl = response.data.data.result;
      logger.info(`获取到白天转夜景生成的图像URL: ${generatedImageUrl}`);
      
      // 保存图像到本地服务器
      const filename = `night_${Date.now()}.png`;
      const localPath = path.join(__dirname, '../uploads', filename);
      
      // 下载生成的图像
      await downloadImage(generatedImageUrl, localPath);
      
      // 构建本地访问URL
      const localImageUrl = `/uploads/${filename}`;
    
      logger.info(`白天转夜景完成，图像已保存到本地，URL: ${localImageUrl}`);
      
      return { 
        imageUrl: localImageUrl,
        originalUrl: generatedImageUrl,
        originalImageUrl: imageUrl
      };
    } else {
      // API调用成功但没有返回预期的数据
      logger.error('白天转夜景API调用未返回预期数据:', JSON.stringify(response.data));
      throw new Error('白天转夜景API调用未返回预期的图像数据');
    }
  } catch (error) {
    logger.error(`白天转夜景API调用失败: ${error.message}`);
    throw new Error(`白天转夜景失败: ${error.message}`);
  }
}

/**
 * 辅助函数：下载图像并保存到本地
 * @param {string} url - 图像URL
 * @param {string} outputPath - 保存路径
 */
async function downloadImage(url, outputPath) {
  try {
    logger.info(`开始下载图像: ${url} 到 ${outputPath}`);
    
    // 确保上传目录存在
    const uploadDir = path.dirname(outputPath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });
    
    const writer = fs.createWriteStream(outputPath);
    
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        logger.info(`图像下载完成: ${outputPath}`);
        resolve();
      });
      writer.on('error', (err) => {
        logger.error(`写入图像文件时出错: ${err.message}`);
        reject(err);
      });
    });
  } catch (error) {
    logger.error(`下载图像失败: ${error.message}`);
    throw new Error(`下载图像失败: ${error.message}`);
  }
}

module.exports = {
  textToImage,
  dayToNight
};
