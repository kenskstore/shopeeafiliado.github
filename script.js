// ================= CRONÔMETRO PERSISTENTE (7 MINUTOS) =================
document.addEventListener("DOMContentLoaded", () => {
    const tempoEl = document.getElementById('tempo');
    const cronometroDiv = document.getElementById('cronometro');

    if (!cronometroDiv) return;

    const urlAtual = window.location.href.toLowerCase();
    const ehPaginaInterna = urlAtual.includes('casa') ||
                            urlAtual.includes('beleza') ||
                            urlAtual.includes('setup') ||
                            urlAtual.includes('eletronicos') ||
                            urlAtual.includes('ferramentas');

    if (!ehPaginaInterna) {
        cronometroDiv.style.display = 'none';
        return;
    }

    if (!tempoEl) return;

    const DURACAO_TOTAL = 7 * 60 * 1000;
    const TEMPO_DE_RESET = 24 * 60 * 60 * 1000;

    function obterDataFinal() {
        const agora = Date.now();
        const inicio = Number(localStorage.getItem('oferta_inicio_v3'));
        const final = Number(localStorage.getItem('oferta_final_v3'));

        if (!Number.isFinite(inicio) || !Number.isFinite(final) || final <= agora || agora >= inicio + TEMPO_DE_RESET) {
            const novoInicio = agora;
            const novoFinal = agora + DURACAO_TOTAL;
            localStorage.setItem('oferta_inicio_v3', String(novoInicio));
            localStorage.setItem('oferta_final_v3', String(novoFinal));
            return novoFinal;
        }

        return final;
    }

    let dataFinal = obterDataFinal();
    let msVisual = 0;

    function atualizarCronometro() {
        let tempoRestante = dataFinal - Date.now();

        if (tempoRestante <= 0) {
            tempoRestante = 0;
            const titulo = cronometroDiv.querySelector('.titulo');
            if (titulo) titulo.textContent = 'OFERTA QUASE ESGOTADA!';
            tempoEl.textContent = '00:00:00';
            tempoEl.classList.add('piscar');
            return;
        }

        let minutos = Math.floor(tempoRestante / 60000);
        let segundos = Math.floor((tempoRestante % 60000) / 1000);

        minutos = minutos < 10 ? '0' + minutos : minutos;
        segundos = segundos < 10 ? '0' + segundos : segundos;

        msVisual = (msVisual + 1) % 31;
        const msText = msVisual < 10 ? '0' + msVisual : msVisual;

        tempoEl.textContent = `${minutos}:${segundos}:${msText}`;
    }

    atualizarCronometro();
    const timer = setInterval(atualizarCronometro, 33);
});
// ================= FIM DO CRONÔMETRO =================

// ================= COPIAR ID =================
function copiarID(codigo, botao) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(codigo)
        .then(() => {
            const originalText = botao.innerText;
            botao.innerText = "Copiado! ✓";
            botao.style.background = "#28a745"; 
            setTimeout(() => {
                botao.innerText = originalText;
                botao.style.background = ""; 
            }, 1500);
        });
}

// ================= TRANSIÇÃO SUAVE (VERSÃO ANTI-BUG) =================
document.addEventListener("click", (e) => {
    const link = e.target.closest("a");

    if (link && link.href.includes(window.location.origin) && !link.target) {
        const cronometro = document.getElementById('cronometro');
        if (cronometro) {
            cronometro.style.display = 'none';
            cronometro.style.opacity = '0';
            cronometro.style.visibility = 'hidden';
        }

        document.body.classList.add('nav-transition');

        e.preventDefault();
        const url = link.href;

        const container = document.querySelector(".container");
        if (!container) {
            window.location.href = url;
            return;
        }

        const isVoltar = link.classList.contains("btn-voltar") || url.includes("index.html");

        container.style.transition = "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease, filter 0.35s ease";
        container.style.opacity = "0.2";
        container.style.filter = "blur(1px)";
        container.style.willChange = "transform, opacity, filter";
        container.style.backfaceVisibility = "hidden";
        
        if (isVoltar) {
            container.style.transform = "translate3d(100%, 0, 0)";
        } else {
            container.style.transform = "translate3d(-100%, 0, 0)";
        }

        setTimeout(() => {
            window.location.href = url;
        }, 550);
    }
});

