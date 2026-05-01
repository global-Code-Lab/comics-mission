/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Orbit, 
  Code, 
  FlaskConical, 
  LayoutDashboard, 
  ChevronRight, 
  BookOpen, 
  Lightbulb, 
  HelpCircle,
  Save,
  Printer,
  RotateCcw,
  Menu,
  X,
  CheckCircle2,
  Lock,
  Terminal as TerminalIcon
} from 'lucide-react';
import { allLessons, subjectMetadata, Lesson } from './data';

type Page = 'home' | 'astronomy' | 'physics' | 'python' | 'experiment';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedLesson, setSelectedLesson] = useState<{ subject: string, id: number } | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Record<string, Record<number, boolean>>>({
    astronomy: {},
    physics: {},
    python: {}
  });
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('missionProgress');
    if (saved) {
      try {
        setCompletedLessons(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load progress", e);
      }
    }
    
    addTerminalLine("System initialized...");
    addTerminalLine("Loading lesson database: 600 modules ready.");
    addTerminalLine("Mission Control online.");
    addTerminalLine("Welcome, commander.");
  }, []);

  // Save progress
  const saveProgress = (newProgress: any) => {
    localStorage.setItem('missionProgress', JSON.stringify(newProgress));
  };

  const addTerminalLine = (line: string) => {
    setTerminalLines(prev => [...prev.slice(-4), `> ${line}`]);
  };

  const toggleLesson = (subject: string, id: number) => {
    setCompletedLessons(prev => {
      const subjectProgress = { ...prev[subject] };
      const newState = !subjectProgress[id];
      if (newState) {
        subjectProgress[id] = true;
        addTerminalLine(`Lesson completed: ${subjectMetadata[subject as keyof typeof subjectMetadata].title} #${id}`);
      } else {
        delete subjectProgress[id];
      }
      const nextProgress = { ...prev, [subject]: subjectProgress };
      saveProgress(nextProgress);
      return nextProgress;
    });
  };

  const stats = useMemo(() => {
    return Object.keys(subjectMetadata).map(key => {
      const subject = key as keyof typeof allLessons;
      const completedCount = Object.keys(completedLessons[subject] || {}).length;
      const totalCount = 200; // Total designed
      const percent = Math.round((completedCount / totalCount) * 100);
      return { key, ...subjectMetadata[subject], completedCount, totalCount, percent };
    });
  }, [completedLessons]);

  const dailyMission = useMemo(() => {
    const totalToday = stats.reduce((acc, s) => acc + s.completedCount, 0);
    const target = 3;
    const progress = Math.min(100, (totalToday % target / target) * 100);
    return { count: totalToday % target, target, percent: progress };
  }, [stats]);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setSelectedLesson(null);
    setIsMenuOpen(false);
    addTerminalLine(`Navigating to ${page.toUpperCase()} sector...`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="scanline" />
      
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/50 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigateTo('home')}
          >
            <Rocket className="text-cyan-400 group-hover:animate-bounce" />
            <h1 className="text-xl font-bold tracking-tighter text-cyan-300 terminal-text">COSMIC MISSION CONTROL</h1>
          </div>
          
          <div className="hidden md:flex gap-6 items-center">
            {Object.keys(subjectMetadata).map(key => {
              const s = subjectMetadata[key as keyof typeof subjectMetadata];
              return (
                <button 
                  key={key}
                  onClick={() => navigateTo(key as Page)}
                  className={`text-sm tracking-widest hover:text-cyan-400 transition-colors uppercase ${currentPage === key ? 'text-cyan-300 font-bold' : 'text-cyan-600'}`}
                >
                  {s.title}
                </button>
              );
            })}
            <button 
              onClick={() => navigateTo('experiment')}
              className={`text-sm tracking-widest hover:text-cyan-400 transition-colors uppercase ${currentPage === 'experiment' ? 'text-cyan-300 font-bold' : 'text-cyan-600'}`}
            >
              Experiments
            </button>
          </div>

          <button className="md:hidden text-cyan-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-slate-900 pt-20 p-6 flex flex-col gap-6"
          >
            {Object.keys(subjectMetadata).map(key => (
              <button 
                key={key}
                onClick={() => navigateTo(key as Page)}
                className="text-2xl text-cyan-400 text-left uppercase tracking-widest border-b border-cyan-900 pb-2"
              >
                {subjectMetadata[key as keyof typeof subjectMetadata].title}
              </button>
            ))}
            <button 
              onClick={() => navigateTo('experiment')}
              className="text-2xl text-cyan-400 text-left uppercase tracking-widest border-b border-cyan-900 pb-2"
            >
              Experiments
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              {/* Terminal System */}
              <div className="bg-slate-950/90 border border-cyan-600 p-4 rounded font-mono text-sm overflow-hidden h-32 relative">
                <div className="flex items-center gap-2 mb-2 text-cyan-800 border-b border-cyan-900 pb-1 uppercase text-xs">
                  <TerminalIcon size={12} /> System Terminal v4.0
                </div>
                {terminalLines.map((line, i) => (
                  <div key={i} className="text-green-500 opacity-90">{line}</div>
                ))}
                <div className="absolute bottom-2 right-4 text-cyan-900 text-[10px] animate-pulse">UPTIME: 100% | CORES: OPTIMAL</div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Daily Mission Card */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="pod double-border p-6 shadow-2xl shadow-cyan-900/20">
                    <div className="flex items-center justify-between mb-4 border-b border-cyan-900 pb-2 text-cyan-400 font-bold uppercase tracking-widest text-xs">
                      <span>Target: Daily 3</span>
                      <LayoutDashboard size={14} />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-accent terminal-text">🎯 CURRENT MISSION</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>BATTLE DATA SYNC</span>
                        <span>{dailyMission.count}/{dailyMission.target} DONE</span>
                      </div>
                      <div className="h-4 bg-slate-900 border border-cyan-900 p-0.5">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000" 
                          style={{ width: `${dailyMission.percent}%` }}
                        />
                      </div>
                      <div className="bg-cyan-950/20 p-4 border border-cyan-900/50 rounded gap-2 flex flex-col">
                        <div className="flex items-center gap-2 text-sm text-cyan-100">
                          <CheckCircle2 size={16} className={dailyMission.count >= 1 ? "text-green-500" : "text-slate-700"} />
                          Astronomy Study
                        </div>
                        <div className="flex items-center gap-2 text-sm text-cyan-100">
                          <CheckCircle2 size={16} className={dailyMission.count >= 2 ? "text-green-500" : "text-slate-700"} />
                          Physics Principles
                        </div>
                        <div className="flex items-center gap-2 text-sm text-cyan-100">
                          <CheckCircle2 size={16} className={dailyMission.count >= 3 ? "text-green-500" : "text-slate-700"} />
                          Python Integration
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pod glow-border p-6 bg-slate-900/40">
                    <h3 className="text-sm font-bold mb-4 text-cyan-500 uppercase tracking-widest">📡 COMM-LINK FEED</h3>
                    <div className="text-xs space-y-4 text-cyan-200/70 italic leading-relaxed">
                      <p>"Why don't planets fall into the sun?"</p>
                      <p className="not-italic text-cyan-500 font-bold ml-4">— TRANSMISSION INTERRUPTED —</p>
                      <button className="w-full mt-4 py-2 border border-cyan-800 text-cyan-600 hover:bg-cyan-900/20 transition-colors uppercase tracking-[0.2em] text-[10px]">
                        Access Archive
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Progress & Nav */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.map(s => (
                      <motion.div 
                        key={s.key}
                        whileHover={{ y: -5 }}
                        onClick={() => navigateTo(s.key as Page)}
                        className="pod double-border p-5 cursor-pointer group bg-slate-900/40 relative overflow-hidden"
                      >
                        <div className="absolute -top-4 -right-4 text-cyan-900 opacity-10 group-hover:opacity-20 transition-opacity">
                           <span className="text-8xl">{s.icon}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-3xl">{s.icon}</span>
                          <ChevronRight className="text-cyan-800 group-hover:text-cyan-400 transition-colors" />
                        </div>
                        <h4 className="font-bold text-lg text-cyan-100 mb-1 group-hover:text-cyan-400 transition-colors uppercase">{s.title}</h4>
                        <div className="text-[10px] text-cyan-600 mb-3 tracking-[0.1em]">{s.completedCount}/{s.totalCount} CRYSTAL SYNCED</div>
                        <div className="h-1 bg-slate-950">
                          <div className="h-full bg-cyan-500" style={{ width: `${s.percent}%` }} />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pod glow-border p-8 bg-gradient-to-br from-slate-900/60 to-cyan-950/20">
                    <h2 className="text-2xl font-bold mb-6 text-accent terminal-text uppercase tracking-tighter">🌌 FLIGHT READINESS ROADMAP</h2>
                    <div className="grid md:grid-cols-3 gap-8 relative">
                      {[
                        { title: 'LAUNCH', color: 'text-green-500', items: ['10 Lessons each', 'First Simulation', 'Data Log'] },
                        { title: 'ORBIT', color: 'text-yellow-500', items: ['50 Lessons each', 'System Model', 'Group Study'] },
                        { title: 'DEEP SPACE', color: 'text-orange-500', items: ['All 600 Modules', 'Discovery Paper', 'Mastery'] },
                      ].map((phase, i) => (
                        <div key={phase.title} className="relative z-10">
                          <div className={`text-[10px] ${phase.color} font-bold mb-2 tracking-widest`}>PHASE {i+1}</div>
                          <h4 className="font-bold text-lg mb-4 text-cyan-100">{phase.title}</h4>
                          <ul className="text-xs space-y-3 text-cyan-400/70">
                            {phase.items.map(item => <li key={item} className="flex gap-2 items-start"><CheckCircle2 size={12} className="mt-0.5 flex-shrink-0 text-cyan-800" /> {item}</li>)}
                          </ul>
                        </div>
                      ))}
                      {/* Connection Lines */}
                      <div className="hidden md:block absolute top-[4.5rem] left-0 right-0 h-[1px] bg-cyan-900 -z-0" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Subject Pages */}
          {(['astronomy', 'physics', 'python'] as Page[]).includes(currentPage) && !selectedLesson && (
            <motion.div 
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between border-b-2 border-cyan-500/30 pb-4 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{subjectMetadata[currentPage as keyof typeof subjectMetadata].icon}</span>
                  <div>
                    <h1 className="text-4xl font-bold text-accent tracking-tighter uppercase terminal-text">
                      {subjectMetadata[currentPage as keyof typeof subjectMetadata].title}
                    </h1>
                    <p className="text-cyan-700 text-sm tracking-widest uppercase">System Library • 200 Modules Loaded</p>
                  </div>
                </div>
                <button onClick={() => navigateTo('home')} className="text-xs text-cyan-700 hover:text-cyan-400 flex items-center gap-1 uppercase tracking-widest border border-cyan-900 px-3 py-1">
                  ↵ Exit Sector
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(subjectMetadata[currentPage as keyof typeof subjectMetadata].levels).map((level, levelIdx) => (
                  <div key={level.name} className="space-y-4">
                    <div className="bg-slate-900/60 p-3 border-l-4 border-cyan-400 flex justify-between items-center">
                      <div>
                        <div className="text-[10px] text-cyan-600 font-bold uppercase">Level {levelIdx+1}</div>
                        <div className="text-sm font-bold text-cyan-100 uppercase tracking-tighter">{level.name}</div>
                      </div>
                      {levelIdx > 0 && Object.keys(completedLessons[currentPage] || {}).length < levelIdx * 25 ? <Lock size={16} className="text-slate-700" /> : null}
                    </div>
                    <div className="h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="space-y-2">
                        {Array.from({ length: 50 }, (_, i) => {
                          const id = (levelIdx * 50) + i + 1;
                          const lesson = allLessons[currentPage as keyof typeof allLessons][id];
                          const isUnlocked = levelIdx === 0 || Object.keys(completedLessons[currentPage] || {}).length >= levelIdx * 25;
                          
                          if (!lesson) return null;

                          return (
                            <div 
                              key={id} 
                              className={`p-3 border flex items-center gap-3 group transition-all rounded shadow-sm ${
                                isUnlocked 
                                ? 'border-cyan-900 bg-slate-900/20 hover:border-cyan-500 cursor-pointer' 
                                : 'border-slate-800 bg-slate-950 opacity-40 grayscale cursor-not-allowed'
                              }`}
                              onClick={() => isUnlocked && setSelectedLesson({ subject: currentPage, id })}
                            >
                              <div 
                                className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
                                  completedLessons[currentPage]?.[id] 
                                  ? 'bg-green-500 border-green-500' 
                                  : 'border-cyan-800 group-hover:border-cyan-400'
                                }`}
                                onClick={(e) => {
                                  if (isUnlocked) {
                                    e.stopPropagation();
                                    toggleLesson(currentPage, id);
                                  }
                                }}
                              >
                                {completedLessons[currentPage]?.[id] && <CheckCircle2 size={12} className="text-slate-900" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[10px] text-cyan-700 font-bold">MOD {id.toString().padStart(3, '0')}</div>
                                <div className="text-sm truncate text-cyan-100 group-hover:text-cyan-400">{lesson.title}</div>
                              </div>
                              <ChevronRight size={14} className="text-cyan-900 group-hover:text-cyan-400" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Lesson Viewer */}
          {selectedLesson && (
            <motion.div 
              key={`${selectedLesson.subject}-${selectedLesson.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto space-y-6"
            >
               <div className="flex items-center gap-4 mb-2">
                <button 
                  onClick={() => setSelectedLesson(null)} 
                  className="p-2 bg-slate-900 border border-cyan-800 text-cyan-400 hover:border-cyan-400 rounded-full transition-all"
                >
                  <ChevronRight className="rotate-180" />
                </button>
                <div className="text-xs tracking-[0.3em] font-bold text-cyan-600 uppercase">
                  {selectedLesson.subject} • DATA LOG #{selectedLesson.id.toString().padStart(3, '0')}
                </div>
              </div>

              <div className="pod double-border p-8 bg-slate-900/60 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <span className="text-[12rem]">{subjectMetadata[selectedLesson.subject as keyof typeof subjectMetadata].icon}</span>
                </div>
                
                <h1 className="text-4xl font-bold text-cyan-100 mb-4 terminal-text uppercase leading-tight">
                  {allLessons[selectedLesson.subject as keyof typeof allLessons][selectedLesson.id].title}
                </h1>
                
                <div className="space-y-8 relative z-10">
                  <section>
                    <h3 className="text-accent font-bold uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                       <BookOpen size={14} /> Brief Definition
                    </h3>
                    <div className="p-4 bg-cyan-500/10 border-l-2 border-accent text-cyan-100 text-lg leading-relaxed italic">
                      {allLessons[selectedLesson.subject as keyof typeof allLessons][selectedLesson.id].definition}
                    </div>
                  </section>

                  <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <div>
                        <h3 className="text-cyan-500 font-bold uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                          <TerminalIcon size={14} /> Technical Explanation
                        </h3>
                        <p className="text-cyan-100 text-sm leading-relaxed text-justify">
                          {allLessons[selectedLesson.subject as keyof typeof allLessons][selectedLesson.id].explanation}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-green-500 font-bold uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                          <CheckCircle2 size={14} /> Real World Examples
                        </h3>
                        <div 
                          className="bg-green-950/20 p-4 border border-green-900 rounded text-sm text-green-100/80 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: allLessons[selectedLesson.subject as keyof typeof allLessons][selectedLesson.id].examples }}
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="pod glow-border p-6 bg-slate-950/50">
                        <h3 className="text-yellow-500 font-bold uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                          <Lightbulb size={14} /> Cognitive Link (Understanding)
                        </h3>
                        <p className="text-yellow-100/90 text-sm leading-relaxed italic">
                           {allLessons[selectedLesson.subject as keyof typeof allLessons][selectedLesson.id].understanding}
                        </p>
                      </div>
                      
                      <div className="pod border-dashed border-cyan-800 p-6 bg-slate-900/60">
                        <h3 className="text-cyan-400 font-bold uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                          <FlaskConical size={14} /> Mission Exercise
                        </h3>
                        <p className="text-cyan-100/80 text-sm leading-relaxed border-t border-cyan-900 pt-3">
                          {allLessons[selectedLesson.subject as keyof typeof allLessons][selectedLesson.id].exercise}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Knowledge Assessment */}
                  <section className="mt-12 bg-slate-950/80 p-8 border-t border-cyan-500/50 rounded-b">
                    <h3 className="text-accent font-bold uppercase text-xs tracking-widest mb-6 text-center underline underline-offset-8">
                       Knowledge Sync Validation (Quiz)
                    </h3>
                    <div className="max-w-2xl mx-auto space-y-6 text-center">
                      <p className="text-xl text-cyan-50 terminal-text font-bold leading-snug">
                         {allLessons[selectedLesson.subject as keyof typeof allLessons][selectedLesson.id].question}
                      </p>
                      
                      <div className="flex flex-col items-center gap-4">
                        <LessonQuiz 
                          hint={allLessons[selectedLesson.subject as keyof typeof allLessons][selectedLesson.id].hint}
                          answer={allLessons[selectedLesson.subject as keyof typeof allLessons][selectedLesson.id].correctAnswer}
                          onComplete={() => toggleLesson(selectedLesson.subject, selectedLesson.id)}
                          isCompleted={completedLessons[selectedLesson.subject]?.[selectedLesson.id]}
                        />
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          )}

          {/* Experiment Bay */}
          {currentPage === 'experiment' && (
            <motion.div 
              key="experiment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="mission-control-header glow-border">
                <h1>🔬 EXPERIMENT BAY</h1>
                <div className="status tracking-widest uppercase">LABORATORY LOGBOOK</div>
              </div>

              <div className="pod double-border p-8 bg-slate-900/60 space-y-8">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest mb-2 block">Project Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g., INVESTIGATING ORBITAL MECHANICS"
                      className="w-full bg-slate-950 border border-cyan-900 p-3 text-cyan-100 focus:border-cyan-400 outline-none transition-all font-bold"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest mb-2 block">Research Keywords & Background</label>
                        <textarea 
                          className="w-full h-24 bg-slate-950 border border-cyan-900 p-3 text-cyan-100 focus:border-cyan-400 outline-none transition-all resize-none"
                          placeholder="List key scientific principles and relevant background study notes..."
                        ></textarea>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest mb-2 block">Initial Hypothesis</label>
                          <textarea 
                            className="w-full h-24 bg-slate-950 border border-cyan-900 p-3 text-cyan-100 focus:border-cyan-400 outline-none transition-all resize-none"
                            placeholder="I hypothesize that..."
                          ></textarea>
                        </div>
                        <div>
                          <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest mb-2 block">Equipment Manifest</label>
                          <textarea 
                            className="w-full h-24 bg-slate-950 border border-cyan-900 p-3 text-cyan-100 focus:border-cyan-400 outline-none transition-all resize-none"
                            placeholder="• Python SDK..."
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest mb-2 block">Procedure / Methodology Steps</label>
                      <textarea 
                        className="w-full h-40 bg-slate-950 border border-cyan-900 p-3 text-cyan-100 focus:border-cyan-400 outline-none transition-all resize-none font-mono text-xs leading-relaxed"
                        placeholder="Step 1: Set up...&#10;Step 2: Collect data..."
                      ></textarea>
                    </div>

                    <div className="bg-cyan-900/10 p-6 border border-cyan-900 rounded">
                      <label className="text-[10px] text-accent font-bold uppercase tracking-widest mb-4 block">Observation Data Table</label>
                      <div className="grid grid-cols-4 gap-4">
                        {['TRIAL #', 'INDEPENDENT VAR', 'DEPENDENT VAR', 'DEVIATION'].map(header => (
                          <div key={header} className="p-3 bg-slate-950 border border-cyan-900 text-center font-bold text-cyan-600 text-[9px] tracking-widest">{header}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-4 gap-4 mt-2">
                        {Array.from({length: 4}).map((_, i) => (
                          <div key={i} className="contents">
                              <input className="bg-transparent border border-cyan-950 p-2 text-center text-xs text-cyan-200" placeholder={`0${i+1}`} />
                              <input className="bg-transparent border border-cyan-950 p-2 text-center text-xs text-cyan-200" placeholder="---" />
                              <input className="bg-transparent border border-cyan-950 p-2 text-center text-xs text-cyan-200" placeholder="---" />
                              <input className="bg-transparent border border-cyan-950 p-2 text-center text-xs text-cyan-200" placeholder="± 0.0" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest mb-2 block">Statistical Analysis</label>
                        <textarea 
                          className="w-full h-32 bg-slate-950 border border-cyan-900 p-3 text-cyan-100 focus:border-cyan-400 outline-none transition-all resize-none"
                          placeholder="Calculate mean, median..."
                        ></textarea>
                      </div>
                      <div>
                        <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest mb-2 block">Final Conclusion</label>
                        <textarea 
                          className="w-full h-32 bg-slate-950 border border-cyan-900 p-3 text-cyan-100 focus:border-cyan-400 outline-none transition-all resize-none"
                          placeholder="Based on observations..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-cyan-900 justify-end">
                  <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-red-900 text-red-500 hover:bg-red-900/20 transition-all font-bold tracking-widest text-xs uppercase">
                    <RotateCcw size={14} /> Purge Log
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-cyan-500 text-cyan-400 hover:bg-cyan-900 transition-all font-bold tracking-widest text-xs uppercase">
                    <Save size={14} /> Commit Entry
                  </button>
                  <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-slate-900 hover:bg-cyan-400 transition-all font-bold tracking-widest text-xs uppercase">
                    <Printer size={14} /> Print Report
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer System Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 border-t border-cyan-900 p-2 flex justify-center gap-2 z-50">
        <button 
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center p-2 min-w-[70px] rounded transition-all ${currentPage === 'home' ? 'text-cyan-300' : 'text-cyan-900 hover:text-cyan-700'}`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] uppercase tracking-tighter">Status</span>
        </button>
        {Object.keys(subjectMetadata).map(key => (
          <button 
            key={key}
            onClick={() => navigateTo(key as Page)}
            className={`flex flex-col items-center p-2 min-w-[70px] rounded transition-all ${currentPage === key ? 'text-cyan-300' : 'text-cyan-900 hover:text-cyan-700'}`}
          >
            <span className="text-xl mb-1">{subjectMetadata[key as keyof typeof subjectMetadata].icon}</span>
            <span className="text-[10px] uppercase tracking-tighter truncate max-w-[60px]">{subjectMetadata[key as keyof typeof subjectMetadata].title.split(' ')[0]}</span>
          </button>
        ))}
        <button 
          onClick={() => navigateTo('experiment')}
          className={`flex flex-col items-center p-2 min-w-[70px] rounded transition-all ${currentPage === 'experiment' ? 'text-cyan-300' : 'text-cyan-900 hover:text-cyan-700'}`}
        >
          <FlaskConical size={20} />
          <span className="text-[10px] uppercase tracking-tighter">Lab</span>
        </button>
      </div>
    </div>
  );
}

function LessonQuiz({ hint, answer, onComplete, isCompleted }: { 
  hint: string, 
  answer: string, 
  onComplete: () => void,
  isCompleted?: boolean 
}) {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex gap-4">
        <button 
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 px-4 py-2 border border-yellow-900 text-yellow-600 hover:text-yellow-400 text-xs uppercase tracking-widest transition-all"
        >
          <HelpCircle size={14} /> {showHint ? "Hide Hint" : "Request Hint"}
        </button>
        <button 
          onClick={() => setShowAnswer(!showAnswer)}
          className={`flex items-center gap-2 px-6 py-2 border transition-all text-xs uppercase tracking-widest font-bold ${
            showAnswer 
            ? 'border-cyan-400 bg-cyan-400 text-slate-900' 
            : 'border-cyan-900 text-cyan-600 hover:border-cyan-400'
          }`}
        >
          {showAnswer ? "Secure Data" : "Validate Logic"}
        </button>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full overflow-hidden bg-yellow-950/10 border border-yellow-900/50 p-4 rounded text-sm text-yellow-200/70"
          >
            <strong>SENSOR TIP:</strong> {hint}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAnswer && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full bg-cyan-900/20 border border-cyan-500 p-6 rounded"
          >
            <div className="text-xs text-cyan-500 font-bold uppercase mb-2">Core Processor Result:</div>
            <p className="text-cyan-100 text-lg leading-relaxed">{answer}</p>
            
            <button 
              onClick={() => {
                onComplete();
                setShowAnswer(false);
              }}
              className={`mt-6 w-full py-4 font-bold border-2 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 ${
                isCompleted 
                ? 'bg-green-500 border-green-500 text-slate-900' 
                : 'border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900'
              }`}
            >
              {isCompleted ? <><CheckCircle2 size={18} /> Lesson Certified</> : "Mark Module Complete"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
