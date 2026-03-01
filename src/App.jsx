import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactFlow, { Background, Controls, Handle, Position } from 'react-flow-renderer';
import { BookOpen, Map as MapIcon, Brain, Zap, ChevronRight, Upload, X, Award } from 'lucide-react';

// --- COMPONENTS ---

const CustomNode = ({ data }) => {
  return (
    <div className={`p-4 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer
      ${data.completed ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' : 'bg-slate-800/60 border-indigo-500/50 text-indigo-100'}
    `}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-white/50" />
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${data.completed ? 'bg-emerald-500/20' : 'bg-indigo-500/20'}`}>
          {data.completed ? <Award size={16} className="text-emerald-400" /> : <Zap size={16} className="text-indigo-400" />}
        </div>
        <div>
          <h3 className="font-bold text-sm tracking-wide">{data.label}</h3>
          <p className="text-xs opacity-70">{data.type}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-white/50" />
    </div>
  );
};

const BattleMode = ({ concept, onClose, onComplete }) => {
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20">
        <div className="p-6 flex justify-between items-center border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded">LVL 1 BOSS</span>
            <h2 className="text-xl font-bold text-white">{concept.label}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-12 flex flex-col items-center justify-center min-h-[400px] perspective">
          <motion.div 
            className="relative w-full h-80 cursor-pointer group preserve-3d"
            onClick={() => setFlipped(!flipped)}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 flex flex-col items-center justify-center p-8 shadow-xl">
              <Brain size={48} className="text-indigo-500 mb-6 opacity-50" />
              <h3 className="text-3xl font-bold text-white text-center mb-4">What is {concept.label}?</h3>
              <p className="text-slate-400 text-sm uppercase tracking-widest">Tap to Reveal Definition</p>
            </div>

            <div className="absolute inset-0 backface-hidden bg-slate-800 rounded-2xl border border-indigo-500/30 flex flex-col items-center justify-center p-8 shadow-xl" style={{ transform: "rotateY(180deg)" }}>
              <p className="text-lg text-slate-200 leading-relaxed text-center">
                {concept.content}
              </p>
              <div className="mt-8 flex gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); setScore(0); }}
                  className="px-6 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
                >
                  Missed It
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setScore(100); }}
                  className="px-6 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition"
                >
                  Mastered It
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="p-6 bg-slate-900/50 border-t border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              />
            </div>
            <span className="text-xs text-slate-400">XP Gained</span>
          </div>
          <button 
            onClick={() => onComplete(concept.id)}
            className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2"
          >
            Continue <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function LuminaApp() {
  const [view, setView] = useState('upload');
  const [bookTitle, setBookTitle] = useState('');
  const [activeConcept, setActiveConcept] = useState(null);
  const [completedNodes, setCompletedNodes] = useState([]);

  const initialNodes = [
    { id: '1', type: 'custom', position: { x: 250, y: 50 }, data: { label: 'The Hero', type: 'Core Concept', completed: false, content: 'The protagonist of the story who seeks transformation.' } },
    { id: '2', type: 'custom', position: { x: 100, y: 200 }, data: { label: 'The Mentor', type: 'Archetype', completed: false, content: 'A guide who provides the hero with tools and wisdom.' } },
    { id: '3', type: 'custom', position: { x: 400, y: 200 }, data: { label: 'The Threshold', type: 'Plot Point', completed: false, content: 'The point of no return where the hero enters the new world.' } },
    { id: '4', type: 'custom', position: { x: 250, y: 350 }, data: { label: 'The Ordeal', type: 'Climax', completed: false, content: 'The central crisis where the hero faces their greatest fear.' } },
  ];

  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#6366f1' } },
    { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#6366f1' } },
    { id: 'e2-4', source: '2', target: '4', style: { stroke: '#6366f1' } },
    { id: 'e3-4', source: '3', target: '4', style: { stroke: '#6366f1' } },
  ];

  const handleUpload = (e) => {
    e.preventDefault();
    setBookTitle("The Hero's Journey");
    setView('map');
  };

  const handleNodeClick = (event, node) => {
    if (!node.data.completed) {
      setActiveConcept(node.data);
      setView('battle');
    }
  };

  const handleBattleComplete = (id) => {
    setCompletedNodes(prev => [...prev, id]);
    setView('map');
    setActiveConcept(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 flex justify-between items-center p-6 border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
          <span className="font-bold text-lg tracking-tight text-white">Lumina</span>
        </div>
        {view !== 'upload' && (
          <div className="flex items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2 text-indigo-400">
              <Award size={16} />
              <span>XP: {completedNodes.length * 100}</span>
            </div>
            <div className="w-px h-4 bg-white/10"></div>
            <span className="text-slate-400">{bookTitle}</span>
          </div>
        )}
      </nav>

      <main className="relative z-10 h-[calc(100vh-80px)] w-full">
        {view === 'upload' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-4"
          >
            <h1 className="text-5xl font-bold text-white mb-6 text-center leading-tight">
              Turn any book into a <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Knowledge RPG</span>
            </h1>
            <p className="text-slate-400 text-lg mb-10 text-center">
              Upload a PDF or EPUB. We'll map the concepts, generate the lore, and turn memorization into a game.
            </p>
            
            <form onSubmit={handleUpload} className="w-full">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-slate-900 ring-1 ring-gray-900/5 rounded-xl leading-none flex items-top justify-start space-x-6 p-8">
                  <div className="space-y-4 w-full">
                    <div className="border-2 border-dashed border-slate-700 rounded-lg p-10 flex flex-col items-center justify-center text-center hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all cursor-pointer">
                      <Upload size={48} className="text-slate-600 mb-4" />
                      <p className="text-slate-300 font-medium">Drop your book here</p>
                      <p className="text-slate-500 text-sm mt-2">Supports PDF, EPUB, TXT</p>
                    </div>
                    <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-indigo-50 transition-colors flex justify-center items-center gap-2">
                      Start Adventure <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {view === 'map' && (
          <ReactFlow
            nodes={initialNodes.map(n => ({
              ...n, 
              data: { ...n.data, completed: completedNodes.includes(n.id) }
            }))}
            edges={initialEdges}
            nodeTypes={{ custom: CustomNode }}
            onNodeClick={handleNodeClick}
            fitView
            attributionPosition="bottom-right"
            className="bg-slate-950"
          >
            <Background color="#334155" gap={20} size={1} />
            <Controls className="bg-slate-800 border-slate-700 text-white" />
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur p-4 rounded-xl border border-slate-700 max-w-xs">
              <h3 className="font-bold text-white mb-1">Quest Log</h3>
              <p className="text-xs text-slate-400">Explore the nodes to unlock knowledge. Complete nodes to gain XP.</p>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/20">
                  {completedNodes.length} / {initialNodes.length} Mastered
                </span>
              </div>
            </div>
          </ReactFlow>
        )}

        <AnimatePresence>
          {view === 'battle' && activeConcept && (
            <BattleMode 
              concept={activeConcept} 
              onClose={() => setView('map')}
              onComplete={handleBattleComplete}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
