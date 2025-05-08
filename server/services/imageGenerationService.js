/**
 * 图像生成服务
 * 负责调用各种图像生成模型API
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const logger = require('../config/logger');

/**
 * 根据LiblibAI API文档生成签名
 * @param {string} uri - API的URI路径
 * @param {string} timestamp - 毫秒时间戳
 * @param {string} signatureNonce - 随机字符串
 * @param {string} secretKey - API密钥
 * @returns {string} - 生成的签名
 */
function generateSignature(uri, timestamp, signatureNonce, secretKey) {
  try {
    // 1. 拼接原文
    const content = `${uri}&${timestamp}&${signatureNonce}`;
    logger.info(`签名原文: ${content}`);
    
    // 2. 使用HMAC-SHA1算法和SecretKey加密
    const hmac = crypto.createHmac('sha1', secretKey);
    const digest = hmac.update(content).digest('base64');
    logger.info(`签名base64原始结果: ${digest}`);
    
    // 3. 转为URL安全的base64字符串（替换+为-，/为_，移除=）
    const signature = digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    logger.info(`URL安全的签名结果: ${signature}`);
    
    return signature;
  } catch (error) {
    logger.error(`生成签名失败: ${error.message}`);
    throw new Error(`生成签名失败: ${error.message}`);
  }
}

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
    const API_URL = 'https://openapi.liblibai.cloud/api/generate/webui/text2img/ultra';
    
    // 构建请求参数 - 使用星流Star-3 Alpha文生图模板
    const requestData = {
      "templateUuid": "5d7e67009b344550bc1aa6ccbfa1d7f4", // 星流Star-3 Alpha文生图模板ID
      "generateParams": {
        "prompt": prompt,
        "promptMagic": 1,
        "aspectRatio": "square", // 正方形图片 1:1
        "imgCount": 1 // 生成一张图片
      }
    };
    
    logger.info('根据LiblibAI API文档更新了生成参数结构');
    
    
    logger.info('发送文生图API请求，请求参数:', JSON.stringify(requestData, null, 2));
    
    // 构建带有认证信息的URL
    const timestamp = Date.now();
    const signatureNonce = Math.random().toString(36).substring(2, 18); // 生成随机字符串
    
    // 生成签名
    const SECRET_KEY = process.env.LIBLIB_SECRET_KEY;
    const signature = generateSignature('/api/generate/webui/text2img/ultra', timestamp.toString(), signatureNonce, SECRET_KEY);
    
    const urlWithAuth = `${API_URL}?AccessKey=${API_KEY}&Signature=${signature}&Timestamp=${timestamp}&SignatureNonce=${signatureNonce}`;
    
    // 详细记录URL和认证信息
    logger.info(`完整请求URL: ${urlWithAuth}`);
    logger.info(`AccessKey: ${API_KEY}`);
    logger.info(`Timestamp: ${timestamp}`);
    logger.info(`SignatureNonce: ${signatureNonce}`);
    logger.info(`Signature: ${signature}`);
    
    try {
      // 发送实际API请求
      const response = await axios.post(urlWithAuth, requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      logger.info('文生图API调用成功，处理返回结果');
      // 详细记录API响应
      logger.info(`API响应状态码: ${response.status}`);
      logger.info(`API响应头: ${JSON.stringify(response.headers)}`);
      logger.info(`API响应内容: ${JSON.stringify(response.data)}`);
      
      // 处理API响应
      if (response.data && response.data.code === 0 && response.data.data && response.data.data.generateUuid) {
        // 获取生成任务的UUID，然后查询生成结果
        const generateUuid = response.data.data.generateUuid;
        logger.info(`文生图任务已创建，任务ID: ${generateUuid}，等待生成完成...`);
        
        // 查询生成结果（轮询直到完成）
        const generatedImageUrl = await waitForImageGeneration(generateUuid, API_KEY);
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
        
        // 详细记录错误情况
        if (response.data) {
          logger.error(`响应code: ${response.data.code}`);
          logger.error(`响应msg: ${response.data.msg || '无错误消息'}`);
          if (response.data.data) {
            logger.error(`响应data: ${JSON.stringify(response.data.data)}`);
          }
        }
        
        throw new Error(`文生图API调用未返回预期的图像数据: ${response.data.msg || '无详细错误信息'}`);
      }
    } catch (error) {
      logger.error(`文生图API调用失败: ${error.message}`);
      
      // 详细记录错误信息
      if (error.response) {
        // 服务器返回了错误状态码
        logger.error(`错误状态码: ${error.response.status}`);
        logger.error(`错误响应头: ${JSON.stringify(error.response.headers)}`);
        logger.error(`错误响应内容: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // 请求已发送但没有收到响应
        logger.error('请求已发送但没有收到响应');
        logger.error(`请求内容: ${JSON.stringify(error.request)}`);
      } else {
        // 请求设置时发生错误
        logger.error(`请求配置错误: ${error.message}`);
      }
      
      throw new Error(`文生图失败: ${error.message}`);
    }
  } catch (error) {
    logger.error(`文生图API调用失败: ${error.message}`);
    throw new Error(`文生图失败: ${error.message}`);
  }
}

/**
 * 轮询等待图像生成完成
 * @param {string} generateUuid - 生成任务的UUID
 * @param {string} apiKey - API密钥
 * @returns {Promise<string>} - 生成的图像URL
 */
async function waitForImageGeneration(generateUuid, apiKey) {
  const statusUrl = 'https://openapi.liblibai.cloud/api/generate/webui/status';
  const maxAttempts = 30; // 最多尝试30次
  const interval = 3000; // 每3秒查询一次
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // 构建带有认证信息的URL
      const timestamp = Date.now();
      const signatureNonce = Math.random().toString(36).substring(2, 18);
      
      // 生成签名
      const SECRET_KEY = process.env.LIBLIB_SECRET_KEY;
      const signature = generateSignature('/api/generate/webui/status', timestamp.toString(), signatureNonce, SECRET_KEY);
      
      const urlWithAuth = `${statusUrl}?AccessKey=${apiKey}&Signature=${signature}&Timestamp=${timestamp}&SignatureNonce=${signatureNonce}`;
      
      // 详细记录URL和认证信息
      logger.info(`查询状态完整URL: ${urlWithAuth}`);
      logger.info(`查询状态参数 - AccessKey: ${apiKey}`);
      logger.info(`查询状态参数 - 任务ID: ${generateUuid}`);
      
      // 查询生成状态
      const response = await axios.post(urlWithAuth, { generateUuid }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      // 记录查询响应
      logger.info(`查询状态响应: ${JSON.stringify(response.data)}`);
      
      // 检查生成是否完成
      if (response.data && response.data.code === 0 && response.data.data) {
        const status = response.data.data.generateStatus;
        logger.info(`任务 ${generateUuid} 当前状态: ${status}，进度: ${response.data.data.percentCompleted || 0}`);
        
        // 记录任务详情
        if (response.data.data.generateMsg) {
          logger.info(`任务消息: ${response.data.data.generateMsg}`);
        }
        if (response.data.data.images) {
          logger.info(`图像数量: ${response.data.data.images.length}`);
          logger.info(`图像详情: ${JSON.stringify(response.data.data.images)}`);
        }
        
        // 状态为5表示任务成功完成
        if (status === 5 && response.data.data.images && response.data.data.images.length > 0) {
          // 检查图片是否通过审核 (auditStatus === 3)
          const approvedImages = response.data.data.images.filter(img => img.auditStatus === 3);
          if (approvedImages.length > 0) {
            return approvedImages[0].imageUrl; // 返回第一张通过审核的图片URL
          }
        }
        
        // 状态为6表示任务失败
        if (status === 6) {
          throw new Error(`生成任务失败: ${response.data.data.generateMsg || '未知原因'}`);
        }
      }
      
      // 等待一段时间后再次查询
      await new Promise(resolve => setTimeout(resolve, interval));
    } catch (error) {
      logger.error(`查询生成状态失败: ${error.message}`);
      // 等待后继续尝试
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  
  // 超过最大尝试次数
  throw new Error('等待图像生成超时');
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
    const API_URL = 'https://openapi.liblibai.cloud/api/generate/workflow';
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
