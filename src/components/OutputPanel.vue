<template>
  <div class="output-panel">
    <div class="panel-header">
      <h4>输出结果</h4>
      <div class="panel-actions">
        <NButton size="small" @click="clearOutput">
          <template #icon>
            <SvgIcon icon="ri:delete-bin-line" />
          </template>
          清空
        </NButton>
      </div>
    </div>
    
    <div class="output-tabs">
      <div 
        v-for="tab in outputTabs" 
        :key="tab.id"
        class="tab-item"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <SvgIcon :icon="tab.icon" />
        <span>{{ tab.name }}</span>
      </div>
    </div>
    
    <div class="output-content">
      <!-- 文本输出 -->
      <div v-if="activeTab === 'text'" class="text-output">
        <div class="format-selector">
          <NSelect 
            v-model:value="selectedFormat" 
            :options="formatOptions"
            placeholder="选择输出格式"
            @update:value="handleFormatChange"
          />
          <NButton type="primary" @click="exportText">
            <template #icon>
              <SvgIcon icon="ri:download-line" />
            </template>
            导出
          </NButton>
        </div>
        
        <div class="text-preview">
          <div v-if="selectedFormat === 'word'" class="word-preview">
            <div class="document-header">
              <h1>{{ documentTitle }}</h1>
              <div class="document-meta">
                <span>作者：{{ authorName }}</span>
                <span>日期：{{ currentDate }}</span>
              </div>
            </div>
            <div class="document-content" v-html="formattedText"></div>
          </div>
          <div v-else-if="selectedFormat === 'latex'" class="latex-preview">
            <pre class="latex-code">{{ latexText }}</pre>
          </div>
          <div v-else class="plain-text">
            <pre>{{ plainText }}</pre>
          </div>
        </div>
      </div>
      
      <!-- 表格输出 -->
      <div v-else-if="activeTab === 'table'" class="table-output">
        <div class="table-actions">
          <NButton @click="exportTable('csv')">
            <template #icon>
              <SvgIcon icon="ri:file-excel-line" />
            </template>
            导出CSV
          </NButton>
          <NButton @click="exportTable('excel')">
            <template #icon>
              <SvgIcon icon="ri:file-excel-2-line" />
            </template>
            导出Excel
          </NButton>
        </div>
        
        <div class="table-container">
          <table class="output-table">
            <thead>
              <tr>
                <th v-for="header in tableData.headers" :key="header">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in tableData.rows" :key="index">
                <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                  {{ cell }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- 引用输出 -->
      <div v-else-if="activeTab === 'citation'" class="citation-output">
        <div class="citation-format-selector">
          <NSelect 
            v-model:value="selectedCitationFormat" 
            :options="citationFormatOptions"
            placeholder="选择引用格式"
          />
          <NButton type="primary" @click="exportCitations">
            <template #icon>
              <SvgIcon icon="ri:download-line" />
            </template>
            导出引用
          </NButton>
        </div>
        
        <div class="citation-list">
          <div 
            v-for="(citation, index) in citations" 
            :key="index"
            class="citation-item"
          >
            <div class="citation-content">{{ citation.content }}</div>
            <div class="citation-actions">
              <NButton size="tiny" @click="copyCitation(citation.content)">
                <template #icon>
                  <SvgIcon icon="ri:file-copy-line" />
                </template>
                复制
              </NButton>
              <NButton size="tiny" @click="editCitation(index)">
                <template #icon>
                  <SvgIcon icon="ri:edit-line" />
                </template>
                编辑
              </NButton>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 图表输出 -->
      <div v-else-if="activeTab === 'chart'" class="chart-output">
        <div class="chart-actions">
          <NButton @click="exportChart('png')">
            <template #icon>
              <SvgIcon icon="ri:image-line" />
            </template>
            导出PNG
          </NButton>
          <NButton @click="exportChart('svg')">
            <template #icon>
              <SvgIcon icon="ri:file-line" />
            </template>
            导出SVG
          </NButton>
        </div>
        
        <div class="chart-container">
          <div class="chart-placeholder">
            <SvgIcon icon="ri:bar-chart-line" :width="48" :height="48" />
            <p>图表将在这里显示</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NButton, NSelect } from 'naive-ui'
import { SvgIcon } from '@/components/common'

interface Citation {
  content: string
  type: string
  authors: string[]
  year: number
  title: string
}

const props = defineProps<{
  text?: string
  tableData?: any
  citations?: Citation[]
  charts?: any[]
}>()

const emit = defineEmits<{
  export: [type: string, data: any]
  clear: []
}>()

const activeTab = ref('text')
const selectedFormat = ref('word')
const selectedCitationFormat = ref('apa')

const outputTabs = [
  { id: 'text', name: '文本', icon: 'ri:file-text-line' },
  { id: 'table', name: '表格', icon: 'ri:table-line' },
  { id: 'citation', name: '引用', icon: 'ri:bookmark-line' },
  { id: 'chart', name: '图表', icon: 'ri:bar-chart-line' }
]

const formatOptions = [
  { label: 'Word文档', value: 'word' },
  { label: 'LaTeX', value: 'latex' },
  { label: '纯文本', value: 'plain' }
]

const citationFormatOptions = [
  { label: 'APA格式', value: 'apa' },
  { label: 'MLA格式', value: 'mla' },
  { label: 'Chicago格式', value: 'chicago' },
  { label: 'EndNote格式', value: 'endnote' },
  { label: 'BibTeX格式', value: 'bibtex' }
]

const documentTitle = ref('研究结果报告')
const authorName = ref('研究者')
const currentDate = computed(() => new Date().toLocaleDateString())

const formattedText = computed(() => {
  if (!props.text) return ''
  return props.text.replace(/\n/g, '<br>')
})

const latexText = computed(() => {
  if (!props.text) return ''
  return `\\documentclass{article}
\\begin{document}
\\title{研究结果报告}
\\author{研究者}
\\date{${currentDate.value}}
\\maketitle

${props.text.replace(/\n/g, '\n\n')}

\\end{document}`
})

const plainText = computed(() => {
  return props.text || ''
})

const tableData = computed(() => {
  return props.tableData || {
    headers: ['变量', '均值', '标准差', '显著性'],
    rows: [
      ['学习动机', '4.25', '0.68', 'p < 0.001'],
      ['学习效果', '3.89', '0.72', 'p < 0.001'],
      ['技术接受度', '4.12', '0.59', 'p < 0.01']
    ]
  }
})

const citations = computed(() => {
  return props.citations || [
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
})

function handleFormatChange(format: string) {
  selectedFormat.value = format
}

function exportText() {
  let content = ''
  let filename = ''
  let mimeType = ''
  
  switch (selectedFormat.value) {
    case 'word':
      content = formattedText.value
      filename = 'research_report.html'
      mimeType = 'text/html'
      break
    case 'latex':
      content = latexText.value
      filename = 'research_report.tex'
      mimeType = 'text/plain'
      break
    case 'plain':
      content = plainText.value
      filename = 'research_report.txt'
      mimeType = 'text/plain'
      break
  }
  
  downloadFile(content, filename, mimeType)
}

function exportTable(format: string) {
  let content = ''
  let filename = ''
  let mimeType = ''
  
  if (format === 'csv') {
    content = generateCSV(tableData.value)
    filename = 'research_data.csv'
    mimeType = 'text/csv'
  } else if (format === 'excel') {
    // 这里可以集成Excel导出库
    content = generateCSV(tableData.value)
    filename = 'research_data.csv'
    mimeType = 'text/csv'
  }
  
  downloadFile(content, filename, mimeType)
}

function exportCitations() {
  let content = ''
  let filename = ''
  
  switch (selectedCitationFormat.value) {
    case 'apa':
      content = generateAPACitations(citations.value)
      filename = 'citations_apa.txt'
      break
    case 'mla':
      content = generateMLACitations(citations.value)
      filename = 'citations_mla.txt'
      break
    case 'bibtex':
      content = generateBibTeXCitations(citations.value)
      filename = 'citations.bib'
      break
    default:
      content = generateAPACitations(citations.value)
      filename = 'citations.txt'
  }
  
  downloadFile(content, filename, 'text/plain')
}

function exportChart(format: string) {
  // 这里可以集成图表导出功能
  console.log(`导出图表为 ${format} 格式`)
}

function generateCSV(data: any) {
  const headers = data.headers.join(',')
  const rows = data.rows.map((row: any[]) => row.join(',')).join('\n')
  return `${headers}\n${rows}`
}

function generateAPACitations(citations: Citation[]) {
  return citations.map(citation => citation.content).join('\n\n')
}

function generateMLACitations(citations: Citation[]) {
  return citations.map(citation => {
    const author = citation.authors[0]
    const title = citation.title
    const year = citation.year
    return `${author}. "${title}." Journal Name ${year}.`
  }).join('\n\n')
}

function generateBibTeXCitations(citations: Citation[]) {
  return citations.map((citation, index) => {
    const author = citation.authors[0].replace(', ', ' and ')
    const title = citation.title
    const year = citation.year
    return `@article{ref${index + 1},\n  author = {${author}},\n  title = {${title}},\n  year = {${year}}\n}`
  }).join('\n\n')
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function copyCitation(content: string) {
  navigator.clipboard.writeText(content)
}

function editCitation(index: number) {
  // 这里可以实现编辑引用的功能
  console.log(`编辑引用 ${index}`)
}

function clearOutput() {
  emit('clear')
}
</script>

<style scoped>
.output-panel {
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

.output-tabs {
  display: flex;
  border-bottom: 1px solid #e1e4e8;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  color: #656d76;
}

.tab-item:hover {
  background: #f6f8fa;
  color: #1f2328;
}

.tab-item.active {
  color: #4b9e5f;
  border-bottom-color: #4b9e5f;
  background: #f6f8fa;
}

.output-content {
  padding: 20px;
  min-height: 300px;
}

.format-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.text-preview {
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 20px;
  background: #f8f9fa;
  max-height: 400px;
  overflow-y: auto;
}

.word-preview {
  background: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.document-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e1e4e8;
}

.document-header h1 {
  margin: 0 0 10px;
  color: #1f2328;
}

.document-meta {
  display: flex;
  justify-content: center;
  gap: 20px;
  color: #656d76;
  font-size: 14px;
}

.latex-preview {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  line-height: 1.5;
  overflow-x: auto;
}

.plain-text {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.table-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.table-container {
  overflow-x: auto;
}

.output-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.output-table th,
.output-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #e1e4e8;
}

.output-table th {
  background: #f6f8fa;
  font-weight: 600;
  color: #1f2328;
}

.citation-format-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.citation-list {
  max-height: 400px;
  overflow-y: auto;
}

.citation-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #f8f9fa;
}

.citation-content {
  flex: 1;
  line-height: 1.6;
  color: #1f2328;
}

.citation-actions {
  display: flex;
  gap: 8px;
  margin-left: 12px;
}

.chart-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.chart-container {
  height: 300px;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.chart-placeholder {
  text-align: center;
  color: #656d76;
}

.chart-placeholder p {
  margin: 8px 0 0;
  font-size: 14px;
}
</style>
