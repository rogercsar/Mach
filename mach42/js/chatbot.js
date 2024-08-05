const users = JSON.parse(localStorage.getItem('usuarios')) || []
const userSessao = JSON.parse(localStorage.getItem('userAtivo')) || []
const dados = JSON.parse(localStorage.getItem('listConv')) || []

monName = new Array("janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro");
const agora = new Date();
var dia = agora.getDate() + ' de ' + monName[agora.getMonth()] + ' de ' + agora.getFullYear();
var hora = agora.getHours() + ':' + agora.getMinutes() + ':' + agora.getSeconds();

let txtIp = document.getElementById('textIp');
let msgEn = document.getElementById('list');
let msg;
let bot = JSON.parse(localStorage.getItem('histMsg')) || [];
let histMsg = bot;
let machText = [];
let resp;

const saud = ['oie', 'olá', 'hey', 'hello','bom dia','boa tarde','boa noite','como vai ?', 'tudo bem ?', 'como posso ajudar ?'];
const perg1 = ['qual seu nome ?', 'de onde você é ?', 'o que você faz ?'];
const resp1 = ['Muito obrigado','Estou bem','Me chamo Mach.', 'Eu sou do digital', 'Eu sou um robô.'];
const conv = ["oie", "tudo bem ?", "como vai ?", "sim e com você ?", "olá", "muito prazer!"];
const num = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]

document.addEventListener('keypress', function(e) {
    if(e.which == 13) {
        enviaMsg();
    }
}, false);

function enviaMsg() {
    msg = txtIp.value;
    histMsg.push({ user: userSessao, message: msg, date: dia, time: hora });
    console.log(conv)

    let listMsg = document.createElement('li');
    listMsg.setAttribute('style', 'color: #B4A7D6;');

    let listImg = document.createElement('i');
    listImg.className = 'fa-solid fa-user fa-lg';
    listMsg.appendChild(listImg);

    // Adicionar um espaço entre o ícone e o texto
    listMsg.appendChild(document.createTextNode("  "));

    listMsg.appendChild(document.createTextNode(msg));
    msgEn.appendChild(listMsg);

    machIA();
    txtIp.value = '';
}

function machIA() {  
    let resposta;

    // Verificar se a mensagem contém 'pesquise sobre'
    if (msg.toLowerCase().includes('pesquise sobre:')) {
       
        var termo = msg.substring(msg.indexOf(':')+1)
        console.log(termo)
        search(termo);
        return; // Se a busca for feita, sair da função para evitar salvar uma resposta vazia
    }

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
       
    } 
    else if (perg1.includes(msg.toLowerCase())) {
        resposta = resp1[Math.floor(Math.random() * resp1.length)];
    } 

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
        
    } else {
        // Caso a mensagem não faça parte das conversas anteriores, adicioná-la
        conv.push(msg.toLowerCase());
        resposta = conv[Math.floor(Math.random() * conv.length)];
        localStorage.setItem('listConv', JSON.stringify(conv));
    }

    histMsg.push({ user: 'Mach', message: resposta, date: dia, time: hora });
    
    let listResp = document.createElement('li');
    listResp.setAttribute('style', 'color: #000000;');

    let listIA = document.createElement('i');
    listIA.className = 'fa-solid fa-robot fa-lg';
    listResp.appendChild(listIA);

    // Adicionar um espaço entre o ícone e o texto
    listResp.appendChild(document.createTextNode("    "));
    listResp.appendChild(document.createTextNode(resposta));
    msgEn.appendChild(listResp);

    salvaMsg();
}

function salvaMsg() {
    localStorage.setItem('histMsg', JSON.stringify(histMsg));
}

function search(termo) {
    let url = `https://api.duckduckgo.com/?q=${termo}&format=json&pretty=1`;
    console.log(url);

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data && data.RelatedTopics) {
                let resultsArray = data.RelatedTopics;
                resultsOnPage(resultsArray, termo);
            } 
            else {
                console.log('Nenhum resultado encontrado.');
                let listResp = document.createElement('li');
                listResp.setAttribute('style', 'color: #000000;');

                let listIA = document.createElement('i');
                listIA.className = 'fa-solid fa-robot fa-lg';
                listResp.appendChild(listIA);

                listResp.appendChild(document.createTextNode("    "));
                listResp.innerHTML += 'Nenhum resultado encontrado.';
                msgEn.appendChild(listResp);
            }
        })
        .catch(function(error) {
            console.error('Algum erro aconteceu:', error);
            let listResp = document.createElement('li');
            listResp.setAttribute('style', 'color: #000000;');

            let listIA = document.createElement('i');
            listIA.className = 'fa-solid fa-robot fa-lg';
            listResp.appendChild(listIA);

            listResp.appendChild(document.createTextNode("    "));
            listResp.innerHTML += 'Algum erro aconteceu.';
            msgEn.appendChild(listResp);
        });
}

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
        let resposta = `<a href="${itemUrl}"><span>Veja mais</span><p>${itemSnippet}</p></a>`;
       
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

function displayClear(){
    localStorage.removeItem('listConv')
    window.location.reload()
}
