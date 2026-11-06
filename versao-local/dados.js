// ===== Dados (por enquanto, uma lista num arquivo do projeto) =====
// Usada pelo publico.js (Aula 12) e pelo admin.js (Aula 13).
// Na Aula 15, este arquivo sai do projeto: os dados passam a vir da API.
let redacoes = [
    {
        id: 1,
        tema: "Modelo dissertativo-argumentativo",
        titulo: "Modelo dissertativo-argumentativo",
        candidato: "Maria Silva",
        matricula: "2023-001",
        status: "aprovada",
        texto: "No contexto da sociedade brasileira, a discussão acerca de [tema proposto] revela-se fundamental para a compreensão de [contextualização relacionada ao assunto]. Sob essa perspectiva, observa-se que [apresentação da problemática ou controvérsia], circunstância que exige uma análise criteriosa. Nesse sentido, destacam-se [argumento 1] e [argumento 2] como aspectos essenciais para compreender essa realidade.\n\n" +
               "Em primeiro lugar, é necessário considerar que [argumento 1] exerce influência significativa sobre [tema]. Isso ocorre porque [explicação fundamentada do argumento], o que evidencia [aprofundamento da ideia]. Nesse contexto, [exemplo concreto ou repertório pertinente] demonstra como essa questão se manifesta na sociedade. Dessa maneira, percebe-se que [análise crítica e fechamento do argumento].\n\n" +
               "Além disso, convém destacar que [argumento 2] constitui outro elemento relevante para a compreensão do tema. Tal perspectiva se justifica pelo fato de que [explicação do segundo argumento], especialmente quando se considera [aprofundamento da discussão]. A esse respeito, [exemplo, dado ou referência pertinente] reforça a importância dessa análise. Consequentemente, [interpretação crítica e consequência relacionada ao argumento].\n\n" +
               "Portanto, diante dos aspectos apresentados, constata-se que [retomada da tese] está diretamente relacionado a [síntese dos argumentos desenvolvidos]. Assim, compreender [tema] pressupõe reconhecer a importância de [reflexão decorrente da análise]. Desse modo, torna-se evidente que [fechamento crítico e coerente com a discussão].",
        comentarios: [
            {
                id: 1,
                autor: "Prof. Carlos",
                texto: "Boa argumentação, mas faltou repertório sociocultural.",
                data: "2026-05-10"
            }
        ]
    },
    {
        id: 2,
        tema: "Desafios para democratizar o acesso à leitura no Brasil",
        titulo: "Desafios para democratizar o acesso à leitura no Brasil",
        candidato: "João Souza",
        matricula: "2022-114",
        status: "aprovada",
        texto: "No ensaio “O direito à literatura”, Antonio Candido defende o acesso à criação literária como uma necessidade ligada à formação humana. No Brasil, entretanto, o contato com os livros permanece limitado por obstáculos que ultrapassam a disposição individual para ler. Nesse contexto, a desigualdade no acesso a acervos e a insuficiência da mediação de leitura dificultam a democratização dessa prática.\n\n" +
               "Em primeiro lugar, a distribuição dos livros restringe as oportunidades de leitura. Quando uma comunidade não dispõe de biblioteca próxima e bem equipada, o contato com diferentes obras passa a depender da compra de exemplares ou de deslocamentos que exigem tempo e dinheiro dos moradores. A oferta digital, por sua vez, não elimina essas barreiras, pois pressupõe equipamentos e condições de acesso que também são distribuídos desigualmente. Assim, a renda e o local de moradia podem limitar as escolhas dos leitores, afastando o acesso à literatura da universalidade defendida por Candido.\n\n" +
               "Além disso, disponibilizar livros não basta para construir vínculos com a leitura. Quem encontra dificuldades de compreensão pode precisar de orientação para escolher uma obra e desenvolver estratégias de interpretação. Sem esse apoio, o contato com textos muito distantes de sua experiência pode gerar frustração e reforçar a ideia de que ler é uma atividade inacessível. Rodas de conversa e indicações variadas ajudam a criar outros percursos. Quando essa mediação falta, os acervos podem permanecer pouco utilizados, mesmo em espaços que já contam com livros disponíveis à população.\n\n" +
               "Portanto, as secretarias municipais de Cultura devem ampliar bibliotecas comunitárias e serviços itinerantes, por meio de investimentos em acervos, equipes e horários compatíveis com a rotina dos moradores, para facilitar o acesso. A escolha das obras deve considerar sugestões da comunidade e formatos acessíveis. Paralelamente, as escolas, em parceria com bibliotecários, devem organizar encontros regulares de leitura, com escolha orientada e discussão dos textos, a fim de apoiar a compreensão e fortalecer a autonomia dos leitores. Desse modo, o direito defendido por Candido poderá fazer parte do cotidiano.",
        comentarios: []
    },
    {
        id: 3,
        tema: "Democratização do acesso à cultura",
        titulo: "Cultura para quem?",
        candidato: "Ana Costa",
        matricula: "2023-089",
        status: "aguardando",
        texto: "O acesso à cultura no Brasil ainda é privilégio de poucos...\n\n" +
               "Logo, políticas públicas são essenciais.",
        comentarios: []
    },
    {
        id: 4,
        tema: "Mobilidade urbana nas grandes cidades",
        titulo: "O trânsito que nos paralisa",
        candidato: "Pedro Lima",
        matricula: "2023-150",
        status: "recusada",
        texto: "As grandes cidades brasileiras enfrentam congestionamentos diários...\n\n" +
               "Assim, investir em transporte público é urgente.",
        comentarios: []
    }
];
