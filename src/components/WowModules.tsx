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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ShieldCheck, Globe, AlertTriangle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const WowModules: React.FC = () => {
  const { configs, language, addLog } = useApp();
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [input, setInput] = useState('');

  const runModule = async (type: 'pathway' | 'harmonizer' | 'capa') => {
    setLoading(type);
    setResult(null);
    addLog(`Initiating WOW Module: ${type.toUpperCase()}...`, 'info', type);
    try {
      let prompt = '';
      if (type === 'pathway') {
        prompt = `Predict the regulatory pathway (510k, De Novo, PMA) for this product. 
        Provide a risk/pathway matrix, success probability, and timeline.
        Input: ${input}`;
      } else if (type === 'harmonizer') {
        prompt = `Harmonize the following FDA regulatory text with EU MDR and Japan PMDA standards. 
        Create a cross-lingual semantic mapping table.
        Input: ${input}`;
      } else if (type === 'capa') {
        prompt = `Analyze these audit findings using 5 Whys and Ishikawa logic. 
        Generate a complete CAPA plan (Correction, Root Cause, Corrective Action, Verification).
        Input: ${input}`;
      }
      
      const res = await generateContent(configs.summary, prompt);
      setResult(res);
      addLog(`WOW Module ${type.toUpperCase()} execution successful.`, 'success', type);
    } catch (error) {
      addLog(`WOW Module ${type.toUpperCase()} failed: ${error instanceof Error ? error.message : String(error)}`, 'error', type);
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const modules = [
    {
      id: 'pathway',
      icon: <ShieldCheck className="w-5 h-5" />,
      title: language === 'zh-TW' ? '預測性合規路徑' : 'Predictive Pathway',
      desc: 'Simulate 510(k), De Novo, or PMA paths.',
      placeholder: 'Enter intended use and technical characteristics...'
    },
    {
      id: 'harmonizer',
      icon: <Globe className="w-5 h-5" />,
      title: language === 'zh-TW' ? '跨語系語意協調' : 'Semantic Harmonizer',
      desc: 'Align FDA terms with MDR/PMDA standards.',
      placeholder: 'Paste FDA technical documentation...'
    },
    {
      id: 'capa',
      icon: <AlertTriangle className="w-5 h-5" />,
      title: language === 'zh-TW' ? 'NC 自動除錯' : 'NC Auto-Debugger',
      desc: 'Generate CAPA plans from audit findings.',
      placeholder: 'Paste audit findings or non-conformance reports...'
    }
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <CardTitle className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">WOW AI Features</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {modules.map((m) => (
          <Dialog key={m.id}>
            <DialogTrigger>
              <div className="p-3 rounded-[8px] bg-secondary hover:bg-primary/5 border border-border transition-all cursor-pointer group">
                <div className="font-bold text-[13px] flex items-center justify-between group-hover:text-primary">
                  {m.title}
                  <div className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary">{m.icon}</div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{m.desc}</p>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-[12px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-primary">
                  {m.icon} {m.title}
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 space-y-4 overflow-hidden flex flex-col py-4">
                <Textarea 
                  placeholder={m.placeholder}
                  className="min-h-[150px] text-[13px] rounded-[8px]"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button 
                  onClick={() => runModule(m.id as any)} 
                  disabled={!!loading || !input}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-[8px]"
                >
                  {loading === m.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {language === 'zh-TW' ? '執行分析' : 'Run Analysis'}
                </Button>
                {result && (
                  <ScrollArea className="flex-1 bg-secondary p-4 rounded-[8px] border border-border">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-[13px]">
                      <ReactMarkdown>{result}</ReactMarkdown>
                    </div>
                  </ScrollArea>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </CardContent>
    </Card>
  );
};
