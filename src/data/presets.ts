export interface IVRNode {
  id: string;
  label: string;
  type: 'menu' | 'input' | 'action' | 'condition' | 'end';
  text: string;
  options?: { key: string; label: string; targetId: string }[];
}

export interface IVRFlow {
  id: string;
  name: string;
  platform: 'Hubsoft' | 'SGP' | 'IXC' | 'Geral';
  description: string;
  driveUrl: string;
  updatedAt: string;
  author: string;
  tags: string[];
  nodes: IVRNode[];
  configurationGuide: string;
}

export interface UsefulSite {
  id: string;
  name: string;
  description: string;
  url: string;
  category: 'Desenvolvimento' | 'Marketing' | 'IA & Produtividade' | 'Ferramentas' | 'Outros';
  iconName: string;
}

export interface DriveFolder {
  id: string;
  name: string;
  description: string;
  url: string;
  fileCount: number;
  category: 'SGP' | 'HUBSOFT' | 'IXC' | 'HUBSOFT 1.1' | 'Voalle' | 'MK Solutions' | 'Outras integrações';
}

export interface DocArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
}

export interface TutorialVideo {
  id: string;
  title: string;
  duration: number; // in seconds
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  instructor: string;
  category: string;
  description: string;
  keyTakeaways: string[];
  visualSteps: { time: number; label: string; detail: string }[];
  videoUrl?: string;
  thumbnailUrl?: string;
  playlist?: string;
}

export const PRESET_DRIVE_FOLDERS: DriveFolder[] = [
  {
    id: 'drive-sgp',
    name: 'Fluxo Padrão: SGP',
    description: 'Arquivos de fluxo JSON e diagramas de integração para o sistema de gestão SGP (Financeiro, Suporte Técnico e Autoatendimento comercial).',
    url: 'https://drive.google.com/drive/folders/1_yIstG55h3U6-Hn5YWINeVzOe8W8P69X?usp=drive_link',
    fileCount: 14,
    category: 'SGP',
  },
  {
    id: 'drive-hubsoft',
    name: 'Fluxo Padrão: HUBSOFT',
    description: 'Templates JSON prontos e manuais para integração da API financeira e técnica do Hubsoft no painel UpChat.',
    url: 'https://drive.google.com/drive/folders/1_seXEr0jLE7taU3rjGdY0_00ATfRbzaR?usp=drive_link',
    fileCount: 16,
    category: 'HUBSOFT',
  },
  {
    id: 'drive-ixc',
    name: 'Fluxo Padrão: IXC',
    description: 'Diagramas de integração e scripts prontos para sincronização automática de ordens de serviço e faturas com o IXC Soft.',
    url: 'https://drive.google.com/drive/folders/11FN3-GlnsjR5KN7w4y8R9cd8b6uzW56h?usp=drive_link',
    fileCount: 18,
    category: 'IXC',
  },
  {
    id: 'drive-hubsoft-11',
    name: 'Fluxo Padrão: HUBSOFT 1.1',
    description: 'Versão atualizada (1.1) dos fluxogramas e webhooks para integração com a API RESTful avançada do Hubsoft.',
    url: 'https://drive.google.com/drive/folders/1J_KD3CKjFfek7w0fmYED1yxRJGT71MWh?usp=drive_link',
    fileCount: 12,
    category: 'HUBSOFT 1.1',
  },
  {
    id: 'drive-voalle',
    name: 'Fluxo Padrão: Voalle',
    description: 'Modelos de fluxos e credenciais para integração nativa com o ERP Voalle (Sychronis), otimizando o autoatendimento ISP.',
    url: 'https://drive.google.com/drive/folders/1O5URIPlKf0CYZiO-b2hdl-Xx2OUDKXHv?usp=drive_link',
    fileCount: 10,
    category: 'Voalle',
  },
  {
    id: 'drive-mksolutions',
    name: 'Fluxo Padrão: MK Solutions',
    description: 'Pasta com esquemas de webhooks, scripts de teste de conexão PPPoE e fluxos direcionados ao MK Solutions.',
    url: 'https://drive.google.com/drive/folders/1pdk9aSK91kL8DGs3iBBA8oUgBTNROZLl?usp=drive_link',
    fileCount: 11,
    category: 'MK Solutions',
  },
  {
    id: 'drive-ia-intencao',
    name: 'Fluxo Padrão: IA de intenção',
    description: 'Modelos e estruturas de prompts, diagramas de arquitetura e exemplos de configuração para a IA de Intenções do UpChat.',
    url: 'https://drive.google.com/drive/folders/19P56XwNOxPBA5aAB_GvUf3qR8_ZFF_RO?usp=drive_link',
    fileCount: 12,
    category: 'Outras integrações',
  },
  {
    id: 'drive-outras',
    name: 'Fluxo Padrão: Outras integrações',
    description: 'Repositório geral de scripts de suporte, arquivos de locução comuns e documentações complementares para outras integradoras ISP.',
    url: 'https://drive.google.com/drive/folders/1outras-example',
    fileCount: 22,
    category: 'Outras integrações',
  },
];

export const PRESET_USEFUL_SITES: UsefulSite[] = [
  {
    id: 'site-json-viewer',
    name: 'JSON Viewer',
    description: 'Formatador e visualizador de estruturas JSON online. Essencial para depurar payloads de integração das plataformas.',
    url: 'https://jsonviewer.stack.hu/',
    category: 'Ferramentas',
    iconName: 'Braces',
  },
  {
    id: 'site-meta-business',
    name: 'Meta Business Suite',
    description: 'Painel oficial do Meta para gerenciar contas de WhatsApp Business API, verificação de empresa e templates de mensagens.',
    url: 'https://business.facebook.com/',
    category: 'Marketing',
    iconName: 'Meta',
  },
  {
    id: 'site-claude',
    name: 'Claude AI',
    description: 'Inteligência Artificial de alta capacidade, excelente para construir prompts, scripts e ajudar na lógica de fluxos de chatbots.',
    url: 'https://claude.ai/',
    category: 'IA & Produtividade',
    iconName: 'Cpu',
  },
  {
    id: 'site-webhook-site',
    name: 'Webhook.site',
    description: 'Ferramenta para testar e inspecionar requisições HTTP em tempo real. Ideal para testar webhooks enviados pelas integradoras.',
    url: 'https://webhook.site/',
    category: 'Desenvolvimento',
    iconName: 'Webhook',
  },
  {
    id: 'site-regexr',
    name: 'RegExr',
    description: 'Criador e testador de Expressões Regulares (RegEx), fundamentais para criar intenções sofisticadas nos bots.',
    url: 'https://regexr.com/',
    category: 'Desenvolvimento',
    iconName: 'Code',
  },
  {
    id: 'site-jwt',
    name: 'JWT.io',
    description: 'Decodificador de tokens JSON Web Tokens (JWT), comumente usados na autenticação com APIs de provedores.',
    url: 'https://jwt.io/',
    category: 'Desenvolvimento',
    iconName: 'ShieldAlert',
  },
];

export const PRESET_IVR_FLOWS: IVRFlow[] = [
  {
    id: 'flow-hubsoft-financeiro',
    name: 'Autoatendimento Financeiro Hubsoft',
    platform: 'Hubsoft',
    description: 'Fluxo inteligente para consulta de faturas em atraso, geração de Pix copia-e-cola e liberação de desbloqueio em confiança automático via API Hubsoft.',
    driveUrl: 'https://drive.google.com/drive/folders/1hubsoft-fin-example',
    updatedAt: '2026-06-20',
    author: 'Time de Suporte UpChat',
    tags: ['Financeiro', 'API', 'Pix', 'Automação'],
    configurationGuide: `### Guia de Configuração - Hubsoft Financeiro

1. **Token de API**: No seu painel Hubsoft, vá em Configurações > Integrações > Chaves de API e gere uma chave com permissão de leitura de faturas e escrita de atendimento.
2. **Webhook**: Configure o webhook do UpChat apontando para o endpoint \`/api/hubsoft/webhook\` no seu painel para receber notificações de pagamento.
3. **Desbloqueio em Confiança**: Certifique-se de que a regra de desbloqueio em confiança no Hubsoft permite a liberação do cliente por 3 dias e que a carência está configurada corretamente para evitar fraudes.`,
    nodes: [
      {
        id: 'start',
        label: 'Boas-vindas e CPF',
        type: 'input',
        text: 'Olá! Sou o assistente virtual do seu Provedor. Para te ajudar, por favor digite seu CPF ou CNPJ (apenas números):',
        options: [{ key: 'valid_cpf', label: 'CPF/CNPJ Identificado', targetId: 'query_hubsoft' }]
      },
      {
        id: 'query_hubsoft',
        label: 'Consulta API Hubsoft',
        type: 'action',
        text: 'Consultando faturas e cadastro no Hubsoft...',
        options: [
          { key: 'debito', label: 'Fatura Pendente', targetId: 'menu_faturas' },
          { key: 'em_dia', label: 'Tudo em Dia', targetId: 'menu_tecnico' }
        ]
      },
      {
        id: 'menu_faturas',
        label: 'Menu de Faturas',
        type: 'menu',
        text: 'Identifiquei que você possui uma fatura em aberto com vencimento recente. Como deseja prosseguir?',
        options: [
          { key: '1', label: 'Obter PIX Copia e Cola', targetId: 'action_pix' },
          { key: '2', label: 'Desbloqueio em Confiança', targetId: 'action_desbloqueio' },
          { key: '3', label: 'Falar com atendente', targetId: 'transfer_human' }
        ]
      },
      {
        id: 'action_pix',
        label: 'Gerar Pix Copia e Cola',
        type: 'action',
        text: 'Buscando a chave PIX no Hubsoft... Segue o código para pagamento:\n\n\`00020101021226830014br.gov.bcb.pix2561api.hubsoft.example.com/v2/pix/f4d7f57a\`\n\nBasta copiar o código acima e colar no aplicativo do seu banco.',
        options: [{ key: 'done', label: 'Confirmar Envio', targetId: 'end_flow' }]
      },
      {
        id: 'action_desbloqueio',
        label: 'Liberar Conexão',
        type: 'action',
        text: 'Verificando elegibilidade... Processando o seu desbloqueio de confiança no Hubsoft. Sua conexão será restabelecida em até 10 minutos.',
        options: [{ key: 'done', label: 'Confirmar Liberação', targetId: 'end_flow' }]
      },
      {
        id: 'menu_tecnico',
        label: 'Sem pendências',
        type: 'menu',
        text: 'Suas faturas estão em dia! Como posso te ajudar hoje?',
        options: [
          { key: '1', label: 'Suporte Técnico', targetId: 'transfer_tecnico' },
          { key: '2', label: 'Segunda via de nota fiscal', targetId: 'action_nf' }
        ]
      },
      {
        id: 'transfer_human',
        label: 'Fila Financeira',
        type: 'end',
        text: 'Entendido. Estou te transferindo para a nossa equipe financeira humana. Por favor, aguarde um instante.'
      },
      {
        id: 'transfer_tecnico',
        label: 'Fila Técnica',
        type: 'end',
        text: 'Entendido. Vou te conectar com os especialistas em suporte técnico. Por favor, aguarde.'
      },
      {
        id: 'action_nf',
        label: 'Enviar Nota Fiscal',
        type: 'action',
        text: 'Gerando o arquivo PDF da nota fiscal do último mês... Aqui está o link para download: \`https://hubsoft.provedor.com/nf/pdf/3817498\`.',
        options: [{ key: 'done', label: 'Nota Enviada', targetId: 'end_flow' }]
      },
      {
        id: 'end_flow',
        label: 'Finalização',
        type: 'end',
        text: 'Fico feliz em ter ajudado! Se precisar de algo mais, basta mandar uma nova mensagem. Tenha um ótimo dia!'
      }
    ]
  },
  {
    id: 'flow-ixc-tecnico',
    name: 'Diagnóstico de Suporte Técnico IXC Soft',
    platform: 'IXC',
    description: 'Fluxo para triagem de suporte técnico de internet. Integra-se com a API do IXC Soft para checar status da fibra (porta PON), realizar teste de ping, e registrar ordem de serviço automática.',
    driveUrl: 'https://drive.google.com/drive/folders/1ixc-tech-example',
    updatedAt: '2026-06-25',
    author: 'Equipe de Integrações UpChat',
    tags: ['Suporte', 'Filtro de Fibra', 'API IXC', 'Ordens de Serviço'],
    configurationGuide: `### Guia de Configuração - IXC Soft Técnico

1. **Permissões de Usuário API**: No IXC, crie um usuário integrador com permissão para as tabelas:
   - \`su_oss_chamado\` (para abertura de chamados)
   - \`radusuarios\` (para consultar status do login PPPoE / IP)
   - \`radacct\` (para verificar logs de conexão)
2. **Integração ONU/OLT**: Certifique-se de que o seu IXC está sincronizado corretamente com as OLTs para que a rota de consulta de sinal de fibra consiga extrair as informações em tempo real.
3. **Filas de Atendimento**: Defina os IDs corretos dos departamentos para transferência de transbordo caso o bot não consiga resolver o problema de conexão do cliente.`,
    nodes: [
      {
        id: 'start',
        label: 'Identificação',
        type: 'input',
        text: 'Olá! Para iniciarmos seu atendimento técnico, digite o CPF do titular da internet:',
        options: [{ key: 'valid', label: 'Procurando contrato no IXC...', targetId: 'check_status_pppoe' }]
      },
      {
        id: 'check_status_pppoe',
        label: 'Consulta PPPoE (IXC)',
        type: 'action',
        text: 'Conectando com o banco IXC para verificar seu login de internet...',
        options: [
          { key: 'online', label: 'Conexão Estabelecida (ON)', targetId: 'flow_online' },
          { key: 'offline', label: 'Conexão Desconectada (OFF)', targetId: 'flow_offline' }
        ]
      },
      {
        id: 'flow_online',
        label: 'Cliente Online mas Sem Navegar',
        type: 'menu',
        text: 'Constatamos que seu equipamento está enviando sinal! Se você está com lentidão ou quedas constantes, o que deseja fazer?',
        options: [
          { key: '1', label: 'Fazer teste de velocidade', targetId: 'action_speed' },
          { key: '2', label: 'Reiniciar sinal do provedor', targetId: 'action_reboot_port' },
          { key: '3', label: 'Falar com Atendente Técnico', targetId: 'transfer_tech' }
        ]
      },
      {
        id: 'flow_offline',
        label: 'Cliente Offline (Sem Sinal)',
        type: 'menu',
        text: 'Identificamos que seu roteador está desconectado dos nossos servidores. Por favor, faça esse teste rápido:\n\n1. Desligue seu roteador da tomada por 30 segundos.\n2. Ligue novamente e aguarde 2 minutos.\n\nSua internet voltou?',
        options: [
          { key: '1', label: 'Sim, voltou a navegar!', targetId: 'end_sucesso' },
          { key: '2', label: 'Não, continua piscando vermelho/sem sinal', targetId: 'check_massiva' }
        ]
      },
      {
        id: 'action_speed',
        label: 'Dicas de Teste de Velocidade',
        type: 'action',
        text: 'Para um teste preciso, lembre-se de:\n- Conectar via cabo de rede diretamente ao roteador.\n- Desconectar outros aparelhos que usem internet.\n- Acessar: \`www.minhaconexao.com.br\`. Caso a velocidade esteja abaixo, reinicie o roteador.',
        options: [{ key: 'done', label: 'Menu Inicial', targetId: 'flow_online' }]
      },
      {
        id: 'action_reboot_port',
        label: 'Reinicialização de Rota',
        type: 'action',
        text: 'Enviando comando de reinicialização de porta do switch e renovação de lease DHCP... Aguarde 1 minuto e teste a conexão.',
        options: [{ key: 'done', label: 'Validar Conexão', targetId: 'check_status_pppoe' }]
      },
      {
        id: 'check_massiva',
        label: 'Verificar Massiva Local',
        type: 'condition',
        text: 'Verificando se há alguma instabilidade geral registrada para o seu bairro no IXC...',
        options: [
          { key: 'has_massiva', label: 'Manutenção na Região', targetId: 'show_massiva' },
          { key: 'no_massiva', label: 'Problema Isolado', targetId: 'open_os' }
        ]
      },
      {
        id: 'show_massiva',
        label: 'Aviso de Queda de Fibra',
        type: 'end',
        text: 'Atenção! Nossos técnicos já detectaram um rompimento de cabo de fibra óptica que atinge sua região. O tempo estimado de reparo é de até 3 horas. Não se preocupe, estamos trabalhando para restabelecer o sinal o mais rápido possível!'
      },
      {
        id: 'open_os',
        label: 'Abrir Chamado / OS',
        type: 'action',
        text: 'Como a sua região está normal, vamos abrir um chamado técnico. Uma Ordem de Serviço foi gerada com sucesso sob o número **#2026-98172**. Nossa equipe técnica entrará em contato via telefone.',
        options: [{ key: 'done', label: 'Finalizar', targetId: 'end_sucesso' }]
      },
      {
        id: 'transfer_tech',
        label: 'Transbordo Suporte',
        type: 'end',
        text: 'Transferindo para a fila de suporte de nível 2... Por favor, aguarde na linha do chat.'
      },
      {
        id: 'end_sucesso',
        label: 'Caso Resolvido',
        type: 'end',
        text: 'Excelente! Fico muito contente que sua internet está funcionando perfeitamente de novo. Se precisar, estarei por aqui!'
      }
    ]
  },
  {
    id: 'flow-sgp-atendimento',
    name: 'Atendimento e SAC Integrado SGP',
    platform: 'SGP',
    description: 'Fluxo para o sistema SGP (Sistema de Gestão de Provedores). Permite consultar a situação cadastral do assinante, emitir 2ª via de faturas vencidas, e transferir para os setores corretos usando as filas configuradas no SGP.',
    driveUrl: 'https://drive.google.com/drive/folders/1sgp-atend-example',
    updatedAt: '2026-06-18',
    author: 'Time de Integrações UpChat',
    tags: ['SGP', 'SAC', 'Integração', 'Provedores'],
    configurationGuide: `### Guia de Configuração - SGP

1. **Configuração do Host**: Informe a URL do seu servidor SGP (ex: \`https://sgp.seuprovedor.com.br\`) nas variáveis de ambiente do UpChat.
2. **Token de Autenticação**: Obtenha o token do usuário da API no menu Administração > Usuários > API do SGP.
3. **Configuração de Departamentos**: Mapeie os IDs dos setores para que coincidam com os IDs das filas internas do SGP (ex: Comercial = ID 1, Financeiro = ID 2, Técnico = ID 3).`,
    nodes: [
      {
        id: 'start',
        label: 'Identificação Cadastral',
        type: 'input',
        text: 'Bem-vindo ao autoatendimento! Digite seu CPF para prosseguirmos:',
        options: [{ key: 'valid', label: 'Consultando SGP...', targetId: 'menu_opcoes' }]
      },
      {
        id: 'menu_opcoes',
        label: 'Menu do Assinante',
        type: 'menu',
        text: 'Olá! Identifiquei seu cadastro. Escolha uma das opções abaixo para que eu possa te direcionar:',
        options: [
          { key: '1', label: 'Segunda via de Boleto SGP', targetId: 'action_boleto_sgp' },
          { key: '2', label: 'Problemas Técnicos', targetId: 'transfer_sgp_tec' },
          { key: '3', label: 'Alterar plano / Comercial', targetId: 'transfer_sgp_com' },
          { key: '4', label: 'Dúvidas Frequentes', targetId: 'faq_sgp' }
        ]
      },
      {
        id: 'action_boleto_sgp',
        label: 'Buscar boleto SGP',
        type: 'action',
        text: 'Estou gerando o arquivo da sua fatura em aberto... Aqui está o código PIX para facilitar o pagamento:\n\n\`00020101021226830014br.gov.bcb.pix2561api.sgp.example.com/pix/active-invoice\`\n\nCaso prefira, você também pode baixar o boleto PDF completo clicando no botão do Google Drive de suporte.',
        options: [{ key: 'done', label: 'Voltar ao Menu', targetId: 'menu_opcoes' }]
      },
      {
        id: 'transfer_sgp_tec',
        label: 'Encaminha Técnico SGP',
        type: 'end',
        text: 'Encaminhando seu chat para a fila do Suporte Técnico no SGP. Nosso tempo médio de espera é de 5 minutos.'
      },
      {
        id: 'transfer_sgp_com',
        label: 'Encaminha Comercial SGP',
        type: 'end',
        text: 'Direcionando para o setor de Vendas e Upgrade de Planos do SGP... Logo um consultor falará com você.'
      },
      {
        id: 'faq_sgp',
        label: 'FAQ SGP',
        type: 'menu',
        text: 'Tire suas dúvidas rápidas:\n\n1. Como mudar a senha do Wi-Fi?\n2. Quais as formas de pagamento?\n3. Voltar para o menu principal',
        options: [
          { key: '1', label: 'Mudar Senha Wi-Fi', targetId: 'faq_wifi' },
          { key: '2', label: 'Formas de Pagamento', targetId: 'faq_pay' },
          { key: '3', label: 'Voltar', targetId: 'menu_opcoes' }
        ]
      },
      {
        id: 'faq_wifi',
        label: 'Dica Wi-Fi',
        type: 'action',
        text: 'Para alterar a senha do Wi-Fi, você pode acessar o nosso aplicativo do cliente ou se conectar ao endereço \`192.168.1.1\` utilizando o login e senha contidos no selo sob o roteador.',
        options: [{ key: 'done', label: 'Voltar para FAQ', targetId: 'faq_sgp' }]
      },
      {
        id: 'faq_pay',
        label: 'Dica Pagamentos',
        type: 'action',
        text: 'Aceitamos pagamentos via PIX, Cartão de Crédito (recorrente no aplicativo), Boleto Bancário e Débito Automático.',
        options: [{ key: 'done', label: 'Voltar para FAQ', targetId: 'faq_sgp' }]
      }
    ]
  }
];
