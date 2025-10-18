# EduWrite 快速启动指南

## 🚀 5分钟快速部署

### 1. 环境准备
```bash
# 确保 Node.js 版本 >= 16
node --version

# 安装依赖
npm install
```

### 2. 配置环境变量
创建 `.env` 文件：
```env
VITE_GLOB_API_URL=/api
VITE_APP_API_BASE_URL=http://127.0.0.1:6039/
VITE_GLOB_APP_PWA=false
VITE_GLOB_OPEN_LONG_REPLY=false
```

### 3. 启动开发服务器
```bash
npm run dev
```

访问: `http://localhost:1002` (或显示的端口)

### 4. 构建生产版本
```bash
npm run build
```

构建文件在 `dist/` 目录

## 📋 主要功能

- **Research 模块**: `/research` - AI 学术研究助手
- **Chat 模块**: `/chat` - AI 对话聊天  
- **Agent 模块**: `/agent` - AI 智能代理

## 🔧 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 预览
npm run preview

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

## 🐛 常见问题

**端口被占用?**
```bash
# 查看占用进程
lsof -i :1002
# 杀死进程
kill -9 <PID>
```

**依赖安装失败?**
```bash
# 清除缓存重装
rm -rf node_modules package-lock.json
npm install
```

**API 调用失败?**
- 检查网络连接
- 确认 API 服务是否运行
- 查看浏览器控制台错误信息

## 📞 获取帮助

- 查看完整文档: `DEPLOYMENT_README.md`
- 提交 Issue: [GitHub Issues]
- 联系维护者: [联系方式]

---
**提示**: 首次运行建议先测试 Research 模块的文献检索功能
