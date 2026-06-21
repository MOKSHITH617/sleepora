import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const LANG_CONFIG = {
  en: { code: 'en-IN', name: 'English', label: 'English', placeholder: 'Ask about mattresses or sofas...' },
  hi: { code: 'hi-IN', name: 'Hindi', label: 'हिन्दी', placeholder: 'मैट्रेस या सोफे के बारे में पूछें...' },
  te: { code: 'te-IN', name: 'Telugu', label: 'తెలుగు', placeholder: 'మ్యాట్రెస్ లేదా సోఫా గురించి అడగండి...' },
  ta: { code: 'ta-IN', name: 'Tamil', label: 'தமிழ்', placeholder: 'மெத்தை அல்லது சோபா பற்றி கேளுங்கள்...' },
  ml: { code: 'ml-IN', name: 'Malayalam', label: 'മലയാളം', placeholder: 'മെത്തകളെക്കുറിച്ചോ സോഫകളെക്കുറിച്ചോ ചോദിക്കുക...' },
  kn: { code: 'kn-IN', name: 'Kannada', label: 'ಕನ್ನಡ', placeholder: 'ಮ್ಯಾಟ್ರೆಸ್ ಅಥವಾ ಸೋಫಾ ಬಗ್ಗೆ ಕೇಳಿ...' }
};

const REDIRECT_KEYWORDS = [
  { path: '/products/mattresses', keywords: ['mattress', 'bed', 'orthopedic', 'foam', 'spring', 'gadda', 'गद्दा', 'మంచం', 'మెత్త', 'മെത്ത', 'ಮ್ಯಾಟ್ರೆಸ್'] },
  { path: '/products/sofas', keywords: ['sofa', 'recliner', 'couch', 'seating', 'सोफा', 'సోఫా', 'സോഫ', 'ಸೋಫಾ'] },
  { path: '/about', keywords: ['about', 'company', 'history', 'founder', 'story', 'कंपनी', 'గురించి', 'പറ്റി', 'ಬಗ್ಗೆ'] },
  { path: '/contact', keywords: ['contact', 'phone', 'email', 'support', 'help', 'inquiry', 'संपर्क', 'సహాయం', 'ബന്ധപ്പെടുക', 'ಸಂಪರ್ಕಿಸಿ'] },
  { path: '/warranty', keywords: ['warranty', 'guarantee', 'वारंटी', 'వారంటీ', 'വാറന്റി', 'ವಾರಂಟಿ'] },
  { path: '/stores', keywords: ['store', 'location', 'branch', 'outlet', 'address', 'दुकान', 'స్టోర్స్', 'കടകൾ', 'ಮಳಿಗೆಗಳು'] }
];

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [langKey, setLangKey] = useState('en');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am your sleep factory assistant. How can I help you today?',
      language: 'English'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [muteTTS, setMuteTTS] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [feedbackSent, setFeedbackSent] = useState({});

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechUtteranceRef = useRef(null);

  // Generate Session ID on load
  useEffect(() => {
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
  }, []);

  // Initialize Speech Recognition API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = LANG_CONFIG[langKey].code;

      rec.onstart = () => {
        setIsListening(true);
        setIsSpeaking(false);
        window.speechSynthesis.cancel(); // Stop talking when user speaks
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          handleSendMessage(transcript);
        }
      };

      rec.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [langKey]);

  // Handle Speech Recognition Lang Switch
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = LANG_CONFIG[langKey].code;
    }
  }, [langKey]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isListening, isSpeaking]);

  // Speech Recognition control
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Stop Text to Speech synthesis
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Text-To-Speech (TTS) response reader
  const speakText = (text, language) => {
    if (muteTTS) return;
    
    window.speechSynthesis.cancel(); // Cancel any current speech

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to match the best voice for the locale
    const voices = window.speechSynthesis.getVoices();
    const targetLocale = LANG_CONFIG[langKey].code;
    const matchingVoice = voices.find(v => v.lang.startsWith(targetLocale.substring(0, 2)));
    
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
    
    utterance.lang = targetLocale;
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Check query keywords for client-side routing redirects
  const checkRedirectKeywords = (text) => {
    const cleanText = text.toLowerCase();
    for (const item of REDIRECT_KEYWORDS) {
      for (const kw of item.keywords) {
        if (cleanText.includes(kw)) {
          navigate(item.path);
          return item.path;
        }
      }
    }
    return null;
  };

  // Core messaging controller
  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    setInputText('');
    stopSpeaking();

    // 1. Log user message in UI
    const userMsgId = `msg_user_${Date.now()}`;
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', content: text }]);

    // 2. Scan for instant client-side keyword redirects
    const localRedirect = checkRedirectKeywords(text);
    let navAlert = '';
    if (localRedirect) {
      navAlert = ` [Redirected to ${localRedirect}]`;
    }

    try {
      // 3. Make API request to RAG endpoint
      const response = await API.post('/ai/chat', {
        message: text,
        history: messages.map(m => ({ role: m.role, content: m.content })),
        sessionId
      });

      if (response.data.success) {
        const { response: aiText, redirect: aiRedirect, language: detectedLang } = response.data.data;
        const finalMsgId = response.data.logId || `msg_ai_${Date.now()}`;

        // 4. Log AI response
        setMessages(prev => [...prev, {
          id: finalMsgId,
          role: 'assistant',
          content: aiText + navAlert,
          language: detectedLang
        }]);

        // 5. Trigger client-side navigate if AI suggested one
        if (aiRedirect && !localRedirect) {
          navigate(aiRedirect);
        }

        // 6. Speak answer out loud
        speakText(aiText, detectedLang);
      }
    } catch (err) {
      console.error('Failed to query assistant endpoint:', err);
      setMessages(prev => [...prev, {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I am facing connectivity issues. Please try again later.'
      }]);
    }
  };

  // Submit log feedback ratings
  const handleRateResponse = async (logId, feedback) => {
    if (feedbackSent[logId]) return;

    try {
      await API.post('/ai/feedback', { logId, feedback });
      setFeedbackSent(prev => ({ ...prev, [logId]: feedback }));
    } catch (err) {
      console.error('Failed to submit accuracy rating:', err);
    }
  };

  return (
    <div className="fixed bottom-6 right-24 z-[1000] select-none font-sans">
      
      {/* MINIMIZED BUBBLE BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-br from-primary to-[#1E293B] hover:scale-110 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative border border-white/20 animate-bounce"
          aria-label="Open AI Assistant"
        >
          <span className="text-xl">💬</span>
          <span className="absolute -top-1.5 -right-1 bg-accent text-primary text-[8px] font-bold py-0.5 px-2 rounded-full shadow border border-white uppercase tracking-wider">
            AI
          </span>
        </button>
      )}

      {/* EXPANDED GLASSMORPHISM CONTAINER */}
      {isOpen && (
        <div className="w-[340px] md:w-[380px] h-[500px] backdrop-blur-md bg-white/80 border border-white/40 shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300">
          
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center border-b border-primary-light">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-[#B3860B] rounded-full flex items-center justify-center font-bold text-primary text-xs">
                TW
              </div>
              <div>
                <h4 className="font-display font-extrabold text-sm text-white leading-none">TimeWell Sleep Assistant</h4>
                <span className="text-[9px] text-accent/80 font-bold uppercase tracking-wider">Online Factory Outlets</span>
              </div>
            </div>

            {/* Language and Close Controls */}
            <div className="flex items-center gap-3">
              <select
                value={langKey}
                onChange={(e) => setLangKey(e.target.value)}
                className="bg-primary-light border border-white/20 text-white font-semibold text-[10px] py-1 px-1.5 rounded focus:outline-none cursor-pointer"
              >
                {Object.entries(LANG_CONFIG).map(([k, v]) => (
                  <option key={k} value={k} className="bg-primary text-white">{v.label}</option>
                ))}
              </select>

              <button 
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="text-white/60 hover:text-white text-base focus:outline-none"
                aria-label="Minimize Chat"
              >
                &times;
              </button>
            </div>
          </div>

          {/* Chat message listing area */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-bg-light/30">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl py-2.5 px-3.5 text-xs leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-white text-primary border border-border rounded-bl-none'
                  }`}
                >
                  <p>{m.content}</p>
                </div>
                
                {/* AI Feedback buttons (Rating System) */}
                {m.role === 'assistant' && m.id !== 'welcome' && (
                  <div className="flex items-center gap-2 mt-1.5 px-1">
                    <span className="text-[9px] text-text-muted">Was this helpful?</span>
                    <button
                      onClick={() => handleRateResponse(m.id, 'helpful')}
                      disabled={!!feedbackSent[m.id]}
                      className={`text-[10px] font-bold focus:outline-none hover:scale-110 transition-transform ${
                        feedbackSent[m.id] === 'helpful' ? 'text-green-500' : 'text-text-muted hover:text-green-500'
                      }`}
                    >
                      👍
                    </button>
                    <button
                      onClick={() => handleRateResponse(m.id, 'unhelpful')}
                      disabled={!!feedbackSent[m.id]}
                      className={`text-[10px] font-bold focus:outline-none hover:scale-110 transition-transform ${
                        feedbackSent[m.id] === 'unhelpful' ? 'text-red-500' : 'text-text-muted hover:text-red-500'
                      }`}
                    >
                      👎
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Listening Indicator */}
            {isListening && (
              <div className="flex items-center gap-2 text-[10px] text-primary font-semibold">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                Listening to your voice...
              </div>
            )}

            {/* Speaking/Typing Indicators */}
            {isSpeaking && (
              <div className="flex items-center gap-1.5 text-[9px] text-accent font-bold">
                🔊 Playing audio feedback...
                <button onClick={stopSpeaking} className="text-red-500 font-bold hover:underline">Stop</button>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Bottom Chat Input Form */}
          <div className="p-3 border-t border-border bg-white/90 flex items-center gap-2.5">
            {/* Mic Toggle Button */}
            <button
              onClick={toggleListening}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-bg-light hover:bg-border text-primary'
              }`}
              title="Speak voice query"
            >
              🎤
            </button>

            {/* TTS Mute Toggle */}
            <button
              onClick={() => {
                if (!muteTTS) stopSpeaking();
                setMuteTTS(!muteTTS);
              }}
              className={`text-xs px-1.5 py-1 rounded border border-border ${muteTTS ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}
              title={muteTTS ? "Unmute Speech synthesis" : "Mute Speech synthesis"}
            >
              {muteTTS ? "🔇" : "🔊"}
            </button>

            {/* Text Input Fallback */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={LANG_CONFIG[langKey].placeholder}
              className="flex-grow bg-bg-light border border-border rounded-full py-2 px-4 text-xs focus:outline-none text-primary"
            />

            <button
              onClick={() => handleSendMessage()}
              className="w-9 h-9 bg-primary hover:bg-primary-light text-white font-bold rounded-full flex items-center justify-center text-xs focus:outline-none"
              title="Send text query"
            >
              ➔
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
