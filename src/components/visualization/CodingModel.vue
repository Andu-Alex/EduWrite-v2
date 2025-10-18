<template>
  <div class="coding-model">
    <div class="model-header">
      <h4>编码模型</h4>
      <p>质性研究主题编码分析结果</p>
    </div>
    
    <div class="model-container">
      <div class="code-levels">
        <div
          v-for="(level, levelIndex) in data?.levels || []"
          :key="levelIndex"
          class="code-level"
          :class="`level-${levelIndex + 1}`"
        >
          <div class="level-title">{{ level.name }}</div>
          <div class="level-codes">
            <div
              v-for="(code, codeIndex) in level.codes"
              :key="codeIndex"
              class="code-item"
              :style="{ '--delay': (levelIndex * 0.3 + codeIndex * 0.1) + 's' }"
            >
              <span class="code-name">{{ code.name }}</span>
              <span class="code-count">{{ code.count }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="model-connections">
        <svg class="connection-svg" viewBox="0 0 400 300">
          <path
            v-for="(connection, index) in data?.connections || []"
            :key="index"
            :d="connection.path"
            stroke="#4b9e5f"
            stroke-width="2"
            fill="none"
            opacity="0.6"
            stroke-dasharray="5,5"
          />
        </svg>
      </div>
    </div>
    
    <div class="model-stats">
      <div class="stat-item">
        <span class="stat-label">总编码数：</span>
        <span class="stat-value">{{ data?.totalCodes || 0 }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">主题数：</span>
        <span class="stat-value">{{ data?.themeCount || 0 }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">信度：</span>
        <span class="stat-value">{{ data?.reliability || '0.85' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CodeData {
  levels: Array<{
    name: string
    codes: Array<{
      name: string
      count: number
    }>
  }>
  connections: Array<{
    path: string
  }>
  totalCodes: number
  themeCount: number
  reliability: string
}

defineProps<{
  data?: CodeData
}>()
</script>

<style scoped>
.coding-model {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e1e4e8;
}

.model-header {
  margin-bottom: 20px;
  text-align: center;
}

.model-header h4 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2328;
}

.model-header p {
  margin: 0;
  color: #656d76;
  font-size: 14px;
}

.model-container {
  position: relative;
  min-height: 200px;
  margin-bottom: 20px;
}

.code-levels {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.code-level {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #e1e4e8;
  transition: all 0.3s ease;
}

.code-level.level-1 {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  border-color: #2196f3;
}

.code-level.level-2 {
  background: linear-gradient(135deg, #f3e5f5, #e1bee7);
  border-color: #9c27b0;
}

.code-level.level-3 {
  background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
  border-color: #4caf50;
}

.level-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2328;
  margin-bottom: 8px;
}

.level-codes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.code-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e1e4e8;
  font-size: 12px;
  transition: all 0.3s ease;
  animation: slideInLeft 0.6s ease forwards;
  animation-delay: var(--delay, 0s);
  opacity: 0;
}

.code-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.code-name {
  color: #1f2328;
  font-weight: 500;
}

.code-count {
  background: #4b9e5f;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
}

.model-connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.connection-svg {
  width: 100%;
  height: 100%;
}

.model-stats {
  display: flex;
  justify-content: space-around;
  padding: 16px;
  background: #f6f8fa;
  border-radius: 8px;
  border: 1px solid #e1e4e8;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #656d76;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #4b9e5f;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
