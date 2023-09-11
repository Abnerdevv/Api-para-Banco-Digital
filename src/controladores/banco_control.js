const { json } = require("express");
const bancodedados = require("../bancodedados")
const { format } = require("date-fns");
let indentificador = 0;

//-----------------------------Listar contas bancárias-----------------------

const liberar_lista_banco = ((req, res) => {
    return res.status(200).json(bancodedados.contas);
});

//-----------------------Criar conta bancária----------------------------------

const cadastrar_cliente = ((req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;


    indentificador += 1;

    const cadastrando_cliente = {
        numero: indentificador,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }

    }

    bancodedados.contas.push(cadastrando_cliente);

    return res.status(201).send();

});

//-------------------------Atualizar usuário da conta bancária-----------------------------------------

const atualizar_usuario = ((req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const posicao_numero = bancodedados.contas.findIndex((conta) => Number(numeroConta) === conta.numero);

    bancodedados.contas[posicao_numero].usuario.nome = nome;
    bancodedados.contas[posicao_numero].usuario.cpf = cpf || bancodedados.contas[posicao_numero].usuario.cpf;
    bancodedados.contas[posicao_numero].usuario.data_nascimento = data_nascimento;
    bancodedados.contas[posicao_numero].usuario.telefone = telefone;
    bancodedados.contas[posicao_numero].usuario.email = email || bancodedados.contas[posicao_numero].usuario.email;
    bancodedados.contas[posicao_numero].usuario.senha = senha;

    return res.status(204).send();


});

//-------------------------Excluir Conta-------------------------------------------------------


const excluir_usuario = (req, res) => {
    const { numeroConta } = req.params;

    const achei_saldo = bancodedados.contas[numeroConta - 1]
    indentificador--
    bancodedados.contas = bancodedados.contas.filter((conta) => conta !== bancodedados.contas[numeroConta - 1]);

    console.log("passei pelo excluir_usuario ")

    return res.status(204).send();
};

//----------------------------Depositar---------------------------------------------------------

const depositarCash = (req, res) => {

    const { valor, numero_conta } = req.body


    const dateatualbrasil = new Date();

    const dataeHoraformatado = format(dateatualbrasil, 'yyyy-MM-dd HH:mm:ss', {
        timeZone: 'America/Bahia',
    });

    bancodedados.contas[numero_conta - 1].saldo += valor


    let deposito_pronto = {
        data: dataeHoraformatado,
        numero_conta: numero_conta,
        valor: valor

    }

    bancodedados.depositos.push(deposito_pronto)

    return res.status(204).send();

};


//----------------------------Sacar---------------------------------------------------------


const sacar_control = ((req, res) => {

    const { valor, numero_conta } = req.body


    if (bancodedados.contas[numero_conta - 1].saldo < valor) {
        return res.status(400).json({ mensagem: "Fundos insuficientes" })
    }

    bancodedados.contas[numero_conta - 1].saldo -= valor


    const dateatualbrasil = new Date();

    const dataeHoraformatado = format(dateatualbrasil, 'yyyy-MM-dd HH:mm:ss', {
        timeZone: 'America/Bahia',
    });

    let deposito_pronto = {
        data: dataeHoraformatado,
        numero_conta: numero_conta,
        valor: valor

    }

    bancodedados.saques.push(deposito_pronto)


    return res.status(204).send();


})

//--------------------------------------Tranferir-------------------------------------------

const transferir_control = ((req, res) => {


    const dateatualbrasil = new Date();

    const dataeHoraformatado = format(dateatualbrasil, 'yyyy-MM-dd HH:mm:ss', {
        timeZone: 'America/Bahia',
    });


    const { numero_conta_origem, numero_conta_destino, valor } = req.body

    const achar_conta_origem = bancodedados.contas.find((conta) => conta.numero === Number(numero_conta_origem));
    const achar_conta_destino = bancodedados.contas.find((conta) => conta.numero === Number(numero_conta_destino));


    achar_conta_origem.saldo -= valor;
    achar_conta_destino.saldo += valor;


    let = transferencia_pronto = {
        data: dataeHoraformatado,
        numero_conta_origem,
        numero_conta_destino,
        valor: valor
    }


    bancodedados.transferencias.push(transferencia_pronto)
    return res.status(204).send();
});


//------------------------------Saldo------------------------------------------------------

const olhe_saldo = ((req, res) => {

    const { numero_conta } = req.query;

    const achar_conta = bancodedados.contas.filter((conta) => conta.numero === Number(numero_conta));
    const { saldo } = achar_conta[0];

    let exibir_saldo = {
        saldo: saldo
    }


    return res.status(200).json(exibir_saldo)


});

//-----------------------Extrato--------------------------------------------------------------

const liberar_extrato = ((req, res) => {


    let { numero_conta } = req.query;

    const filtrar_depositos = bancodedados.depositos.filter((deposito) => deposito.numero_conta === Number(numero_conta));
    const filtrar_saques = bancodedados.saques.filter((saque) => saque.numero_conta === Number(numero_conta));
    const filtrar_transferencias = bancodedados.transferencias.filter((trasfe) => trasfe.numero_conta_origem || trasfe.numero_conta_destino === Number(numero_conta));



    let extrato_geral = [

    ];



    if (filtrar_depositos.length > 0) {
        extrato_geral.push({ deposito: filtrar_depositos })
    }

    if (filtrar_saques.length > 0) {
        extrato_geral.push({ saques: filtrar_saques })
    }

    if (filtrar_transferencias.length > 0) {
        extrato_geral.push({ transferencias: filtrar_transferencias })
    }




    return res.status(200).json(extrato_geral)

});

//----------------------------module.exports-------------------,

module.exports = {
    liberar_lista_banco,
    cadastrar_cliente,
    atualizar_usuario,
    excluir_usuario,
    depositarCash,
    sacar_control,
    transferir_control,
    olhe_saldo,
    liberar_extrato
}


