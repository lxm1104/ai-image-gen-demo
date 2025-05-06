/**
 * 语言模型服务
 * 负责调用语言模型API，并根据用户需求调用适当的图像生成模型
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');
const imageGenerationService = require('./imageGenerationService');

// ModelScope API配置 - 使用OpenAI兼容接口
const MODELSCOPE_API_URL = 'https://api-inference.modelscope.cn/v1/chat/completions';
const DEFAULT_MODEL = 'Qwen/Qwen3-32B';

/**
 * 查找用户输入中的图像生成意图
 * @param {string} text - 输入文本
 * @returns {Object} - 包含文生图和白天转夜景的意图判断
 */
function detectImageGenerationIntent(text) {
  // 将输入转为小写进行匹配
  const lowerText = text.toLowerCase();
  
  // 检测文生图意图
  const hasTextToImageIntent = 
    lowerText.includes('生成图片') || 
    lowerText.includes('画一') || 
    lowerText.includes('创建图像') ||
    lowerText.includes('生成一张') ||
    lowerText.includes('制作图片');

  // 检测白天转夜景意图
  const hasDayToNightIntent = 
    lowerText.includes('转为夜景') || 
    lowerText.includes('转成夜景') ||
    lowerText.includes('变成夜景') ||
    lowerText.includes('白天转夜景');

  return {
    hasImageGenerationIntent: hasTextToImageIntent || hasDayToNightIntent,
    hasDayToNightIntent,
    hasTextToImageIntent: hasTextToImageIntent && !hasDayToNightIntent
  };
}

/**
 * 调用ModelScope API获取语言模型响应（使用OpenAI兼容接口）
 * @param {string} prompt - 提示文本
 * @param {string|null} imageUrl - 可选的图片URL
 * @returns {object} - 模型响应数据
 */
async function callModelScopeAPI(prompt, imageUrl = null) {
  try {
    logger.info(`调用ModelScope API，提示文本长度: ${prompt.length}`);
    
    // 得到API密钥
    const apiKey = process.env.MODELSCOPE_API_KEY;
    logger.info(`使用的API密钥: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);
    if (!apiKey) {
      throw new Error('ModelScope API Key未配置');
    }
    
    // 构建系统提示文本
    let systemPrompt = '你是一个智能助手，可以做以下事情:\n';
    systemPrompt += '1. 根据用户描述生成图片\n';
    systemPrompt += '2. 将白天图片转换为夜景\n';
    systemPrompt += '\n当用户要求生成图片时，请分析用户意图并返回您的回复和行动指令。\n';
    systemPrompt += '如果用户要求生成图片，请在响应中包含 action: "generate_image" 并在 prompt 中提供详细的图像描述。\n';
    systemPrompt += '如果用户要求转换夜景，请在响应中包含 action: "day_to_night"。';
    
    // 处理图片信息
    let userPrompt = prompt;
    if (imageUrl) {
      userPrompt += `\n\n[用户上传了一张图片，图片URL: ${imageUrl}]`;
    }
    
    // 构建OpenAI兼容格式的请求数据
    const requestData = {
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      top_p: 0.8,
      max_tokens: 1024,
      stream: true, // 流式输出支持，通义千问模型要求必须使用流式模式
      extra_body: {
        enable_thinking: true
      }
    };
    
    logger.info(`发送ModelScope API请求到: ${MODELSCOPE_API_URL}`);
    logger.info(`使用模型: ${DEFAULT_MODEL}`);
    logger.info(`请求数据: ${JSON.stringify(requestData)}`);
    
    logger.info('开始发送API请求...');
    // 发送API请求 - 使用OpenAI兼容接口
    // 配置响应类型为流式
    const response = await axios.post(MODELSCOPE_API_URL, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      responseType: 'stream'
    }).catch(error => {
      logger.error(`API请求失败: ${error.message}`);
      if (error.response) {
        logger.error(`响应状态码: ${error.response.status}`);
        logger.error(`响应头: ${JSON.stringify(error.response.headers)}`);
        
        // 尝试读取响应体
        if (error.response.data) {
          try {
            if (typeof error.response.data === 'object') {
              logger.error(`响应数据: ${JSON.stringify(error.response.data)}`);
            } else {
              logger.error(`响应数据: ${error.response.data}`);
            }
          } catch (e) {
            logger.error(`无法解析响应数据: ${e.message}`);
          }
        }
      } else if (error.request) {
        logger.error(`请求已发送但未收到响应: ${error.request}`);
      } else {
        logger.error(`请求配置错误: ${error.config}`);
      }
      throw error;
    });
    
    logger.info('ModelScope API流式调用成功');
    logger.info(`响应状态码: ${response.status}`);
    logger.info(`响应头: ${JSON.stringify(response.headers)}`);
    
    // 处理流式响应数据
    let fullContent = '';
    let fullResponseData = '';
    let choices = [];
    
    return new Promise((resolve, reject) => {
      response.data.on('data', (chunk) => {
        const chunkStr = chunk.toString();
        fullResponseData += chunkStr;
        
        // 处理分块数据
        try {
          // 将分块数据按行分割
          const lines = chunkStr.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              // 去除 'data: ' 前缀并解析 JSON
              const jsonStr = line.substring(6);
              const data = JSON.parse(jsonStr);
              
              // 提取响应数据
              if (data.choices && data.choices.length > 0) {
                const choice = data.choices[0];
                if (choice.delta && choice.delta.content) {
                  fullContent += choice.delta.content;
                }
                // 可以存储完整的选择对象以便后续处理
                choices.push(choice);
              }
            }
          }
        } catch (e) {
          logger.error(`解析流式响应数据失败: ${e.message}`);
        }
      });
      
      response.data.on('end', () => {
        logger.info(`流式响应结束，获得完整内容长度: ${fullContent.length}`);
        logger.info(`完整响应内容(前100字符): ${fullContent.substring(0, 100)}...`);
        
        // 构造类似非流式响应的数据结构
        resolve({
          choices: [{
            message: {
              content: fullContent
            }
          }]
        });
      });
      
      response.data.on('error', (err) => {
        logger.error(`流式响应读取错误: ${err.message}`);
        reject(err);
      });
    });
  } catch (error) {
    logger.error(`ModelScope API调用失败: ${error.message}`);
    throw new Error(`ModelScope API调用失败: ${error.message}`);
  }
}

/**
 * 从语言模型响应中提取行动指令
 * @param {string} text - 模型响应文本
 * @returns {object} - 提取的行动和参数
 */
function extractActionFromResponse(text) {
  const actionMatch = text.match(/action:\s*"([^"]+)"/i);
  const action = actionMatch ? actionMatch[1].trim() : '';
  
  let promptMatch = text.match(/prompt:\s*"([^"]+)"/i);
  if (!promptMatch) {
    // 尝试匹配形如 prompt: 描述 的格式（没有引号）
    promptMatch = text.match(/prompt:\s*([^\n]+)/i);
  }
  const prompt = promptMatch ? promptMatch[1].trim() : '';
  
  return { action, prompt };
}

/**
 * 发送消息到语言模型并获取回复
 * @param {string} message - 用户消息
 * @param {string|null} imageUrl - 可选的图片URL
 * @param {string|null} sessionId - 可选的会话ID
 * @returns {object} - 包含回复文本和可能生成的图片URL
 */
async function sendMessage(message, imageUrl = null, sessionId = null) {
  try {
    logger.info(`处理用户消息，消息长度: ${message.length}`);
    
    // 首先检测用户意图，用于快速处理明确的请求
    const intent = detectImageGenerationIntent(message);
    
    // 定义响应变量
    let responseText = '';
    let generatedImageUrl = null;

    // 调用ModelScope API获取语言模型响应
    const modelResponse = await callModelScopeAPI(message, imageUrl);
    
    // 获取响应文本（根据OpenAI兼容接口的返回格式）
    let modelResponseText = '';
    logger.info(`解析响应数据...`);
    // 流式响应已在前面的方法中转换为标准格式
    if (modelResponse && modelResponse.choices && modelResponse.choices.length > 0) {
      logger.info(`找到choices数组，长度: ${modelResponse.choices.length}`);
      if (modelResponse.choices[0].message && modelResponse.choices[0].message.content) {
        modelResponseText = modelResponse.choices[0].message.content;
        logger.info(`成功提取响应文本，长度: ${modelResponseText.length}`);
      } else {
        logger.warn(`choices[0].message或content不存在，完整响应对象: ${JSON.stringify(modelResponse)}`);
      }
    } else {
      logger.warn(`响应中没有找到有效的choices数组，完整响应对象: ${JSON.stringify(modelResponse)}`);
    }
    
    logger.info(`语言模型响应文本: ${modelResponseText}`);
    
    // 从响应中提取行动和提示
    logger.info(`从响应中提取行动和提示...`);
    const { action, prompt } = extractActionFromResponse(modelResponseText);
    logger.info(`提取的行动: ${action}, 提取的提示: ${prompt}`);
    
    // 更新响应文本，去除可能的action和prompt标记
    responseText = modelResponseText.replace(/action:\s*"[^"]+"/gi, '')
                                .replace(/prompt:\s*"[^"]+"/gi, '')
                                .replace(/prompt:\s*[^\n]+/gi, '')
                                .trim();
    logger.info(`处理后的响应文本: ${responseText}`);
    
    // 根据用户请求调用不同的图像生成模型
    if (action === 'generate_image') {
      // 使用语言模型提供的提示调用文生图API
      const imagePrompt = prompt || message.replace(/\u751f\u6210\u56fe\u7247|\u8bf7\u751f\u6210|\u5e2e\u6211\u753b|\u753b\u4e00\u5f20/gi, '').trim();
      logger.info(`提取到的图像生成提示: ${imagePrompt}`);
      
      const result = await imageGenerationService.textToImage(imagePrompt);
      generatedImageUrl = result.imageUrl;
      
      if (!responseText || responseText === '') {
        responseText = `已根据您的描述生成图片："${imagePrompt}"。您可以查看生成的图片。`;
      }
    } else if (action === 'day_to_night' || (intent.hasDayToNightIntent && imageUrl)) {
      // 调用白天转夜景API
      if (!imageUrl) {
        return {
          text: '抱歉，要转换为夜景效果，请先上传一张白天的图片。',
          imageUrl: null
        };
      }
      
      logger.info('检测到白天转夜景请求，准备调用相关API');
      const result = await imageGenerationService.dayToNight(imageUrl);
      generatedImageUrl = result.imageUrl;
      
      if (!responseText || responseText === '') {
        responseText = '已将您的图片转换为夜景效果，您可以查看生成的图片。';
      }
    } else {
      // 如果语言模型没有返回有效响应，使用默认消息
      if (!responseText || responseText === '') {
        responseText = '您好，我是AI助手。如果您想要生成图片，可以告诉我您想要什么样的图片，或者上传一张白天的图片，我可以帮您转换为夜景效果。';
      }
    }

    logger.info('语言模型处理完成，准备返回响应');
    return {
      text: responseText,
      imageUrl: generatedImageUrl
    };
  } catch (error) {
    logger.error(`语言模型处理失败: ${error.message}`);
    throw new Error(`语言模型处理失败: ${error.message}`);
  }
}

module.exports = {
  sendMessage
};
