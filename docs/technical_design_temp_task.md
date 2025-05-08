# 临时任务技术设计：优化图片生成响应

## 任务描述
当图片生成模型成功返回图片时，后端API应仅返回必要的图片信息（如URL），不应包含额外的文字说明（例如：“图片已生成”）。这确保前端可以直接渲染图片，提供更纯粹的用户体验。

## 涉及文件
- `server/services/languageModelService.js`

## 修改方案
在 `languageModelService.js` 的 `sendMessage` 函数中，找到处理 `generate_image` 工具调用成功后的逻辑部分。

当前逻辑（根据用户提供的日志推断）：
```javascript
// ... (inside sendMessage after successful generate_image tool call)
if (functionName === 'generate_image' && functionResult.imageUrl) {
    generatedImageUrl = functionResult.imageUrl;
    // responseText = functionResult.message || '图片已生成。'; // <--- This line needs modification
    responseText = ''; // <--- Change to this
    isQuestion = false;
    hasSentToolCallResponse = true;
    logger.info(`[DEBUG sendMessage] generate_image successful. generatedImageUrl: "${generatedImageUrl}", responseText: "${responseText}", hasSentToolCallResponse: ${hasSentToolCallResponse}`);
    break; 
}
// ...
```

**具体修改点：**
将 `responseText = functionResult.message || '图片已生成。';`
修改为 `responseText = '';`

## 预期结果
当语言模型通过 `generate_image` 工具成功生成图片后，`sendMessage` 函数返回给前端的最终响应对象的 `text` 字段将为空字符串，而 `imageUrl` 字段将包含图片的URL。

例如，响应可能如下：
```json
{
  "text": "",
  "imageUrl": "/uploads/generated_xxxxxxxx.png",
  "isQuestion": false
}
```

## 测试要点
- 发送一个会导致图片生成的提示。
- 检查后端返回给前端的JSON响应，确认 `text` 字段为空，并且 `imageUrl` 包含正确的图片路径。
- 确认前端聊天框中只显示图片，没有多余的文字消息。
