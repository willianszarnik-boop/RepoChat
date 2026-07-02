import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  PlayCircle,
  FileText,
  User,
  Activity,
  ArrowRight,
  PlusCircle,
  Trash2,
  X,
  Upload,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TutorialVideo } from '../data/presets';
import EmptyState from './EmptyState';

interface TutorialsSectionProps {
  tutorials: TutorialVideo[];
  onAddTutorial: (video: TutorialVideo) => void;
  onDeleteTutorial: (id: string) => void;
  isAdmin?: boolean;
}

export default function TutorialsSection({
  tutorials,
  onAddTutorial,
  onDeleteTutorial,
  isAdmin = false
}: TutorialsSectionProps) {
  const [selectedPlaylist, setSelectedPlaylist] = useState('Todas');
  const [activeVideo, setActiveVideo] = useState<TutorialVideo | null>(null);
  
  // Media Player States (inside modal)
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreenSimulated, setIsFullscreenSimulated] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Automação');
  const [newPlaylist, setNewPlaylist] = useState('Início Rápido');
  const [newInstructor, setNewInstructor] = useState('Suporte Técnico');
  const [newDifficulty, setNewDifficulty] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Iniciante');
  const [newDescription, setNewDescription] = useState('');
  const [newTakeaways, setNewTakeaways] = useState('');
  const [newThumbnailUrl, setNewThumbnailUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto playlists extractor
  const playlists = ['Todas', ...Array.from(new Set(tutorials.map(t => t.playlist || t.category || 'Geral')))];

  // Filtered tutorials based on selected playlist
  const filteredTutorials = selectedPlaylist === 'Todas' 
    ? tutorials 
    : tutorials.filter(t => (t.playlist || t.category) === selectedPlaylist);

  // Playback timer effect for simulated videos
  useEffect(() => {
    if (!activeVideo) return;
    const isUploadedVideo = !!activeVideo.videoUrl;

    if (isPlaying && !isUploadedVideo) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prevTime) => {
          const nextTime = prevTime + playbackSpeed;
          if (nextTime >= activeVideo.duration) {
            setIsPlaying(false);
            return activeVideo.duration;
          }
          return nextTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, activeVideo?.duration, activeVideo?.videoUrl]);

  // Handle speed changes on HTML5 video ref
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, activeVideo?.id]);

  // Handle volume changes on HTML5 video ref
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted, activeVideo?.id]);

  // Open video in cinema lightbox mode
  const handleOpenVideo = (video: TutorialVideo) => {
    setActiveVideo(video);
    setIsPlaying(false);
    setCurrentTime(0);
    setPlaybackSpeed(1);
    setIsFullscreenSimulated(false);
    setIsDescExpanded(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleFullscreen = () => {
    // Attempt standard browser fullscreen on the video player container
    const playerContainer = videoRef.current?.closest('.video-player-container') || videoRef.current;
    if (playerContainer) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.error(err));
      } else {
        if (playerContainer.requestFullscreen) {
          playerContainer.requestFullscreen().catch(err => console.error(err));
        } else if ((playerContainer as any).webkitRequestFullscreen) { /* Safari */
          (playerContainer as any).webkitRequestFullscreen();
        } else if ((playerContainer as any).msRequestFullscreen) { /* IE11 */
          (playerContainer as any).msRequestFullscreen();
        }
      }
    } else {
      setIsFullscreenSimulated(!isFullscreenSimulated);
    }
  };

  const togglePlay = () => {
    if (!activeVideo) return;

    if (activeVideo.videoUrl && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.log('Erro de reprodução de vídeo:', err));
      }
      setIsPlaying(!isPlaying);
    } else {
      if (currentTime >= activeVideo.duration) {
        setCurrentTime(0);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRewind = () => {
    if (activeVideo?.videoUrl && videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
      setCurrentTime(videoRef.current.currentTime);
    } else {
      setCurrentTime((prev) => Math.max(0, prev - 10));
    }
  };

  const handleForward = () => {
    if (!activeVideo) return;
    if (activeVideo.videoUrl && videoRef.current) {
      videoRef.current.currentTime = Math.min(activeVideo.duration, videoRef.current.currentTime + 10);
      setCurrentTime(videoRef.current.currentTime);
    } else {
      setCurrentTime((prev) => Math.min(activeVideo.duration, prev + 10));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeVideo) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const targetSeconds = Math.floor(percentage * activeVideo.duration);
    
    if (activeVideo.videoUrl && videoRef.current) {
      videoRef.current.currentTime = targetSeconds;
    }
    setCurrentTime(targetSeconds);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setIsUploading(true);
      setUploadPercent(0);

      const interval = setInterval(() => {
        setUploadPercent((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            const localUrl = URL.createObjectURL(file);
            setVideoUrl(localUrl);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription) return;

    // Default duration assigned automatically (no field required!)
    const calculatedSeconds = 180; // Default 3:00 min duration

    const takeawaysArr = newTakeaways
      ? newTakeaways.split(',').map(s => s.trim()).filter(Boolean)
      : ['Configuração prática completa', 'Entenda o fluxo do bot', 'Validação técnica imediata'];

    const steps = [
      { time: 0, label: 'Introdução', detail: 'Apresentação dos pré-requisitos e visão do fluxo.' },
      { time: Math.floor(calculatedSeconds * 0.25), label: 'Chaves e Token', detail: 'Localizando as chaves necessárias no parceiro.' },
      { time: Math.floor(calculatedSeconds * 0.6), label: 'Blocos Técnicos', detail: 'Alterar variáveis, parâmetros e webhooks.' },
      { time: Math.floor(calculatedSeconds * 0.9), label: 'Validação Final', detail: 'Simulações e testes em ambiente real.' }
    ];

    const newVideo: TutorialVideo = {
      id: `tut-custom-${Date.now()}`,
      title: newTitle,
      duration: calculatedSeconds,
      difficulty: newDifficulty,
      instructor: newInstructor || 'Técnico UpChat',
      category: newCategory,
      playlist: newPlaylist || 'Geral',
      description: newDescription,
      keyTakeaways: takeawaysArr,
      visualSteps: steps,
      videoUrl: videoUrl || undefined,
      thumbnailUrl: newThumbnailUrl || undefined
    };

    onAddTutorial(newVideo);
    setShowAddModal(false);

    // Reset fields
    setNewTitle('');
    setNewCategory('Automação');
    setNewPlaylist('Início Rápido');
    setNewInstructor('Suporte Técnico');
    setNewDifficulty('Iniciante');
    setNewDescription('');
    setNewTakeaways('');
    setNewThumbnailUrl('');
    setVideoFile(null);
    setVideoUrl('');
  };

  // Find active step inside simulation
  const currentStepIndex = activeVideo?.visualSteps?.reduce((acc, step, index) => {
    if (currentTime >= step.time) {
      return index;
    }
    return acc;
  }, 0) ?? 0;

  const activeStep = activeVideo?.visualSteps?.[currentStepIndex];

  return (
    <div className="space-y-6">
      
      {/* Upper info controls and add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h4 className="text-slate-400 text-xs sm:text-sm">
            Navegue pelos submenus de playlists abaixo. Clique em qualquer card de miniatura para iniciar o tutorial em tela de cinema.
          </h4>
        </div>

        {isAdmin && (
          <button
            id="btn-add-tutorial"
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-pink hover:bg-brand-pink/90 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-brand-pink/10 group cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Adicionar Vídeo</span>
          </button>
        )}
      </div>

      {tutorials.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          
          {/* Playlists Horizontal Categories Submenu */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {playlists.map((playlist) => (
              <button
                key={playlist}
                onClick={() => setSelectedPlaylist(playlist)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all border cursor-pointer ${
                  selectedPlaylist === playlist
                    ? 'bg-brand-pink border-brand-pink text-white shadow shadow-brand-pink/15 font-bold'
                    : 'bg-[#000224]/80 border-white/10 text-slate-400 hover:text-white hover:bg-[#00033b]/40'
                }`}
              >
                {playlist}
              </button>
            ))}
          </div>

          {/* Videos Grid (YouTube / Netflix Style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTutorials.map((video) => (
              <div
                key={video.id}
                onClick={() => handleOpenVideo(video)}
                className="group flex flex-col bg-[#050b69]/20 border border-white/10 hover:border-brand-pink/40 rounded-2xl p-2 cursor-pointer transition-all duration-300 relative overflow-hidden hover:shadow-lg hover:shadow-brand-pink/5"
              >
                {/* Thumbnail container */}
                <div className="aspect-video relative rounded-xl overflow-hidden bg-slate-950 border border-white/5 flex items-center justify-center">
                  {video.thumbnailUrl ? (
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#fa098a]/20 via-[#000236] to-cyan-500/10 flex flex-col items-center justify-center text-center p-4">
                      <PlayCircle className="w-10 h-10 text-brand-pink mb-1 opacity-70 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-[10px] text-slate-500 font-mono tracking-wide uppercase font-semibold">Sem Miniatura</span>
                    </div>
                  )}

                  {/* Badges Overlays */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="px-1.5 py-0.5 bg-[#000236]/90 border border-white/10 rounded font-mono text-[9px] font-bold text-brand-pink uppercase tracking-wider">
                      {video.playlist || video.category || 'Geral'}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <span className="px-1.5 py-0.5 bg-slate-950/80 rounded font-mono text-[9px] text-slate-400">
                      {video.difficulty}
                    </span>
                  </div>

                  {/* Play Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-brand-pink text-white flex items-center justify-center shadow-lg shadow-brand-pink/20 scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Dark shadow at bottom of image */}
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                </div>

                {/* Details below thumbnail */}
                <div className="p-2 space-y-1">
                  <h4 className="font-display font-semibold text-xs text-slate-200 group-hover:text-white transition-colors leading-snug line-clamp-2">
                    {video.title}
                  </h4>
                  
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-brand-pink" />
                      {video.instructor}
                    </span>
                    <span>{formatTime(video.duration)}</span>
                  </div>
                </div>

                {/* Delete button (Admin only) */}
                {isAdmin && (
                  <button
                    id={`btn-del-tut-grid-${video.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTutorial(video.id);
                    }}
                    className="absolute top-3 right-3 p-1.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100 z-10 shadow-lg"
                    title="Excluir Tutorial"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {filteredTutorials.length === 0 && (
            <p className="text-center py-12 font-mono text-xs text-slate-500">Nenhum tutorial cadastrado nesta playlist.</p>
          )}

        </div>
      )}

      {/* Cinema Lightbox Modal Player */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#000236] border border-white/10 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col lg:grid lg:grid-cols-12 max-h-[92vh]"
            >
              
              {/* VIDEO PLAYER COLUMN: Span 8 columns */}
              <div className="lg:col-span-8 bg-slate-950 flex flex-col justify-between relative video-player-container">
                
                {/* Header info */}
                <div className="p-3 bg-gradient-to-b from-black/80 to-transparent absolute inset-x-0 top-0 z-20 flex justify-between items-center pointer-events-none">
                  <div className="bg-[#000224]/90 border border-white/10 px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
                    <span className="text-[9px] font-bold font-mono text-brand-pink uppercase tracking-wider">{activeVideo.playlist || activeVideo.category || 'Geral'}</span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveVideo(null);
                      setIsPlaying(false);
                    }}
                    className="p-1.5 bg-black/40 hover:bg-red-600 rounded-lg pointer-events-auto transition-colors text-white cursor-pointer"
                    title="Fechar Reprodutor"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Viewport Screen */}
                <div className="aspect-video relative flex flex-col justify-between p-4 overflow-hidden my-auto">
                  {activeVideo.videoUrl ? (
                    <video
                      ref={videoRef}
                      src={activeVideo.videoUrl}
                      className="absolute inset-0 w-full h-full object-cover z-0 cursor-pointer"
                      onTimeUpdate={() => {
                        if (videoRef.current) {
                          setCurrentTime(videoRef.current.currentTime);
                        }
                      }}
                      onEnded={() => setIsPlaying(false)}
                      onClick={togglePlay}
                    />
                  ) : (
                    <>
                      {/* Waveform graphic backdrop */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#fa098a]/10 via-[#000224] to-[#00054f]/20 z-0" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(250,9,138,0.05)_0%,transparent_70%)] z-0 pointer-events-none" />
                      <div className="absolute inset-x-0 bottom-16 h-32 flex items-end justify-center gap-1 z-0 opacity-20 pointer-events-none px-4">
                        {Array.from({ length: 40 }).map((_, i) => {
                          const randomHeight = isPlaying ? Math.sin((currentTime + i) * 0.3) * 45 + 50 : 15;
                          return (
                            <div 
                              key={i} 
                              className="w-1 bg-brand-pink/80 rounded-t transition-all duration-300"
                              style={{ height: `${Math.max(4, randomHeight)}%` }}
                            />
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Overlay when paused */}
                  <div className="z-10 flex flex-col items-center justify-center my-auto text-center pointer-events-none">
                    <AnimatePresence mode="wait">
                      {!isPlaying && currentTime === 0 ? (
                        <motion.div
                          key="preview"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex flex-col items-center gap-3"
                        >
                          <div className="w-16 h-16 rounded-full bg-brand-pink text-white flex items-center justify-center shadow-lg shadow-brand-pink/20 cursor-pointer pointer-events-auto hover:scale-110 active:scale-95 transition-all">
                            <Play className="w-7 h-7 fill-current ml-1" onClick={togglePlay} />
                          </div>
                          <span className="text-xs text-slate-350 font-semibold tracking-wide bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">Clique para iniciar o tutorial</span>
                        </motion.div>
                      ) : !activeVideo.videoUrl ? (
                        <motion.div
                          key="playing"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="max-w-md bg-[#000224]/80 border border-brand-pink/20 rounded-2xl p-4 backdrop-blur-md shadow-lg"
                        >
                          <div className="flex items-center gap-2 text-brand-pink mb-1">
                            <Activity className="w-3.5 h-3.5 animate-pulse" />
                            <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Simulador de Vídeo Ativo</span>
                          </div>
                          {activeStep && (
                            <>
                              <h4 className="text-xs font-bold text-white uppercase font-mono">{activeStep.label}</h4>
                              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{activeStep.detail}</p>
                            </>
                          )}
                          
                          <div className="mt-3 h-8 bg-slate-950/80 rounded-lg border border-white/5 flex items-center justify-between px-3 text-[10px] font-mono text-slate-500">
                            <span>Timecode: {formatTime(currentTime)}</span>
                            <span className="text-brand-pink flex items-center gap-1 font-semibold animate-pulse">
                              <span>●</span> Passo {currentStepIndex + 1}/{activeVideo.visualSteps?.length || 1}
                            </span>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>

                  {/* Bottom HUD Floating Panel (Compact size) */}
                  <div className="z-10 bg-[#0f172a]/95 border border-white/10 rounded-xl p-2.5 sm:p-3 backdrop-blur-md shadow-2xl space-y-2 pointer-events-auto">
                    
                    {/* 1. Clickable Progress bar */}
                    <div className="space-y-1">
                      <div 
                        className="h-1 w-full bg-slate-800 rounded-full overflow-hidden cursor-pointer relative group/bar"
                        onClick={handleProgressBarClick}
                      >
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full relative"
                          style={{ width: `${(currentTime / activeVideo.duration) * 100}%` }}
                        />
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border border-cyan-400 shadow scale-0 group-hover/bar:scale-100 transition-transform duration-150"
                          style={{ left: `calc(${(currentTime / activeVideo.duration) * 100}% - 5px)` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                        <span className="text-cyan-400">{formatTime(currentTime)}</span>
                        <span>{formatTime(activeVideo.duration)}</span>
                      </div>
                    </div>

                    {/* 2. Controls Row */}
                    <div className="flex items-center justify-between gap-4 pt-0.5">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={togglePlay}
                          className="w-8 h-8 rounded-lg bg-brand-pink text-white flex items-center justify-center hover:bg-brand-pink/90 active:scale-95 transition-all cursor-pointer shadow-lg shadow-brand-pink/10"
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                        </button>

                        <button 
                          onClick={handleRewind}
                          className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Voltar 10s"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        {/* Volume controls */}
                        <div className="hidden sm:flex items-center gap-2">
                          <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </button>
                          <input 
                            type="range"
                            min={0}
                            max={100}
                            value={isMuted ? 0 : volume}
                            onChange={(e) => {
                              setVolume(Number(e.target.value));
                              setIsMuted(false);
                            }}
                            className="w-14 accent-brand-pink bg-slate-800 h-1 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Right side options: Speed & Fullscreen */}
                      <div className="flex items-center gap-2">
                        <div className="flex rounded-md bg-slate-900 border border-white/5 p-0.5">
                          {[1, 1.5, 2].map((speed) => (
                            <button
                              key={speed}
                              onClick={() => setPlaybackSpeed(speed)}
                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all cursor-pointer ${
                                playbackSpeed === speed 
                                  ? 'bg-brand-pink/10 text-brand-pink font-bold border border-brand-pink/20' 
                                  : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={handleFullscreen}
                          className={`p-1.5 rounded-lg transition-all border cursor-pointer ${
                            isFullscreen 
                              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                              : 'text-slate-400 hover:text-white border-white/5 hover:bg-slate-900'
                          }`}
                          title="Tela Cheia"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* VIDEO INFO AND TIMELINE COLUMN: Span 4 columns */}
              <div className="lg:col-span-4 p-6 overflow-y-auto max-h-[50vh] lg:max-h-none border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col space-y-5 scrollbar-thin">
                <div>
                  <h3 className="font-display font-bold text-base text-white leading-tight">{activeVideo.title}</h3>
                  
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-slate-400 mt-1.5 font-mono">
                    <span className="flex items-center gap-1 shrink-0">
                      <User className="w-3.5 h-3.5 text-brand-pink" />
                      {activeVideo.instructor}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(activeVideo.duration)}
                    </span>
                  </div>
                </div>

                {/* Responsive Collapsible Description Block */}
                <div className="space-y-2 bg-[#050b69]/10 border border-white/5 rounded-2xl p-4">
                  <h4 className="text-[10px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-brand-pink" />
                    Descrição do Vídeo
                  </h4>
                  <div className="text-xs text-slate-300 leading-relaxed relative font-medium">
                    <p className={isDescExpanded ? 'whitespace-pre-line' : 'line-clamp-4 whitespace-pre-line'}>
                      {activeVideo.description}
                    </p>
                    
                    {activeVideo.description && activeVideo.description.length > 120 && (
                      <button
                        type="button"
                        onClick={() => setIsDescExpanded(!isDescExpanded)}
                        className="text-brand-pink hover:text-brand-pink/90 font-bold text-[10px] mt-2 focus:outline-none cursor-pointer flex items-center gap-0.5"
                      >
                        {isDescExpanded ? 'Ocultar descrição ▲' : 'Expandir descrição completa ▼'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Takeaways Checkbox items */}
                <div className="pt-2 space-y-2">
                  <h4 className="text-[10px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-pink" />
                    Objetivos de Capacitacao
                  </h4>
                  <ul className="space-y-1.5 pl-0.5">
                    {activeVideo.keyTakeaways?.map((takeaway, index) => (
                      <li key={index} className="flex items-start gap-2 text-[11px] text-slate-350 leading-tight">
                        <CheckCircle className="w-3.5 h-3.5 text-brand-pink shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => {
                    setActiveVideo(null);
                    setIsPlaying(false);
                  }}
                  className="w-full py-2 bg-slate-950 hover:bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Fechar Cinema
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Tutorial Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#000236] border border-white/10 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Visual top accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-pink" />

            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 text-brand-pink pb-2 border-b border-white/5">
              <PlayCircle className="w-5 h-5" />
              <h3 className="font-display font-bold text-base text-white">Adicionar Vídeo de Tutorial</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold flex-1 overflow-y-auto pr-1">
              <div>
                <label className="block text-slate-400 mb-1">Título da Aula *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Integração Voalle com WhatsApp API"
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/20 transition-all font-normal text-sm"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              {/* THUMBNAIL URL (IMAGE MINIATURA) */}
              <div>
                <label className="block text-slate-400 mb-1">URL da Miniatura do Vídeo (Imagem JPG/PNG)</label>
                <input
                  type="text"
                  placeholder="Ex: https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/20 transition-all font-normal text-sm"
                  value={newThumbnailUrl}
                  onChange={(e) => setNewThumbnailUrl(e.target.value)}
                />
                <p className="text-[10px] text-slate-500 mt-1 font-normal">Uma miniatura de vídeo torna a navegação mais atrativa. Insira uma URL de imagem válida.</p>
              </div>

              {/* VIDEO FILE UPLOAD FIELD */}
              <div>
                <label className="block text-slate-400 mb-1">Carregar Arquivo de Vídeo (Opcional)</label>
                <div className="relative border border-dashed border-white/15 hover:border-brand-pink/50 rounded-xl p-4 bg-slate-950/60 transition-colors flex flex-col items-center justify-center text-center">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-brand-pink mb-1.5 animate-pulse" />
                  {videoFile ? (
                    <div className="space-y-1">
                      <p className="text-xs text-brand-pink font-bold font-mono">{videoFile.name}</p>
                      <p className="text-[10px] text-slate-500">{(videoFile.size / 1024 / 1024).toFixed(2)} MB • Clique para substituir</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-slate-400 font-bold">Arraste ou clique para enviar um vídeo</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">Suporta MP4, WebM, OGG</p>
                    </div>
                  )}
                </div>

                {isUploading && (
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-brand-pink font-mono">
                      <span>Carregando arquivo de vídeo...</span>
                      <span>{uploadPercent}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-brand-pink h-full transition-all duration-150" style={{ width: `${uploadPercent}%` }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Categoria Principal</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/20 transition-all cursor-pointer text-sm font-normal"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="Início Rápido">Início Rápido</option>
                    <option value="Integrações">Integrações</option>
                    <option value="Automação">Automação</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Playlist / Tag Submenu *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: SGP, Hubsoft, Voalle, Geral"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/20 transition-all font-normal text-sm"
                    value={newPlaylist}
                    onChange={(e) => setNewPlaylist(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Instrutor</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Gustavo Santos"
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/20 transition-all font-normal text-sm"
                    value={newInstructor}
                    onChange={(e) => setNewInstructor(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Dificuldade</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/20 transition-all cursor-pointer text-sm font-normal"
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                  >
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tópicos Abordados (Separados por vírgulas)</label>
                <input
                  type="text"
                  placeholder="Ex: Configuração de Cabeçalhos, Formatação de Retornos, Testes Práticos"
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/20 transition-all font-normal text-sm"
                  value={newTakeaways}
                  onChange={(e) => setNewTakeaways(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Descrição do Tutorial *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Escreva um breve resumo do que é ensinado no vídeo..."
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/20 transition-all resize-none font-normal text-sm"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className={`w-full py-2.5 text-white font-bold rounded-xl transition-all shadow-lg ${
                  isUploading 
                    ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                    : 'bg-brand-pink hover:bg-brand-pink/95 cursor-pointer shadow-brand-pink/10'
                }`}
              >
                {isUploading ? 'Carregando vídeo...' : 'Salvar Vídeo'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
