import React, { useState, useRef, useEffect } from 'react';
import { Search, Calculator, Edit3, X, Maximize2, Trash2, SearchIcon } from 'lucide-react';
import { practiceQuestions } from '../data/curriculumData';
import { unit2Practice } from '../data/unit2Data';
import { unit3Practice } from '../data/unit3Data';
import { unit4Practice } from '../data/unit4Data';

export function FloatingTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<'search' | 'calculator' | 'scratchpad' | null>(null);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tool Panels */}
      {activeTool === 'search' && <SearchPanel onClose={() => setActiveTool(null)} />}
      {activeTool === 'calculator' && <CalculatorPanel onClose={() => setActiveTool(null)} />}
      {activeTool === 'scratchpad' && <ScratchpadPanel onClose={() => setActiveTool(null)} />}

      {/* Floating Action Button */}
      <div className={`flex flex-col gap-2 transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none absolute bottom-14 right-0'}`}>
        <button 
          onClick={() => setActiveTool('search')}
          className="w-12 h-12 bg-white text-slate-700 rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
          title="Global Search"
        >
          <Search className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setActiveTool('calculator')}
          className="w-12 h-12 bg-white text-slate-700 rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
          title="Calculator"
        >
          <Calculator className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setActiveTool('scratchpad')}
          className="w-12 h-12 bg-white text-slate-700 rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
          title="Scratchpad"
        >
          <Edit3 className="w-5 h-5" />
        </button>
      </div>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-indigo-700 transition-colors z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <div className="flex flex-col gap-1 items-center justify-center">
            <span className="block w-5 h-0.5 bg-white"></span>
            <span className="block w-5 h-0.5 bg-white"></span>
            <span className="block w-5 h-0.5 bg-white"></span>
        </div>}
      </button>
    </div>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const allData = [
    ...practiceQuestions.map(q => ({ ...q, unit: 'Unit 1' })),
    ...unit2Practice.map(q => ({ ...q, unit: 'Unit 2' })),
    ...unit3Practice.map(q => ({ ...q, unit: 'Unit 3' })),
    ...unit4Practice.map(q => ({ ...q, unit: 'Unit 4' }))
  ];

  const results = query.length > 2 
    ? allData.filter(item => 
        item.question.toLowerCase().includes(query.toLowerCase()) || 
        item.answerFullWorking.toLowerCase().includes(query.toLowerCase())
      ) 
    : [];

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 overflow-hidden flex flex-col mb-4 animate-in slide-in-from-bottom-4">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h3 className="font-bold flex items-center gap-2 text-slate-800"><Search className="w-4 h-4 text-indigo-500" /> Global Search</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-4 border-b border-slate-100 relative">
         <SearchIcon className="w-5 h-5 absolute left-7 top-7 text-slate-400" />
         <input 
           autoFocus
           type="text" 
           value={query}
           onChange={e => setQuery(e.target.value)}
           placeholder="Search terms, formulas..." 
           className="w-full bg-slate-100 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
         />
      </div>
      <div className="h-72 overflow-y-auto p-2 bg-slate-50/50">
        {query.length <= 2 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm p-4 text-center">Type at least 3 characters to search across all units...</div>
        ) : results.length === 0 ? (
           <div className="h-full flex items-center justify-center text-slate-500 text-sm">No results found for "{query}"</div>
        ) : (
          <div className="space-y-2">
            {results.map(res => (
              <div key={`${res.unit}-${res.id}`} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full mb-1 inline-block">{res.unit} - Q{res.id}</span>
                <p className="text-sm text-slate-700 font-medium line-clamp-2">{res.question}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{res.answerFullWorking.substring(0, 50)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CalculatorPanel({ onClose }: { onClose: () => void }) {
  const [calc, setCalc] = useState('');
  
  const handleEval = () => {
    try {
      // eslint-disable-next-line
      const result = eval(calc.replace(/×/g, '*').replace(/÷/g, '/'));
      setCalc(String(result));
    } catch (e) {
      setCalc('Error');
    }
  };

  const buttons = [
    '7', '8', '9', '÷',
    '4', '5', '6', '×',
    '1', '2', '3', '-',
    'C', '0', '.', '+'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-72 overflow-hidden flex flex-col mb-4 animate-in slide-in-from-bottom-4">
       <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h3 className="font-bold flex items-center gap-2 text-slate-800"><Calculator className="w-4 h-4 text-indigo-500" /> Calculator</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-4 bg-slate-900 border-b-4 border-slate-800">
        <div className="bg-slate-800 rounded-lg p-3 text-right text-2xl font-mono text-emerald-400 overflow-x-hidden tracking-wider shadow-inner min-h-[52px]">
          {calc || '0'}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-[1px] bg-slate-200 p-[1px]">
         {buttons.map(btn => (
           <button 
             key={btn}
             onClick={() => {
               if (btn === 'C') setCalc('');
               else {
                 if (calc === 'Error') setCalc(btn);
                 else setCalc(calc + btn);
               }
             }}
             className={`p-4 text-lg font-medium transition-colors ${
               ['÷', '×', '-', '+'].includes(btn) ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : 'bg-white text-slate-700 hover:bg-slate-50'
             }`}
           >
             {btn}
           </button>
         ))}
         <button className="col-span-4 bg-indigo-500 text-white p-3 font-bold hover:bg-indigo-600 transition-colors" onClick={handleEval}>=</button>
      </div>
    </div>
  );
}

function ScratchpadPanel({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [color, setColor] = useState('#334155');
  const [isEraser, setIsEraser] = useState(false);
  const [lineWidth, setLineWidth] = useState(2);

  const colors = ['#334155', '#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

  const initCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      // Save old image data if possible
      const ctx = canvas.getContext('2d');
      let oldImage;
      if (ctx && canvas.width > 0 && canvas.height > 0) {
        oldImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      if (ctx) {
        if (oldImage) {
           ctx.putImageData(oldImage, 0, 0);
        }
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = isEraser ? 20 : lineWidth;
        ctx.strokeStyle = color;
        ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
      }
    }
  };

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = isEraser ? 20 : lineWidth;
        ctx.strokeStyle = color;
        ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
      }
    }
  }, [color, isEraser, lineWidth]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d');
    const coords = getCoordinates(e);
    if (!ctx || !coords) return;
    
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    const coords = getCoordinates(e);
    if (!ctx || !coords) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className={`bg-white shadow-2xl border border-slate-200 flex flex-col transition-all duration-300 ease-in-out ${
      isFullscreen 
        ? 'fixed inset-4 z-[100] rounded-2xl' 
        : 'w-80 h-96 rounded-2xl mb-4 animate-in slide-in-from-bottom-4'
    }`}>
       <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
        <h3 className="font-bold flex items-center gap-2 text-slate-800">
          <Edit3 className="w-4 h-4 text-indigo-500" /> Scratchpad
        </h3>
        <div className="flex gap-2 items-center">
            {/* Color Swatches */}
            <div className="flex gap-1 mr-2 bg-slate-200/50 p-1 rounded-lg">
               {colors.map(c => (
                  <button 
                    key={c} 
                    onClick={() => { setColor(c); setIsEraser(false); }}
                    className={`w-5 h-5 rounded-full border-2 ${color === c && !isEraser ? 'border-indigo-500 scale-110 shadow-sm' : 'border-transparent hover:scale-110 transition-transform'}`}
                    style={{ backgroundColor: c }}
                  />
               ))}
               <button 
                  onClick={() => setIsEraser(true)}
                  className={`w-5 h-5 rounded-full bg-white flex flex-col items-center justify-center border-2 ${isEraser ? 'border-indigo-500 scale-110 shadow-sm' : 'border-slate-300 hover:scale-110 transition-transform'}`}
                  title="Eraser"
               >
                 <div className="w-1.5 h-1.5 rounded-sm bg-rose-200 border border-slate-300"></div>
               </button>
            </div>
          
           {/* Line Width */}
           <div className="flex gap-1 mr-2 px-2 border-l border-slate-200">
             {[2, 4, 8].map(w => (
               <button
                 key={w}
                 onClick={() => setLineWidth(w)}
                 className={`w-6 h-6 flex items-center justify-center rounded-md ${lineWidth === w ? 'bg-slate-200' : 'hover:bg-slate-100'}`}
                 title={`Line width ${w}`}
               >
                 <div className="bg-slate-600 rounded-full" style={{ width: w, height: w }}></div>
               </button>
             ))}
           </div>
            
           <button onClick={() => setIsFullscreen(!isFullscreen)} className="text-slate-400 hover:text-indigo-500 p-1">
             <Maximize2 className="w-4 h-4" />
           </button>
           <button onClick={clearCanvas} className="text-slate-400 hover:text-rose-500 p-1" title="Clear">
             <Trash2 className="w-4 h-4" />
           </button>
           {!isFullscreen && <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
             <X className="w-4 h-4" />
           </button>}
           {isFullscreen && <button onClick={() => setIsFullscreen(false)} className="text-slate-400 hover:text-slate-600 p-1" title="Close Fullscreen">
             <X className="w-4 h-4" />
           </button>}
        </div>
      </div>
      <div 
        ref={containerRef}
        className={`bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-amber-50/50 relative flex-1 cursor-crosshair rounded-b-2xl overflow-hidden`}
      >
        <canvas
          ref={canvasRef}
          className="block touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
        />
      </div>
    </div>
  );
}
