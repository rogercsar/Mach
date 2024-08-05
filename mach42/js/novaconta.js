let txtImg = document.getElementById('imgPerfil');
let txtNome = document.getElementById('txtNome');
let txtNasc = document.getElementById('txtNasc');
let txtMail = document.getElementById('txtEmail');
let txtTel = document.getElementById('txtTel');
let txtUser = document.getElementById('txtUser');
let txtPass = document.getElementById('txtPass');

function btnCriar(){

    const newUser = {
        'imgPerfil' : txtImg.value,
        'Nome': txtNome.value,
        'Nasc': txtNasc.value,
        'Email': txtMail.value,
        'Tel': txtTel.value,
        'User': txtUser.value,
        'Pass': txtPass.value
    }

    localStorage.setItem('usuarios', JSON.stringify(newUser));

    window.location.href = '../html/index.html'
}