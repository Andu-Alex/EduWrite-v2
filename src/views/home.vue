<template>
	<div class="home">
		<!-- 顶部导航 -->
		<nav class="topbar">
			<div class="brand" @click="goHome">EduWrite</div>
			<div class="spacer"></div>
			<button class="login-btn" @click="goLogin">登录</button>
		</nav>

		<!-- 英雄区 -->
		<header class="hero">
			<h1 class="title">教育学术写作助理</h1>
			<p class="subtitle">从研究选题、方法设计、数据/文献处理，到论文写作与润色，形成一站式平台->全流程支持教育学论文写作，从选题到成稿。</p>
			<div class="hero-actions">
				<button class="cta" @click="goUse">立即使用</button>
			</div>
		</header>

		<!-- 能力概览区 -->
		<section class="band band-light">
			<h2 class="band-title">核心能力</h2>
			<div class="grid">
				<div class="card">
					<h3>研究路线导航器</h3>
					<p>根据研究类型生成写作流程图（不同论文类型，不同的写作路线。每个路线均是可选，也可以自定义）</p>
				</div>
				<div class="card">
					<h3>研文献检索与综述助手</h3>
					<p>自动提取主题、生成综述结构</p>
				</div>
				<div class="card">
					<h3>研究方法设计助手</h3>
					<p>质性/量化/文献研究对应不同支持
                        ：质性方法研究类、量化方法研究类、文献研究。</p>
				</div>
				<div class="card">
					<h3>数据/资料处理助手</h3>
					<p>定性数据编码、定量数据统计、概念梳理</p>
				</div>
				<div class="card">
					<h3>论文写作生成器</h3>
					<p>按「IMRD结构」*或文献型结构生成段落</p>
				</div>
				<div class="card">
					<h3>学术规范助手</h3>
					<p>引用格式、智能查重（降低AGI）查重工具：paperyy；国内国外大模型</p>
				</div>
                <div class="card">
					<h3>审稿助手</h3>
					<p>模拟审稿意见、写作风格提升建议</p>
				</div>
			</div>
		</section>

		<!-- 典型场景区 -->
		<section class="band band-dark">
			<h2 class="band-title">典型场景</h2>
			<div class="grid scenarios">
				<div class="scenario">
					<h4>毕业论文</h4>
					<p>开题报告、文献综述、研究设计与写作全流程陪伴。</p>
				</div>
				<div class="scenario">
					<h4>课题申报</h4>
					<p>申报书结构与亮点提炼，预研方案与可行性论证。</p>
				</div>
				<div class="scenario">
					<h4>期刊投稿</h4>
					<p>目标期刊匹配、摘要与引言优化、格式规范检查。</p>
				</div>
				<div class="scenario">
					<h4>课程作业</h4>
					<p>阅读报告、短论文与展示材料辅助，效率与质量兼顾。</p>
				</div>
			</div>
		</section>

		<!-- 底部行动区 -->
		<section class="band band-cta">
			<div class="cta-wrap">
				<h2>开始你的学术写作之旅</h2>
				<!-- <div class="hero-actions">
					<button class="cta" @click="goUse">立即使用</button>
				</div> -->
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
function goUse() {
	router.push('/agent')
}
function goLogin() {
	router.push('/login')
}
function goHome() {
	router.push('/')
}
</script>

<style scoped>
.home {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    color: #1f2328;
}
.topbar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(31,35,40,.08);
    background: rgba(255,255,255,.8);
    backdrop-filter: blur(6px);
}
.brand { font-weight: 800; cursor: pointer; color: #1f2328 }
.spacer { flex: 1 }
.login-btn {
    appearance: none;
    border: 1px solid #1f883d;
    background: #2ea043;
    color: #ffffff;
    padding: 8px 14px;
    border-radius: 10px;
    font-size: 14px;
    cursor: pointer;
}
.hero {
    text-align: center;
    padding: 72px 24px 40px;
    background: linear-gradient(180deg, #ffffff 0%, #f6f8fa 100%);
}
.title {
	font-size: 40px;
	font-weight: 800;
	margin: 0 0 12px;
}
.subtitle {
    font-size: 16px;
    opacity: 0.8;
    margin: 0 0 22px;
}
.hero-actions { display: inline-flex; gap: 12px }
.cta {
    appearance: none;
    border: 1px solid #1f883d;
    background: #2ea043;
    color: #ffffff;
    padding: 12px 24px;
    border-radius: 10px;
    font-size: 16px;
    cursor: pointer;
    transition: transform .08s ease, opacity .2s ease, box-shadow .2s ease;
}
.cta:hover { opacity: .96; box-shadow: 0 6px 16px rgba(46,160,67,.25) }
.cta:active { transform: scale(.98) }
.ghost {
	appearance: none;
	border: 1px solid rgba(255,255,255,.25);
	background: transparent;
	color: #fff;
	padding: 12px 24px;
	border-radius: 10px;
	font-size: 16px;
	cursor: pointer;
}
.band {
    padding: 40px 24px;
}
.band-light { background: #ffffff }
.band-dark  { background: #f6f8fa }
.band-title {
	max-width: 1000px;
	margin: 0 auto 16px;
	font-size: 20px;
	font-weight: 700;
}
.grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 16px;
	max-width: 1000px;
	margin: 0 auto;
}
.card {
    background: #ffffff;
    border: 1px solid rgba(31,35,40,.08);
    border-radius: 12px;
    padding: 18px;
}
.card h3 { margin: 0 0 8px; font-size: 18px; color: #1f2328 }
.card p { margin: 0; line-height: 1.6; color: rgba(31,35,40,.8) }

.scenarios .scenario {
    background: #ffffff;
    border: 1px dashed rgba(31,35,40,.15);
    border-radius: 12px;
    padding: 16px;
}
.scenarios .scenario h4 { margin: 0 0 6px; font-size: 16px; color: #1f2328 }
.scenarios .scenario p  { margin: 0; opacity: .8; color: #1f2328 }

.band-cta { text-align: center; border-top: 1px solid rgba(31,35,40,.08) }
.cta-wrap { max-width: 1000px; margin: 0 auto }
.cta-wrap h2 { margin: 0 0 12px }
</style>


