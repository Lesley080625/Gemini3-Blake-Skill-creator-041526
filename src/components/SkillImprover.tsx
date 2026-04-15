/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { generateContent } from '../lib/gemini';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Code, FileText, Wand2, Play, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const SkillImprover: React.FC = () => {
  const { configs, language, addLog } = useApp();
  const [doc, setDoc] = useState('');
  const [skill, setSkill] = useState('');
  const [improvedSkill, setImprovedSkill] = useState('');
  const [executionResult, setExecutionResult] = useState('');
  const [loading, setLoading] = useState<'improving' | 'executing' | null>(null);

  const improveSkill = async () => {
    setLoading('improving');
    addLog('Initiating Skill Evolution Agent...', 'info', 'skill-studio');
    try {
      const prompt = `Improve the following skill.md file by adding 3 additional WOW AI features specifically for medical device regulatory analysis.
      Original Skill: ${skill}
      Context Document: ${doc}`;
      
      const res = await generateContent(configs.skill, prompt);
      setImprovedSkill(res);
      addLog('Skill evolved with 3 additional WOW features.', 'success', 'skill-studio');
    } catch (error) {
      addLog(`Skill evolution failed: ${error instanceof Error ? error.message : String(error)}`, 'error', 'skill-studio');
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const executeSkill = async () => {
    setLoading('executing');
    addLog('Executing evolved skill protocol...', 'info', 'skill-studio');
    try {
      const prompt = `Execute the following improved skill on the provided document.
      Skill: ${improvedSkill}
      Document: ${doc}`;
      
      const res = await generateContent(configs.summary, prompt);
      setExecutionResult(res);
      addLog('Evolved skill execution complete.', 'success', 'skill-studio');
    } catch (error) {
      addLog(`Skill execution failed: ${error instanceof Error ? error.message : String(error)}`, 'error', 'skill-studio');
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="glass-card md:col-span-3">
      <CardHeader className="py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-primary" />
          <CardTitle className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
            {language === 'zh-TW' ? '技能進化與執行工作室' : 'Skill Evolution & Execution Studio'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-secondary p-[10px] rounded-[8px] space-y-2">
              <label className="text-[12px] font-semibold flex items-center gap-2"><FileText className="w-3 h-3 text-primary" /> Document</label>
              <Textarea 
                placeholder="Paste your document here..."
                className="min-h-[150px] font-mono text-[11px] bg-white border-border"
                value={doc}
                onChange={(e) => setDoc(e.target.value)}
              />
            </div>
            <div className="bg-secondary p-[10px] rounded-[8px] space-y-2">
              <label className="text-[12px] font-semibold flex items-center gap-2"><Code className="w-3 h-3 text-primary" /> Original Skill.md</label>
              <Textarea 
                placeholder="Paste your skill.md here..."
                className="min-h-[150px] font-mono text-[11px] bg-white border-border"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
              />
            </div>
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-[8px]" 
              onClick={improveSkill} 
              disabled={!doc || !skill || !!loading}
            >
              {loading === 'improving' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
              {language === 'zh-TW' ? '進化技能' : 'Evolve Skill'}
            </Button>
          </div>

          <div className="space-y-4">
            {improvedSkill && (
              <>
                <div className="bg-secondary p-[10px] rounded-[8px] space-y-2">
                  <label className="text-[12px] font-semibold text-primary flex items-center gap-2"><Wand2 className="w-3 h-3" /> Improved Skill.md</label>
                  <ScrollArea className="h-[320px] bg-white p-4 rounded-[8px] border border-border">
                    <pre className="text-[10px] font-mono whitespace-pre-wrap">{improvedSkill}</pre>
                  </ScrollArea>
                </div>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-[8px]" 
                  onClick={executeSkill} 
                  disabled={!!loading}
                >
                  {loading === 'executing' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {language === 'zh-TW' ? '執行進化技能' : 'Execute Evolved Skill'}
                </Button>
              </>
            )}
          </div>
        </div>

        {executionResult && (
          <div className="mt-8 p-6 bg-secondary rounded-[12px] border border-border">
            <h3 className="text-[13px] font-bold mb-4 flex items-center gap-2 text-primary"><Play className="w-4 h-4" /> Execution Results</h3>
            <ScrollArea className="h-[400px] bg-white p-6 rounded-[8px] border border-border">
              <div className="prose prose-sm dark:prose-invert max-w-none text-[13px]">
                <ReactMarkdown>{executionResult}</ReactMarkdown>
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
