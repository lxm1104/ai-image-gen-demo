/**
 * 语言模型服务
 * 负责调用语言模型API，并根据用户需求调用适当的图像生成模型
 * 使用 function calling 实现白天转夜景功能
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');
const imageGenerationService = require('./imageGenerationService');

// ModelScope API配置 - 使用OpenAI兼容接口
const MODELSCOPE_API_URL = 'https://api-inference.modelscope.cn/v1/chat/completions';
const DEFAULT_MODEL = 'Qwen/Qwen3-32B';

// 定义可用的functions
// 根据通义千问官方标准格式
// 参考：https://help.aliyun.com/zh/model-studio/qwen-function-calling
const availableFunctions = [
  {
    "name": "generate_image",
    "description": "根据用户的文本描述生成图片",
    "parameters": {
      "type": "object",
      "properties": {
        "prompt": {
          "type": "string",
          "description": "详细的图像描述，用于生成图片"
        }
      },
      "required": ["prompt"]
    }
  },
  {
    "name": "day_to_night",
    "description": "将用户提供的白天图片转换为夜景效果图片",
    "parameters": {
      "type": "object",
      "properties": {
        "imageUrl": {
          "type": "string",
          "description": "需要转换的白天图片URL"
        }
      },
      "required": ["imageUrl"]
    }
  },
  {
    "name": "ask_user",
    "description": "当用户提供的信息不足以生成或编辑图片时，向用户提问并获取更多信息",
    "parameters": {
      "type": "object",
      "properties": {
        "questions": {
          "type": "string",
          "description": "需要向用户提出的问题，用于收集更多信息以完成图片生成或编辑任务"
        }
      },
      "required": ["questions"]
    }
  }
];

// 该函数不再需要，完全依赖function call的能力判断意图
// 保留注释以便理解代码历史
/**
 * 此函数已废弃 - 完全依赖function call的能力判断用户意图
 * 原本用于查找用户输入中的图像生成意图
 */
function detectImageGenerationIntent(text) {
  // 返回空对象，不再执行任何判断
  return {
    hasImageGenerationIntent: false,
    hasDayToNightIntent: false,
    hasTextToImageIntent: false
  };
}

/**
 * 调用ModelScope API获取语言模型响应（使用OpenAI兼容接口）
 * @param {string} prompt - 提示文本
 * @param {string|null} imageUrl - 可选的图片URL
 * @param {boolean} enableFunctions - 是否启用函数调用功能
 * @returns {object} - 模型响应数据
 */
async function callModelScopeAPI(prompt, imageUrl = null, enableFunctions = true) {
  try {
    logger.info(`调用ModelScope API，提示文本长度: ${prompt.length}`);
    
    // 得到API密钥
    const apiKey = process.env.MODELSCOPE_API_KEY;
    logger.info(`使用的API密钥: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);
    if (!apiKey) {
      throw new Error('ModelScope API Key未配置');
    }
    
    // 构建System Prompt - 使用新的提示文本
    let systemPrompt = 'You are "Image‑Gen Orchestrator", a tool‑calling expert.  \n\n';
    systemPrompt += 'Your ONLY goals:\n\n';
    systemPrompt += '1. 洞察用户真实意图，判断信息是否足够生成/编辑图片。  \n';
    systemPrompt += '2. 如信息不足 → 用一次 ask_user 函数提出所有关键问题。  \n';
    systemPrompt += '3. 信息足够 → 在一步内调用正确的函数组合，生成或编辑图片。  ';
    
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
    
    // 如果启用函数调用，添加函数定义和调用设置
    // 根据通义千问官方文档的标准设置
    if (enableFunctions) {
      // 添加函数定义
      requestData.tools = [
        {
          "type": "function",
          "function": availableFunctions[0] // generate_image
        },
        {
          "type": "function",
          "function": availableFunctions[1] // day_to_night
        },
        {
          "type": "function",
          "function": availableFunctions[2] // ask_user
        }
      ];
      
      // 让模型自行决定是否调用函数
      requestData.tool_choice = "auto"; 
    }
    
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
    
    // 处理流式响应数据 - 根据通义千问最新标准
    let fullContent = '';
    let fullResponseData = '';
    let toolCalls = []; // 使用新的tool_calls格式
    let currentToolCall = null; // 当前正在处理的工具调用
    let responseText = '';
    
    // Chunk回调处理函数，每收到一个数据块都会调用
    let chunkHandler = (data) => {
      // 检查数据是否为done标记
      if (data.includes('[DONE]')) {
        logger.info('收到完成标记，流式响应完成');
        return true; // 返回true表示处理完成
      }
      
      try {
        // 以换行符分隔，处理每一行数据
        const lines = data.toString().split('\n').filter(line => line.trim().startsWith('data:'));
        
        for (const line of lines) {
          // 提取JSON数据部分
          const jsonStr = line.substring(5).trim();
          if (jsonStr && jsonStr !== '[DONE]') {
            try {
              const jsonData = JSON.parse(jsonStr);
              
              // 处理函数调用
              if (jsonData.choices && jsonData.choices.length > 0) {
                const choice = jsonData.choices[0];
                
                // 处理工具调用 - 按照通义千问最新的tool_calls格式
                if (choice.delta && choice.delta.tool_calls) {
                  // 如果有新的工具调用
                  for (const toolCallDelta of choice.delta.tool_calls) {
                    // 找到对应index的工具调用或创建新的
                    let toolCall = toolCalls.find(tc => tc.index === toolCallDelta.index);
                    
                    if (!toolCall) {
                      // 创建新的工具调用记录
                      toolCall = {
                        index: toolCallDelta.index,
                        id: toolCallDelta.id || '',
                        type: 'function',
                        function: {
                          name: '',
                          arguments: ''
                        }
                      };
                      toolCalls.push(toolCall);
                    }
                    
                    // 更新工具调用信息
                    if (toolCallDelta.function) {
                      if (toolCallDelta.function.name) {
                        toolCall.function.name += toolCallDelta.function.name;
                      }
                      if (toolCallDelta.function.arguments) {
                        toolCall.function.arguments += toolCallDelta.function.arguments;
                      }
                    }
                    
                    // 记录当前正在处理的工具调用
                    currentToolCall = toolCall;
                  }
                } 
                // 收集普通内容
                else if (choice.delta && choice.delta.content) {
                  responseText += choice.delta.content;
                }
              }
            } catch (parseError) {
              logger.warn(`解析JSON失败: ${parseError.message}, 原始数据: ${jsonStr}`);
            }
          }
        }
        
        return false; // 返回false表示继续处理下一个数据块
      } catch (chunkError) {
        logger.error(`处理数据块时出错: ${chunkError.message}`);
        return false;
      }
    };
    
    return new Promise((resolve, reject) => {
      response.data.on('data', chunkHandler);
      
      response.data.on('end', () => {
        logger.info(`流式响应结束，获得完整内容长度: ${responseText.length}`);
        
        // 构造类似非流式响应的数据结构
        const responseData = {
          choices: [{
            message: {
              content: responseText,
              // 如果有工具调用，添加tool_calls字段
              tool_calls: toolCalls.length > 0 ? toolCalls : undefined
            }
          }]
        };
        
        // 执行工具调用
        if (toolCalls.length > 0) {
          // 目前只处理第一个工具调用（通常只有一个）
          const toolCall = toolCalls[0];
          logger.info(`处理工具调用: ${JSON.stringify(toolCall)}`);
          
          try {
            // 解析工具调用参数
            const functionName = toolCall.function.name;
            const argsStr = toolCall.function.arguments;
            let functionArgs = {};

            if (argsStr) {
              try {
                // 增加详细日志
                logger.info(`[DEBUG] 准备解析的工具参数字符串 (argsStr): "${argsStr}" (长度: ${argsStr.length})`);
                functionArgs = JSON.parse(argsStr);
                logger.info(`成功解析工具调用参数: ${JSON.stringify(functionArgs)}`);
              } catch (parseError) {
                logger.error(`JSON解析失败，尝试替换特殊字符: ${parseError.message}`);
                // 尝试将引号内的换行符和其他特殊字符替换为空格
                const sanitizedStr = argsStr.replace(/"(.*?)"/g, (match) => {
                  return match.replace(/\n/g, ' ').replace(/\r/g, ' ');
                });
                logger.info(`清理后的函数参数字符串: ${sanitizedStr}`);
                functionArgs = JSON.parse(sanitizedStr);
              }
            }
            
            executeFunction(functionName, functionArgs, imageUrl)
              .then(result => {
                resolve(result);
              })
              .catch(error => {
                reject(error);
              });
          } catch (error) {
            logger.error(`处理tool_calls时出错: ${error.message}`);
            reject(error);
          }
        } else {
          resolve(responseData);
        }
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
 * 此函数已废弃 - 完全依赖function call的能力判断用户意图
 * 原本用于从语言模型响应中提取行动指令
 */
function extractActionFromResponse(text) {
  // 不再使用正则表达式提取行动
  return {
    action: null,
    prompt: null
  };
}

/**
 * 执行函数调用
 * @param {string} functionName - 要调用的函数名称
 * @param {object} parameters - 函数参数
 * @param {string|null} imageUrl - 如果有传入的图片URL
 * @returns {object} - 函数执行结果
 */
async function executeFunction(functionName, parameters, imageUrl = null) {
  logger.info(`执行函数调用: ${functionName}, 参数: ${JSON.stringify(parameters)}`);
  
  try {
    switch (functionName) {
      case 'generate_image':
        if (!parameters.prompt) {
          throw new Error('生成图片需要prompt参数');
        }
        
        const promptText = parameters.prompt;
        logger.info(`调用文生图函数，提示: ${promptText}`);
        const textToImageResult = await imageGenerationService.textToImage(promptText);
        
        return {
          success: true,
          functionName: 'generate_image',
          result: textToImageResult,
          message: `已根据您的描述生成图片。您可以查看生成的图片。`
        };
        
      case 'day_to_night':
        // 使用模型提供的imageUrl或者用户上传的图片
        const dayToNightImageUrl = parameters.imageUrl || imageUrl;
        
        if (!dayToNightImageUrl) {
          throw new Error('转换夜景需要imageUrl参数或用户上传的图片');
        }
        
        logger.info(`调用白天转夜景函数，图片URL: ${dayToNightImageUrl}`);
        const dayToNightResult = await imageGenerationService.dayToNight(dayToNightImageUrl);
        
        return {
          success: true,
          functionName: 'day_to_night',
          result: dayToNightResult,
          message: '已将您的图片转换为夜景效果，您可以查看生成的图片。'
        };
        
      case 'ask_user':
        logger.info(`调用ask_user函数，提出问题: ${parameters.questions}`);
        // 对于ask_user，我们直接返回问题本身
        const askUserResult = { success: true, message: parameters.questions, isQuestion: true };
        logger.info(`[DEBUG executeFunction ask_user] Returning: ${JSON.stringify(askUserResult)}`); // 添加日志
        return askUserResult;
      default:
        throw new Error(`不支持的函数: ${functionName}`);
    }
  } catch (error) {
    logger.error(`函数执行失败: ${error.message}`);
    return {
      success: false,
      functionName: functionName,
      error: error.message
    };
  }
}

/**
 * 发送消息到语言模型并获取回复
 * @param {string} message - 用户消息
 * @param {string|null} imageUrl - 可选的图片URL
 * @param {string|null} sessionId - 可选的会话ID
 * @returns {object} - 包含回复文本和可能生成的图片URL
 */
async function sendMessage(message, imageUrl = null, sessionId = null) {
    let responseText = '';
    let generatedImageUrl = null;
    let isQuestion = false;
    let modelResponse = null; // This will hold the initial response from the LLM
    let hasSentToolCallResponse = false;

    try {
        logger.info(`处理用户消息，消息长度: ${message.length}${imageUrl ? ', 包含图片' : ''}`);

        // Step 1: Call the language model and get the complete response
        // callModelScopeAPI is expected to handle the stream internally and return the full response object.
        modelResponse = await callModelScopeAPI(message, imageUrl, sessionId, true); // true for stream argument might be legacy, ensure callModelScopeAPI handles it
        
        // Step 2: Log the initial model response
        logger.info(`[DEBUG sendMessage] Initial modelResponse from callModelScopeAPI: ${JSON.stringify(modelResponse, null, 2)}`);

        // Step 3: Process tool calls if present
        const toolCalls = modelResponse?.output?.tool_calls;
        if (toolCalls && toolCalls.length > 0) {
            logger.info(`发现 ${toolCalls.length} 个工具调用。`);
            for (const toolCall of toolCalls) {
                logger.info(`处理工具调用: ${JSON.stringify(toolCall)}`);
                let functionResult = null; // Initialize functionResult for each tool call
                try {
                    const functionName = toolCall.function.name;
                    const argsStr = toolCall.function.arguments;
                    logger.info(`[DEBUG sendMessage] Tool call argsStr for ${functionName}: "${argsStr}" (length: ${argsStr?.length})`);
                    const args = JSON.parse(argsStr);
                    logger.info(`成功解析工具调用参数 for ${functionName}: ${JSON.stringify(args)}`);

                    functionResult = await executeFunction(functionName, args, sessionId, imageUrl);
                    logger.info(`[DEBUG sendMessage] Raw functionResult for ${functionName}: ${JSON.stringify(functionResult)}`);

                    if (functionResult && functionResult.success) {
                        logger.info(`[DEBUG sendMessage] Function ${functionName} reported success.`);
                        if (functionName === 'ask_user' && functionResult.message) {
                            responseText = functionResult.message;
                            isQuestion = functionResult.isQuestion !== undefined ? functionResult.isQuestion : true;
                            hasSentToolCallResponse = true;
                            logger.info(`[DEBUG sendMessage] ask_user successful. responseText: "${responseText}", isQuestion: ${isQuestion}, hasSentToolCallResponse: ${hasSentToolCallResponse}`);
                            break; // Assuming we only handle one ask_user call and then stop
                        } else if (functionName === 'generate_image' && functionResult.imageUrl) {
                            generatedImageUrl = functionResult.imageUrl;
                            responseText = ''; // 用户要求只显示图片，不显示额外文字
                            isQuestion = false;
                            hasSentToolCallResponse = true;
                            logger.info(`[DEBUG sendMessage] generate_image successful. generatedImageUrl: "${generatedImageUrl}", responseText: "${responseText}", hasSentToolCallResponse: ${hasSentToolCallResponse}`);
                            // If other tools might follow, don't break. If this is terminal, break.
                            break; 
                        } else if (functionName === 'day_to_night' && functionResult.imageUrl) {
                            generatedImageUrl = functionResult.imageUrl;
                            responseText = functionResult.message || '图片已转换。';
                            isQuestion = false;
                            hasSentToolCallResponse = true;
                            logger.info(`[DEBUG sendMessage] day_to_night successful. generatedImageUrl: "${generatedImageUrl}", responseText: "${responseText}", hasSentToolCallResponse: ${hasSentToolCallResponse}`);
                            break;
                        } else if (functionResult.message) { // Generic success case with a message
                            responseText = functionResult.message;
                            isQuestion = functionResult.isQuestion !== undefined ? functionResult.isQuestion : false;
                            hasSentToolCallResponse = true;
                            logger.info(`[DEBUG sendMessage] Generic tool ${functionName} successful with message. responseText: "${responseText}", isQuestion: ${isQuestion}, hasSentToolCallResponse: ${hasSentToolCallResponse}`);
                            // Decide whether to break based on workflow
                        }
                    } else {
                        logger.warn(`函数 ${functionName} 执行失败或未返回成功标志。Result: ${JSON.stringify(functionResult)}`);
                        // Even if a tool fails, we might want to send its error message to the user.
                        if (functionResult && functionResult.message) {
                            responseText = functionResult.message; // Use error message from function
                            isQuestion = false; // Typically errors are not questions
                            hasSentToolCallResponse = true; // We are sending a response based on tool call outcome
                            logger.info(`[DEBUG sendMessage] Tool ${functionName} failed but provided a message. responseText: "${responseText}", hasSentToolCallResponse: ${hasSentToolCallResponse}`);
                        } else {
                            responseText = `工具 ${functionName} 调用失败，且未提供具体错误信息。`;
                            isQuestion = false;
                            hasSentToolCallResponse = true; // Sending a generic error for this tool call
                            logger.info(`[DEBUG sendMessage] Tool ${functionName} failed with no specific message. Setting generic error. hasSentToolCallResponse: ${hasSentToolCallResponse}`);
                        }
                    }
                } catch (toolError) {
                    logger.error(`处理工具调用 ${toolCall.function.name} 时发生内部错误: ${toolError.stack}`);
                    // It's important to decide if an internal error processing one tool should prevent others
                    // or if we should inform the user about this specific failure.
                    responseText = `处理工具 ${toolCall.function.name} 时发生错误: ${toolError.message}`;
                    isQuestion = false;
                    hasSentToolCallResponse = true; // We are sending an error response
                    logger.info(`[DEBUG sendMessage] Internal error during tool processing. responseText: "${responseText}", hasSentToolCallResponse: ${hasSentToolCallResponse}`);
                    // Optionally break or continue to next tool call depending on desired error handling strategy
                }
            } // End of for...of loop for toolCalls
        }

        // Step 4: Fallback or default response if no tool call handled the response
        if (!hasSentToolCallResponse) {
            logger.info(`[DEBUG sendMessage] Entered 'if (!hasSentToolCallResponse)' block. Current responseText before this block: '${responseText}'`);
            // Check if modelResponse itself has a direct message to show, e.g. if no tool_calls were made or intended
            if (modelResponse && modelResponse.output && modelResponse.output.choices && modelResponse.output.choices.length > 0 && modelResponse.output.choices[0].message && modelResponse.output.choices[0].message.content) {
                // This is the direct text response from the LLM, not a tool call.
                responseText = modelResponse.output.choices[0].message.content.trim();
                isQuestion = false; // Typically, direct LLM responses are not questions unless specifically formatted.
                logger.info(`No tool response was sent, using direct LLM response: "${responseText}"`);
            } else if (modelResponse && typeof modelResponse.message === 'string' && !responseText) {
                // This handles cases where handleStreamResponse might directly populate a simple message (e.g., from an error or a non-tool-calling stream)
                // And ensure we don't overwrite a responseText already set by a failed tool attempt above.
                responseText = modelResponse.message;
                isQuestion = modelResponse.isQuestion !== undefined ? modelResponse.isQuestion : false;
                logger.warn(`No tool response sent, and no direct choices. Using modelResponse.message: "${responseText}". ModelResponse was: ${JSON.stringify(modelResponse)}`);
            } else if (!responseText) { // Only set default if responseText is still empty
                logger.warn(`响应中没有找到有效的choices或直接内容，或工具调用处理后无有效响应。modelResponse: ${JSON.stringify(modelResponse, null, 2)}`);
                responseText = '您好，我是AI助手。如果您想要生成图片或转换白天图片为夜景，请直接告诉我。';
                isQuestion = false;
            }
            logger.info(`语言模型响应文本 (after !hasSentToolCallResponse block): ${responseText}`);
        }

        logger.info('语言模型处理完成，准备返回响应');
        return { text: responseText, imageUrl: generatedImageUrl, isQuestion };

    } catch (error) {
        logger.error(`sendMessage中发生错误: ${error.stack}`);
        // Ensure a user-friendly error is returned
        return {
            text: `抱歉，处理您的请求时遇到问题: ${error.message}`,
            imageUrl: null,
            isQuestion: false
        };
    }
}
module.exports = {
  sendMessage
};
