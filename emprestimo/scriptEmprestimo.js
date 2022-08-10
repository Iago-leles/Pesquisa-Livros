// Chamar esse JavaScript na tela de descrição e na tela de empréstimo
// Considerar os botões de emprestimo com o mesmo id

class obra {
    constructor(id_livro, isbn, titulo, nome_editora, nome_autor, ano, prateleira, secao, avaliacao_livro, identificacao_api) {
        this.id_livro = id_livro;
        this.isbn = isbn;
        this.titulo = titulo;
        this.nome_editora = nome_editora;
        this.nome_autor = nome_autor;
        this.ano = ano;
        this.prateleira = prateleira;
        this.secao = secao;
        this.avaliacao_livro = avaliacao_livro;
        this.identificacao_api = identificacao_api;
    }
}

class emprestimo {
    constructor(id_emprestimo, fk_id_usuario_leitor, dt_devolucao_emprestimo, dt_criacao_emprestimo, qtd_renovacao, dt_vencimento_emprestimo, situacao_emprestimo, fk_obra_identificacao_api) {
        this.id_emprestimo = id_emprestimo;
        this.fk_id_usuario_leitor = fk_id_usuario_leitor;
        this.dt_devolucao_emprestimo = dt_devolucao_emprestimo;
        this.dt_criacao_emprestimo = dt_criacao_emprestimo;
        this.qtd_renovacao = qtd_renovacao;
        this.dt_vencimento_emprestimo = dt_vencimento_emprestimo;
        this.situacao_emprestimo = situacao_emprestimo;
        this.fk_obra_identificacao_api = fk_obra_identificacao_api;
    }
}

function cadastraObra(evt) {

    novaObra = new obra();

    let livros = JSON.parse(evt.target.responseText);

    novaObra.titulo = livros.volumeInfo.title;
    novaObra.ano = livros.volumeInfo.publishedDate;
    novaObra.nome_editora = livros.volumeInfo.publisher;
    novaObra.nome_autor = livros.volumeInfo.authors[0];
    novaObra.isbn = livros.volumeInfo.industryIdentifiers[1].identifier;
    novaObra.prateleira = "";
    novaObra.secao = "";
    novaObra.avaliacao_livro = "";
    novaObra.identificacao_api = localStorage.getItem("idLivro");

    // Criando uma requisição para criar Livro no Banco
    var requisicao = new XMLHttpRequest();
    var dadosObra = JSON.stringify(novaObra);
    var retorno;

    requisicao.onreadystatechange = function() {
        if (requisicao.readyState === 4) {
            retorno = JSON.parse(requisicao.response);
        }
    }
    requisicao.open("POST", "http://127.0.0.1:3000/novaObra", true);
    requisicao.setRequestHeader("Content-type", "application/json");
    requisicao.send(dadosObra);


    let emprestimo = registraEmprestimo();

    let textoHTML;

    textoHTML = `
    <div id = "boxLivroInfo" class="boxLivroInfo col-10">
        <h1 class="titulo">Empréstimo Realizado</h1>
        <h3>Data de Empréstimo:</h3>
        <p class="autor">${emprestimo.dt_criacao_emprestimo}</p>
        <h3>Data de Devolução:</h3>
        <p class="autor">${emprestimo.dt_vencimento_emprestimo}</p>
        <img src="img/logo_simplificada.png" width="70" height="70" />
        <p class="autor">Tenha uma Ótima Leitura!</p>
        <img


    </div>`

    document.getElementById('boxLivroInfo').innerHTML = textoHTML;


}

// ATENÇÃO: Necessidade de ajuste de onclick em botão de empréstimo (chamar função abaixo)
function buscaLivroAPI() {
    const API_KEY = 'AIzaSyAqZse1-CF8a9TLBrzAimw3jCh0WcPd7FA';

    let xhr = new XMLHttpRequest();
    let id = localStorage.getItem("idLivro");
    xhr.open('GET', 'https://www.googleapis.com/books/v1/volumes/' + id + '?key=' + API_KEY);

    xhr.onload = cadastraObra;
    xhr.send();

}

function registraEmprestimo() {
    // nova Requisição para Gerar empréstimo no banco;
    // consultar usuário logado

    novoEmprestimo = new emprestimo();
    novoEmprestimo.fk_id_usuario_leitor = localStorage.getItem("idUsuario");
    const timeElapsed = Date.now();
    novoEmprestimo.dt_criacao_emprestimo = new Date(timeElapsed);
    novoEmprestimo.qtd_renovacao = 0;
    novoEmprestimo.dt_vencimento_emprestimo = new Date(timeElapsed);
    // Ajuste de quantidade de duração do empréstimo.
    novoEmprestimo.dt_vencimento_emprestimo = new Date(novoEmprestimo.dt_vencimento_emprestimo.setDate((novoEmprestimo.dt_vencimento_emprestimo.getDate() + 7)));
    novoEmprestimo.dt_criacao_emprestimo = formataData(novoEmprestimo.dt_criacao_emprestimo);
    novoEmprestimo.dt_vencimento_emprestimo = formataData(novoEmprestimo.dt_vencimento_emprestimo);
    novoEmprestimo.situacao_emprestimo = true;
    novoEmprestimo.fk_obra_identificacao_api = localStorage.getItem("idLivro");
    var requisicao = new XMLHttpRequest();
    var dadosEmprestimo = JSON.stringify(novoEmprestimo);
    var retorno;

    requisicao.onreadystatechange = function() {
        if (requisicao.readyState === 4) {
            retorno = JSON.parse(requisicao.response);
            alert(retorno.mensagem);
        }
    }
    requisicao.open("POST", "http://127.0.0.1:3000/novoEmprestimo", true);
    requisicao.setRequestHeader("Content-type", "application/json");
    requisicao.send(dadosEmprestimo);

    return (novoEmprestimo);
}

function formataData(data) {
    return dataFormatada = (data.getFullYear() + "-" + ((data.getMonth() + 1)) + "-" + (data.getDate()));
}