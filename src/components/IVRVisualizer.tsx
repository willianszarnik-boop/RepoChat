import React, { useState } from 'react';
import { IVRFlow, IVRNode } from '../data/presets';
import { 
  Play, 
  HelpCircle, 
  Settings, 
  HelpCircle as QuestionIcon, 
  CheckCircle, 
  ArrowDown, 
  ChevronRight, 
  MessageSquare,
  Network,
  GitCommit,
  GitBranch,
  Copy,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';

interface IVRVisualizerProps {
  flow: IVRFlow;
}

export default function IVRVisualizer({ flow }: IVRVisualizerProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('start');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedNode = flow.nodes.find(n => n.id === selectedNodeId) || flow.nodes[0];

  const handleCopyNodeText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getNodeTypeBadge = (type: IVRNode['type']) => {
    switch (type) {
      case 'menu':
        return <span className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase">Menu de Opções</span>;
      case 'input':
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase">Entrada de Dados</span>;
      case 'action':
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase">Ação / Integração API</span>;
      case 'condition':
        return <span className="bg-pink-500/10 text-pink-400 border border-pink-500/20 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase">Condicional</span>;
      case 'end':
        return <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase">Fim do Fluxo / Transbordo</span>;
    }
  };

  const getNodeStyle = (node: IVRNode) => {
    const isSelected = node.id === selectedNodeId;
    let borderStyle = isSelected ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-white/5 hover:border-white/10';
    let bgStyle = isSelected ? 'bg-[#161b22]' : 'bg-[#0b0e14]/65';

    switch (node.type) {
      case 'menu': return `${borderStyle} ${bgStyle} border-l-4 border-l-cyan-400`;
      case 'input': return `${borderStyle} ${bgStyle} border-l-4 border-l-purple-500`;
      case 'action': return `${borderStyle} ${bgStyle} border-l-4 border-l-amber-500`;
      case 'condition': return `${borderStyle} ${bgStyle} border-l-4 border-l-pink-500`;
      case 'end': return `${borderStyle} ${bgStyle} border-l-4 border-l-emerald-500`;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
      {/* Sidebar: List of Nodes */}
      <div className="lg:col-span-5 flex flex-col space-y-3 max-h-[580px] overflow-y-auto pr-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5 px-1">
          <Network className="w-3.5 h-3.5 text-cyan-400" />
          <span>Estrutura de Blocos ({flow.nodes.length})</span>
        </div>

        {flow.nodes.map((node, index) => (
          <button
            id={`btn-node-select-${node.id}`}
            key={node.id}
            onClick={() => setSelectedNodeId(node.id)}
            className={`w-full text-left p-3.5 rounded-xl border text-slate-200 transition-all cursor-pointer group flex items-start justify-between gap-3 ${getNodeStyle(node)}`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500 font-semibold">#{index + 1}</span>
                <span className="font-display font-medium text-sm group-hover:text-white transition-colors">
                  {node.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1 italic font-mono">
                {node.text}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              {getNodeTypeBadge(node.type)}
              {node.options && node.options.length > 0 && (
                <span className="text-[10px] text-slate-500">
                  {node.options.length} caminhos
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Main Panel: Node Details and Connections */}
      <div className="lg:col-span-7 bg-[#0f172a] border border-white/10 rounded-xl p-6 flex flex-col justify-between max-h-[580px] overflow-y-auto shadow-md">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold font-mono">Bloco Selecionado</span>
                {getNodeTypeBadge(selectedNode.type)}
              </div>
              <h4 className="font-display font-semibold text-lg text-white mt-1">
                {selectedNode.label}
              </h4>
            </div>

            {/* Quick copy block */}
            <button
              id={`btn-copy-node-text-${selectedNode.id}`}
              onClick={() => handleCopyNodeText(selectedNode.text, selectedNode.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161b22] hover:bg-white/5 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-white/10 transition-colors shadow-sm"
            >
              {copiedId === selectedNode.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Mensagem</span>
                </>
              )}
            </button>
          </div>

          {/* Prompt Message */}
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mensagem Enviada ao Cliente</span>
            </h5>
            <div className="bg-[#0b0e14] border border-white/5 rounded-xl p-4 font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed relative group select-all">
              {selectedNode.text}
            </div>
          </div>

          {/* Connections/Decisions */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-purple-400" />
              <span>Caminhos e Ramificações</span>
            </h5>

            {selectedNode.options && selectedNode.options.length > 0 ? (
              <div className="grid grid-cols-1 gap-2.5">
                {selectedNode.options.map((opt) => (
                  <div
                    key={opt.key}
                    className="flex items-center justify-between p-3 bg-[#0b0e14]/65 border border-white/5 rounded-xl group hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400 text-xs font-bold font-mono">
                        {opt.key}
                      </div>
                      <span className="text-sm text-slate-200 font-medium group-hover:text-white transition-colors">
                        {opt.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                      <button
                        id={`btn-go-node-${opt.targetId}`}
                        onClick={() => setSelectedNodeId(opt.targetId)}
                        className="px-3 py-1 bg-[#161b22] hover:bg-cyan-500 hover:text-slate-950 text-slate-400 rounded-lg text-xs font-medium border border-white/5 transition-all cursor-pointer"
                      >
                        Ir para: {flow.nodes.find(n => n.id === opt.targetId)?.label || opt.targetId}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-[#0b0e14]/40 border border-white/5 rounded-xl text-center">
                <GitCommit className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Este é um nó terminal (Fim do fluxo).</p>
                <p className="text-xs text-slate-500 mt-0.5">Nenhuma ramificação pendente.</p>
              </div>
            )}
          </div>
        </div>

        {/* Tip section */}
        <div className="mt-6 p-3.5 bg-[#0b0e14]/55 border border-white/5 rounded-xl flex items-start gap-2.5 text-xs text-slate-400 shadow-inner">
          <Settings className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-300">Dica de Configuração:</span> Este bloco representa uma lógica de automação no UpChat. Para testar a experiência real que o seu assinante terá com este bot, utilize o simulador interativo na barra ao lado!
          </div>
        </div>
      </div>
    </div>
  );
}
