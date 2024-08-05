const users = JSON.parse(localStorage.getItem('usuarios')) || []

let txtUser = document.getElementById('txtUser');
let txtPass = document.getElementById('txtPass');

function btnLogin(){

    if(users.User === txtUser.value && users.Pass === txtPass.value){

        let usuario = txtUser.value;
        window.location.href ='./home.html'
        localStorage.setItem('userAtivo', JSON.stringify(usuario))
    }

    else {
        alert('Usuário ou senha incorretos!')
    }

}

function loadUsers(){
    console.log(users)
}

document.addEventListener('keypress', function(e) {
    if(e.which == 13) {
        btnLogin();
    }
}, false);
