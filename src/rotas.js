const express = require(`express`);
const middlwares = require("./controladores/middlwares")
const banco_control = require("./controladores/banco_control");
const bancodedados = require("./bancodedados");




const rotas = express();


//-----------------------------Listar contas bancárias----------------------------------------,

rotas.get('/contas', middlwares.middVerificarsenha, banco_control.liberar_lista_banco);

//-------------------------------Criar conta bancária------------------------------------------,

rotas.post('/contas', middlwares.middverificarformulario, banco_control.cadastrar_cliente);

//-------------------------Atualizar usuário da conta bancária---------------------------------,

rotas.put('/contas/:numeroConta/usuario', middlwares.middarrayVazio, middlwares.middverificaURL, middlwares.middvericarbodydados, middlwares.middverificarCpfemail, banco_control.atualizar_usuario);

//-------------------------Excluir Conta------------------------------------------------------,

rotas.delete('/contas/:numeroConta', middlwares.middverificaURL, middlwares.middexluircontaIgualzero, banco_control.excluir_usuario);

//----------------------------Depositar---------------------------------------------------------,

rotas.post('/transacoes/depositar', middlwares.middverificarContacash, middlwares.middchecarExistenciaconta, middlwares.middverificarsaldoEhigualzero, banco_control.depositarCash)

//----------------------------Sacar---------------------------------------------------------------,

rotas.post('/transacoes/sacar', middlwares.middverificarBodysacar, middlwares.middchecarExistenciaconta, middlwares.middverificarsenha, middlwares.middverificarsaldo, banco_control.sacar_control)

//--------------------------------------Tranferir------------------------------------------------,
rotas.post('/transacoes/transferir', middlwares.middverificarBodytransferir, middlwares.middchecarExistenciacontaorigem, middlwares.middchecarExistenciacontadestina, middlwares.middverificarsenhaContaorigem, middlwares.middverificarsaldotransferir, middlwares.middverificarSaldotransferirmaiormenor, banco_control.transferir_control)
//-----------------------------------saldo--------------------------------------------------------------,

rotas.get('/contas/saldo', middlwares.tamanhoArraybanco, middlwares.middverificarParamssaldo, middlwares.middchecarExistenciacontasaldo, middlwares.middverificarSenhaurlsaldo, banco_control.olhe_saldo)

//-----------------------Extrato--------------------------------------------------------------,

rotas.get('/contas/extrato', middlwares.middverificarParamssaldo, middlwares.middchecarExistenciacontasaldo, middlwares.middverificarSenhaurlsaldo, banco_control.liberar_extrato)

//----------------exportar.rotas----------------,
module.exports = rotas;

