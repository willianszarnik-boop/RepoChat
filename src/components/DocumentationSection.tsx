import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ChevronRight, 
  Code, 
  Copy, 
  Check, 
  AlertTriangle, 
  Lightbulb, 
  ArrowUpRight, 
  Terminal,
  Settings,
  HelpCircle,
  Database
} from 'lucide-react';

interface DocArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: React.ReactNode;
}

export default function DocumentationSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeArticleId, setActiveArticleId] = useState('welcome');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const articles: DocArticle[] = [
    {
      id: 'welcome',
      category: 'Geral',
      title: 'Bem-vindo ao RepoChat',
      summary: 'Introdução à central de repositórios de integrações e documentação do UpChat.',
      content: (
        <div className="space-y-6">
          <p className="text-slate-300 leading-relaxed">
            O <strong className="text-brand-pink">RepoChat</strong> é a central definitiva de recursos para desenvolvedores, técnicos e integradores que utilizam a plataforma <strong className="text-white">UpChat</strong>. Aqui você encontra atalhos diretos do Google Drive para locuções, diagramas de fluxos, scripts SQL essenciais e atalhos de ferramentas indispensáveis para o dia a dia de automações ISP.
          </p>

          <div className="p-4 bg-brand-pink/10 border border-brand-pink/20 rounded-xl flex gap-3.5 items-start">
            <Lightbulb className="w-5 h-5 text-brand-pink shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-white text-sm">Qual o objetivo desta central?</h5>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Padronizar os fluxos de autoatendimento das maiores integradoras de ISPs do Brasil (<strong>Hubsoft, SGP, IXC Soft</strong>) facilitando a importação direta no construtor de bots do UpChat.
              </p>
            </div>
          </div>

          <h4 className="font-display font-semibold text-white text-base mt-6">Estrutura de Conteúdo</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#000224] border border-white/5 rounded-xl hover:border-brand-pink/20 transition-all">
              <span className="text-brand-pink font-mono text-xs font-bold block mb-1">01 / REPOSITÓRIO DRIVE</span>
              <h5 className="font-semibold text-white text-sm mb-1">Google Drive</h5>
              <p className="text-xs text-slate-500 leading-relaxed">Pastas compartilhadas com locuções profissionais, arquivos XML de fluxo e diagramas.</p>
            </div>
            <div className="p-4 bg-[#000224] border border-white/5 rounded-xl hover:border-brand-pink/20 transition-all">
              <span className="text-brand-pink font-mono text-xs font-bold block mb-1">02 / ATALHOS RÁPIDOS</span>
              <h5 className="font-semibold text-white text-sm mb-1">Sites Úteis</h5>
              <p className="text-xs text-slate-500 leading-relaxed">Websites selecionados como JSON Viewers, Meta Business Suite e ferramentas de testes HTTP.</p>
            </div>
            <div className="p-4 bg-[#000224] border border-white/5 rounded-xl hover:border-brand-pink/20 transition-all">
              <span className="text-brand-pink font-mono text-xs font-bold block mb-1">03 / GUIA PASSO A PASSO</span>
              <h5 className="font-semibold text-white text-sm mb-1">Tutoriais em Vídeo</h5>
              <p className="text-xs text-slate-500 leading-relaxed">Aprenda a importar os modelos de fluxos e realizar configurações de API usando nosso player de vídeo embutido.</p>
            </div>
            <div className="p-4 bg-[#000224] border border-white/5 rounded-xl hover:border-brand-pink/20 transition-all">
              <span className="text-brand-pink font-mono text-xs font-bold block mb-1">04 / CÓDIGOS DE API</span>
              <h5 className="font-semibold text-white text-sm mb-1">Documentação Técnica</h5>
              <p className="text-xs text-slate-500 leading-relaxed">Artigos explicando consultas de banco de dados, variáveis de ambiente e parâmetros de integração.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'import-guide',
      category: 'UpChat',
      title: 'Importando Fluxos no UpChat',
      summary: 'Guia definitivo para exportar os modelos do Drive e carregar no construtor de bots.',
      content: (
        <div className="space-y-6">
          <p className="text-slate-300 leading-relaxed">
            Todos os fluxos padrões disponibilizados em nossas pastas do Google Drive estão estruturados no formato JSON nativo da plataforma UpChat. Para importá-los, siga o procedimento abaixo:
          </p>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <span className="w-6 h-6 rounded-full bg-brand-pink/20 text-brand-pink flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
              <div>
                <h5 className="font-semibold text-white text-sm">Baixe o Arquivo JSON</h5>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Acesse a aba <strong>Google Drive</strong>, entre na pasta <strong>Templates JSON para Importação Rápida</strong> e faça o download do modelo correspondente à integradora do cliente (Ex: <code>fluxo-hubsoft-financeiro.json</code>).
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="w-6 h-6 rounded-full bg-brand-pink/20 text-brand-pink flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
              <div>
                <h5 className="font-semibold text-white text-sm">Acesse o Painel UpChat</h5>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Faça login em seu painel corporativo e navegue até a sessão <strong>Bots & Chatbots &rarr; Construtor Visual</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="w-6 h-6 rounded-full bg-brand-pink/20 text-brand-pink flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
              <div>
                <h5 className="font-semibold text-white text-sm">Importar e Mapear Variáveis</h5>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Clique no botão superior <strong>Importar Fluxo (JSON)</strong>, arraste o arquivo baixado e clique em Salvar. O construtor visual irá carregar automaticamente toda a estrutura de blocos de mensagens, menus e nós condicionais.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3.5 items-start mt-4">
            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-white text-sm">Importante: Chaves de API</h5>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Ao importar o fluxo, os blocos de Integração API estarão com URLs e chaves configuradas como placeholders. Você <strong>deve</strong> alterá-los para apontar para as credenciais reais do seu cliente no provedor ISP.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'hubsoft-api',
      category: 'Provedores',
      title: 'Integração de Faturas Hubsoft',
      summary: 'Documentação do endpoint de consulta de débitos e geração de Pix copia-e-cola.',
      content: (
        <div className="space-y-6">
          <p className="text-slate-300 leading-relaxed">
            Para consultar débitos do assinante diretamente no Hubsoft, utilizamos o endpoint padrão de faturas com envio do CPF em formato apenas numérico.
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-brand-pink" />
                GET /api/v2/financeiro/faturas-abertas
              </span>
              <button 
                onClick={() => handleCopy('https://sua-api.hubsoft.com.br/api/v2/financeiro/faturas-abertas?cpf_cnpj=XXXXXXXXXXX', 'api-hub')}
                className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1 bg-[#000224] px-2.5 py-1 rounded border border-white/5 cursor-pointer"
              >
                {copiedId === 'api-hub' ? <Check className="w-3 h-3 text-brand-pink" /> : <Copy className="w-3 h-3" />}
                <span>Copiar URL</span>
              </button>
            </div>
            <pre className="bg-[#000224] border border-white/10 rounded-xl p-4 overflow-x-auto text-[11px] font-mono text-slate-300">
{`https://sua-api.hubsoft.com.br/api/v2/financeiro/faturas-abertas?cpf_cnpj=XXXXXXXXXXX`}
            </pre>
          </div>

          <h5 className="font-semibold text-white text-sm">Estrutura de Resposta Esperada (JSON):</h5>
          <div className="relative">
            <button 
              onClick={() => handleCopy(JSON.stringify({
                status: "success",
                data: [
                  {
                    fatura_id: 28471,
                    valor: 99.90,
                    vencimento: "2026-07-10",
                    pix_copia_e_cola: "00020101021226830014br.gov.bcb.pix2561api.hubsoft...",
                    pdf_url: "https://hubsoft.provedor.com/financeiro/fatura/28471/pdf"
                  }
                ]
              }, null, 2), 'json-hub')}
              className="absolute top-3 right-3 text-[10px] text-slate-500 hover:text-white flex items-center gap-1 bg-[#000236] px-2.5 py-1 rounded border border-white/5 cursor-pointer z-10"
            >
              {copiedId === 'json-hub' ? <Check className="w-3 h-3 text-brand-pink" /> : <Copy className="w-3 h-3" />}
              <span>Copiar JSON</span>
            </button>
            <pre className="bg-[#000224] border border-white/10 rounded-xl p-4 overflow-x-auto text-[11px] font-mono text-brand-pink">
{`{
  "status": "success",
  "data": [
    {
      "fatura_id": 28471,
      "valor": 99.90,
      "vencimento": "2026-07-10",
      "pix_copia_e_cola": "00020101021226830014br.gov.bcb.pix...",
      "pdf_url": "https://hubsoft.provedor.com/financeiro/fatura/28471/pdf"
    }
  ]
}`}
            </pre>
          </div>

          <div className="p-4 bg-brand-pink/10 border border-brand-pink/20 rounded-xl flex gap-3.5 items-start">
            <Lightbulb className="w-5 h-5 text-brand-pink shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-white text-sm">Liberação Automática de Sinal</h5>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Após gerar o Pix, o bot aguarda a confirmação de pagamento. Uma vez recebida pelo webhook da Hubsoft, o chatbot chama o endpoint <code>/api/v2/cliente/desbloqueio-confianca</code> liberando a conexão de forma imediata!
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ixc-api',
      category: 'Provedores',
      title: 'Consultas de Sinal ONU no IXC Soft',
      summary: 'Mapeamento de banco de dados para checar se o assinante está sem conexão ou online.',
      content: (
        <div className="space-y-6">
          <p className="text-slate-300 leading-relaxed">
            A integração com o IXC Soft para verificação técnica do PPPoE do cliente exige acesso de leitura sobre as tabelas do RADIUS ou a execução de requisições API específicas de conexão de roteadores.
          </p>

          <h5 className="font-semibold text-white text-sm">Estrutura de requisição POST para o IXC API:</h5>
          <div className="relative">
            <button 
              onClick={() => handleCopy(JSON.stringify({
                qtype: "radusuarios.username",
                query: "login_do_cliente",
                oper: "equal"
              }, null, 2), 'json-ixc')}
              className="absolute top-3 right-3 text-[10px] text-slate-500 hover:text-white flex items-center gap-1 bg-[#000236] px-2.5 py-1 rounded border border-white/5 cursor-pointer z-10"
            >
              {copiedId === 'json-ixc' ? <Check className="w-3 h-3 text-brand-pink" /> : <Copy className="w-3 h-3" />}
              <span>Copiar Payload</span>
            </button>
            <pre className="bg-[#000224] border border-white/10 rounded-xl p-4 overflow-x-auto text-[11px] font-mono text-slate-300">
{`POST /api/v1/radusuarios
Host: ixc.provedor.com.br
Authorization: Bearer <SEU_TOKEN_IXC>

{
  "qtype": "radusuarios.username",
  "query": "login_do_cliente",
  "oper": "equal"
}`}
            </pre>
          </div>

          <h5 className="font-semibold text-white text-sm">Código de Diagnóstico Lógico (JavaScript / NodeJS):</h5>
          <p className="text-xs text-slate-400">Este trecho é comumente implementado dentro do nó de funções do UpChat para interpretar as respostas do IXC:</p>
          <pre className="bg-[#000224] border border-white/10 rounded-xl p-4 overflow-x-auto text-[11px] font-mono text-amber-300/90">
{`function checkClientStatus(apiResponse) {
  if (!apiResponse || apiResponse.total === 0) {
    return 'NOT_FOUND'; // Login não localizado no IXC
  }
  
  const client = apiResponse.registros[0];
  if (client.status === 'A' && client.conexao_status === 'O') {
    return 'ONLINE'; // Assinante conectado e com sinal
  }
  
  return 'OFFLINE'; // Sem sinal de fibra ou roteador desligado
}`}
          </pre>
        </div>
      )
    },
    {
      id: 'webhook-handling',
      category: 'Avançado',
      title: 'Configurações de Webhook e Retorno',
      summary: 'Como configurar o gatilho de retorno para o UpChat reconhecer status de faturas pagas.',
      content: (
        <div className="space-y-6">
          <p className="text-slate-300 leading-relaxed">
            Os webhooks de retorno de pagamentos garantem que o UpChat tome ações imediatas, como enviar uma mensagem automatizada de agradecimento pelo WhatsApp ou encerrar um chamado de cobrança em aberto.
          </p>

          <div className="p-4 bg-brand-pink/10 border border-brand-pink/20 rounded-xl">
            <h5 className="font-semibold text-white text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-brand-pink animate-spin" style={{ animationDuration: '6s' }} />
              Configurando a Rota de Entrada
            </h5>
            <ol className="list-decimal list-inside text-xs text-slate-400 mt-2 space-y-2 leading-relaxed">
              <li>Copie a URL de webhook fornecida nas configurações do canal do UpChat.</li>
              <li>No painel do provedor (Ex: Hubsoft &rarr; Webhooks), cadastre uma nova integração HTTP.</li>
              <li>Selecione o evento <strong>fatura.pagamento</strong> ou <strong>fatura.recebimento</strong>.</li>
              <li>Configure o cabeçalho <code>Authorization</code> como Token Portador (Bearer Token) para segurança.</li>
            </ol>
          </div>

          <h5 className="font-semibold text-white text-sm mt-4">Payload de Webhook Padrão (Recebimento):</h5>
          <pre className="bg-[#000224] border border-white/10 rounded-xl p-4 overflow-x-auto text-[11px] font-mono text-brand-pink">
{`{
  "event": "invoice.paid",
  "timestamp": "2026-06-29T13:30:15Z",
  "data": {
    "id": 841724,
    "valor_pago": 99.90,
    "cpf_cliente": "12345678901",
    "meio_pagamento": "PIX",
    "transacao_id": "E12345678901234567890"
  }
}`}
          </pre>
        </div>
      )
    }
  ];

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeArticle = articles.find(a => a.id === activeArticleId) || articles[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Sidebar - Navigation articles */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* Search doc input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input 
            type="text"
            placeholder="Buscar documentação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#000224] border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/20 transition-all text-xs"
          />
        </div>

        {/* Sidebar Nav */}
        <div className="bg-[#000224]/50 border border-white/5 rounded-xl p-3 space-y-1">
          <span className="block text-[10px] text-slate-500 font-mono font-bold tracking-wider px-2.5 pb-2 uppercase border-b border-white/5 mb-2">Tópicos do Repositório</span>
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <button
                key={article.id}
                onClick={() => setActiveArticleId(article.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  activeArticleId === article.id
                    ? 'bg-brand-pink/10 text-brand-pink border-l-2 border-brand-pink pl-3'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div>
                  <span className="block text-[9px] opacity-65 uppercase font-mono font-semibold mb-0.5">{article.category}</span>
                  <span className="line-clamp-1">{article.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
              </button>
            ))
          ) : (
            <p className="text-xs text-slate-600 text-center py-4 font-mono">Nenhum tópico localizado.</p>
          )}
        </div>

        {/* Documentation External Support Card */}
        <div className="bg-gradient-to-br from-brand-pink/5 to-[#00054f]/5 border border-white/5 rounded-xl p-4 space-y-3">
          <div className="flex gap-2 items-center text-brand-pink">
            <HelpCircle className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">Suporte Integrador</h5>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Não encontrou a rota de API ou variável que precisava? Fale diretamente com o time de integrações UpChat no nosso Discord oficial ou portal de ajuda corporativo.
          </p>
          <a 
            href="https://upchat-developers.github.io/mothership-dashboard/" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-brand-pink font-bold hover:underline"
          >
            <span>Central de Suporte</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-8 bg-[#000224]/40 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-brand-pink/10 border border-brand-pink/20 text-brand-pink font-mono text-[9px] rounded font-bold uppercase tracking-wide">
            {activeArticle.category}
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-white mt-2 leading-tight">
            {activeArticle.title}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 pb-4 border-b border-white/5">
            {activeArticle.summary}
          </p>
        </div>

        <div className="text-slate-300 text-sm leading-relaxed">
          {activeArticle.content}
        </div>
      </div>

    </div>
  );
}
