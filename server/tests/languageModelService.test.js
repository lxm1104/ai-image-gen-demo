/**
 * 语言模型服务单元测试
 */

const axios = require('axios');
const languageModelService = require('../services/languageModelService');
const imageGenerationService = require('../services/imageGenerationService');

// 模拟依赖模块
jest.mock('axios');
jest.mock('../services/imageGenerationService');
jest.mock('../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

describe('语言模型服务测试', () => {
  beforeEach(() => {
    // 清除所有模拟的实现和调用记录
    jest.clearAllMocks();
  });

  describe('sendMessage 函数测试', () => {
    test('应该调用ModelScope API并返回适当的响应', async () => {
      // 模拟 ModelScope API 的成功响应
      axios.post.mockResolvedValueOnce({
        data: {
          output: {
            text: '我理解您想要生成一幅山水画的图片。我可以帮您完成这个请求。'
          }
        }
      });

      // 调用测试函数
      const result = await languageModelService.sendMessage('生成一幅山水画');

      // 验证 axios.post 被调用，并且使用了正确的参数
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('modelscope'), 
        expect.objectContaining({
          model: expect.any(String),
          input: expect.objectContaining({
            prompt: expect.stringContaining('生成一幅山水画')
          })
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': expect.stringContaining('Bearer')
          })
        })
      );

      // 验证返回结果包含适当的字段
      expect(result).toHaveProperty('text');
    });

    test('当用户请求生成图片时，应该调用文生图服务', async () => {
      // 模拟 ModelScope API 的响应，指示需要生成图片
      axios.post.mockResolvedValueOnce({
        data: {
          output: {
            text: '我将为您生成一幅山水画',
            action: 'generate_image',
            action_params: {
              prompt: '水墨山水画，云雾缭绕的高山'
            }
          }
        }
      });

      // 模拟图像生成服务返回的结果
      imageGenerationService.textToImage.mockResolvedValueOnce({
        imageUrl: '/uploads/test_image.png',
        prompt: '水墨山水画，云雾缭绕的高山'
      });

      // 调用测试函数
      const result = await languageModelService.sendMessage('生成一幅水墨山水画');

      // 验证文生图服务被调用
      expect(imageGenerationService.textToImage).toHaveBeenCalledWith(
        expect.stringContaining('水墨山水画')
      );

      // 验证返回结果包含图片URL
      expect(result).toHaveProperty('imageUrl', '/uploads/test_image.png');
    });

    test('当用户请求将图片转为夜景时，应该调用白天转夜景服务', async () => {
      // 模拟 ModelScope API 的响应，指示需要转换为夜景
      axios.post.mockResolvedValueOnce({
        data: {
          output: {
            text: '我会将您的图片转换为夜景效果',
            action: 'day_to_night',
            action_params: {}
          }
        }
      });

      // 模拟图像生成服务返回的结果
      imageGenerationService.dayToNight.mockResolvedValueOnce({
        imageUrl: '/uploads/night_test_image.png',
        originalImageUrl: '/uploads/test_image.png'
      });

      // 调用测试函数，包含图片URL
      const result = await languageModelService.sendMessage(
        '将这张图片转为夜景', 
        '/uploads/test_image.png'
      );

      // 验证白天转夜景服务被调用
      expect(imageGenerationService.dayToNight).toHaveBeenCalledWith(
        '/uploads/test_image.png'
      );

      // 验证返回结果包含转换后的图片URL
      expect(result).toHaveProperty('imageUrl', '/uploads/night_test_image.png');
    });

    test('当API调用失败时，应该抛出适当的错误', async () => {
      // 模拟 API 调用失败
      axios.post.mockRejectedValueOnce(new Error('API调用失败'));

      // 验证函数抛出错误
      await expect(languageModelService.sendMessage('测试消息')).rejects.toThrow('语言模型处理失败');
    });
  });
});
