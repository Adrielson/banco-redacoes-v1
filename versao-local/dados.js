// ===== Dados (por enquanto, uma lista num arquivo do projeto) =====
// Usada pelo publico.js (Aula 12) e pelo admin.js (Aula 13).
// Na Aula 15, este arquivo sai do projeto: os dados passam a vir da API.
let redacoes = [
    {
        id: 1,
        tema: "Desafios da educação digital no Brasil",
        titulo: "Conectados, mas desiguais",
        candidato: "Maria Silva",
        matricula: "2023-001",
        status: "aprovada",
        texto: "A educação digital no Brasil enfrenta desafios históricos...\n\n" +
               "Em primeiro lugar, a desigualdade de acesso à internet...\n\n" +
               "Portanto, é fundamental que o Estado invista em infraestrutura.",
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
        tema: "Caminhos para combater a desinformação",
        titulo: "A verdade em tempos de algoritmo",
        candidato: "João Souza",
        matricula: "2022-114",
        status: "aprovada",
        texto: "A desinformação tornou-se um dos maiores males da era digital...\n\n" +
               "É preciso, portanto, educar midiaticamente a população.",
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
