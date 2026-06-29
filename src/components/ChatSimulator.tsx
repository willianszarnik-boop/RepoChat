import React, { useState, useEffect, useRef } from 'react';
import { IVRFlow, IVRNode } from '../data/presets';
import { 
  Send, 
  RotateCcw, 
  MessageSquare, 
  Smartphone, 
  ChevronRight, 
  Check, 
  User, 
  Bot,
  Wifi,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatSimulatorProps {
  flow: IVRFlow;
}

interface Message {
  id: string;
  sender: 'bot' | 'user' | 'system';
  text: string;
  timestamp: string;
  options?: { key: string; label: string; targetId: string }[];
}

export default function ChatSimulator({ flow }: ChatSimulatorProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Restart chat whenever the selected flow changes
  useEffect(() => {
    restartChat();
  }, [flow]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const restartChat = () => {
    setCurrentNodeId('start');
    const startNode = flow.nodes.find(n => n.id === 'start');
    if (!startNode) return;

    setMessages([
      {
        id: 'system-start',
        sender: 'system',
        text: `Iniciando Simulação: ${flow.name}`,
        timestamp: getFormattedTime(),
      },
      {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: startNode.text,
        timestamp: getFormattedTime(),
        options: startNode.options,
      }
    ]);
  };

  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const advanceFlow = (targetNodeId: string, userResponseText: string) => {
    // Add user message
    const userMsgId = `user-${Date.now()}`;
    setMessages(prev => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: userResponseText,
        timestamp: getFormattedTime(),
      }
    ]);

    setCurrentNodeId(targetNodeId);
    setIsTyping(true);

    // Simulate bot delay
    setTimeout(() => {
      setIsTyping(false);
      const nextNode = flow.nodes.find(n => n.id === targetNodeId);
      if (!nextNode) return;

      // Handle intermediate auto-actions like API calls
      if (nextNode.type === 'action' || nextNode.type === 'condition') {
        const actionMsgId = `bot-${Date.now()}`;
        setMessages(prev => [
          ...prev,
          {
            id: actionMsgId,
            sender: 'bot',
            text: nextNode.text,
            timestamp: getFormattedTime(),
          }
        ]);

        // Auto-advance action nodes after another brief delay
        setTimeout(() => {
          // If action, pick the first option or run simulated branches
          if (nextNode.options && nextNode.options.length > 0) {
            // For simulation, let user choose which API result to simulate
            const apiOptionsMsg: Message = {
              id: `api-options-${Date.now()}`,
              sender: 'system',
              text: 'Simular Resposta da API:',
              timestamp: getFormattedTime(),
              options: nextNode.options,
            };
            setMessages(prev => [...prev, apiOptionsMsg]);
          }
        }, 1200);
      } else {
        // Normal Node (Menu, Input, End)
        const botMsgId = `bot-${Date.now()}`;
        setMessages(prev => [
          ...prev,
          {
            id: botMsgId,
            sender: 'bot',
            text: nextNode.text,
            timestamp: getFormattedTime(),
            options: nextNode.options,
          }
        ]);
      }
    }, 1000);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');

    const currentNode = flow.nodes.find(n => n.id === currentNodeId);
    if (!currentNode) return;

    // Check if we expect input options
    if (currentNode.options && currentNode.options.length > 0) {
      // Find matches with keys or matching words
      const matchedOption = currentNode.options.find(opt => 
        opt.key.toLowerCase() === text.toLowerCase() || 
        opt.label.toLowerCase().includes(text.toLowerCase())
      );

      if (matchedOption) {
        advanceFlow(matchedOption.targetId, matchedOption.label);
      } else {
        // Just advance to the first target or show system help
        const targetId = currentNode.options[0].targetId;
        advanceFlow(targetId, text);
      }
    } else {
      // End flow or no specific branch - loop or end
      restartChat();
    }
  };

  const handleOptionClick = (targetNodeId: string, label: string) => {
    advanceFlow(targetNodeId, label);
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0e14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative max-w-sm mx-auto">
      {/* Phone Notch/Design */}
      <div className="bg-[#161b22] px-4 py-2 flex items-center justify-between border-b border-white/5 shrink-0 select-none">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 font-mono">
          <span>09:41</span>
        </div>
        <div className="w-16 h-4 bg-[#0b0e14] rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 z-10 hidden sm:block" />
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Wifi className="w-3 h-3 text-cyan-400" />
          <span className="font-mono text-[10px]">5G</span>
        </div>
      </div>

      {/* Chat header */}
      <div className="bg-[#161b22]/90 backdrop-blur-md p-4 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-cyan-500/10">
            <Bot className="w-4.5 h-4.5" />
          </div>
          <div>
            <h5 className="text-sm font-semibold text-white tracking-wide leading-tight">
              Bot {flow.platform}
            </h5>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-medium">Autoatendimento</span>
            </div>
          </div>
        </div>

        <button
          id="btn-restart-simulator"
          onClick={restartChat}
          className="p-2 hover:bg-[#0b0e14] text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          title="Reiniciar simulação"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-[size:340px] opacity-95">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1.5">
            {msg.sender === 'system' ? (
              <div className="flex justify-center my-2">
                <span className="bg-[#0f172a]/95 border border-white/5 text-slate-400 text-[10px] font-mono px-3 py-1 rounded-full text-center">
                  {msg.text}
                </span>
              </div>
            ) : (
              <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-md text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-br-none font-semibold'
                      : 'bg-[#161b22]/95 border border-white/5 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {/* Message body */}
                  <p className="whitespace-pre-line text-sm break-words">{msg.text}</p>
                  
                  {/* Timestamp */}
                  <span className="block text-[9px] text-slate-500 text-right mt-1.5 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            )}

            {/* Interactive Options list if bot sent options */}
            {msg.sender !== 'user' && msg.options && msg.options.length > 0 && (
              <div className="flex flex-col gap-1.5 pl-4 max-w-[90%] mt-1">
                {msg.options.map((opt) => (
                  <button
                    id={`btn-sim-opt-${opt.key}`}
                    key={opt.key}
                    onClick={() => handleOptionClick(opt.targetId, opt.label)}
                    className="w-full text-left px-3.5 py-2.5 bg-[#161b22]/95 hover:bg-[#161b22] border border-white/5 hover:border-cyan-500/30 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-all cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-100 flex items-center justify-between"
                  >
                    <span className="line-clamp-1">{opt.key}. {opt.label}</span>
                    <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#161b22]/95 border border-white/5 rounded-2xl rounded-bl-none p-3 shadow-md">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input row */}
      <form onSubmit={handleSendMessage} className="p-3 bg-[#161b22] border-t border-white/5 flex items-center gap-2 shrink-0">
        <input
          id="input-sim-message"
          type="text"
          placeholder="Digite ou escolha uma opção..."
          className="flex-1 bg-[#0b0e14] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          id="btn-sim-send"
          type="submit"
          className="p-2.5 bg-gradient-to-br from-cyan-500 to-purple-600 hover:opacity-95 text-white rounded-xl transition-all shadow-md shadow-cyan-500/10 cursor-pointer active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
