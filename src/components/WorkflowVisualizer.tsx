/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WorkflowStepStatus } from '../types';
import { motion } from 'motion/react';
import { FileText, BarChart3, Code, Lightbulb, Check, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface WorkflowVisualizerProps {
  status: WorkflowStepStatus;
  language: 'zh-TW' | 'en';
}

export const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({ status, language }) => {
  const steps = [
    { id: 'summary', icon: FileText, label: language === 'zh-TW' ? '法規總結' : 'Summary' },
    { id: 'infographic', icon: BarChart3, label: language === 'zh-TW' ? '視覺化' : 'Infographics' },
    { id: 'skill', icon: Code, label: language === 'zh-TW' ? '技能協議' : 'Skill.md' },
    { id: 'usecases', icon: Lightbulb, label: language === 'zh-TW' ? '應用案例' : 'Use Cases' },
  ];

  return (
    <div className="flex items-center justify-between w-full px-6 py-6 bg-secondary rounded-[12px] border border-border relative overflow-hidden">
      {steps.map((step, index) => {
        const stepStatus = status[step.id as keyof WorkflowStepStatus];
        const Icon = step.icon;
        
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-2 z-10 relative">
              <motion.div
                initial={false}
                animate={{
                  scale: stepStatus === 'loading' ? 1.1 : 1,
                  backgroundColor: stepStatus === 'success' ? 'var(--primary)' : 
                                   stepStatus === 'error' ? 'var(--destructive)' : 
                                   stepStatus === 'loading' ? 'var(--background)' : 'var(--background)',
                  borderColor: stepStatus === 'idle' ? 'var(--border)' : 'var(--primary)',
                }}
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 shadow-sm",
                )}
              >
                {stepStatus === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                ) : stepStatus === 'success' ? (
                  <Check className="w-5 h-5 text-white" />
                ) : stepStatus === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-white" />
                ) : (
                  <Icon className="w-5 h-5 text-muted-foreground/30" />
                )}
              </motion.div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider transition-colors",
                stepStatus === 'idle' ? "text-muted-foreground/50" : "text-primary"
              )}>
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] bg-border mx-2 relative overflow-hidden">
                {status[steps[index].id as keyof WorkflowStepStatus] === 'success' && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="absolute inset-0 bg-primary"
                  />
                )}
                {status[steps[index+1].id as keyof WorkflowStepStatus] === 'loading' && (
                  <motion.div 
                    className="absolute inset-0 bg-primary/30"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
