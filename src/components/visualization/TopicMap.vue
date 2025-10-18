<template>
  <div class="topic-map">
    <div class="map-header">
      <h4>主题图谱</h4>
      <p>基于文献分析生成的主题关系网络</p>
    </div>
    
    <div class="map-container">
      <div class="central-topic">
        <div class="topic-node main-topic">
          <span>{{ data?.mainTopic || '研究主题' }}</span>
        </div>
      </div>
      
      <div class="subtopics">
        <div
          v-for="(topic, index) in data?.subtopics || []"
          :key="index"
          class="topic-node subtopic"
          :style="{ '--delay': index * 0.2 + 's' }"
        >
          <span>{{ topic.name }}</span>
          <div class="topic-weight">{{ topic.weight }}%</div>
        </div>
      </div>
      
      <div class="connections">
        <svg class="connection-lines" viewBox="0 0 300 200">
          <line
            v-for="(connection, index) in data?.connections || []"
            :key="index"
            :x1="connection.from.x"
            :y1="connection.from.y"
            :x2="connection.to.x"
            :y2="connection.to.y"
            stroke="#4b9e5f"
            stroke-width="2"
            opacity="0.6"
          />
        </svg>
      </div>
    </div>
    
    <div class="map-legend">
      <div class="legend-item">
        <div class="legend-color main"></div>
        <span>主要主题</span>
      </div>
      <div class="legend-item">
        <div class="legend-color sub"></div>
        <span>子主题</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TopicData {
  mainTopic: string
  subtopics: Array<{
    name: string
    weight: number
  }>
  connections: Array<{
    from: { x: number; y: number }
    to: { x: number; y: number }
  }>
}

defineProps<{
  data?: TopicData
}>()
</script>

<style scoped>
.topic-map {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e1e4e8;
}

.map-header {
  margin-bottom: 20px;
  text-align: center;
}

.map-header h4 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2328;
}

.map-header p {
  margin: 0;
  color: #656d76;
  font-size: 14px;
}

.map-container {
  position: relative;
  height: 200px;
  margin-bottom: 20px;
}

.central-topic {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.topic-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: var(--delay, 0s);
  opacity: 0;
}

.main-topic {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4b9e5f, #28a745);
  color: white;
  box-shadow: 0 4px 12px rgba(75, 158, 95, 0.3);
}

.subtopic {
  position: absolute;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  color: #495057;
  border: 2px solid #4b9e5f;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.subtopic:nth-child(1) {
  top: 20px;
  left: 50px;
}

.subtopic:nth-child(2) {
  top: 20px;
  right: 50px;
}

.subtopic:nth-child(3) {
  bottom: 20px;
  left: 50px;
}

.subtopic:nth-child(4) {
  bottom: 20px;
  right: 50px;
}

.topic-weight {
  font-size: 10px;
  margin-top: 2px;
  opacity: 0.8;
}

.connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.connection-lines {
  width: 100%;
  height: 100%;
}

.map-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #656d76;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-color.main {
  background: linear-gradient(135deg, #4b9e5f, #28a745);
}

.legend-color.sub {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border: 2px solid #4b9e5f;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
