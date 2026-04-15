/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Terminal, CheckCircle2, AlertCircle, Info, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LiveLog: React.FC = () => {
  const { logs, language } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [logs]);

  const getIcon = (level: string) => {
    switch (level) {
      case 'success': return <CheckCircle2 className="w-3 h-3 text-green-500" />;
      case 'error': return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'warning': return <AlertCircle className="w-3 h-3 text-yellow-500" />;
      default: return <Info className="w-3 h-3 text-blue-500" />;
    }
  };

  return (
    <Card className="glass-card h-full flex flex-col overflow-hidden">
      <CardHeader className="py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          <CardTitle className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
            {language === 'zh-TW' ? '即時日誌' : 'Live Execution Log'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4 bg-secondary" ref={scrollRef}>
          <div className="space-y-2 font-mono text-[11px]">
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2 items-start group bg-white p-2 rounded-[6px] border border-border/50 shadow-sm"
                >
                  <span className="text-muted-foreground/50 shrink-0 flex items-center gap-1">
                    <Clock className="w-2 h-2" />
                    {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <span className="shrink-0 mt-0.5">{getIcon(log.level)}</span>
                  <span className={`flex-1 break-words ${
                    log.level === 'error' ? 'text-red-500' : 
                    log.level === 'success' ? 'text-green-600' : 
                    'text-foreground/80'
                  }`}>
                    {log.step && <span className="text-primary font-bold mr-1">[{log.step.toUpperCase()}]</span>}
                    {log.message}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {logs.length === 0 && (
              <div className="text-muted-foreground/30 italic flex items-center justify-center h-32 text-[12px]">
                Waiting for workflow initiation...
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
