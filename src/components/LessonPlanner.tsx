import React, { useState, useCallback, useEffect } from 'react';
import { generateContent, DEFAULT_AI_MODEL } from '@/lib/gemini';
import { Upload, Link as LinkIcon, FileText, Loader2, FileImage, Gamepad2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useDropzone } from 'react-dropzone';
import {
  NeuroQuestAssignment,
  buildQuestLessonPrompt,
  getNeuroQuestGame,
  loadActiveAssignment,
  neuroQuestGames,
} from '@/lib/neuroquest';

export function LessonPlanner() {
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [url, setUrl] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lessonPlan, setLessonPlan] = useState('');
  const [error, setError] = useState('');
  const [questMode, setQuestMode] = useState(false);
  const [selectedGameSlug, setSelectedGameSlug] = useState(neuroQuestGames[0].slug);
  const [activeAssignment, setActiveAssignment] = useState<NeuroQuestAssignment | null>(null);

  useEffect(() => {
    const active = loadActiveAssignment();
    if (active) {
      setActiveAssignment(active);
      setQuestMode(true);
      setSelectedGameSlug(active.gameSlug);
      setTopic(active.title);
      setGradeLevel(getNeuroQuestGame(active.gameSlug).gradeBand);
      setAdditionalContext(buildQuestLessonPrompt(active));
    }
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'application/pdf': ['.pdf']
    }
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix (e.g., "data:image/png;base64,")
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const generateLessonPlan = async () => {
    if (!topic || !gradeLevel) {
      setError('Please provide a topic and grade level.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setLessonPlan('');

    try {
      const selectedGame = getNeuroQuestGame(selectedGameSlug);
      const questContext = questMode
        ? activeAssignment
          ? buildQuestLessonPrompt({ ...activeAssignment, gameSlug: selectedGameSlug })
          : `Integrate NeuroQuest game: ${selectedGame.title}. Skills: ${selectedGame.skills.join(', ')}. Student launch path: ${selectedGame.href}.`
        : '';

      const parts: any[] = [
        {
          text: `Create a comprehensive lesson plan for ${gradeLevel} students on the topic: "${topic}".${questMode ? `\n\nNeuroQuest integration required:\n${questContext}` : ''}`,
        },
      ];

      if (additionalContext) {
        parts.push({ text: `Additional context/instructions: ${additionalContext}` });
      }

      // Process files
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          const base64Data = await fileToBase64(file);
          parts.push({
            inlineData: {
              data: base64Data,
              mimeType: file.type
            }
          });
        } else if (file.type === 'application/pdf') {
           const base64Data = await fileToBase64(file);
           parts.push({
            inlineData: {
              data: base64Data,
              mimeType: file.type
            }
          });
        }
      }

      const tools = [];
      if (url) {
        parts.push({ text: `Please also consider the information from this URL: ${url}` });
        tools.push({ urlContext: {} });
      }

      const response = await generateContent({
        model: DEFAULT_AI_MODEL,
        contents: { parts },
        config: {
          tools: tools.length > 0 ? tools : undefined,
          systemInstruction: "You are an expert teacher's assistant. Create detailed, engaging, and age-appropriate lesson plans. Include objectives, materials needed, introduction, main activity, assessment, conclusion, differentiation, homework, and a brief outline for a PowerPoint presentation. If NeuroQuest is enabled, include the game launch moment, teacher monitoring prompts, student evidence capture, reflection questions, and a grading rubric.",
        }
      });

      setLessonPlan(response.text || 'Failed to generate lesson plan.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating the lesson plan.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Lesson Planner & Presentation Builder</h2>
        <p className="text-gray-600">Generate lesson plans and slide outlines using AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic *</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="e.g., The Water Cycle"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level *</label>
              <input 
                type="text" 
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="e.g., 5th Grade"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Context</label>
              <textarea 
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-24 resize-none"
                placeholder="Any specific requirements, learning styles, or focus areas..."
              />
            </div>

            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Gamepad2 className="mt-0.5 h-5 w-5 text-indigo-600" />
                  <div>
                    <h3 className="font-semibold text-indigo-950">NeuroQuest Integration</h3>
                    <p className="mt-1 text-sm text-indigo-700">
                      Add the selected learning game, student evidence task, and quest reflection into the lesson plan.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={questMode}
                    onChange={(event) => setQuestMode(event.target.checked)}
                    className="peer sr-only"
                  />
                  <span className="h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:bg-indigo-600 peer-checked:after:translate-x-5" />
                </label>
              </div>

              {questMode && (
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <select
                    value={selectedGameSlug}
                    onChange={(event) => setSelectedGameSlug(event.target.value)}
                    className="rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {neuroQuestGames.map((game) => (
                      <option key={game.slug} value={game.slug}>{game.title} · {game.subject}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const active = loadActiveAssignment();
                      if (!active) return;
                      setActiveAssignment(active);
                      setSelectedGameSlug(active.gameSlug);
                      setTopic(active.title);
                      setGradeLevel(getNeuroQuestGame(active.gameSlug).gradeBand);
                      setAdditionalContext(buildQuestLessonPrompt(active));
                    }}
                    className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    Use Active Quest
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reference URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input 
                  type="url" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="https://example.com/article"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Materials (Images/PDFs)</label>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Drag & drop files here, or click to select</p>
              </div>
              
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                      <div className="flex items-center gap-2 overflow-hidden">
                        {file.type.startsWith('image/') ? <FileImage className="h-4 w-4 text-blue-500 shrink-0" /> : <FileText className="h-4 w-4 text-red-500 shrink-0" />}
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      </div>
                      <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 text-sm font-medium px-2">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={generateLessonPlan}
            disabled={isGenerating}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Lesson Plan & Slides'
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-[800px] flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 shrink-0">Generated Content</h3>
          <div className="flex-1 overflow-y-auto prose prose-indigo max-w-none">
            {lessonPlan ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {lessonPlan}
              </ReactMarkdown>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">
                Your generated lesson plan will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
