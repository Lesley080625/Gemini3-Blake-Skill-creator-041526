/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Settings2, Cpu, MessageSquare } from 'lucide-react';

export const ModelStudio: React.FC = () => {
  const { configs, updateConfig, language } = useApp();

  const labels = {
    'zh-TW': {
      title: '提示詞與模型工作室',
      desc: '微調 AI 參數與系統指令',
      model: '模型選擇',
      temp: '溫度 (創造力)',
      topK: 'Top-K',
      topP: 'Top-P',
      system: '系統指令 (System Instruction)',
    },
    'en': {
      title: 'Prompt & Model Studio',
      desc: 'Fine-tune AI parameters and system instructions',
      model: 'Model Selection',
      temp: 'Temperature (Creativity)',
      topK: 'Top-K',
      topP: 'Top-P',
      system: 'System Instruction',
    }
  }[language];

  const renderConfig = (key: string, title: string) => {
    const config = configs[key];
    return (
      <AccordionItem value={key} key={key} className="border-b-0">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-bold text-[13px]">{title}</div>
              <div className="text-[11px] text-muted-foreground">{config.model}</div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pb-6">
          <div className="bg-secondary p-[10px] rounded-[8px] space-y-2">
            <Label className="text-[12px] font-semibold">{labels.model}</Label>
            <Select 
              value={config.model} 
              onValueChange={(v) => updateConfig(key, { model: v })}
            >
              <SelectTrigger className="h-9 text-[13px] bg-white border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash (Default)</SelectItem>
                <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-secondary p-[10px] rounded-[8px] space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-[12px] font-semibold">{labels.temp}</Label>
              <span className="text-[11px] font-mono bg-white border border-border px-2 py-1 rounded">{config.temperature}</span>
            </div>
            <Slider 
              value={[config.temperature]} 
              min={0} max={1} step={0.05} 
              onValueChange={(v) => {
                const val = Array.isArray(v) ? v[0] : v;
                updateConfig(key, { temperature: val });
              }}
            />
          </div>

          <div className="bg-secondary p-[10px] rounded-[8px] space-y-2">
            <Label className="text-[12px] font-semibold">{labels.system}</Label>
            <Textarea 
              value={config.systemInstruction} 
              onChange={(e) => updateConfig(key, { systemInstruction: e.target.value })}
              className="min-h-[120px] font-mono text-[11px] bg-white border-border"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" />
          <CardTitle className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">{labels.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion className="px-4">
          {renderConfig('summary', language === 'zh-TW' ? '總結分析代理' : 'Summary Agent')}
          {renderConfig('infographic', language === 'zh-TW' ? '視覺化工程代理' : 'Visualization Agent')}
          {renderConfig('skill', language === 'zh-TW' ? '技能元編程代理' : 'Skill Meta Agent')}
        </Accordion>
      </CardContent>
    </Card>
  );
};
