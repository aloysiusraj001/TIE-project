import { Translations } from './en';

export const ar: Translations = {
  // General
  appName: 'frontlineboost',
  ok: 'موافق',
  cancel: 'إلغاء',

  // Language Names
  language: 'اللغة',
  english: 'English',
  dutch: 'Nederlands',
  arabic: 'العربية',
  chinese: '中文 (简体)',

  // Login & Auth
  signIn: 'تسجيل الدخول',
  signUp: 'إنشاء حساب',
  signOut: 'تسجيل الخروج',
  emailAddress: 'البريد الإلكتروني',
  password: 'كلمة المرور',
  createAccountPrompt: 'أنشئ حسابًا لبدء تدريبك.',
  signInPrompt: 'سجل الدخول لمتابعة تدريبك.',
  creatingAccount: 'جاري إنشاء الحساب...',
  signingIn: 'جاري تسجيل الدخول...',
  alreadyHaveAccount: 'هل لديك حساب بالفعل؟ سجل الدخول',
  dontHaveAccount: 'ليس لديك حساب؟ أنشئ حسابًا',

  // Auth Errors
  'error.auth/invalid-email': 'الرجاء إدخال عنوان بريد إلكتروني صالح.',
  'error.auth/user-not-found': 'البريد الإلكتروني أو كلمة المرور غير صالحة.',
  'error.auth/wrong-password': 'البريد الإلكتروني أو كلمة المرور غير صالحة.',
  'error.auth/invalid-credential': 'البريد الإلكتروني أو كلمة المرور غير صالحة.',
  'error.auth/email-already-in-use': 'يوجد حساب بهذا البريد الإلكتروني بالفعل.',
  'error.auth/weak-password': 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.',
  'error.unexpected': 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',

  // Header & Navigation
  dashboard: 'لوحة التحكم',
  newTraining: 'تدريب جديد',

  // Dashboard
  trainingDashboard: 'لوحة تحكم التدريب',
  newMentoredTraining: 'تدريب جديد مع مرشد',
  overallPerformanceSummary: 'ملخص الأداء العام',
  sessionHistory: 'سجل الجلسات',
  viewReport: 'عرض التقرير',
  noSessions: 'لا توجد جلسات حتى الآن.',
  noSessionsPrompt: 'انقر على "تدريب جديد مع مرشد" لبدء أول جلسة تدريبية!',

  // Initial Assessment Card
  welcome: 'أهلاً بك في Frontline Boost!',
  assessmentIntro: 'للبدء، ستخضع لتقييم أولي لمرة واحدة. يساعدنا هذا في تحديد مستوى مهاراتك. ستتعامل مع سيناريو "غرفة محجوزة بالكامل". حظًا سعيدًا!',
  startInitialAssessment: 'بدء التقييم الأولي',

  // Training View
  chooseScenario: 'اختر سيناريو تدريب مع مرشد',
  backToDashboard: 'العودة إلى لوحة التحكم',
  changeScenario: 'تغيير السيناريو',
  speakingWith: 'أنت تتحدث مع: {name}',
  startPrompt: 'انقر على الميكروفون لبدء {mode} مع {name}.',
  assessment: 'التقييم',
  conversation: 'المحادثة',
  recording: 'جاري التسجيل... (انقر للإيقاف)',
  tapToSpeak: 'انقر للتحدث',
  finishAndGetReport: 'إنهاء والحصول على التقرير',
  analyzingPerformance: 'جاري تحليل أدائك وإعداد التقرير...',

  // Live Mentor
  mentorThinking: 'المرشد يفكر...',
  whatWentWell: 'ما تم بشكل جيد',
  suggestion: 'اقتراح',
  initialTipPositive: 'لنبدأ!',
  initialTip1: 'تذكر أن تحيي الضيف بحرارة واستخدم اسمه إذا كنت تعرفه.',
  initialTip2: 'استمع بعناية إلى مشكلة الضيف بأكملها قبل تقديم حل.',
  initialTip3: 'حافظ على هدوئك ونبرة صوتك الاحترافية، حتى لو كان الضيف منزعجًا.',


  // Report View
  performanceOverview: 'نظرة عامة على الأداء',
  detailedFeedback: 'ملاحظات تفصيلية',
  overallScore: 'النتيجة الإجمالية',
  conversationTranscript: 'نص المحادثة',

  // Pillar Names (Short for Charts/Dash)
  'pillar.empathy': 'التعاطف',
  'pillar.communication': 'التواصل',
  'pillar.ownership': 'المسؤولية',
  'pillar.consistency': 'الاتساق',
  'pillar.personalization': 'التخصيص',

  // Pillar Names (Full for Reports)
  'pillar.full.empathy': 'التعاطف الاستباقي والانتباه',
  'pillar.full.communication': 'وضوح التواصل والذكاء العاطفي',
  'pillar.full.ownership': 'معالجة المشكلات والمسؤولية',
  'pillar.full.consistency': 'الاتساق والاهتمام بالتفاصيل',
  'pillar.full.personalization': 'التخصيص وخلق الذكريات',

  // Scenario: The Overbooked Room
  'scenario.angry-guest.title': 'الغرفة المحجوزة بالكامل',
  'scenario.angry-guest.description': 'يصل ضيف في وقت متأخر من الليل ليجد أن حجزه المؤكد لغرفة من نوع معين غير متوفر الآن. إنه متعب وغاضب.',
  
  // Scenario: The Unusual Request
  'scenario.unusual-request.title': 'الطلب الغريب',
  'scenario.unusual-request.description': 'لدى ضيف من كبار الشخصيات سلسلة من الطلبات الغريبة والصعبة بشكل متزايد، مما يختبر قدرتك على البقاء محترفًا وواسع الحيلة.',

  // Scenario: The Rushed VIP
  'scenario.vip-checkin.title': 'الضيف المهم المستعجل',
  'scenario.vip-checkin.description': 'مدير تنفيذي رفيع المستوى يقوم بتسجيل الدخول. إنه في عجلة من أمره، ويجري مكالمة هاتفية هامة، ويتوقع عملية تسجيل دخول سلسة وسريعة وسرية.',

  // Scenario: The Cleanliness Complaint
  'scenario.complaint-handling.title': 'شكوى النظافة',
  'scenario.complaint-handling.description': 'عائلة لديها أطفال صغار تشتكي من أن غرفتهم لا ترقى إلى معايير النظافة المتوقعة. إنهم قلقون ويريدون اتخاذ إجراء فوري.',
};