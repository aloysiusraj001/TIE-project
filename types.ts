export enum AppView {
  DASHBOARD = 'DASHBOARD',
  TRAINING = 'TRAINING',
  REPORT = 'REPORT',
}

export enum TrainingMode {
  ASSESSMENT = 'ASSESSMENT',
  MENTORING = 'MENTORING',
}

export type LocalizedString = {
  [key: string]: string;
};

export interface Scenario {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  systemInstruction: string;
  avatar: string;
  videoAvatar?: string;
  persona: {
    name: string;
    gender: 'male' | 'female' | 'neutral';
    age: string;
    voice: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  };
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

export interface TrainingSession {
  id: string;
  scenario: Scenario;
  date: string;
  transcript: TranscriptEntry[];
  report: Report;
}

export interface MentorFeedback {
  positive: string;
  suggestion: string;
}
