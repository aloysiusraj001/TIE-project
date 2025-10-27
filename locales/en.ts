export const en = {
  // General
  appName: 'frontlineboost',
  ok: 'OK',
  cancel: 'Cancel',

  // Language Names
  language: 'Language',
  english: 'English',
  dutch: 'Nederlands',
  arabic: 'العربية',
  chinese: '中文 (简体)',

  // Login & Auth
  signIn: 'Sign In',
  signUp: 'Sign Up',
  signOut: 'Sign Out',
  emailAddress: 'Email Address',
  password: 'Password',
  createAccountPrompt: 'Create an account to start your training.',
  signInPrompt: 'Sign in to continue your training.',
  creatingAccount: 'Creating Account...',
  signingIn: 'Signing In...',
  alreadyHaveAccount: 'Already have an account? Sign In',
  dontHaveAccount: "Don't have an account? Sign Up",

  // Auth Errors
  'error.auth/invalid-email': 'Please enter a valid email address.',
  'error.auth/user-not-found': 'Invalid email or password.',
  'error.auth/wrong-password': 'Invalid email or password.',
  'error.auth/invalid-credential': 'Invalid email or password.',
  'error.auth/email-already-in-use': 'An account with this email already exists.',
  'error.auth/weak-password': 'Password should be at least 6 characters long.',
  'error.unexpected': 'An unexpected error occurred. Please try again.',
  
  // Header & Navigation
  dashboard: 'Dashboard',
  newTraining: 'New Training',

  // Dashboard
  trainingDashboard: 'Training Dashboard',
  newMentoredTraining: 'New Mentored Training',
  overallPerformanceSummary: 'Overall Performance Summary',
  sessionHistory: 'Session History',
  viewReport: 'View Report',
  noSessions: 'No sessions yet.',
  noSessionsPrompt: 'Click "New Mentored Training" to start your first practice session!',
  
  // Initial Assessment Card
  welcome: 'Welcome to Frontline Boost!',
  assessmentIntro: "To get started, you'll go through a one-time initial assessment. This helps us establish a baseline of your skills. You will handle an \"Overbooked Room\" scenario. Good luck!",
  startInitialAssessment: 'Start Initial Assessment',

  // Training View
  chooseScenario: 'Choose a Mentored Training Scenario',
  backToDashboard: 'Back to Dashboard',
  changeScenario: 'Change Scenario',
  speakingWith: 'You are speaking with: {name}',
  startPrompt: 'Click the microphone to start the {mode} with {name}.',
  assessment: 'assessment',
  conversation: 'conversation',
  recording: 'Recording... (Click to stop)',
  tapToSpeak: 'Tap to speak',
  finishAndGetReport: 'Finish & Get Report',
  analyzingPerformance: 'Analyzing your performance and generating the report...',

  // Live Mentor
  mentorThinking: 'Mentor is thinking...',
  whatWentWell: 'What Went Well',
  suggestion: 'Suggestion',
  initialTipPositive: 'Let\'s begin!',
  initialTip1: 'Remember to greet the guest warmly and use their name if you know it.',
  initialTip2: 'Listen carefully to the guest\'s entire issue before offering a solution.',
  initialTip3: 'Maintain a calm and professional tone, even if the guest is upset.',


  // Report View
  performanceOverview: 'Performance Overview',
  detailedFeedback: 'Detailed Feedback',
  overallScore: 'Overall Score',
  conversationTranscript: 'Conversation Transcript',
  
  // Pillar Names (Short for Charts/Dash)
  'pillar.empathy': 'Empathy',
  'pillar.communication': 'Communication',
  'pillar.ownership': 'Ownership',
  'pillar.consistency': 'Consistency',
  'pillar.personalization': 'Personalization',

  // Pillar Names (Full for Reports)
  'pillar.full.empathy': 'Proactive Empathy & Attentiveness',
  'pillar.full.communication': 'Communication Clarity & Emotional Intelligence',
  'pillar.full.ownership': 'Service Recovery & Ownership',
  'pillar.full.consistency': 'Consistency & Attention to Detail',
  'pillar.full.personalization': 'Personalization & Memory Creation',

  // Scenario: The Overbooked Room
  'scenario.angry-guest.title': 'The Overbooked Room',
  'scenario.angry-guest.description': 'A guest arrives late at night to find their confirmed reservation is for a room type that is now unavailable. They are tired and angry.',
  
  // Scenario: The Unusual Request
  'scenario.unusual-request.title': 'The Unusual Request',
  'scenario.unusual-request.description': 'A VIP guest has a series of bizarre and increasingly difficult requests, testing your ability to remain professional and resourceful.',

  // Scenario: The Rushed VIP
  'scenario.vip-checkin.title': 'The Rushed VIP',
  'scenario.vip-checkin.description': 'A high-profile CEO is checking in. They are in a hurry, on an important phone call, and expect a seamless, fast, and discreet check-in process.',

  // Scenario: The Cleanliness Complaint
  'scenario.complaint-handling.title': 'The Cleanliness Complaint',
  'scenario.complaint-handling.description': 'A family with young children complains that their room is not up to the expected cleanliness standards. They are concerned and want immediate action.',
};

export type Translations = typeof en;