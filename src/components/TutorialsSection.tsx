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
  BookOpen, 
  Sparkles, 
  CheckCircle, 
  PlayCircle,
  FileText,
  User,
  Activity,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TutorialVideo {
  id: string;
  title: string;
  duration: number; // in seconds
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  instructor: string;
  category: string;
  description: string;
  keyTakeaways: string[];
  visualSteps: { time: number; label: string; detail: string }[];
}

export default function TutorialsSection() {
  const [activeVideoId, setActiveVideoId] = useState('tut-import');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreenSimulated, setIsFullscreenSimulated] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const tutorials: TutorialVideo[] = [
    {
      id: 'tut-import',
      title: 'Como Importar Fluxos de Atendimento no UpChat',
      duration: 180, // 3:00
      difficulty: 'Iniciante',
      instructor: 'Gustavo Santos (Dev UpChat)',
      category: 'Início Rápido',
      description: 'Aprenda do zero como baixar os arquivos JSON de fluxos padrões da Mothership direto do Google Drive e importá-los com sucesso no painel visual UpChat.',
      keyTakeaways: [
        'Como localizar arquivos JSON de templates no Drive',
        'Procedimento passo a passo de importação no Painel UpChat',
        'Verificação e mapeamento de nós orfãos após importação'
      ],
      visualSteps: [
        { time: 0, label: 'Introdução e Objetivos', detail: 'Explicação rápida de como usar o arquivo .json baixado.' },
        { time: 30, label: 'Baixando Arquivos no Drive', detail: 'Navegando nas pastas compartilhadas de templates e salvando o JSON localmente.' },
        { time: 75, label: 'Acessando Construtor UpChat', detail: 'Fazendo login e acessando a aba Chatbots > Novo Fluxo > Importar.' },
        { time: 120, label: 'Validação dos Nós e Blocos', detail: 'Como verificar se todos os balões e conexões foram gerados corretamente.' },
        { time: 165, label: 'Salvando e Testando', detail: 'Publicação do fluxo e realização de testes com o simulador integrado.' }
      ]
    },
    {
      id: 'tut-hubsoft',
      title: 'Configurando API de Faturas no Hubsoft',
      duration: 260, // 4:20
      difficulty: 'Avançado',
      instructor: 'Mariana Lima (Suporte Técnico)',
      category: 'Integrações',
      description: 'Neste tutorial prático, configuramos as chamadas HTTP para o Hubsoft para buscar faturas atrasadas e enviar o Pix Copia-e-Cola automaticamente pelo WhatsApp.',
      keyTakeaways: [
        'Geração de chave e Token de segurança no painel Hubsoft',
        'Configuração dos cabeçalhos (Headers) de autorização',
        'Tratamento de retorno para clientes sem faturas pendentes'
      ],
      visualSteps: [
        { time: 0, label: 'Entendendo a API Hubsoft', detail: 'Visão geral da documentação financeira e chaves necessárias.' },
        { time: 40, label: 'Configurando Header no UpChat', detail: 'Inserção do token Bearer no bloco de requisição HTTP.' },
        { time: 100, label: 'Formatando CPF/CNPJ', detail: 'Como remover traços e pontos do dado inserido pelo cliente.' },
        { time: 160, label: 'Mapeando Array de Faturas', detail: 'Extraindo o campo "pix_copia_e_cola" e o link do boleto PDF.' },
        { time: 230, label: 'Simulando Erros comuns', detail: 'Tratamento de timeouts ou indisponibilidade da API do ERP.' }
      ]
    },
    {
      id: 'tut-ixc',
      title: 'Sincronização de Ordens de Serviço no IXC Soft',
      duration: 320, // 5:20
      difficulty: 'Avançado',
      instructor: 'William Silva (Integrações)',
      category: 'Integrações',
      description: 'Tutorial detalhado de como abrir chamados técnicos no IXC Soft de forma 100% automatizada caso o teste de sinal do roteador acuse falhas físicas.',
      keyTakeaways: [
        'Acesso à tabela su_oss_chamado no IXC Soft',
        'Preenchimento dinâmico de assunto, contrato e fila de atendimento',
        'Notificação ao usuário com o número de protocolo gerado'
      ],
      visualSteps: [
        { time: 0, label: 'Mapeamento de Rotas do IXC', detail: 'Conhecendo a chamada de abertura de chamados do integrador.' },
        { time: 50, label: 'Coleta de Contrato do Cliente', detail: 'Filtrando o ID correto do contrato no cadastro antes de gerar a OS.' },
        { time: 120, label: 'Criação do Bloco de Envio', detail: 'Montando o payload JSON dinâmico no construtor UpChat.' },
        { time: 200, label: 'Sincronização com Técnicos', detail: 'Como disparar e-mail ou aviso aos técnicos após gravação no IXC.' },
        { time: 280, label: 'Validação Prática', detail: 'Verificando o novo chamado aparecendo na fila administrativa do IXC.' }
      ]
    },
    {
      id: 'tut-vars',
      title: 'Criando Respostas Rápidas e Variáveis de Ambiente',
      duration: 150, // 2:30
      difficulty: 'Intermediário',
      instructor: 'Gustavo Santos (Dev UpChat)',
      category: 'Automação',
      description: 'Como utilizar o sistema de variáveis globais e de ambiente do UpChat para evitar que dados confidenciais (tokens e senhas) fiquem visíveis no fluxo.',
      keyTakeaways: [
        'Diferença entre variáveis de sessão e variáveis globais',
        'Configurando credenciais mascaradas em Configurações > Variáveis',
        'Como interpolar dados nas mensagens com {{variavel}}'
      ],
      visualSteps: [
        { time: 0, label: 'Conceito de Variáveis', detail: 'Por que mascarar tokens de API é vital para a segurança.' },
        { time: 30, label: 'Adicionando Variável de Ambiente', detail: 'Passo a passo no menu de configurações do sistema UpChat.' },
        { time: 70, label: 'Aplicando no Bloco de Texto', detail: 'Como referenciar chaves usando colchetes ou chaves duplas.' },
        { time: 110, label: 'Testando as Chaves', detail: 'Executando um teste prático de envio com valor fictício mascarado.' }
      ]
    }
  ];

  const activeVideo = tutorials.find(t => t.id === activeVideoId) || tutorials[0];

  // Playback timer effect
  useEffect(() => {
    if (isPlaying) {
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
  }, [isPlaying, playbackSpeed, activeVideo.duration]);

  // Reset progress when changing videos
  const handleSelectVideo = (id: string) => {
    setActiveVideoId(id);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    if (currentTime >= activeVideo.duration) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleRewind = () => {
    setCurrentTime((prev) => Math.max(0, prev - 10));
  };

  const handleForward = () => {
    setCurrentTime((prev) => Math.min(activeVideo.duration, prev + 10));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const targetSeconds = Math.floor(percentage * activeVideo.duration);
    setCurrentTime(targetSeconds);
  };

  // Find active visual step based on current simulated playback time
  const currentStepIndex = activeVideo.visualSteps.reduce((acc, step, index) => {
    if (currentTime >= step.time) {
      return index;
    }
    return acc;
  }, 0);

  const activeStep = activeVideo.visualSteps[currentStepIndex];

  return (
    <div className="space-y-8">
      
      {/* Upper info */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-brand-pink" />
          <span>Central de Capacitação e Vídeos Práticos</span>
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Assista aos nossos tutoriais guiados e aprenda a conectar as integrações com os maiores ERPs de provedores.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Highly Stylized Media Player Mockup (7 columns) */}
        <div className="xl:col-span-8 space-y-4">
          
          <div className="font-mono text-[10px] text-slate-500 flex justify-between px-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
              PLAYER EMULADO DE VÍDEO COMPARTILHADO
            </span>
            <span>SPEED: {playbackSpeed}x | RES: 1080p</span>
          </div>

          {/* Video Container Shell */}
          <div 
            className={`relative rounded-3xl overflow-hidden border border-white/10 bg-[#000224] shadow-2xl transition-all duration-500 ${
              isFullscreenSimulated ? 'ring-4 ring-brand-pink/30' : ''
            }`}
          >
            {/* Viewport Screen */}
            <div className="aspect-video relative flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
              
              {/* Dynamic decorative backdrop animation representing the video */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#fa098a]/10 via-[#000224] to-[#00054f]/20 z-0" />
              
              {/* Radial gradient scanning effect */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(250,9,138,0.05)_0%,transparent_70%)] z-0 pointer-events-none" />
              
              {/* Animated waveform / grids to look like a high tech visualizer screen */}
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

              {/* Player UI: Header overlay (always visible or hover) */}
              <div className="z-10 flex justify-between items-start pointer-events-none">
                <div className="bg-[#000224]/90 border border-white/5 px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
                  <span className="text-[10px] font-bold font-mono text-brand-pink uppercase tracking-wider">{activeVideo.category}</span>
                </div>
                
                <div className="bg-[#000224]/90 border border-white/5 px-2.5 py-1.5 rounded-xl backdrop-blur-md text-[10px] text-slate-400 font-mono">
                  {activeVideo.difficulty}
                </div>
              </div>

              {/* Player UI: Center Video Simulated Output */}
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
                      <span className="text-xs text-slate-400 font-semibold tracking-wide">Clique para iniciar o tutorial</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="playing"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="max-w-md bg-[#000224]/80 border border-brand-pink/20 rounded-2xl p-4 backdrop-blur-md shadow-lg"
                    >
                      <div className="flex items-center gap-2 text-brand-pink mb-1">
                        <Activity className="w-3.5 h-3.5 animate-pulse" />
                        <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Demonstração Visual Ativa</span>
                      </div>
                      <h4 className="text-xs font-bold text-white uppercase font-mono">{activeStep.label}</h4>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{activeStep.detail}</p>
                      
                      {/* Interactive graphic changing based on time */}
                      <div className="mt-3 h-8 bg-slate-950/80 rounded-lg border border-white/5 flex items-center justify-between px-3 text-[10px] font-mono text-slate-500">
                        <span>Timecode: {formatTime(currentTime)}</span>
                        <span className="text-brand-pink flex items-center gap-1 font-semibold animate-pulse">
                          <span>●</span> Passo {currentStepIndex + 1}/{activeVideo.visualSteps.length}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Player UI: Bottom Floating HUD Panel (Controls) */}
              <div className="z-10 bg-[#0f172a]/95 border border-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-2xl space-y-3 pointer-events-auto">
                
                {/* 1. Clickable Progress bar */}
                <div className="space-y-1">
                  <div 
                    onClick={handleProgressBarClick}
                    className="h-2 w-full bg-slate-800 rounded-full cursor-pointer relative overflow-hidden group"
                  >
                    {/* Hover hover marker indicator */}
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-pink to-[#ff47b6] rounded-full transition-all" style={{ width: `${(currentTime / activeVideo.duration) * 100}%` }} />
                    <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow" style={{ left: `calc(${(currentTime / activeVideo.duration) * 100}% - 6px)` }} />
                  </div>
                  
                  {/* Time stamps */}
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(activeVideo.duration)}</span>
                  </div>
                </div>

                {/* 2. Control Row buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
                  <div className="flex items-center gap-3">
                    
                    {/* Backward 10s */}
                    <button 
                      onClick={handleRewind}
                      className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Voltar 10s"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    {/* Play/Pause */}
                    <button 
                      onClick={togglePlay}
                      className="p-2 bg-brand-pink hover:bg-brand-pink/90 text-white rounded-xl transition-all shadow shadow-brand-pink/10 cursor-pointer hover:scale-105 active:scale-95"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    {/* Forward 10s */}
                    <button 
                      onClick={handleForward}
                      className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Avançar 10s"
                    >
                      <RotateCcw className="w-4 h-4 rotate-180" />
                    </button>

                    {/* Separator line */}
                    <div className="w-px h-6 bg-white/5 hidden sm:block" />

                    {/* Volume Controls */}
                    <div className="items-center gap-2 hidden sm:flex">
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                      >
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                          setVolume(Number(e.target.value));
                          setIsMuted(false);
                        }}
                        className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                      />
                    </div>

                  </div>

                  <div className="flex items-center gap-3">
                    
                    {/* Playback speed selector */}
                    <div className="flex items-center bg-[#000224] border border-white/5 rounded-lg p-0.5">
                      {[1, 1.5, 2].map((speed) => (
                        <button
                           key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded transition-colors cursor-pointer ${
                            playbackSpeed === speed 
                              ? 'bg-brand-pink text-white' 
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>

                    {/* Simulated Fullscreen */}
                    <button 
                      onClick={() => setIsFullscreenSimulated(!isFullscreenSimulated)}
                      className={`p-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer ${
                        isFullscreenSimulated ? 'text-brand-pink bg-brand-pink/10' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Alternar Modo Foco"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Active Video Technical Sheet / Lesson summary */}
          <div className="bg-[#000224]/50 border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h4 className="font-display font-semibold text-white text-base leading-snug">{activeVideo.title}</h4>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-brand-pink" />
                    {activeVideo.instructor}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTime(activeVideo.duration)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {activeVideo.description}
            </p>

            {/* Takeaways check-list */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Tópicos Abordados no Vídeo</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeVideo.keyTakeaways.map((takeaway, i) => (
                  <div key={i} className="flex gap-2 items-start text-xs text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-pink mt-0.5 shrink-0" />
                    <span>{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Video Selection list (4 columns) */}
        <div className="xl:col-span-4 space-y-4">
          <div className="bg-[#000224]/60 border border-white/5 rounded-2xl p-4 space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Lista de Aulas ({tutorials.length})</span>
              <span className="text-[10px] font-mono text-brand-pink font-semibold px-2 py-0.5 bg-brand-pink/10 rounded">Autoatendimento ISP</span>
            </div>

            {/* Playlist Container */}
            <div className="space-y-2.5">
              {tutorials.map((video) => {
                const isSelected = video.id === activeVideoId;
                return (
                  <div
                    key={video.id}
                    onClick={() => handleSelectVideo(video.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 relative group ${
                      isSelected
                        ? 'bg-brand-pink/5 border-brand-pink/30'
                        : 'bg-[#000224] border-white/5 hover:border-white/10 hover:bg-[#000236]/40'
                    }`}
                  >
                    {/* Playing indicator strip */}
                    {isSelected && (
                      <div className="absolute inset-y-0 left-0 w-1 bg-brand-pink rounded-l-xl" />
                    )}

                    {/* Left Icon box */}
                    <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-brand-pink/10 text-brand-pink' : 'bg-slate-950 text-slate-500 group-hover:text-slate-300'
                    }`}>
                      {isSelected && isPlaying ? (
                        <div className="flex items-center gap-1 h-3.5">
                          <span className="w-1 bg-brand-pink rounded-t h-3.5 animate-pulse" />
                          <span className="w-1 bg-brand-pink rounded-t h-2 animate-pulse" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 bg-brand-pink rounded-t h-3 animate-pulse" style={{ animationDelay: '300ms' }} />
                        </div>
                      ) : (
                        <PlayCircle className="w-5 h-5" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                      <h5 className={`text-xs font-bold leading-tight line-clamp-2 transition-colors ${
                        isSelected ? 'text-brand-pink' : 'text-slate-300 group-hover:text-white'
                      }`}>
                        {video.title}
                      </h5>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                        <span className="font-semibold text-slate-400">{video.difficulty}</span>
                        <span>•</span>
                        <span>{formatTime(video.duration)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick PDF Resources download */}
          <div className="bg-[#000224]/40 border border-white/5 rounded-2xl p-4 space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-brand-pink" />
              Recursos de Apoio
            </h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Baixe os manuais em formato PDF para acompanhar a lógica apresentada nas vídeo-aulas.
            </p>
            <div className="space-y-2">
              <a 
                href="https://upchat-developers.github.io/mothership-dashboard/" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 bg-[#000224] border border-white/5 hover:border-brand-pink/20 rounded-lg text-xs text-slate-300 hover:text-white transition-all cursor-pointer group"
              >
                <span className="line-clamp-1">Guia de Integrações Completo (PDF)</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-pink transition-colors shrink-0" />
              </a>
              <a 
                href="https://upchat-developers.github.io/mothership-dashboard/" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 bg-[#000224] border border-white/5 hover:border-brand-pink/20 rounded-lg text-xs text-slate-300 hover:text-white transition-all cursor-pointer group"
              >
                <span className="line-clamp-1">Dicionário de Variáveis UpChat</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-pink transition-colors shrink-0" />
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
