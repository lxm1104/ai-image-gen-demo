# 对话式图像生成网页Demo

## 项目介绍

这是一个网页Demo，实现了通过对话方式与语言模型交互，让语言模型根据用户输入自动调用不同的图像生成模型。

### 主要功能

1. 用户可以通过对话界面输入文字，要求生成图片
2. 用户可以上传一张图片作为参考，要求将白天图片转换为夜景
3. 语言模型会自动分析用户需求，调用不同的图像生成模型API

## 技术栈

- 前端：React.js、Ant Design、Axios
- 后端：Node.js、Express
- 容器化：Docker, Docker Compose

## 项目结构

```
/
├── client/                  # 前端代码
│   ├── public/              # 静态资源
│   ├── src/                 # 源代码
│   │   ├── components/      # React组件
│   │   ├── services/        # API服务
│   │   └── utils/           # 工具函数
│   ├── Dockerfile           # 前端Docker配置
│   └── nginx.conf           # Nginx配置
├── server/                  # 后端代码
│   ├── config/              # 配置文件
│   ├── controllers/         # 控制器
│   ├── models/              # 数据模型
│   ├── routes/              # API路由
│   ├── services/            # 服务层
│   ├── uploads/             # 上传文件存储
│   ├── Dockerfile           # 后端Docker配置
│   └── index.js             # 入口文件
├── docs/                    # 文档
├── logs/                    # 日志
├── docker-compose.yml       # Docker Compose配置
└── README.md                # 项目说明
```

## 运行指南

### 前置条件

- Node.js (v14+)
- npm 或 yarn
- Docker 和 Docker Compose (可选，用于容器化部署)

### 环境变量配置

在启动服务前，需要配置相关的API密钥：

1. 复制`.env.example`文件为`.env`
```bash
cp server/.env.example server/.env
```

2. 编辑`.env`文件，填入实际的API密钥：
```
LIBLIB_API_KEY=your_liblib_api_key_here
MODELSCOPE_API_KEY=your_modelscope_api_key_here
```

### 本地开发

#### 后端服务

```bash
cd server
npm install
npm run dev
```

后端服务将在 http://localhost:5000 运行。

#### 前端服务

```bash
cd client
npm install
npm start
```

前端服务将在 http://localhost:3000 运行。

### Docker部署

使用Docker Compose一键启动前后端服务：

```bash
docker-compose up -d
```

访问 http://localhost:3000 体验完整应用。

## API文档

### 语言模型API

- ModelScope API: https://modelscope.cn/docs/model-service/API-Inference/intro

### 图像生成模型API

- LiblibAI自定义模型: https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d

## 注意事项

- 当前版本为演示版本，图像生成部分使用了模拟数据，实际部署时需要替换为真实API调用
- 需要正确配置API密钥才能使用图像生成功能
