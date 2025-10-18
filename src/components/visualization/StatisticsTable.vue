<template>
  <div class="statistics-table">
    <div class="table-header">
      <h4>统计分析结果</h4>
      <p>量化研究数据统计与假设检验</p>
    </div>
    
    <div class="table-container">
      <div class="table-wrapper">
        <table class="stats-table">
          <thead>
            <tr>
              <th>变量</th>
              <th>均值</th>
              <th>标准差</th>
              <th>t值</th>
              <th>p值</th>
              <th>显著性</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in data?.rows || []"
              :key="index"
              class="table-row"
              :style="{ '--delay': index * 0.1 + 's' }"
            >
              <td class="variable-name">{{ row.variable }}</td>
              <td class="numeric-value">{{ row.mean }}</td>
              <td class="numeric-value">{{ row.std }}</td>
              <td class="numeric-value">{{ row.tValue }}</td>
              <td class="numeric-value">{{ row.pValue }}</td>
              <td class="significance" :class="getSignificanceClass(row.pValue)">
                {{ getSignificanceText(row.pValue) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="table-summary">
      <div class="summary-item">
        <span class="summary-label">样本量：</span>
        <span class="summary-value">{{ data?.sampleSize || 'N/A' }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">α水平：</span>
        <span class="summary-value">{{ data?.alphaLevel || '0.05' }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">效应量：</span>
        <span class="summary-value">{{ data?.effectSize || 'N/A' }}</span>
      </div>
    </div>
    
    <div class="chart-area">
      <div class="chart-placeholder">
        <div class="chart-icon">
          <SvgIcon icon="ri:bar-chart-line" :width="32" :height="32" />
        </div>
        <p>统计图表将在此处显示</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SvgIcon } from '@/components/common'

interface TableData {
  rows: Array<{
    variable: string
    mean: string
    std: string
    tValue: string
    pValue: string
  }>
  sampleSize: string
  alphaLevel: string
  effectSize: string
}

const props = defineProps<{
  data?: TableData
}>()

function getSignificanceClass(pValue: string): string {
  const p = parseFloat(pValue)
  if (p < 0.001) return 'highly-significant'
  if (p < 0.01) return 'very-significant'
  if (p < 0.05) return 'significant'
  return 'not-significant'
}

function getSignificanceText(pValue: string): string {
  const p = parseFloat(pValue)
  if (p < 0.001) return '***'
  if (p < 0.01) return '**'
  if (p < 0.05) return '*'
  return 'ns'
}
</script>

<style scoped>
.statistics-table {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e1e4e8;
}

.table-header {
  margin-bottom: 20px;
  text-align: center;
}

.table-header h4 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2328;
}

.table-header p {
  margin: 0;
  color: #656d76;
  font-size: 14px;
}

.table-container {
  margin-bottom: 20px;
  overflow-x: auto;
}

.table-wrapper {
  min-width: 100%;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.stats-table th {
  background: #f6f8fa;
  color: #1f2328;
  font-weight: 600;
  padding: 12px 16px;
  text-align: left;
  border-bottom: 2px solid #e1e4e8;
}

.stats-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e1e4e8;
  transition: all 0.3s ease;
}

.table-row {
  animation: slideInUp 0.6s ease forwards;
  animation-delay: var(--delay, 0s);
  opacity: 0;
}

.table-row:hover {
  background: #f8f9fa;
}

.variable-name {
  font-weight: 500;
  color: #1f2328;
}

.numeric-value {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: #495057;
  text-align: right;
}

.significance {
  text-align: center;
  font-weight: 600;
  font-size: 16px;
}

.highly-significant {
  color: #dc3545;
}

.very-significant {
  color: #fd7e14;
}

.significant {
  color: #ffc107;
}

.not-significant {
  color: #6c757d;
}

.table-summary {
  display: flex;
  justify-content: space-around;
  padding: 16px;
  background: #f6f8fa;
  border-radius: 8px;
  border: 1px solid #e1e4e8;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.summary-label {
  font-size: 12px;
  color: #656d76;
}

.summary-value {
  font-size: 16px;
  font-weight: 600;
  color: #4b9e5f;
}

.chart-area {
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #6c757d;
}

.chart-icon {
  opacity: 0.5;
}

.chart-placeholder p {
  margin: 0;
  font-size: 14px;
}

@keyframes slideInUp {
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
