# 对话式图像生成网页Demo技术设计

## 架构概述

本项目采用前后端分离的架构，前端使用React.js构建用户界面，后端使用Node.js/Express提供API服务。

### 整体架构图

```
+-------------------+      +--------------------+      +------------------+
|                   |      |                    |      |                  |
|  前端 (React.js)  +----->+  后端 (Node.js)    +----->+  外部AI服务API   |
|                   |      |                    |      |                  |
+-------------------+      +--------------------+      +------------------+
                                    |
                                    v
                           +--------------------+
                           |                    |
                           |  数据存储 (文件系统) |
                           |                    |
                           +--------------------+
```

## 技术栈选择

### 前端
- React.js：用于构建用户界面
- Axios：用于API请求
- Ant Design：UI组件库
- React Router：路由管理

### 后端
- Node.js：运行环境
- Express：Web框架
- Multer：处理文件上传
- Jest：单元测试

### 部署
- Docker：容器化部署

## 模块设计

### 前端模块

#### 组件结构
- `App`：应用入口，管理路由
- `ChatInterface`：主聊天界面
- `MessageList`：消息列表展示
- `InputArea`：用户输入区域
- `ImageUpload`：图片上传组件
- `ImageDisplay`：图片展示组件

#### 状态管理
使用React Hooks管理前端状态，包括：
- 聊天消息历史
- 用户输入内容
- 上传的图片
- 生成的图片
- 加载状态

### 后端模块

#### API路由
- `/api/chat`：处理聊天消息
- `/api/upload`：处理图片上传
- `/api/generate`：处理图片生成

#### 服务层
- `languageModelService`：调用语言模型API（如ModelScope）。
  - `callModelScopeAPI`: 负责与 ModelScope API 进行底层通信，包括处理流式响应。
  - `sendMessage`: 核心业务逻辑函数，负责编排与语言模型的交互。
      - **工具调用处理**: 识别并执行模型返回的工具调用请求（如图像生成、提问用户等）。
      - **直接图像生成响应处理**: 新增逻辑以应对 `callModelScopeAPI` 可能直接返回已成功处理的图片生成结果的情况。在这种场景下，`sendMessage` 会确保从 `modelResponse` 中提取图片URL，并将最终返回给前端的文本响应设置为空字符串，以满足用户仅展示图片的需求。
      - **响应聚合**: 整合来自模型直接回复或工具调用结果的文本和图片URL，形成最终响应。
  - **Stream Handling**: Handles streaming responses from the language model internally (within `callModelScopeAPI` using a `chunkHandler`). The previously considered `handleStreamResponse` function is obsolete.
- `imageGenerationService`：调用图像生成模型API
- `sessionService`：管理用户会话
- `fileService`：处理文件上传和存储

#### Logging
- **Configuration**: Logging is configured in `server/config/logger.js`.
- **Library**: Uses `winston` for robust logging.
- **Transports**:
    - Console output for real-time monitoring.
    - File output to `logs/app.log` for general application logs (level: `info` and above).
    - File output to `logs/error.log` specifically for error-level logs.
- **Log Directory**: The `logs` directory is created at the project root (`/logs`) if it doesn't exist.
- **Format**: Logs include a timestamp, level, and message.

## 数据流设计

### 用户发送文本消息流程
1. 用户在输入框输入文本
2. 前端发送请求到后端API
3. 后端调用语言模型API
4. 语言模型根据需要调用适当的图像生成模型API
5. 后端将结果返回前端
6. 前端展示回复和生成的图片

### 用户上传图片流程
1. 用户上传参考图片
2. 前端将图片发送到后端
3. 后端存储图片并获取URL
4. 用户发送相关文本提示
5. 后端同时将图片URL和文本发送给语言模型
6. 语言模型根据文本和图片调用适当的图像生成模型
7. 后端将结果返回前端
8. 前端展示回复和生成的图片

## API设计

### 语言模型API接口
根据ModelScope文档设计接口：
```javascript
async function callLanguageModel(message, imageUrl = null) {
  // 调用ModelScope API
}
```

### 图像生成模型API接口
根据LiblibAI文档设计接口：
```javascript
// 文生图接口
async function textToImage(prompt) {
  // 调用LiblibAI Star-3 Alpha文生图API
}

// 白天转夜景接口
async function dayToNight(imageUrl) {
  // 调用LiblibAI白天转夜景API
}
```

## 安全考虑
- 实现输入验证，防止XSS攻击
- 限制上传文件大小和类型
- 不在前端暴露API密钥
- 实现基本的速率限制

## 后续扩展考虑
- 添加用户认证系统
- 支持更多图像生成模型
- 添加图像编辑功能
- 优化图像生成速度
- 添加历史记录保存功能
