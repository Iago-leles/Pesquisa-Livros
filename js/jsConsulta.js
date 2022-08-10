const btnMobile = document.getElementById('btn-mobile');

function toggleMenu(event) {
    if (event.type === 'touchstart') event.preventDefault();
    const nav = document.getElementById('nav');
    nav.classList.toggle('active');
    const active = nav.classList.contains('active');
    event.currentTarget.setAttribute('aria-expanded', active);
    if (active) {
        event.currentTarget.setAttribute('aria-label', 'Fechar Menu');
    } else {
        event.currentTarget.setAttribute('aria-label', 'Abrir Menu');
    }
}

btnMobile.addEventListener('click', toggleMenu);
btnMobile.addEventListener('touchstart', toggleMenu);


//////////////////////////// API BOOKS ///////////////////////////////////

/* const API_KEY = 'AIzaSyBzrkmzeKlfdYWq6elBgwUza-U5TZSVEa4';

function exibeLivros() {
    let divBooks = document.getElementById('livrosResult');
    let texto = '';

    //montar texto HTML livros
    let dados = JSON.parse(this.responseText);
    for (i = 0; i < dados.items.length; i++) {
        let livro = dados.items[i];
        
        texto = texto + `
        <div class="boxLivro col-2">
                        <img src="${livro.volumeInfo.imageLinks.smallThumbnail}" alt="">
                        <h4 class="titulo">${livro.volumeInfo.title}</h4>
                        <h5 class="author">${livro.volumeInfo.authors}</h5>
                    </div>

                    
    `;
    };

    //preencher a div com o texto
    divBooks.innerHTML = texto;
}

function executaPesquisa() {
    let query = document.getElementById('txtPesquisa').value;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`);
    xhr.onload = exibeLivros;
    xhr.send();
}


document.getElementById('btnPesquisa').addEventListener('click', executaPesquisa); */



///////////////////////////// TESTE API 2 /////////////////////////////////


const API_KEY = 'AIzaSyAqZse1-CF8a9TLBrzAimw3jCh0WcPd7FA';


function carregaFilmes() {
    let query = document.getElementById('txtPesquisa').value;
    let xhr = new XMLHttpRequest();

    xhr.open('GET', 'https://www.googleapis.com/books/v1/volumes?q=' + query + '&key=' + API_KEY);

    xhr.onload = exibeFilmes;
    xhr.send();

}

function exibeFilmes(evt) {
    let textoHTML = '';
    let query = document.getElementById('txtPesquisa').value;
    let livros = JSON.parse(evt.target.responseText);


    for (let i = 0; i < 9; i++) {
        let titulo = livros.items[i].volumeInfo.title;
        let autor = livros.items[i].volumeInfo.authors;
        try {
            imagem = livros.items[i].volumeInfo.imageLinks.thumbnail;
        } catch {
            imagem = "img/semCapa.jpg";
        }
        let id = livros.items[i].id;

        textoHTML += `<div class="boxLivro col-lg-3 col-md-5 col-sm-11">
        <img src="${imagem}" alt="">
        <h4 class="titulo">${titulo}</h4>
        <h5 class="author">${autor}</h5>
        <a href="infoLivro.html"><button  id="${id}" onclick="armazenaID(this.id)" class="btn btn-outline-light">Ver mais</i></button></a>
    </div>`
    }

    document.getElementById('tela').innerHTML = textoHTML;
}


function armazenaID(id) {
    localStorage.setItem("idLivro", id)
}

function armazenaPesquisa(valor) {
    localStorage.setItem("pesquisa", valor)
}





///////////////////////////////////////    TELA INFO LIVROS    //////////////////////////////////////////



function descreveLivro(evt) {
    let textoHTML = '';


    let livros = JSON.parse(evt.target.responseText);

    let titulo = livros.volumeInfo.title;
    let data = livros.volumeInfo.publishedDate;
    try {
        imagem = livros.volumeInfo.imageLinks.thumbnail;
    } catch {
        imagem = "img/semCapa.jpg";
    }
    let autor = livros.volumeInfo.authors[0];
    let isbn = livros.volumeInfo.industryIdentifiers[1].identifier;
    let descricao = livros.volumeInfo.description;

    textoHTML += `<div class="boxLivroInfocapa col-lg-3 col-sm-11">
        <img src="${imagem}" alt="">
        <h5 class="isbn">ISBN: ${isbn}</h5>
    </div>

    <div id = "boxLivroInfo" class="boxLivroInfo col-lg-8 col-md-6">
        <h1 class="titulo">${titulo}</h1>
        <h3>Autor(es):</h3>
        <p class="autor">${autor}</p>
        <h3>Data de publicação:</h3>
        <p class="autor">${data}</p>
        <h3>Descrição:</h3>
        <p class="description">${descricao}</p>
        <a><button onclick="buscaLivroAPI()" id="btnEmprestimo" class="btn btn-outline-light">Empréstimo</i></button></a>

    </div>`

    document.getElementById('telinha').innerHTML = textoHTML;
}


function carregaLivro() {
    let xhr = new XMLHttpRequest();
    let id = localStorage.getItem("idLivro")
    xhr.open('GET', 'https://www.googleapis.com/books/v1/volumes/' + id + '?key=' + API_KEY);

    xhr.onload = descreveLivro;
    xhr.send();
    console.log(id);

}

function chamaPesquisa() {
    let xhr = new XMLHttpRequest();
    let valor = localStorage.getItem("pesquisa")
    xhr.open('GET', 'https://www.googleapis.com/books/v1/volumes?q=' + valor + '&key=' + API_KEY);

    xhr.onload = exibeFilmes;
    xhr.send();
    console.log(id);

}