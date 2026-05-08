import React, { useEffect, useState } from 'react';
import { getGeminiClient } from '@/lib/gemini';
import { Mail, Send, Loader2, Copy, Check, Gamepad2 } from 'lucide-react';
import { NeuroQuestAssignment, buildQuestProgressEmail, loadActiveAssignment } from '@/lib/neuroquest';

export function EmailAssistant() {
  const [recipient, setRecipient] = useState('');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [isDrafting, setIsDrafting] = useState(false);
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState<NeuroQuestAssignment | null>(null);

  useEffect(() => {
    const active = loadActiveAssignment();
    if (active) setActiveAssignment(active);
  }, []);

  const generateEmail = async () => {
    if (!recipient || !topic) return;
    
    setIsDrafting(true);
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `Draft an email to ${recipient} about ${topic}. The tone should be ${tone}.`,
        config: {
          systemInstruction: "You are an AI assistant helping a teacher write emails. Keep the emails clear, polite, and well-structured.",
        }
      });
      setDraft(response.text || '');
    } catch (error) {
      console.error("Error drafting email:", error);
      setDraft("Failed to generate email draft.");
    } finally {
      setIsDrafting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Email Assistant</h2>
        <p className="text-gray-600">Quickly draft emails to students, parents, or faculty.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient (e.g., Parents of John, All Students)</label>
            <input 
              type="text" 
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Parents of 5th Grade"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic / Key Points</label>
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
              placeholder="Upcoming science fair, need volunteers, date is next Friday..."
            />
            {activeAssignment && (
              <button
                type="button"
                onClick={() => {
                  setRecipient('Parents and guardians');
                  setTone('encouraging');
                  setTopic(buildQuestProgressEmail(activeAssignment));
                }}
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
              >
                <Gamepad2 className="h-4 w-4" />
                Use NeuroQuest Progress Update
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
            <select 
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="professional">Professional & Formal</option>
              <option value="friendly">Friendly & Warm</option>
              <option value="urgent">Urgent & Important</option>
              <option value="encouraging">Encouraging & Supportive</option>
            </select>
          </div>

          <button
            onClick={generateEmail}
            disabled={isDrafting || !recipient || !topic}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isDrafting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Drafting...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Draft Email
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Generated Draft</h3>
            {draft && (
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200">
            {draft ? (
              <div className="whitespace-pre-wrap text-gray-800 font-sans">
                {draft}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">
                Your email draft will appear here.
              </div>
            )}
          </div>

          {draft && (
            <button className="mt-4 w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              Send Email (Simulated)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
