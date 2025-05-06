/**
 * 对话式图像生成网页Demo - 主应用组件
 * 负责整体布局和组件组织
 */

import React, { useState } from 'react';
import { Layout, Typography } from 'antd';
import ChatInterface from './components/ChatInterface';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

/**
 * 应用主组件
 * 管理整体布局和页面结构
 */
function App() {
  // 会话ID状态，用于跟踪对话
  const [sessionId] = useState(`session-${Date.now()}`);

  return (
    <Layout className="app-layout" id="src/App.js:21:5">
      <Header className="app-header" id="src/App.js:22:7">
        <Title level={3} style={{ color: 'white', margin: 0 }} id="src/App.js:23:9">
          对话式图像生成 Demo
        </Title>
      </Header>
      <Content className="app-content" id="src/App.js:27:7">
        <div className="main-container" id="src/App.js:28:9">
          <ChatInterface sessionId={sessionId} id="src/App.js:29:11" />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }} id="src/App.js:32:7">
        图像生成演示 ©{new Date().getFullYear()} 
      </Footer>
    </Layout>
  );
}

export default App;
