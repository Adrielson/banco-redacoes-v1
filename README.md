# Banco de Redações CEJOL — versão 1 (até a Aula 16)

Gabarito do projeto final da disciplina **Projeto de Aplicações Web** (curso técnico em
Informática para Internet — CEJOL). É o código completo ao fim da **Aula 16**: as cinco páginas,
o JavaScript conversando com a API e a API em Python (Flask) com os dados em memória.

> Use este código para **comparar** com o seu quando algo não funcionar. Copiar sem entender não
> ajuda na apresentação: cada parte é explicada, linha por linha, nas aulas.

## O que o sistema faz

| Quem | Página | O que dá para fazer |
| --- | --- | --- |
| Visitante | `index.html` | ver as redações aprovadas, com a nota, o contador e a busca |
| Visitante | `redacao.html?id=1` | ler uma redação aprovada, com a nota e os comentários dos professores |
| Candidato | `enviar.html` | enviar uma redação (o título é opcional), que entra como "aguardando" e sem nota |
| Administrador | `admin.html` | entrar com a senha; ver as estatísticas; aprovar, recusar, adicionar, editar (inclusive a **nota**, e com um comentário opcional), comentar e excluir |
| Administrador | `moderar.html?id=3` | ler uma redação, dar a nota, escrever um comentário e decidir: aprovar ou recusar (a nota e o comentário são salvos junto com a decisão); **editar ou excluir** os comentários de qualquer redação |

**Nota e anonimato:** a nota vai de 0 a 1000, como no ENEM, e é dada no painel do administrador.
Enquanto a redação não é corrigida, a nota aparece como "ainda não avaliada". Quando a nota é
**menor que 700**, as páginas públicas mostram o candidato como **"Anônimo"**.

## Página inicial: Hero Section (Aula 21)

A página inicial abre com uma **Hero Section**: fundo com gradiente animado e partículas de letras
que reagem ao mouse, a ilustração `img/hero-escrita.svg`, uma folha de redação que "se escreve"
sozinha e os botões "Enviar minha redação" e "Ler redações". O estilo e os efeitos ficam em
`hero.css` e `hero.js`, carregados **só** pelo `index.html`. Com a opção do sistema **"reduzir
movimento"** ligada, tudo aparece parado; sem JavaScript, o conteúdo aparece normalmente.
O passo a passo está na Aula 21 (aula extra).

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
├── requirements.txt ← os pacotes Python da API
└── versao-local/   ← o projeto ANTES da API              (Aulas 12 e 13)
```

## Como rodar

Você precisa do **Python 3** e do **VS Code** com a extensão **Live Server**.

### Instalando o Python (uma vez só)

**Windows**

1. Baixe o Python em [python.org/downloads](https://www.python.org/downloads/) (botão amarelo
   **Download Python**) e abra o arquivo baixado.
2. Se aparecer a caixa **"Add python.exe to PATH"**, **marque-a antes de clicar em Install Now**.
   Sem ela, o terminal não encontra o comando `python`. Se o instalador for o **Python install
   manager**, aceite as opções padrão e responda **sim** quando ele perguntar se deve instalar o
   Python e ajustar o PATH.
3. **Feche e abra de novo** o VS Code (o terminal só enxerga o Python depois disso).
4. No terminal, confira: `python --version` deve mostrar algo como `Python 3.14.0`.

| O que acontece | Como resolver |
| --- | --- |
| Ao digitar `python`, abre a **Microsoft Store** | em **Configurações → Aplicativos → Configurações avançadas de aplicativos → Aliases de execução de aplicativo**, desligue os itens **python.exe** e **python3.exe**; depois, feche e abra o terminal |
| `'python' não é reconhecido como um comando…` | teste `py --version`: se funcionar, use `py` no lugar de `python` (por exemplo, `py api.py`); se não, reinstale marcando **Add python.exe to PATH** |
| Instalou, mas o comando continua sem funcionar | feche **todas** as janelas do VS Code e abra de novo (ou reinicie o computador) |

**Mac:** baixe o instalador em [python.org/downloads](https://www.python.org/downloads/) e
instale normalmente. No terminal, use `python3` no lugar de `python`.

**Linux:** o Python normalmente já vem instalado (`python3 --version`). Se faltar o pip, no
Ubuntu: `sudo apt install python3-pip`.

**VS Code e Live Server:** baixe o VS Code em [code.visualstudio.com](https://code.visualstudio.com/)
e, na aba **Extensões** (Ctrl+Shift+X), instale a extensão **Live Server**.

### Rodando o projeto

1. Instale os pacotes da API (uma vez só):

   ```bash
   python -m pip install -r requirements.txt
   ```

   O `requirements.txt` lista os pacotes de que a API precisa: `flask` e `flask-cors`.

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
| O "Anônimo" (nota menor que 700) é feito pela página: a API ainda devolve o nome para quem pedir direto a ela, e aceita nota de qualquer um | ela não sabe quem está pedindo | versão completa: a API esconde o nome e só aceita nota do administrador logado |
| Só funciona no computador | a API roda em `localhost` | Aula 20: publicação na internet |

## Problemas comuns

| O que acontece | Como resolver |
| --- | --- |
| A página mostra "Não foi possível carregar as redações" | a API está desligada: rode `python api.py` |
| `ModuleNotFoundError: No module named 'flask'` (ou `flask_cors`) | rode `python -m pip install -r requirements.txt`, dentro da pasta do projeto |
| As redações que você criou sumiram | a API reiniciou; é o primeiro limite da tabela acima |
| O `moderar.html` volta para o `admin.html` | faça o login no painel e abra a moderação **na mesma aba** |
| No Mac, `localhost:5000` responde 403 | o AirPlay Receiver usa a porta 5000: desligue-o nos Ajustes do Sistema |
