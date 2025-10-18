<script setup lang='ts'>
import type { Ref } from "vue"
import { computed, onMounted, onUnmounted, ref, watch} from "vue"
import { useRoute, useRouter } from "vue-router"
import { storeToRefs } from "pinia"
import {
  NAutoComplete,
  NButton,
  NInput,
  useDialog,
  useMessage
} from "naive-ui"
import html2canvas from "html2canvas"
import { Message } from "./components"
import { useScroll } from "./hooks/useScroll"
import { useChat } from "./hooks/useChat"
import { SvgIcon } from "@/components/common"
import { useBasicLayout } from "@/hooks/useBasicLayout"
import ResearchRoadmap from "@/components/ResearchRoadmap.vue"
import {
  gptConfigStore,
  gptsUlistStore,
  homeStore,
  useChatStore,
  usePromptStore
} from "@/store"
import {
  fetchChatAPIProcess,
  gptsType,
  mlog,
} from "@/api"
import { t } from "@/locales"
import drawListVue from "../mj/drawList.vue"
import aiGPT from "../mj/aiGpt.vue"
import AiSiderInput from "../mj/aiSiderInput.vue"
import aiGptInput from "../mj/aiGptInput.vue"

let controller = new AbortController()

const openLongReply = import.meta.env.VITE_GLOB_OPEN_LONG_REPLY === "true"

const route = useRoute()
const router = useRouter()
const dialog = useDialog()
const ms = useMessage()

const chatStore = useChatStore()

const { isMobile } = useBasicLayout()
const {  updateChat, updateChatSome} = useChat()
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()

const { uuid } = route.params as { uuid: string }

const dataSources = computed(() => chatStore.getChatByUuid(+uuid))

const prompt = ref<string>("")
const loading = ref<boolean>(false)
const inputRef = ref<Ref | null>(null)

// 研究路线相关状态
const paperType = ref<string>("")
const currentStepIndex = ref<number>(0)
const showRoadmap = ref<boolean>(false)
const isGenerating = ref<boolean>(false)
const generationStep = ref<string>("")
const hasShownWelcome = ref<boolean>(false)

// 研究步骤定义
const qualitativeSteps = [
  { id: 'problem', title: '问题提出', description: '确定研究问题，明确研究目标和意义' },
  { id: 'design', title: '研究设计', description: '选择研究方法，设计研究流程' },
  { id: 'data_collection', title: '数据收集', description: '进行深度访谈、观察等数据收集活动' },
  { id: 'analysis', title: '数据分析', description: '进行主题分析、编码等质性分析' },
  { id: 'writing', title: '结果写作', description: '撰写研究结果，进行理论讨论' }
]

const quantitativeSteps = [
  { id: 'problem', title: '问题提出', description: '确定研究假设，设计研究变量' },
  { id: 'design', title: '研究设计', description: '设计实验或调查方案' },
  { id: 'data_collection', title: '数据收集', description: '进行问卷调查、实验等数据收集' },
  { id: 'analysis', title: '数据分析', description: '进行统计分析，检验假设' },
  { id: 'writing', title: '结果写作', description: '撰写统计结果，进行结果解释' }
]

const literatureSteps = [
  { id: 'problem', title: '问题提出', description: '确定研究问题，识别研究空白' },
  { id: 'concept', title: '概念梳理', description: '梳理核心概念，构建概念框架' },
  { id: 'theory', title: '理论框架', description: '构建理论框架，选择理论视角' },
  { id: 'review', title: '文献综述', description: '进行系统性文献综述' },
  { id: 'writing', title: '写作支持', description: '撰写文献综述，构建理论论述' }
]

// 当前步骤计算属性
const currentSteps = computed(() => {
  switch (paperType.value) {
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


// 添加PromptStore
const promptStore = usePromptStore()

// 使用storeToRefs，保证store修改后，联想部分能够重新渲染
const { promptList: promptTemplate } = storeToRefs<any>(promptStore)

// 未知原因刷新页面，loading 状态不会重置，手动重置
dataSources.value.forEach((item, index) => {
  if (item.loading) updateChatSome(+uuid, index, { loading: false })
})

function handleSubmit() {
  let message = prompt.value
  if (!message || message.trim() === "") return
  if (loading.value) return
  
  // 添加用户消息到聊天记录
  const userMessage: Chat.Chat = {
    dateTime: new Date().toLocaleString(),
    text: message,
    inversion: true,
    error: false,
    loading: false,
    conversationOptions: null,
    requestOptions: { prompt: message, options: {} }
  }
  chatStore.addChatByUuid(+uuid, userMessage)
  
  // 清空输入框
  prompt.value = ""
  
  // 启动静态生成过程
  startStaticGeneration()
}

async function onRegenerate(index: number) {
  if (loading.value) return

  controller = new AbortController()

  const { requestOptions } = dataSources.value[index]

  let message = requestOptions?.prompt ?? ""

  let options: Chat.ConversationRequest = {}

  if (requestOptions.options) options = { ...requestOptions.options }

  loading.value = true

  updateChat(+uuid, index, {
    dateTime: new Date().toLocaleString(),
    text: "",
    inversion: false,
    error: false,
    loading: true,
    conversationOptions: null,
    requestOptions: { prompt: message, options: { ...options } },
  })

  try {
    let lastText = ""
    const fetchChatAPIOnce = async () => {
      await fetchChatAPIProcess<Chat.ConversationResponse>({
        prompt: message,
        options,
        signal: controller.signal,
        onDownloadProgress: ({ event }) => {
          const xhr = event.target
          const { responseText } = xhr
          // Always process the final line
          const lastIndex = responseText.lastIndexOf(
            "\n",
            responseText.length - 2
          )
          let chunk = responseText
          if (lastIndex !== -1) chunk = responseText.substring(lastIndex)
          try {
            const data = JSON.parse(chunk)
            updateChat(+uuid, index, {
              dateTime: new Date().toLocaleString(),
              text: lastText + (data.text ?? ""),
              inversion: false,
              error: false,
              loading: true,
              conversationOptions: {
                conversationId: data.conversationId,
                parentMessageId: data.id,
              },
              requestOptions: { prompt: message, options: { ...options } },
            })

            if (
              openLongReply &&
              data.detail.choices[0].finish_reason === "length"
            ) {
              options.parentMessageId = data.id
              lastText = data.text
              message = ""
              return fetchChatAPIOnce()
            }
          } catch (error) {
            //
          }
        },
      })
      updateChatSome(+uuid, index, { loading: false })
    }
    await fetchChatAPIOnce()
  } catch (error: any) {
    if (error.message === "canceled") {
      updateChatSome(+uuid, index, {
        loading: false,
      })
      return
    }

    const errorMessage = error?.message ?? t("common.wrong")

    updateChat(+uuid, index, {
      dateTime: new Date().toLocaleString(),
      text: errorMessage,
      inversion: false,
      error: true,
      loading: false,
      conversationOptions: null,
      requestOptions: { prompt: message, options: { ...options } },
    })
  } finally {
    loading.value = false
  }
}

function handleExport() {
  if (loading.value) return

  const d = dialog.warning({
    title: t("chat.exportImage"),
    content: t("chat.exportImageConfirm"),
    positiveText: t("common.yes"),
    negativeText: t("common.no"),
    onPositiveClick: async () => {
      try {
        d.loading = true
        const ele = document.getElementById("image-wrapper")
        const canvas = await html2canvas(ele as HTMLDivElement, {
          useCORS: true,
        })
        const imgUrl = canvas.toDataURL("image/png")
        const tempLink = document.createElement("a")
        tempLink.style.display = "none"
        tempLink.href = imgUrl
        tempLink.setAttribute("download", "chat-shot.png")
        if (typeof tempLink.download === "undefined")
          tempLink.setAttribute("target", "_blank")

        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(imgUrl)
        d.loading = false
        ms.success(t("chat.exportSuccess"))
        Promise.resolve()
      } catch (error: any) {
        ms.error(t("chat.exportFailed"))
      } finally {
        d.loading = false
      }
    },
  })
}

function handleDelete(index: number) {
  if (loading.value) return

  dialog.warning({
    title: t("chat.deleteMessage"),
    content: t("chat.deleteMessageConfirm"),
    positiveText: t("common.yes"),
    negativeText: t("common.no"),
    onPositiveClick: () => {
      chatStore.deleteChatByUuid(+uuid, index)
    },
  })
}

function handleClear() {
  if (loading.value) return

  dialog.warning({
    title: t("chat.clearChat"),
    content: t("chat.clearChatConfirm"),
    positiveText: t("common.yes"),
    negativeText: t("common.no"),
    onPositiveClick: () => {
      chatStore.clearChatByUuid(+uuid)
    },
  })
}

function handleEnter(event: KeyboardEvent) {
  if (!isMobile.value) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  } else {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault()
      handleSubmit()
    }
  }
}

function handleStop() {
  if (loading.value) {
    homeStore.setMyData({ act: "abort" })
    controller.abort()
    loading.value = false
  }
}

// 显示欢迎消息
function showWelcomeMessage() {
  hasShownWelcome.value = true
  
  const welcomeMessage = `欢迎使用教育学术写作智能体！您选择了文献研究类型。

让我来引导您完成整个研究过程。首先，请告诉我您想要研究什么课题？您可以描述：
- 研究主题或问题
- 感兴趣的教育现象
- 想要探索的具体领域

请详细描述您的研究想法，我会根据您的研究类型为您提供专业的指导。`
  
  addAIMessage(welcomeMessage)
}

// 添加AI消息
function addAIMessage(text: string) {
  const newMessage: Chat.Chat = {
    dateTime: new Date().toLocaleString(),
    text: '',
    inversion: false,
    error: false,
    loading: true,
    conversationOptions: null,
    requestOptions: { prompt: '', options: {} }
  }
  
  // 先添加空消息，然后使用打字机效果
  chatStore.addChatByUuid(+uuid, newMessage)
  const messageIndex = chatStore.getChatByUuid(+uuid).length - 1
  
  // 打字机效果
  typewriterEffect(text, messageIndex)
}

// 打字机效果
function typewriterEffect(text: string, messageIndex: number) {
  let currentIndex = 0
  const typingSpeed = 30 // 毫秒
  
  const typingInterval = setInterval(() => {
    if (currentIndex < text.length) {
      const currentText = text.substring(0, currentIndex + 1)
      updateChatSome(+uuid, messageIndex, { 
        text: currentText,
        loading: true
      })
      currentIndex++
      scrollToBottom()
    } else {
      // 打字完成
      updateChatSome(+uuid, messageIndex, { 
        loading: false
      })
      clearInterval(typingInterval)
    }
  }, typingSpeed)
}

// 处理研究步骤变化
function handleStepChange(stepIndex: number, step: any) {
  currentStepIndex.value = stepIndex
  
  // 根据步骤生成相应的引导内容
  generateStepGuidance(step)
}

// 生成步骤引导内容
function generateStepGuidance(step: any) {
  isGenerating.value = true
  generationStep.value = step.title
  
  const stepGuidance = {
    '问题提出': `现在让我们来${step.title}。

请详细描述：
1. 您想要研究的具体问题是什么？
2. 这个问题的研究背景是什么？
3. 您认为这个问题的研究价值在哪里？

请尽可能详细地描述您的研究问题，我会根据您的研究类型为您提供专业的建议。`,
    
    '研究设计': `接下来我们进行${step.title}。

请告诉我：
1. 您计划采用什么研究方法？
2. 您的研究对象是什么？
3. 您计划如何收集数据？
4. 您的研究时间安排如何？

我会根据您的研究类型为您推荐合适的研究设计方案。`,
    
    '数据收集': `现在进入${step.title}阶段。

请描述：
1. 您已经收集了哪些数据？
2. 数据收集过程中遇到了什么困难？
3. 您需要什么帮助来改进数据收集？

我会为您提供数据收集的具体指导。`,
    
    '数据分析': `让我们进行${step.title}。

请告诉我：
1. 您收集到了什么类型的数据？
2. 您希望进行什么样的分析？
3. 您需要什么分析工具或方法？

我会根据您的研究类型为您提供专业的分析建议。`,
    
    '结果写作': `最后，让我们进行${step.title}。

请描述：
1. 您的主要研究发现是什么？
2. 您希望如何组织研究结果？
3. 您需要什么写作支持？

我会帮您完善研究结果的表达和呈现。`
  }
  
  const guidance = stepGuidance[step.title as keyof typeof stepGuidance] || `现在让我们进行${step.title}。请告诉我您在这个步骤中需要什么帮助？`
  
  // 模拟逐步生成内容
  setTimeout(() => {
    addAIMessage(guidance)
    isGenerating.value = false
    generationStep.value = ""
  }, 2000)
}

// 处理工具使用
function handleToolUse(tool: string) {
  const toolPrompts = {
    '问题生成器': '请帮我生成研究问题，我需要一个明确、可研究的问题。',
    '编码模型': '请帮我建立编码模型，我需要对质性数据进行主题分析。',
    'SPSS脚本': '请帮我生成SPSS分析脚本，我需要进行描述性统计和假设检验。',
    '文献检索': '请帮我检索相关文献，我需要找到与我的研究主题相关的高质量文献。',
    '概念分析': '请帮我进行概念分析，我需要梳理核心概念和构建概念框架。',
    '理论选择': '请帮我选择合适的理论框架，我需要为我的研究找到合适的理论视角。'
  }
  
  const toolPrompt = toolPrompts[tool as keyof typeof toolPrompts] || `请帮我使用${tool}工具。`
  prompt.value = toolPrompt
}

// 测试研究模式
function testResearchMode() {
  paperType.value = 'qualitative'
  showRoadmap.value = true
  console.log('Test research mode activated')
  showWelcomeMessage()
}

// 静态生成过程
function startStaticGeneration() {
  isGenerating.value = true
  
  // 立即开始静态生成
  startStaticAnimation()
}

// 静态动画生成
function startStaticAnimation() {
  const steps = currentSteps.value
  if (steps.length === 0) return
  
  // 预定义的回复内容
  const responses = [
    "很好！您提出了一个非常有价值的文献研究问题。让我为您分析一下这个研究主题的学术价值和创新点...",
    "基于文献研究的特点，我建议采用以下研究框架：\n\n1. 概念梳理与界定\n2. 理论框架构建\n3. 文献检索策略\n4. 综述分析框架\n\n让我详细为您展开每个部分...",
    "现在让我们进入文献检索阶段。根据您的研究主题，我推荐以下检索策略：\n\n- 关键词检索\n- 引文追踪\n- 主题词扩展\n- 数据库选择\n\n每种策略都有其独特的优势...",
    "文献分析是研究的关键环节。我将为您提供专业的分析指导：\n\n1. 文献筛选与评估\n2. 主题分类与编码\n3. 理论建构\n4. 研究空白识别\n\n让我为您展示具体的分析过程...",
    "最后，让我们来完善您的文献综述写作。基于前面的分析，我为您准备了完整的综述框架：\n\n## 研究背景\n## 概念界定\n## 理论框架\n## 文献综述\n## 研究空白\n## 研究展望\n\n每个部分都包含了详细的内容指导..."
  ]
  
  let stepIndex = 0
  let responseIndex = 0
  
  // 立即开始第一个步骤和第一个回复
  if (steps.length > 0) {
    currentStepIndex.value = stepIndex
    handleStepChange(stepIndex, steps[stepIndex])
    addAIMessage(responses[responseIndex])
    stepIndex++
    responseIndex++
  }
  
  // 继续后续步骤
  const progressInterval = setInterval(() => {
    if (stepIndex < steps.length && responseIndex < responses.length) {
      // 更新路线图步骤
      currentStepIndex.value = stepIndex
      handleStepChange(stepIndex, steps[stepIndex])
      
      // 添加AI回复
      addAIMessage(responses[responseIndex])
      
      stepIndex++
      responseIndex++
    } else {
      clearInterval(progressInterval)
      isGenerating.value = false
      
      // 所有步骤完成后，跳转到agent页面
      setTimeout(() => {
        navigateToAgentOutput()
      }, 2000)
    }
  }, 3000) // 每3秒推进一个步骤和生成一个回复
}


// 跳转到agent页面的最后一步
function navigateToAgentOutput() {
  // 跳转到agent页面，并直接显示结果输出步骤
  router.push({
    path: '/agent',
    query: { 
      step: 'output',
      paperType: paperType.value,
      autoComplete: 'true'
    }
  })
}


// 可优化部分
// 搜索选项计算，这里使用value作为索引项，所以当出现重复value时渲染异常(多项同时出现选中效果)
// 理想状态下其实应该是key作为索引项,但官方的renderOption会出现问题，所以就需要value反renderLabel实现
const searchOptions = computed(() => {
  if (prompt.value.startsWith("/")) {
    const abc = promptTemplate.value
      .filter((item: { key: string }) =>
        item.key.toLowerCase().includes(prompt.value.substring(1).toLowerCase())
      )
      .map((obj: { value: any }) => {
        return {
          label: obj.value,
          value: obj.value,
        }
      })
    mlog("搜索选项", abc)
    return abc
  } else if (prompt.value == "@") {
    const abc = gptsUlistStore.myData.slice(0, 10).map((v: gptsType) => {
      return {
        label: v.info,
        gpts: v,
        value: v.gid,
      }
    })
    return abc
  } else {
    return []
  }
})


const placeholder = computed(() => {
  if (isMobile.value) return t("chat.placeholderMobile")
  return t("chat.placeholder")
})

const buttonDisabled = computed(() => {
  return loading.value || !prompt.value || prompt.value.trim() === ""
})

const footerClass = computed(() => {
  let classes = ["p-4"]
  if (isMobile.value)
    classes = ["sticky", "left-0", "bottom-0", "right-0", "p-2", "pr-3"] //, 'overflow-hidden'
  return classes
})

onMounted(() => {
  scrollToBottom()
  if (inputRef.value && !isMobile.value) inputRef.value?.focus()
  
  // 简单设置：直接显示路线图和欢迎消息
  paperType.value = 'literature'
  showRoadmap.value = true
  
  // 只显示一次欢迎消息
  if (!hasShownWelcome.value) {
    setTimeout(() => {
      showWelcomeMessage()
    }, 500)
  }
})

onUnmounted(() => {
  if (loading.value) controller.abort()
  homeStore.setMyData({ isLoader: false })
})

const local = computed(() => homeStore.myData.local)
watch(
  () => homeStore.myData.act,
  (n) => {
    if (n == "draw") scrollToBottom()
    if (n == "scrollToBottom") scrollToBottom()
    if (n == "scrollToBottomIfAtBottom") scrollToBottomIfAtBottom()
    if (n == "gpt.submit" || n == "gpt.resubmit") {
      loading.value = true
    }
    if (n == "stopLoading") {
      loading.value = false
    }
  }
)
const st = ref({ inputme: true })

watch(
  () => loading.value,
  (n) => homeStore.setMyData({ isLoader: n })
)

const ychat = computed(() => {
  let text = prompt.value
  if (loading.value) text = ""
  else {
    scrollToBottomIfAtBottom()
  }
  return { text, dateTime: t("chat.preview") } as Chat.Chat
})

</script>

<template>


  <div class="flex flex-col w-full h-full chat-content" :class="[isMobile ? '' : 'chat-content-noMobile']">

    <main class="flex-1 overflow-hidden" :class="{ 'with-roadmap': showRoadmap }">

      <div id="scrollRef" ref="scrollRef" class="h-full overflow-hidden overflow-y-auto">

        <div id="image-wrapper" class="w-full max-w-[1100px] m-auto dark:bg-[#101014]"
          :class="[isMobile ? 'p-2' : 'p-4']">
          <template v-if="!dataSources.length">
            <div v-if="homeStore.myData.session.notify" v-html="homeStore.myData.session.notify"
              class="text-neutral-300 mt-4">

            </div>

            <div class="gpts-box" v-else>
              <br>

              <br>
              <div v-if="local !== 'draw'">
                <div class="help">
                  <div class="ai-icon">
                    <IconSvg icon="chatGPT" :width="isMobile ? '32px' : '64px'" :height="isMobile ? '32px' : '64px'">
                    </IconSvg>
                  </div>

                  <div class="text"
                    :style="{ padding: isMobile ? '22px 10px' : '22px 27px 5px', 'line-height': isMobile ? '20px' : '28px' }">
                    <p class="title">
                      {{ t('chat.helpTitle') }}
                    </p>
                    <p style="font-weight: bold" v-for="(item, index) in t('chat.helpcontent').split(';')" :key="index">{{ item }}</p>
                    
                    <!-- 调试按钮 -->
                    <div style="margin-top: 20px; text-align: center;">
                      <NButton @click="testResearchMode" type="primary" size="small">
                        测试研究模式
                      </NButton>
                      <NButton @click="showRoadmap = !showRoadmap" type="default" size="small" style="margin-left: 10px;">
                        {{ showRoadmap ? '隐藏' : '显示' }}路线图
                      </NButton>
                      <div style="margin-top: 10px; font-size: 12px; color: #666;">
                        <p>当前状态: {{ showRoadmap ? '显示路线图' : '隐藏路线图' }}</p>
                        <p>论文类型: {{ paperType || '未选择' }}</p>
                        <p>路由参数: {{ JSON.stringify(route.query) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </template>

          <template v-else>
            <div>
              <Message v-for="(item, index) of dataSources" :key="index" :date-time="item.dateTime" :text="item.text"
                :inversion="item.inversion" :error="item.error" :loading="item.loading"
                @regenerate="onRegenerate(index)" @delete="handleDelete(index)" :chat="item" :index="index" />
              <Message v-if="ychat.text && !homeStore.myData.session.isCloseMdPreview" :key="dataSources.length"
                :inversion="true" :date-time="$t('mj.typing')" :chat="ychat" :text="ychat.text"
                :index="dataSources.length" />
              
              <!-- 生成状态提示 -->
              <div v-if="isGenerating" class="generation-status">
                <div class="generation-content">
                  <div class="generation-spinner">
                    <SvgIcon icon="ri:loader-4-line" class="animate-spin" />
                  </div>
                  <div class="generation-text">
                    <p>正在生成{{ generationStep }}指导内容...</p>
                    <p class="generation-hint">请稍候，我会为您提供专业的指导</p>
                  </div>
                </div>
              </div>
              
              <div class="sticky bottom-0 left-0 flex justify-center">
                <NButton v-if="loading" type="warning" @click="handleStop">
                  <template #icon>
                    <SvgIcon icon="ri:stop-circle-line" />
                  </template>
                  {{ t('common.stopResponding') }}
                </NButton>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>

    <footer :class="footerClass" class="footer-content" v-if="local !== 'draw'">
      <!-- max-w-screen-xl -->
      <div class="w-full max-w-[1100px] m-auto">
        <aiGptInput @handle-clear="handleClear" @export="handleExport"
          v-if="['gpt-4o-mini', 'gpt-3.5-turbo-16k'].indexOf(gptConfigStore.myData.model) > -1 || st.inputme"
          v-model:modelValue="prompt" :disabled="buttonDisabled" :searchOptions="searchOptions" />
        <div class="flex items-center justify-between space-x-2" v-else>
          <NAutoComplete v-model:value="prompt" :options="searchOptions">
            <template #default="{ handleInput, handleBlur, handleFocus }">
              <NInput ref="inputRef" v-model:value="prompt" type="textarea" :placeholder="placeholder"
                :autosize="{ minRows: 1, maxRows: isMobile ? 4 : 8 }" @input="handleInput" @focus="handleFocus"
                @blur="handleBlur" @keypress="handleEnter" />
            </template>
          </NAutoComplete>
          <NButton type="primary" :disabled="buttonDisabled" @click="handleSubmit">
            <template #icon>
              <span class="dark:text-black">
                <SvgIcon icon="ri:send-plane-fill" />
              </span>
            </template>
          </NButton>

        </div>
      </div>
    </footer>
  </div>

  <drawListVue />
  <aiGPT @finished="loading = false" />
  <AiSiderInput v-if="isMobile" :button-disabled="false" />

  <!-- 研究路线侧边栏 -->
  <div v-if="!isMobile && showRoadmap" class="roadmap-sidebar">
    <div class="sidebar-header">
      <h3>研究路线图</h3>
      <div class="progress-indicator">
        <span>{{ currentStepIndex + 1 }}/{{ currentSteps.length }}</span>
      </div>
      <NButton size="tiny" @click="showRoadmap = !showRoadmap" type="text">
        <template #icon>
          <SvgIcon icon="ri:close-line" />
        </template>
      </NButton>
    </div>
    
    <div class="sidebar-content">
      <ResearchRoadmap 
        :paper-type="paperType || 'qualitative'"
        :current-step="currentStepIndex"
        @step-change="handleStepChange"
        @tool-use="handleToolUse"
        :show-actions="false"
      />
      
      <!-- 自动进度提示 -->
      <div v-if="isGenerating" class="auto-progress-tip">
        <div class="tip-content">
          <SvgIcon icon="ri:loader-4-line" class="animate-spin" />
          <span>正在自动推进研究步骤...</span>
        </div>
      </div>
    </div>
  </div>

</template>

<style>
.new-chat-header {
  width: 100%;
  padding: 0 24px;
  height: 70px;
  line-height: 70px;
  max-width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: 500;
}

/* 研究路线相关样式 */
.with-roadmap {
  margin-right: 320px;
  transition: margin-right 0.3s ease;
}

.roadmap-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  background: #ffffff;
  border-left: 1px solid #e1e4e8;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e1e4e8;
  background: #f6f8fa;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2328;
}

.progress-indicator {
  background: #4b9e5f;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.auto-progress-tip {
  margin-top: 20px;
  padding: 12px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
}

.tip-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0369a1;
  font-size: 14px;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.no-paper-type {
  text-align: center;
  color: #656d76;
  padding: 40px 20px;
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
  background: #f6f8fa;
  padding: 16px 20px;
  border-radius: 8px;
  border: 1px solid #e1e4e8;
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

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .with-roadmap {
    margin-right: 0;
  }
  
  .roadmap-sidebar {
    display: none;
  }
}

</style>