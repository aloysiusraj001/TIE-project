import { Blob } from '@google/genai';

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  TRAINING = 'TRAINING',
  REPORT = 'REPORT',
  ADMIN = 'ADMIN',
}

export enum TrainingMode {
  ASSESSMENT = 'ASSESSMENT',
  MENTORING = 'MENTORING',
}

export type LocalizedString = {
  [key: string]: string;
};

export interface ScenarioCategory {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
}

// New detailed Persona interface
export interface Persona {
  id: string; // Document ID (e.g., 'ms-harrison')
  name: string;
  age: string | null;
  gender: 'male' | 'female' | 'neutral' | null;
  role: string;
  location: string | null;
  background: string | null;
  family_status: string | null;
  education: string | null;
  professional_snapshot: string | null;
  career_path: string[];
  job_responsibilities: string[];
  values_attitudes_motivations: string[];
  goals_needs: {
    personal: string[];
    professional: string[];
    needs: string[];
  };
  behaviors_habits: {
    information_consumption: string[];
    buying_decision_behaviors: string[];
    communication_preferences: string[];
  };
  pain_points_challenges: string[];
  skills_competencies: string[];
  attitude_reputation: {
    self_view: string | null;
    public_reputation: string | null;
  };
  technology_media_usage: string[];
  personality_traits: string[];
  influences_inspirations: string[];
  knowledge_awareness_scope: string[];
  day_in_life: string | null;
  speaking_style: string | null;
  topics_warm: string[];
  voice: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  videoAvatar?: string;
}


// Updated Scenario interface to use a single personaId
export interface Scenario {
  id: string;
  categoryId: string;
  title: LocalizedString;
  description: LocalizedString;
  avatar: string;
  systemInstruction: string;
  personaId?: string; // A single Persona ID compatible with this scenario
  setting: string | null;
  trigger_event: string | null;
  key_challenge: string | null;
  objective: string | null;
  constraints: string[];
  required_actions: string[];
  desired_outcomes: string[];
  critical_communication_points: string[];
}

export interface PillarFeedback {
  pillar: string; // This will be the key, e.g., 'pillar.full.empathy'
  score: number;
  feedback: string;
  suggestion: string;
}

export interface Report {
  summary: string;
  pillars: PillarFeedback[];
}

export interface TranscriptEntry {
  speaker: 'user' | 'ai';
  text: string;
}

// Updated TrainingSession to include personaId and persona object
export interface TrainingSession {
  id:string;
  scenarioId: string;
  personaId: string;
  scenario?: Scenario; // To be populated at runtime
  persona?: Persona; // To be populated at runtime
  date: string;
  transcript: TranscriptEntry[];
  report: Report;
}

export interface MentorFeedback {
  positive: string;
  suggestion: string;
}