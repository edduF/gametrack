const formulario = document.querySelector("#form-cadastro");
const mensagem = document.querySelector("#mensagem-cadastro");
const listaJogos = document.querySelector("#lista-jogos");
const resumoJogos = document.querySelector("#resumo-jogos");
const formFiltros = document.querySelector("#form-filtros");

const chaveJogos = "gametrack-jogos";
const idEdicao = new URLSearchParams(window.location.search).get("id");

const rotulosStatus = {
    "quero-jogar": "Quero jogar",
    jogando: "Jogando",
    finalizado: "Finalizado"
};

if (formulario && mensagem) {
    formulario.addEventListener("submit", salvarJogo);

    if (idEdicao !== null) {
        prepararEdicao();
    }
}

if (listaJogos && resumoJogos && formFiltros) {
    window.addEventListener("pageshow", exibirColecao);

    formFiltros.addEventListener("submit", function (evento) {
        evento.preventDefault();
        exibirColecao();
    });

    formFiltros.addEventListener("reset", function () {
        setTimeout(exibirColecao, 0);
    });
}

function lerJogos() {
    return JSON.parse(localStorage.getItem(chaveJogos) ?? "[]");
}

function gravarJogos(jogos) {
    localStorage.setItem(chaveJogos, JSON.stringify(jogos));
}

function prepararEdicao() {
    const botaoSalvar = formulario.querySelector('button[type="submit"]');

    try {
        const jogo = lerJogos().find(item => item.id === idEdicao);

        if (!jogo) {
            mensagem.textContent = "Jogo não encontrado na coleção.";
            botaoSalvar.disabled = true;
            return;
        }

        document.querySelector("#cadastro-titulo").textContent = "Editar jogo";
        document.title = "Editar jogo | GameTrack";
        botaoSalvar.textContent = "Salvar alterações";

        const campos = [
            "nome", "genero", "plataforma", "ano",
            "status", "avaliacao", "observacoes"
        ];

        for (const campo of campos) {
            const elemento = formulario.elements.namedItem(campo);
            const valor = jogo[campo] ?? "";

            if (elemento instanceof HTMLSelectElement) {
                for (const opcao of elemento.options) {
                    opcao.defaultSelected = opcao.value === valor;
                }
            } else {
                elemento.defaultValue = valor;
            }

            elemento.value = valor;
        }

        formulario.querySelector('button[type="reset"]').textContent = "Restaurar campos";
    } catch (erro) {
        mensagem.textContent = "Não foi possível carregar o jogo para edição.";
        botaoSalvar.disabled = true;
        console.error("Erro ao carregar o jogo:", erro);
    }
}

function salvarJogo(evento) {
    evento.preventDefault();

    const dados = new FormData(formulario);
    const nome = dados.get("nome").trim();

    if (nome === "") {
        mensagem.textContent = "Digite o nome do jogo.";
        formulario.elements.namedItem("nome").focus();
        return;
    }

    const avaliacao = dados.get("avaliacao");

    try {
        const jogos = lerJogos();
        const jogo = {
            id: idEdicao ?? crypto.randomUUID(),
            nome: nome,
            genero: dados.get("genero"),
            plataforma: dados.get("plataforma"),
            ano: Number(dados.get("ano")),
            status: dados.get("status"),
            avaliacao: avaliacao === "" ? null : Number(avaliacao),
            observacoes: dados.get("observacoes").trim()
        };

        if (idEdicao === null) {
            jogos.push(jogo);
        } else {
            const indice = jogos.findIndex(item => item.id === idEdicao);

            if (indice === -1) {
                mensagem.textContent = "Este jogo não está mais na coleção.";
                return;
            }

            jogos[indice] = jogo;
        }

        gravarJogos(jogos);
    } catch (erro) {
        mensagem.textContent = "Não foi possível salvar o jogo no navegador.";
        console.error("Erro ao salvar o jogo:", erro);
        return;
    }

    if (idEdicao === null) {
        formulario.reset();
        mensagem.textContent = "Jogo cadastrado com sucesso!";
    } else {
        mensagem.textContent = "Alterações salvas com sucesso!";
        prepararEdicao();
    }
}

function exibirColecao() {
    listaJogos.replaceChildren();
    resumoJogos.replaceChildren();

    let jogos;

    try {
        jogos = lerJogos();
    } catch (erro) {
        exibirMensagemTabela("Não foi possível carregar a coleção.");
        console.error("Erro ao carregar os jogos:", erro);
        return;
    }

    for (const [status, rotulo] of Object.entries(rotulosStatus)) {
        const total = jogos.filter(jogo => jogo.status === status).length;
        const item = document.createElement("li");

        item.textContent = `${rotulo}: ${total}`;
        resumoJogos.append(item);
    }

    if (jogos.length === 0) {
        exibirMensagemTabela("Nenhum jogo cadastrado ainda.");
        return;
    }

    const jogosVisiveis = filtrarEOrdenarJogos(jogos);

    if (jogosVisiveis.length === 0) {
        exibirMensagemTabela("Nenhum jogo encontrado com esses filtros.");
        return;
    }

    for (const jogo of jogosVisiveis) {
        const linha = listaJogos.insertRow();
        const nome = document.createElement("th");

        nome.scope = "row";
        nome.textContent = jogo.nome;
        linha.append(nome);

        const valores = [
            jogo.genero,
            jogo.plataforma,
            jogo.ano,
            rotulosStatus[jogo.status],
            jogo.avaliacao ?? "Não avaliado"
        ];

        for (const valor of valores) {
            linha.insertCell().textContent = valor;
        }

        const detalhes = document.createElement("details");
        const titulo = document.createElement("summary");
        const observacoes = document.createElement("p");

        titulo.textContent = "Ver detalhes";
        observacoes.textContent =
            `Observações de ${jogo.nome}: ${jogo.observacoes || "Sem observações."}`;
        detalhes.append(titulo, observacoes);

        const linkEditar = document.createElement("a");
        linkEditar.href = `pages/cadastro.html?id=${encodeURIComponent(jogo.id)}`;
        linkEditar.textContent = "Editar";
        linkEditar.setAttribute("aria-label", `Editar ${jogo.nome}`);

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.setAttribute("aria-label", `Excluir ${jogo.nome}`);
        botaoExcluir.addEventListener("click", () => excluirJogo(jogo));

        linha.insertCell().append(detalhes, linkEditar, " ", botaoExcluir);
    }
}

function filtrarEOrdenarJogos(jogos) {
    const dados = new FormData(formFiltros);
    const pesquisa = dados.get("pesquisa").trim().toLowerCase();
    const status = dados.get("status");
    const genero = dados.get("genero");
    const ordenacao = dados.get("ordenacao");

    const jogosFiltrados = jogos.filter(function (jogo) {
        const nomeCombina = jogo.nome.toLowerCase().includes(pesquisa);
        const statusCombina = status === "" || jogo.status === status;
        const generoCombina = genero === "" || jogo.genero === genero;

        return nomeCombina && statusCombina && generoCombina;
    });

    jogosFiltrados.sort(function (primeiro, segundo) {
        switch (ordenacao) {
            case "nome-desc":
                return segundo.nome.localeCompare(primeiro.nome, "pt-BR");
            case "ano-desc":
                return segundo.ano - primeiro.ano;
            case "nota-desc":
                return (segundo.avaliacao ?? -1) - (primeiro.avaliacao ?? -1);
            default:
                return primeiro.nome.localeCompare(segundo.nome, "pt-BR");
        }
    });

    return jogosFiltrados;
}

function excluirJogo(jogo) {
    if (!window.confirm(`Excluir "${jogo.nome}" da coleção?`)) {
        return;
    }

    try {
        const jogos = lerJogos().filter(item => item.id !== jogo.id);
        gravarJogos(jogos);
    } catch (erro) {
        window.alert("Não foi possível excluir o jogo.");
        console.error("Erro ao excluir o jogo:", erro);
        return;
    }

    exibirColecao();
}

function exibirMensagemTabela(texto) {
    const celula = listaJogos.insertRow().insertCell();
    celula.colSpan = 7;
    celula.textContent = texto;
}