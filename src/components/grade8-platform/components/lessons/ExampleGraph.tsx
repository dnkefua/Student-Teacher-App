import React, { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ReferenceLine,
  ReferenceDot,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

function EnglishUnit1Visual() {
  const [activeTech, setActiveTech] = useState<string | null>(null);

  const techniques = [
    { id: 'alliteration', name: "Alliteration", description: "Repeating consonant sounds to make a phrase memorable.", excerpt: "Don't just dream it, **d**rive the **d**ream.", color: "text-amber-500", bg: "bg-amber-100", border: "border-amber-500", pin: { top: '70%', left: '20%' } },
    { id: 'facts', name: "Facts", description: "Using demonstrable truths to build credibility.", excerpt: "Tested and proven to remove **99.9% of bacteria**.", color: "text-rose-500", bg: "bg-rose-100", border: "border-rose-500", pin: { top: '45%', left: '25%' } },
    { id: 'opinions', name: "Opinions", description: "Presenting beliefs as indisputable to sway the consumer.", excerpt: "Simply the **greatest smartphone ever created**.", color: "text-orange-500", bg: "bg-orange-100", border: "border-orange-500", pin: { top: '30%', left: '80%' } },
    { id: 'rhetorical', name: "Rhetorical questions", description: "Asking a question to make the audience think, rather than expecting an answer.", excerpt: "**Are you ready to change your life today?**", color: "text-indigo-500", bg: "bg-indigo-100", border: "border-indigo-500", pin: { top: '75%', left: '75%' } },
    { id: 'emotive', name: "Emotive language", description: "Choosing words specifically to trigger an emotional response.", excerpt: "Help these **desperate, starving** animals find a home.", color: "text-emerald-500", bg: "bg-emerald-100", border: "border-emerald-500", pin: { top: '20%', left: '25%' } },
    { id: 'statistics', name: "Statistics", description: "Using numerical data to provide concrete evidence.", excerpt: "**8 out of 10** dentists recommend this toothpaste.", color: "text-cyan-500", bg: "bg-cyan-100", border: "border-cyan-500", pin: { top: '60%', left: '50%' } },
    { id: 'triplets', name: "Triplets", description: "Grouping adjectives or phrases in threes for rhythm and emphasis.", excerpt: "It is **fast, reliable, and affordable**.", color: "text-fuchsia-500", bg: "bg-fuchsia-100", border: "border-fuchsia-500", pin: { top: '25%', left: '50%' } }
  ];

  return (
    <div className="relative w-full aspect-[4/3] max-h-[70vh] md:max-h-[85vh] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 group">
      {/* Base Image */}
      <img 
        src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&auto=format&fit=crop&q=80" 
        alt="Burger Advertisement" 
        className="absolute inset-0 w-full h-full object-cover opacity-60 brightness-50 transition-all duration-700"
        referrerPolicy="no-referrer"
      />
       
      {/* Overlays / Copy for the fake ad */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center text-white drop-shadow-lg pointer-events-none">
          <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter text-amber-400 mb-2">Bite into Bliss!</h2>
          <p className="text-2xl font-bold bg-rose-600 px-4 py-1 inline-block -rotate-2 transform">100% Real Beef.</p>
          <div className="mt-4">
            <p className="text-xl font-medium">Don't you deserve a treat today?</p>
          </div>
      </div>

      {/* Pins / Interactive Elements */}
      {techniques.map((tech) => {
        const isActive = activeTech === tech.id;
        
        return (
          <div 
            key={tech.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: tech.pin.top, left: tech.pin.left, zIndex: isActive ? 50 : 10 }}
          >
            {/* Ping animation when not active */}
            {!isActive && (
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping duration-1000 ${tech.bg}`}></span>
            )}
            
            {/* Core dot */}
            <button
              onMouseEnter={() => setActiveTech(tech.id)}
              onMouseLeave={() => setActiveTech(null)}
              onClick={() => setActiveTech(isActive ? null : tech.id)}
              className={`relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full shadow-lg border-2 ${tech.border} bg-white text-slate-800 font-bold hover:scale-110 transition-transform focus:outline-none`}
            >
               {tech.name.charAt(0)}
            </button>

            {/* Expanding Card (Absolute relative to the pin) */}
            <div className={`absolute left-1/2 -translate-x-1/2 mt-4 w-64 md:w-72 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border-t-4 p-4 transition-all duration-300 origin-top pointer-events-none
              ${tech.border}
              ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 invisible'}
            `}>
               <h4 className={`font-bold text-sm uppercase tracking-wider mb-2 ${tech.color}`}>{tech.name}</h4>
               <p className="text-xs text-slate-600 mb-3">{tech.description}</p>
               
               <div className="bg-slate-100 p-2 rounded border border-slate-200 italic text-xs text-slate-800">
                 "{tech.excerpt.split('**').map((part: string, i: number) => {
                   return i % 2 !== 0 
                     ? <strong key={i} className={`font-black not-italic ${tech.color}`}>{part}</strong> 
                     : <span key={i}>{part}</span>
                 })}"
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EnglishUnit2Visual() {
  const [activeArchetype, setActiveArchetype] = useState<string | null>(null);

  const archetypes = [
    { id: 'protagonist', name: "Protagonist", description: "The central character who drives the action forward.", color: "text-indigo-700", bg: "bg-indigo-100", highlight: "bg-indigo-200" },
    { id: 'antagonist', name: "Antagonist", description: "The character or force that opposes the protagonist.", color: "text-rose-700", bg: "bg-rose-100", highlight: "bg-rose-200" },
    { id: 'dynamic', name: "Dynamic Character", description: "A character who undergoes a major internal change.", color: "text-emerald-700", bg: "bg-emerald-100", highlight: "bg-emerald-200" },
    { id: 'static', name: "Static Character", description: "A character who does not undergo significant change.", color: "text-slate-700", bg: "bg-slate-200", highlight: "bg-slate-300" }
  ];

  const handleInteraction = (id: string) => {
    setActiveArchetype(activeArchetype === id ? null : id);
  };

  return (
    <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-[#fdfbf7] flex flex-col md:flex-row">
      {/* Sidebar with interactive cart/cards for archetypes */}
      <div className="w-full md:w-1/3 bg-white border-r border-slate-200 p-4 overflow-y-auto">
        <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Character Archetypes</h3>
        <p className="text-xs text-slate-500 mb-4">Click a character type to highlight them in the text.</p>
        
        <div className="space-y-3">
          {archetypes.map((arch) => {
            const isActive = activeArchetype === arch.id;
            return (
              <div 
                key={arch.id}
                onClick={() => handleInteraction(arch.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${isActive ? `border-${arch.color.split('-')[1]}-400 shadow-sm ${arch.bg}` : 'border-slate-200 hover:bg-slate-50'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className={`font-bold text-sm ${arch.color}`}>{arch.name}</h4>
                  <div className={`w-3 h-3 rounded-full ${isActive ? arch.color.replace('text', 'bg') : 'bg-slate-300'}`} />
                </div>
                {isActive && (
                  <p className="text-xs text-slate-700 mt-2 animate-in slide-in-from-top-1 fade-in duration-200">{arch.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Text Content */}
      <div className="w-full md:w-2/3 p-6 md:p-10 lg:p-12 overflow-y-auto relative bg-[#fdfbf7]">
        <h1 className="text-2xl md:text-4xl font-serif text-slate-800 mb-8 border-b-2 border-slate-200 pb-4">Excerpt: Chapter 4</h1>
        
        <div className="font-serif text-base md:text-xl text-slate-700 leading-loose md:leading-loose">
          <p className="mb-6 indent-8">
            <span className={`transition-colors duration-300 rounded px-1 ${activeArchetype === 'protagonist' ? 'bg-indigo-200 text-indigo-900 font-bold mix-blend-multiply' : ''}`}>The young inspector</span> stepped into the dimly lit room, his heart pounding a frantic rhythm against his ribs. He knew, with a sudden, <span className={`transition-colors duration-300 rounded px-1 ${activeArchetype === 'dynamic' ? 'bg-emerald-200 text-emerald-900 font-bold mix-blend-multiply' : ''}`}>sinking realization, that his previous assumptions had been entirely wrong.</span>
          </p>
          <p className="indent-8">
            Across the heavy oak desk sat <span className={`transition-colors duration-300 rounded px-1 ${activeArchetype === 'antagonist' ? 'bg-rose-200 text-rose-900 font-bold mix-blend-multiply' : ''}`}>Elias</span>, staring back with cold, calculating eyes. Elias <span className={`transition-colors duration-300 rounded px-1 ${activeArchetype === 'static' ? 'bg-slate-300 text-slate-900 font-bold mix-blend-multiply' : ''}`}>had not moved nor changed his expression</span> since the ordeal began. He was a monolith of defiance, unyielding to the desperate pleas around him.
          </p>
        </div>
        
        {/* Floating instruction if nothing selected */}
        {!activeArchetype && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-800/80 backdrop-blur text-white text-xs px-4 py-2 rounded-full pointer-events-none animate-pulse">
            Select an archetype to highlight
          </div>
        )}
      </div>
    </div>
  );
}

function EnglishUnit3Visual() {
  const [activeDevice, setActiveDevice] = useState<string | null>(null);

  const devices = [
    { id: 'alliteration', name: "Alliteration", description: "Repeating consonant sounds at the beginning of words.", color: "text-amber-700", bg: "bg-amber-100", highlight: "bg-amber-200 text-amber-900 mix-blend-multiply" },
    { id: 'assonance', name: "Assonance", description: "Repeating vowel sounds to create internal rhyming.", color: "text-rose-700", bg: "bg-rose-100", highlight: "bg-rose-200 text-rose-900 mix-blend-multiply" },
    { id: 'sibilance', name: "Sibilance", description: "Repeating 's' or 'sh' sounds for a sweeping or hissing effect.", color: "text-emerald-700", bg: "bg-emerald-100", highlight: "bg-emerald-200 text-emerald-900 mix-blend-multiply" },
    { id: 'onomatopoeia', name: "Onomatopoeia", description: "Words that imitate physical sounds.", color: "text-indigo-700", bg: "bg-indigo-100", highlight: "bg-indigo-200 text-indigo-900 mix-blend-multiply" }
  ];

  const handleInteraction = (id: string) => {
    setActiveDevice(activeDevice === id ? null : id);
  };

  return (
    <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-[#faf9f6] flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 bg-white border-r border-slate-200 p-4 overflow-y-auto">
        <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Poetic Devices</h3>
        <p className="text-xs text-slate-500 mb-4">Click a device to reveal its position in the verse.</p>
        
        <div className="space-y-3">
          {devices.map((dev) => {
            const isActive = activeDevice === dev.id;
            return (
              <div 
                key={dev.id}
                onClick={() => handleInteraction(dev.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${isActive ? `border-${dev.color.split('-')[1]}-400 shadow-sm ${dev.bg}` : 'border-slate-200 hover:bg-slate-50'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className={`font-bold text-sm ${dev.color}`}>{dev.name}</h4>
                  <div className={`w-3 h-3 rounded-full ${isActive ? dev.color.replace('text', 'bg') : 'bg-slate-300'}`} />
                </div>
                {isActive && (
                  <p className="text-xs text-slate-700 mt-2 animate-in slide-in-from-top-1 fade-in duration-200">{dev.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full md:w-2/3 p-6 md:p-10 lg:p-12 overflow-y-auto relative bg-[#faf9f6]">
        <h1 className="text-2xl md:text-3xl font-serif italic text-slate-800 mb-8 border-b-2 border-slate-200 pb-4">The Tempest's Approach</h1>
        
        <div className="font-serif text-lg md:text-2xl leading-[2.5] md:leading-[2.5] text-slate-700 whitespace-pre-wrap">
  The <span className={`transition-colors duration-300 rounded px-1 ${activeDevice === 'sibilance' ? devices.find(d=>d.id==='sibilance')?.highlight : ''}`}>s</span>torm <span className={`transition-colors duration-300 rounded px-1 ${activeDevice === 'sibilance' ? devices.find(d=>d.id==='sibilance')?.highlight : ''}`}>s</span>wept through the <span className={`transition-colors duration-300 rounded px-1 ${activeDevice === 'sibilance' ? devices.find(d=>d.id==='sibilance')?.highlight : ''}`}>s</span>ilent <span className={`transition-colors duration-300 rounded px-1 ${activeDevice === 'sibilance' ? devices.find(d=>d.id==='sibilance')?.highlight : ''}`}>s</span>treet,
  With <span className={`transition-colors duration-300 rounded px-1 font-bold ${activeDevice === 'alliteration' ? devices.find(d=>d.id==='alliteration')?.highlight : ''}`}>w</span>ild and <span className={`transition-colors duration-300 rounded px-1 font-bold ${activeDevice === 'alliteration' ? devices.find(d=>d.id==='alliteration')?.highlight : ''}`}>w</span>icked <span className={`transition-colors duration-300 rounded px-1 font-bold ${activeDevice === 'alliteration' ? devices.find(d=>d.id==='alliteration')?.highlight : ''}`}>w</span>ind.
  The <span className={`transition-colors duration-300 rounded px-1 font-bold ${activeDevice === 'onomatopoeia' ? devices.find(d=>d.id==='onomatopoeia')?.highlight : ''}`}>crash</span> of the thunder, the <span className={`transition-colors duration-300 rounded px-1 ${activeDevice === 'assonance' ? devices.find(d=>d.id==='assonance')?.highlight : ''}`}>b<span className="font-bold underline">ea</span>t</span> in the <span className={`transition-colors duration-300 rounded px-1 ${activeDevice === 'assonance' ? devices.find(d=>d.id==='assonance')?.highlight : ''}`}>h<span className="font-bold underline">ea</span>t</span>,
  Left nothing but <span className={`transition-colors duration-300 rounded px-1 font-bold ${activeDevice === 'onomatopoeia' ? devices.find(d=>d.id==='onomatopoeia')?.highlight : ''}`}>bangs</span> behind.
        </div>
        
        {!activeDevice && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-800/80 backdrop-blur text-white text-xs px-4 py-2 rounded-full pointer-events-none animate-pulse text-center w-[80%] max-w-[200px]">
            Select a device to highlight
          </div>
        )}
      </div>
    </div>
  )
}

function EnglishUnit4Visual() {
  const [activeShot, setActiveShot] = useState<string | null>(null);

  const techniques = [
    { id: 'low-key', name: "Low-Key Lighting", description: "Creates dramatic, deep shadows highlighting contrasts.", color: "text-indigo-700", bg: "bg-indigo-100", border: 'border-indigo-500' },
    { id: 'close-up', name: "Close-up", description: "Tightly frames a person's face to emphasize emotion.", color: "text-rose-700", bg: "bg-rose-100", border: 'border-rose-500' },
    { id: 'mise-en-scene', name: "Mise-en-scène", description: "The arrangement of actors and scenery in a film.", color: "text-fuchsia-700", bg: "bg-fuchsia-100", border: 'border-fuchsia-500' }
  ];

  return (
    <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 group flex flex-col md:flex-row">
       <div className="w-full md:w-1/3 bg-slate-800 border-r border-slate-700 p-4 overflow-y-auto text-slate-200">
        <h3 className="font-bold text-white mb-4 border-b border-slate-700 pb-2">Cinematography</h3>
        <p className="text-xs text-slate-400 mb-4">Select a technique to analyze the scene.</p>
        
        <div className="space-y-3">
          {techniques.map((tech) => {
             const isActive = activeShot === tech.id;
             return (
               <div 
                  key={tech.id}
                  onClick={() => setActiveShot(isActive ? null : tech.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${isActive ? `border-${tech.color.split('-')[1]}-400 shadow-sm bg-slate-700` : 'border-slate-600 hover:bg-slate-700/50'}`}
               >
                 <div className="flex justify-between items-center mb-1">
                    <h4 className={`font-bold text-sm ${isActive ? tech.color.replace('700', '300') : 'text-slate-300'}`}>{tech.name}</h4>
                 </div>
                 {isActive && (
                    <p className="text-xs text-slate-300 mt-2 animate-in slide-in-from-top-1 fade-in duration-200">{tech.description}</p>
                 )}
               </div>
             )
          })}
        </div>
      </div>

      <div className="w-full md:w-2/3 relative bg-black overflow-hidden flex items-center justify-center">
         {/* Base Image Layer */}
         <img 
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80" 
            alt="Cinematic scene"
            className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${activeShot === 'close-up' ? 'scale-[2.5] origin-[50%_40%]' : 'scale-100'} ${activeShot === 'low-key' ? 'brightness-[0.3] contrast-150 grayscale-[50%]' : 'brightness-75'}`}
            referrerPolicy="no-referrer"
         />
         
         {activeShot === 'low-key' && (
           <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/20 to-transparent mix-blend-overlay"></div>
           </div>
         )}
         
         {activeShot === 'mise-en-scene' && (
           <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-end">
              <div className="border-2 border-fuchsia-500/50 rounded-xl w-32 h-40 animate-pulse absolute bottom-1/4 right-1/4" />
              <p className="bg-fuchsia-900/80 backdrop-blur text-white text-xs p-2 rounded w-48 mt-auto mx-auto translate-y-[-20px] shadow-2xl">
                 Notice the positioning of the vintage popcorn maker. What does this suggest about the era?
              </p>
           </div>
         )}

         {!activeShot && (
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-black/50 backdrop-blur p-4 rounded-full">
               <div className="w-16 h-16 border-4 border-white rounded-full flex items-center justify-center pl-2 opacity-50">
                 <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent"></div>
               </div>
             </div>
           </div>
         )}

         {/* Cinematic Bars */}
         <div className="absolute top-0 left-0 w-full h-12 bg-black z-10 transition-transform duration-500 ease-in-out transform origin-top"></div>
         <div className="absolute bottom-0 left-0 w-full h-12 bg-black z-10 transition-transform duration-500 ease-in-out transform origin-bottom"></div>
      </div>
    </div>
  );
}

function EnglishUnit5Visual() {
  const [activeElement, setActiveElement] = useState<string | null>(null);

  const elements = [
    { id: 'iambic', name: "Iambic Pentameter", description: "Five pairs of alternating unstressed and stressed syllables.", color: "text-amber-700", bg: "bg-amber-100", highlight: "bg-amber-100 text-amber-900 border-b-2 border-amber-500" },
    { id: 'caesura', name: "Caesura", description: "A deliberate pause or break in a line of poetry, often marked by punctuation.", color: "text-indigo-700", bg: "bg-indigo-100", highlight: "bg-indigo-200 text-indigo-900 font-bold px-1" },
    { id: 'enjambment', name: "Enjambment", description: "A line without a pause or punctuation at the end, continuing into the next line.", color: "text-emerald-700", bg: "bg-emerald-100", highlight: "bg-emerald-100 text-emerald-900 italic border-l-4 border-emerald-500 pl-1" },
  ];

  return (
    <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-[#f4eadd] flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 bg-white/60 border-r border-slate-300 p-4 overflow-y-auto">
        <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">The Bard's Tools</h3>
        <p className="text-xs text-slate-600 mb-4">Click a technique to see it highlighted in Katherina's monologue.</p>
        
        <div className="space-y-3">
          {elements.map((el) => {
            const isActive = activeElement === el.id;
            return (
              <div 
                key={el.id}
                onClick={() => setActiveElement(isActive ? null : el.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${isActive ? `border-${el.color.split('-')[1]}-400 shadow-sm bg-white` : 'border-slate-300 hover:bg-white/80'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className={`font-bold text-sm ${el.color}`}>{el.name}</h4>
                  <div className={`w-3 h-3 rounded-full ${isActive ? el.color.replace('text', 'bg') : 'bg-slate-300'}`} />
                </div>
                {isActive && (
                  <p className="text-xs text-slate-600 mt-2 animate-in slide-in-from-top-1 fade-in duration-200">{el.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full md:w-2/3 p-6 md:p-10 lg:p-12 overflow-y-auto relative" style={{ backgroundImage: 'radial-gradient(#d4c5b3 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        <h1 className="text-xl md:text-2xl font-serif text-slate-800 mb-6 border-b border-slate-400/50 pb-2 inline-block">Katherina's Final Monologue</h1>
        
        <div className="font-serif text-lg md:text-xl leading-[2.5] text-slate-800/90 whitespace-pre-wrap">
          Thy husband is thy lord, <span className={`transition-all duration-300 rounded ${activeElement === 'caesura' ? elements.find(e=>e.id==='caesura')?.highlight : ''}`}>thy life,</span> thy keeper,
          Thy head, thy sovereign; <span className={`transition-all duration-300 rounded ${activeElement === 'caesura' ? elements.find(e=>e.id==='caesura')?.highlight : ''}`}>one that cares for thee,</span>
          And for thy maintenance <span className={`transition-all duration-300 ${activeElement === 'enjambment' ? elements.find(e=>e.id==='enjambment')?.highlight : ''}`}>commits his body</span>
          <span className={`transition-all duration-300 ${activeElement === 'enjambment' ? elements.find(e=>e.id==='enjambment')?.highlight : ''}`}>To painful labour</span> both by sea and land,
          <span className={`transition-all duration-300 ${activeElement === 'iambic' ? elements.find(e=>e.id==='iambic')?.highlight : ''}`}>To <strong>watch</strong> the <strong>night</strong> in <strong>storms</strong>, the <strong>day</strong> in <strong>cold</strong>,</span>
          Whilst thou liest warm at home, secure and safe...
        </div>

        {!activeElement && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-amber-900/80 backdrop-blur text-white text-xs px-4 py-2 rounded-full pointer-events-none animate-pulse text-center">
            Explore the verse
          </div>
        )}
      </div>
    </div>
  );
}

interface ExampleGraphProps {
  exampleId: string;
}

export function ExampleGraph({ exampleId }: ExampleGraphProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderGraph = () => {
    switch (exampleId) {
      case 'eng_u1_1': {
        return <EnglishUnit1Visual />;
      }

      case 'eng_u2_1': {
        return <EnglishUnit2Visual />;
      }

      case 'eng_u3_1': {
        return <EnglishUnit3Visual />;
      }

      case 'eng_u4_1': {
        return <EnglishUnit4Visual />;
      }

      case 'eng_u5_1': {
        return <EnglishUnit5Visual />;
      }

      case 'ex1': {
        const data = [
          { name: 'Original', value: 3500, fill: '#cbd5e1' },
          { name: 'VAT (5%)', value: 175, fill: '#8b5cf6' },
          { name: 'Total', value: 3675, fill: '#14b8a6' }
        ];
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Amount (AED)', angle: -90, position: 'insideLeft', offset: -10 }} />
              <Tooltip formatter={(val) => [`${Number(val ?? 0)} AED`, 'Amount']} cursor={{fill: 'transparent'}}/>
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      }

      case 'ex3': {
        const data = [
          { name: 'Original', value: 450, fill: '#cbd5e1' },
          { name: 'Discount (20%)', value: 90, fill: '#f43f5e' },
          { name: 'Sale Price', value: 360, fill: '#10b981' }
        ];
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Amount (AED)', angle: -90, position: 'insideLeft', offset: -10 }} />
              <Tooltip formatter={(val) => [`${Number(val ?? 0)} AED`, 'Amount']} cursor={{fill: 'transparent'}}/>
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      }

      case 'ex4': {
        const data = [
          { name: 'Ahmed (3 parts)', value: 4500, color: '#0ea5e9' },
          { name: 'Sarah (5 parts)', value: 7500, color: '#8b5cf6' }
        ];
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => [`${Number(val ?? 0)} AED`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
        );
      }

      case 'ex5': {
        const data = [
          { year: 'Original', rent: 140000 },
          { year: 'New', rent: 147000 }
        ];
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 50, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" />
              <YAxis domain={[130000, 150000]} label={{ value: 'Rent (AED)', angle: -90, position: 'insideLeft', offset: -20 }} />
              <Tooltip formatter={(val) => [`${Number(val ?? 0)} AED`, 'Rent']} />
              <Line type="monotone" dataKey="rent" stroke="#f43f5e" strokeWidth={3} dot={{ r: 6, fill: '#f43f5e' }} />
            </LineChart>
          </ResponsiveContainer>
        );
      }

      case 'u2-ex1':
      case 'u2-ex2': {
        // y = 2.50x + 12
        const data = [0, 1, 2, 3, 4, 5, 6].map(x => ({ x, y: 2.5 * x + 12 }));
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="x" type="number" domain={[0, 6]} label={{ value: 'Distance (km)', position: 'insideBottomRight', offset: -10 }} />
              <YAxis type="number" domain={[0, 30]} label={{ value: 'Cost (AED)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(val) => [`${Number(val ?? 0)} AED`, 'Cost']} labelFormatter={(label) => `${label} km`} />
              <Line type="monotone" dataKey="y" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5, fill: '#8b5cf6' }} />
            </LineChart>
          </ResponsiveContainer>
        );
      }
      
      case 'u2-ex3': {
        // Point A (-3, 4)
        const data = [{ x: -3, y: 4 }];
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="x" type="number" domain={[-5, 5]} ticks={[-4,-3,-2,-1,0,1,2,3,4]} />
              <YAxis dataKey="y" type="number" domain={[-5, 5]} ticks={[-4,-3,-2,-1,0,1,2,3,4]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <ReferenceLine x={0} stroke="#64748b" strokeWidth={2} />
              <ReferenceLine y={0} stroke="#64748b" strokeWidth={2} />
              <Scatter name="Point A" data={data} fill="#0ea5e9" shape="circle" >
              </Scatter>
              <ReferenceDot x={-3} y={4} r={6} fill="#0ea5e9" stroke="#fff" strokeWidth={2} />
            </ScatterChart>
          </ResponsiveContainer>
        );
      }
      
      case 'u2-ex4': {
        // Gradient (2, 200) to (5, 500)
        const data = [
          { x: 0, y: 0 },
          { x: 2, y: 200 },
          { x: 5, y: 500 },
          { x: 6, y: 600 }
        ];
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="x" type="number" domain={[0, 6]} label={{ value: 'Time (hrs)', position: 'insideBottomRight', offset: -10 }} />
              <YAxis type="number" domain={[0, 600]} label={{ value: 'Distance (km)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(val) => [`${Number(val ?? 0)} km`, 'Distance']} labelFormatter={(label) => `${label} hours`} />
              <Line type="linear" dataKey="y" stroke="#10b981" strokeWidth={3} dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (payload.x === 2 || payload.x === 5) {
                  return <circle cx={cx} cy={cy} r={6} fill="#10b981" stroke="#fff" strokeWidth={2} key={payload.x} />;
                }
                return <circle cx={cx} cy={cy} r={0} key={payload.x} />;
              }} />
            </LineChart>
          </ResponsiveContainer>
        );
      }
      
      case 'u2-ex7': {
        // y = 2.5x + 12 and y = 2.5x + 15
        const data = [0, 2, 4, 6].map(x => ({ 
          x, 
          y1: 2.5 * x + 12, 
          y2: 2.5 * x + 15 
        }));
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="x" type="number" domain={[0, 6]} label={{ value: 'Distance (km)', position: 'insideBottomRight', offset: -10 }} />
              <YAxis type="number" domain={[0, 35]} label={{ value: 'Cost (AED)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line name="Original (y = 2.5x + 12)" type="monotone" dataKey="y1" stroke="#94a3b8" strokeWidth={3} strokeDasharray="5 5" dot={false} />
              <Line name="New (y = 2.5x + 15)" type="monotone" dataKey="y2" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      }
      
      case 'u2-ex8': {
        // y = 2.5x + 12 and y = 3.5x + 12
        const data = [0, 2, 4, 6].map(x => ({ 
          x, 
          y1: 2.5 * x + 12, 
          y2: 3.5 * x + 12 
        }));
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="x" type="number" domain={[0, 6]} label={{ value: 'Distance (km)', position: 'insideBottomRight', offset: -10 }} />
              <YAxis type="number" domain={[0, 35]} label={{ value: 'Cost (AED)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line name="Original (y = 2.5x + 12)" type="monotone" dataKey="y1" stroke="#94a3b8" strokeWidth={3} strokeDasharray="5 5" dot={false} />
              <Line name="Hala Max (y = 3.5x + 12)" type="monotone" dataKey="y2" stroke="#eab308" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      }
      
      case 'u2-ex9': {
        // y = 10x + 50 and y = 100
        const data = [0, 2, 4, 5, 6, 8, 10].map(x => ({ 
          x, 
          planA: 10 * x + 50, 
          planB: 100 
        }));
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="x" type="number" domain={[0, 10]} label={{ value: 'Data (GB)', position: 'insideBottomRight', offset: -10 }} />
              <YAxis type="number" domain={[0, 150]} label={{ value: 'Cost (AED)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line name="Plan A: 10x + 50" type="monotone" dataKey="planA" stroke="#3b82f6" strokeWidth={3} dot={false} />
              <Line name="Plan B: Unlimited (100)" type="monotone" dataKey="planB" stroke="#ef4444" strokeWidth={3} dot={false} />
              <ReferenceDot x={5} y={100} r={6} fill="#10b981" stroke="#fff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      }

      case 'u3-ex1':
      case 'u3-ex2': {
        return (
          <div className="w-full flex justify-center items-center pb-4 pt-4">
            <svg width="340" height="220" viewBox="0 0 340 220">
              {/* Back Face */}
              <rect x="80" y="50" width="180" height="60" fill="transparent" stroke="#cbd5e1" strokeDasharray="4" strokeWidth="2" />
              <line x1="80" y1="110" x2="40" y2="150" stroke="#cbd5e1" strokeDasharray="4" strokeWidth="2" />
              
              {/* Top Face */}
              <polygon points="40,90 80,50 260,50 220,90" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" opacity="0.8" />
              {/* Right Face */}
              <polygon points="220,90 260,50 260,110 220,150" fill="#c7d2fe" stroke="#6366f1" strokeWidth="2" opacity="0.8" />
              {/* Front Face */}
              <rect x="40" y="90" width="180" height="60" fill="#a5b4fc" stroke="#6366f1" strokeWidth="2" opacity="0.8" />

              {/* Labels */}
              <text x="130" y="170" fill="#334155" fontSize="14" fontWeight="600">12 m (length)</text>
              <text x="245" y="145" fill="#334155" fontSize="14" fontWeight="600">2.5 m (width)</text>
              {/* Height label */}
              <text x="10" y="125" fill="#334155" fontSize="14" fontWeight="600">2.5 m</text>
              <text x="10" y="140" fill="#334155" fontSize="12">(height)</text>
            </svg>
          </div>
        );
      }

      case 'u3-ex3': {
        return (
          <div className="w-full flex justify-center items-center pb-4 pt-4">
            <svg width="240" height="260" viewBox="0 0 240 260">
              {/* Bottom Ellipse (Back half dotted) */}
              <path d="M 60 200 A 60 20 0 0 1 180 200" fill="transparent" stroke="#cbd5e1" strokeDasharray="4" strokeWidth="2" />
              {/* Bottom Ellipse (Front half solid) */}
              <path d="M 60 200 A 60 20 0 0 0 180 200" fill="#c7d2fe" stroke="#6366f1" strokeWidth="2" />
              
              {/* Body */}
              <rect x="60" y="60" width="120" height="140" fill="#a5b4fc" opacity="0.5" stroke="none" />
              <line x1="60" y1="60" x2="60" y2="200" stroke="#6366f1" strokeWidth="2" />
              <line x1="180" y1="60" x2="180" y2="200" stroke="#6366f1" strokeWidth="2" />

              {/* Top Ellipse */}
              <ellipse cx="120" cy="60" rx="60" ry="20" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
              
              {/* Radius line and label */}
              <line x1="120" y1="60" x2="180" y2="60" stroke="#334155" strokeWidth="2" strokeDasharray="2" />
              <circle cx="120" cy="60" r="3" fill="#334155" />
              <text x="135" y="55" fill="#334155" fontSize="14" fontWeight="600">r = 1.5 m</text>
              
              {/* Height label */}
              <text x="190" y="135" fill="#334155" fontSize="14" fontWeight="600">h = 2 m</text>
            </svg>
          </div>
        );
      }

      case 'u3-ex4': {
        return (
          <div className="w-full flex justify-center items-center pb-4 pt-4">
            <svg width="340" height="240" viewBox="0 0 340 240">
              {/* Top circle */}
              <circle cx="170" cy="45" r="35" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
              {/* Middle rectangle */}
              <rect x="70" y="80" width="200" height="80" fill="#a5b4fc" stroke="#6366f1" strokeWidth="2" opacity="0.8" />
              {/* Bottom circle */}
              <circle cx="170" cy="195" r="35" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
              
              {/* Labels */}
              <text x="180" y="50" fill="#475569" fontSize="12">Circular Base</text>
              <text x="110" y="125" fill="#475569" fontSize="14" fontWeight="600">Curved Surface (Unrolled)</text>
              <text x="180" y="200" fill="#475569" fontSize="12">Circular Base</text>
            </svg>
          </div>
        );
      }

      case 'u3-ex5': {
        return (
          <div className="w-full flex justify-center items-center pb-4 pt-4">
            <svg width="240" height="240" viewBox="0 0 240 240">
              {/* Back Face */}
              <rect x="90" y="40" width="90" height="90" fill="transparent" stroke="#cbd5e1" strokeDasharray="4" strokeWidth="2" />
              <line x1="90" y1="130" x2="50" y2="170" stroke="#cbd5e1" strokeDasharray="4" strokeWidth="2" />
              <line x1="90" y1="40" x2="50" y2="80" stroke="#cbd5e1" strokeDasharray="4" strokeWidth="2" />
              <line x1="180" y1="40" x2="140" y2="80" stroke="#cbd5e1" strokeDasharray="4" strokeWidth="2" />
              
              {/* Top Face */}
              <polygon points="50,80 90,40 180,40 140,80" fill="#e0e7ff" stroke="#10b981" strokeWidth="2" opacity="0.8" />
              {/* Right Face */}
              <polygon points="140,80 180,40 180,130 140,170" fill="#a7f3d0" stroke="#10b981" strokeWidth="2" opacity="0.8" />
              {/* Front Face */}
              <rect x="50" y="80" width="90" height="90" fill="#6ee7b7" stroke="#10b981" strokeWidth="2" opacity="0.8" />

              {/* Labels */}
              <text x="85" y="195" fill="#334155" fontSize="14" fontWeight="600">4 m</text>
              <text x="165" y="160" fill="#334155" fontSize="14" fontWeight="600">4 m</text>
              <text x="10" y="130" fill="#334155" fontSize="14" fontWeight="600">4 m</text>
            </svg>
          </div>
        );
      }
      
      case 'u3-ex6': {
        // Translation A(2,3) to A'(-2,1)
        const data1 = [{ x: 2, y: 3 }];
        const data2 = [{ x: -2, y: 1 }];
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[-5, 5]} dataKey="x" name="X" />
              <YAxis type="number" domain={[-2, 6]} dataKey="y" name="Y" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <ReferenceLine x={0} stroke="#64748b" strokeWidth={2} />
              <ReferenceLine y={0} stroke="#64748b" strokeWidth={2} />
              <Scatter name="Original A(2,3)" data={data1} fill="#94a3b8" />
              <Scatter name="Translated A'(-2,1)" data={data2} fill="#10b981" />
              <ReferenceDot x={-2} y={1} r={6} fill="#10b981" stroke="#fff" strokeWidth={2} />
              <ReferenceDot x={2} y={3} r={6} fill="#94a3b8" stroke="#fff" strokeWidth={2} />
              <Legend />
            </ScatterChart>
          </ResponsiveContainer>
        );
      }

      case 'u3-ex7': {
        // Reflection B(4,5) to B'(4,-5)
        const data1 = [{ x: 4, y: 5 }];
        const data2 = [{ x: 4, y: -5 }];
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[-1, 6]} dataKey="x" name="X" />
              <YAxis type="number" domain={[-6, 6]} dataKey="y" name="Y" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <ReferenceLine x={0} stroke="#64748b" strokeWidth={2} />
              <ReferenceLine y={0} stroke="#64748b" strokeWidth={2} />
              <Scatter name="Original B(4,5)" data={data1} fill="#94a3b8" />
              <Scatter name="Reflected B'(4,-5)" data={data2} fill="#8b5cf6" />
              <ReferenceDot x={4} y={5} r={6} fill="#94a3b8" stroke="#fff" strokeWidth={2} />
              <ReferenceDot x={4} y={-5} r={6} fill="#8b5cf6" stroke="#fff" strokeWidth={2} />
              <Legend />
            </ScatterChart>
          </ResponsiveContainer>
        );
      }
      
      case 'u3-ex8': {
        // Rotation C(0,4) to C'(4,0)
        const data1 = [{ x: 0, y: 4 }];
        const data2 = [{ x: 4, y: 0 }];
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[-5, 5]} dataKey="x" name="X" />
              <YAxis type="number" domain={[-5, 5]} dataKey="y" name="Y" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <ReferenceLine x={0} stroke="#64748b" strokeWidth={2} />
              <ReferenceLine y={0} stroke="#64748b" strokeWidth={2} />
              <Scatter name="Original C(0,4)" data={data1} fill="#94a3b8" />
              <Scatter name="Rotated C'(4,0)" data={data2} fill="#ef4444" />
              <ReferenceDot x={0} y={4} r={6} fill="#94a3b8" stroke="#fff" strokeWidth={2} />
              <ReferenceDot x={4} y={0} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2} />
              <Legend />
            </ScatterChart>
          </ResponsiveContainer>
        );
      }

      case 'u4-ex3': {
        // Outliers 22, 24, 23, 22, 45, 25
        const data = [
          { index: 1, val: 22 },
          { index: 2, val: 24 },
          { index: 3, val: 23 },
          { index: 4, val: 22 },
          { index: 5, val: 45 },
          { index: 6, val: 25 },
        ];
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis type="number" dataKey="index" name="Run" tick={false} axisLine={false} />
              <YAxis type="number" domain={[20, 50]} dataKey="val" name="Time (min)" label={{ value: 'Time (min)', angle: -90, position: 'insideLeft' }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Run Time" data={data} fill="#3b82f6" shape="circle">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.val > 30 ? '#ef4444' : '#3b82f6'} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );
      }

      case 'u4-ex9': {
        // Positive Correlation Scatter
        const data = [
          { x: 1, y: 55 }, { x: 2, y: 60 }, { x: 3, y: 70 },
          { x: 4, y: 75 }, { x: 5, y: 82 }, { x: 6, y: 88 },
          { x: 7, y: 95 }
        ];
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" dataKey="x" name="Hours" label={{ value: 'Hours Studying', position: 'insideBottomRight', offset: -10 }} />
              <YAxis type="number" domain={[50, 100]} dataKey="y" name="Score" label={{ value: 'Test Score', angle: -90, position: 'insideLeft' }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Students" data={data} fill="#8b5cf6" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      }

      default:
        return null;
    }
  };

  const graphContent = renderGraph();
  if (!graphContent) return null;

  if (isExpanded) {
    return (
      <div className="fixed inset-4 z-50 bg-white shadow-[0_0_0_100vmax_rgba(0,0,0,0.5)] rounded-3xl border border-slate-200 overflow-hidden flex flex-col pt-16">
        <button 
          onClick={() => setIsExpanded(false)}
          className="absolute top-4 right-4 z-[60] bg-white hover:bg-slate-50 border border-slate-200 p-2.5 rounded-full shadow-sm transition-all text-slate-500"
          title="Minimize"
        >
          <Minimize2 className="w-6 h-6" />
        </button>
        <div className="flex-1 w-full h-full p-4 md:p-8 lg:p-12 overflow-y-auto">
          {graphContent}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 mb-8 shadow-inner overflow-hidden group">
      <button 
        onClick={() => setIsExpanded(true)}
        className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white backdrop-blur-sm border border-slate-200 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all text-indigo-500"
        title="Full Screen / Interactive View"
      >
        <Maximize2 className="w-5 h-5" />
      </button>
      <h3 className="text-sm font-black text-slate-500 mb-6 tracking-widest uppercase pb-4 border-b border-slate-200/60 inline-block w-full">Visual Interactive Model</h3>
      <div className="w-full relative">
        {graphContent}
      </div>
    </div>
  );
}
