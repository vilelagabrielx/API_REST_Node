const express = require('express'); // Importa o módulo 'express'
const winston = require('winston'); // Importa o módulo 'winston' para tratamento de logs
const DailyRotateFile = require('winston-daily-rotate-file');
const app = express(); // Cria uma instância do express
require('dotenv').config({ path: 'config/.env' });
const PORT = process.env.SERVER_PORT; // Define a porta em que a aplicação será executada
const routes = require('./src/routes/partner'); // Importa o módulo de rotas
// O módulo de rotas é um conjunto de rotas que foram definidas para lidar
//com requisições HTTP enviadas para uma determinada URL.

const moment = require('moment'); //importa a biblioteca de tratamento de tempos

const daysWithLog = process.env.DAYS_WITH_LOGS;

const path = require('path');

const fs = require('fs-extra');

function deleteOldFiles(pathtofolder) {
  // Define a data de ontem
  pathtofolder = process.cwd() + pathtofolder;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - daysWithLog);

  // Obtém a lista de todos os arquivos na pasta
  const files = fs.readdirSync(pathtofolder);

  // Percorre cada arquivo
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    // Obtém a data de modificação do arquivo
    const stat = fs.statSync(path.join(pathtofolder, file));
    const mtime = new Date(stat.mtime);
    console.log(mtime);
    // Verifica se o arquivo foi modificado antes de ontem
    if (mtime < yesterday) {
      // Verifica se é um arquivo de texto ou json
      if (file.endsWith('.txt') || file.endsWith('.json')) {
        // Apaga o arquivo
        fs.unlinkSync(path.join(pathtofolder, file));
      }
    }
  }
}

deleteOldFiles('\\logs');

// Configura o logger para gravar os logs em arquivos separados diariamente,
//além de imprimir os logs no console
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
      maxDays: '14d',
      cleanup: true,
    }),
  ],
});

//A linha app.use(express.json()) é usada para habilitar o middleware
//do express para parsing de JSON. Isso significa que, quando uma solicitação é
//feita com um corpo em formato JSON, o *middleware irá converter esse corpo em um objeto
//*Middleware é uma função que é executada entre a recepção de uma requisição
//e a execução da rota correspondente. Ele pode ser usado para modificar a requisição e a
//resposta, para validar os dados, para adicionar cabeçalhos ou para realizar outras tarefas
//que são comuns em uma aplicação web.
//JavaScript acessível através de req.body.
app.use(express.json()); // Habilita o uso de JSON na aplicação
// Utiliza as rotas importadas
app.use(routes); //diz para a aplicação do Express utilizar essas rotas
//que foram importadas. Isso significa que, quando uma requisição é
//enviada para a aplicação, ela será direcionada para as rotas importadas
//para que elas possam lidar com a requisição e enviar uma resposta adequada de volta.
// Inicia o servidor na porta definida e exibe uma mensagem no console

app.listen(PORT, () => {
  // Cria uma instância do moment, que é usado para obter a data e hora atual
  const agora = moment();

  // Formata a data e hora atual como uma string no formato "dd/mm/yyyy hh:mm:ss"
  const data = agora.format('dd/mm/yyyy hh:mm:ss');

  logger.info(`${data} - API iniciada com sucesso na porta ${PORT}`); // Grava uma mensagem de informação no arquivo de log
  //informando que a API foi iniciada com sucesso na porta especificada
});
