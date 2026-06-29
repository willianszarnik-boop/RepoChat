import React, { useState, useEffect } from 'react';
import { 
  PRESET_USEFUL_SITES, 
  PRESET_DRIVE_FOLDERS, 
  UsefulSite, 
  DriveFolder 
} from './data/presets';
import UsefulSitesGrid from './components/UsefulSitesGrid';
import DriveFolderList from './components/DriveFolderList';
import DocumentationSection from './components/DocumentationSection';
import TutorialsSection from './components/TutorialsSection';
import EmptyState from './components/EmptyState';
import { 
  FolderOpen, 
  Globe, 
  HelpCircle, 
  Database, 
  Sparkles, 
  Info, 
  Bot, 
  Terminal, 
  FolderCheck,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Video,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Custom UpChat Logo using the official URL: https://upchat.com.br/wp-content/uploads/2026/05/png2-2.png
const UpChatLogo = () => (
  <img 
    src="https://i.ibb.co/S48g43tD/Camada-1-1-rmz080p4rox4riinvwntgvbwheserriego8hwd5zi8-1.png" 
    alt="UpChat Logo" 
    className="w-8 h-8 object-contain"
    referrerPolicy="no-referrer"
  />
);

export default function App() {
  const [activeMainTab, setActiveMainTab] = useState<'docs' | 'tutorials' | 'drive' | 'sites'>('drive');
  
  // State for dynamic additions with LocalStorage persistence
  const [sites, setSites] = useState<UsefulSite[]>([]);
  const [folders, setFolders] = useState<DriveFolder[]>([]);

  // Load from local storage
  useEffect(() => {
    const savedSites = localStorage.getItem('mothership_sites');
    if (savedSites) {
      setSites(JSON.parse(savedSites));
    } else {
      setSites(PRESET_USEFUL_SITES);
    }

    const savedFolders = localStorage.getItem('mothership_folders');
    if (savedFolders) {
      const parsed: DriveFolder[] = JSON.parse(savedFolders);
      // Migrate preset URLs to latest official ones
      const updated = parsed.map(folder => {
        const matchingPreset = PRESET_DRIVE_FOLDERS.find(p => p.id === folder.id);
        if (matchingPreset) {
          return { ...folder, url: matchingPreset.url };
        }
        return folder;
      });
      // Ensure new preset folders like 'drive-ia-intencao' are added
      PRESET_DRIVE_FOLDERS.forEach(preset => {
        if (!updated.some(folder => folder.id === preset.id)) {
          updated.push(preset);
        }
      });
      setFolders(updated);
      localStorage.setItem('mothership_folders', JSON.stringify(updated));
    } else {
      setFolders(PRESET_DRIVE_FOLDERS);
    }
  }, []);

  // Save sites to localStorage
  const handleAddSite = (newSite: UsefulSite) => {
    const updated = [newSite, ...sites];
    setSites(updated);
    localStorage.setItem('mothership_sites', JSON.stringify(updated));
  };

  const handleDeleteSite = (id: string) => {
    const updated = sites.filter(s => s.id !== id);
    setSites(updated);
    localStorage.setItem('mothership_sites', JSON.stringify(updated));
  };

  // Save folders to localStorage
  const handleAddFolder = (newFolder: DriveFolder) => {
    const updated = [newFolder, ...folders];
    setFolders(updated);
    localStorage.setItem('mothership_folders', JSON.stringify(updated));
  };

  const handleDeleteFolder = (id: string) => {
    const updated = folders.filter(f => f.id !== id);
    setFolders(updated);
    localStorage.setItem('mothership_folders', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-brand-blue text-slate-300 font-sans antialiased relative overflow-x-hidden selection:bg-brand-pink/30 selection:text-brand-pink">
      
      {/* Visual background accents - Sophisticated Brand Pink & Deep Blue Atmosphere */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-pink/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-brand-pink/3 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#03085a_1px,transparent_1px),linear-gradient(to_bottom,#03085a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* Navigation Header bar with UpChat Branding */}
      <nav className="border-b border-brand-pink/15 bg-[#000224]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-pink to-[#ff47b6] p-[1.5px] shadow-lg shadow-brand-pink/10 flex items-center justify-center">
              <div className="w-full h-full bg-[#00054f] rounded-[10px] flex items-center justify-center">
                <UpChatLogo />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-base tracking-tight text-white uppercase italic">Repo<span className="text-brand-pink">Chat</span></span>
                <span className="text-[9.5px] font-mono px-1.5 py-0.5 bg-brand-pink/10 border border-brand-pink/30 text-brand-pink rounded-md font-semibold tracking-wide uppercase">v1.5</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">UPCHAT REPOSITORY & SUPPORT</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden sm:inline-flex px-4 py-1.5 bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-xs font-bold rounded-lg hover:bg-brand-pink/20 transition-all">
              System: Online
            </button>
            <a 
              id="link-upchat"
              href="https://upchat-developers.github.io/mothership-dashboard/" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#050b69]/60 hover:bg-white/5 text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs font-medium transition-all shadow-sm"
            >
              <span>Painel de Operação</span>
              <ExternalLink className="w-3 h-3 text-brand-pink" />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-pink/10 border border-brand-pink/20 rounded-full text-xs font-bold text-brand-pink tracking-wide mb-1 shadow-[0_0_15px_rgba(250,9,138,0.05)]">
            <Sparkles className="w-3.5 h-3.5 text-brand-pink animate-pulse" />
            <span>Repositório de Ajuda & Automações RepoChat</span>
          </div>
          <h1 className="font-display font-light text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Repositorio de <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-[#ff47b6]">implementação</span>
          </h1>
          <p className="text-slate-350 text-sm sm:text-base leading-relaxed">
            Consulte rotas de APIs e scripts SQL, assista a vídeo-aulas práticas de configuração do UpChat, acesse pastas compartilhadas do Google Drive e use ferramentas selecionadas para acelerar seus chatbots ISP.
          </p>
        </div>

        {/* Tab Switcher - Centered Visual Buttons with UpChat Brand Pink Styling */}
        <div className="flex flex-wrap sm:flex-nowrap justify-center p-1.5 bg-[#000224]/80 border border-white/5 rounded-2xl max-w-2xl mx-auto shadow-inner gap-1">
          <button
            id="btn-main-tab-drive"
            onClick={() => setActiveMainTab('drive')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeMainTab === 'drive'
                ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/15 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderOpen className="w-4 h-4 shrink-0" />
            <span>Google Drive</span>
          </button>

          <button
            id="btn-main-tab-sites"
            onClick={() => setActiveMainTab('sites')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeMainTab === 'sites'
                ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/15 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span>Sites Úteis</span>
          </button>

          <button
            id="btn-main-tab-docs"
            onClick={() => setActiveMainTab('docs')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeMainTab === 'docs'
                ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/15 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Documentação</span>
          </button>

          <button
            id="btn-main-tab-tutorials"
            onClick={() => setActiveMainTab('tutorials')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeMainTab === 'tutorials'
                ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/15 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Video className="w-4 h-4 shrink-0" />
            <span>Tutoriais</span>
          </button>
        </div>

        {/* Selected Tab Content Container */}
        <div className="bg-[#0b0e14]/40 border border-white/5 rounded-3xl p-6 sm:p-8 min-h-[480px] shadow-2xl relative">
          <AnimatePresence mode="wait">
            {activeMainTab === 'docs' && (
              <motion.div
                key="tab-docs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <EmptyState />
              </motion.div>
            )}

            {activeMainTab === 'tutorials' && (
              <motion.div
                key="tab-tutorials"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <EmptyState />
              </motion.div>
            )}

            {activeMainTab === 'drive' && (
              <motion.div
                key="tab-drive"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-white/10 pb-4">
                  <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-brand-pink" />
                    <span>Diretórios Compartilhados no Google Drive</span>
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Acesso imediato para os fluxos padrões SGP, HUBSOFT, IXC, Voalle, MK Solutions e outras integrações no UpChat.
                  </p>
                </div>

                {/* Drive folder listing component */}
                <DriveFolderList 
                  folders={folders} 
                  onAddFolder={handleAddFolder} 
                  onDeleteFolder={handleDeleteFolder} 
                />
              </motion.div>
            )}

            {activeMainTab === 'sites' && (
              <motion.div
                key="tab-sites"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-white/10 pb-4">
                  <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-brand-pink" />
                    <span>Links Úteis & Ferramentas Rápidas</span>
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Atalhos selecionados para apoiar o desenvolvimento de chatbots, depuração de JSONs, validação de webhooks e suporte diário.
                  </p>
                </div>

                {/* Useful sites list component */}
                <UsefulSitesGrid 
                  sites={sites} 
                  onAddSite={handleAddSite} 
                  onDeleteSite={handleDeleteSite} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Integration tips card */}
        <div className="bg-[#050b69]/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand-pink to-[#ff47b6]" />
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-pink/10 text-brand-pink rounded-2xl border border-brand-pink/20 mt-1 md:mt-0">
              <Info className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-semibold text-white text-base">Está enfrentando dificuldades com integrações?</h4>
              <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                Nossos modelos padrões em JSON contêm variáveis globais configuradas por padrão. Para adaptá-las perfeitamente, acesse a aba <strong className="text-brand-pink">Documentação</strong> para consultar as especificações completas de cabeçalhos e payloads.
              </p>
            </div>
          </div>

          <a 
            id="btn-doc-upchat"
            href="https://upchat-developers.github.io/mothership-dashboard/" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-3 bg-[#000224] hover:bg-brand-pink text-slate-300 hover:text-white border border-white/10 rounded-2xl text-xs font-semibold tracking-wide transition-all shrink-0 cursor-pointer w-full md:w-auto justify-center"
          >
            <BookOpen className="w-4 h-4 text-brand-pink group-hover:text-white" />
            <span>Ajuda Corporativa UpChat</span>
          </a>
        </div>

      </main>

      {/* Footer credits */}
      <footer className="border-t border-white/5 bg-[#0b0e14]/60 py-8 mt-16 text-center text-slate-500 text-xs font-mono">
        <p>© 2026 RepoChat • UpChat. Todos os direitos reservados.</p>
        <p className="text-slate-600 mt-1">Centralizando informações, arquivos do Drive, manuais técnicos e capacitação para integradores ISP.</p>
      </footer>

    </div>
  );
}
