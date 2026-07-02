import React, { useState, useEffect } from 'react';
import { 
  PRESET_USEFUL_SITES, 
  PRESET_DRIVE_FOLDERS, 
  UsefulSite, 
  DriveFolder,
  DocArticle,
  TutorialVideo
} from './data/presets';
import UsefulSitesGrid from './components/UsefulSitesGrid';
import DriveFolderList from './components/DriveFolderList';
import DocumentationSection from './components/DocumentationSection';
import TutorialsSection from './components/TutorialsSection';
import { 
  FolderOpen, 
  Globe, 
  HelpCircle, 
  Database, 
  Sparkles, 
  Info, 
  ChevronRight, 
  ExternalLink, 
  BookOpen, 
  Video, 
  LogIn, 
  LogOut, 
  Lock, 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Check,
  Settings,
  Sun,
  Moon,
  UserPlus,
  Trash2,
  KeyRound,
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  seedInitialData,
  getSitesFromDb,
  saveSiteToDb,
  deleteSiteFromDb,
  getFoldersFromDb,
  saveFolderToDb,
  deleteFolderFromDb,
  getDocsFromDb,
  saveDocToDb,
  deleteDocFromDb,
  getTutorialsFromDb,
  saveTutorialToDb,
  deleteTutorialFromDb,
  getUsersFromDb,
  saveUserToDb,
  deleteUserFromDb,
  AppUser
} from './lib/firebase';

// Custom UpChat Logo using the official URL
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
  
  // State for dynamic additions synchronized with Firebase
  const [sites, setSites] = useState<UsefulSite[]>([]);
  const [folders, setFolders] = useState<DriveFolder[]>([]);
  const [docs, setDocs] = useState<DocArticle[]>([]);
  const [tutorials, setTutorials] = useState<TutorialVideo[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Theme Settings
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Admin & Modals state
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDbGuide, setShowDbGuide] = useState(false);
  
  // Login credentials state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // User Management state
  const [newUsername, setNewUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'editor' | 'user'>('user');
  const [userSuccess, setUserSuccess] = useState('');
  const [userError, setUserError] = useState('');
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(null);
  const [tempNewPassword, setTempNewPassword] = useState('');

  // Load from database on mount with automatic seeding
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Seed Firestore if collections are empty
        await seedInitialData(PRESET_USEFUL_SITES, PRESET_DRIVE_FOLDERS);
        
        // Load collections from Firestore
        const dbSites = await getSitesFromDb();
        const dbFolders = await getFoldersFromDb();
        const dbDocs = await getDocsFromDb();
        const dbTutorials = await getTutorialsFromDb();
        const dbUsers = await getUsersFromDb();
        
        setSites(dbSites);
        setFolders(dbFolders);
        setDocs(dbDocs);
        setTutorials(dbTutorials);
        setUsers(dbUsers);
      } catch (err) {
        console.error('Erro ao sincronizar com Firestore. Carregando dados locais...', err);
        // Fallback robusto usando localStorage ou presets padrão
        const savedSites = localStorage.getItem('mothership_sites');
        setSites(savedSites ? JSON.parse(savedSites) : PRESET_USEFUL_SITES);

        const savedFolders = localStorage.getItem('mothership_folders');
        setFolders(savedFolders ? JSON.parse(savedFolders) : PRESET_DRIVE_FOLDERS);

        const savedDocs = localStorage.getItem('mothership_docs');
        setDocs(savedDocs ? JSON.parse(savedDocs) : []);

        const savedTutorials = localStorage.getItem('mothership_tutorials');
        setTutorials(savedTutorials ? JSON.parse(savedTutorials) : []);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Load admin state
    const savedAdmin = localStorage.getItem('mothership_isAdmin');
    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }

    // Load theme state
    const savedTheme = localStorage.getItem('mothership_theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
    }
  }, []);

  // Sync theme to document body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const usernameClean = loginUser.trim().toLowerCase();
    const foundUser = users.find(u => u.username === usernameClean);

    if (usernameClean === 'admin' && loginPass === 'admin') {
      setIsAdmin(true);
      localStorage.setItem('mothership_isAdmin', 'true');
      setLoginError('');
      setLoginUser('');
      setLoginPass('');
      setShowLoginModal(false);
    } else if (foundUser && foundUser.password === loginPass) {
      const isUserAdmin = foundUser.role === 'admin';
      setIsAdmin(isUserAdmin);
      localStorage.setItem('mothership_isAdmin', isUserAdmin ? 'true' : 'false');
      setLoginError('');
      setLoginUser('');
      setLoginPass('');
      setShowLoginModal(false);
    } else {
      setLoginError('Usuário ou senha incorretos! Tente novamente.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('mothership_isAdmin');
  };

  // Theme Toggler
  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    localStorage.setItem('mothership_theme', nextTheme ? 'dark' : 'light');
  };

  // User Management Handlers
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername) return;

    setUserSuccess('');
    setUserError('');

    const usernameClean = newUsername.trim().toLowerCase();

    // Validate username input against firestore.rules and key constraints
    if (!/^[a-zA-Z0-9_\-]+$/.test(usernameClean)) {
      setUserError('O nome do usuário deve conter apenas letras, números, traços (-) ou sublinhados (_).');
      return;
    }

    if (usernameClean.length > 50) {
      setUserError('O nome do usuário não pode exceder 50 caracteres.');
      return;
    }

    // Check if username already exists
    if (users.some(u => u.username === usernameClean)) {
      setUserError(`O usuário "${usernameClean}" já está cadastrado.`);
      return;
    }

    const newUser: AppUser = {
      id: `user-${Date.now()}`,
      username: usernameClean,
      role: newUserRole,
      password: newUserPassword.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      await saveUserToDb(newUser);
      setUsers(prev => [...prev, newUser]);
      setUserSuccess(`Usuário "${usernameClean}" registrado com sucesso!`);
      setNewUsername('');
      setNewUserPassword('');
      setNewUserRole('user');
      setTimeout(() => setUserSuccess(''), 4000);
    } catch (err: any) {
      console.error('Erro ao registrar usuário no Firestore:', err);
      setUserError(`Falha ao registrar usuário: ${err.message || err}`);
    }
  };

  const handleResetPassword = async (userId: string, newPass: string) => {
    if (!newPass.trim()) {
      setUserError('A nova senha não pode ser vazia.');
      return;
    }
    setUserSuccess('');
    setUserError('');
    try {
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) return;
      const updatedUser = { ...userToUpdate, password: newPass.trim() };
      await saveUserToDb(updatedUser);
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      setUserSuccess(`Senha do usuário "${userToUpdate.username}" atualizada com sucesso!`);
      setResetPasswordUserId(null);
      setTempNewPassword('');
      setTimeout(() => setUserSuccess(''), 4000);
    } catch (err: any) {
      console.error('Erro ao resetar senha do usuário no Firestore:', err);
      setUserError(`Falha ao resetar senha: ${err.message || err}`);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (id === 'admin') return; // Impedir remoção do administrador padrão
    setUserSuccess('');
    setUserError('');
    try {
      await deleteUserFromDb(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      setUserSuccess('Usuário removido com sucesso!');
      setTimeout(() => setUserSuccess(''), 3000);
    } catch (err: any) {
      console.error('Erro ao deletar usuário do Firestore:', err);
      setUserError(`Falha ao remover usuário: ${err.message || err}`);
    }
  };

  // Useful sites handlers
  const handleAddSite = async (newSite: UsefulSite) => {
    const updated = [newSite, ...sites];
    setSites(updated);
    try {
      await saveSiteToDb(newSite);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSite = async (updatedSite: UsefulSite) => {
    const updated = sites.map(s => s.id === updatedSite.id ? updatedSite : s);
    setSites(updated);
    try {
      await saveSiteToDb(updatedSite);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSite = async (id: string) => {
    const updated = sites.filter(s => s.id !== id);
    setSites(updated);
    try {
      await deleteSiteFromDb(id);
    } catch (err) {
      console.error(err);
    }
  };

  // Folders handlers
  const handleAddFolder = async (newFolder: DriveFolder) => {
    const updated = [newFolder, ...folders];
    setFolders(updated);
    try {
      await saveFolderToDb(newFolder);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditFolder = async (updatedFolder: DriveFolder) => {
    const updated = folders.map(f => f.id === updatedFolder.id ? updatedFolder : f);
    setFolders(updated);
    try {
      await saveFolderToDb(updatedFolder);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    const updated = folders.filter(f => f.id !== id);
    setFolders(updated);
    try {
      await deleteFolderFromDb(id);
    } catch (err) {
      console.error(err);
    }
  };

  // Docs handlers
  const handleAddDoc = async (newDoc: DocArticle) => {
    const updated = [newDoc, ...docs];
    setDocs(updated);
    try {
      await saveDocToDb(newDoc);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    const updated = docs.filter(d => d.id !== id);
    setDocs(updated);
    try {
      await deleteDocFromDb(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditDoc = async (updatedDoc: DocArticle) => {
    const updated = docs.map(d => d.id === updatedDoc.id ? updatedDoc : d);
    setDocs(updated);
    try {
      await saveDocToDb(updatedDoc);
    } catch (err) {
      console.error(err);
    }
  };

  // Tutorials handlers
  const handleAddTutorial = async (newVideo: TutorialVideo) => {
    const updated = [newVideo, ...tutorials];
    setTutorials(updated);
    try {
      await saveTutorialToDb(newVideo);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTutorial = async (id: string) => {
    const updated = tutorials.filter(t => t.id !== id);
    setTutorials(updated);
    try {
      await deleteTutorialFromDb(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`min-h-screen font-sans antialiased relative overflow-x-hidden transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-brand-blue text-slate-300 selection:bg-brand-pink/30 selection:text-brand-pink' 
        : 'bg-[#f4f7fc] text-slate-700 selection:bg-brand-pink/10 selection:text-brand-pink'
    }`}>
      
      {/* Visual background accents - Atmospheric gradients depending on theme */}
      <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-opacity duration-500 ${
        isDarkMode ? 'bg-brand-pink/5 opacity-100' : 'bg-brand-pink/3 opacity-40'
      }`} />
      <div className={`absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none transition-opacity duration-500 ${
        isDarkMode ? 'bg-brand-pink/3 opacity-100' : 'bg-brand-pink/2 opacity-30'
      }`} />

      {/* Grid Pattern Background */}
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,#03085a_1px,transparent_1px),linear-gradient(to_bottom,#03085a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none transition-opacity ${
        isDarkMode ? 'opacity-35' : 'opacity-[0.04]'
      }`} />

      {/* Navigation Header bar with UpChat Branding */}
      <nav className={`border-b transition-colors duration-300 sticky top-0 z-40 ${
        isDarkMode 
          ? 'border-brand-pink/15 bg-[#000224]/90 backdrop-blur-md' 
          : 'border-slate-200 bg-white/90 backdrop-blur-md shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-pink to-[#ff47b6] p-[1.5px] shadow-lg shadow-brand-pink/10 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#00054f] rounded-[10px] flex items-center justify-center">
                <UpChatLogo />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-display font-bold text-base tracking-tight uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Repo<span className="text-brand-pink">Chat</span>
                </span>
                <span className="text-[9.5px] font-mono px-1.5 py-0.5 bg-brand-pink/10 border border-brand-pink/30 text-brand-pink rounded-md font-semibold tracking-wide uppercase">v2.0</span>
              </div>
              <p className={`text-[10px] font-mono tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>UPCHAT REPOSITORY & SUPPORT</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Status Button */}
            <button className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 border text-[11px] font-bold rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-brand-pink/10 border-brand-pink/20 text-brand-pink' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
            }`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-brand-pink' : 'bg-emerald-500'}`} />
              <span>Sistemas Ativos</span>
            </button>

            {/* Operations Panel */}
            <a 
              id="link-upchat"
              href="https://upchat-developers.github.io/mothership-dashboard/" 
              target="_blank" 
              rel="noreferrer"
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-semibold transition-all shadow-sm ${
                isDarkMode 
                  ? 'bg-[#050b69]/60 hover:bg-white/5 border-white/10 text-slate-300 hover:text-white' 
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-950'
              }`}
            >
              <span className="hidden sm:inline">Painel de Operação</span>
              <ExternalLink className="w-3.5 h-3.5 text-brand-pink shrink-0" />
            </a>

            {/* Admin Authentication Button - ALWAYS LAST ONE IN THE CORNER */}
            {isAdmin ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  id="btn-settings-gear"
                  onClick={() => setShowSettingsModal(true)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isDarkMode 
                      ? 'bg-slate-900/60 hover:bg-slate-800 border-white/10 text-slate-300 hover:text-white' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'
                  }`}
                  title="Configurações e Usuários"
                >
                  <Settings className="w-4 h-4" />
                </button>

                <button
                  id="btn-admin-logout"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  id="btn-settings-gear"
                  onClick={() => setShowSettingsModal(true)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isDarkMode 
                      ? 'bg-slate-900/60 hover:bg-slate-800 border-white/10 text-slate-300 hover:text-white' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'
                  }`}
                  title="Configurações e Usuários"
                >
                  <Settings className="w-4 h-4" />
                </button>

                <button
                  id="btn-admin-login-trigger"
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-brand-pink/10 hover:bg-brand-pink/25 text-brand-pink border border-brand-pink/25 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Acesso Restrito</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </nav>

      {/* Admin Mode Floating Banner */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-brand-pink to-[#ff47b6] py-2 px-4 text-center text-white text-xs font-bold tracking-wide shadow-md flex items-center justify-center gap-2 select-none relative z-35">
          <ShieldCheck className="w-4 h-4 text-white animate-bounce shrink-0" />
          <span>Modo Administrador Ativo: Criação de artigos, vídeos locais, controle de atalhos e usuários liberada.</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-pink/10 border border-brand-pink/20 rounded-full text-xs font-bold text-brand-pink tracking-wide mb-1 shadow-[0_0_15px_rgba(250,9,138,0.05)]">
            <Sparkles className="w-3.5 h-3.5 text-brand-pink animate-pulse" />
            <span>Repositório de Ajuda & Automações RepoChat</span>
          </div>
          <h1 className={`font-display font-light text-3xl sm:text-4xl tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Repositorio de <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-[#ff47b6]">implementação</span>
          </h1>
          <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Consulte rotas de APIs e scripts SQL, assista a vídeo-aulas práticas de configuração do UpChat, acesse pastas compartilhadas do Google Drive e use ferramentas selecionadas para acelerar seus chatbots ISP.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className={`flex flex-wrap sm:flex-nowrap justify-center p-1.5 border rounded-2xl max-w-2xl mx-auto shadow-sm gap-1 transition-colors ${
          isDarkMode ? 'bg-[#000224]/80 border-white/5' : 'bg-white border-slate-200'
        }`}>
          <button
            id="btn-main-tab-drive"
            onClick={() => setActiveMainTab('drive')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeMainTab === 'drive'
                ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/15 font-bold animate-pulse-once'
                : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
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
                : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
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
                : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
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
                : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Video className="w-4 h-4 shrink-0" />
            <span>Tutoriais</span>
          </button>
        </div>

        {/* Selected Tab Content Container */}
        <div className={`border rounded-3xl p-6 sm:p-8 min-h-[480px] shadow-sm relative transition-all ${
          isDarkMode ? 'bg-[#0b0e14]/40 border-white/5 shadow-black/40' : 'bg-white border-slate-200/90 shadow-slate-100'
        }`}>
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 font-mono text-xs text-brand-pink">
              <span className="w-8 h-8 rounded-full border-2 border-brand-pink border-t-transparent animate-spin" />
              <span>Sincronizando com Firestore...</span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              
              {activeMainTab === 'docs' && (
                <motion.div
                  key="tab-docs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="border-b border-white/5 pb-4">
                    <h3 className={`font-display font-semibold text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      <BookOpen className="w-5 h-5 text-brand-pink" />
                      <span>Guia de Documentação e Consultas Técnicas</span>
                    </h3>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Consulte as especificações detalhadas de endpoints, payloads JSON de webhooks e scripts SQL úteis.
                    </p>
                  </div>

                  <DocumentationSection 
                    articles={docs} 
                    onAddArticle={handleAddDoc} 
                    onDeleteArticle={handleDeleteDoc} 
                    onEditArticle={handleEditDoc} 
                    isAdmin={isAdmin} 
                  />
                </motion.div>
              )}

              {activeMainTab === 'tutorials' && (
                <motion.div
                  key="tab-tutorials"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="border-b border-white/5 pb-4">
                    <h3 className={`font-display font-semibold text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      <Video className="w-5 h-5 text-brand-pink" />
                      <span>Vídeos Tutoriais de Integração ISP</span>
                    </h3>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Aprenda passo-a-passo como carregar e mapear variáveis de banco nos fluxos do UpChat com tutoriais práticos em vídeo.
                    </p>
                  </div>

                  <TutorialsSection 
                    tutorials={tutorials} 
                    onAddTutorial={handleAddTutorial} 
                    onDeleteTutorial={handleDeleteTutorial} 
                    isAdmin={isAdmin} 
                  />
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
                  <div className="border-b border-white/5 pb-4">
                    <h3 className={`font-display font-semibold text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      <FolderOpen className="w-5 h-5 text-brand-pink" />
                      <span>Diretórios Compartilhados no Google Drive</span>
                    </h3>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Acesso imediato para os fluxos padrões SGP, HUBSOFT, IXC, Voalle, MK Solutions e outras integrações no UpChat.
                    </p>
                  </div>

                  <DriveFolderList 
                    folders={folders} 
                    onAddFolder={handleAddFolder} 
                    onEditFolder={handleEditFolder}
                    onDeleteFolder={handleDeleteFolder} 
                    isAdmin={isAdmin}
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
                  <div className="border-b border-white/5 pb-4">
                    <h3 className={`font-display font-semibold text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      <Globe className="w-5 h-5 text-brand-pink" />
                      <span>Links Úteis & Ferramentas Rápidas</span>
                    </h3>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Atalhos selecionados para apoiar o desenvolvimento de chatbots, depuração de JSONs, validação de webhooks e suporte diário.
                    </p>
                  </div>

                  <UsefulSitesGrid 
                    sites={sites} 
                    onAddSite={handleAddSite} 
                    onEditSite={handleEditSite}
                    onDeleteSite={handleDeleteSite} 
                    isAdmin={isAdmin}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Integration tips card */}
        <div className={`border rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors duration-300 ${
          isDarkMode ? 'bg-[#050b69]/40 border-white/5 shadow-md' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand-pink to-[#ff47b6]" />
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-pink/10 text-brand-pink rounded-2xl border border-brand-pink/20 mt-1 md:mt-0 shrink-0">
              <Info className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className={`font-display font-semibold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Está enfrentando dificuldades com integrações?</h4>
              <p className={`text-sm leading-relaxed max-w-2xl ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Nossos modelos padrões em JSON contêm variáveis globais configuradas por padrão. Para adaptá-las perfeitamente, acesse a aba <strong className="text-brand-pink">Documentação</strong> para consultar as especificações completas de cabeçalhos e payloads.
              </p>
            </div>
          </div>

          <a 
            id="btn-doc-upchat"
            href="https://upchat-developers.github.io/mothership-dashboard/" 
            target="_blank" 
            rel="noreferrer"
            className={`flex items-center gap-2 px-5 py-3 border rounded-2xl text-xs font-semibold tracking-wide transition-all shrink-0 cursor-pointer w-full md:w-auto justify-center ${
              isDarkMode 
                ? 'bg-[#000224] hover:bg-brand-pink text-slate-300 hover:text-white border-white/10' 
                : 'bg-[#f4f7fc] hover:bg-brand-pink hover:text-white border-slate-200 text-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4 text-brand-pink shrink-0" />
            <span>Ajuda Corporativa UpChat</span>
          </a>
        </div>

      </main>

      {/* Footer credits */}
      <footer className={`border-t py-8 mt-16 text-center text-xs font-mono transition-colors ${
        isDarkMode ? 'border-white/5 bg-[#0b0e14]/60 text-slate-500' : 'border-slate-200 bg-white text-slate-500'
      }`}>
        <p>© 2026 RepoChat • UpChat. Todos os direitos reservados.</p>
        <p className="mt-1 opacity-70">Centralizando informações, arquivos do Drive, manuais técnicos e capacitação para integradores ISP.</p>
      </footer>

      {/* Login Modal Popup */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#000236] border border-white/10 rounded-3xl w-full max-w-sm p-6 relative shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-pink" />

            <button
              id="btn-close-login"
              onClick={() => {
                setShowLoginModal(false);
                setLoginError('');
              }}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="p-3 bg-brand-pink/10 rounded-2xl border border-brand-pink/20 text-brand-pink mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Autenticação de Administrador</h3>
              <p className="text-xs text-slate-400 mt-1">Insira as credenciais para ativar o modo de edição dos repositórios</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold">
              {loginError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-400 mb-1">Usuário</label>
                <input
                  id="input-login-username"
                  type="text"
                  required
                  placeholder="admin"
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/20 transition-all text-xs"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Senha</label>
                <input
                  id="input-login-password"
                  type="password"
                  required
                  placeholder="admin"
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/20 transition-all text-xs"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                />
              </div>

              <button
                id="btn-login-submit"
                type="submit"
                className="w-full py-2.5 bg-brand-pink hover:bg-brand-pink/90 text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-brand-pink/10 mt-2"
              >
                Logar como Admin
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Global Config & User Settings Modal (Gear icon trigger) */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#000236] border border-white/10 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-pink" />

            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/5">
              <Settings className="w-5 h-5 text-brand-pink" />
              <div>
                <h3 className="font-display font-bold text-base text-white">Painel de Configuração Geral</h3>
                <p className="text-[10px] text-slate-400">Ajuste de temas e gerenciamento de usuários autorizados.</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-6 scrollbar-thin">
              
              {/* 1. Theme Configuration */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1">
                  <span>●</span> Aparência Visual
                </h4>
                <p className="text-[11px] text-slate-400">Alterne instantaneamente o visual do aplicativo entre o modo escuro imersivo ou claro clássico.</p>
                <div className="flex gap-4">
                  <button
                    onClick={toggleTheme}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      !isDarkMode 
                        ? 'bg-brand-pink border-brand-pink text-white shadow-lg shadow-brand-pink/10'
                        : 'bg-slate-950 border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span>Modo Claro</span>
                  </button>
                  <button
                    onClick={toggleTheme}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isDarkMode 
                        ? 'bg-brand-pink border-brand-pink text-white shadow-lg shadow-brand-pink/10'
                        : 'bg-slate-950 border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span>Modo Escuro</span>
                  </button>
                </div>
              </div>

              {/* 2. User Management section (Admin only view, or sign-in message) */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1">
                  <span>●</span> Gerenciador de Usuários corporativos
                </h4>
                
                {isAdmin ? (
                  <div className="space-y-4">
                    <p className="text-[11px] text-slate-400">Insira um novo nome de usuário corporativo e atribua uma função administrativa na nuvem.</p>
                    
                    {userSuccess && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[11px] flex items-center gap-2 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{userSuccess}</span>
                      </div>
                    )}

                    {userError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[11px] flex items-center gap-2 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span>{userError}</span>
                      </div>
                    )}

                    {/* Add User Form */}
                    <form onSubmit={handleCreateUser} className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
                        <div>
                          <label className="block text-slate-400 mb-1">Nome de Usuário</label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: joao.silva"
                            className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-pink/50 text-xs font-normal"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Senha</label>
                          <input
                            type="password"
                            required
                            placeholder="Defina a senha"
                            className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-pink/50 text-xs font-normal"
                            value={newUserPassword}
                            onChange={(e) => setNewUserPassword(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Função / Cargo</label>
                          <select
                            className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-pink/50 text-xs font-normal cursor-pointer"
                            value={newUserRole}
                            onChange={(e) => setNewUserRole(e.target.value as any)}
                          >
                            <option value="user">Colaborador / Editor</option>
                            <option value="admin">Administrador Geral</option>
                          </select>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 bg-brand-pink hover:bg-brand-pink/90 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Registrar Usuário</span>
                      </button>
                    </form>

                    {/* Users list */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] text-slate-500 font-mono font-bold uppercase">Membros Cadastrados ({users.length})</h5>
                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                        {users.map((u) => (
                          <div 
                            key={u.id}
                            className="flex flex-col p-2.5 bg-slate-950 border border-white/5 rounded-xl gap-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
                                <div>
                                  <span className="text-xs font-semibold text-slate-200 font-mono">{u.username}</span>
                                  <span className="text-[9px] text-slate-500 font-mono uppercase bg-white/5 px-1 rounded ml-2 border border-white/5">{u.role}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (resetPasswordUserId === u.id) {
                                      setResetPasswordUserId(null);
                                      setTempNewPassword('');
                                    } else {
                                      setResetPasswordUserId(u.id);
                                      setTempNewPassword(u.password || '');
                                    }
                                  }}
                                  className="p-1 text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
                                  title="Resetar Senha"
                                >
                                  <KeyRound className="w-3.5 h-3.5" />
                                </button>

                                {u.username !== 'admin' && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="p-1 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                                    title="Deletar Usuário"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {resetPasswordUserId === u.id && (
                              <div className="flex items-center gap-2 pt-1.5 border-t border-white/5 mt-1">
                                <input
                                  type="text"
                                  placeholder="Nova senha"
                                  className="flex-1 px-2.5 py-1 bg-slate-900 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/50 text-[11px]"
                                  value={tempNewPassword}
                                  onChange={(e) => setTempNewPassword(e.target.value)}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleResetPassword(u.id, tempNewPassword)}
                                  className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                                >
                                  Salvar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setResetPasswordUserId(null);
                                    setTempNewPassword('');
                                  }}
                                  className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg text-[10px] cursor-pointer"
                                >
                                  Cancelar
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="p-4 bg-brand-pink/5 border border-brand-pink/15 rounded-2xl flex items-start gap-3 text-slate-400 text-[11px] leading-relaxed">
                    <ShieldAlert className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white mb-0.5">Painel de Usuários Restrito</p>
                      <p>Somente administradores logados têm permissão para visualizar, conceder acesso e cadastrar novos usuários autorizados no banco de dados.</p>
                      <button
                        onClick={() => {
                          setShowSettingsModal(false);
                          setShowLoginModal(true);
                        }}
                        className="text-brand-pink hover:underline font-bold mt-1 block cursor-pointer"
                      >
                        Clique aqui para efetuar login administrativo &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            <div className="mt-6 pt-3 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-5 py-2 bg-brand-pink hover:bg-brand-pink/90 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-brand-pink/10 text-xs"
              >
                Concluir Ajustes
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Database Integration Guide Modal */}
      {showDbGuide && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#000236] border border-white/10 rounded-3xl w-full max-w-2xl p-6 relative shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-cyan-500" />

            <button
              onClick={() => setShowDbGuide(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 text-cyan-400 pb-3 border-b border-white/5">
              <Database className="w-6 h-6 animate-pulse" />
              <div>
                <h3 className="font-display font-bold text-lg text-white">Guia de Integração de Banco de Dados</h3>
                <p className="text-[11px] text-slate-400">Instruções para persistir pastas do Drive, sites úteis, documentos e vídeos na nuvem.</p>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto pr-1 space-y-6 text-xs text-slate-350 leading-relaxed scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              
              <div className="p-3.5 bg-cyan-500/5 border border-cyan-500/20 rounded-xl space-y-2">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Estratégia de Persistência Permanente
                </h4>
                <p>
                  Atualmente, as atualizações efetuadas na interface do RepoChat são guardadas no <strong>localStorage</strong> do seu navegador. 
                  Para torná-las globais e acessíveis a todos os usuários da empresa, você deve conectar o projeto a um serviço de nuvem resiliente.
                </p>
              </div>

              {/* Opção 1: Firebase */}
              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase text-[11.5px] tracking-wider text-brand-pink">Opção Recomendada 1: Firebase Firestore (NoSQL)</h4>
                <p>
                  Ideal pela facilidade e velocidade de integração com aplicações React em tempo real. O Firestore armazena dados em documentos e coleções com sincronização nativa.
                </p>
                <div className="bg-slate-950 p-3 rounded-xl border border-white/5 space-y-2">
                  <span className="font-mono text-cyan-400 block font-bold text-[10px]">1. Coleções & Esquemas JSON Sugeridos:</span>
                  <pre className="text-[10px] text-slate-400 font-mono overflow-x-auto whitespace-pre p-1">
{`// Coleção: "drive_folders"
{
  "id": "drive-custom-123",
  "name": "Modelos Voalle PDF",
  "description": "Documentos e manuais para integração Voalle.",
  "url": "https://drive.google.com/...",
  "category": "Voalle",
  "fileCount": 15
}

// Coleção: "useful_sites"
{
  "id": "site-custom-123",
  "name": "JSON Crack",
  "description": "Visualizador interativo de grafos JSON.",
  "url": "https://jsoncrack.com",
  "category": "Ferramentas",
  "iconName": "Braces"
}`}
                  </pre>
                </div>
              </div>

              {/* Opção 2: PostgreSQL */}
              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase text-[11.5px] tracking-wider text-brand-pink">Opção 2: PostgreSQL (Drizzle ORM ou Prisma)</h4>
                <p>
                  Excelente se você necessita de uma modelagem SQL relacional robusta. Você pode usar uma infraestrutura de container no Google Cloud Run acoplado ao <strong>Cloud SQL (PostgreSQL)</strong>.
                </p>
                <div className="bg-slate-950 p-3 rounded-xl border border-white/5 space-y-2">
                  <span className="font-mono text-cyan-400 block font-bold text-[10px]">Esquema de Tabelas SQL (PostgreSQL DDL):</span>
                  <pre className="text-[10px] text-slate-400 font-mono overflow-x-auto whitespace-pre p-1">
{`CREATE TABLE drive_folders (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  file_count INT DEFAULT 0
);

CREATE TABLE doc_articles (
  id VARCHAR(50) PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
                  </pre>
                </div>
              </div>

              {/* Salvando Arquivos */}
              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase text-[11.5px] tracking-wider text-brand-pink">Como Hospedar Documentos e Vídeos de Apoio</h4>
                <p>
                  Para hospedar os arquivos para download (PDFs, ZIPs) e vídeos dos Tutoriais, as melhores abordagens são:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-1.5 text-slate-400">
                  <li><strong>Google Cloud Storage ou Firebase Storage</strong>: Para uploads diretos e seguros de arquivos grandes com geração de URLs públicas de leitura.</li>
                  <li><strong>Vimeo / YouTube Embed</strong>: Para os tutoriais em vídeo, evite armazenar arquivos .mp4 puros no banco de dados. Adicione um campo <code>videoUrl</code> (Ex: ID do YouTube) e utilize o player de mídia correspondente ou o componente Iframe integrado para reprodução.</li>
                </ul>
              </div>

              {/* Código de Integração Backend */}
              <div className="space-y-2 pb-2">
                <h4 className="font-bold text-white uppercase text-[11.5px] tracking-wider text-cyan-400">3. Passos para Integrar no Código do RepoChat</h4>
                <p>
                  Configure uma rota de API no backend Express (como no seu <code>server.ts</code>) para interceptar os dados:
                </p>
                <pre className="bg-slate-950 p-3 rounded-xl border border-white/5 text-[10px] text-slate-400 font-mono overflow-x-auto whitespace-pre">
{`// No seu arquivo server.ts:
app.post("/api/drive-folders", async (req, res) => {
  const { name, url, category, description } = req.body;
  
  // Exemplo de gravação no banco de dados
  const newFolder = await db.insert(driveFolders).values({
    id: \`drive-custom-\${Date.now()}\`,
    name,
    url,
    category,
    description
  }).returning();

  res.json(newFolder);
});`}
                </pre>
              </div>

            </div>

            {/* Footer actions */}
            <div className="mt-6 pt-3 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setShowDbGuide(false)}
                className="px-5 py-2 bg-cyan-500 hover:bg-cyan-500/90 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-cyan-500/10 text-xs"
              >
                Entendi, Fechar Guia
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
