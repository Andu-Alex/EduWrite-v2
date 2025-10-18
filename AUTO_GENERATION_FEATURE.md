# 自动生成功能说明

## 功能概述

本项目已实现以下自动生成功能：

1. **自动文本生成**：在chat页面用户输入后立即触发假的文本生成过程
2. **自动路线图推进**：右边的研究路线图会自动跳转到最后一步
3. **自动Agent导航**：结束后自动跳转到agent页面的最后一步（结果输出）
4. **打字机效果**：模拟真实的AI文本生成过程

## 使用方法

### 1. 启动项目

```bash
npm run dev
```

### 2. 测试自动生成功能

1. 访问首页，点击"教育学术写作智能体"
2. 选择任意论文类型（质性研究、量化研究、文献研究）
3. 系统会自动跳转到chat页面
4. 在输入框中输入任意内容并提交
5. 观察以下自动过程：
   - 立即开始打字机效果的AI回复
   - 右侧路线图自动逐步推进到最后一步
   - 自动跳转到agent页面的结果输出步骤

### 3. 功能特点

- **打字机效果**：AI回复以打字机效果逐字显示，模拟真实AI生成过程
- **自动进度**：路线图每3秒自动推进一个步骤
- **智能导航**：完成后自动跳转到agent页面的结果输出
- **状态指示**：显示当前进度和生成状态
- **响应式设计**：支持移动端和桌面端

## 技术实现

### 核心函数

- `startAutoGenerationProcess()`: 启动自动生成过程
- `autoProgressRoadmap()`: 自动推进路线图
- `simulateAITextGeneration()`: 模拟AI文本生成
- `typewriterEffect()`: 实现打字机效果
- `navigateToAgentOutput()`: 跳转到agent结果页面

### 状态管理

- `isGenerating`: 控制生成状态显示
- `currentStepIndex`: 跟踪当前路线图步骤
- `showRoadmap`: 控制路线图显示

### 路由参数

- `fromAgent=true`: 标识从agent页面跳转
- `paperType`: 论文类型参数
- `step=output`: 直接跳转到agent结果页面
- `autoComplete=true`: 自动完成模式

## 自定义配置

### 调整时间间隔

```javascript
// 路线图推进间隔（毫秒）
const progressInterval = setInterval(() => {
  // ...
}, 3000) // 修改此值调整推进速度

// 打字机效果速度（毫秒）
const typingSpeed = 30 // 修改此值调整打字速度
```

### 修改生成内容

在 `simulateAITextGeneration()` 函数中修改 `responses` 数组来自定义AI回复内容。

## 注意事项

1. 该功能仅在从agent页面跳转到chat页面时激活
2. 自动生成过程会覆盖正常的聊天功能
3. 可以通过修改 `showRoadmap` 状态来控制功能开关
4. 移动端会隐藏路线图侧边栏

## 故障排除

如果功能不工作，请检查：

1. 确保从agent页面正确跳转（URL包含 `fromAgent=true` 参数）
2. 检查浏览器控制台是否有错误信息
3. 确认 `showRoadmap` 状态为 `true`
4. 验证路由参数是否正确传递
