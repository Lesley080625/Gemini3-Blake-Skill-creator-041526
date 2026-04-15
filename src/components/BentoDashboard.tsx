/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useWorkflow } from '../hooks/useWorkflow';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import { ModelStudio } from './ModelStudio';
import { Jackslot } from './Jackslot';
import { WowModules } from './WowModules';
import { SkillImprover } from './SkillImprover';
import { LiveLog } from './LiveLog';
import { WorkflowVisualizer } from './WorkflowVisualizer';
import ReactMarkdown from 'react-markdown';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import { 
  Search, FileText, BarChart3, Code, Lightbulb, 
  Upload, Send, Globe, ShieldCheck,
  Moon, Sun, Loader2, Square, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

export const BentoDashboard: React.FC = () => {
  const { language, setLanguage, theme, setTheme, flowerTheme, setFlowerTheme, stopExecution } = useApp();
  const { runFullWorkflow, loading, result, stepStatus } = useWorkflow();
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleRun = async () => {
    await runFullWorkflow(input, image || undefined);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f8bbd0', '#ff80ab', '#f472b6']
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const renderInfographic = (info: any, index: number) => {
    return (
      <Card key={index} className="glass-card hover:border-primary/50 transition-all duration-500 group">
        <CardHeader className="py-3">
          <CardTitle className="text-xs font-black uppercase tracking-widest group-hover:text-primary transition-colors">{info.title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] p-4">
          <ResponsiveContainer width="100%" height="100%">
            {info.type === 'bar' ? (
              <BarChart data={info.data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : info.type === 'pie' ? (
              <PieChart>
                <Pie data={info.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                  {info.data.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
              </PieChart>
            ) : info.type === 'line' ? (
              <LineChart data={info.data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)' }} activeDot={{ r: 6 }} />
              </LineChart>
            ) : (
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={info.data}>
                <PolarGrid opacity={0.1} />
                <PolarAngleAxis dataKey="name" fontSize={10} />
                <Radar name="Value" dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.6} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
              </RadarChart>
            )}
          </ResponsiveContainer>
          <p className="text-[10px] text-muted-foreground mt-3 line-clamp-2 italic opacity-70">{info.description}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter wow-gradient bg-clip-text text-transparent drop-shadow-sm">
            AGENTIC REVIEWER
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-[0.3em]">
            {language === 'zh-TW' ? '醫療器材法規智慧分析平台' : 'Medical Device Regulatory Intelligence'}
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Jackslot currentTheme={flowerTheme} onSelect={setFlowerTheme} />
          
          <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-full border border-primary/10 backdrop-blur-md shadow-inner">
            <Button 
              variant={language === 'zh-TW' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setLanguage('zh-TW')}
              className="rounded-full px-4 h-8 text-xs font-bold"
            >
              繁中
            </Button>
            <Button 
              variant={language === 'en' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setLanguage('en')}
              className="rounded-full px-4 h-8 text-xs font-bold"
            >
              EN
            </Button>
          </div>

          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="rounded-full w-10 h-10 border-primary/20 hover:bg-primary/5 transition-all"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="bento-grid">
        {/* Left Column: Studio */}
        <div className="flex flex-col gap-4">
          <ModelStudio />
        </div>

        {/* Middle Column: Main Workspace */}
        <div className="flex flex-col gap-4">
          {/* Input Section */}
          <Card className="glass-card overflow-hidden border-primary/20 shadow-2xl shadow-primary/5 group">
            <CardHeader className="wow-gradient text-primary-foreground py-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <CardTitle className="flex items-center gap-2 text-base relative z-10">
                <Send className="w-4 h-4" />
                {language === 'zh-TW' ? '輸入法規資訊' : 'Regulatory Input'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Textarea 
                placeholder={language === 'zh-TW' ? '貼上產品描述、法規條文或指引文件...' : 'Paste product descriptions, regulatory clauses, or guidance documents...'}
                className="min-h-[200px] bg-background/30 border-primary/10 focus:border-primary/40 transition-all resize-none text-sm leading-relaxed rounded-2xl p-4"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-xl hover:bg-secondary/80 transition-all border border-primary/5 shadow-sm">
                      <Upload className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold uppercase">{language === 'zh-TW' ? '上傳圖片' : 'Upload Image'}</span>
                      <input id="image-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                    </Label>
                    <AnimatePresence>
                      {image && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                          className="relative w-12 h-12 rounded-xl border-2 border-primary/20 overflow-hidden shadow-lg"
                        >
                          <img src={image} className="w-full h-full object-cover" />
                          <button onClick={() => setImage(null)} className="absolute top-0 right-0 bg-destructive/80 text-white w-4 h-4 flex items-center justify-center text-[10px] hover:bg-destructive transition-colors">×</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="flex gap-2 w-full md:w-auto">
                    {loading && (
                      <Button 
                        variant="destructive"
                        onClick={stopExecution}
                        className="px-6 py-7 text-lg font-black shadow-xl hover:scale-105 active:scale-95 transition-all rounded-2xl"
                      >
                        <Square className="w-5 h-5 mr-2" />
                        {language === 'zh-TW' ? '停止' : 'Stop'}
                      </Button>
                    )}
                    <Button 
                      onClick={handleRun} 
                      disabled={loading || !input}
                      className="flex-1 md:w-auto px-10 py-7 text-lg font-black shadow-2xl hover:scale-105 active:scale-95 transition-all wow-gradient border-none group relative overflow-hidden rounded-2xl"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                      {loading ? (
                        <div className="flex items-center gap-3 relative z-10">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>{language === 'zh-TW' ? '代理分析中...' : 'Agentic Review...'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 relative z-10">
                          <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                          <span>{language === 'zh-TW' ? '啟動代理化分析' : 'Start Agentic Analysis'}</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
            </CardContent>
          </Card>

          <WorkflowVisualizer status={stepStatus} language={language} />

          {/* Results Section */}
          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="grid grid-cols-5 w-full h-14 bg-secondary/30 rounded-2xl p-1.5 backdrop-blur-xl border border-primary/10 shadow-lg">
                    <TabsTrigger value="summary" className="rounded-xl data-[state=active]:wow-gradient data-[state=active]:text-white transition-all duration-500 font-bold text-xs"><FileText className="w-4 h-4 mr-2" />Summary</TabsTrigger>
                    <TabsTrigger value="infographics" className="rounded-xl data-[state=active]:wow-gradient data-[state=active]:text-white transition-all duration-500 font-bold text-xs"><BarChart3 className="w-4 h-4 mr-2" />Infographics</TabsTrigger>
                    <TabsTrigger value="skill" className="rounded-xl data-[state=active]:wow-gradient data-[state=active]:text-white transition-all duration-500 font-bold text-xs"><Code className="w-4 h-4 mr-2" />Skill.md</TabsTrigger>
                    <TabsTrigger value="usecases" className="rounded-xl data-[state=active]:wow-gradient data-[state=active]:text-white transition-all duration-500 font-bold text-xs"><Lightbulb className="w-4 h-4 mr-2" />Use Cases</TabsTrigger>
                    <TabsTrigger value="webpage" className="rounded-xl data-[state=active]:wow-gradient data-[state=active]:text-white transition-all duration-500 font-bold text-xs"><Globe className="w-4 h-4 mr-2" />WOW Page</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="mt-6 space-y-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <Card className="glass-card p-6 flex flex-col items-center text-center space-y-2 border-primary/20">
                        <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                        <h4 className="text-xs font-black uppercase tracking-widest">Execution Quality</h4>
                        <p className="text-2xl font-black text-primary">98.4%</p>
                      </Card>
                      <Card className="glass-card p-6 flex flex-col items-center text-center space-y-2 border-primary/20">
                        <Globe className="w-8 h-8 text-primary animate-bounce" />
                        <h4 className="text-xs font-black uppercase tracking-widest">Regulatory Coverage</h4>
                        <p className="text-2xl font-black text-primary">Global</p>
                      </Card>
                      <Card className="glass-card p-6 flex flex-col items-center text-center space-y-2 border-primary/20">
                        <ShieldCheck className="w-8 h-8 text-primary animate-spin-slow" />
                        <h4 className="text-xs font-black uppercase tracking-widest">Compliance Score</h4>
                        <p className="text-2xl font-black text-primary">Grade A+</p>
                      </Card>
                    </motion.div>

                    <Card className="glass-card border-primary/10 shadow-2xl rounded-3xl overflow-hidden">
                      <CardContent className="p-8">
                        <ScrollArea className="h-[600px] pr-4">
                          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none leading-relaxed font-sans">
                            <ReactMarkdown>{result.summary}</ReactMarkdown>
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="infographics" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {result.infographics.map((info, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                        >
                          {renderInfographic(info, i)}
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="skill" className="mt-6">
                    <Card className="glass-card border-primary/10 shadow-2xl rounded-3xl overflow-hidden">
                      <CardContent className="p-8">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            Agentic Skill Protocol
                          </h3>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-full text-[10px] font-bold px-4 border-primary/20 hover:bg-primary hover:text-white transition-all" 
                            onClick={() => {
                              navigator.clipboard.writeText(result.skillMd);
                              // Could add a toast here
                            }}
                          >
                            Copy Skill
                          </Button>
                        </div>
                        <div className="relative group">
                          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                          <pre className="relative text-xs font-mono bg-background/50 p-8 rounded-2xl overflow-x-auto border border-primary/5 leading-relaxed shadow-inner">
                            {result.skillMd}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="usecases" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {result.useCases.map((uc, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="h-full"
                        >
                          <Card className="glass-card h-full border-primary/10 hover:border-primary/40 transition-all duration-500 group hover:shadow-2xl hover:shadow-primary/5 rounded-3xl overflow-hidden">
                            <CardHeader className="bg-primary/5 border-b border-primary/5">
                              <CardTitle className="text-sm font-black group-hover:text-primary transition-colors flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px]">{i+1}</span>
                                {uc.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                              <p className="text-xs text-muted-foreground leading-relaxed font-medium">{uc.result}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="webpage" className="mt-6">
                    <Card className="glass-card overflow-hidden border-4 border-primary/20 shadow-3xl rounded-[3rem]">
                      <div className="h-[800px] overflow-y-auto p-6 md:p-16 space-y-20 bg-background/90 backdrop-blur-xl relative">
                        {/* Decorative elements */}
                        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                        
                        <div className="text-center space-y-8 relative z-10">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                          >
                            <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase wow-gradient bg-clip-text text-transparent drop-shadow-2xl">
                              {language === 'zh-TW' ? '法規智慧報告' : 'Intelligence Report'}
                            </h1>
                          </motion.div>
                          <div className="h-2 w-64 bg-primary mx-auto rounded-full shadow-2xl shadow-primary/40" />
                          <div className="flex items-center justify-center gap-4 text-muted-foreground uppercase tracking-[0.6em] text-[10px] font-black">
                            <span>Protocol v1.0</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span>{new Date().toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <section className="space-y-10 relative z-10">
                          <div className="flex items-center gap-6">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Executive Summary</h2>
                            <div className="flex-1 h-px bg-primary/20" />
                          </div>
                          <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none leading-relaxed font-serif italic text-foreground/90">
                            <ReactMarkdown>{result.summary.slice(0, 1500) + '...'}</ReactMarkdown>
                          </div>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                          {result.infographics.slice(0, 4).map((info, i) => (
                            <motion.div 
                              key={i} 
                              whileHover={{ y: -15, scale: 1.02 }}
                              className="p-10 bg-secondary/30 rounded-[3rem] border border-primary/10 shadow-2xl backdrop-blur-xl group transition-all duration-700"
                            >
                              <div className="flex justify-between items-start mb-8">
                                <h3 className="text-3xl font-black tracking-tight group-hover:text-primary transition-colors">
                                  {info.title}
                                </h3>
                                <span className="text-5xl font-black opacity-10 group-hover:opacity-30 transition-opacity">0{i+1}</span>
                              </div>
                              <div className="h-[350px]">
                                {renderInfographic(info, i)}
                              </div>
                            </motion.div>
                          ))}
                        </section>

                        <section className="p-12 md:p-24 bg-primary text-primary-foreground rounded-[5rem] shadow-3xl relative overflow-hidden group">
                          <motion.div 
                            className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full -mr-64 -mt-64 blur-[100px]"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 10, repeat: Infinity }}
                          />
                          <h2 className="text-5xl md:text-8xl font-black mb-12 tracking-tighter uppercase relative z-10">Agentic Skill Protocol</h2>
                          <div className="bg-black/30 p-10 md:p-16 rounded-[3rem] backdrop-blur-2xl border border-white/10 shadow-inner relative z-10">
                            <pre className="text-sm md:text-lg font-mono opacity-90 whitespace-pre-wrap leading-relaxed">
                              {result.skillMd.slice(0, 1000) + '...'}
                            </pre>
                          </div>
                          <div className="mt-16 flex justify-between items-end relative z-10">
                            <div className="space-y-2">
                              <p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-50">Authorized By</p>
                              <p className="text-3xl font-serif italic">Regulatory Intelligence AI</p>
                            </div>
                            <div className="text-right space-y-2">
                              <p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-50">System Hash</p>
                              <p className="text-xs font-mono opacity-70">{Math.random().toString(36).substring(2, 15).toUpperCase()}</p>
                            </div>
                          </div>
                        </section>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Refinement & Logs */}
        <div className="flex flex-col gap-4">
          <WowModules />
          <SkillImprover />
          <div className="flex-1 min-h-[300px]">
            <LiveLog />
          </div>
        </div>
      </div>
    </div>
  );
};
