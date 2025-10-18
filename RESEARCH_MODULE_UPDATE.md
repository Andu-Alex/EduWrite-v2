# Research模块功能更新说明

## 更新概述

本次更新将research模块从静态演示页面转换为具有真实AI功能的学术研究助手，集成了innospark大模型API和arXiv文献检索功能。

## 主要功能更新

### 1. AI模型集成
- **模型**: innospark
- **API Key**: 7V1rpBFgK0DOHPh95pMP8Sxe1DXK_7c0UGJ5Fxpi_ejZiDvklCz38ev2_iLs7VxdaDslykF-DRJQhZDwOD7ZNA==
- **功能**: 为每个研究步骤提供专业的AI指导和建议

### 2. 文献检索功能
- **平台**: arXiv开放平台
- **功能**: 
  - 自动文献检索（在研究流程中触发）
  - 手动文献检索（用户主动搜索）
  - 文献结果展示（标题、作者、摘要、关键词等）
  - 相关性评分

### 3. 研究步骤重构
- **问题提出**: AI分析研究问题的学术价值和创新点
- **概念梳理**: 提供概念定义和关系分析
- **理论框架**: 理论选择和框架构建指导
- **文献综述**: 文献检索策略和综述撰写指导
- **写作支持**: 论文结构、逻辑和语言指导

### 4. 可视化分析
- **动态生成**: 基于AI分析结果生成可视化数据
- **类型支持**: 
  - 主题图谱（文献研究）
  - 编码模型（质性研究）
  - 统计分析（量化研究）

### 5. 导出功能
- **Word文档**: 导出研究对话记录
- **LaTeX文档**: 导出学术格式的研究报告
- **引用文件**: 导出文献引用列表

## 技术实现

### API模块 (`src/api/research.ts`)
```typescript
// 主要函数
- callInnosparkAPI(): 调用innospark模型API
- getResearchStepResponse(): 获取研究步骤AI回复
- generateResearchResponse(): 生成研究路线图回复
- searchArxivLiterature(): arXiv文献检索
- generateVisualizationData(): 生成可视化数据
- exportResearchToWord(): 导出Word文档
- exportResearchToLaTeX(): 导出LaTeX文档
- exportCitations(): 导出引用
```

### 前端组件更新
- 集成真实API调用
- 添加文献检索UI
- 优化用户体验
- 错误处理和加载状态

## 使用说明

### 1. 开始研究
1. 在research页面输入研究想法
2. 系统自动开始研究流程
3. AI为每个步骤提供专业指导

### 2. 步骤问答
1. 点击右侧路线图中的步骤
2. 针对特定步骤提问
3. 获得专业的AI回复

### 3. 文献检索
1. 在文献综述步骤自动触发
2. 或在可视化标签页手动检索
3. 查看检索结果和详细信息

### 4. 可视化分析
1. 在理论框架步骤自动生成
2. 切换到可视化标签页查看
3. 支持不同类型的分析图表

### 5. 导出功能
1. 点击底部导出按钮
2. 选择导出格式（Word/LaTeX/引用）
3. 下载生成的文件

## 注意事项

1. **API限制**: innospark API有调用频率限制，请合理使用
2. **文献检索**: arXiv API可能存在跨域问题，建议在生产环境中使用代理
3. **错误处理**: 所有API调用都包含错误处理，失败时会显示友好提示
4. **数据持久化**: 当前版本不包含数据持久化，刷新页面会丢失数据

## 后续优化建议

1. 添加更多文献数据库支持（如PubMed、Google Scholar等）
2. 实现研究数据的本地存储
3. 添加研究进度的保存和恢复功能
4. 优化可视化图表的交互性
5. 添加研究模板和示例

## 文件结构

```
src/
├── api/
│   └── research.ts          # 研究相关API
├── views/
│   └── research/
│       └── index.vue        # 研究页面主组件
└── components/
    └── visualization/      # 可视化组件
        ├── TopicMap.vue
        ├── CodingModel.vue
        └── StatisticsTable.vue
```

## 总结

本次更新成功将research模块从静态演示转换为功能完整的学术研究助手，集成了AI模型和文献检索功能，为用户提供了专业的研究指导和支持。所有功能都经过测试，确保稳定性和用户体验。
