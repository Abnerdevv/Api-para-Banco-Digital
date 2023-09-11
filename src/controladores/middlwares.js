const { json } = require("express");
const bancodedados = require("../bancodedados")

//-----------------------------Listar contas bancárias------------------------------------------

const middVerificarsenha = ((req, res, next) => {

    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(400).send();
    }

    if (senha_banco !== bancodedados.banco.senha) {
        return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" })
    }



    next();
});

// ------------------------Criar conta bancária----------------------------------------------------

const middverificarformulario = ((req, res, next) => {

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "Formulário Incompleto" });
    }



    if (bancodedados.contas.length === 0) {
        return next();
    }



    const cpf_test = bancodedados.contas.some((conta) => {
        return conta.usuario.cpf === cpf;
    });

    const email_test = bancodedados.contas.some((conta) => {
        return conta.usuario.email === email;
    });



    if (cpf_test) {
        return res.status(401).json({ mensagem: "Já existe uma conta com o CPF informado!" });
    }

    if (email_test) {
        return res.status(401).json({ mensagem: "Já existe uma conta com o e-mail informado!" });
    }

    next();
});


//-------------------------Atualizar usuário da conta bancária-----------------------------------------

const middarrayVazio = ((req, res, next) => {
    return bancodedados.contas.length === 0 ? res.status(404).json({ mensagem: "Não existe contas para atualizar!" }) : next();
})


const middverificaURL = ((req, res, next) => {
    let { numeroConta } = req.params;

    const contasComNumero = bancodedados.contas.filter((conta) => conta.numero === Number(numeroConta));
    return contasComNumero.length === 0 ? res.status(404).json({ mensagem: "O servidor não encontrou o recurso solicitado" }) : next();

});


const middvericarbodydados = ((req, res, next) => {

    const { nome, data_nascimento, telefone, senha } = req.body;

    if (!nome || !data_nascimento || !telefone || !senha) {
        return res.status(400).json({ mensagem: "Formulário Incompleto" });
    }


    next();
});


const middverificarCpfemail = ((req, res, next) => {

    const { cpf, email } = req.body;

    const cpf_test = bancodedados.contas.some((conta) => {
        return conta.usuario.cpf === cpf;
    });

    const email_test = bancodedados.contas.some((conta) => {
        return conta.usuario.email === email;
    });


    if (cpf_test) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o CPF informado!" });
    }

    if (email_test) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o e-mail informado!" });
    }

    next();
});



//-----------------------------------Excluir Conta--------------------------------------------------------

const middexluircontaIgualzero = ((req, res, next) => {

    let { numeroConta } = req.params;

    const contasComNumero = bancodedados.contas.filter((conta) => conta.numero === Number(numeroConta));

    return contasComNumero[0].saldo > 0 ? res.status(403).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" }) : next();

});

//----------------------------Depositar---------------------------------------------------------

const middverificarContacash = ((req, res, next) => {

    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" });
    }

    next();
});


const middchecarExistenciaconta = ((req, res, next) => {

    let { numero_conta } = req.body;

    const contasComNumero = bancodedados.contas.filter((conta) => conta.numero === Number(numero_conta));
    return contasComNumero.length === 0 ? res.status(404).json({ mensagem: "O servidor não encontrou o recurso solicitado" }) : next();

});


const middverificarsaldoEhigualzero = ((req, res, next) => {
    const { valor } = req.body;

    return valor > 0 ? next() : res.status(400).json({ mensagem: "o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido" });
});



//----------------------------Sacar--------------------------------------------------------------

const middverificarBodysacar = ((req, res, next) => {

    const { numero_conta, valor, senha } = req.body;


    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: "O número da conta,valor e senha são obrigatórios!" });
    }

    next();

});


const middverificarsenha = ((req, res, next) => {


    const { numero_conta, senha } = req.body;


    const achar_conta = bancodedados.contas.filter((conta) => conta.numero === Number(numero_conta));
    const { usuario } = achar_conta[0];

    if (senha !== Number(usuario.senha)) {
        return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" })
    }

    next();

});


const middverificarsaldo = ((req, res, next) => {

    const { numero_conta } = req.body;

    const achar_conta = bancodedados.contas.filter((conta) => conta.numero === Number(numero_conta));
    const { saldo } = achar_conta[0];


    return Number(saldo) <= 0 ? res.status(400).json({ mensagem: "não há saldo disponível para saque" }) : next();
});


//--------------------------------------Tranferir-------------------------------------------

const middverificarBodytransferir = ((req, res, next) => {

    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;


    if (!numero_conta_destino || !numero_conta_origem || !valor || !senha) {
        return res.status(400).json({ mensagem: "O número das contas,valor e senha são obrigatórios!" });
    }

    next();

});


const middchecarExistenciacontaorigem = ((req, res, next) => {

    let { numero_conta_origem } = req.body;

    const contasComNumero = bancodedados.contas.filter((conta) => conta.numero === Number(numero_conta_origem));
    return contasComNumero.length === 0 ? res.status(404).json({ mensagem: "O servidor não encontrou a conta remetente" }) : next();

});

const middchecarExistenciacontadestina = ((req, res, next) => {

    let { numero_conta_destino } = req.body;

    const contasComNumero = bancodedados.contas.filter((conta) => conta.numero === Number(numero_conta_destino));
    return contasComNumero.length === 0 ? res.status(404).json({ mensagem: "O servidor não encontrou a conta do destinatário" }) : next();

});

const middverificarsenhaContaorigem = ((req, res, next) => {


    const { numero_conta_origem, senha } = req.body;


    const achar_conta = bancodedados.contas.filter((conta) => conta.numero === Number(numero_conta_origem));
    const { usuario } = achar_conta[0];

    if (senha !== Number(usuario.senha)) {
        return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" })
    }

    next();

});


const middverificarsaldotransferir = ((req, res, next) => {

    const { numero_conta_origem } = req.body;

    const achar_conta = bancodedados.contas.filter((conta) => conta.numero === Number(numero_conta_origem));
    const { saldo } = achar_conta[0];


    return Number(saldo) <= 0 ? res.status(400).json({ mensagem: "não há saldo disponível para saque" }) : next();
});

const middverificarSaldotransferirmaiormenor = ((req, res, next) => {

    const { numero_conta_origem, valor } = req.body;

    if (bancodedados.contas[numero_conta_origem - 1].saldo < valor) {
        return res.status(400).json({ mensagem: "Fundos insuficientes" })
    }

    next()
});

//-------------------------------Saldo--------------------------------------------------------

const tamanhoArraybanco = ((req, res, next) => {

    if (bancodedados.contas.length === 0) {
        return res.status(403).json({ mensagem: "Devido a uma Inconsistência, ou por falta de cadastros no sistema, não há conta cadastrada!" });
    }

    next();

});




const middverificarParamssaldo = ((req, res, next) => {

    const { numero_conta, senha } = req.query;


    if (!numero_conta || !senha) {
        console.log(req.params);
        return res.status(400).json({ mensagem: "O número da conta e a senha são campos obrigatórios!" });
    }

    next();

});


const middchecarExistenciacontasaldo = ((req, res, next) => {

    let { numero_conta } = req.query;

    const contasComNumero = bancodedados.contas.filter((conta) => conta.numero === Number(numero_conta));
    return contasComNumero.length === 0 ? res.status(404).json({ mensagem: "O servidor não encontrou o recurso solicitado" }) : next();

});


const middverificarSenhaurlsaldo = ((req, res, next) => {

    const { numero_conta, senha } = req.query;

    const achar_conta = bancodedados.contas.filter((conta) => conta.numero === Number(numero_conta));

    const { usuario } = achar_conta[0];


    return usuario.senha !== senha ? res.status(401).json({ mensagem: "A senha do banco informada é inválida!" }) : next();


});

//-----------------------Extrato--------------------------------------------------------------






//-------------------module.exports-------------------,

module.exports = {
    middVerificarsenha,
    middverificarformulario,
    middarrayVazio,
    middverificaURL,
    middvericarbodydados,
    middverificarCpfemail,
    middexluircontaIgualzero,
    middverificarContacash,
    middchecarExistenciaconta,
    middverificarsaldoEhigualzero,
    middverificarBodysacar,
    middverificarsenha,
    middverificarsaldo,
    middverificarBodytransferir,
    middchecarExistenciacontaorigem,
    middchecarExistenciacontadestina,
    middverificarsenhaContaorigem,
    middverificarsaldotransferir,
    middverificarSaldotransferirmaiormenor,
    middverificarParamssaldo,
    middchecarExistenciacontasaldo,
    middverificarSenhaurlsaldo,
    tamanhoArraybanco

}