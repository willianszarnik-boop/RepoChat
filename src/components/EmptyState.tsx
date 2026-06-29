import React from 'react';
import { Bot, Wrench, Settings, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center select-none animate-fade-in relative overflow-hidden" id="empty-state-container">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,9,138,0.03)_0%,transparent_60%)] pointer-events-none" id="empty-state-glow" />
      
      {/* Disassembled Robot Illustration */}
      <div className="relative mb-8 flex items-center justify-center h-40 w-40" id="empty-state-robot-wrapper">
        {/* Soft pulsing halo */}
        <div className="absolute inset-0 bg-brand-pink/5 rounded-full blur-2xl animate-pulse" id="empty-state-halo" />
        
        {/* Robot Head (Rotated & Tilted) */}
        <motion.div 
          id="empty-state-robot-head"
          className="absolute text-slate-500/80 drop-shadow-[0_0_15px_rgba(250,9,138,0.1)] z-10"
          initial={{ y: 0, rotate: -15 }}
          animate={{ 
            y: [-4, 4, -4],
            rotate: [-12, -18, -12]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <Bot size={72} strokeWidth={1.5} className="text-brand-pink/50" />
        </motion.div>

        {/* Separated Antenna/Screws/Gears (Floating) */}
        <motion.div 
          id="empty-state-settings-gear"
          className="absolute top-4 right-4 text-slate-600"
          animate={{ 
            y: [4, -4, 4],
            rotate: [0, 15, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Settings size={20} className="text-brand-pink/30 animate-spin" style={{ animationDuration: '10s' }} />
        </motion.div>

        <motion.div 
          id="empty-state-wrench"
          className="absolute bottom-6 left-2 text-slate-600"
          animate={{ 
            y: [-3, 3, -3],
            rotate: [15, -15, 15]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <Wrench size={24} className="text-brand-pink/40" />
        </motion.div>

        {/* Floating Sparks */}
        <motion.div 
          id="empty-state-sparks"
          className="absolute top-12 left-6 text-brand-pink/40"
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles size={16} />
        </motion.div>
      </div>

      {/* Message */}
      <h3 className="font-display font-light text-xl text-white tracking-tight" id="empty-state-title">
        Sem conteúdos aqui por enquanto
      </h3>
      <p className="text-xs text-slate-505 max-w-sm mt-2 leading-relaxed" id="empty-state-description">
        Nossa equipe de engenharia e suporte está preparando materiais incríveis para esta seção. Fique atento às novidades!
      </p>
    </div>
  );
}
