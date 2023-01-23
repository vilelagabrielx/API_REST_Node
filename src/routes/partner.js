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

//bibliotecas para verificação do padrão GeoJSON
const { isMultiPolygon, isPoint } = require('geojson-validation');

// Importa o módulo 'AddPartner para inserir novos parceiros'
const AddPartner = require('../controllers/Partner/Addpartner');

// Importa o módulo 'AddPartner para buscar parceiros'
const GetPartner = require('../controllers/Partner/Getpartner');

const Deletepartner = require('../controllers/Partner/Deletepartner');

const UpdatePartner = require('../controllers/Partner/UpdatePartner');

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
      filename: 'log-%DATE%.txt',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '1d',
      dirname: 'logs',
      zippedArchive: true,
      maxDays: '1d',
    }),
  ],
});

// Cria uma rota para a URL raiz, que responde a requisições do tipo GET
router.get('/', (req, res) => {
  // Envia a mensagem "Olá, mundo!" como resposta à requisição
  res.send('Olá, mundo!');
});

// Cria uma rota POST para o caminho '/createapartner'
//Assim como solicitado no item 1.1.
// Essa rota espera um json no formato descrito no desafio
router.post('/createapartner', async (req, res) => {
  const { tradingName, ownerName, document, coverageArea, address } = req.body; // Extrai os valores do corpo da solicitação

  if (!tradingName || !ownerName || !document || !coverageArea || !address) {
    // Verifica se os valores foram fornecidos
    return res.status(400).send({ error: 'Dados incorretos ou incompletos' }); // Se algum dos valores estiver faltando, retorna um erro com o status HTTP 400
  } else if (
    !coverageArea.type ||
    !coverageArea.coordinates ||
    !address.type ||
    !address.coordinates
  ) {
    // Verifica se os objetos coverageArea e address têm os campos type e coordinates
    // Se algum desses campos estiver faltando, retorna um erro com o status HTTP 400
    return res
      .status(400)
      .send({
        error: 'Dados de coverageArea ou adress incorretos ou incompletos',
      });
  }
  // Se nenhum dos erros acima for disparado, retorna uma resposta de status HTTP 202
  else if (!isMultiPolygon(coverageArea)) {
    //caso as cordenadas de coverageArea não sigam o padrão MultiPolygon
    //retorno um erro
    res
      .status(400)
      .send({
        error: 'coverageArea deve seguir o padrão GeoJSON MultiPolygon',
      });
  } else if (!isPoint(address)) {
    res
      .status(400)
      .send({ error: 'address deve seguir o padrão GeoJSON Point' });
  } else {
    try {
      const partner = new AddPartner(
        tradingName,
        ownerName,
        document,
        coverageArea,
        address,
      );

      // Salva o parceiro no banco de dados
      const partnerId = await partner.savePartner();
      if (partnerId != 201) {
        res.status(400).send({ status: partnerId });
      } else {
        res.status(201).send({ status: 'inserido com sucesso' });
      }
      // Envia uma resposta de sucesso para o cliente
    } catch (error) {
      // Caso ocorra um erro ao tentar criar o parceiro, captura a exceção e envia uma resposta de erro para o cliente
      // Obtém a data e hora atual
      const now = moment();

      // Formata a data e hora atual como uma string no formato "dd/mm/yyyy hh:mm:ss"
      const date = now.format('dd/mm/yyyy hh:mm:ss');

      // Grava uma mensagem de erro no arquivo de log
      logger.info(
        `${date} - routes/partner.js - Erro ao tentar executar a inserção no banco de dados: ${error}`,
      );

      // Envia uma resposta de erro para o cliente
    }
  }
});

router.get('/getpartnerbyid/:id', async (req, res) => {
  const ID = req.params.id;
  try {
    const getPartner = new GetPartner(ID);
    let result = await getPartner.getPartnerByID(ID);
    if (result == false) {
      result = 'Nenhum parceiro com este ID';
      res.json(result);
    } else {
      res.json(result);
    }
  } catch (error) {
    res.json(error);
  }
});

router.post('/getnearestpartnerbycoordenates', async (req, res) => {
  const X = req.body['X'];
  const Y = req.body['Y'];

  try {
    const getPartner = new GetPartner();

    let result = await getPartner.getNearestPartnerByCOORDENATES(X, Y);

    if (result == false) {
      result = 'Nenhum parceiro Cobre a sua area';
      res.json(result);
    } else {
      res.json(result);
    }
  } catch (error) {
    res.json(error);
  }
});

router.get('/deleteapartner/:id', async (req, res) => {
  const ID = req.params.id;
  try {
    const deletepartner = new Deletepartner();

    let result = await deletepartner.DeletePartnerByID(ID);

    if (result == 0) {
      result = 'Nenhum parceiro com este ID';
      res.json(result);
    } else {
      rows = `${result} parceiro removidos`;
      res.json(rows);
    }
  } catch (error) {
    res.json(error);
  }
});

router.post('/updatepartner/:id', async (req, res) => {
  const ID = req.params.id;
  try {
    const getPartner = new GetPartner(ID);
    let result = await getPartner.getPartnerByID(ID);
    if (result == false) {
      result = 'Nenhum parceiro com este ID';
      res.json(result);
    } else {
      const { tradingName, ownerName, document, coverageArea, address } =
        req.body; // Extrai os valores do corpo da solicitação

      if (
        !tradingName ||
        !ownerName ||
        !document ||
        !coverageArea ||
        !address
      ) {
        // Verifica se os valores foram fornecidos
        return res
          .status(400)
          .send({ error: 'Dados incorretos ou incompletos' }); // Se algum dos valores estiver faltando, retorna um erro com o status HTTP 400
      } else if (
        !coverageArea.type ||
        !coverageArea.coordinates ||
        !address.type ||
        !address.coordinates
      ) {
        // Verifica se os objetos coverageArea e address têm os campos type e coordinates
        // Se algum desses campos estiver faltando, retorna um erro com o status HTTP 400
        return res
          .status(400)
          .send({
            error: 'Dados de coverageArea ou adress incorretos ou incompletos',
          });
      }
      // Se nenhum dos erros acima for disparado, retorna uma resposta de status HTTP 202
      else if (!isMultiPolygon(coverageArea)) {
        //caso as cordenadas de coverageArea não sigam o padrão MultiPolygon
        //retorno um erro
        res
          .status(400)
          .send({
            error: 'coverageArea deve seguir o padrão GeoJSON MultiPolygon',
          });
      } else if (!isPoint(address)) {
        res
          .status(400)
          .send({ error: 'address deve seguir o padrão GeoJSON Point' });
      } else {
        try {
          const partner = new UpdatePartner();

          // Salva o parceiro no banco de dados
          const partnerId = await partner.UpdatePartner(
            ID,
            tradingName,
            ownerName,
            document,
            coverageArea,
            address,
          );
          if (partnerId == false) {
            res.status(400).send({ status: partnerId });
          } else {
            res.status(201).send({ status: 'atualizado com sucesso' });
          }
          // Envia uma resposta de sucesso para o cliente
        } catch (error) {
          // Caso ocorra um erro ao tentar criar o parceiro, captura a exceção e envia uma resposta de erro para o cliente
          // Obtém a data e hora atual
          const now = moment();

          // Formata a data e hora atual como uma string no formato "dd/mm/yyyy hh:mm:ss"
          const date = now.format('dd/mm/yyyy hh:mm:ss');

          // Grava uma mensagem de erro no arquivo de log
          logger.info(
            `${date} - routes/partner.js - Erro ao tentar executar a inserção no banco de dados: ${error}`,
          );

          // Envia uma resposta de erro para o cliente
        }
      }
    }
  } catch (error) {
    res.json(error);
  }
});

module.exports = router; // Exporta o roteador de rotas
