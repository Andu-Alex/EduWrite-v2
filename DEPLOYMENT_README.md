# EduWrite 部署指南

## 项目概述

EduWrite 是一个基于 Vue 3 的现代化学术研究助手前端应用，集成了 AI 对话、文献检索、可视化分析等功能。

## 功能特性

- 🤖 **AI 研究助手** - 基于 innospark 模型的智能研究指导
- 📚 **文献检索** - 集成 arXiv 开放平台的文献搜索
- 📊 **可视化分析** - 动态生成研究主题图谱和统计分析
- 📝 **导出功能** - 支持 Word、LaTeX 和引用导出
- 🎨 **现代化 UI** - 响应式设计，支持明暗主题
- 🌍 **国际化** - 多语言支持

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI 组件**: Naive UI + Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: TailwindCSS + Less
- **AI 模型**: innospark
- **文献检索**: arXiv API

## 环境要求

- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0 (推荐使用 pnpm)
- **现代浏览器**: Chrome 90+, Firefox 88+, Safari 14+

## 快速部署

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd EduWrite-master
```

### 2. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm (推荐)
npm install -g pnpm
pnpm install
```

### 3. 环境配置

创建 `.env` 文件：

```env
# API 基础地址
VITE_GLOB_API_URL=/api
VITE_APP_API_BASE_URL=http://127.0.0.1:6039/

# AI 模型配置
VITE_INNOSPARK_API_KEY=7V1rpBFgK0DOHPh95pMP8Sxe1DXK_7c0UGJ5Fxpi_ejZiDvklCz38ev2_iLs7VxdaDslykF-DRJQhZDwOD7ZNA==
VITE_INNOSPARK_API_URL=http://120.55.167.27:9001/v1/chat/completions

# PWA 配置
VITE_GLOB_APP_PWA=false

# 长回复支持
VITE_GLOB_OPEN_LONG_REPLY=false
```

### 4. 开发环境启动

```bash
# 使用 npm
npm run dev

# 或使用 pnpm
pnpm dev
```

项目将在 `http://localhost:1002` 启动（如果端口被占用会自动选择其他端口）

### 5. 生产环境构建

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 部署方式

### 方式一：静态文件部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **部署到 Web 服务器**
   - 将 `dist` 目录中的文件上传到 Web 服务器
   - 配置服务器支持 SPA 路由（所有路由重定向到 `index.html`）

3. **Nginx 配置示例**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # API 代理（如果需要）
       location /api {
           proxy_pass http://your-backend-server;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### 方式二：Docker 部署

1. **创建 Dockerfile**
   ```dockerfile
   # 构建阶段
   FROM node:18-alpine as builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   # 生产阶段
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **创建 nginx.conf**
   ```nginx
   events {
       worker_connections 1024;
   }

   http {
       include /etc/nginx/mime.types;
       default_type application/octet-stream;

       server {
           listen 80;
           server_name localhost;
           root /usr/share/nginx/html;
           index index.html;

           location / {
               try_files $uri $uri/ /index.html;
           }
       }
   }
   ```

3. **构建和运行**
   ```bash
   docker build -t eduwrite-frontend .
   docker run -p 80:80 eduwrite-frontend
   ```

### 方式三：Vercel 部署

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **部署**
   ```bash
   vercel --prod
   ```

3. **配置环境变量**
   在 Vercel 控制台中设置环境变量：
   - `VITE_GLOB_API_URL`
   - `VITE_APP_API_BASE_URL`
   - `VITE_INNOSPARK_API_KEY`
   - `VITE_INNOSPARK_API_URL`

### 方式四：Netlify 部署

1. **构建命令**: `npm run build`
2. **发布目录**: `dist`
3. **重定向规则**: `/* /index.html 200`

## 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `VITE_GLOB_API_URL` | API 基础路径 | `/api` | 否 |
| `VITE_APP_API_BASE_URL` | 后端 API 地址 | `http://127.0.0.1:6039/` | 是 |
| `VITE_INNOSPARK_API_KEY` | innospark API 密钥 | - | 是 |
| `VITE_INNOSPARK_API_URL` | innospark API 地址 | `http://120.55.167.27:9001/v1/chat/completions` | 是 |
| `VITE_GLOB_APP_PWA` | 是否启用 PWA | `false` | 否 |
| `VITE_GLOB_OPEN_LONG_REPLY` | 是否支持长回复 | `false` | 否 |

### API 配置

#### innospark AI 模型
- **API 地址**: `http://120.55.167.27:9001/v1/chat/completions`
- **模型名称**: `InnoSpark`
- **支持功能**: 研究指导、步骤问答、可视化数据生成

#### arXiv 文献检索
- **API 地址**: `https://export.arxiv.org/api/query`
- **支持功能**: 文献搜索、关键词提取、相关性评分

## 功能模块

### 1. Research 模块
- **路径**: `/research`
- **功能**: 学术研究智能助手
- **特性**: 
  - 5 步研究流程指导
  - AI 驱动的步骤问答
  - 文献检索和可视化分析
  - 导出功能

### 2. Chat 模块
- **路径**: `/chat`
- **功能**: AI 对话聊天
- **特性**: 多轮对话、上下文理解

### 3. Agent 模块
- **路径**: `/agent`
- **功能**: AI 智能代理
- **特性**: 任务执行、工具调用

## 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 查看端口占用
   lsof -i :1002
   
   # 杀死进程
   kill -9 <PID>
   ```

2. **依赖安装失败**
   ```bash
   # 清除缓存
   npm cache clean --force
   
   # 删除 node_modules 重新安装
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **构建失败**
   ```bash
   # 检查 Node.js 版本
   node --version
   
   # 更新依赖
   npm update
   ```

4. **API 调用失败**
   - 检查网络连接
   - 验证 API 密钥是否正确
   - 确认 API 服务是否可用

### 调试模式

启用调试模式查看详细日志：

```bash
# 开发环境
npm run dev -- --debug

# 生产环境
npm run build -- --debug
```

## 性能优化

### 1. 构建优化
- 启用代码分割
- 压缩静态资源
- 优化图片资源

### 2. 运行时优化
- 懒加载组件
- 虚拟滚动
- 缓存策略

### 3. CDN 配置
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['naive-ui', 'element-plus']
        }
      }
    }
  }
})
```

## 安全考虑

### 1. API 密钥安全
- 不要在客户端暴露敏感 API 密钥
- 使用环境变量管理配置
- 考虑使用代理服务器

### 2. 内容安全策略
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';">
```

### 3. HTTPS 部署
- 生产环境必须使用 HTTPS
- 配置 SSL 证书
- 启用 HSTS

## 监控和维护

### 1. 日志监控
- 应用错误日志
- API 调用日志
- 用户行为分析

### 2. 性能监控
- 页面加载时间
- API 响应时间
- 错误率统计

### 3. 更新维护
- 定期更新依赖
- 安全补丁更新
- 功能迭代发布

## 联系支持

如果遇到部署问题，请：

1. 查看本文档的故障排除部分
2. 检查项目的 Issues 页面
3. 提交新的 Issue 描述问题

## 许可证

本项目基于 MIT 许可证开源。

---

**注意**: 请确保在生产环境中正确配置所有环境变量，特别是 API 密钥和服务器地址。
