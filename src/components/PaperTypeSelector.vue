<template>
  <div class="paper-type-selector">
    <div class="selector-header">
      <h3>选择论文类型</h3>
      <p>请选择您的研究类型，系统将为您提供相应的研究路线和工具支持</p>
    </div>
    
    <div class="type-cards">
      <div 
        v-for="type in paperTypes" 
        :key="type.id"
        class="type-card"
        :class="{ active: selectedType === type.id }"
        @click="selectType(type.id)"
      >
        <div class="card-icon">
          <SvgIcon :icon="type.icon" :width="32" :height="32" />
        </div>
        <div class="card-content">
          <h4>{{ type.name }}</h4>
          <p>{{ type.description }}</p>
          <div class="features">
            <span v-for="feature in type.features" :key="feature" class="feature-tag">
              {{ feature }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="selector-actions">
      <NButton 
        type="primary" 
        size="large" 
        :disabled="!selectedType"
        @click="confirmSelection"
      >
        开始研究
      </NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NButton } from 'naive-ui'
import { SvgIcon } from '@/components/common'

interface PaperType {
  id: string
  name: string
  description: string
  icon: string
  features: string[]
}

const emit = defineEmits<{
  select: [type: string]
}>()

const selectedType = ref<string>('')

const paperTypes: PaperType[] = [
  {
    id: 'qualitative',
    name: '质性研究',
    description: '通过深度访谈、观察等方法探索现象的本质和意义',
    icon: 'ri:user-heart-line',
    features: ['深度访谈', '主题分析', '编码模型', '理论建构']
  },
  {
    id: 'quantitative', 
    name: '量化研究',
    description: '通过问卷调查、实验等方法进行数据分析和统计检验',
    icon: 'ri:bar-chart-line',
    features: ['问卷调查', '统计分析', '假设检验', '回归分析']
  },
  {
    id: 'literature',
    name: '文献研究',
    description: '通过文献综述、理论分析等方法进行学术研究',
    icon: 'ri:book-open-line',
    features: ['文献综述', '概念梳理', '理论框架', '研究空白']
  }
]

function selectType(typeId: string) {
  selectedType.value = typeId
}

function confirmSelection() {
  if (selectedType.value) {
    emit('select', selectedType.value)
  }
}
</script>

<style scoped>
.paper-type-selector {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.selector-header {
  text-align: center;
  margin-bottom: 32px;
}

.selector-header h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #1f2328;
}

.selector-header p {
  color: #656d76;
  margin: 0;
}

.type-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.type-card {
  border: 2px solid #e1e4e8;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;
}

.type-card:hover {
  border-color: #4b9e5f;
  box-shadow: 0 4px 12px rgba(75, 158, 95, 0.15);
}

.type-card.active {
  border-color: #4b9e5f;
  background: #f6f8fa;
  box-shadow: 0 4px 12px rgba(75, 158, 95, 0.2);
}

.card-icon {
  margin-bottom: 12px;
  color: #4b9e5f;
}

.card-content h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #1f2328;
}

.card-content p {
  color: #656d76;
  margin: 0 0 12px;
  line-height: 1.5;
}

.features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.feature-tag {
  background: #e1e4e8;
  color: #656d76;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.type-card.active .feature-tag {
  background: #4b9e5f;
  color: #ffffff;
}

.selector-actions {
  text-align: center;
}
</style>
