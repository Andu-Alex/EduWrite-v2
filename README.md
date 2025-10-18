<<<<<<< HEAD
# EduWrite - 学术研究智能助手

一个基于 Vue 3 的现代化学术研究助手，集成了 AI 对话、文献检索、可视化分析等功能。

## ✨ 功能特性

- 🤖 **AI 研究助手** - 基于 innospark 模型的智能研究指导
- 📚 **文献检索** - 集成 arXiv 开放平台的文献搜索
- 📊 **可视化分析** - 动态生成研究主题图谱和统计分析
- 📝 **导出功能** - 支持 Word、LaTeX 和引用导出
- 💬 **智能对话** - 支持多轮对话，上下文理解
- 🎨 **现代化 UI** - 响应式设计，支持明暗主题
- 🌍 **国际化** - 多语言支持

## 🛠️ 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI 组件**: Naive UI + Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: TailwindCSS + Less
- **图标**: Iconify
- **PWA**: Vite PWA Plugin

## 📋 环境要求

- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0 (或使用 pnpm/yarn)

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd EduWrite-master
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env` 文件：

```env
# API 基础地址
VITE_GLOB_API_URL=/api
VITE_APP_API_BASE_URL=http://127.0.0.1:6039/

# PWA 配置
VITE_GLOB_APP_PWA=false
VITE_GLOB_OPEN_LONG_REPLY=false
```

### 4. 启动开发服务器

```bash
npm run dev
```

项目将在 `http://localhost:1002` 启动（端口可能自动调整）

### 5. 构建生产版本

```bash
npm run build
```

构建文件在 `dist/` 目录

## 📖 详细部署文档

- **快速启动**: [QUICK_START.md](./QUICK_START.md)
- **完整部署指南**: [DEPLOYMENT_README.md](./DEPLOYMENT_README.md)
- **Research 模块更新**: [RESEARCH_MODULE_UPDATE.md](./RESEARCH_MODULE_UPDATE.md)

## 📦 可用脚本

```bash
# 开发环境启动
npm run dev

# 生产环境构建
npm run build

# 预览构建结果
npm run preview

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 自动修复代码格式
npm run lint:fix

# 文档开发
npm run docs:dev

# 文档构建
npm run docs:build
```

## 🔧 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `VITE_GLOB_API_URL` | API 基础路径 | `/api` | 否 |
| `VITE_APP_API_BASE_URL` | 后端 API 地址 | `http://127.0.0.1:6039/` | 是 |
| `VITE_GLOB_APP_PWA` | 是否启用 PWA | `false` | 否 |
| `VITE_GLOB_OPEN_LONG_REPLY` | 是否支持长回复 | `false` | 否 |

### 功能模块

- **Research 模块** (`/research`): AI 学术研究助手
- **Chat 模块** (`/chat`): AI 对话聊天
- **Agent 模块** (`/agent`): AI 智能代理

## 📁 项目结构

```
EduWrite-master/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口封装
│   │   ├── research.ts    # Research 模块 API
│   │   ├── chat.ts        # Chat 模块 API
│   │   └── ...
│   ├── assets/            # 资源文件
│   ├── components/        # 公共组件
│   │   ├── visualization/ # 可视化组件
│   │   └── ...
│   ├── hooks/             # 组合式函数
│   ├── locales/           # 国际化
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── styles/            # 样式文件
│   ├── utils/             # 工具函数
│   ├── views/             # 页面组件
│   │   ├── research/      # Research 模块
│   │   ├── chat/          # Chat 模块
│   │   └── agent/         # Agent 模块
│   └── main.ts            # 入口文件
├── docs/                  # 文档和截图
├── DEPLOYMENT_README.md   # 完整部署指南
├── QUICK_START.md         # 快速启动指南
└── package.json
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

## 📄 许可证

本项目基于 MIT 许可证开源。

<!-- 作者信息已移除 -->
=======
# EduWrite-v2
>>>>>>> 4874030b88f18b9d58e6d36c422b8edc0ed75e58
