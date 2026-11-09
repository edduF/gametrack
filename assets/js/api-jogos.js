const secaoImportacao = document.querySelector("#importacao-jogos");
const formularioBusca = document.querySelector("#form-busca-api");
const mensagemApi = document.querySelector("#mensagem-api");
const resultadosApi = document.querySelector("#resultados-api");
const cadastroApi = document.querySelector("#form-cadastro");

const modoEdicao = new URLSearchParams(window.location.search).has("id");

if (secaoImportacao && formularioBusca && mensagemApi && resultadosApi && cadastroApi && !modoEdicao) {
    secaoImportacao.hidden = false;
    formularioBusca.addEventListener("submit", buscarJogosNaApi);
}

async function buscarJogosNaApi(evento) {
    evento.preventDefault();

    const campoBusca = formularioBusca.elements.namedItem("titulo");
    const titulo = campoBusca.value.trim();

    resultadosApi.replaceChildren();

    if (titulo.length < 2) {
        mensagemApi.textContent = "Digite pelo menos dois caracteres.";
        campoBusca.focus();
        return;
    }

    const botaoBuscar = formularioBusca.querySelector('button[type="submit"]');
    const url = new URL("https://www.cheapshark.com/api/1.0/games");

    url.searchParams.set("title", titulo);
    url.searchParams.set("limit", "8");

    botaoBuscar.disabled = true;
    mensagemApi.textContent = "Buscando jogos...";

    try {
        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error(`A API retornou o status ${resposta.status}.`);
        }

        const jogos = await resposta.json();

        if (jogos.length === 0) {
            mensagemApi.textContent = "Nenhum jogo encontrado. Tente outro nome.";
            return;
        }

        mensagemApi.textContent = "Escolha um jogo para preencher o cadastro.";

        for (const jogo of jogos) {
            const item = document.createElement("li");
            const botao = document.createElement("button");

            botao.type = "button";
            botao.textContent = `Usar ${jogo.external}`;
            botao.addEventListener("click", function () {
                preencherCadastroComJogo(jogo.external);
            });

            item.append(botao);
            resultadosApi.append(item);
        }
    } catch (erro) {
        mensagemApi.textContent =
            "Não foi possível consultar a API. Tente novamente ou preencha o cadastro manualmente.";
        console.error("Erro na busca de jogos:", erro);
    } finally {
        botaoBuscar.disabled = false;
    }
}

function preencherCadastroComJogo(titulo) {
    const campoNome = cadastroApi.elements.namedItem("nome");

    campoNome.value = titulo.slice(0, campoNome.maxLength);
    cadastroApi.elements.namedItem("plataforma").value = "PC";

    mensagemApi.textContent =
        "Nome e plataforma preenchidos. Complete os outros campos e salve o jogo.";
    cadastroApi.elements.namedItem("genero").focus();
}