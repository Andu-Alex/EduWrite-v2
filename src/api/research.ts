
// Innospark模型API配置
const INNOSPARK_API_KEY = '7V1rpBFgK0DOHPh95pMP8Sxe1DXK_7c0UGJ5Fxpi_ejZiDvklCz38ev2_iLs7VxdaDslykF-DRJQhZDwOD7ZNA==';
const INNOSPARK_API_URL = 'http://120.55.167.27:9001/v1/chat/completions';

// 研究步骤类型
export interface ResearchStep {
  id: string;
  title: string;
  description: string;
  tools: string[];
}

// 研究消息类型
export interface ResearchMessage {
  content: string;
  isUser: boolean;
  time: string;
  stepId?: string;
}

// 文献检索结果
export interface LiteratureResult {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publishedDate: string;
  url: string;
  keywords: string[];
  relevanceScore: number;
}

// 可视化数据类型
export interface VisualizationData {
  title: string;
  description: string;
  type: 'topic-map' | 'coding-model' | 'statistics-table';
  data: any;
}

// Innospark API调用
export async function callInnosparkAPI(prompt: string, systemPrompt?: string): Promise<string> {
  try {
    const response = await fetch(INNOSPARK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INNOSPARK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'InnoSpark',
        messages: [
          ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`API调用失败: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Innospark API调用错误:', error);
    throw error;
  }
}

// 研究步骤AI回复
export async function getResearchStepResponse(
  stepId: string, 
  userQuestion: string, 
  researchContext: string
): Promise<string> {
  const systemPrompts = {
    'problem': '你是一位学术研究专家，专门帮助研究者提出和明确研究问题。请提供专业、具体的指导。',
    'concept': '你是一位概念分析专家，擅长帮助研究者梳理核心概念和构建概念框架。请提供清晰的概念定义和关系分析。',
    'theory': '你是一位理论框架构建专家，擅长帮助研究者选择合适的理论并构建理论框架。请提供理论选择和应用的指导。',
    'review': '你是一位文献综述专家，擅长帮助研究者进行系统性文献检索和分析。请提供文献检索策略和综述撰写指导。',
    'writing': '你是一位学术写作专家，擅长帮助研究者撰写高质量的学术论文。请提供写作结构、逻辑和语言指导。'
  };

  const systemPrompt = systemPrompts[stepId as keyof typeof systemPrompts] || 
    '你是一位学术研究助手，请提供专业的研究指导。';

  const prompt = `
研究背景：${researchContext}

当前步骤：${stepId}
用户问题：${userQuestion}

请基于研究背景和当前步骤，为用户提供专业、具体的指导建议。回答应该：
1. 直接回应用户的具体问题
2. 提供可操作的建议和步骤
3. 包含相关的理论依据或方法说明
4. 语言专业但易懂
`;

  return await callInnosparkAPI(prompt, systemPrompt);
}

// 生成研究路线图回复
export async function generateResearchResponse(
  userInput: string, 
  researchType: string,
  currentStep: number
): Promise<string> {
  const systemPrompt = `你是一位学术研究智能助手，专门帮助研究者进行${researchType}研究。请根据用户的研究想法，提供专业的研究指导和建议。`;

  const prompt = `
用户研究想法：${userInput}
研究类型：${researchType}
当前步骤：${currentStep + 1}

请为用户提供：
1. 对研究想法的专业评价
2. 具体的研究建议和下一步行动
3. 相关的研究方法和工具推荐
4. 可能遇到的挑战和解决方案

回答应该专业、具体、可操作。
`;

  return await callInnosparkAPI(prompt, systemPrompt);
}

// arXiv文献检索
export async function searchArxivLiterature(
  query: string, 
  maxResults: number = 10
): Promise<LiteratureResult[]> {
  try {
    console.log('开始文献检索，查询:', query, '最大结果数:', maxResults);
    
    const url = `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(query)}&start=0&max_results=${maxResults}&sortBy=relevance&sortOrder=descending`;
    console.log('请求URL:', url);
    
    const response = await fetch(url);
    console.log('响应状态:', response.status);
    
    if (!response.ok) {
      throw new Error(`arXiv API调用失败: ${response.status}`);
    }

    const xmlText = await response.text();
    console.log('XML响应长度:', xmlText.length);
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // 检查解析错误
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      console.error('XML解析错误:', parseError.textContent);
      throw new Error('XML解析失败');
    }
    
    const entries = xmlDoc.querySelectorAll('entry');
    console.log('找到的entry数量:', entries.length);
    
    const results: LiteratureResult[] = [];

    entries.forEach((entry, index) => {
      const id = entry.querySelector('id')?.textContent || '';
      const title = entry.querySelector('title')?.textContent || '';
      const summary = entry.querySelector('summary')?.textContent || '';
      const published = entry.querySelector('published')?.textContent || '';
      const authors = Array.from(entry.querySelectorAll('author name')).map(author => author.textContent || '');
      
      console.log(`文献 ${index + 1}:`, { id, title: title.substring(0, 50), authors: authors.length });
      
      // 提取关键词（从标题和摘要中）
      const keywords = extractKeywords(title + ' ' + summary);
      
      results.push({
        id: id.split('/').pop() || `arxiv-${index}`,
        title: title.replace(/\n/g, ' ').trim(),
        authors,
        abstract: summary.replace(/\n/g, ' ').trim(),
        publishedDate: published.split('T')[0],
        url: id,
        keywords,
        relevanceScore: Math.max(0.8 - index * 0.05, 0.3) // 简单的相关性评分
      });
    });

    console.log('文献检索完成，返回结果数量:', results.length);
    return results;
  } catch (error) {
    console.error('arXiv文献检索错误:', error);
    return [];
  }
}

// 提取关键词
function extractKeywords(text: string): string[] {
  // 简单的关键词提取逻辑
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'];
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word));
  
  // 统计词频并返回前10个
  const wordCount: { [key: string]: number } = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

// 生成可视化数据
export async function generateVisualizationData(
  researchType: string,
  researchContext: string,
  stepId: string
): Promise<VisualizationData | null> {
  try {
    let prompt = '';
    let visualizationType: 'topic-map' | 'coding-model' | 'statistics-table' = 'topic-map';

    switch (researchType) {
      case 'literature':
        if (stepId === 'theory') {
          visualizationType = 'topic-map';
          prompt = `基于研究主题"${researchContext}"，生成主题关系网络图。请分析主要概念、子主题及其相互关系，返回JSON格式的数据结构，包含mainTopic、subtopics（数组，每个包含name和weight属性）和connections（数组，定义连接关系）。`;
        }
        break;
      case 'qualitative':
        if (stepId === 'theory') {
          visualizationType = 'coding-model';
          prompt = `基于质性研究主题"${researchContext}"，生成编码模型分析。请返回JSON格式的数据结构，包含levels（编码层级）、connections（连接路径）、totalCodes、themeCount和reliability等属性。`;
        }
        break;
      case 'quantitative':
        if (stepId === 'theory') {
          visualizationType = 'statistics-table';
          prompt = `基于量化研究主题"${researchContext}"，生成统计分析结果。请返回JSON格式的数据结构，包含rows（统计变量数据）、sampleSize、alphaLevel和effectSize等属性。`;
        }
        break;
    }

    if (!prompt) return null;

    const response = await callInnosparkAPI(prompt, '你是一位数据可视化专家，请根据研究内容生成结构化的可视化数据。');
    
    try {
      const data = JSON.parse(response);
      return {
        title: researchType === 'literature' ? '主题图谱分析' : 
               researchType === 'qualitative' ? '编码模型分析' : '统计分析结果',
        description: researchType === 'literature' ? '基于文献分析生成的主题关系网络' :
                     researchType === 'qualitative' ? '质性研究主题编码分析结果' : '量化研究数据统计与假设检验',
        type: visualizationType,
        data
      };
    } catch (parseError) {
      console.error('可视化数据解析错误:', parseError);
      return null;
    }
  } catch (error) {
    console.error('生成可视化数据错误:', error);
    return null;
  }
}

// 导出功能
export async function exportResearchToWord(messages: ResearchMessage[], researchSteps: ResearchStep[]): Promise<Blob> {
  // 这里可以实现Word导出逻辑
  // 暂时返回一个简单的文本文件
  const content = messages.map(msg => 
    `${msg.isUser ? '用户' : 'AI'}: ${msg.content}\n`
  ).join('\n');
  
  return new Blob([content], { type: 'application/msword' });
}

export async function exportResearchToLaTeX(messages: ResearchMessage[], researchSteps: ResearchStep[]): Promise<Blob> {
  // LaTeX导出逻辑
  const latexContent = `\\documentclass{article}
\\begin{document}
\\title{研究记录}
\\author{AI研究助手}
\\date{\\today}
\\maketitle

${messages.map(msg => 
  `\\section{${msg.isUser ? '用户提问' : 'AI回复'}}
${msg.content.replace(/\n/g, '\\\\')}
`
).join('\n')}

\\end{document}`;
  
  return new Blob([latexContent], { type: 'application/x-latex' });
}

export async function exportCitations(literatureResults: LiteratureResult[]): Promise<Blob> {
  // 引用导出逻辑
  const citations = literatureResults.map(result => 
    `${result.authors.join(', ')} (${result.publishedDate}). ${result.title}. arXiv:${result.id}.`
  ).join('\n');
  
  return new Blob([citations], { type: 'text/plain' });
}
