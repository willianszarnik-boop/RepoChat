import React, { useState } from 'react';
import { PRESET_USEFUL_SITES, UsefulSite } from '../data/presets';
import { 
  Braces, 
  Cpu, 
  Code, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Globe, 
  Search, 
  X,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface UsefulSitesGridProps {
  sites: UsefulSite[];
  onAddSite: (site: UsefulSite) => void;
  onDeleteSite: (id: string) => void;
}

export default function UsefulSitesGrid({ sites, onAddSite, onDeleteSite }: UsefulSitesGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [showAddModal, setShowAddModal] = useState(false);

  // New site form state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState<UsefulSite['category']>('Ferramentas');

  const categories = ['Todos', 'Ferramentas', 'Desenvolvimento', 'IA & Produtividade', 'Marketing', 'Outros'];

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          site.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          site.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || site.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Braces': return <Braces className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Code': return <Code className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Ferramentas': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Desenvolvimento': return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
      case 'IA & Produtividade': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Marketing': return 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newUrl) return;

    // Ensure valid URL prefix
    let formattedUrl = newUrl;
    if (!/^https?:\/\//i.test(newUrl)) {
      formattedUrl = 'https://' + newUrl;
    }

    const newSite: UsefulSite = {
      id: `site-custom-${Date.now()}`,
      name: newName,
      description: newDesc || 'Sem descrição cadastrada.',
      url: formattedUrl,
      category: newCategory,
      iconName: 'Globe'
    };

    onAddSite(newSite);
    
    // Reset form and close
    setNewName('');
    setNewDesc('');
    setNewUrl('');
    setNewCategory('Ferramentas');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            id="search-sites"
            type="text"
            placeholder="Buscar site, ferramenta ou utilitário..."
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
            id={`tab-category-${category.toLowerCase().replace(/\s/g, '-')}`}
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeCategory === category
                ? 'bg-brand-pink text-white font-bold shadow-md shadow-brand-pink/15'
                : 'bg-[#00033b] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid of Cards */}
      {filteredSites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSites.map((site) => (
            <motion.div
              key={site.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#050b69]/40 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-brand-pink/40 hover:shadow-xl hover:shadow-brand-pink/5 transition-all duration-300 relative group overflow-hidden"
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-brand-pink/0 via-brand-pink/0 to-brand-pink/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#000224] border border-white/5 text-brand-pink group-hover:text-brand-pink group-hover:bg-[#00033b] transition-colors">
                      {getIcon(site.iconName)}
                    </div>
                    <div>
                      <h4 className="font-display font-medium text-slate-200 group-hover:text-white transition-colors text-base">
                        {site.name}
                      </h4>
                      <span className={`inline-block px-2 py-0.5 mt-1 rounded-md text-[10px] font-semibold tracking-wide ${getCategoryColor(site.category)}`}>
                        {site.category}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {site.id.startsWith('site-custom') && (
                      <button
                        id={`btn-del-site-${site.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSite(site.id);
                        }}
                        className="p-1.5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                        title="Excluir atalho"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-300 group-hover:text-slate-200 line-clamp-3 mb-4 leading-relaxed">
                  {site.description}
                </p>
              </div>

              {/* Action Button */}
              <a
                id={`link-site-${site.id}`}
                href={site.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center justify-center gap-1.5 px-4 py-2 bg-[#000236] hover:bg-brand-pink/15 text-slate-350 hover:text-brand-pink rounded-xl text-xs font-semibold border border-white/5 hover:border-brand-pink/30 transition-all cursor-pointer"
              >
                <span>Acessar Ferramenta</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-[#000224]/40 border border-white/5 rounded-xl">
          <Globe className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">Nenhum site útil encontrado.</p>
          <p className="text-slate-500 text-sm mt-1">Tente mudar o filtro ou faça outra busca!</p>
        </div>
      )}

      {/* Add Shortcut Modal */}
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
              id="btn-close-modal"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 hover:bg-[#000224] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display font-semibold text-lg text-white mb-4 flex items-center gap-2">
              <Sparkles className="text-brand-pink w-5 h-5 animate-pulse" />
              Novo Atalho Útil
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Nome da Ferramenta *
                </label>
                <input
                  id="input-site-name"
                  type="text"
                  required
                  placeholder="Ex: Json Viewer, Claude, Figma..."
                  className="w-full bg-[#000224] border border-white/10 focus:border-brand-pink/60 focus:outline-none focus:ring-1 focus:ring-brand-pink/30 text-slate-200 placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Categoria
                  </label>
                  <select
                    id="select-site-category"
                    className="w-full bg-[#000224] border border-white/10 focus:border-brand-pink/60 focus:outline-none focus:ring-1 focus:ring-brand-pink/30 text-slate-200 rounded-xl px-4 py-2.5 text-sm cursor-pointer"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as UsefulSite['category'])}
                  >
                    <option value="Ferramentas">Ferramentas</option>
                    <option value="Desenvolvimento">Desenvolvimento</option>
                    <option value="IA & Produtividade">IA & Produtividade</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Endereço URL (Link) *
                </label>
                <input
                  id="input-site-url"
                  type="text"
                  required
                  placeholder="Ex: https://claude.ai"
                  className="w-full bg-[#000224] border border-white/10 focus:border-brand-pink/60 focus:outline-none focus:ring-1 focus:ring-brand-pink/30 text-slate-200 placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Breve Descrição
                </label>
                <textarea
                  id="input-site-desc"
                  rows={3}
                  placeholder="Para que serve essa ferramenta? Como ajuda o time de chatbot?"
                  className="w-full bg-[#000224] border border-white/10 focus:border-brand-pink/60 focus:outline-none focus:ring-1 focus:ring-brand-pink/30 text-slate-200 placeholder:text-slate-600 rounded-xl p-3 text-sm resize-none"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  id="btn-cancel-site"
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border border-white/10 hover:bg-[#000224] text-slate-400 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-submit-site"
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-brand-pink hover:bg-brand-pink/90 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-brand-pink/10 cursor-pointer"
                >
                  Criar Atalho
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
