<template>
  <div class="research-roadmap">
    <div class="roadmap-header">
      <h3>研究路线图</h3>
      <p>按照以下步骤进行您的研究，每个步骤都有相应的指导和工具支持</p>
    </div>
    
    <div class="roadmap-steps">
      <div 
        v-for="(step, index) in currentSteps" 
        :key="step.id"
        class="step-item"
        :class="{ 
          active: currentStepIndex === index,
          completed: currentStepIndex > index,
          disabled: currentStepIndex < index
        }"
        @click="selectStep(index)"
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
                @click.stop="useTool(tool)"
              >
                {{ tool }}
              </span>
            </div>
          </div>
          
          <div v-if="step.visualization" class="step-visualization">
            <div class="viz-placeholder">
              <SvgIcon :icon="step.visualization.icon" :width="24" :height="24" />
              <span>{{ step.visualization.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showActions !== false" class="roadmap-actions">
      <NButton 
        v-if="currentStepIndex > 0"
        @click="previousStep"
        size="large"
      >
        上一步
      </NButton>
      <NButton 
        v-if="currentStepIndex < currentSteps.length - 1"
        type="primary"
        @click="nextStep"
        size="large"
      >
        下一步
      </NButton>
      <NButton 
        v-if="currentStepIndex === currentSteps.length - 1"
        type="success"
        @click="completeResearch"
        size="large"
      >
        完成研究
      </NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { NButton } from 'naive-ui'
import { SvgIcon } from '@/components/common'

interface ResearchStep {
  id: string
  title: string
  description: string
  tools?: string[]
  visualization?: {
    icon: string
    name: string
  }
}

const props = defineProps<{
  paperType: string
  currentStep?: number
  showActions?: boolean
}>()

const emit = defineEmits<{
  stepChange: [stepIndex: number, step: ResearchStep]
  toolUse: [tool: string]
  complete: []
}>()

const currentStepIndex = ref(props.currentStep || 0)

// 监听props变化
watch(() => props.currentStep, (newStep) => {
  if (newStep !== undefined) {
    currentStepIndex.value = newStep
  }
}, { immediate: true })

const qualitativeSteps: ResearchStep[] = [
  {
    id: 'problem',
    title: '问题提出',
    description: '确定研究问题，明确研究目标和意义',
    tools: ['问题生成器', '研究目标设定', '意义分析']
  },
  {
    id: 'design',
    title: '研究设计',
    description: '选择研究方法，设计研究流程',
    tools: ['方法选择器', '流程设计', '伦理审查']
  },
  {
    id: 'data_collection',
    title: '数据收集',
    description: '进行深度访谈、观察等数据收集活动',
    tools: ['访谈指南', '观察记录表', '录音转录']
  },
  {
    id: 'analysis',
    title: '数据分析',
    description: '进行主题分析、编码等质性分析',
    tools: ['编码模型', '主题分析', '理论建构'],
    visualization: {
      icon: 'ri:mind-map',
      name: '编码模型'
    }
  },
  {
    id: 'writing',
    title: '结果写作',
    description: '撰写研究结果，进行理论讨论',
    tools: ['结果模板', '讨论框架', '引用管理']
  }
]

const quantitativeSteps: ResearchStep[] = [
  {
    id: 'problem',
    title: '问题提出',
    description: '确定研究假设，设计研究变量',
    tools: ['假设生成器', '变量设计', '量表选择']
  },
  {
    id: 'design',
    title: '研究设计',
    description: '设计实验或调查方案',
    tools: ['实验设计', '问卷设计', '抽样方案']
  },
  {
    id: 'data_collection',
    title: '数据收集',
    description: '进行问卷调查、实验等数据收集',
    tools: ['问卷系统', '实验平台', '数据管理']
  },
  {
    id: 'analysis',
    title: '数据分析',
    description: '进行统计分析，检验假设',
    tools: ['SPSS脚本', 'R代码', 'Python分析'],
    visualization: {
      icon: 'ri:bar-chart-line',
      name: '统计图表'
    }
  },
  {
    id: 'writing',
    title: '结果写作',
    description: '撰写统计结果，进行结果解释',
    tools: ['统计报告', '结果解释', '表格生成']
  }
]

const literatureSteps: ResearchStep[] = [
  {
    id: 'problem',
    title: '问题提出',
    description: '确定研究问题，识别研究空白',
    tools: ['问题挖掘', '空白分析', '价值评估']
  },
  {
    id: 'concept',
    title: '概念梳理',
    description: '梳理核心概念，构建概念框架',
    tools: ['概念分析', '关键词网络', '概念界定'],
    visualization: {
      icon: 'ri:node-tree',
      name: '概念图谱'
    }
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
]

const currentSteps = computed(() => {
  switch (props.paperType) {
    case 'qualitative':
      return qualitativeSteps
    case 'quantitative':
      return quantitativeSteps
    case 'literature':
      return literatureSteps
    default:
      return []
  }
})

function selectStep(index: number) {
  if (index <= currentStepIndex.value) {
    currentStepIndex.value = index
    emit('stepChange', index, currentSteps.value[index])
  }
}

function nextStep() {
  if (currentStepIndex.value < currentSteps.value.length - 1) {
    currentStepIndex.value++
    emit('stepChange', currentStepIndex.value, currentSteps.value[currentStepIndex.value])
  }
}

function previousStep() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
    emit('stepChange', currentStepIndex.value, currentSteps.value[currentStepIndex.value])
  }
}

function useTool(tool: string) {
  emit('toolUse', tool)
}

function completeResearch() {
  emit('complete')
}
</script>

<style scoped>
.research-roadmap {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.roadmap-header {
  text-align: center;
  margin-bottom: 32px;
}

.roadmap-header h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #1f2328;
}

.roadmap-header p {
  color: #656d76;
  margin: 0;
}

.roadmap-steps {
  margin-bottom: 32px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border: 2px solid #e1e4e8;
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;
}

.step-item:hover:not(.disabled) {
  border-color: #4b9e5f;
  box-shadow: 0 4px 12px rgba(75, 158, 95, 0.15);
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
  cursor: not-allowed;
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
  color: #ffffff;
}

.step-item.completed .step-number {
  background: #28a745;
  color: #ffffff;
}

.step-content {
  flex: 1;
}

.step-content h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #1f2328;
}

.step-content p {
  color: #656d76;
  margin: 0 0 12px;
  line-height: 1.5;
}

.step-tools {
  margin-bottom: 12px;
}

.tools-label {
  font-size: 14px;
  font-weight: 500;
  color: #656d76;
  margin-right: 8px;
}

.tools-list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tool-tag {
  background: #e1e4e8;
  color: #656d76;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tool-tag:hover {
  background: #4b9e5f;
  color: #ffffff;
}

.step-visualization {
  margin-top: 12px;
}

.viz-placeholder {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  color: #656d76;
  font-size: 14px;
}

.roadmap-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
