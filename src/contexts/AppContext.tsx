/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, FlowerTheme, ModelConfig, AppState, LogEntry } from '../types';

interface AppContextType extends AppState {
  setLanguage: (lang: Language) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setFlowerTheme: (flower: FlowerTheme) => void;
  updateConfig: (key: string, config: Partial<ModelConfig>) => void;
  logs: LogEntry[];
  addLog: (message: string, level?: LogEntry['level'], step?: string) => void;
  clearLogs: () => void;
  isStopping: boolean;
  setIsStopping: (val: boolean) => void;
  abortController: AbortController | null;
  setAbortController: (ac: AbortController | null) => void;
  stopExecution: () => void;
}

const defaultConfigs: Record<string, ModelConfig> = {
  summary: {
    model: 'gemini-2.5-flash',
    temperature: 0.1,
    topK: 40,
    topP: 0.95,
    systemInstruction: "You are a senior regulatory affairs consultant with 20 years of experience in FDA and MDR compliance.",
  },
  infographic: {
    model: 'gemini-2.5-flash',
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    systemInstruction: "You are a data visualization expert and creative prompt engineer.",
  },
  skill: {
    model: 'gemini-2.5-flash',
    temperature: 0.3,
    topK: 40,
    topP: 0.95,
    systemInstruction: "You are a meta-programming expert specializing in AI agent skill creation.",
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh-TW');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [flowerTheme, setFlowerTheme] = useState<FlowerTheme>('rose');
  const [configs, setConfigs] = useState(defaultConfigs);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isStopping, setIsStopping] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const stopExecution = () => {
    if (abortController) {
      abortController.abort();
      setIsStopping(true);
      addLog('Execution stopped by user.', 'warning', 'system');
      setTimeout(() => setIsStopping(false), 2000);
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Remove all theme classes
    const themeClasses = Array.from(root.classList).filter(c => c.startsWith('theme-'));
    themeClasses.forEach(c => root.classList.remove(c));
    root.classList.add(`theme-${flowerTheme}`);
  }, [theme, flowerTheme]);

  const updateConfig = (key: string, newConfig: Partial<ModelConfig>) => {
    setConfigs(prev => ({
      ...prev,
      [key]: { ...prev[key], ...newConfig }
    }));
  };

  const addLog = (message: string, level: LogEntry['level'] = 'info', step?: string) => {
    setLogs(prev => [
      {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date(),
        level,
        message,
        step
      },
      ...prev.slice(0, 49) // Keep last 50 logs
    ]);
  };

  const clearLogs = () => setLogs([]);

  return (
    <AppContext.Provider value={{ 
      language, setLanguage, 
      theme, setTheme, 
      flowerTheme, setFlowerTheme, 
      configs, updateConfig,
      logs, addLog, clearLogs,
      isStopping, setIsStopping,
      abortController, setAbortController,
      stopExecution
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
