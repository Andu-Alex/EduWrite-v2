<template>
  <div class="visualization-panel">
    <div class="panel-header">
      <h4>{{ currentVisualization.title }}</h4>
      <div class="panel-actions">
        <NButton size="small" @click="exportVisualization">
          <template #icon>
            <SvgIcon icon="ri:download-line" />
          </template>
          导出
        </NButton>
        <NButton size="small" @click="refreshVisualization">
          <template #icon>
            <SvgIcon icon="ri:refresh-line" />
          </template>
          刷新
        </NButton>
      </div>
    </div>
    
    <div class="panel-content">
      <!-- 主题图谱 -->
      <div v-if="currentVisualization.type === 'topic-map'" class="topic-map">
        <div class="map-container">
          <div class="central-topic">{{ currentVisualization.data.centralTopic }}</div>
          <div class="subtopics">
            <div 
              v-for="subtopic in currentVisualization.data.subtopics" 
              :key="subtopic.id"
              class="subtopic-node"
              :style="{ 
                left: subtopic.x + '%', 
                top: subtopic.y + '%',
                '--color': subtopic.color 
              }"
            >
              <div class="node-content">
                <div class="node-title">{{ subtopic.title }}</div>
                <div class="node-connections">{{ subtopic.connections }} 连接</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 编码模型 -->
      <div v-else-if="currentVisualization.type === 'coding-model'" class="coding-model">
        <div class="model-tree">
          <div 
            v-for="category in currentVisualization.data.categories" 
            :key="category.id"
            class="category-level"
          >
            <div class="category-header">
              <SvgIcon :icon="category.icon" />
              <span>{{ category.name }}</span>
              <span class="code-count">{{ category.codes.length }} 个编码</span>
            </div>
            <div class="codes-list">
              <div 
                v-for="code in category.codes" 
                :key="code.id"
                class="code-item"
              >
                <div class="code-name">{{ code.name }}</div>
                <div class="code-description">{{ code.description }}</div>
                <div class="code-examples">{{ code.examples.length }} 个示例</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 统计表格 -->
      <div v-else-if="currentVisualization.type === 'statistics-table'" class="statistics-table">
        <div class="table-container">
          <table class="stats-table">
            <thead>
              <tr>
                <th v-for="header in currentVisualization.data.headers" :key="header">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in currentVisualization.data.rows" :key="row.id">
                <td v-for="(cell, index) in row.cells" :key="index">
                  <span 
                    v-if="index === 0" 
                    class="variable-name"
                  >
                    {{ cell }}
                  </span>
                  <span 
                    v-else-if="typeof cell === 'number'"
                    class="numeric-value"
                    :class="{ 
                      significant: cell < 0.05,
                      'high-correlation': Math.abs(cell) > 0.7
                    }"
                  >
                    {{ cell.toFixed(3) }}
                  </span>
                  <span v-else>{{ cell }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="table-notes">
          <div class="note-item">
            <span class="note-marker significant"></span>
            <span>p < 0.05 (显著)</span>
          </div>
          <div class="note-item">
            <span class="note-marker high-correlation"></span>
            <span>|r| > 0.7 (高相关)</span>
          </div>
        </div>
      </div>
      
      <!-- 概念图谱 -->
      <div v-else-if="currentVisualization.type === 'concept-map'" class="concept-map">
        <div class="concept-network">
          <div 
            v-for="concept in currentVisualization.data.concepts" 
            :key="concept.id"
            class="concept-node"
            :style="{ 
              left: concept.x + '%', 
              top: concept.y + '%',
              '--size': concept.importance + 'px'
            }"
          >
            <div class="concept-content">
              <div class="concept-name">{{ concept.name }}</div>
              <div class="concept-relations">{{ concept.relations }} 关系</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NButton } from 'naive-ui'
import { SvgIcon } from '@/components/common'

interface VisualizationData {
  type: string
  title: string
  data: any
}

const props = defineProps<{
  visualizationType: string
  data?: any
}>()

const emit = defineEmits<{
  export: [type: string, data: any]
  refresh: []
}>()

const currentVisualization = computed(() => {
  if (props.data) {
    return props.data
  }
  
  // 默认数据
  switch (props.visualizationType) {
    case 'topic-map':
      return {
        type: 'topic-map',
        title: '主题图谱',
        data: {
          centralTopic: '教育技术',
          subtopics: [
            { id: 1, title: '在线学习', x: 20, y: 30, color: '#4b9e5f', connections: 8 },
            { id: 2, title: '人工智能', x: 60, y: 20, color: '#0366d6', connections: 12 },
            { id: 3, title: '学习分析', x: 80, y: 50, color: '#f85149', connections: 6 },
            { id: 4, title: '混合学习', x: 30, y: 70, color: '#ffa500', connections: 9 },
            { id: 5, title: '个性化学习', x: 70, y: 80, color: '#6f42c1', connections: 7 }
          ]
        }
      }
    case 'coding-model':
      return {
        type: 'coding-model',
        title: '编码模型',
        data: {
          categories: [
            {
              id: 1,
              name: '学习体验',
              icon: 'ri:user-heart-line',
              codes: [
                { id: 1, name: '积极体验', description: '学习过程中的正面感受', examples: 15 },
                { id: 2, name: '挑战体验', description: '学习中的困难和挑战', examples: 12 },
                { id: 3, name: '成就感', description: '完成学习任务后的满足感', examples: 18 }
              ]
            },
            {
              id: 2,
              name: '技术使用',
              icon: 'ri:computer-line',
              codes: [
                { id: 4, name: '工具熟悉度', description: '对技术工具的掌握程度', examples: 20 },
                { id: 5, name: '使用频率', description: '技术工具的使用频次', examples: 16 },
                { id: 6, name: '技术障碍', description: '使用技术时遇到的困难', examples: 8 }
              ]
            }
          ]
        }
      }
    case 'statistics-table':
      return {
        type: 'statistics-table',
        title: '统计分析结果',
        data: {
          headers: ['变量', 'M', 'SD', 'r', 'p', '95% CI'],
          rows: [
            { id: 1, cells: ['学习动机', 4.25, 0.68, 0.75, 0.001, '0.68-0.82'] },
            { id: 2, cells: ['学习效果', 3.89, 0.72, 0.82, 0.000, '0.76-0.88'] },
            { id: 3, cells: ['技术接受度', 4.12, 0.59, 0.68, 0.002, '0.60-0.76'] },
            { id: 4, cells: ['学习满意度', 3.95, 0.64, 0.71, 0.001, '0.63-0.79'] }
          ]
        }
      }
    case 'concept-map':
      return {
        type: 'concept-map',
        title: '概念图谱',
        data: {
          concepts: [
            { id: 1, name: '教育技术', x: 50, y: 50, importance: 40, relations: 8 },
            { id: 2, name: '学习理论', x: 30, y: 30, importance: 35, relations: 6 },
            { id: 3, name: '教学设计', x: 70, y: 30, importance: 32, relations: 5 },
            { id: 4, name: '学习环境', x: 20, y: 70, importance: 28, relations: 4 },
            { id: 5, name: '学习评估', x: 80, y: 70, importance: 30, relations: 5 }
          ]
        }
      }
    default:
      return {
        type: 'empty',
        title: '暂无可视化',
        data: {}
      }
  }
})

function exportVisualization() {
  emit('export', currentVisualization.value.type, currentVisualization.value.data)
}

function refreshVisualization() {
  emit('refresh')
}
</script>

<style scoped>
.visualization-panel {
  background: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 12px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e1e4e8;
  background: #f6f8fa;
}

.panel-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2328;
}

.panel-actions {
  display: flex;
  gap: 8px;
}

.panel-content {
  padding: 20px;
  min-height: 300px;
}

/* 主题图谱样式 */
.topic-map {
  height: 400px;
  position: relative;
}

.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  border-radius: 8px;
}

.central-topic {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #4b9e5f;
  color: white;
  padding: 12px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(75, 158, 95, 0.3);
}

.subtopic-node {
  position: absolute;
  background: var(--color, #4b9e5f);
  color: white;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.subtopic-node:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.node-content {
  text-align: center;
}

.node-title {
  font-weight: 600;
  margin-bottom: 2px;
}

.node-connections {
  font-size: 12px;
  opacity: 0.8;
}

/* 编码模型样式 */
.coding-model {
  max-height: 400px;
  overflow-y: auto;
}

.category-level {
  margin-bottom: 20px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f6f8fa;
  border-radius: 8px;
  font-weight: 600;
  color: #1f2328;
}

.code-count {
  margin-left: auto;
  font-size: 12px;
  color: #656d76;
  background: #e1e4e8;
  padding: 2px 8px;
  border-radius: 4px;
}

.codes-list {
  margin-top: 8px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.code-item {
  padding: 12px;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  background: #ffffff;
}

.code-name {
  font-weight: 600;
  color: #1f2328;
  margin-bottom: 4px;
}

.code-description {
  font-size: 12px;
  color: #656d76;
  margin-bottom: 4px;
}

.code-examples {
  font-size: 11px;
  color: #4b9e5f;
  font-weight: 500;
}

/* 统计表格样式 */
.statistics-table {
  overflow-x: auto;
}

.table-container {
  margin-bottom: 16px;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.stats-table th,
.stats-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e1e4e8;
}

.stats-table th {
  background: #f6f8fa;
  font-weight: 600;
  color: #1f2328;
}

.variable-name {
  font-weight: 600;
  color: #1f2328;
}

.numeric-value {
  font-family: 'Monaco', 'Menlo', monospace;
}

.numeric-value.significant {
  color: #f85149;
  font-weight: 600;
}

.numeric-value.high-correlation {
  background: #fff3cd;
  padding: 2px 4px;
  border-radius: 4px;
}

.table-notes {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #656d76;
}

.note-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.note-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.note-marker.significant {
  background: #f85149;
}

.note-marker.high-correlation {
  background: #fff3cd;
  border: 1px solid #ffc107;
}

/* 概念图谱样式 */
.concept-map {
  height: 400px;
  position: relative;
}

.concept-network {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  border-radius: 8px;
}

.concept-node {
  position: absolute;
  background: #4b9e5f;
  color: white;
  padding: 8px 12px;
  border-radius: 50%;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: var(--size, 60px);
  height: var(--size, 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.concept-node:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.concept-content {
  text-align: center;
}

.concept-name {
  font-weight: 600;
  margin-bottom: 2px;
}

.concept-relations {
  font-size: 10px;
  opacity: 0.8;
}
</style>
