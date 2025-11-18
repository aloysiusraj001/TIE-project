import { Translations } from './en';

export const zh: Translations = {
  // General
  appName: 'frontlineboost',
  ok: '好的',
  cancel: '取消',
  edit: '编辑',
  save: '保存',

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
  fullName: '全名',
  organisation: '组织',
  createAccountPrompt: '创建账户以开始您的培训。',
  signInPrompt: '登录以继续您的培训。',
  creatingAccount: '正在创建账户...',
  signingIn: '正在登录...',
  alreadyHaveAccount: '已有账户？请登录',
  dontHaveAccount: '没有账户？请注册',
  forgotPassword: '忘记密码？',
  resetLinkSent: '密码重置链接已发送！请检查您的收件箱。',

  // Auth Errors
  'error.auth/invalid-email': '请输入有效的电子邮件地址。',
  'error.auth/user-not-found': '无效的电子邮件或密码。',
  'error.auth/wrong-password': '无效的电子邮件或密码。',
  'error.auth/invalid-credential': '无效的电子邮件或密码。',
  'error.auth/email-already-in-use': '该电子邮件已被注册。',
  'error.auth/weak-password': '密码长度至少为6个字符。',
  'error.auth/api-key-expired': 'API 密钥已过期。请续订您的 API 密钥。',
  'error.auth/missing-email': '请输入您的电子邮件以重置密码。',
  'error.auth/missing-name': '请输入您的全名。',
  'error.unexpected': '发生意外错误，请重试。',
  'error.noPersonaForAssessment': "管理员错误：初始评估情景（'{scenarioTitle}'）没有任何指定的角色。请转到管理面板并为其至少指定一个角色。",
  'error.assessmentScenarioNotFound': "严重错误：找不到初始评估情景。请联系支持人员。",
  'error.personaNotFoundForScenario': '错误：找不到分配给此情景的角色。请联系管理员。',
  'error.noPersonaAssignedToScenario': '此情景未分配角色。请转到管理面板进行分配。',

  // Header & Navigation
  dashboard: '仪表盘',
  newTraining: '新培训',
  adminPanel: '管理面板',

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
  assessmentIntro: '开始前，您需要进行一次性初步评估。这有助于我们建立您的技能基线。您将处理“神秘的迷你吧费用”情景。祝您好运！',
  startInitialAssessment: '开始初步评估',

  // Training View
  chooseScenario: '选择一个培训情景',
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

  // Admin View
  manageScenarios: '管理情景',
  managePersonas: '管理角色',
  editScenario: '编辑情景',
  editPersona: '编辑角色',
  assignedPersonas: '已分配的角色',

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
  
  // --- Scenario Categories ---
  'category.conflict.title': '冲突解决与服务补救',
  'category.conflict.description': '练习化解紧张局势、展现同理心，并将负面体验转变为正面体验。',
  'category.upselling.title': '追加销售与提升宾客体验',
  'category.upselling.description': '学习识别机会，提供真正有益于客人的额外服务或设施。',
  'category.logistical.title': '运营与后勤挑战',
  'category.logistical.description': '处理在压力下考验您对酒店系统、政策和解决问题能力的各种情况。',
  'category.safety.title': '安全、安保与医疗状况',
  'category.safety.description': '练习处理需要冷静、遵守协议和清晰沟通的敏感情况。',

  // --- Scenarios ---

  // Category: Conflict Resolution
  'scenario.billing-dispute.title': '神秘的迷你吧费用',
  'scenario.billing-dispute.description': '一位客人对自己坚称没有消费的迷你吧费用感到愤怒，并威胁要在线发布负面评论。',
  'scenario.noise-complaint.title': '隔壁的派对',
  'scenario.noise-complaint.description': '一位客人第二次打电话抱怨隔壁房间的派对声音太大。他有早班飞机，已经筋疲力尽。',
  'scenario.unclean-room.title': '不洁净的房间',
  'scenario.unclean-room.description': '一位客人刚入住房间，发现房间没有打扫干净，引起了对卫生的担忧。',

  // Category: Upselling
  'scenario.unusual-request.title': '古怪的贵宾',
  'scenario.unusual-request.description': '一位贵宾提出了一系列越来越奇怪和困难的要求，考验您保持专业和足智多谋的能力。',
  'scenario.anniversary-couple.title': '特殊场合',
  'scenario.anniversary-couple.description': '在办理入住手续时，一对夫妇提到这是他们的十周年纪念日。这是一个提升他们住宿体验的机会。',
  'scenario.first-time-visitor.title': '城市探险家',
  'scenario.first-time-visitor.description': '一位客人询问附近简单的晚餐推荐。他们似乎对这个城市有点不知所措。',

  // Category: Logistical
  'scenario.vip-checkin.title': '匆忙的贵宾',
  'scenario.vip-checkin.description': '一位备受瞩目的首席执行官正在办理入住。他很匆忙，正在打一个重要的电话，并期望一个无缝、快速和谨慎的入住过程。',
  'scenario.group-checkin.title': '旅游大巴抵达',
  'scenario.group-checkin.description': '一辆载有40名客人的旅游大巴提前一小时到达。房间还没准备好，领队压力很大，很不耐烦。',
  'scenario.faulty-key.title': '失灵的钥匙卡',
  'scenario.faulty-key.description': '一位客人因为他们的钥匙卡第三次失灵而感到沮ر。他们提着几个袋子，明显很恼火。',
  
  // Category: Safety
  'scenario.medical-emergency.title': '医疗紧急情况',
  'scenario.medical-emergency.description': '一位客人惊慌地走近，说他们的伴侣在房间里胸痛，问他们该怎么办。',
  'scenario.lost-child.title': '走失的孩子',
  'scenario.lost-child.description': '一位心急如焚的家长跑进大堂，解释说他们找不到自己6岁的儿子，最后一次见到他是在游泳池附近。',
};