import React, { useState } from 'react';
import { PRESET_DRIVE_FOLDERS, DriveFolder } from '../data/presets';
import { 
  Folder, 
  Search, 
  PlusCircle, 
  ExternalLink, 
  Trash2, 
  X,
  FileAudio,
  FolderTree,
  FileCode,
  FileJson,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface DriveFolderListProps {
  folders: DriveFolder[];
  onAddFolder: (folder: DriveFolder) => void;
  onDeleteFolder: (id: string) => void;
}

export default function DriveFolderList({ folders, onAddFolder, onDeleteFolder }: DriveFolderListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newFileCount, setNewFileCount] = useState<number>(0);
  const [newCategory, setNewCategory] = useState<DriveFolder['category']>('SGP');

  const categories = ['Todos', 'SGP', 'HUBSOFT', 'IXC', 'HUBSOFT 1.1', 'Voalle', 'MK Solutions', 'Outras integrações'];

  const filteredFolders = folders.filter(folder => {
    const matchesSearch = folder.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          folder.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || folder.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getFolderIcon = (category: DriveFolder['category']) => {
    switch (category) {
      case 'SGP':
        return <FolderTree className="w-5 h-5 text-brand-pink" />;
      case 'HUBSOFT':
        return <FileCode className="w-5 h-5 text-brand-pink" />;
      case 'IXC':
        return <FileJson className="w-5 h-5 text-brand-pink" />;
      case 'HUBSOFT 1.1':
        return <Sparkles className="w-5 h-5 text-brand-pink animate-pulse" />;
      case 'Voalle':
        return <Folder className="w-5 h-5 text-brand-pink" />;
      case 'MK Solutions':
        return <FileText className="w-5 h-5 text-brand-pink" />;
      default:
        return <Folder className="w-5 h-5 text-brand-pink" />;
    }
  };

  const getBadgeColor = (category: DriveFolder['category']) => {
    return 'bg-brand-pink/10 text-brand-pink border border-brand-pink/20';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newUrl) return;

    let formattedUrl = newUrl;
    if (!/^https?:\/\//i.test(newUrl)) {
      formattedUrl = 'https://' + newUrl;
    }

    const newFolder: DriveFolder = {
      id: `drive-custom-${Date.now()}`,
      name: newName,
      description: newDesc || 'Sem descrição cadastrada.',
      url: formattedUrl,
      fileCount: Number(newFileCount) || 0,
      category: newCategory,
    };

    onAddFolder(newFolder);

    // Reset Form
    setNewName('');
    setNewDesc('');
    setNewUrl('');
    setNewFileCount(0);
    setNewCategory('SGP');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            id="search-folders"
            type="text"
            placeholder="Buscar repositórios do Drive por nome, descrição..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#000224] border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-pink/60 focus:ring-1 focus:ring-brand-pink/30 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto">
        {categories.map((category) => (
          <button
            id={`tab-drive-category-${category.toLowerCase().replace(/\s/g, '-')}`}
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeCategory === category
                ? 'bg-brand-pink text-white shadow-md shadow-brand-pink/15 font-bold'
                : 'bg-[#00033b] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Folders List/Grid */}
      {filteredFolders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFolders.map((folder) => (
            <motion.div
              key={folder.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#050b69]/40 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-brand-pink/40 hover:shadow-xl hover:shadow-brand-pink/5 transition-all duration-300 relative group overflow-hidden"
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-brand-pink/0 via-brand-pink/0 to-brand-pink/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div>
                {/* Upper row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-[#000224] border border-white/5 text-brand-pink group-hover:bg-[#00033b] group-hover:text-brand-pink transition-all">
                      {getFolderIcon(folder.category)}
                    </div>
                    <div>
                      <h4 className="font-display font-medium text-slate-200 group-hover:text-white transition-colors text-base line-clamp-1">
                        {folder.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide ${getBadgeColor(folder.category)}`}>
                          {folder.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Option for Custom folders */}
                  {folder.id.startsWith('drive-custom') && (
                    <button
                      id={`btn-del-folder-${folder.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFolder(folder.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-all cursor-pointer"
                      title="Excluir vínculo da pasta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed mb-5 min-h-[40px] line-clamp-2">
                  {folder.description}
                </p>
              </div>

              {/* Direct Access Drive Button */}
              <a
                id={`btn-drive-link-${folder.id}`}
                href={folder.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-2 px-5 py-3 bg-[#000236] hover:bg-brand-pink text-brand-pink hover:text-white border border-brand-pink/20 hover:border-transparent rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>Acessar Pasta no Google Drive</span>
                </div>
                <ExternalLink className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-[#000224]/40 border border-white/5 rounded-xl">
          <FolderTree className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">Nenhuma pasta vinculada foi localizada.</p>
          <p className="text-slate-500 text-sm mt-1">Clique em "Vincular Pasta do Drive" para cadastrar um novo repositório!</p>
        </div>
      )}

      {/* Add Drive Link Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#000236] border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl overflow-hidden"
          >
            {/* Design detail */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-pink" />

            <button
              id="btn-close-folder-modal"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 hover:bg-[#000224] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display font-semibold text-lg text-white mb-4 flex items-center gap-2">
              <Sparkles className="text-brand-pink w-5 h-5 animate-pulse" />
              Vincular Repositório do Drive
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Nome do Repositório *
                </label>
                <input
                  id="input-folder-name"
                  type="text"
                  required
                  placeholder="Ex: Áudios IVR - Provedor X, Modelos SGP XML..."
                  className="w-full bg-[#000224] border border-white/10 focus:border-brand-pink/60 focus:outline-none focus:ring-1 focus:ring-brand-pink/30 text-slate-200 placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Categoria
                  </label>
                  <select
                    id="select-folder-category"
                    className="w-full bg-[#000224] border border-white/10 focus:border-brand-pink/60 focus:outline-none focus:ring-1 focus:ring-brand-pink/30 text-slate-200 rounded-xl px-3 py-2.5 text-sm cursor-pointer"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as DriveFolder['category'])}
                  >
                    <option value="SGP">SGP</option>
                    <option value="HUBSOFT">HUBSOFT</option>
                    <option value="IXC">IXC</option>
                    <option value="HUBSOFT 1.1">HUBSOFT 1.1</option>
                    <option value="Voalle">Voalle</option>
                    <option value="MK Solutions">MK Solutions</option>
                    <option value="Outras integrações">Outras integrações</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Qtd de Arquivos
                  </label>
                  <input
                    id="input-folder-file-count"
                    type="number"
                    min={0}
                    placeholder="Ex: 12"
                    className="w-full bg-[#000224] border border-white/10 focus:border-brand-pink/60 focus:outline-none focus:ring-1 focus:ring-brand-pink/30 text-slate-200 placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm"
                    value={newFileCount || ''}
                    onChange={(e) => setNewFileCount(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Link Compartilhado do Google Drive *
                </label>
                <input
                  id="input-folder-url"
                  type="text"
                  required
                  placeholder="Ex: https://drive.google.com/drive/folders/..."
                  className="w-full bg-[#000224] border border-white/10 focus:border-brand-pink/60 focus:outline-none focus:ring-1 focus:ring-brand-pink/30 text-slate-200 placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Descrição do Conteúdo
                </label>
                <textarea
                  id="input-folder-desc"
                  rows={3}
                  placeholder="Descreva quais arquivos são encontrados nessa pasta e para quais clientes ela serve."
                  className="w-full bg-[#000224] border border-white/10 focus:border-brand-pink/60 focus:outline-none focus:ring-1 focus:ring-brand-pink/30 text-slate-200 placeholder:text-slate-600 rounded-xl p-3 text-sm resize-none"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  id="btn-cancel-folder"
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border border-white/10 hover:bg-[#000224] text-slate-400 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-submit-folder"
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-brand-pink hover:bg-brand-pink/90 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-brand-pink/10 cursor-pointer"
                >
                  Vincular Pasta
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
