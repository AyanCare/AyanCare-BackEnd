/**************************************************************************************
 * Objetivo: Responsável pela criação e admnistração do Token de recuperação de senha.
 * Data: 13/06/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

const tokenGenerator = function (){
    let passwordToken = '';

    for (let i = 0; i < 5; i++) {
        passwordToken += Math.floor(Math.random() * 10)
    }

    return parseInt(passwordToken)
}

console.log(tokenGenerator());