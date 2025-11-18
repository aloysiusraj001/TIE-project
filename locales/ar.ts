import { Translations } from './en';

export const ar: Translations = {
  // General
  appName: 'frontlineboost',
  ok: 'موافق',
  cancel: 'إلغاء',
  edit: 'تعديل',
  save: 'حفظ',

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
  fullName: 'الاسم الكامل',
  organisation: 'المؤسسة',
  createAccountPrompt: 'أنشئ حسابًا لبدء تدريبك.',
  signInPrompt: 'سجل الدخول لمتابعة تدريبك.',
  creatingAccount: 'جاري إنشاء الحساب...',
  signingIn: 'جاري تسجيل الدخول...',
  alreadyHaveAccount: 'هل لديك حساب بالفعل؟ سجل الدخول',
  dontHaveAccount: 'ليس لديك حساب؟ أنشئ حسابًا',
  forgotPassword: 'هل نسيت كلمة المرور؟',
  resetLinkSent: 'تم إرسال رابط إعادة تعيين كلمة المرور! يرجى التحقق من بريدك الوارد.',

  // Auth Errors
  'error.auth/invalid-email': 'الرجاء إدخال عنوان بريد إلكتروني صالح.',
  'error.auth/user-not-found': 'البريد الإلكتروني أو كلمة المرور غير صالحة.',
  'error.auth/wrong-password': 'البريد الإلكتروني أو كلمة المرور غير صالحة.',
  'error.auth/invalid-credential': 'البريد الإلكتروني أو كلمة المرور غير صالحة.',
  'error.auth/email-already-in-use': 'يوجد حساب بهذا البريد الإلكتروني بالفعل.',
  'error.auth/weak-password': 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.',
  'error.auth/api-key-expired': 'انتهت صلاحية مفتاح API. يرجى تجديد مفتاح API الخاص بك.',
  'error.auth/missing-email': 'الرجاء إدخال بريدك الإلكتروني لإعادة تعيين كلمة المرور.',
  'error.auth/missing-name': 'يرجى إدخال اسمك الكامل.',
  'error.unexpected': 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
  'error.noPersonaForAssessment': "خطأ إداري: سيناريو التقييم الأولي ('{scenarioTitle}') ليس له شخصيات معينة. يرجى الانتقال إلى لوحة الإدارة وتعيين شخصية واحدة على الأقل.",
  'error.assessmentScenarioNotFound': "خطأ فادح: تعذر العثور على سيناريو التقييم الأولي. يرجى الاتصال بالدعم.",
  'error.personaNotFoundForScenario': 'خطأ: تعذر العثور على الشخصية المخصصة لهذا السيناريو. يرجى الاتصال بمسؤول.',
  'error.noPersonaAssignedToScenario': 'لم يتم تعيين شخصية لهذا السيناريو. يرجى الانتقال إلى لوحة الإدارة لتعيين واحدة.',

  // Header & Navigation
  dashboard: 'لوحة التحكم',
  newTraining: 'تدريب جديد',
  adminPanel: 'لوحة الإدارة',

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
  assessmentIntro: 'للبدء، ستخضع لتقييم أولي لمرة واحدة. يساعدنا هذا في تحديد مستوى مهاراتك. ستتعامل مع سيناريو "فاتورة الميني بار الغامضة". حظًا سعيدًا!',
  startInitialAssessment: 'بدء التقييم الأولي',

  // Training View
  chooseScenario: 'اختر سيناريو تدريب',
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

  // Admin View
  manageScenarios: 'إدارة السيناريوهات',
  managePersonas: 'إدارة الشخصيات',
  editScenario: 'تعديل السيناريو',
  editPersona: 'تعديل الشخصية',
  assignedPersonas: 'الشخصية المعينة',

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

  // --- Scenario Categories ---
  'category.conflict.title': 'حل النزاعات وتسوية المشكلات',
  'category.conflict.description': 'تدرب على تهدئة المواقف المتوترة، وإظهار التعاطف، وتحويل تجربة سلبية إلى إيجابية.',
  'category.upselling.title': 'البيع الإضافي وتحسين تجربة الضيف',
  'category.upselling.description': 'تعلم كيفية تحديد الفرص لتقديم خدمات أو وسائل راحة إضافية تفيد الضيف حقًا.',
  'category.logistical.title': 'التحديات التشغيلية واللوجستية',
  'category.logistical.description': 'تعامل مع المواقف التي تختبر معرفتك بأنظمة الفندق وسياساته وقدراتك على حل المشكلات تحت الضغط.',
  'category.safety.title': 'السلامة والأمن والحالات الطبية',
  'category.safety.description': 'تدرب على التعامل مع المواقف الحساسة التي تتطلب هدوءًا والتزامًا بالإجراءات وتواصلًا واضحًا.',

  // --- Scenarios ---

  // Category: Conflict Resolution
  'scenario.billing-dispute.title': 'فاتورة الميني بار الغامضة',
  'scenario.billing-dispute.description': 'ضيف غاضب بشأن رسوم في الميني بار يصر على أنه لم يقم بها ويهدد بنشر مراجعة سلبية.',
  'scenario.noise-complaint.title': 'الحفلة في الغرفة المجاورة',
  'scenario.noise-complaint.description': 'ضيف يتصل للمرة الثانية للشكوى من حفلة صاخبة في الغرفة المجاورة. لديه رحلة مبكرة وهو مرهق.',
  'scenario.unclean-room.title': 'الغرفة غير النظيفة',
  'scenario.unclean-room.description': 'ضيف سجل دخوله للتو ووجد أن غرفته لم تُنظف بشكل صحيح، مما يثير مخاوف بشأن النظافة.',

  // Category: Upselling
  'scenario.unusual-request.title': 'الضيف المهم غريب الأطوار',
  'scenario.unusual-request.description': 'ضيف مهم لديه سلسلة من الطلبات الغريبة، مما يختبر احترافيتك.',
  'scenario.anniversary-couple.title': 'المناسبة الخاصة',
  'scenario.anniversary-couple.description': 'أثناء تسجيل الدخول، يذكر زوجان أنها ذكرى زواجهما العاشرة. هذه فرصة لتحسين إقامتهما.',
  'scenario.first-time-visitor.title': 'مستكشف المدينة',
  'scenario.first-time-visitor.description': 'ضيف يسأل عن توصية بسيطة لتناول العشاء في مكان قريب. يبدو مرتبكًا بعض الشيء من المدينة.',

  // Category: Logistical
  'scenario.vip-checkin.title': 'الضيف المهم المستعجل',
  'scenario.vip-checkin.description': 'مدير تنفيذي يقوم بتسجيل الدخول، وهو مستعجل وعلى الهاتف، ويتوقع عملية تسجيل دخول سلسة وسرية.',
  'scenario.group-checkin.title': 'وصول حافلة سياحية',
  'scenario.group-checkin.description': 'تصل حافلة سياحية تضم 40 ضيفًا قبل الموعد بساعة. الغرف ليست جاهزة وقائد المجموعة متوتر.',
  'scenario.faulty-key.title': 'بطاقة المفتاح المعطلة',
  'scenario.faulty-key.description': 'ضيف محبط لأن بطاقة المفتاح الخاصة به فشلت للمرة الثالثة. يحمل حقائب وهو منزعج بشكل واضح.',
  
  // Category: Safety
  'scenario.medical-emergency.title': 'حالة طبية طارئة',
  'scenario.medical-emergency.description': 'ضيف يقترب منك وهو في حالة من الذعر، قائلاً إن شريكه يعاني من آلام في الصدر في الغرفة ويسأل عما يجب عليه فعله.',
  'scenario.lost-child.title': 'الطفل المفقود',
  'scenario.lost-child.description': 'أحد الوالدين المذعورين يركض إلى الردهة، موضحًا أنه لا يستطيع العثور على ابنه البالغ من العمر 6 سنوات والذي شوهد آخر مرة بالقرب من المسبح.',
};