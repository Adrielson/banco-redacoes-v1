// ==========================================================
// Banco de Redações CEJOL — hero.js  (EXPERIMENTO)
// Efeitos da Hero Section do index.html: partículas de letras no fundo,
// luz que segue o mouse, folha de redação que "se escreve" sozinha e o
// número de redações publicadas contando até o valor que veio da API.
// Tudo fica dentro de uma função, para não misturar nomes com o publico.js.
// ==========================================================
(function () {
    let hero = document.querySelector(".hero");
    if (!hero) {
        return;
    }

    // Quem pediu menos movimento no sistema recebe a página parada
    let menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Mouse de verdade (no celular, não há "passar o mouse")
    let temMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    // ===== 1. Luz e inclinação da folha seguindo o mouse =====
    let folha = hero.querySelector(".hero-folha");

    if (temMouse && !menosMovimento) {
        hero.addEventListener("pointermove", function (event) {
            let caixa = hero.getBoundingClientRect();
            let x = (event.clientX - caixa.left) / caixa.width;     // 0 a 1
            let y = (event.clientY - caixa.top) / caixa.height;
            hero.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
            hero.style.setProperty("--my", (y * 100).toFixed(1) + "%");
            if (folha) {
                folha.style.setProperty("--ry", ((x - 0.5) * 14).toFixed(2) + "deg");
                folha.style.setProperty("--rx", ((0.5 - y) * 10).toFixed(2) + "deg");
            }
        });
        hero.addEventListener("pointerleave", function () {
            hero.style.setProperty("--mx", "50%");
            hero.style.setProperty("--my", "40%");
            if (folha) {
                folha.style.setProperty("--rx", "0deg");
                folha.style.setProperty("--ry", "0deg");
            }
        });
    }

    // ===== 2. Partículas: letras e pontos flutuando no fundo =====
    let canvas = hero.querySelector(".hero-fundo");
    let ctx = canvas ? canvas.getContext("2d") : null;
    let LETRAS = ["a", "ã", "ç", "é", "ê", "õ", "“", "”", "?", "!", ";", "A", "R", "§"];
    let particulas = [];
    let mouse = { x: -9999, y: -9999 };
    let largura = 0;
    let altura = 0;
    let rodando = false;
    let visivel = true;

    function criarParticulas() {
        let quantidade = Math.max(18, Math.min(55, Math.round((largura * altura) / 14000)));
        particulas = [];
        for (let i = 0; i < quantidade; i++) {
            let ehLetra = Math.random() < 0.45;
            particulas.push({
                x: Math.random() * largura,
                y: Math.random() * altura,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35 - 0.08,      // sobem devagar, como fumaça de ideia
                tamanho: ehLetra ? 12 + Math.random() * 16 : 1.2 + Math.random() * 1.8,
                alfa: ehLetra ? 0.1 + Math.random() * 0.18 : 0.25 + Math.random() * 0.35,
                letra: ehLetra ? LETRAS[Math.floor(Math.random() * LETRAS.length)] : null,
                giro: (Math.random() - 0.5) * 0.6
            });
        }
    }

    function ajustarTamanho() {
        let caixa = hero.getBoundingClientRect();
        let escala = Math.min(window.devicePixelRatio || 1, 2);
        largura = caixa.width;
        altura = caixa.height;
        canvas.width = Math.round(largura * escala);
        canvas.height = Math.round(altura * escala);
        ctx.setTransform(escala, 0, 0, escala, 0, 0);
        criarParticulas();
        desenhar();
    }

    function mover() {
        particulas.forEach(function (p) {
            // o mouse empurra as partículas com delicadeza
            let dx = p.x - mouse.x;
            let dy = p.y - mouse.y;
            let distancia = Math.sqrt(dx * dx + dy * dy);
            if (distancia < 110 && distancia > 0) {
                let forca = (110 - distancia) / 110 * 0.6;
                p.x += (dx / distancia) * forca;
                p.y += (dy / distancia) * forca;
            }
            p.x += p.vx;
            p.y += p.vy;
            // quem sai por um lado volta pelo outro
            if (p.x < -30) { p.x = largura + 30; }
            if (p.x > largura + 30) { p.x = -30; }
            if (p.y < -30) { p.y = altura + 30; }
            if (p.y > altura + 30) { p.y = -30; }
        });
    }

    function desenhar() {
        ctx.clearRect(0, 0, largura, altura);

        // linhas finas entre pontos próximos: uma "rede de ideias"
        let pontos = particulas.filter(function (p) { return !p.letra; });
        for (let i = 0; i < pontos.length; i++) {
            for (let j = i + 1; j < pontos.length; j++) {
                let dx = pontos[i].x - pontos[j].x;
                let dy = pontos[i].y - pontos[j].y;
                let d = Math.sqrt(dx * dx + dy * dy);
                if (d < 120) {
                    ctx.strokeStyle = "rgba(199, 203, 243, " + (0.16 * (1 - d / 120)).toFixed(3) + ")";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(pontos[i].x, pontos[i].y);
                    ctx.lineTo(pontos[j].x, pontos[j].y);
                    ctx.stroke();
                }
            }
        }

        particulas.forEach(function (p) {
            if (p.letra) {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.giro);
                ctx.fillStyle = "rgba(255, 255, 255, " + p.alfa + ")";
                ctx.font = "italic " + p.tamanho.toFixed(0) + "px Georgia, serif";
                ctx.fillText(p.letra, 0, 0);
                ctx.restore();
            } else {
                ctx.fillStyle = "rgba(253, 230, 138, " + p.alfa + ")";
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.tamanho, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    function quadro() {
        if (!rodando) {
            return;
        }
        mover();
        desenhar();
        requestAnimationFrame(quadro);
    }

    // só anima enquanto a Hero aparece na tela e a aba está aberta
    function atualizarAnimacao() {
        let deveRodar = visivel && !document.hidden && !menosMovimento;
        if (deveRodar && !rodando) {
            rodando = true;
            requestAnimationFrame(quadro);
        } else if (!deveRodar) {
            rodando = false;
        }
    }

    if (ctx) {
        ajustarTamanho();
        if ("ResizeObserver" in window) {
            new ResizeObserver(ajustarTamanho).observe(hero);
        } else {
            window.addEventListener("resize", ajustarTamanho);
        }
        if ("IntersectionObserver" in window) {
            new IntersectionObserver(function (entradas) {
                visivel = entradas[0].isIntersecting;
                atualizarAnimacao();
            }).observe(hero);
        }
        document.addEventListener("visibilitychange", atualizarAnimacao);
        if (temMouse) {
            hero.addEventListener("pointermove", function (event) {
                let caixa = hero.getBoundingClientRect();
                mouse.x = event.clientX - caixa.left;
                mouse.y = event.clientY - caixa.top;
            });
            hero.addEventListener("pointerleave", function () {
                mouse.x = -9999;
                mouse.y = -9999;
            });
        }
        atualizarAnimacao();
    }

    // ===== 3. A folha de redação que se escreve sozinha =====
    let texto = hero.querySelector(".hero-folha-texto");
    let carimbo = hero.querySelector(".hero-carimbo");

    if (texto && !menosMovimento) {
        let frase = texto.textContent.trim();
        texto.textContent = "";
        texto.classList.add("escrevendo");
        if (carimbo) {
            carimbo.style.visibility = "hidden";
        }

        let posicao = 0;
        function escrever() {
            posicao++;
            texto.textContent = frase.slice(0, posicao);
            if (posicao < frase.length) {
                // uma pausa um pouco maior depois de vírgulas e pontos, como quem pensa
                let ultima = frase[posicao - 1];
                setTimeout(escrever, ultima === "," || ultima === "." ? 220 : 20 + Math.random() * 25);
            } else {
                texto.classList.remove("escrevendo");
                if (carimbo) {
                    carimbo.style.visibility = "";
                    carimbo.classList.add("carimbar");
                }
            }
        }
        setTimeout(escrever, 1300);
    }

    // ===== 4. O número de redações publicadas, contando =====
    // O publico.js escreve o total no #total-publicadas quando a API responde;
    // a Hero só "observa" esse número, sem mudar o publico.js.
    let origem = document.getElementById("total-publicadas");
    let destino = hero.querySelector("[data-hero-total]");

    function contarAte(valor) {
        if (!destino || isNaN(valor)) {
            return;
        }
        if (menosMovimento) {
            destino.textContent = valor;
            return;
        }
        let inicio = performance.now();
        let duracao = 900;
        function passo(agora) {
            let t = Math.min(1, (agora - inicio) / duracao);
            let suave = 1 - Math.pow(1 - t, 3);
            destino.textContent = Math.round(valor * suave);
            if (t < 1) {
                requestAnimationFrame(passo);
            }
        }
        requestAnimationFrame(passo);
    }

    if (origem && destino) {
        contarAte(parseInt(origem.textContent));
        new MutationObserver(function () {
            contarAte(parseInt(origem.textContent));
        }).observe(origem, { childList: true, characterData: true, subtree: true });
    }
})();
