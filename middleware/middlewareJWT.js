/**************************************************************************************************************
* Objetivo: Responsável pelo token de segurança JWT.
* Autor: Lohannes da Silva Costa
* Data: 11/09/2023
* Versão: 1.0
**************************************************************************************************************/

const jwt = require('jsonwebtoken');
const SECRET = 'dQaWrEiusR';
const EXPIRES = 2308000;
const EXPIRES_RECOVER = 180;

const createJWT = async function (payLoad){
    const token = jwt.sign({userID: payLoad}, SECRET, {expiresIn: EXPIRES})

    return token;
}

const createJWTRecover = async function (payLoad){
    const token = jwt.sign({userID: payLoad}, SECRET, {expiresIn: EXPIRES_RECOVER})

    return token;
}

const validateJWT = async function (token){
    let status;

    jwt.verify(token, SECRET, async function (err, decode){
        if(!err){
            status = true;
        } else {
            status = false;
        }
    })

    return status;
}

module.exports = {
    createJWT,
    validateJWT,
    createJWTRecover
}