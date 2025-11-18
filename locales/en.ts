export const en = {
  // General
  appName: 'frontlineboost',
  ok: 'OK',
  cancel: 'Cancel',
  edit: 'Edit',
  save: 'Save',

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
  fullName: 'Full Name',
  organisation: 'Organisation',
  createAccountPrompt: 'Create an account to start your training.',
  signInPrompt: 'Sign in to continue your training.',
  creatingAccount: 'Creating Account...',
  signingIn: 'Signing In...',
  alreadyHaveAccount: 'Already have an account? Sign In',
  dontHaveAccount: "Don't have an account? Sign Up",
  forgotPassword: 'Forgot Password?',
  resetLinkSent: 'Password reset link sent! Please check your inbox.',

  // Auth Errors
  'error.auth/invalid-email': 'Please enter a valid email address.',
  'error.auth/user-not-found': 'Invalid email or password.',
  'error.auth/wrong-password': 'Invalid email or password.',
  'error.auth/invalid-credential': 'Invalid email or password.',
  'error.auth/email-already-in-use': 'An account with this email already exists.',
  'error.auth/weak-password': 'Password should be at least 6 characters long.',
  'error.auth/api-key-expired': 'The API key has expired. Please renew your API key.',
  'error.auth/missing-email': 'Please enter your email to reset the password.',
  'error.auth/missing-name': 'Please enter your full name.',
  'error.unexpected': 'An unexpected error occurred. Please try again.',
  'error.noPersonaForAssessment': "Admin error: The initial assessment scenario ('{scenarioTitle}') does not have any personas assigned. Please go to the Admin Panel and assign at least one persona to it.",
  'error.assessmentScenarioNotFound': "Critical error: The initial assessment scenario could not be found. Please contact support.",
  'error.personaNotFoundForScenario': 'Error: The persona assigned to this scenario could not be found. Please contact an administrator.',
  'error.noPersonaAssignedToScenario': 'This scenario has no assigned persona. Please go to the Admin Panel to assign one.',
  
  // Header & Navigation
  dashboard: 'Dashboard',
  newTraining: 'New Training',
  adminPanel: 'Admin Panel',

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
  assessmentIntro: "To get started, you'll go through a one-time initial assessment. This helps us establish a baseline of your skills. You will handle \"The Mysterious Minibar Charge\" scenario. Good luck!",
  startInitialAssessment: 'Start Initial Assessment',

  // Training View
  chooseScenario: 'Choose a Training Scenario',
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

  // Admin View
  manageScenarios: 'Manage Scenarios',
  managePersonas: 'Manage Personas',
  editScenario: 'Edit Scenario',
  editPersona: 'Edit Persona',
  assignedPersonas: 'Assigned Persona',
  
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

  // --- Scenario Categories ---
  'category.conflict.title': 'Conflict Resolution & Service Recovery',
  'category.conflict.description': 'Practice de-escalating tense situations, showing empathy, and turning a negative experience into a positive one.',
  'category.upselling.title': 'Upselling & Enhancing Guest Experience',
  'category.upselling.description': 'Learn to identify opportunities to offer additional services or amenities that genuinely benefit the guest.',
  'category.logistical.title': 'Operational & Logistical Challenges',
  'category.logistical.description': 'Handle situations that test your knowledge of hotel systems, policies, and problem-solving skills under pressure.',
  'category.safety.title': 'Safety, Security & Medical Situations',
  'category.safety.description': 'Practice handling sensitive situations that require a calm demeanor, adherence to protocol, and clear communication.',

  // --- Scenarios ---

  // Category: Conflict Resolution
  'scenario.billing-dispute.title': 'The Mysterious Minibar Charge',
  'scenario.billing-dispute.description': 'A guest is furious about a minibar charge they insist they didn\'t make and is threatening to post a negative review online.',
  'scenario.noise-complaint.title': 'The Party Next Door',
  'scenario.noise-complaint.description': 'A guest calls, for the second time, to complain about a loud party in the adjacent room. They have an early flight and are exhausted.',
  'scenario.unclean-room.title': 'The Unclean Room',
  'scenario.unclean-room.description': 'A guest has just checked into their room and found it has not been cleaned properly, raising concerns about hygiene.',

  // Category: Upselling
  'scenario.unusual-request.title': 'The Eccentric VIP',
  'scenario.unusual-request.description': 'A VIP guest has a series of bizarre and increasingly difficult requests, testing your ability to remain professional and resourceful.',
  'scenario.anniversary-couple.title': 'The Special Occasion',
  'scenario.anniversary-couple.description': 'During check-in, a couple mentions it\'s their 10th anniversary. This is an opportunity to enhance their stay.',
  'scenario.first-time-visitor.title': 'The City Explorer',
  'scenario.first-time-visitor.description': 'A guest asks for a simple dinner recommendation nearby. They seem a bit overwhelmed by the city.',

  // Category: Logistical
  'scenario.vip-checkin.title': 'The Rushed VIP',
  'scenario.vip-checkin.description': 'A high-profile CEO is checking in. They are in a hurry, on an important phone call, and expect a seamless, fast, and discreet check-in process.',
  'scenario.group-checkin.title': 'The Tour Bus Arrival',
  'scenario.group-checkin.description': 'A tour bus with 40 guests arrives an hour early. Rooms aren\'t ready, and the group leader is stressed and impatient.',
  'scenario.faulty-key.title': 'The Faulty Key Card',
  'scenario.faulty-key.description': 'A guest is frustrated because their key card has failed for the third time. They are carrying several bags and are visibly annoyed.',
  
  // Category: Safety
  'scenario.medical-emergency.title': 'The Medical Emergency',
  'scenario.medical-emergency.description': 'A guest approaches in a panic, saying their partner is in the room with chest pains and asking what they should do.',
  'scenario.lost-child.title': 'The Lost Child',
  'scenario.lost-child.description': 'A frantic parent runs into the lobby, explaining they can\'t find their 6-year-old son who was last seen near the pool.',
};

export type Translations = typeof en;