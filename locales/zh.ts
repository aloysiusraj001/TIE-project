import { Translations } from './en';

export const zh: Translations = {
  // General
  appName: 'frontlineboost',
  ok: '好的',
  cancel: '取消',

  // Language Names
  language: '语言',
  english: 'English',
  dutch: 'Nederlands',
  arabic: 'العربية',
  chinese: '中文 (简体)',

  // Login & Auth
  signIn: '登录',
  signUp: '注册',
  signOut: '登出',
  emailAddress: '电子邮件地址',
  password: '密码',
  createAccountPrompt: '创建账户以开始您的培训。',
  signInPrompt: '登录以继续您的培训。',
  creatingAccount: '正在创建账户...',
  signingIn: '正在登录...',
  alreadyHaveAccount: '已有账户？请登录',
  dontHaveAccount: '没有账户？请注册',

  // Auth Errors
  'error.auth/invalid-email': '请输入有效的电子邮件地址。',
  'error.auth/user-not-found': '无效的电子邮件或密码。',
  'error.auth/wrong-password': '无效的电子邮件或密码。',
  'error.auth/invalid-credential': '无效的电子邮件或密码。',
  'error.auth/email-already-in-use': '该电子邮件已被注册。',
  'error.auth/weak-password': '密码长度至少为6个字符。',
  'error.unexpected': '发生意外错误，请重试。',

  // Header & Navigation
  dashboard: '仪表盘',
  newTraining: '新培训',

  // Dashboard
  trainingDashboard: '培训仪表盘',
  newMentoredTraining: '新指导培训',
  overallPerformanceSummary: '综合表现摘要',
  sessionHistory: '会话历史',
  viewReport: '查看报告',
  noSessions: '暂无会话。',
  noSessionsPrompt: '点击“新指导培训”开始您的第一次练习会话！',

  // Initial Assessment Card
  welcome: '欢迎来到 Frontline Boost！',
  assessmentIntro: '开始前，您需要进行一次性初步评估。这有助于我们建立您的技能基线。您将处理一个“房间超订”的情景。祝您好运！',
  startInitialAssessment: '开始初步评估',

  // Training View
  chooseScenario: '选择一个指导培训情景',
  backToDashboard: '返回仪表盘',
  changeScenario: '更换情景',
  speakingWith: '您正在与 {name} 对话',
  startPrompt: '点击麦克风开始与 {name} 的{mode}。',
  assessment: '评估',
  conversation: '对话',
  recording: '正在录音... (点击停止)',
  tapToSpeak: '点击说话',
  finishAndGetReport: '完成并获取报告',
  analyzingPerformance: '正在分析您的表现并生成报告...',

  // Live Mentor
  mentorThinking: '导师正在思考...',
  whatWentWell: '做得好的地方',
  suggestion: '建议',
  initialTipPositive: '我们开始吧！',
  initialTip1: '记得热情地问候客人，如果知道的话，请使用他们的名字。',
  initialTip2: '在提供解决方案之前，仔细倾听客人的整个问题。',
  initialTip3: '即使客人生气，也要保持冷静和专业的语气。',

  // Report View
  performanceOverview: '表现概览',
  detailedFeedback: '详细反馈',
  overallScore: '总分',
  conversationTranscript: '对话记录',

  // Pillar Names (Short for Charts/Dash)
  'pillar.empathy': '同理心',
  'pillar.communication': '沟通',
  'pillar.ownership': '责任感',
  'pillar.consistency': '一致性',
  'pillar.personalization': '个性化',

  // Pillar Names (Full for Reports)
  'pillar.full.empathy': '积极的同理心和专注度',
  'pillar.full.communication': '沟通清晰度和情商',
  'pillar.full.ownership': '服务补救和责任感',
  'pillar.full.consistency': '一致性和注重细节',
  'pillar.full.personalization': '个性化和创造记忆',
  
  // Scenario: The Overbooked Room
  'scenario.angry-guest.title': '房间超订',
  'scenario.angry-guest.description': '一位客人在深夜抵达，发现他们已确认预订的房型现已无法提供。他们既疲惫又愤怒。',
  
  // Scenario: The Unusual Request
  'scenario.unusual-request.title': '不寻常的请求',
  'scenario.unusual-request.description': '一位VIP客人提出了一系列奇怪且越来越困难的请求，考验您保持专业和足智多谋的能力。',

  // Scenario: The Rushed VIP
  'scenario.vip-checkin.title': '匆忙的VIP',
  'scenario.vip-checkin.description': '一位备受瞩目的CEO正在办理入住。他们很匆忙，正在打一个重要的电话，并期望一个无缝、快速和谨慎的入住过程。',

  // Scenario: The Cleanliness Complaint
  'scenario.complaint-handling.title': '清洁投诉',
  'scenario.complaint-handling.description': '一个有小孩的家庭抱怨他们的房间没有达到预期的清洁标准。他们很担心并希望立即采取行动。',
};