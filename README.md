# Banco de Redações CEJOL — versão 1 (até a Aula 16)

Gabarito do projeto final da disciplina **Projeto de Aplicações Web** (curso técnico em
Informática para Internet — CEJOL). É o código completo ao fim da **Aula 16**: as cinco páginas,
o JavaScript conversando com a API e a API em Python (Flask) com os dados em memória.

> Use este código para **comparar** com o seu quando algo não funcionar. Copiar sem entender não
> ajuda na apresentação: cada parte é explicada, linha por linha, nas aulas.

## O que o sistema faz

| Quem | Página | O que dá para fazer |
| --- | --- | --- |
| Visitante | `index.html` | ver as redações aprovadas, com contador e busca |
| Visitante | `redacao.html?id=1` | ler uma redação aprovada, com os comentários dos professores |
| Candidato | `enviar.html` | enviar uma redação, que entra como "aguardando" |
| Administrador | `admin.html` | entrar com a senha; ver as estatísticas; aprovar, recusar, adicionar, editar, comentar e excluir |
| Administrador | `moderar.html?id=3` | ler uma redação e decidir: aprovar ou recusar |

## Arquivos

```text
banco-redacoes-v1/
├── index.html      ← lista pública e busca               (Aula 6)
├── enviar.html     ← formulário do candidato             (Aula 7)
├── redacao.html    ← leitura de uma redação              (Aula 8)
├── moderar.html    ← aprovar ou recusar uma redação      (Aula 8)
├── admin.html      ← login e painel do administrador     (Aulas 9 e 10)
├── style.css       ← o CSS de todas as páginas           (Aulas 6 a 11)
├── publico.js      ← JS do index.html e do redacao.html  (Aulas 12 e 15)
├── enviar.js       ← JS do enviar.html                   (Aula 15)
├── admin.js        ← JS do admin.html                    (Aulas 13 e 15)
├── moderar.js      ← JS do moderar.html                  (Aula 16)
├── api.py          ← API Flask, dados em memória         (Aula 14)
└── versao-local/   ← o projeto ANTES da API              (Aulas 12 e 13)
```

## Como rodar

Você precisa do **Python 3** e do **VS Code** com a extensão **Live Server**.

1. Instale os pacotes da API (uma vez só):

   ```bash
   python -m pip install flask flask-cors
   ```

2. No terminal, **dentro da pasta do projeto**, ligue a API e deixe esse terminal aberto:

   ```bash
   python api.py
   ```

   A API fica em `http://localhost:5000`. Teste no navegador: `http://localhost:5000/redacoes`.
   No Mac ou no Linux, pode ser preciso escrever `python3` no lugar de `python`.

3. No VS Code, abra o `index.html` com o **Live Server** (botão **Go Live**, no canto de baixo).

4. A senha do painel (`admin.html`) é **`cejred26`**.

### Versão local (Aulas 12 e 13)

A pasta `versao-local/` tem o projeto como ele fica nas Aulas 12 e 13, **sem API**: as redações
estão no `dados.js`. Não precisa ligar nada: é só abrir o `versao-local/index.html` no navegador
(duplo clique) ou com o Live Server. O painel (`versao-local/admin.html`) usa a mesma senha.
Nessa versão, o envio e a moderação individual ainda não funcionam: eles chegam nas Aulas 15 e 16.

## Teste rápido (o roteiro da Aula 16)

Com a API recém-ligada:

1. `index.html` mostra **2** redações publicadas.
2. Envie uma redação pelo `enviar.html`: aparece a mensagem de sucesso.
3. No painel, ela aparece em "Aguardando Aprovação", com o `id` 5.
4. "Ler e moderar" → "Aprovar e Publicar": a página volta ao painel, com **3** aprovadas.
5. No `index.html`, a redação nova aparece, e a busca a encontra.
6. Comente a redação no painel e abra a leitura dela: o comentário aparece, com a data de hoje.

O roteiro completo, em 10 passos, está na Parte 8 da Aula 16.

## Limites desta versão (e onde eles se resolvem)

Esta versão funciona por completo **no computador**, para aprender e apresentar. Ela ainda não está
pronta para a internet:

| Limite | Por quê | Resolvido em |
| --- | --- | --- |
| As redações somem quando a API reinicia (inclusive ao salvar o `api.py`) | a lista fica na memória do `api.py` | Aulas 17 e 18: banco de dados SQLite |
| A senha está no `admin.js`, e a API aceita pedidos de qualquer um | o login é só do navegador (simulado) | Aula 19: a API confere a senha |
| A API devolve a matrícula para quem pedir direto a ela | ela não sabe quem está pedindo | Aula 19 |
| Só funciona no computador | a API roda em `localhost` | Aula 20: publicação na internet |

## Problemas comuns

| O que acontece | Como resolver |
| --- | --- |
| A página mostra "Não foi possível carregar as redações" | a API está desligada: rode `python api.py` |
| `ModuleNotFoundError: No module named 'flask'` | rode `python -m pip install flask flask-cors` |
| As redações que você criou sumiram | a API reiniciou; é o primeiro limite da tabela acima |
| O `moderar.html` volta para o `admin.html` | faça o login no painel e abra a moderação **na mesma aba** |
| No Mac, `localhost:5000` responde 403 | o AirPlay Receiver usa a porta 5000: desligue-o nos Ajustes do Sistema |
