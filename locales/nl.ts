import { Translations } from './en';

export const nl: Translations = {
  // General
  appName: 'frontlineboost',
  ok: 'OK',
  cancel: 'Annuleren',

  // Language Names
  language: 'Taal',
  english: 'English',
  dutch: 'Nederlands',
  arabic: 'العربية',
  chinese: '中文 (简体)',

  // Login & Auth
  signIn: 'Inloggen',
  signUp: 'Aanmelden',
  signOut: 'Uitloggen',
  emailAddress: 'E-mailadres',
  password: 'Wachtwoord',
  createAccountPrompt: 'Maak een account aan om je training te starten.',
  signInPrompt: 'Log in om je training voort te zetten.',
  creatingAccount: 'Account aanmaken...',
  signingIn: 'Inloggen...',
  alreadyHaveAccount: 'Heb je al een account? Log in',
  dontHaveAccount: 'Geen account? Meld je aan',

  // Auth Errors
  'error.auth/invalid-email': 'Voer een geldig e-mailadres in.',
  'error.auth/user-not-found': 'Ongeldig e-mailadres of wachtwoord.',
  'error.auth/wrong-password': 'Ongeldig e-mailadres of wachtwoord.',
  'error.auth/invalid-credential': 'Ongeldig e-mailadres of wachtwoord.',
  'error.auth/email-already-in-use': 'Een account met dit e-mailadres bestaat al.',
  'error.auth/weak-password': 'Wachtwoord moet minimaal 6 tekens lang zijn.',
  'error.unexpected': 'Er is een onverwachte fout opgetreden. Probeer het opnieuw.',

  // Header & Navigation
  dashboard: 'Overzicht',
  newTraining: 'Nieuwe Training',

  // Dashboard
  trainingDashboard: 'Trainingsoverzicht',
  newMentoredTraining: 'Nieuwe Begeleide Training',
  overallPerformanceSummary: 'Algemeen Prestatieoverzicht',
  sessionHistory: 'Sessiegeschiedenis',
  viewReport: 'Bekijk Rapport',
  noSessions: 'Nog geen sessies.',
  noSessionsPrompt: 'Klik op "Nieuwe Begeleide Training" om je eerste oefensessie te starten!',

  // Initial Assessment Card
  welcome: 'Welkom bij Frontline Boost!',
  assessmentIntro: 'Om te beginnen, doorloop je een eenmalige initiële beoordeling. Dit helpt ons een basislijn van je vaardigheden vast te stellen. Je behandelt een "Overboekte Kamer" scenario. Veel succes!',
  startInitialAssessment: 'Start Initiële Beoordeling',

  // Training View
  chooseScenario: 'Kies een Begeleid Trainingsscenario',
  backToDashboard: 'Terug naar Overzicht',
  changeScenario: 'Verander Scenario',
  speakingWith: 'Je spreekt met: {name}',
  startPrompt: 'Klik op de microfoon om de {mode} met {name} te starten.',
  assessment: 'beoordeling',
  conversation: 'gesprek',
  recording: 'Opnemen... (Klik om te stoppen)',
  tapToSpeak: 'Tik om te spreken',
  finishAndGetReport: 'Voltooi & Ontvang Rapport',
  analyzingPerformance: 'Je prestaties worden geanalyseerd en het rapport wordt gegenereerd...',

  // Live Mentor
  mentorThinking: 'Mentor denkt na...',
  whatWentWell: 'Wat Ging Goed',
  suggestion: 'Suggestie',
  initialTipPositive: 'Laten we beginnen!',
  initialTip1: 'Vergeet niet de gast hartelijk te begroeten en hun naam te gebruiken als je die weet.',
  initialTip2: 'Luister aandachtig naar het volledige probleem van de gast voordat je een oplossing aanbiedt.',
  initialTip3: 'Houd een kalme en professionele toon aan, zelfs als de gast van streek is.',

  // Report View
  performanceOverview: 'Prestatieoverzicht',
  detailedFeedback: 'Gedetailleerde Feedback',
  overallScore: 'Algemene Score',
  conversationTranscript: 'Gesprekstranscript',

  // Pillar Names (Short for Charts/Dash)
  'pillar.empathy': 'Empathie',
  'pillar.communication': 'Communicatie',
  'pillar.ownership': 'Eigenaarschap',
  'pillar.consistency': 'Consistentie',
  'pillar.personalization': 'Personalisatie',

  // Pillar Names (Full for Reports)
  'pillar.full.empathy': 'Proactieve Empathie & Aandacht',
  'pillar.full.communication': 'Communicatiehelderheid & Emotionele Intelligentie',
  'pillar.full.ownership': 'Serviceherstel & Eigenaarschap',
  'pillar.full.consistency': 'Consistentie & Oog voor Detail',
  'pillar.full.personalization': 'Personalisatie & Creëren van Herinneringen',

  // Scenario: The Overbooked Room
  'scenario.angry-guest.title': 'De Overboekte Kamer',
  'scenario.angry-guest.description': 'Een gast arriveert laat in de avond en ontdekt dat hun bevestigde reservering voor een kamertype is dat nu niet beschikbaar is. Ze zijn moe en boos.',
  
  // Scenario: The Unusual Request
  'scenario.unusual-request.title': 'Het Ongewone Verzoek',
  'scenario.unusual-request.description': 'Een VIP-gast heeft een reeks bizarre en steeds moeilijkere verzoeken, wat je vermogen om professioneel en vindingrijk te blijven op de proef stelt.',

  // Scenario: The Rushed VIP
  'scenario.vip-checkin.title': 'De Gehaaste VIP',
  'scenario.vip-checkin.description': 'Een high-profile CEO checkt in. Ze hebben haast, voeren een belangrijk telefoongesprek en verwachten een naadloos, snel en discreet incheckproces.',

  // Scenario: The Cleanliness Complaint
  'scenario.complaint-handling.title': 'De Klacht over de Schoonmaak',
  'scenario.complaint-handling.description': 'Een gezin met jonge kinderen klaagt dat hun kamer niet voldoet aan de verwachte schoonmaaknormen. Ze zijn bezorgd en willen onmiddellijke actie.',
};