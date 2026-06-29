import React, { useState } from 'react';
import { PRESET_IVR_FLOWS, IVRFlow } from '../data/presets';
import IVRVisualizer from './IVRVisualizer';
import ChatSimulator from './ChatSimulator';
import { 
  Network, 
  Smartphone, 
  Search, 
  Calendar, 
  User, 
  FileText, 
  ExternalLink, 
  Layers, 
  ChevronRight, 
  Code,
  BookOpen,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IVRFlowsSectionProps {
  flows: IVRFlow[];
}

export default function IVRFlowsSection({ flows }: IVRFlowsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('Todos');
  const [selectedFlowId, setSelectedFlowId] = useState<string>(flows[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'flowchart' | 'simulator'>('flowchart');

  const platforms = ['Todos', 'Hubsoft', 'IXC', 'SGP', 'Geral'];

  const filteredFlows = flows.filter(flow => {
    const matchesSearch = flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          flow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          flow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPlatform = selectedPlatform === 'Todos' || flow.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const selectedFlow = flows.find(f => f.id === selectedFlowId) || filteredFlows[0] || flows[0];

  const getPlatformStyle = (platform: IVRFlow['platform']) => {
    switch (platform) {
      case 'Hubsoft':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'IXC':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'SGP':
        return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Left Column: Flow List & Search */}
      <div className="xl:col-span-4 space-y-4 max-h-[640px] xl:overflow-y-auto pr-1">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            id="search-flows"
            type="text"
            placeholder="Buscar fluxos por nome, tags..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#0b0e14] border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              // Auto-select first in filtered list if active selection is lost
              const filtered = flows.filter(f => {
                const matchS = f.name.toLowerCase().includes(e.target.value.toLowerCase()) || f.description.toLowerCase().includes(e.target.value.toLowerCase());
                const matchP = selectedPlatform === 'Todos' || f.platform === selectedPlatform;
                return matchS && matchP;
              });
              if (filtered.length > 0 && !filtered.some(f => f.id === selectedFlowId)) {
                setSelectedFlowId(filtered[0].id);
              }
            }}
          />
        </div>

        {/* Platform selection pills */}
        <div className="flex flex-wrap gap-1.5 pb-1">
          {platforms.map((platform) => (
            <button
              id={`tab-platform-${platform.toLowerCase()}`}
              key={platform}
              onClick={() => {
                setSelectedPlatform(platform);
                const filtered = flows.filter(f => {
                  const matchS = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.description.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchP = platform === 'Todos' || f.platform === platform;
                  return matchS && matchP;
                });
                if (filtered.length > 0) {
                  setSelectedFlowId(filtered[0].id);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedPlatform === platform
                  ? 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white shadow-sm shadow-cyan-500/20'
                  : 'bg-[#161b22] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>

        {/* Flows list */}
        <div className="space-y-2.5">
          {filteredFlows.length > 0 ? (
            filteredFlows.map((flow) => (
              <button
                id={`btn-flow-select-${flow.id}`}
                key={flow.id}
                onClick={() => setSelectedFlowId(flow.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  selectedFlowId === flow.id
                    ? 'bg-[#161b22] border-cyan-500/70 shadow-md shadow-cyan-950/15 ring-1 ring-cyan-500/20'
                    : 'bg-[#0b0e14]/50 border-white/5 hover:border-white/10 hover:bg-[#161b22]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getPlatformStyle(flow.platform)}`}>
                      {flow.platform}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {flow.updatedAt}
                    </span>
                  </div>

                  <h4 className="font-display font-medium text-sm text-slate-200 hover:text-white transition-colors line-clamp-1 mb-1.5">
                    {flow.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {flow.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {flow.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0f172a] text-slate-400 border border-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-10 bg-[#0f172a]/30 rounded-xl border border-white/5">
              <Layers className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Nenhum fluxo encontrado.</p>
              <p className="text-xs text-slate-500 mt-1">Experimente remover os filtros.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Detailed Flow visualization */}
      {selectedFlow ? (
        <div className="xl:col-span-8 space-y-6">
          {/* Detailed Header Card */}
          <div className="bg-[#0f172a]/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Layers className="w-32 h-32 text-cyan-500" />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getPlatformStyle(selectedFlow.platform)}`}>
                    {selectedFlow.platform}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <User className="w-3.5 h-3.5" />
                    <span>{selectedFlow.author}</span>
                  </div>
                </div>
                <h3 className="font-display font-semibold text-xl text-white">
                  {selectedFlow.name}
                </h3>
              </div>

              {/* Direct Link to Google Drive of this Flow */}
              <a
                id={`btn-flow-drive-link-${selectedFlow.id}`}
                href={selectedFlow.driveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 hover:border-transparent rounded-xl text-xs font-semibold transition-all self-start shadow-sm"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Ver Arquivos do Fluxo no Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-350 leading-relaxed mt-4">
              {selectedFlow.description}
            </p>
          </div>

          {/* Interactive tabs toggle (Flowchart / Simulator) */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex gap-4">
              <button
                id="btn-tab-flowchart"
                onClick={() => setActiveTab('flowchart')}
                className={`pb-2.5 text-sm font-semibold relative transition-colors cursor-pointer ${
                  activeTab === 'flowchart' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Network className="w-4 h-4" />
                  <span>Fluxograma Lógico</span>
                </div>
                {activeTab === 'flowchart' && (
                  <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                )}
              </button>

              <button
                id="btn-tab-simulator"
                onClick={() => setActiveTab('simulator')}
                className={`pb-2.5 text-sm font-semibold relative transition-colors cursor-pointer ${
                  activeTab === 'simulator' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>Simulador de WhatsApp</span>
                </div>
                {activeTab === 'simulator' && (
                  <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                )}
              </button>
            </div>
          </div>

          {/* Display Interactive section */}
          <div>
            {activeTab === 'flowchart' ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <IVRVisualizer flow={selectedFlow} />

                {/* Configuration Guide / Manual Card */}
                <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6 space-y-4">
                  <h4 className="font-display font-semibold text-base text-white flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-cyan-400" />
                    <span>Manual de Configuração & Parâmetros API</span>
                  </h4>
                  <div className="prose prose-invert prose-sm text-slate-300 max-w-none leading-relaxed whitespace-pre-wrap font-sans">
                    {selectedFlow.configurationGuide}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
              >
                {/* Simulator device column */}
                <div className="md:col-span-5">
                  <ChatSimulator flow={selectedFlow} />
                </div>

                {/* Simulation instructions column */}
                <div className="md:col-span-7 bg-[#0f172a] border border-white/10 rounded-xl p-6 space-y-4 shadow-sm">
                  <h4 className="font-display font-semibold text-base text-white flex items-center gap-2">
                    <Code className="w-4.5 h-4.5 text-cyan-400" />
                    <span>Lógica Conversacional do Teste</span>
                  </h4>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    Você está interagindo com o simulador em tempo real. O chatbot simula as requisições API consultando os dados estruturados do seu provedor. 
                  </p>

                  <div className="space-y-3.5">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 text-xs font-bold font-mono mt-0.5">1</div>
                      <div>
                        <h5 className="text-sm font-semibold text-slate-200">Digitação de Inputs</h5>
                        <p className="text-xs text-slate-400 mt-0.5">O bot solicitará dados (como o CPF do titular). Você pode digitar qualquer valor e enviar para simular a resposta.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 text-xs font-bold font-mono mt-0.5">2</div>
                      <div>
                        <h5 className="text-sm font-semibold text-slate-200">Menu de Seleção Rápida</h5>
                        <p className="text-xs text-slate-400 mt-0.5">Quando menus forem apresentados, você pode digitar o número da opção desejada no input de texto ou clicar nos botões que aparecem logo abaixo da mensagem do bot.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 text-xs font-bold font-mono mt-0.5">3</div>
                      <div>
                        <h5 className="text-sm font-semibold text-slate-200">Lógicas de API e Bifurcação</h5>
                        <p className="text-xs text-slate-400 mt-0.5">Nas etapas que consultam APIs (Hubsoft / SGP / IXC), o simulador pausará e apresentará opções em cinza para você escolher o resultado da simulação (como se o cliente estivesse "Em dia" ou "Em atraso", "Online" ou "Offline"). Isso ajuda a validar as duas ramificações!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <div className="xl:col-span-8 text-center py-24 bg-[#0f172a]/40 rounded-xl border border-white/5">
          <Layers className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h4 className="font-display font-semibold text-lg text-slate-400">Nenhum fluxo selecionado</h4>
          <p className="text-slate-500 text-sm mt-1">Selecione um fluxo na barra lateral ou altere as opções de busca.</p>
        </div>
      )}
    </div>
  );
}
