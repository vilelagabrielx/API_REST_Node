// Importa o módulo 'express'
const express = require('express');

// Importa o módulo 'winston' para tratamento de logs
const winston = require('winston');

// Importa o módulo 'winston-daily-rotate-file' para criar arquivos de log diariamente
const DailyRotateFile = require('winston-daily-rotate-file');

// Importa o módulo 'moment' para tratamento de datas
const moment = require('moment');

// Cria uma instância de um roteador de rotas do express
const router = express.Router();

const logger = winston.createLogger({
  level: 'info', //nivel de log

  transports: [

  new winston.transports.Console(), // cria uma nova instância de 
                                    //um transporte de log para o winston, 
                                    //especificamente um transporte de log para a consola (terminal). Isso significa que, quando o logger é usado para gravar mensagens, as mensagens serão exibidas na consola (terminal) também


// é necessário instanciar o módulo winston e o DailyRotateFile juntos para que o 
//winston possa utilizar as funcionalidades do DailyRotateFile para rotacionar os arquivos de 
//log diariamente.
                             
  new DailyRotateFile({

  filename: 'log-%DATE%.txt', //nome do arquivo

  datePattern: 'YYYY-MM-DD', //formato da data

  maxSize: '20m', //tamanho maximo

  maxFiles: '2d' //dias de armazenamento de log
                      })
              ]
});

// Importa o módulo 'Partner'
const Partner = require('../controllers/partner');

// Cria uma rota para a URL raiz, que responde a requisições do tipo GET
router.get('/', (req, res) => {
// Envia a mensagem "Olá, mundo!" como resposta à requisição
    res.send('Olá, mundo!');
});

// Cria uma rota POST para o caminho '/createapartner'
//Assim como solicitado no item 1.1.
// Essa rota espera um json no formato descrito no desafio
router.post('/createapartner', async(req, res) => {
    const {tradingName, ownerName, document, coverageArea, address } = req.body;  // Extrai os valores do corpo da solicitação

    
    if (!tradingName || !ownerName || !document || !coverageArea || !address) { // Verifica se os valores foram fornecidos
      
      return res.status(400).send({ error: 'Dados incorretos ou incompletos' }); // Se algum dos valores estiver faltando, retorna um erro com o status HTTP 400
    }
   
    if (!coverageArea.type || !coverageArea.coordinates || !address.type || !address.coordinates) {  // Verifica se os objetos coverageArea e address têm os campos type e coordinates
      // Se algum desses campos estiver faltando, retorna um erro com o status HTTP 400
      return res.status(400).send({ error: 'Dados de coverageArea ou adress incorretos ou incompletos' });
    }
    // Se nenhum dos erros acima for disparado, retorna uma resposta de status HTTP 202
    else{
      try {
  
        const partner = new Partner(tradingName, ownerName, document, coverageArea, address);
        
        // Salva o parceiro no banco de dados
        const partnerId = await partner.savePartner();
        if(partnerId != 201){
          res.status(400).send({ status: partnerId});
        }else{
          res.status(201).send({ status: 'inserido com sucesso' });
        }
        // Envia uma resposta de sucesso para o cliente
        
      }
      // Caso ocorra um erro ao tentar criar o parceiro, captura a exceção e envia uma resposta de erro para o cliente
      catch (error) {
        // Obtém a data e hora atual
        const now = moment();
      
        // Formata a data e hora atual como uma string no formato "dd/mm/yyyy hh:mm:ss"
        const date = now.format('dd/mm/yyyy hh:mm:ss');
      
        // Grava uma mensagem de erro no arquivo de log
        logger.info(`${date} - routes/partner.js - Erro ao tentar executar a inserção no banco de dados: ${error}`);
      
        // Envia uma resposta de erro para o cliente
        
      }
       
}
});
  
module.exports = router; // Exporta o roteador de rotas