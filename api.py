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
        "tema": "Desafios da educação digital no Brasil",
        "titulo": "Conectados, mas desiguais",
        "candidato": "Maria Silva",
        "matricula": "2023-001",
        "status": "aprovada",
        "texto": ("A educação digital no Brasil enfrenta desafios históricos...\n\n"
                  "Em primeiro lugar, a desigualdade de acesso à internet...\n\n"
                  "Portanto, é fundamental que o Estado invista em infraestrutura."),
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
        "tema": "Caminhos para combater a desinformação",
        "titulo": "A verdade em tempos de algoritmo",
        "candidato": "João Souza",
        "matricula": "2022-114",
        "status": "aprovada",
        "texto": ("A desinformação tornou-se um dos maiores males da era digital...\n\n"
                  "É preciso, portanto, educar midiaticamente a população."),
        "comentarios": []
    },
    {
        "id": 3,
        "tema": "Democratização do acesso à cultura",
        "titulo": "Cultura para quem?",
        "candidato": "Ana Costa",
        "matricula": "2023-089",
        "status": "aguardando",
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

# Campos que toda redação precisa ter preenchidos
CAMPOS_OBRIGATORIOS = ["tema", "titulo", "candidato", "texto"]


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

    nova = {
        "id": proximo_id,
        "tema": dados["tema"],
        "titulo": dados["titulo"],
        "candidato": dados["candidato"],
        "matricula": dados.get("matricula", ""),
        "status": status,
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

    # Só muda os campos que vieram; os outros continuam como estavam
    for campo in ["tema", "titulo", "candidato", "matricula", "status", "texto"]:
        if campo in dados:
            redacao[campo] = dados[campo]

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
