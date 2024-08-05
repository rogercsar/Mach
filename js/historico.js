const lista = JSON.parse(localStorage.getItem('histMsg')) || [];
const userSessao = JSON.parse(localStorage.getItem('userAtivo')) || {};

function showItens() {
    let ul = document.getElementById('list');
    ul.innerHTML = ''; // Limpar a lista antes de adicionar os itens

    // Agrupar mensagens por data
    let groupedByDate = lista.reduce((acc, item) => {
        (acc[item.date] = acc[item.date] || []).push(item);
        return acc;
    }, {});

    // Para cada grupo de data, criar um bloco separado
    Object.keys(groupedByDate).forEach(date => {
        let dateBlock = document.createElement('div');
        dateBlock.className = 'date-block';

        let dateTitle = document.createElement('h3');
        dateTitle.textContent = date;
        dateBlock.appendChild(dateTitle);

        let ulMessages = document.createElement('ul');

        groupedByDate[date].forEach(item => {
            let it = document.createElement('li');
            it.setAttribute('style', item.user === 'Mach' ? 'color: #000000;' : 'color: #FFD43B;');
            
            let icon = document.createElement('i');
            icon.className = item.user === 'Mach' ? 'fa-solid fa-robot fa-lg' : 'fa-solid fa-user fa-lg';
            it.appendChild(icon);
            
            it.appendChild(document.createTextNode("  "));
            
            it.innerHTML += `${item.time} - ${item.user}: ${item.message}`;
            ulMessages.appendChild(it);
        });

        dateBlock.appendChild(ulMessages);
        ul.appendChild(dateBlock);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    showItens();
});

function deleteHist() {
    localStorage.removeItem('histMsg');
    window.location.reload();
}
