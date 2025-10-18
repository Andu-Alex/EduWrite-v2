<template>
  <div class="agent-page">
    <!-- 页面头部 -->
    <header class="agent-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">教育学术写作智能体</h1>
          <p class="page-subtitle">专业的学术研究助手，从选题到成稿全程陪伴</p>
        </div>
        <div class="header-right">
          <NButton @click="goBack" type="default">
            <template #icon>
              <SvgIcon icon="ri:arrow-left-line" />
            </template>
            返回首页
          </NButton>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="agent-main">
      <div class="main-container">
        <!-- 步骤1: 论文类型选择 -->
        <div v-if="currentStep === 'paper-type'" class="step-container">
          <div class="step-header">
            <div class="step-number">1</div>
            <div class="step-info">
              <h2>选择论文类型</h2>
              <p>请选择您的研究类型，系统将为您提供相应的研究路线和工具支持</p>
            </div>
          </div>
          
          <PaperTypeSelector @select="handlePaperTypeSelect" />
        </div>

        <!-- 步骤2: 研究路线图 -->
        <div v-else-if="currentStep === 'roadmap'" class="step-container">
          <div class="step-header">
            <div class="step-number">2</div>
            <div class="step-info">
              <h2>研究路线图</h2>
              <p>按照以下步骤进行您的研究，每个步骤都有相应的指导和工具支持</p>
            </div>
          </div>
          
          <ResearchRoadmap 
            :paper-type="selectedPaperType"
            @step-change="handleStepChange"
            @tool-use="handleToolUse"
            @complete="handleResearchComplete"
          />
        </div>

        <!-- 步骤3: 工具和可视化 -->
        <div v-else-if="currentStep === 'tools'" class="step-container">
          <div class="step-header">
            <div class="step-number">3</div>
            <div class="step-info">
              <h2>工具与可视化</h2>
              <p>使用专业工具进行分析，查看可视化结果</p>
            </div>
          </div>
          
          <div class="tools-layout">
            <div class="tools-sidebar">
              <div class="current-step-info">
                <h3>{{ currentStepInfo.title }}</h3>
                <p>{{ currentStepInfo.description }}</p>
                <div class="step-tools">
                  <h4>推荐工具：</h4>
                  <div class="tools-list">
                    <NButton 
                      v-for="tool in currentStepInfo.tools" 
                      :key="tool"
                      size="small"
                      @click="handleToolUse(tool)"
                      class="tool-button"
                    >
                      {{ tool }}
                    </NButton>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="tools-main">
              <VisualizationPanel 
                :visualization-type="currentVisualizationType"
                @export="handleVisualizationExport"
                @refresh="handleVisualizationRefresh"
              />
            </div>
          </div>
        </div>

        <!-- 步骤4: 结果输出 -->
        <div v-else-if="currentStep === 'output'" class="step-container">
          <div class="step-header">
            <div class="step-number">4</div>
            <div class="step-info">
              <h2>结果输出</h2>
              <p>导出您的研究结果，支持多种格式</p>
            </div>
          </div>
          
          <OutputPanel 
            :text="generatedText"
            :table-data="generatedTableData"
            :citations="generatedCitations"
            @export="handleOutputExport"
            @clear="handleOutputClear"
          />
        </div>
      </div>
    </main>

    <!-- 底部导航 -->
    <footer class="agent-footer">
      <div class="footer-content">
        <div class="progress-info">
          <span>当前步骤: {{ stepNames[currentStep] }}</span>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
        </div>
        
        <div class="footer-actions">
          <NButton 
            v-if="currentStep !== 'paper-type'"
            @click="goBackStep"
            type="default"
          >
            上一步
          </NButton>
          <NButton 
            v-if="currentStep === 'output'"
            @click="startNewResearch"
            type="primary"
          >
            开始新研究
          </NButton>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NButton } from 'naive-ui'
import { SvgIcon } from '@/components/common'
import PaperTypeSelector from '@/components/PaperTypeSelector.vue'
import ResearchRoadmap from '@/components/ResearchRoadmap.vue'
import VisualizationPanel from '@/components/VisualizationPanel.vue'
import OutputPanel from '@/components/OutputPanel.vue'

const router = useRouter()
const route = useRoute()

// 当前步骤状态
const currentStep = ref<'paper-type' | 'roadmap' | 'tools' | 'output'>('paper-type')
const selectedPaperType = ref<string>('')
const currentStepIndex = ref<number>(0)
const currentVisualizationType = ref<string>('')
const currentStepInfo = ref<any>({})

// 生成的内容
const generatedText = ref<string>('')
const generatedTableData = ref<any>(null)
const generatedCitations = ref<any[]>([])

// 步骤名称映射
const stepNames = {
  'paper-type': '选择论文类型',
  'roadmap': '研究路线图',
  'tools': '工具与可视化',
  'output': '结果输出'
}

// 进度计算
const progressPercentage = computed(() => {
  const steps = ['paper-type', 'roadmap', 'tools', 'output']
  const currentIndex = steps.indexOf(currentStep.value)
  return ((currentIndex + 1) / steps.length) * 100
})

// 论文类型选择处理
function handlePaperTypeSelect(type: string) {
  selectedPaperType.value = type
  console.log('Selected paper type:', type) // 调试日志
  // 跳转到研究页面，并传递论文类型参数
  router.push({
    path: '/research',
    query: { 
      type: type
    }
  })
}

// 研究步骤变化处理
function handleStepChange(stepIndex: number, step: any) {
  currentStepIndex.value = stepIndex
  currentStepInfo.value = step
  
  // 根据步骤显示相应的可视化
  if (step.id === 'analysis') {
    if (selectedPaperType.value === 'qualitative') {
      currentVisualizationType.value = 'coding-model'
    } else if (selectedPaperType.value === 'quantitative') {
      currentVisualizationType.value = 'statistics-table'
    } else if (selectedPaperType.value === 'literature') {
      currentVisualizationType.value = 'concept-map'
    }
    currentStep.value = 'tools'
  }
}

// 工具使用处理
function handleToolUse(tool: string) {
  // 根据工具类型生成相应的提示
  const toolPrompts = {
    '问题生成器': '请帮我生成研究问题，我需要一个明确、可研究的问题。',
    '编码模型': '请帮我建立编码模型，我需要对质性数据进行主题分析。',
    'SPSS脚本': '请帮我生成SPSS分析脚本，我需要进行描述性统计和假设检验。',
    '文献检索': '请帮我检索相关文献，我需要找到与我的研究主题相关的高质量文献。',
    '概念分析': '请帮我进行概念分析，我需要梳理核心概念和构建概念框架。',
    '理论选择': '请帮我选择合适的理论框架，我需要为我的研究找到合适的理论视角。'
  }
  
  const prompt = toolPrompts[tool as keyof typeof toolPrompts] || `请帮我使用${tool}工具。`
  
  // 这里可以集成AI对话功能
  console.log('工具使用:', tool, '提示:', prompt)
  
  // 模拟生成内容
  generateContent(tool, prompt)
}

// 研究完成处理
function handleResearchComplete() {
  currentStep.value = 'output'
  generateFinalOutput()
}

// 可视化处理
function handleVisualizationExport(type: string, data: any) {
  console.log('导出可视化:', type, data)
}

function handleVisualizationRefresh() {
  console.log('刷新可视化')
}

// 输出处理
function handleOutputExport(type: string, data: any) {
  console.log('导出输出:', type, data)
}

function handleOutputClear() {
  generatedText.value = ''
  generatedTableData.value = null
  generatedCitations.value = []
}

// 生成内容
function generateContent(tool: string, prompt: string) {
  // 模拟AI生成内容
  setTimeout(() => {
    if (tool.includes('问题') || tool.includes('概念')) {
      generatedText.value += `\n\n## ${tool}结果\n\n基于您的研究类型，我为您生成了以下内容：\n\n${prompt}\n\n[这里将显示AI生成的具体内容]`
    }
  }, 1000)
}

// 生成最终输出
function generateFinalOutput() {
  generatedText.value = `# ${selectedPaperType.value === 'qualitative' ? '质性研究' : selectedPaperType.value === 'quantitative' ? '量化研究' : '文献研究'}报告

## 研究概述
本研究采用${selectedPaperType.value === 'qualitative' ? '质性研究方法' : selectedPaperType.value === 'quantitative' ? '量化研究方法' : '文献研究方法'}，通过系统性的分析和研究，得出以下结论...

## 主要发现
1. 研究发现一
2. 研究发现二
3. 研究发现三

## 结论与建议
基于研究结果，我们提出以下建议...

## 参考文献
[这里将显示完整的参考文献列表]`

  generatedTableData.value = {
    headers: ['变量', '均值', '标准差', '显著性'],
    rows: [
      ['学习动机', '4.25', '0.68', 'p < 0.001'],
      ['学习效果', '3.89', '0.72', 'p < 0.001'],
      ['技术接受度', '4.12', '0.59', 'p < 0.01']
    ]
  }

  generatedCitations.value = [
    {
      content: 'Smith, J. (2023). Educational technology and learning outcomes. Journal of Educational Research, 45(2), 123-145.',
      type: 'journal',
      authors: ['Smith, J.'],
      year: 2023,
      title: 'Educational technology and learning outcomes'
    },
    {
      content: 'Johnson, M. (2022). Digital learning environments: A comprehensive review. Educational Technology Review, 34(1), 67-89.',
      type: 'journal',
      authors: ['Johnson, M.'],
      year: 2022,
      title: 'Digital learning environments: A comprehensive review'
    }
  ]
}

// 导航函数
function goBack() {
  router.push('/')
}

function goBackStep() {
  if (currentStep.value === 'roadmap') {
    currentStep.value = 'paper-type'
  } else if (currentStep.value === 'tools') {
    currentStep.value = 'roadmap'
  } else if (currentStep.value === 'output') {
    currentStep.value = 'tools'
  }
}

function startNewResearch() {
  currentStep.value = 'paper-type'
  selectedPaperType.value = ''
  currentStepIndex.value = 0
  currentVisualizationType.value = ''
  currentStepInfo.value = {}
  generatedText.value = ''
  generatedTableData.value = null
  generatedCitations.value = []
}

// 组件挂载时检查路由参数
onMounted(() => {
  const { step, paperType, autoComplete } = route.query
  
  if (step === 'output' && paperType) {
    // 直接跳转到结果输出步骤
    selectedPaperType.value = paperType as string
    currentStep.value = 'output'
    
    if (autoComplete === 'true') {
      // 自动完成模式，生成完整的研究结果
      generateFinalOutput()
    }
  }
})
</script>

<style scoped>
.agent-page {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.agent-header {
  background: #ffffff;
  border-bottom: 1px solid #e1e4e8;
  padding: 20px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h1 {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  color: #1f2328;
}

.header-left p {
  margin: 0;
  color: #656d76;
  font-size: 16px;
}

.agent-main {
  flex: 1;
  padding: 40px 0;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.step-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 32px;
  background: #f6f8fa;
  border-bottom: 1px solid #e1e4e8;
}

.step-number {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #4b9e5f;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
}

.step-info h2 {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: #1f2328;
}

.step-info p {
  margin: 0;
  color: #656d76;
  font-size: 16px;
  line-height: 1.5;
}

.tools-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  padding: 32px;
}

.tools-sidebar {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.current-step-info h3 {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2328;
}

.current-step-info p {
  margin: 0 0 20px;
  color: #656d76;
  line-height: 1.5;
}

.step-tools h4 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: #1f2328;
}

.tools-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tool-button {
  width: 100%;
  justify-content: flex-start;
}

.tools-main {
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e1e4e8;
  overflow: hidden;
}

.agent-footer {
  background: #ffffff;
  border-top: 1px solid #e1e4e8;
  padding: 20px 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-info span {
  font-size: 14px;
  color: #656d76;
  white-space: nowrap;
}

.progress-bar {
  width: 200px;
  height: 8px;
  background: #e1e4e8;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4b9e5f;
  transition: width 0.3s ease;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .tools-layout {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .progress-info {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
