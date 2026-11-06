# ===== Importações =====
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import date

# ===== Criação da aplicação =====
app = Flask(__name__)
CORS(app)  # deixa as páginas, abertas em outro endereço, conversarem com a API
app.json.ensure_ascii = False  # acentos aparecem como acentos no JSON
app.json.sort_keys = False     # campos na ordem em que foram escritos

# ===== Dados (por enquanto, uma lista na memória da API) =====
# A mesma lista das Aulas 12 e 13, agora em Python.
# Nas Aulas 17 e 18, ela é trocada por um banco de dados.
redacoes = [
    {
        "id": 1,
        "tema": "Modelo dissertativo-argumentativo",
        "titulo": "Modelo dissertativo-argumentativo",
        "candidato": "Maria Silva",
        "matricula": "2023-001",
        "status": "aprovada",
        "nota": 640,
        "texto": ("No contexto da sociedade brasileira, a discussão acerca de [tema proposto] "
                  "revela-se fundamental para a compreensão de [contextualização relacionada ao "
                  "assunto]. Sob essa perspectiva, observa-se que [apresentação da problemática ou "
                  "controvérsia], circunstância que exige uma análise criteriosa. Nesse sentido, "
                  "destacam-se [argumento 1] e [argumento 2] como aspectos essenciais para "
                  "compreender essa realidade.\n\n"
                  "Em primeiro lugar, é necessário considerar que [argumento 1] exerce influência "
                  "significativa sobre [tema]. Isso ocorre porque [explicação fundamentada do "
                  "argumento], o que evidencia [aprofundamento da ideia]. Nesse contexto, [exemplo "
                  "concreto ou repertório pertinente] demonstra como essa questão se manifesta na "
                  "sociedade. Dessa maneira, percebe-se que [análise crítica e fechamento do "
                  "argumento].\n\n"
                  "Além disso, convém destacar que [argumento 2] constitui outro elemento relevante"
                  " para a compreensão do tema. Tal perspectiva se justifica pelo fato de que "
                  "[explicação do segundo argumento], especialmente quando se considera "
                  "[aprofundamento da discussão]. A esse respeito, [exemplo, dado ou referência "
                  "pertinente] reforça a importância dessa análise. Consequentemente, "
                  "[interpretação crítica e consequência relacionada ao argumento].\n\n"
                  "Portanto, diante dos aspectos apresentados, constata-se que [retomada da tese] "
                  "está diretamente relacionado a [síntese dos argumentos desenvolvidos]. Assim, "
                  "compreender [tema] pressupõe reconhecer a importância de [reflexão decorrente da"
                  " análise]. Desse modo, torna-se evidente que [fechamento crítico e coerente com "
                  "a discussão]."),
        "comentarios": [
            {
                "id": 1,
                "autor": "Prof. Carlos",
                "texto": "Boa argumentação, mas faltou repertório sociocultural.",
                "data": "2026-05-10"
            }
        ]
    },
    {
        "id": 2,
        "tema": "Desafios para democratizar o acesso à leitura no Brasil",
        "titulo": "Desafios para democratizar o acesso à leitura no Brasil",
        "candidato": "João Souza",
        "matricula": "2022-114",
        "status": "aprovada",
        "nota": 960,
        "texto": ("No ensaio “O direito à literatura”, Antonio Candido defende o acesso à criação "
                  "literária como uma necessidade ligada à formação humana. No Brasil, entretanto, "
                  "o contato com os livros permanece limitado por obstáculos que ultrapassam a "
                  "disposição individual para ler. Nesse contexto, a desigualdade no acesso a "
                  "acervos e a insuficiência da mediação de leitura dificultam a democratização "
                  "dessa prática.\n\n"
                  "Em primeiro lugar, a distribuição dos livros restringe as oportunidades de "
                  "leitura. Quando uma comunidade não dispõe de biblioteca próxima e bem equipada, "
                  "o contato com diferentes obras passa a depender da compra de exemplares ou de "
                  "deslocamentos que exigem tempo e dinheiro dos moradores. A oferta digital, por "
                  "sua vez, não elimina essas barreiras, pois pressupõe equipamentos e condições de"
                  " acesso que também são distribuídos desigualmente. Assim, a renda e o local de "
                  "moradia podem limitar as escolhas dos leitores, afastando o acesso à literatura "
                  "da universalidade defendida por Candido.\n\n"
                  "Além disso, disponibilizar livros não basta para construir vínculos com a "
                  "leitura. Quem encontra dificuldades de compreensão pode precisar de orientação "
                  "para escolher uma obra e desenvolver estratégias de interpretação. Sem esse "
                  "apoio, o contato com textos muito distantes de sua experiência pode gerar "
                  "frustração e reforçar a ideia de que ler é uma atividade inacessível. Rodas de "
                  "conversa e indicações variadas ajudam a criar outros percursos. Quando essa "
                  "mediação falta, os acervos podem permanecer pouco utilizados, mesmo em espaços "
                  "que já contam com livros disponíveis à população.\n\n"
                  "Portanto, as secretarias municipais de Cultura devem ampliar bibliotecas "
                  "comunitárias e serviços itinerantes, por meio de investimentos em acervos, "
                  "equipes e horários compatíveis com a rotina dos moradores, para facilitar o "
                  "acesso. A escolha das obras deve considerar sugestões da comunidade e formatos "
                  "acessíveis. Paralelamente, as escolas, em parceria com bibliotecários, devem "
                  "organizar encontros regulares de leitura, com escolha orientada e discussão dos "
                  "textos, a fim de apoiar a compreensão e fortalecer a autonomia dos leitores. "
                  "Desse modo, o direito defendido por Candido poderá fazer parte do cotidiano."),
        "comentarios": []
    },
    {
        "id": 3,
        "tema": "Democratização do acesso à cultura",
        "titulo": "Cultura para quem?",
        "candidato": "Ana Costa",
        "matricula": "2023-089",
        "status": "aguardando",
        "nota": None,
        "texto": ("O acesso à cultura no Brasil ainda é privilégio de poucos...\n\n"
                  "Logo, políticas públicas são essenciais."),
        "comentarios": []
    },
    {
        "id": 4,
        "tema": "Mobilidade urbana nas grandes cidades",
        "titulo": "O trânsito que nos paralisa",
        "candidato": "Pedro Lima",
        "matricula": "2023-150",
        "status": "recusada",
        "nota": 480,
        "texto": ("As grandes cidades brasileiras enfrentam congestionamentos diários...\n\n"
                  "Assim, investir em transporte público é urgente."),
        "comentarios": []
    }
]

# Próximos números livres para novas redações e novos comentários
proximo_id = 5
proximo_comentario_id = 2

# Os únicos status que uma redação pode ter
STATUS_VALIDOS = ["aguardando", "aprovada", "recusada"]

# Campos que toda redação precisa ter preenchidos (o título é opcional)
CAMPOS_OBRIGATORIOS = ["tema", "candidato", "texto"]

# A nota vai de 0 a 1000, como no ENEM (None enquanto a redação não foi corrigida)
NOTA_MAXIMA = 1000


# Confere a nota: vazia (None) ou um número inteiro de 0 a 1000
def nota_valida(nota):
    if nota is None:
        return True
    return type(nota) is int and 0 <= nota <= NOTA_MAXIMA


# ===== GET /redacoes: lista as redações (aceita ?status=aprovada) =====
@app.route("/redacoes", methods=["GET"])
def listar_redacoes():
    status = request.args.get("status")
    if status:
        filtradas = [r for r in redacoes if r["status"] == status]
        return jsonify(filtradas)
    return jsonify(redacoes)


# ===== Função auxiliar =====

# Procura a redação com aquele id; devolve None se não existir
def buscar_redacao(id):
    for redacao in redacoes:
        if redacao["id"] == id:
            return redacao
    return None


# ===== GET /redacoes/<id>: uma redação =====
@app.route("/redacoes/<int:id>", methods=["GET"])
def ler_redacao(id):
    redacao = buscar_redacao(id)
    if redacao is None:
        return jsonify({"erro": "Redação não encontrada"}), 404
    return jsonify(redacao)


# ===== POST /redacoes: cria uma redação =====
@app.route("/redacoes", methods=["POST"])
def criar_redacao():
    global proximo_id
    dados = request.get_json()

    for campo in CAMPOS_OBRIGATORIOS:
        if not dados.get(campo):
            return jsonify({"erro": f"O campo {campo} é obrigatório"}), 400

    # O candidato não manda status: a redação entra como "aguardando".
    # O painel pode escolher o status no formulário de adicionar.
    status = dados.get("status", "aguardando")
    if status not in STATUS_VALIDOS:
        return jsonify({"erro": "Status inválido"}), 400

    # A nota vem do painel do administrador (o enviar.js não manda nota).
    # Na Aula 19, a API passa a conferir o login: só o administrador dá nota.
    nota = dados.get("nota")
    if not nota_valida(nota):
        return jsonify({"erro": "A nota deve ser um número inteiro de 0 a 1000"}), 400

    nova = {
        "id": proximo_id,
        "tema": dados["tema"],
        "titulo": dados.get("titulo") or "",
        "candidato": dados["candidato"],
        "matricula": dados.get("matricula", ""),
        "status": status,
        "nota": nota,
        "texto": dados["texto"],
        "comentarios": []
    }

    redacoes.append(nova)
    proximo_id += 1
    return jsonify(nova), 201


# ===== PUT /redacoes/<id>: altera uma redação =====
@app.route("/redacoes/<int:id>", methods=["PUT"])
def alterar_redacao(id):
    redacao = buscar_redacao(id)
    if redacao is None:
        return jsonify({"erro": "Redação não encontrada"}), 404

    dados = request.get_json()

    # Se um campo obrigatório veio, ele não pode vir vazio
    for campo in CAMPOS_OBRIGATORIOS:
        if campo in dados and not dados[campo]:
            return jsonify({"erro": f"O campo {campo} não pode ficar vazio"}), 400

    if "status" in dados and dados["status"] not in STATUS_VALIDOS:
        return jsonify({"erro": "Status inválido"}), 400

    if "nota" in dados and not nota_valida(dados["nota"]):
        return jsonify({"erro": "A nota deve ser um número inteiro de 0 a 1000"}), 400

    # Só muda os campos que vieram; os outros continuam como estavam
    for campo in ["tema", "titulo", "candidato", "matricula", "status", "nota", "texto"]:
        if campo in dados:
            redacao[campo] = dados[campo]
    redacao["titulo"] = redacao["titulo"] or ""

    return jsonify(redacao)


# ===== DELETE /redacoes/<id>: exclui uma redação =====
@app.route("/redacoes/<int:id>", methods=["DELETE"])
def excluir_redacao(id):
    redacao = buscar_redacao(id)
    if redacao is None:
        return jsonify({"erro": "Redação não encontrada"}), 404

    redacoes.remove(redacao)
    return jsonify({"mensagem": "Redação excluída"})


# ===== POST /redacoes/<id>/comentarios: comenta uma redação =====
@app.route("/redacoes/<int:id>/comentarios", methods=["POST"])
def comentar_redacao(id):
    global proximo_comentario_id
    redacao = buscar_redacao(id)
    if redacao is None:
        return jsonify({"erro": "Redação não encontrada"}), 404

    dados = request.get_json()
    if not dados.get("autor") or not dados.get("texto"):
        return jsonify({"erro": "Autor e texto do comentário são obrigatórios"}), 400

    comentario = {
        "id": proximo_comentario_id,
        "autor": dados["autor"],
        "texto": dados["texto"],
        "data": date.today().isoformat()
    }

    redacao["comentarios"].append(comentario)
    proximo_comentario_id += 1
    return jsonify(comentario), 201


# ===== Início: liga o servidor =====
if __name__ == "__main__":
    app.run(debug=True, port=5000)
