<template>
  <div class="research-page">
    <!-- 页面头部 -->
    <header class="research-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">学术研究智能助手</h1>
          <p class="page-subtitle">专业的学术研究指导，从选题到成稿全程陪伴</p>
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
    <main class="research-main">
      <div class="main-container">
        <!-- 左侧：对话区域 -->
        <div class="chat-section">
          <div class="chat-header">
            <h2>研究对话</h2>
            <div class="research-type">
              <span class="type-label">研究类型：</span>
              <span class="type-value">{{ researchTypeName }}</span>
            </div>
          </div>
          
          <!-- 标签页切换 -->
          <div class="chat-tabs">
            <div 
              class="tab-item" 
              :class="{ 'active': activeTab === 'chat' }"
              @click="activeTab = 'chat'"
            >
              <SvgIcon icon="ri:chat-3-line" />
              <span>对话</span>
            </div>
            <div 
              class="tab-item" 
              :class="{ 'active': activeTab === 'visualization' }"
              @click="activeTab = 'visualization'"
            >
              <SvgIcon icon="ri:bar-chart-line" />
              <span>可视化分析</span>
            </div>
          </div>
          
          <div class="chat-messages" ref="chatMessagesRef">
            <!-- 对话标签页 -->
            <div v-if="activeTab === 'chat'" class="chat-view">
              <div v-if="!hasStarted" class="welcome-message">
                <div class="welcome-content">
                  <div class="welcome-icon">
                    <SvgIcon icon="ri:book-open-line" :width="48" :height="48" />
                  </div>
                  <h3>欢迎使用学术研究智能助手！</h3>
                  <p>请告诉我您想要研究什么课题？您可以描述：</p>
                  <ul>
                    <li>研究主题或问题</li>
                    <li>感兴趣的教育现象</li>
                    <li>想要探索的具体领域</li>
                  </ul>
                  <p>请详细描述您的研究想法，我会为您提供专业的指导。</p>
                </div>
              </div>
              
              <div v-for="(message, index) in messages" :key="index" class="message-item" :class="{ 'user-message': message.isUser, 'ai-message': !message.isUser }">
                <div class="message-avatar">
                  <SvgIcon v-if="message.isUser" icon="ri:user-line" />
                  <SvgIcon v-else icon="ri:robot-line" />
                </div>
                <div class="message-content">
                  <div class="message-text" v-html="message.content"></div>
                  <div class="message-time">{{ message.time }}</div>
                </div>
              </div>
              
              <!-- 生成状态提示 -->
              <div v-if="isGenerating" class="generation-status">
                <div class="generation-content">
                  <div class="generation-spinner">
                    <SvgIcon icon="ri:loader-4-line" class="animate-spin" />
                  </div>
                  <div class="generation-text">
                    <p>正在生成{{ currentStepName }}内容...</p>
                    <p class="generation-hint">请稍候，我会为您提供专业的指导</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 可视化分析标签页 -->
            <div v-if="activeTab === 'visualization'" class="visualization-view">
              <div v-if="currentVisualization" class="visualization-container">
                <div class="visualization-header">
                  <h3>{{ currentVisualization.title }}</h3>
                  <p>{{ currentVisualization.description }}</p>
                </div>
                <div class="visualization-content">
                  <TopicMap v-if="currentVisualization.type === 'topic-map'" :data="currentVisualization.data" />
                  <CodingModel v-else-if="currentVisualization.type === 'coding-model'" :data="currentVisualization.data" />
                  <StatisticsTable v-else-if="currentVisualization.type === 'statistics-table'" :data="currentVisualization.data" />
                </div>
              </div>
              
              <!-- 文献检索结果展示 -->
              <div v-else-if="literatureResults.length > 0" class="literature-results">
                <div class="literature-header">
                  <h3>文献检索结果</h3>
                  <p>找到 {{ literatureResults.length }} 篇相关文献</p>
                </div>
                <div class="literature-list">
                  <div 
                    v-for="(result, index) in literatureResults" 
                    :key="result.id" 
                    class="literature-item"
                  >
                    <div class="literature-title">
                      <span class="literature-index">{{ index + 1 }}.</span>
                      <a :href="result.url" target="_blank" class="literature-link">
                        {{ result.title }}
                      </a>
                    </div>
                    <div class="literature-meta">
                      <span class="literature-authors">{{ result.authors.join(', ') }}</span>
                      <span class="literature-date">{{ result.publishedDate }}</span>
                      <span class="literature-score">相关性: {{ (result.relevanceScore * 100).toFixed(0) }}%</span>
                    </div>
                    <div class="literature-abstract">
                      {{ result.abstract }}
                    </div>
                    <div class="literature-keywords">
                      <span 
                        v-for="keyword in result.keywords.slice(0, 5)" 
                        :key="keyword"
                        class="keyword-tag"
                      >
                        {{ keyword }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="no-visualization">
                <div class="no-viz-content">
                  <SvgIcon icon="ri:bar-chart-line" :width="64" :height="64" />
                  <h3>暂无可视化分析</h3>
                  <p>请先开始研究流程，系统将在理论框架步骤为您生成可视化分析</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="chat-input">
            <!-- 步骤选择提示 -->
            <div v-if="isStepSelected && selectedStepIndex >= 0" class="step-selection-hint">
              <div class="hint-content">
                <SvgIcon icon="ri:information-line" />
                <span>正在针对"{{ researchSteps[selectedStepIndex]?.title }}"步骤进行问答</span>
                <NButton size="small" @click="clearStepSelection" type="default">
                  清除选择
                </NButton>
              </div>
            </div>
            
            <!-- 文献检索输入 -->
            <div v-if="activeTab === 'visualization'" class="literature-search-input">
              <div class="search-hint">
                <SvgIcon icon="ri:search-line" />
                <span>手动检索文献</span>
              </div>
              <div class="search-container">
                <NInput
                  v-model:value="searchQuery"
                  placeholder="输入检索关键词..."
                  :disabled="isSearching"
                />
                <NButton
                  type="primary"
                  @click="performManualSearch"
                  :disabled="!searchQuery.trim() || isSearching"
                  :loading="isSearching"
                >
                  <template #icon>
                    <SvgIcon icon="ri:search-line" />
                  </template>
                  检索
                </NButton>
                <NButton
                  type="default"
                  @click="testLiteratureSearch"
                  :disabled="isSearching"
                >
                  <template #icon>
                    <SvgIcon icon="ri:test-tube-line" />
                  </template>
                  测试
                </NButton>
              </div>
            </div>
            
            <div class="input-container">
              <NInput
                v-model:value="inputMessage"
                type="textarea"
                :placeholder="isStepSelected ? '请针对当前步骤提问...' : '请输入您的研究问题或想法...'"
                :autosize="{ minRows: 1, maxRows: 4 }"
                @keypress="handleKeyPress"
                :disabled="isGenerating"
              />
              <NButton
                type="primary"
                @click="sendMessage"
                :disabled="!inputMessage.trim() || isGenerating"
                :loading="isGenerating"
              >
                <template #icon>
                  <SvgIcon icon="ri:send-plane-fill" />
                </template>
                发送
              </NButton>
            </div>
          </div>
        </div>

        <!-- 右侧：动态路线图 -->
        <div class="roadmap-section">
          <div class="roadmap-header">
            <h3>研究路线图</h3>
            <div class="progress-indicator">
              <span>{{ currentStepIndex + 1 }}/{{ totalSteps }}</span>
            </div>
          </div>
          
          <div class="roadmap-steps">
            <div
              v-for="(step, index) in researchSteps"
              :key="step.id"
              class="step-item"
              :class="{
                'active': currentStepIndex === index,
                'completed': currentStepIndex > index,
                'disabled': currentStepIndex < index,
                'selected': selectedStepIndex === index
              }"
              @click="handleStepClick(index)"
            >
              <div class="step-number">
                <span v-if="currentStepIndex > index">✓</span>
                <span v-else>{{ index + 1 }}</span>
              </div>
              
              <div class="step-content">
                <h4>{{ step.title }}</h4>
                <p>{{ step.description }}</p>
                
                <div v-if="step.tools && step.tools.length" class="step-tools">
                  <span class="tools-label">推荐工具：</span>
                  <div class="tools-list">
                    <span
                      v-for="tool in step.tools"
                      :key="tool"
                      class="tool-tag"
                    >
                      {{ tool }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 可视化区域 -->
          <!-- <div v-if="currentVisualization" class="visualization-area">
            <h4>可视化分析</h4>
            <div class="visualization-content">
              <component :is="currentVisualization.component" :data="currentVisualization.data" />
            </div>
          </div> -->
        </div>
      </div>
    </main>

    <!-- 底部操作栏 -->
    <footer class="research-footer">
      <div class="footer-content">
        <div class="export-options">
          <NButton @click="exportToWord" type="default">
            <template #icon>
              <SvgIcon icon="ri:file-word-line" />
            </template>
            导出Word
          </NButton>
          <NButton @click="exportToLaTeX" type="default">
            <template #icon>
              <SvgIcon icon="ri:code-line" />
            </template>
            导出LaTeX
          </NButton>
          <NButton @click="exportCitations" type="default">
            <template #icon>
              <SvgIcon icon="ri:bookmark-line" />
            </template>
            导出引用
          </NButton>
        </div>
        
        <div class="progress-info">
          <span>当前步骤: {{ currentStepName }}</span>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NButton, NInput, useMessage } from 'naive-ui'
import { SvgIcon } from '@/components/common'
import TopicMap from '@/components/visualization/TopicMap.vue'
import CodingModel from '@/components/visualization/CodingModel.vue'
import StatisticsTable from '@/components/visualization/StatisticsTable.vue'
import { 
  getResearchStepResponse, 
  generateResearchResponse, 
  searchArxivLiterature, 
  generateVisualizationData,
  exportResearchToWord,
  exportResearchToLaTeX,
  exportCitations as exportCitationsAPI,
  type ResearchMessage,
  type ResearchStep,
  type LiteratureResult,
  type VisualizationData
} from '@/api/research'

const router = useRouter()
const route = useRoute()
const message = useMessage()

// 基础状态
const hasStarted = ref(false)
const isGenerating = ref(false)
const inputMessage = ref('')
const messages = ref<ResearchMessage[]>([])
const currentStepIndex = ref(0)
const researchType = ref('literature') // literature, qualitative, quantitative
const activeTab = ref('chat') // chat, visualization
const currentVisualization = ref<VisualizationData | null>(null)
const selectedStepIndex = ref(-1) // 当前选中的步骤索引
const isStepSelected = ref(false) // 是否选中了步骤
const literatureResults = ref<LiteratureResult[]>([]) // 文献检索结果
const researchContext = ref('') // 研究背景上下文
const searchQuery = ref('') // 文献检索查询
const isSearching = ref(false) // 是否正在检索

// 聊天相关
const chatMessagesRef = ref<HTMLElement>()

// 研究步骤定义
const researchSteps = ref<ResearchStep[]>([
  {
    id: 'problem',
    title: '问题提出',
    description: '确定研究问题，明确研究目标和意义',
    tools: ['问题生成器', '研究目标设定', '意义分析']
  },
  {
    id: 'concept',
    title: '概念梳理',
    description: '梳理核心概念，构建概念框架',
    tools: ['概念分析', '关键词网络', '概念界定']
  },
  {
    id: 'theory',
    title: '理论框架',
    description: '构建理论框架，选择理论视角',
    tools: ['理论选择', '框架构建', '视角分析']
  },
  {
    id: 'review',
    title: '文献综述',
    description: '进行系统性文献综述',
    tools: ['文献检索', '综述策略', '空白识别']
  },
  {
    id: 'writing',
    title: '写作支持',
    description: '撰写文献综述，构建理论论述',
    tools: ['综述模板', '逻辑框架', '引用管理']
  }
])


// 计算属性
const researchTypeName = computed(() => {
  const types = {
    literature: '文献研究',
    qualitative: '质性研究',
    quantitative: '量化研究'
  }
  return types[researchType.value as keyof typeof types] || '文献研究'
})

const currentStepName = computed(() => {
  return researchSteps.value[currentStepIndex.value]?.title || ''
})

const totalSteps = computed(() => researchSteps.value.length)

const progressPercentage = computed(() => {
  return ((currentStepIndex.value + 1) / totalSteps.value) * 100
})

// 方法
function goBack() {
  router.push('/')
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

function sendMessage() {
  if (!inputMessage.value.trim() || isGenerating.value) return
  
  const message = inputMessage.value.trim()
  inputMessage.value = ''
  
  // 添加用户消息
  addMessage(message, true)
  
  // 如果选中了步骤，提供步骤相关的回答
  if (isStepSelected.value && selectedStepIndex.value >= 0) {
    handleStepQuestion(message, selectedStepIndex.value)
  } else {
    // 开始生成过程
    startGeneration()
  }
}

function addMessage(content: string, isUser: boolean = false, stepId?: string) {
  messages.value.push({
    content,
    isUser,
    time: new Date().toLocaleString(),
    stepId
  })
  
  nextTick(() => {
    scrollToBottom()
  })
}

function scrollToBottom() {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

// 步骤点击处理
function handleStepClick(stepIndex: number) {
  selectedStepIndex.value = stepIndex
  isStepSelected.value = true
  
  // 切换到对话标签页
  activeTab.value = 'chat'
  
  // 添加步骤选择提示消息
  const step = researchSteps.value[stepIndex]
  addMessage(`您选择了"${step.title}"步骤，可以针对此步骤进行提问。例如：\n\n• ${step.tools?.[0] || '如何理解这个步骤？'}\n• ${step.tools?.[1] || '这个步骤有什么注意事项？'}\n• ${step.tools?.[2] || '如何更好地完成这个步骤？'}\n\n请告诉我您想了解什么？`, false)
}

// 步骤问答处理
async function handleStepQuestion(question: string, stepIndex: number) {
  const step = researchSteps.value[stepIndex]
  const stepName = step.title
  
  try {
    isGenerating.value = true
    
    // 使用真实AI API获取回答
    const answer = await getResearchStepResponse(step.id, question, researchContext.value)
    addMessage(answer, false, step.id)
    
    // 如果是文献综述步骤，同时进行文献检索
    if (step.id === 'review' && (question.includes('文献') || question.includes('检索'))) {
      await performLiteratureSearch(question)
    }
    
    // 如果是理论框架步骤，生成可视化数据
    if (step.id === 'theory') {
      await generateStepVisualization()
    }
    
  } catch (error) {
    console.error('步骤问答处理错误:', error)
    message.error('获取AI回复失败，请稍后重试')
    addMessage(`抱歉，处理您的问题时出现错误。关于"${stepName}"步骤，这是一个重要的研究环节。请具体说明您想了解哪个方面，我会为您提供详细的指导。`, false)
  } finally {
    isGenerating.value = false
  }
}


// 清除步骤选择
function clearStepSelection() {
  selectedStepIndex.value = -1
  isStepSelected.value = false
}

async function startGeneration() {
  if (hasStarted.value) return
  
  hasStarted.value = true
  isGenerating.value = true
  
  // 清除步骤选择状态
  selectedStepIndex.value = -1
  isStepSelected.value = false
  
  // 保存研究背景
  researchContext.value = messages.value[messages.value.length - 1]?.content || ''
  
  // 开始真实AI生成过程
  await simulateResearchProcess()
}

async function simulateResearchProcess() {
  try {
    // 为每个研究步骤生成AI回复
    for (let stepIndex = 0; stepIndex < researchSteps.value.length; stepIndex++) {
      currentStepIndex.value = stepIndex
      const step = researchSteps.value[stepIndex]
      
      // 生成步骤相关的AI回复
      const stepPrompt = `请为"${step.title}"步骤提供专业的指导建议。研究背景：${researchContext.value}`
      const response = await generateResearchResponse(stepPrompt, researchTypeName.value, stepIndex)
      addMessage(response, false, step.id)
      
      // 在特定步骤执行特殊功能
      if (step.id === 'review') {
        // 文献综述步骤：进行文献检索
        await performLiteratureSearch(researchContext.value)
      } else if (step.id === 'theory') {
        // 理论框架步骤：生成可视化数据
        await generateStepVisualization()
      }
      
      // 等待一段时间再进入下一步
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  } catch (error) {
    console.error('研究过程生成错误:', error)
    message.error('生成研究指导时出现错误，请稍后重试')
  } finally {
    isGenerating.value = false
  }
}

// 执行文献检索
async function performLiteratureSearch(query: string) {
  try {
    addMessage('正在为您检索相关文献...', false)
    const results = await searchArxivLiterature(query, 10)
    literatureResults.value = results
    
    if (results.length > 0) {
      const summary = `已找到 ${results.length} 篇相关文献：\n\n` +
        results.slice(0, 5).map((result, index) => 
          `${index + 1}. ${result.title}\n   作者: ${result.authors.join(', ')}\n   摘要: ${result.abstract.substring(0, 200)}...\n   链接: ${result.url}`
        ).join('\n\n')
      
      addMessage(summary, false)
    } else {
      addMessage('未找到相关文献，建议调整检索关键词或扩大检索范围。', false)
    }
  } catch (error) {
    console.error('文献检索错误:', error)
    addMessage('文献检索服务暂时不可用，请稍后重试。', false)
  }
}

// 生成步骤可视化数据
async function generateStepVisualization() {
  try {
    const vizData = await generateVisualizationData(
      researchType.value, 
      researchContext.value, 
      researchSteps.value[currentStepIndex.value].id
    )
    
    if (vizData) {
      currentVisualization.value = vizData
      addMessage('已为您生成可视化分析数据，请切换到"可视化分析"标签页查看。', false)
    }
  } catch (error) {
    console.error('可视化数据生成错误:', error)
  }
}

// 手动文献检索
async function performManualSearch() {
  if (!searchQuery.value.trim()) return
  
  try {
    isSearching.value = true
    const results = await searchArxivLiterature(searchQuery.value, 15)
    literatureResults.value = results
    
    if (results.length > 0) {
      message.success(`找到 ${results.length} 篇相关文献`)
      // 切换到可视化标签页显示结果
      activeTab.value = 'visualization'
    } else {
      message.warning('未找到相关文献，建议调整检索关键词')
    }
  } catch (error) {
    console.error('手动文献检索错误:', error)
    message.error('文献检索失败，请稍后重试')
  } finally {
    isSearching.value = false
  }
}

// 测试文献检索功能
async function testLiteratureSearch() {
  try {
    isSearching.value = true
    searchQuery.value = 'education'
    const results = await searchArxivLiterature('education', 5)
    literatureResults.value = results
    
    if (results.length > 0) {
      message.success(`测试成功！找到 ${results.length} 篇相关文献`)
      activeTab.value = 'visualization'
    } else {
      message.error('测试失败：未找到任何文献')
    }
  } catch (error) {
    console.error('测试文献检索错误:', error)
    message.error('测试失败：' + (error instanceof Error ? error.message : String(error)))
  } finally {
    isSearching.value = false
  }
}

// 导出功能
async function exportToWord() {
  try {
    const blob = await exportResearchToWord(messages.value, researchSteps.value)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'research-report.doc'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    message.success('Word文档导出成功')
  } catch (error) {
    console.error('Word导出错误:', error)
    message.error('Word文档导出失败')
  }
}

async function exportToLaTeX() {
  try {
    const blob = await exportResearchToLaTeX(messages.value, researchSteps.value)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'research-report.tex'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    message.success('LaTeX文档导出成功')
  } catch (error) {
    console.error('LaTeX导出错误:', error)
    message.error('LaTeX文档导出失败')
  }
}

async function exportCitations() {
  try {
    if (literatureResults.value.length === 0) {
      message.warning('暂无文献引用可导出')
      return
    }
    
    const blob = await exportCitationsAPI(literatureResults.value)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'citations.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    message.success('引用导出成功')
  } catch (error) {
    console.error('引用导出错误:', error)
    message.error('引用导出失败')
  }
}

// 组件挂载
onMounted(() => {
  const { type } = route.query
  if (type) {
    researchType.value = type as string
  }
})
</script>

<style scoped>
.research-page {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.research-header {
  background: #ffffff;
  border-bottom: 1px solid #e1e4e8;
  padding: 20px 0;
}

.header-content {
  max-width: 1400px;
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

.research-main {
  flex: 1;
  padding: 24px 0;
}

.main-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  height: calc(100vh - 200px);
}

.chat-section {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e1e4e8;
  background: #f6f8fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-tabs {
  display: flex;
  background: #ffffff;
  border-bottom: 1px solid #e1e4e8;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
  color: #656d76;
  font-size: 14px;
  font-weight: 500;
}

.tab-item:hover {
  background: #f6f8fa;
  color: #1f2328;
}

.tab-item.active {
  color: #4b9e5f;
  border-bottom-color: #4b9e5f;
  background: #f8fff9;
}

.tab-item svg {
  width: 16px;
  height: 16px;
}

.chat-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2328;
}

.research-type {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-label {
  color: #656d76;
  font-size: 14px;
}

.type-value {
  background: #4b9e5f;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.welcome-message {
  text-align: center;
  padding: 40px 20px;
}

.welcome-content h3 {
  margin: 0 0 16px;
  font-size: 24px;
  font-weight: 600;
  color: #1f2328;
}

.welcome-content p {
  margin: 0 0 12px;
  color: #656d76;
  line-height: 1.6;
}

.welcome-content ul {
  text-align: left;
  display: inline-block;
  margin: 16px 0;
  color: #656d76;
}

.welcome-content li {
  margin: 8px 0;
}

.message-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.message-item.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-message .message-avatar {
  background: #4b9e5f;
  color: white;
}

.ai-message .message-avatar {
  background: #f0f0f0;
  color: #656d76;
}

.message-content {
  flex: 1;
  max-width: 70%;
}

.user-message .message-content {
  text-align: right;
}

.message-text {
  background: #f6f8fa;
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.user-message .message-text {
  background: #4b9e5f;
  color: white;
}

.message-time {
  font-size: 12px;
  color: #656d76;
  margin-top: 4px;
}

.generation-status {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.generation-content {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f0f9ff;
  padding: 16px 20px;
  border-radius: 8px;
  border: 1px solid #bae6fd;
}

.generation-spinner {
  color: #4b9e5f;
}

.generation-text p {
  margin: 0;
  font-size: 14px;
  color: #1f2328;
}

.generation-hint {
  color: #656d76 !important;
  font-size: 12px !important;
}

.chat-input {
  padding: 20px 24px;
  border-top: 1px solid #e1e4e8;
  background: #f6f8fa;
}

.step-selection-hint {
  margin-bottom: 12px;
  padding: 12px 16px;
  background: #fff5f2;
  border: 1px solid #ff6b35;
  border-radius: 8px;
}

.hint-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #d84315;
}

.hint-content svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.input-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-container .n-input {
  flex: 1;
}

.roadmap-section {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.roadmap-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e1e4e8;
  background: #f6f8fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.roadmap-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2328;
}

.progress-indicator {
  background: #4b9e5f;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}

.roadmap-steps {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border: 2px solid #e1e4e8;
  border-radius: 12px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.step-item.active {
  border-color: #4b9e5f;
  background: #f6f8fa;
  box-shadow: 0 4px 12px rgba(75, 158, 95, 0.2);
}

.step-item.completed {
  border-color: #28a745;
  background: #f8fff9;
}

.step-item.disabled {
  opacity: 0.6;
}

.step-item.selected {
  border-color: #ff6b35;
  background: #fff5f2;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  transform: scale(1.02);
}

.step-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.step-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
  background: #e1e4e8;
  color: #656d76;
}

.step-item.active .step-number {
  background: #4b9e5f;
  color: white;
}

.step-item.completed .step-number {
  background: #28a745;
  color: white;
}

.step-content h4 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2328;
}

.step-content p {
  margin: 0 0 12px;
  color: #656d76;
  font-size: 14px;
  line-height: 1.5;
}

.step-tools {
  margin-top: 8px;
}

.tools-label {
  font-size: 12px;
  font-weight: 500;
  color: #656d76;
  margin-right: 8px;
}

.tools-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.tool-tag {
  background: #e1e4e8;
  color: #656d76;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.visualization-area {
  padding: 20px 24px;
  border-top: 1px solid #e1e4e8;
  background: #f8f9fa;
}

.visualization-area h4 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2328;
}

.research-footer {
  background: #ffffff;
  border-top: 1px solid #e1e4e8;
  padding: 20px 0;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.export-options {
  display: flex;
  gap: 12px;
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

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.chat-view {
  height: 100%;
}

.visualization-view {
  height: 100%;
  overflow-y: auto;
}

.visualization-container {
  padding: 20px;
}

.visualization-container .visualization-header {
  margin-bottom: 20px;
  text-align: center;
}

.visualization-container .visualization-header h3 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 600;
  color: #1f2328;
}

.visualization-container .visualization-header p {
  margin: 0;
  color: #656d76;
  font-size: 14px;
}

.no-visualization {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
}

.no-viz-content {
  text-align: center;
  color: #656d76;
}

.no-viz-content h3 {
  margin: 16px 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2328;
}

.no-viz-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

/* 文献检索结果样式 */
.literature-results {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.literature-header {
  margin-bottom: 20px;
  text-align: center;
}

.literature-header h3 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 600;
  color: #1f2328;
}

.literature-header p {
  margin: 0;
  color: #656d76;
  font-size: 14px;
}

.literature-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.literature-item {
  background: #f8f9fa;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
}

.literature-item:hover {
  border-color: #4b9e5f;
  box-shadow: 0 2px 8px rgba(75, 158, 95, 0.1);
}

.literature-title {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.literature-index {
  color: #4b9e5f;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.literature-link {
  color: #1f2328;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.4;
  flex: 1;
}

.literature-link:hover {
  color: #4b9e5f;
  text-decoration: underline;
}

.literature-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #656d76;
}

.literature-authors {
  font-style: italic;
}

.literature-date {
  background: #e1e4e8;
  padding: 2px 6px;
  border-radius: 4px;
}

.literature-score {
  background: #4b9e5f;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.literature-abstract {
  color: #656d76;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
}

.literature-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.keyword-tag {
  background: #e1e4e8;
  color: #656d76;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

/* 文献检索输入样式 */
.literature-search-input {
  margin-bottom: 16px;
  padding: 16px;
  background: #f8f9fa;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
}

.search-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #1f2328;
}

.search-hint svg {
  width: 16px;
  height: 16px;
  color: #4b9e5f;
}

.search-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-container .n-input {
  flex: 1;
}

@media (max-width: 1200px) {
  .main-container {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .roadmap-section {
    order: -1;
  }
}
</style>
