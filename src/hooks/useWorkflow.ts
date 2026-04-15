/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { generateContent, generateJson } from '../lib/gemini';
import { WorkflowResult, InfographicData, WorkflowStepStatus, StepStatus } from '../types';
import { Type } from '@google/genai';

export const useWorkflow = () => {
  const { configs, language, addLog, clearLogs, setAbortController } = useApp();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WorkflowResult | null>(null);
  const [stepStatus, setStepStatus] = useState<WorkflowStepStatus>({
    summary: 'idle',
    infographic: 'idle',
    skill: 'idle',
    usecases: 'idle'
  });

  const updateStep = (step: keyof WorkflowStepStatus, status: StepStatus) => {
    setStepStatus(prev => ({ ...prev, [step]: status }));
  };

  const runFullWorkflow = async (input: string, image?: string) => {
    const controller = new AbortController();
    setAbortController(controller);
    const signal = controller.signal;

    setLoading(true);
    clearLogs();
    setResult(null);
    setStepStatus({ summary: 'idle', infographic: 'idle', skill: 'idle', usecases: 'idle' });

    addLog('Starting Agentic Reviewer Workflow...', 'info');

    try {
      // Step 1: Summary
      updateStep('summary', 'loading');
      addLog('Initiating Regulatory Summary Agent...', 'info', 'summary');
      
      const summaryPrompt = `Based on the following information, create a comprehensive summary (2000-3000 words) in Markdown. 
      Language: ${language === 'zh-TW' ? 'Traditional Chinese' : 'English'}.
      Input: ${input}`;
      
      const summaryParts: any[] = [{ text: summaryPrompt }];
      if (image) {
        addLog('Processing uploaded image for visual context...', 'info', 'summary');
        summaryParts.push({ inlineData: { mimeType: 'image/png', data: image.split(',')[1] } });
      }
      
      const summary = await generateContent(configs.summary, summaryParts);
      if (signal.aborted) return;
      
      addLog('Regulatory summary generated successfully.', 'success', 'summary');
      updateStep('summary', 'success');

      // Step 2: Infographic
      updateStep('infographic', 'loading');
      addLog('Initiating Visualization Engineering Agent...', 'info', 'infographic');
      
      const infoPromptText = `Based on the summary below, create a comprehensive prompt (1000-2000 words) in Markdown that describes how to create 5 WOW infographics.
      Then, generate the JSON data for these 5 infographics.
      Summary: ${summary}`;
      
      const infoPrompt = await generateContent(configs.infographic, infoPromptText);
      if (signal.aborted) return;
      
      addLog('Infographic prompts engineered.', 'info', 'infographic');
      
      const infoSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['bar', 'pie', 'line', 'radar', 'custom'] },
            data: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.NUMBER } } } },
            description: { type: Type.STRING }
          },
          required: ['title', 'type', 'data', 'description']
        }
      };
      
      addLog('Generating structured JSON data for infographics...', 'info', 'infographic');
      const infographics = await generateJson<InfographicData[]>(configs.infographic, `Generate JSON for 5 infographics based on this prompt: ${infoPrompt}`, infoSchema);
      if (signal.aborted) return;
      
      addLog(`${infographics.length} infographics generated.`, 'success', 'infographic');
      updateStep('infographic', 'success');

      // Step 3: Skill.md
      updateStep('skill', 'loading');
      addLog('Initiating Skill Meta-Programming Agent...', 'info', 'skill');
      
      const skillPrompt = `Create a skill.md file that will be used by an AI agent to create 5 similar infographics. 
      Include YAML frontmatter and structured instructions.
      Context: ${summary}`;
      const skillMd = await generateContent(configs.skill, skillPrompt);
      if (signal.aborted) return;
      
      addLog('Agentic skill protocol (skill.md) created.', 'success', 'skill');
      updateStep('skill', 'success');

      // Step 4: Use Cases
      updateStep('usecases', 'loading');
      addLog('Simulating real-world use cases for the new skill...', 'info', 'usecases');
      
      const useCaseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            result: { type: Type.STRING }
          },
          required: ['title', 'result']
        }
      };
      const useCases = await generateJson<{title: string, result: string}[]>(configs.skill, `Create 3 use cases for this skill and generate results: ${skillMd}`, useCaseSchema);
      if (signal.aborted) return;
      
      addLog('Use case simulation complete.', 'success', 'usecases');
      updateStep('usecases', 'success');

      setResult({
        summary,
        prompt: infoPrompt,
        infographics,
        skillMd,
        useCases
      });
      
      addLog('Workflow completed successfully. All agents finished.', 'success');
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        addLog('Workflow execution cancelled by user.', 'warning');
      } else {
        addLog(`Workflow Error: ${error instanceof Error ? error.message : String(error)}`, 'error');
        console.error("Workflow Error:", error);
      }
      
      // Set remaining steps to error if not aborted
      if (!signal.aborted) {
        setStepStatus(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(key => {
            if (next[key as keyof WorkflowStepStatus] === 'loading') {
              next[key as keyof WorkflowStepStatus] = 'error';
            }
          });
          return next;
        });
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  return { runFullWorkflow, loading, result, stepStatus };
};
