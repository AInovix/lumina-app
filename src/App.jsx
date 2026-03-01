import React, { useState, useRef } from 'react';
import ReactFlow, { Background, Controls, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { Upload, X, Brain, Trophy, BookOpen, Sparkles, CheckCircle, Play } from 'lucide-react';

const CustomNode = ({ data }) => (
  <div className={`p-4 rounded-xl border-2 shadow-lg cursor-pointer ${data.completed ? 'bg-emerald-900/60 border-emerald-400' : 'bg-indigo-900/60 border-indigo-400'}`}>
    <Handle type="target" position={Position.Top} className="w-2 h-2 bg-white" />
    <div className="flex items-center gap-2">
      {data.completed ? <CheckCircle size={16} className="text-emerald-400" /> : <Brain size={16} className="text-indigo-400" />}
      <div>
        <p className="font-bold text-sm text-white">{data.label}</p>
        <p className="text-xs opacity-70 text-slate-300">{data.xp} XP</p>
      </div>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-white" />
  </div>
);

export default function LuminaApp() {
  const [view, setView] = useState('upload');
  const [bookTitle, setBookTitle] = useState('');
  const [completedNodes, setCompletedNodes] = useState([]);
  const [playerXP, setPlayerXP] = useState(0);
  const [activeNode, setActiveNode] = useState(null);
  const fileInputRef = useRef(null);

  // Demo book data
  const demoNodes = [
    { id: '1', type: 'custom', position: { x: 250, y: 50 },  { label: 'The Hero', type: 'Core', rarity: 'legendary', xp: 500, completed: false, content: 'The protagonist who transforms through adventure.' } },
    { id: '2', type: 'custom', position: { x: 100, y: 200 },  { label: 'The Mentor', type: 'Archetype', rarity: 'epic', xp: 300, completed: false, content: 'Wise guide who provides tools and wisdom.' } },
    { id: '3', type: 'custom', position: { x: 400, y: 200 },  { label: 'The Threshold', type: 'Plot', rarity: 'rare', xp: 200, completed: false, content: 'Point of no return into the special world.' } },
    { id: '4', type: 'custom', position: { x: 250, y: 350 },  { label: 'The Ordeal', type: 'Climax', rarity: 'legendary', xp: 500, completed: false, content: 'Central crisis where hero faces greatest fear.' } },
  ];
  const demoEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3', animated: true },
    { id: 'e2-4', source: '2', target: '4' },
    { id: 'e3-4', source: '3', target: '4' },
  ];

  const handleDemo = () => {
    setBookTitle("The Hero's Journey");
    setView('map');
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBookTitle(file.name.replace(/\.[^/.]+$/, ''));
      setView('map'); // Skip AI for now - just show demo map
    }
  };

  const handleNodeClick = (_, node) => {
    if (!node.data.completed) {
      setActiveNode(node.data);
    }
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect && activeNode && !completedNodes.includes(activeNode.id)) {
      setCompletedNodes(prev => [...prev, activeNode.id]);
      setPlayerXP(prev => prev + activeNode.xp);
    }
    setActiveNode(null);
  };

  const flowNodes = demoNodes.map(n => ({
    ...n,
     { ...n.data, completed: completedNodes.includes(n.id) }
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg">Lumina</h1>
            <p className="text-xs text-slate-400">Free AI Learning</p>
          </div>
        </div>
        {view !== 'upload' && (
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-xl">
            <Trophy size={16} className="text-yellow-400" />
            <span className="font-mono font-bold">{playerXP} XP</span>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="relative z-10 h-[calc(100vh-80px)] flex items-center justify-center p-4">
        
        {/* UPLOAD VIEW */}
        {view === 'upload' && (
          <div className="text-center max-w-2xl">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-6">
                <Sparkles size={14} className="text-emerald-400" />
                <span className="text-sm text-emerald-300">100% Free • No API Key</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">
                Turn Books into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Learning Games</span>
              </h2>
              <p className="text-slate-400 text-lg">Upload a text file or try the demo</p>
            </div>

            {/* Upload Box */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600 rounded-2xl p-12 cursor-pointer hover:border-indigo-400 hover:bg-slate-800/50 transition-all mb-6"
            >
              <Upload size={48} className="text-indigo-400 mx-auto mb-4" />
              <p className="font-bold text-white">Drop your book here</p>
              <p className="text-slate-400 text-sm">or click to browse</p>
              <div className="flex justify-center gap-2 mt-4">
                <span className="px-3 py-1 bg-slate-700 rounded-lg text-xs">.txt</span>
                <span className="px-3 py-1 bg-slate-700 rounded-lg text-xs">.md</span>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept=".txt,.md" onChange={handleFile} className="hidden" />

            {/* DEMO BUTTON - THIS IS WHAT YOU WERE MISSING */}
            <button
              onClick={handleDemo}
              className="w-full max-w-md py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"
            >
              <Play size={18} /> Try Demo Book (No Upload Needed)
            </button>
          </div>
        )}

        {/* MAP VIEW */}
        {view === 'map' && (
          <ReactFlow
            nodes={flowNodes}
            edges={demoEdges}
            nodeTypes={{ custom: CustomNode }}
            onNodeClick={handleNodeClick}
            fitView
            className="bg-transparent"
          >
            <Background color="#475569" gap={25} size={1} />
            <Controls className="bg-slate-800 border-slate-600 text-white rounded-lg" />
            <div className="absolute top-4 left-4 bg-slate-900/90 p-4 rounded-xl border border-slate-700">
              <p className="font-bold text-white mb-2">Progress</p>
              <p className="text-sm text-slate-400">{completedNodes.length}/{demoNodes.length} mastered</p>
              <button onClick={() => setView('upload')} className="mt-3 text-sm text-indigo-400 hover:text-indigo-300">
                ← Upload New Book
              </button>
            </div>
          </ReactFlow>
        )}

        {/* BATTLE MODAL */}
        {activeNode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-slate-900 border border-indigo-500/30 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Brain size={18} className="text-indigo-400" />
                  {activeNode.label}
                </h3>
                <button onClick={() => setActiveNode(null)} className="p-2 hover:bg-slate-700 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              <p className="text-slate-300 mb-6">{activeNode.content}</p>
              <p className="text-sm text-slate-400 mb-4">Did you understand this concept?</p>
              <div className="flex gap-3">
                <button onClick={() => handleAnswer(false)} className="flex-1 py-3 bg-red-500/20 text-red-300 border border-red-500/40 rounded-xl hover:bg-red-500/30 transition">
                  Need Review
                </button>
                <button onClick={() => handleAnswer(true)} className="flex-1 py-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl hover:bg-emerald-500/30 transition">
                  ✅ Mastered! +{activeNode.xp} XP
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
