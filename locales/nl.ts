import { Translations } from './en';

export const nl: Translations = {
  // General
  appName: 'frontlineboost',
  ok: 'OK',
  cancel: 'Annuleren',
  edit: 'Bewerken',
  save: 'Opslaan',

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
  fullName: 'Volledige Naam',
  organisation: 'Organisatie',
  createAccountPrompt: 'Maak een account aan om je training te starten.',
  signInPrompt: 'Log in om je training voort te zetten.',
  creatingAccount: 'Account aanmaken...',
  signingIn: 'Inloggen...',
  alreadyHaveAccount: 'Heb je al een account? Log in',
  dontHaveAccount: 'Geen account? Meld je aan',
  forgotPassword: 'Wachtwoord vergeten?',
  resetLinkSent: 'Link voor wachtwoordherstel verzonden! Controleer je inbox.',

  // Auth Errors
  'error.auth/invalid-email': 'Voer een geldig e-mailadres in.',
  'error.auth/user-not-found': 'Ongeldig e-mailadres of wachtwoord.',
  'error.auth/wrong-password': 'Ongeldig e-mailadres of wachtwoord.',
  'error.auth/invalid-credential': 'Ongeldig e-mailadres of wachtwoord.',
  'error.auth/email-already-in-use': 'Een account met dit e-mailadres bestaat al.',
  'error.auth/weak-password': 'Wachtwoord moet minimaal 6 tekens lang zijn.',
  'error.auth/api-key-expired': 'De API-sleutel is verlopen. Vernieuw uw API-sleutel.',
  'error.auth/missing-email': 'Voer uw e-mailadres in om het wachtwoord opnieuw in te stellen.',
  'error.auth/missing-name': 'Voer uw volledige naam in.',
  'error.unexpected': 'Er is een onverwachte fout opgetreden. Probeer het opnieuw.',
  'error.noPersonaForAssessment': "Beheerdersfout: Het initiële beoordelingsscenario ('{scenarioTitle}') heeft geen persona's toegewezen. Ga naar het Beheerderspaneel en wijs er minstens één toe.",
  'error.assessmentScenarioNotFound': "Kritieke fout: Het initiële beoordelingsscenario kon niet worden gevonden. Neem contact op met support.",
  'error.personaNotFoundForScenario': 'Fout: De aan dit scenario toegewezen persona kon niet worden gevonden. Neem contact op met een beheerder.',
  'error.noPersonaAssignedToScenario': 'Aan dit scenario is geen persona toegewezen. Ga naar het Beheerderspaneel om er een toe te wijzen.',

  // Header & Navigation
  dashboard: 'Overzicht',
  newTraining: 'Nieuwe Training',
  adminPanel: 'Beheerderspaneel',

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
  assessmentIntro: 'Om te beginnen, doorloop je een eenmalige initiële beoordeling. Dit helpt ons een basislijn van je vaardigheden vast te stellen. Je behandelt het scenario "De Mysterieuze Minibar-rekening". Veel succes!',
  startInitialAssessment: 'Start Initiële Beoordeling',

  // Training View
  chooseScenario: 'Kies een Trainingsscenario',
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

  // Admin View
  manageScenarios: 'Beheer Scenario\'s',
  managePersonas: 'Beheer Persona\'s',
  editScenario: 'Bewerk Scenario',
  editPersona: 'Bewerk Persona',
  assignedPersonas: 'Toegewezen Persona',

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

  // --- Scenario Categories ---
  'category.conflict.title': 'Conflictoplossing & Serviceherstel',
  'category.conflict.description': 'Oefen met het de-escaleren van gespannen situaties, het tonen van empathie en het omzetten van een negatieve ervaring in een positieve.',
  'category.upselling.title': 'Upselling & Verbetering van de Gastervaring',
  'category.upselling.description': 'Leer kansen te herkennen om extra diensten of voorzieningen aan te bieden die de gast echt ten goede komen.',
  'category.logistical.title': 'Operationele & Logistieke Uitdagingen',
  'category.logistical.description': 'Behandel situaties die je kennis van hotelsystemen, beleid en probleemoplossende vaardigheden onder druk testen.',
  'category.safety.title': 'Veiligheid, Beveiliging & Medische Situaties',
  'category.safety.description': 'Oefen met het omgaan met gevoelige situaties die een kalme houding, naleving van protocollen en duidelijke communicatie vereisen.',

  // --- Scenarios ---

  // Category: Conflict Resolution
  'scenario.billing-dispute.title': 'De Mysterieuze Minibar-rekening',
  'scenario.billing-dispute.description': 'Een gast is woedend over een minibar-rekening die volgens hen onjuist is en dreigt met een negatieve recensie.',
  'scenario.noise-complaint.title': 'Het Feestje Naast de Deur',
  'scenario.noise-complaint.description': 'Een gast belt voor de tweede keer om te klagen over een luid feest in de aangrenzende kamer. Ze zijn uitgeput.',
  'scenario.unclean-room.title': 'De Onreine Kamer',
  'scenario.unclean-room.description': 'Een gast heeft net ingecheckt en ontdekt dat de kamer niet goed is schoongemaakt, wat zorgen over de hygiëne oproept.',

  // Category: Upselling
  'scenario.unusual-request.title': 'De Excentrieke VIP',
  'scenario.unusual-request.description': 'Een VIP-gast heeft een reeks bizarre verzoeken, wat je professionaliteit op de proef stelt.',
  'scenario.anniversary-couple.title': 'De Speciale Gelegenheid',
  'scenario.anniversary-couple.description': 'Tijdens het inchecken vermeldt een stel dat het hun 10-jarig jubileum is. Dit is een kans om hun verblijf te verbeteren.',
  'scenario.first-time-visitor.title': 'De Stadsverkenner',
  'scenario.first-time-visitor.description': 'Een gast vraagt om een eenvoudig dineradvies in de buurt. Ze lijken een beetje overweldigd door de stad.',

  // Category: Logistical
  'scenario.vip-checkin.title': 'De Gehaaste VIP',
  'scenario.vip-checkin.description': 'Een CEO checkt in, is gehaast, aan de telefoon en verwacht een naadloos en discreet proces.',
  'scenario.group-checkin.title': 'De Aankomst van de Tourbus',
  'scenario.group-checkin.description': 'Een tourbus met 40 gasten arriveert een uur te vroeg. De kamers zijn niet klaar en de reisleider is gestrest.',
  'scenario.faulty-key.title': 'De Defecte Sleutelkaart',
  'scenario.faulty-key.description': 'Een gast is gefrustreerd omdat hun sleutelkaart voor de derde keer niet werkt. Ze hebben bagage en zijn zichtbaar geïrriteerd.',

  // Category: Safety
  'scenario.medical-emergency.title': 'Het Medisch Noodgeval',
  'scenario.medical-emergency.description': 'Een gast benadert je in paniek; hun partner heeft pijn op de borst in de kamer en vraagt wat te doen.',
  'scenario.lost-child.title': 'Het Vermiste Kind',
  'scenario.lost-child.description': 'Een paniekerige ouder rent de lobby in omdat ze hun 6-jarige zoon, die het laatst bij het zwembad is gezien, niet kunnen vinden.',
};