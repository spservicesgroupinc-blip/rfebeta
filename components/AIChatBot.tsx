
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles, Bot, Minimize2 } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are the "RFE Foam Pro" AI Assistant. You are an expert on this Spray Foam Estimation & Management Platform.

**Your Goal:** Help contractors use the app to calculate estimates, manage inventory, and run their business.

**App Knowledge Base:**
1.  **Estimating:**
    *   Inputs: Length, Width, Height, Pitch, Metal Surface (+15%).
    *   Calculates: Board Feet (Area * Thickness).
    *   Outputs: Number of Chemical Sets needed (Open Cell yield ~16k bdft, Closed Cell yield ~4k bdft).
2.  **Inventory (Warehouse):**
    *   Tracks Open Cell & Closed Cell sets.
    *   Tracks miscellaneous items (tape, poly, etc.).
    *   **Equipment Tracker:** Tracks location of tools based on the last job they were assigned to.
3.  **Workflow:**
    *   Draft -> Work Order (Sold) -> Invoice -> Paid.
    *   **Work Orders:** Generated for the Crew. Hides pricing, shows scope & loads.
    *   **Invoicing:** Converts actual usage into a bill.
4.  **Crew App:**
    *   A simplified view for field teams.
    *   Features: Time Clock, Digital Work Order viewing, Mock Telemetry (Pressure/Strokes), Job Completion form.
5.  **Troubleshooting:**
    *   If a user asks about yield, explain that yield settings can be adjusted in "Settings".
    *   If a user asks about "Gun Down", suggest checking the "Equipment Tracker" or logging a maintenance note.

**Personality:** Professional, concise, knowledgeable about construction, and helpful. Keep responses short and direct.
`;

export const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    {role: 'model', text: "👋 Hi! I'm the RFE AI Assistant. Ask me about estimating, inventory, or how to use the app."}
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setIsLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Construct history for context (exclude the message we just added to UI state manually to avoid dupes if we were to map it immediately, 
        // but typically we pass previous history. Here we pass all *previous* messages).
        const history = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            },
            history: history
        });

        const result: GenerateContentResponse = await chat.sendMessage({ message: userMsg });
        const responseText = result.text;

        setMessages(prev => [...prev, {role: 'model', text: responseText || "I didn't get a response."}]);

    } catch (err) {
        console.error("Gemini Error:", err);
        setMessages(prev => [...prev, {role: 'model', text: "⚠️ I'm having trouble connecting to the RFE Intelligence Network. Please check your API Key or internet connection."}]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
        {/* FAB (Floating Action Button) */}
        {!isOpen && (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 bg-slate-900 hover:bg-brand text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 group border-2 border-white/10"
            >
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                <Sparkles className="w-6 h-6 animate-pulse group-hover:animate-none" />
            </button>
        )}

        {/* Chat Window */}
        {isOpen && (
            <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 w-[90vw] md:w-96 h-[500px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                
                {/* Header */}
                <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand rounded-lg">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">RFE Assistant</h3>
                            <div className="flex items-center gap-1.5 opacity-70">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                <span className="text-[10px] font-medium uppercase tracking-widest">Gemini Active</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <Minimize2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Messages Area */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
                >
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-slate-900 text-white rounded-tr-none' 
                                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-brand animate-spin" />
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Thinking...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 shrink-0">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about estimates, inventory..."
                            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand outline-none transition-all"
                            autoFocus
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-2 p-1.5 bg-brand text-white rounded-lg hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-[10px] text-center text-slate-400 mt-2 font-medium">
                        Powered by Google Gemini
                    </div>
                </form>
            </div>
        )}
    </>
  );
};
