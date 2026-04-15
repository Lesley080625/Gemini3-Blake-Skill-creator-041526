/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'zh-TW' | 'en';

export type FlowerTheme = 
  | 'rose' | 'lavender' | 'sunflower' | 'cherry' | 'orchid' 
  | 'lily' | 'tulip' | 'daisy' | 'lotus' | 'marigold' 
  | 'hibiscus' | 'peony' | 'jasmine' | 'bluebell' | 'poppy' 
  | 'violet' | 'camellia' | 'hydrangea' | 'magnolia' | 'iris';

export interface ModelConfig {
  model: string;
  temperature: number;
  topK: number;
  topP: number;
  systemInstruction: string;
}

export interface AppState {
  language: Language;
  theme: 'light' | 'dark';
  flowerTheme: FlowerTheme;
  configs: Record<string, ModelConfig>;
}

export interface InfographicData {
  title: string;
  type: 'bar' | 'pie' | 'line' | 'radar' | 'custom';
  data: any[];
  description: string;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  step?: string;
}

export type StepStatus = 'idle' | 'loading' | 'success' | 'error';

export interface WorkflowStepStatus {
  summary: StepStatus;
  infographic: StepStatus;
  skill: StepStatus;
  usecases: StepStatus;
}

export interface WorkflowResult {
  summary: string;
  prompt: string;
  infographics: InfographicData[];
  skillMd: string;
  useCases: { title: string; result: string }[];
}
