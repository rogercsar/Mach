Comecei agosto com esse projeto bem simples - Mach. Desenhei uma interface Web em HTML, CSS e JavaScript. Interage com usuário, gera resposta, busca na internet, atribui relevância à mensagem do usuário, entregando isso em um formato de chatbot. Também salva as mensagens em um histórico separando por datas e apresentando horário da mensagem. 

Obs: O objetivo dessa aplicação é para fins de estudo de desenvolvimento e praticar escrever artigos.

Disponível: https://mach42.netlify.app/


Criei dicionários simples para filtrar as mensagens:

const saud = ['oie', 'olá', 'hey', 'hello','bom dia','boa tarde','boa noite','como vai ?', 'tudo bem ?', 'como posso ajudar ?'];

const perg1 = ['qual seu nome ?', 'de onde você é ?', 'o que você faz ?'];
const resp1 = ['Muito obrigado','Estou bem','Me chamo Mach.', 'Eu sou digital', 'Eu sou um robô.'];
const conv = ["oie", "tudo bem ?", "como vai ?", "sim e com você ?", "olá", "muito prazer!"];
const num = [0,1,2,3,4,5,6,7,8,9]  
Filtrar a mensagem para encontrar o termo de pesquisa na internet:

 // Verificar se a mensagem contém 'pesquise sobre'

    if (msg.toLowerCase().includes('pesquise sobre:')) {       

        var termo = msg.substring(msg.indexOf(':')+1)

        console.log(termo)

        search(termo);

        return; // Se a busca for feita, sair da função para evitar salvar uma resposta vazia

    } 
Filtro e verifico se a mensagem está presente nas listas de dicionários:

// Verificar se a mensagem está nas conversas anteriores

    if (saud.includes(msg.toLowerCase())) {
        if(msg.toLowerCase()=='bom dia'){
            resposta = 'Bom dia'
        }
        else if(msg.toLowerCase() =='boa tarde'){
            resposta = 'Boa tarde'
        }

        else if(msg.toLowerCase() == 'boa noite'){
            resposta = 'Boa noite'
        }

        else{
            resposta = saud[Math.floor(Math.random() * saud.length)];
        }

     else if (perg1.includes(msg.toLowerCase())) {
          resposta = resp1[Math.floor(Math.random() * resp1.length)];
    }


Verifico se a mensagem é um número, se está presente na lista de números, verifico se existe um sinal de operação e separo os itens para realizar o cálculo:

else if (!isNaN(parseInt(msg))) {

        if(num.find(element => element === parseInt(msg))){        
            if(msg.includes('+')){
                let index = msg.indexOf('+')
                let num1 = msg.substring(0,index)
                let num2 = msg.substring(index+1)                      
                let op = msg.substring(1,2) 

                if(op =='+'){
                    resposta = parseInt(num1) + parseInt(num2)               
                }
            }  

            else if(msg.includes('-')){
                let index = msg.indexOf('-')
                let num1 = msg.substring(0,index)
                let num2 = msg.substring(index+1)                      
                let op = msg.substring(1,2) 

                if(op =='-'){
                    resposta = parseInt(num1) - parseInt(num2)              
                }
            }  

            else if(msg.includes('*')){
                let index = msg.indexOf('*')
                let num1 = msg.substring(0,index)
                let num2 = msg.substring(index+1)                      
                let op = msg.substring(1,2) 

                if(op =='*'){
                    resposta = parseInt(num1) * parseInt(num2)              
                }
            }  

            else if(msg.includes('/')){
                let index = msg.indexOf('/')
                let num1 = msg.substring(0,index)
                let num2 = msg.substring(index+1)                     
                let op = msg.substring(1,2) 
                if(op =='/'){
                    resposta = parseInt(num1) / parseInt(num2)            
                }

            }                      

        }
 

Se a mensagem não está presente na lista de conversas, ela é adicionada, gerada uma resposta randômica e salvo isso no localstorage:

} else {
        // Caso a mensagem não faça parte das conversas anteriores, adicioná-la
        conv.push(msg.toLowerCase());
        resposta = conv[Math.floor(Math.random() * conv.length)];
        localStorage.setItem('listConv', JSON.stringify(conv));
    }
 

Crio a relevância das respostas dentro dos parâmetros, adiciono a resposta ao display e salvo a mensagem:

function resultsOnPage(myArray, message, numCaracteres = 5000) {
    function calculateRelevance(item, message) {
        let relevance = 0;
        const messageWords = message.toLowerCase().split(' ');
        const titleWords = item.Text.toLowerCase().split(' ');
        const snippetWords = item.Result.toLowerCase().split(' '); 

        messageWords.forEach(word => {
            if (titleWords.includes(word)) relevance += 2;
            if (snippetWords.includes(word)) relevance += 1;
        }); 

        return relevance;
    }

    myArray.sort((a, b) => calculateRelevance(b, message) - calculateRelevance(a, message)); 
    const mostRelevantItem = myArray[0];
    if (mostRelevantItem) {
        let itemTitle = mostRelevantItem.Text;
        let itemSnippet = mostRelevantItem.Result.length > numCaracteres
            ? mostRelevantItem.Result.substring(0, numCaracteres) + '...'
            : mostRelevantItem.Result;
        let itemUrl = mostRelevantItem.FirstURL;
        let resposta = <a href="${itemUrl}"><span>Veja mais</span><p>${itemSnippet}</p </a>;       
        console.log(itemSnippet);       
        let listResp = document.createElement('li');
        listResp.setAttribute('style', 'color: #000000;');
        let listIA = document.createElement('i');
        listIA.className = 'fa-solid fa-robot fa-lg';
        listResp.appendChild(listIA);
        listResp.appendChild(document.createTextNode("    "));
        listResp.innerHTML += resposta;
        msgEn.appendChild(listResp);
        histMsg.push({ user: 'Mach', message: resposta, date: dia, time: hora });
        salvaMsg();
    }
    else {
        console.log("Nenhum item relevante encontrado.");
        let listResp = document.createElement('li');
        listResp.setAttribute('style', 'color: #000000;'); 
        let listIA = document.createElement('i');
        listIA.className = 'fa-solid fa-robot fa-lg';
        listResp.appendChild(listIA);
        listResp.appendChild(document.createTextNode("    "));
        listResp.innerHTML += "Nenhum item relevante encontrado.";
        msgEn.appendChild(listResp);

    }

}
 

Mostra os históricos das conversas separadas por datas:

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
            it.innerHTML += ${item.time} - ${item.user}: ${item.message};
            ulMessages.appendChild(it);
        }); 

        dateBlock.appendChild(ulMessages);
        ul.appendChild(dateBlock);
    });
}
Até a próxima! 💟🖥️🤖
