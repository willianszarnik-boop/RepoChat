import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Search, 
  ChevronRight, 
  Code, 
  Copy, 
  Check, 
  ArrowUpRight, 
  PlusCircle, 
  Trash2, 
  X, 
  FileText,
  Download,
  Image,
  Link,
  HelpCircle,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DocArticle } from '../data/presets';
import EmptyState from './EmptyState';
import { jsPDF } from 'jspdf';

interface DocumentationSectionProps {
  articles: DocArticle[];
  onAddArticle: (article: DocArticle) => void;
  onDeleteArticle: (id: string) => void;
  onEditArticle?: (article: DocArticle) => void;
  isAdmin?: boolean;
}

export default function DocumentationSection({ 
  articles, 
  onAddArticle, 
  onDeleteArticle, 
  onEditArticle,
  isAdmin = false 
}: DocumentationSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocArticle | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Geral');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  // Keep editorRef synced with newContent on modal open and initial render
  useEffect(() => {
    if (showAddModal) {
      if (!isEditMode) {
        setNewTitle('');
        setNewCategory('Geral');
        setNewSummary('');
        setNewContent('');
        setEditorMode('visual');
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
        }
      } else if (isEditMode && selectedDoc) {
        setNewTitle(selectedDoc.title);
        setNewCategory(selectedDoc.category);
        setNewSummary(selectedDoc.summary);
        setNewContent(selectedDoc.content);
        setEditorMode('visual');
        if (editorRef.current) {
          editorRef.current.innerHTML = selectedDoc.content;
        }
      }
    }
  }, [showAddModal, isEditMode, selectedDoc]);

  // Sync editor innerHTML when editorMode returns to visual
  useEffect(() => {
    if (editorMode === 'visual' && editorRef.current && editorRef.current.innerHTML !== newContent) {
      editorRef.current.innerHTML = newContent;
    }
  }, [editorMode, newContent]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    if (isEditMode && editingDocId) {
      const updatedArticle: DocArticle = {
        id: editingDocId,
        category: newCategory,
        title: newTitle,
        summary: newSummary || 'Artigo de documentação de suporte.',
        content: newContent
      };
      if (onEditArticle) {
        onEditArticle(updatedArticle);
      }
      setSelectedDoc(updatedArticle);
    } else {
      const newArticle: DocArticle = {
        id: `doc-custom-${Date.now()}`,
        category: newCategory,
        title: newTitle,
        summary: newSummary || 'Artigo de documentação de suporte.',
        content: newContent
      };
      onAddArticle(newArticle);
    }
    setShowAddModal(false);
    setIsEditMode(false);
    setEditingDocId(null);
  };

  // Helper to execute visual formatting commands inside WYSIWYG
  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setNewContent(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt('Digite o link de destino (Ex: https://example.com):');
    if (url) {
      if (editorRef.current) {
        editorRef.current.focus();
        try {
          document.execCommand('createLink', false, url);
        } catch (e) {
          console.error(e);
        }
        if (!editorRef.current.innerHTML.includes(url)) {
          const linkHtml = `<a href="${url}" target="_blank" rel="noreferrer" class="text-brand-pink hover:underline font-semibold inline-flex items-center gap-0.5">${url}</a>`;
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0 && editorRef.current.contains(selection.anchorNode)) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            const el = document.createElement("div");
            el.innerHTML = linkHtml;
            const frag = document.createDocumentFragment();
            let node;
            while ((node = el.firstChild)) {
              frag.appendChild(node);
            }
            range.insertNode(frag);
          } else {
            editorRef.current.innerHTML += linkHtml;
          }
        }
        setNewContent(editorRef.current.innerHTML);
      }
    }
  };

  const insertImage = () => {
    const url = prompt('Digite a URL da imagem (Ex: https://images.unsplash.com/...):');
    if (url) {
      if (editorRef.current) {
        editorRef.current.focus();
        try {
          document.execCommand('insertImage', false, url);
        } catch (e) {
          console.error(e);
        }
        if (!editorRef.current.innerHTML.includes(url)) {
          const imgHtml = `<img src="${url}" alt="Imagem" class="max-w-full h-auto rounded-lg my-3 border border-white/10" referrerPolicy="no-referrer" />`;
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0 && editorRef.current.contains(selection.anchorNode)) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            const el = document.createElement("div");
            el.innerHTML = imgHtml;
            const frag = document.createDocumentFragment();
            let node;
            while ((node = el.firstChild)) {
              frag.appendChild(node);
            }
            range.insertNode(frag);
          } else {
            editorRef.current.innerHTML += imgHtml;
          }
        }
        setNewContent(editorRef.current.innerHTML);
      }
    }
  };

  const isHtml = (str: string) => {
    const trimmed = str.trim();
    return trimmed.startsWith('<') || /<[a-z][\s\S]*>/i.test(trimmed);
  };

  // Premium PDF Generation
  const handleDownloadPdf = (article: DocArticle) => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const margin = 15;
    const pageWidth = pdf.internal.pageSize.width;
    const contentWidth = pageWidth - (margin * 2);

    // Decorative Header Band
    pdf.setFillColor(0, 2, 54); // Deep Navy (#000236)
    pdf.rect(0, 0, pageWidth, 42, 'F');

    // Header Text
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text("REPOCHAT - DOCUMENTACAO TECNICA ISP", margin, 18);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(250, 9, 138); // Brand pink (#fa098a)
    pdf.text(`CATEGORIA: ${article.category.toUpperCase()}`, margin, 26);

    pdf.setTextColor(180, 180, 210);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text(`Manual gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, margin, 32);

    // Document Title
    pdf.setTextColor(15, 23, 42); // Slate-900
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(15);
    const titleLines = pdf.splitTextToSize(article.title, contentWidth);
    let yPos = 55;
    pdf.text(titleLines, margin, yPos);
    yPos += (titleLines.length * 7) + 5;

    // Summary Box with Pink left accent
    pdf.setFillColor(248, 250, 252); // Soft Gray/Blue
    pdf.rect(margin, yPos, contentWidth, 18, 'F');
    
    // Left pink line
    pdf.setDrawColor(250, 9, 138); // Brand Pink
    pdf.setLineWidth(1);
    pdf.line(margin, yPos, margin, yPos + 18);

    pdf.setTextColor(71, 85, 105); // Slate-600
    pdf.setFont('helvetica', 'oblique');
    pdf.setFontSize(9);
    const summaryLines = pdf.splitTextToSize(`Resumo: ${article.summary}`, contentWidth - 6);
    pdf.text(summaryLines, margin + 4, yPos + 6);
    yPos += 26;

    // Content Parsing
    pdf.setTextColor(30, 41, 59); // Slate-800
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    let textToPrint = article.content;
    
    // If rich HTML, do basic markup stripping and tag conversion for printing
    if (isHtml(article.content)) {
      textToPrint = article.content
        .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n\n$1\n====================\n')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n\n$1\n--------------------\n')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n\n$1\n')
        .replace(/<li[^>]*>(.*?)<\/li>/gi, '\n• $1')
        .replace(/<ul[^>]*>/gi, '\n')
        .replace(/<\/ul>/gi, '\n')
        .replace(/<ol[^>]*>/gi, '\n')
        .replace(/<\/ol>/gi, '\n')
        .replace(/<p[^>]*>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<div[^>]*>/gi, '\n')
        .replace(/<\/div>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '\n[BLOCO DE CODIGO]\n$1\n[FIM BLOCO]\n')
        .replace(/<[^>]+>/g, '') // remove remaining tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
    }

    const lines = pdf.splitTextToSize(textToPrint, contentWidth);
    const pageHeight = pdf.internal.pageSize.height;

    for (let i = 0; i < lines.length; i++) {
      if (yPos > pageHeight - 20) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(lines[i], margin, yPos);
      yPos += 5.5; // line spacing
    }

    // Footnotes
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184); // Slate-400
    pdf.text("RepoChat • Central de Suporte & Automacao UpChat", margin, pageHeight - 10);
    pdf.text(`Pagina ${pdf.getNumberOfPages()}`, pageWidth - margin - 15, pageHeight - 10);

    // Save
    pdf.save(`manual_${article.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`);
  };

  const parseInlineMarkdown = (text: string) => {
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <a 
          key={match.index}
          href={match[2]} 
          target="_blank" 
          rel="noreferrer" 
          className="text-brand-pink hover:underline font-semibold inline-flex items-center gap-0.5"
        >
          {match[1]}
          <ArrowUpRight className="w-3 h-3 inline" />
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderContent = (contentStr: string) => {
    if (!contentStr) return null;

    // Check if rich HTML content from WYSIWYG
    if (isHtml(contentStr)) {
      return (
        <div 
          className="wysiwyg-content text-slate-350 text-sm leading-relaxed space-y-3 font-sans"
          dangerouslySetInnerHTML={{ __html: contentStr }}
        />
      );
    }
    
    // Markdown Fallback
    return (
      <div className="space-y-4">
        {contentStr.split('\n\n').map((block, index) => {
          const trimmed = block.trim();
          
          if (
            trimmed.startsWith('{') || 
            trimmed.startsWith('[') || 
            trimmed.includes('GET /') || 
            trimmed.includes('POST /') || 
            trimmed.startsWith('function ') ||
            trimmed.startsWith('const ') ||
            trimmed.startsWith('```')
          ) {
            const cleanText = trimmed.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '');
            return (
              <div key={index} className="relative group/code">
                <button
                  type="button"
                  onClick={() => handleCopy(cleanText)}
                  className="absolute top-3 right-3 text-[10px] text-slate-500 hover:text-white flex items-center gap-1 bg-[#000236] px-2.5 py-1 rounded border border-white/5 cursor-pointer z-10 opacity-0 group-hover/code:opacity-100 transition-opacity"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedText ? 'Copiado!' : 'Copiar'}</span>
                </button>
                <pre className="bg-[#000224] border border-white/10 rounded-xl p-4 overflow-x-auto text-[11px] font-mono text-brand-pink whitespace-pre">
                  {cleanText}
                </pre>
              </div>
            );
          }

          const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
          if (imgMatch) {
            return (
              <div key={index} className="my-4 rounded-xl overflow-hidden border border-white/10 bg-slate-950 p-1">
                <img src={imgMatch[2]} alt={imgMatch[1]} className="max-w-full max-h-[300px] object-cover mx-auto rounded-lg" referrerPolicy="no-referrer" />
                <span className="block text-center text-[10px] text-slate-500 mt-1 font-mono italic">{imgMatch[1]}</span>
              </div>
            );
          }

          return (
            <p key={index} className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {parseInlineMarkdown(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Buscar tópicos de documentação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#000224] border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/20 transition-all text-sm"
          />
        </div>

        {isAdmin && (
          <button
            id="btn-add-doc"
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-pink hover:bg-brand-pink/90 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-brand-pink/10 group cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Adicionar Artigo</span>
          </button>
        )}
      </div>

      {articles.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {/* Mini Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedDoc(article)}
                className="bg-[#050b69]/30 border border-white/10 hover:border-brand-pink/40 hover:shadow-lg hover:shadow-brand-pink/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 relative group cursor-pointer overflow-hidden"
              >
                {/* Visual glow element on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/0 to-brand-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  <div className="flex items-start justify-between mb-3 relative z-10">
                    {/* PDF icon badge */}
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-500">
                      <FileText className="w-5 h-5 shrink-0" />
                      <span className="text-[9px] font-bold tracking-wider uppercase font-mono bg-red-500/10 px-1 rounded">PDF</span>
                    </div>

                    {isAdmin && (
                      <button
                        id={`btn-del-doc-card-${article.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteArticle(article.id);
                        }}
                        className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Excluir Documento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 relative z-10">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wide font-semibold block">
                      {article.category}
                    </span>
                    <h4 className="font-display font-semibold text-slate-200 group-hover:text-white transition-colors text-xs leading-snug line-clamp-2">
                      {article.title}
                    </h4>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-3 mt-2 leading-relaxed relative z-10">
                    {article.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono relative z-10">
                  <span>Visualizar Manual</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <p className="text-center py-10 font-mono text-xs text-slate-500">Nenhum documento coincide com sua busca.</p>
          )}
        </div>
      )}

      {/* View Document Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#000236] border border-white/10 rounded-2xl w-full max-w-3xl p-6 md:p-8 relative shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-500" />

              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-500 font-mono text-[9px] rounded font-bold uppercase tracking-wider">
                    {selectedDoc.category}
                  </div>
                  <h3 className="font-display font-bold text-lg md:text-xl text-white mt-1 leading-snug">
                    {selectedDoc.title}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    {selectedDoc.summary}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setIsEditMode(true);
                        setEditingDocId(selectedDoc.id);
                        setShowAddModal(true);
                      }}
                      className="p-2 text-slate-350 hover:text-white hover:bg-cyan-500/10 rounded-xl transition-all flex items-center gap-1 text-xs font-semibold border border-white/10 cursor-pointer shadow bg-slate-950/40"
                      title="Editar Artigo"
                    >
                      <Edit className="w-4 h-4 text-cyan-400" />
                      <span>Editar</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDownloadPdf(selectedDoc)}
                    className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center gap-1 text-xs font-semibold border border-white/10 cursor-pointer shadow bg-slate-950/40"
                    title="Baixar Manual em PDF"
                  >
                    <Download className="w-4 h-4 text-brand-pink" />
                    <span>Baixar PDF</span>
                  </button>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer border border-white/5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Document Content */}
              <div className="overflow-y-auto pr-2 py-4 border-t border-b border-white/5 my-2 flex-1 scrollbar-thin">
                <div className="text-slate-300">
                  {renderContent(selectedDoc.content)}
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-3">
                <span>RepoChat Documentações</span>
                <span>Pressione ESC ou clique no X para fechar</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#000236] border border-white/10 rounded-2xl w-full max-w-2xl p-6 relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-pink" />

            <button
              onClick={() => {
                setShowAddModal(false);
                setIsEditMode(false);
                setEditingDocId(null);
              }}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 text-brand-pink border-b border-white/5 pb-2">
              <FileText className="w-5 h-5" />
              <h3 className="font-display font-bold text-base text-white">
                {isEditMode ? 'Editar Artigo de Documentação' : 'Criar Artigo de Documentação'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold flex-1 overflow-y-auto pr-1">
              <div>
                <label className="block text-slate-400 mb-1">Título do Artigo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Consultas de Débitos no ERP SGP"
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/20 transition-all text-sm font-normal"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Categoria</label>
                  <select
                    className="w-full px-3 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/20 transition-all cursor-pointer text-sm"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="Geral">Geral</option>
                    <option value="UpChat">UpChat</option>
                    <option value="Provedores">Provedores</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Resumo Rápido</label>
                  <input
                    type="text"
                    placeholder="Breve descrição da finalidade"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/20 transition-all text-sm font-normal"
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                  />
                </div>
              </div>

              <div>
                {/* Editor Tab bar and Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-white/10 rounded-t-xl bg-slate-950/80 p-2 gap-2">
                  <div className="flex bg-slate-900 rounded-lg p-0.5 border border-white/5 self-start">
                    <button
                      type="button"
                      onClick={() => setEditorMode('visual')}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-mono transition-all cursor-pointer ${
                        editorMode === 'visual' 
                          ? 'bg-brand-pink/10 text-brand-pink font-bold border border-brand-pink/20' 
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Visual (WYSIWYG)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode('code')}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-mono transition-all cursor-pointer ${
                        editorMode === 'code' 
                          ? 'bg-brand-pink/10 text-brand-pink font-bold border border-brand-pink/20' 
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Código (HTML)
                    </button>
                  </div>

                  {editorMode === 'visual' && (
                    <div className="flex flex-wrap items-center gap-1 text-slate-400">
                      <button
                        type="button"
                        onClick={() => execCommand('bold')}
                        className="p-1.5 hover:bg-white/5 hover:text-white rounded transition-all cursor-pointer"
                        title="Negrito"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCommand('italic')}
                        className="p-1.5 hover:bg-white/5 hover:text-white rounded transition-all cursor-pointer"
                        title="Itálico"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCommand('underline')}
                        className="p-1.5 hover:bg-white/5 hover:text-white rounded transition-all cursor-pointer"
                        title="Sublinhado"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                      <span className="h-4 w-[1px] bg-white/10 mx-1" />
                      <button
                        type="button"
                        onClick={() => execCommand('formatBlock', '<h1>')}
                        className="p-1.5 hover:bg-white/5 hover:text-white rounded transition-all cursor-pointer font-bold text-[10px] flex items-center"
                        title="Título 1"
                      >
                        <Heading1 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCommand('formatBlock', '<h2>')}
                        className="p-1.5 hover:bg-white/5 hover:text-white rounded transition-all cursor-pointer font-bold text-[10px] flex items-center"
                        title="Título 2"
                      >
                        <Heading2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="h-4 w-[1px] bg-white/10 mx-1" />
                      <button
                        type="button"
                        onClick={() => execCommand('insertUnorderedList')}
                        className="p-1.5 hover:bg-white/5 hover:text-white rounded transition-all cursor-pointer"
                        title="Lista com Marcadores"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCommand('insertOrderedList')}
                        className="p-1.5 hover:bg-white/5 hover:text-white rounded transition-all cursor-pointer"
                        title="Lista Numerada"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>
                      <span className="h-4 w-[1px] bg-white/10 mx-1" />
                      <button
                        type="button"
                        onClick={insertLink}
                        className="p-1.5 hover:bg-white/5 hover:text-white rounded transition-all cursor-pointer"
                        title="Inserir Link"
                      >
                        <Link className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={insertImage}
                        className="p-1.5 hover:bg-white/5 hover:text-white rounded transition-all cursor-pointer"
                        title="Inserir Imagem"
                      >
                        <Image className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Editor Content Area */}
                {editorMode === 'visual' ? (
                  <div
                    ref={editorRef}
                    contentEditable
                    onInput={(e) => setNewContent(e.currentTarget.innerHTML)}
                    placeholder="Comece a digitar e formate o artigo usando a barra superior de ferramentas..."
                    className="w-full px-4 py-3 bg-slate-950/60 border-l border-r border-b border-white/10 rounded-b-xl text-slate-200 font-sans text-sm outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/20 transition-all min-h-[250px] max-h-[350px] overflow-y-auto wysiwyg-editor"
                  />
                ) : (
                  <textarea
                    required
                    rows={11}
                    placeholder="Escreva seu artigo usando tags HTML (Ex: <h1>Título</h1><p>Parágrafo</p>)"
                    className="w-full px-4 py-3 bg-slate-950 border-l border-r border-b border-white/10 rounded-b-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/20 transition-all resize-none min-h-[250px]"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-pink hover:bg-brand-pink/95 text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-brand-pink/10 mt-4"
              >
                Salvar Artigo
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
