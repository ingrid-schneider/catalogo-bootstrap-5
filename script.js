const CATALOG_ITEMS = [
    {
        id: 1,
        titulo: "O mistério da Floresta Negra",
        categoria: "Livros",
        detalhes: "Um romance policiais envolvente que se passa nas profundezas da Floresta Negra",
        preco: "R$ 49,90",
        estoque: 15,
        autor: "Ana Clara Silva",
        lancamento: "2024"
    },
    {
        id: 2,
        titulo: "Vaso de cerâmica Rústica",
        categoria: "Artesanato",
        detalhes: "Vaso decorativo, feito e pintado a mão, ideal para flores secas ou como peça central em mesas. Cada peça única. Cor roxa vibrante com detalhes de ouro velho",
        preco: "R$ 120,00",
        estoque: 3,
        material: "Argila Queimada e Tinta Acrílica",
        dimensoes: "20cm x 15cm"
    },
    {
        id: 3,
        titulo: "Crônicas de Marte",
        categoria: "Livros",
        detalhes: "Clássicos da ficção científica que explora a colonização humana em Marte e seua dilemas éticos. Uma leitura obrigatória para fãs de gênero.",
        preco: "R$ 35,50",
        estoque: 22,
        autor: "Roberto Almeida",
        lancamento: "1998 (Edição comemorativa)"
    },
    {
        id: 4,
        titulo: "Colar de Semente Natural",
        categoria: "Artesanato",
        detalhes: "Colar sustentável feito com sementes de açaí e tucumã. Perfeito para um visual boêmio e natural. Fecho ajustável. ",
        preco: "R$75,90",
        estoque: 8,
        material: "Semente Naturais e Fio Encerada",
        comprimento: "50cm"
    }
];
/**
* Adiciona listeners aos botões "Ver Destalhes" para popular o modal dinamicamente.
*/
const modalElement= document.querySelector('#detalheModal');
const modalTitle= modalElement.querySelector('.modal-title');
const modalBody= modalElement.querySelector('.modal-body');
const modalAction= modalElement.querySelector('.btn-success');

// 1. Ouvinte para popular o modal ANTES de ser exibido
modalElement.addEventListener('show.bs.modal', function (event){
    const button = event.relatedTarget;
    const itemID = parseInt(button.getAttribute('data-item-id'));
    const item = CATALOG_ITEMS.find(i=> i.id === itemID);
    
    if (item) {
        modalTitle.textContent = item.titulo;
        
        let detailsHTML = `
            <p class="mb-1"><strong>Categoria:</strong> <span class="badge bg-secondary">${item.categoria}</span></p>
            <p class="fs-4 fw-bold text-success mb-3">Preço: ${item.preco}</p>
            <hr>
            <p>${item.detalhes}</p>
        `;
        
        if (item.categoria === 'Livros') {
            detailsHTML += ` <p><strong>Autor:</strong> ${item.autor}</p>`;
            detailsHTML += ` <p><strong>Lançamento:</strong> ${item.lancamento}</p>`;
            detailsHTML += ` <p class="text-info"><strong>Estoque Disponível:</strong> ${item.estoque} unidades</p>`;
        } else if (item.categoria === 'Artesanato') {
            detailsHTML += ` <p><strong>Material:</strong> ${item.material}</p>`;
            detailsHTML += ` <p><strong>Dimenções/Comprimento:</strong> ${item.dimencoes || item.comprimento}</p>`;
            detailsHTML += ` <p class="text-info"><strong>Peças Exclusivas em Estoque:</strong> ${item.estoque} unidades</p>`;
        }
        
        modalBody.innerHTML = detailsHTML;
        
        modalAction.onclick = () => {
            console.log(`Ação: Item '${item.titulo}' (ID: ${item.id}) adiciona ao carrinho.`);
            const bsModal = bootstrap.Modal.getInstance(modalElement);
            if(bsModal) bsModal.hide();
        };
    }
});


// 2. Ouvinte para a funcionalidade de busca (simples)
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const items = document.querySelectorAll('.item-catalogo');

function executarPesquisa(event){
    // Previne o envio do formulário para os servidor (back-end)
    event.preventDefault();
    // Obtém o valor do campo de busca em letras minúsculas (.toLoweCase())
    const query = searchInput.value.toLowerCase().trim();
    
    // Para cada item do catálogo (quatro itens)
    items.forEach(item => {
        // Obtém o título e o nome da categoria do item atual em letras minúsculas 
        const title = item.querySelector('.card-title').textContent.toLowerCase();
        const category = item.getAttribute('data-categoria').toLowerCase();
        
        if (title.includes(query) || category.includes(query) || query === "") {
            item.style.display = 'block'; // Mostra o item
        } else {
            item.style.display = 'none'; // Esconde o item
        }
    });
    
}

searchButton.addEventListener('click', executarPesquisa);
searchInput.addEventListener('keyup',(event) => {
    if (event.key === 'Enter') {
        executarPesquisa(event);
    } else if (searchInput.value.trim() === "") {
        executarPesquisa(event);
    }
});

items.forEach((card, index) => {
    const img = card.querySelector('img');
    const title = card.querySelector('.card-title');
    const category = card.querySelectorAll('.card-text') [0];
    const description = card.querySelectorAll('.card-text') [1];
    
    const item = CATALOG_ITEMS.find(i => i.id === (index + 1));
    
    
    if (item) {
        img.src = img.src.replace(/\?text=(.*)/, "?text=" + item.categoria.toUpperCase());
        
        title.textContent = item.titulo;
        
        category.textContent = "Categoria: " + item.categoria;
        description.textContent = item.detalhes;
        
    }
});

const CART_STORAGE_KEY = 'shopping_cart';

function obterCarrinhoDoNavegador() {
    // Tente ler o cookie do navegador
    try {
        const cookie = localStorage.getItem(CART_STORAGE_KEY);
        if (cookie) {
            return JSON.parse(cookie);
        }
    } catch (e) {
        console.error("Falha ao ler o cookie do armazenamento local.");
    }
    return[];
}

function salvarCookieCarrinho(itensCarrinho){
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(itensCarrinho));
    } catch (e) {
        console.error("ERRO: Falha ao salvar carrinho no navegador. Erro:", e);
    }
}

function adicionarItemCarrinho(itemId) {
    const carrinho = obterCarrinhoDoNavegador();
    carrinho.push(itemId);
    salvarCookieCarrinho();
    atualizarContadorCarrinho();
}