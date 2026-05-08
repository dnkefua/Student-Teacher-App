import React, { useState, useCallback, useEffect } from 'react';
import { getGeminiClient } from '@/lib/gemini';
import { Upload, Loader2, FileImage, FileText, Gamepad2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useDropzone } from 'react-dropzone';
import { NeuroQuestAssignment, buildQuestRubric, getNeuroQuestGame, loadActiveAssignment } from '@/lib/neuroquest';

export function Grader() {
  const [markingScheme, setMarkingScheme] = useState('');
  const [studentSubmissionText, setStudentSubmissionText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isGrading, setIsGrading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [activeAssignment, setActiveAssignment] = useState<NeuroQuestAssignment | null>(null);

  useEffect(() => {
    const active = loadActiveAssignment();
    if (active) setActiveAssignment(active);
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
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const gradeSubmission = async () => {
    if (!markingScheme) {
      setError('Please provide a marking scheme or criteria.');
      return;
    }
    if (!studentSubmissionText && files.length === 0) {
      setError('Please provide the student submission (text or files).');
      return;
    }

    setIsGrading(true);
    setError('');
    setFeedback('');

    try {
      const parts: any[] = [
        { text: `You are an expert teacher grading a student's submission.` },
        { text: `Here is the Marking Scheme / Criteria:\n${markingScheme}` }
      ];

      if (activeAssignment) {
        const game = getNeuroQuestGame(activeAssignment.gameSlug);
        parts.push({
          text: `This submission may include NeuroQuest learning evidence.\nActive quest: ${activeAssignment.title}\nGame: ${game.title}\nObjective: ${activeAssignment.objective}\nInstructions: ${activeAssignment.instructions}`,
        });
      }

      if (studentSubmissionText) {
        parts.push({ text: `Here is the Student's Submission (Text):\n${studentSubmissionText}` });
      }

      if (files.length > 0) {
        parts.push({ text: `Please also evaluate the following attached files representing the student's work:` });
        for (const file of files) {
          const base64Data = await fileToBase64(file);
          parts.push({
            inlineData: {
              data: base64Data,
              mimeType: file.type
            }
          });
        }
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: { parts },
        config: {
          systemInstruction: "Evaluate the student's work strictly based on the provided marking scheme. Provide a final score, a breakdown of points, constructive feedback on what they did well, and areas for improvement.",
        }
      });

      setFeedback(response.text || 'Failed to generate feedback.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while grading.');
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Grader & Evaluator</h2>
        <p className="text-gray-600">Automatically grade student submissions based on your criteria.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marking Scheme / Criteria *</label>
            <textarea 
              value={markingScheme}
              onChange={(e) => setMarkingScheme(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-32 resize-none"
              placeholder="Paste your rubric, correct answers, or grading criteria here..."
            />
            {activeAssignment && (
              <button
                type="button"
                onClick={() => setMarkingScheme(buildQuestRubric(activeAssignment))}
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
              >
                <Gamepad2 className="h-4 w-4" />
                Use NeuroQuest Rubric: {activeAssignment.title}
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Submission (Text)</label>
            <textarea 
              value={studentSubmissionText}
              onChange={(e) => setStudentSubmissionText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-32 resize-none"
              placeholder="Paste the student's essay or answers here..."
            />
            {activeAssignment && (
              <button
                type="button"
                onClick={() => {
                  const game = getNeuroQuestGame(activeAssignment.gameSlug);
                  setStudentSubmissionText(`NeuroQuest Evidence Submission\nStudent name:\nGame: ${game.title}\nScore or level reached:\nOne mistake I corrected:\nStrategy reflection:\nNext goal:`);
                }}
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
              >
                <FileText className="h-4 w-4" />
                Insert Quest Evidence Template
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Submission (Files/Images)</label>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Drag & drop student papers (images/PDFs) here</p>
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={gradeSubmission}
            disabled={isGrading}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isGrading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Evaluating...
              </>
            ) : (
              'Evaluate & Grade'
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-[800px] flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 shrink-0">Evaluation & Feedback</h3>
          <div className="flex-1 overflow-y-auto prose prose-green max-w-none">
            {feedback ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {feedback}
              </ReactMarkdown>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">
                The evaluation and grade will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
