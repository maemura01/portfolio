import AriaMock from './AriaMock';
import ParceirosMock from './ParceirosMock';
import SqlMock from './SqlMock';
import CrmMock from './CrmMock';
import CredMock from './CredMock';

export const GITHUB = 'https://github.com/maemura01';

/**
 * Tudo genérico: nenhum nome de empresa, parceiro ou cliente.
 * `design` é o tamanho em que cada demo foi desenhada (usado para escalar no cartão).
 * `camadas` alimenta o storytelling: cada linha é uma camada da stack.
 */
export const PROJETOS = [
  {
    id: 'aria',
    titulo: 'Aria Console',
    resumo: 'Painel de uma IA de SDR: a IA agenda, o time ajusta.',
    arte: AriaMock,
    design: { w: 480, h: 600 },
    href: `${GITHUB}/aria-console`,
    interativo: true,
    cor: '#ff5a5f',
    problema:
      'Uma IA marca reuniões com leads o dia inteiro. O time humano precisa ver tudo isso numa agenda só, ajustar horários e registrar presença, sem conflito e com cada pessoa vendo só o que pode.',
    camadas: [
      ['Interface', ['React', 'Vite', 'Tailwind', 'Arrastar e soltar']],
      ['Lógica', ['Funções serverless', 'Endpoint que a IA chama', 'Regra por score']],
      ['Dados', ['PostgreSQL', 'Supabase Auth', 'RLS por usuário']],
      ['Integração', ['Google Calendar', 'OAuth']],
    ],
    resolve:
      'A IA agenda sozinha por um endpoint seguro, a agenda do time se atualiza e cada papel enxerga apenas o que lhe cabe.',
  },
  {
    id: 'parceiros',
    titulo: 'Painel de parceiros e gerentes',
    resumo: 'Doze visões para a diretoria, com resumo automático por WhatsApp.',
    arte: ParceirosMock,
    design: { w: 480, h: 600 },
    cor: '#1b3fd8',
    problema:
      'A diretoria precisava acompanhar a produção por parceiro e por gerente, comparar períodos de forma justa e receber o resumo sem alguém montar planilha toda semana.',
    camadas: [
      ['Interface', ['HTML e JS puro', 'Gráficos leves', 'Doze visões']],
      ['Lógica', ['Funções serverless', 'Cache na CDN', 'Dia útil × dia útil']],
      ['Dados', ['SQL no PostgreSQL', 'Regras de venda e funil']],
      ['Automação', ['Cron externo', 'Cartão em imagem', 'WhatsApp']],
    ],
    resolve:
      'Todo mundo olha os mesmos números, sempre atualizados, e o resumo chega sozinho em horários fixos.',
  },
  {
    id: 'sql',
    titulo: 'Funil de leads em SQL',
    resumo: 'Mais de 30 mil leads por mês ligados ao funil de vendas.',
    arte: SqlMock,
    design: { w: 480, h: 600 },
    cor: '#f4e72b',
    problema:
      'Custo e conversão ficavam espalhados entre as plataformas de mídia paga e o CRM. Fechar o mês exigia dias de cruzamento manual de bases.',
    camadas: [
      ['Visualização', ['Metabase', 'Power BI']],
      ['Lógica', ['CTEs', 'Window functions', 'Subqueries']],
      ['Dados', ['PostgreSQL', 'JSONB', 'Data Quality']],
      ['Ingestão', ['Meta', 'Google', 'TikTok', 'Pipelines de ETL']],
    ],
    resolve:
      'Um funil único com CPL, CAC e conversão por origem, e um fechamento mensal que levava dias passou a levar um.',
  },
  {
    id: 'scraper',
    titulo: 'Scraper de CRM',
    resumo: 'Extrai propostas de um CRM sem API e retoma de onde parou.',
    arte: CrmMock,
    design: { w: 640, h: 360 },
    href: `${GITHUB}/crm-proposal-scraper`,
    cor: '#1fa85a',
    problema:
      'Os dados estavam presos num CRM que não oferece API. Era preciso coletar dezenas de milhares de propostas operando a própria interface, sem perder nada se algo caísse no meio.',
    camadas: [
      ['Interface', ['Dashboard web', 'Logs em tempo real']],
      ['Lógica', ['Playwright', 'Sessão reaproveitada', 'Checkpoint']],
      ['Dados', ['Gravação incremental', 'JSON e CSV', 'Upsert por id']],
      ['Serviço', ['FastAPI', 'WebSocket', 'Agendador']],
    ],
    resolve:
      'Coleta contínua e retomável: cai, volta e segue de onde parou, sem duplicar e sem perder registro.',
  },
  {
    id: 'credenciais',
    titulo: 'Credenciais cifradas no navegador',
    resumo: 'A senha é cifrada no aparelho; o banco nunca a vê em texto puro.',
    arte: CredMock,
    design: { w: 640, h: 360 },
    href: `${GITHUB}/secure-credential-intake`,
    cor: '#111111',
    problema:
      'Senhas de clientes iam para uma planilha compartilhada, em texto puro e sem registro de quem abriu. Era preciso coletar de forma segura e saber quem leu cada uma.',
    camadas: [
      ['Interface', ['Next.js', 'Formulário no cliente']],
      ['Cripto', ['ECIES', 'WebCrypto', 'Chave só no servidor']],
      ['Dados', ['Supabase', 'Só texto cifrado', 'RLS']],
      ['Auditoria', ['Quem leu', 'Quando leu']],
    ],
    resolve:
      'O banco guarda apenas texto cifrado e cada leitura fica registrada com nome e horário.',
  },
];

// Demo estática de um projeto, usada no cartão e no modal.
export function Arte({ id }) {
  const p = PROJETOS.find((x) => x.id === id);
  const Mock = p.arte;
  return <Mock />;
}
