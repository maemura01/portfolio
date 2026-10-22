import AriaMock from './AriaMock';
import ParceirosMock from './ParceirosMock';
import SqlMock from './SqlMock';
import CrmMock from './CrmMock';
import CredMock from './CredMock';

export const GITHUB = 'https://github.com/maemura01';

/**
 * Tudo genérico: nenhum nome de empresa, parceiro ou cliente.
 * `design` é o tamanho em que cada demo foi desenhada (usado para escalar no cartão).
 * `camadas`: [nome da camada, tecnologias, uma frase explicando o que ela faz].
 */
export const PROJETOS = [
  {
    id: 'aria',
    titulo: 'Aria Console',
    resumo: 'A IA agenda as reuniões e o time comercial acompanha, entra no horário e registra o resultado.',
    arte: AriaMock,
    design: { w: 480, h: 600 },
    href: `${GITHUB}/aria-console`,
    interativo: true,
    cor: '#ff5a5f',
    problema:
      'Uma IA que atua como SDR conversa com os leads e agenda reuniões para o time comercial participar e fechar negócio. O time precisava de um lugar só para controlar esses agendamentos: ver os dados de cada cliente, pegar o link da reunião gerado pela IA e entrar na hora certa, marcar se o cliente compareceu e deixar anotações, sem conflito de agenda e sem ver o que não é seu.',
    camadas: [
      ['Interface', ['React', 'Vite', 'Tailwind'], 'Uma agenda em React onde o time arrasta a reunião para outro horário e abre o card do cliente: dados, link da reunião, comparecimento e anotações.'],
      ['Back-end (BFF)', ['Funções serverless', 'Endpoint para a IA'], 'Uma camada que fica entre a tela e o resto: uma parte serve a interface e outra é o endpoint que a IA chama para agendar a reunião, por score, já com o link para o time entrar.'],
      ['Banco de dados', ['PostgreSQL', 'Supabase Auth', 'RLS'], 'Login e regras de acesso direto no banco, para cada perfil ver só o que tem permissão.'],
      ['Integração', ['Google Calendar', 'OAuth'], 'A reunião aparece na agenda real de cada atendente, não só dentro do painel.'],
    ],
    resolve:
      'Cada agendamento vira um card com tudo dentro: informações do cliente, o link da reunião gerado pela IA, o controle de comparecimento e as anotações. A IA marca sozinha por um endpoint seguro, a agenda do time se atualiza na hora e as regras (individual de manhã, coletiva à tarde) ficam garantidas pelo próprio sistema.',
  },
  {
    id: 'parceiros',
    titulo: 'Painel de parceiros e gerentes',
    resumo: 'Os números da operação num só painel e um resumo que chega sozinho no WhatsApp.',
    arte: ParceirosMock,
    design: { w: 480, h: 600 },
    cor: '#1b3fd8',
    problema:
      'A diretoria queria acompanhar a produção por parceiro e por gerente e comparar um período com o anterior de forma justa, usando o mesmo trecho de dias úteis. Até então isso dependia de alguém montar planilha toda semana.',
    camadas: [
      ['Interface', ['HTML e JS puro', 'Doze visões'], 'Uma página leve, sem framework pesado, com doze visões e gráficos pensados para a diretoria bater o olho.'],
      ['Back-end (BFF)', ['Funções serverless', 'Cache na CDN'], 'O servidor busca e prepara os dados antes de entregar à tela, guardando cada resposta por 30 minutos para abrir rápido e poupar o banco.'],
      ['Banco de dados', ['PostgreSQL', 'SQL'], 'As regras de negócio vivem nas consultas: o que conta como venda, loja ativa, funil e a comparação dia útil contra dia útil.'],
      ['Automação', ['Cron', 'Cartão em imagem', 'WhatsApp'], 'Em horários fixos, um agendador aciona o servidor, que desenha o resumo como imagem e envia pelo WhatsApp.'],
    ],
    resolve:
      'Todo mundo passou a olhar os mesmos números, sempre atualizados. E duas vezes por dia útil um cartão com o resumo chega pronto no WhatsApp da direção, sem ninguém precisar pedir.',
  },
  {
    id: 'sql',
    titulo: 'Funil de leads em SQL',
    resumo: 'Mais de 30 mil leads por mês em um funil único, do anúncio até a venda.',
    arte: SqlMock,
    design: { w: 480, h: 600 },
    cor: '#f4e72b',
    problema:
      'Os dados de custo e de conversão estavam espalhados: uma parte nas plataformas de anúncio (Meta, Google e TikTok) e outra no CRM. Para fechar o mês, era preciso passar dias cruzando bases na mão.',
    camadas: [
      ['Visualização', ['Metabase', 'Power BI'], 'Painéis para o comercial e a diretoria olharem os resultados sem precisar escrever SQL.'],
      ['Consultas', ['CTEs', 'Window functions'], 'Consultas que calculam conversão e ranking por origem em uma passada só, sem planilha no meio.'],
      ['Banco de dados', ['PostgreSQL', 'JSONB', 'Data Quality'], 'Os dados ficam organizados no PostgreSQL, com campos flexíveis (JSONB) para o que chega sem formato fixo e rotinas que mantêm a base confiável.'],
      ['Ingestão', ['Meta', 'Google', 'TikTok', 'ETL'], 'Pipelines puxam os dados das plataformas de anúncio e do CRM e os colocam no mesmo lugar.'],
    ],
    resolve:
      'Criei um funil único, com custo por lead (CPL), custo de aquisição (CAC) e conversão por origem. O fechamento mensal, que levava dias, passou a levar um.',
  },
  {
    id: 'scraper',
    titulo: 'Scraper de CRM',
    resumo: 'Tira dados de um CRM que não tem API e continua de onde parou se algo cair.',
    arte: CrmMock,
    design: { w: 640, h: 360 },
    href: `${GITHUB}/crm-proposal-scraper`,
    cor: '#1fa85a',
    problema:
      'Os dados estavam presos num CRM que não oferece API. Eram milhares de propostas para coletar operando a própria tela do sistema, e sem poder perder nada se a conexão caísse ou o computador reiniciasse.',
    camadas: [
      ['Interface', ['Painel web', 'Logs ao vivo'], 'Um painel simples para iniciar a coleta e acompanhar, em tempo real, o que o robô está fazendo.'],
      ['Automação', ['Playwright', 'Python'], 'O robô entra no CRM como uma pessoa entraria, reaproveita o login e salva um ponto de retomada a cada lote.'],
      ['Dados', ['JSON', 'CSV', 'Upsert por id'], 'Cada proposta é gravada aos poucos e atualizada pelo seu id, em vez de repetida.'],
      ['Serviço', ['FastAPI', 'WebSocket'], 'Um serviço transmite os logs para o painel e dispara as coletas de forma agendada.'],
    ],
    resolve:
      'A coleta roda sozinha e é retomável: se cair, volta do último ponto salvo, sem duplicar nem perder registro.',
  },
  {
    id: 'credenciais',
    titulo: 'Credenciais cifradas no navegador',
    resumo: 'A senha é trancada no aparelho do cliente e o banco nunca a vê em texto aberto.',
    arte: CredMock,
    design: { w: 640, h: 360 },
    href: `${GITHUB}/secure-credential-intake`,
    cor: '#111111',
    problema:
      'Para concluir um processo, era preciso coletar o login e a senha de clientes em um portal. Isso ia para uma planilha compartilhada: senha em texto puro e nenhum registro de quem abriu.',
    camadas: [
      ['Interface', ['Next.js', 'Formulário'], 'Um formulário que cifra a senha ali mesmo, no aparelho do cliente, antes de enviar.'],
      ['Criptografia', ['ECIES', 'WebCrypto'], 'Só quem tem a chave privada, guardada no servidor, consegue abrir o que foi cifrado.'],
      ['Banco de dados', ['Supabase', 'RLS'], 'O banco guarda apenas o texto cifrado, protegido por regras de acesso.'],
      ['Auditoria', ['Quem leu', 'Quando'], 'Cada leitura grava o nome de quem abriu e o horário.'],
    ],
    resolve:
      'A senha deixa de existir em texto aberto em qualquer lugar. O banco só guarda a versão cifrada e todo acesso fica registrado.',
  },
];

// Demo estática de um projeto, usada no cartão e no modal.
export function Arte({ id }) {
  const p = PROJETOS.find((x) => x.id === id);
  const Mock = p.arte;
  return <Mock />;
}
